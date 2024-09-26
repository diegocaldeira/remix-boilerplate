import { useEffect, useId, useState } from "react"
import { json } from "@remix-run/node"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import {
  Form,
  NavLink,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react"
import type { MetaFunction } from "@remix-run/react"
import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn"
import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { ReloadIcon } from "@radix-ui/react-icons"
import { Flex, Tag } from "antd"
import { ScanText } from "lucide-react"
import slugify from "react-slugify"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { z } from "zod"

import { validateCsrfToken } from "@/lib/server/csrf.server"
import { mergeMeta } from "@/lib/server/seo/seo-helpers"
import { authenticator } from "@/services/auth.server"
import checkExecutionStatus from "@/services/aws/checkExecutionStatus"
import { prisma } from "@/services/db/db.server"
import { getAllCategoriesActive } from "@/models/category"
import { getFeatureByKeyname } from "@/models/feature"
import BookmarkContent from "@/components/collection/bookmark-content"
import { CommonErrorBoundary } from "@/components/error-boundry"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}

export const meta: MetaFunction = mergeMeta(() => {
  return [{ title: "Gerar Conteúdo com a Fórmula PAS" }]
})

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
  const url = new URL(request.url)

  const project = url.searchParams.get("p")
  const selectedCategory = url.searchParams.get("c")

  const categories = await getAllCategoriesActive()
  let feature = await getFeatureByKeyname("PAS")
  feature = feature[0]

  return {
    session,
    project,
    selectedCategory,
    categories,
    feature,
  }
}

const saveContent = async (
  project_id: string,
  content: string,
  feature_id: string,
  category_id: string,
  session_id: string
) => {
  try {
    await prisma.contentGenerated.create({
      data: {
        keyname: slugify(content.slice(0, 30)),
        name: content.slice(0, 30) + "...",
        icon: "",
        title: content.slice(0, 30) + "...",
        content: content,
        description: content.slice(0, 100) + "...",
        userId: session_id,
        toolId: feature_id,
        categoryId: category_id,
        projectId: project_id,
        isActive: true,
      },
    })
  } catch (error) {
    console.error("Erro ao salvar o conteúdo:", error)
    throw new Response("Erro ao salvar conteúdo", { status: 500 })
  }
}

const bookmarkSchema = z.object({
  project_id: z.string({
    required_error: "Por favor, entre com o código de verificação",
  }),
  feature_id: z.string({
    required_error: "Por favor, entre com o código de verificação",
  }),
  category_id: z.string({
    required_error: "Por favor, entre com a categoria",
  }),
  session_id: z.string({
    required_error: "Por favor, entre com o código de sessão",
  }),
  content: z.string({
    required_error: "Por favor, entre com o conteúdo",
  }),
})

type FormDataType = {
  intent: "generateContent" | "savingContent"
} & z.infer<typeof schema> &
  z.infer<typeof bookmarkSchema>

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("entrando no action")

  await validateCsrfToken(request)

  const clonedRequest = request.clone()

  const formData = Object.fromEntries(
    await clonedRequest.formData()
  ) as unknown as FormDataType

  switch (formData.intent) {
    case "generateContent":
      await schema.superRefine(async (data, ctx) => {}).safeParseAsync(formData)

      console.log("generating content with formula PAS")

      if (
        !process.env.REACT_APP_AWS_ACCESS_KEY_ID ||
        !process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
      ) {
        throw new Error("AWS access key ID and secret access key are required")
      }

      const client = new SFNClient({
        region: "us-east-1",
        credentials: {
          accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        },
      })

      const { brandname, description, problem, agitate, solution } = formData

      const command = new StartExecutionCommand({
        stateMachineArn: process.env.REACT_APP_AWS_SFN_ARN,
        input: JSON.stringify({
          event_type: "process-copywriting-fab",
          timestamp: Date.now().toString(),
          data: {
            brand_name: brandname,
            description,
            problem,
            agitate,
            solution,
          },
        }),
      })

      console.log("iniciando a execução da Step Function")
      try {
        const data = await client.send(command)
        const response = { ...formData, executionArn: data.executionArn }

        console.log("Resultado da execução da Step Function:", response)
        return json(response)
      } catch (error: any) {
        console.error("Erro ao iniciar a execução da Step Function:", error)
        return json({ ...formData, error: error.message }, { status: 500 })
      }
    case "savingContent":
      console.log("saving content with formula PAS")
      await saveContent(
        formData.project_id,
        formData.content,
        formData.feature_id,
        formData.category_id,
        formData.session_id
      )
      return json({ verified: true })
    default:
      break
  }

  authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
}

const schema = z.object({
  brandname: z.string({
    required_error: "Por favor, entre com o nome da marca ou do seu negócio",
  }),
  description: z.string({
    required_error:
      "Por favor, conte nos um pouco sobre a sua marca ou do seu negócio",
  }),
  problem: z.string({
    required_error:
      "Por favor, informe o problema enfrentado pelo seu público-alvo",
  }),
  agitate: z.string({
    required_error:
      "Por favor, informe quais os impactos negativos do problema a ser atendido",
  }),
  solution: z.string({
    required_error:
      "Por favor, explique como seu produto resolve ou serviço resolve o problema",
  }),
})

export default function FormulaPage() {
  const [executionResult, setExecutionResult] = useState(null)
  const { session, project, feature, categories, selectedCategory } =
    useLoaderData<typeof loader>()
  const lastSubmission = useActionData<typeof action>()
  const id = useId()

  useEffect(() => {
    if (lastSubmission?.executionArn) {
      checkExecutionStatus(lastSubmission.executionArn, setExecutionResult)
    }
  }, [lastSubmission, setExecutionResult])

  const navigation = useNavigation()
  const isFormSubmitting = navigation.state === "submitting"
  const isSigningUpWithsituation = isFormSubmitting

  const [form, { brandname, description, problem, agitate, solution }] =
    useForm({
      id,
      lastSubmission,
      shouldValidate: "onBlur",
      shouldRevalidate: "onInput",
      onValidate({ formData }) {
        return parse(formData, { schema })
      },
    })

  return (
    <div>
      <div className="mx-auto max-w-7xl px-2">
        <Disclosure
          key="tools"
          as="div"
          className="rounded-lg p-2 shadow-none md:border md:border-dashed md:border-slate-300 md:shadow-xl lg:p-16 lg:p-7"
          defaultOpen={true}
        >
          <DisclosureButton className="group flex w-full items-start justify-between text-left">
            <header id="header" className="relative z-20">
              <div>
                <p className="mb-2 text-sm font-semibold leading-6 text-sky-500 dark:text-sky-400">
                  AI Copywriting
                </p>
                <div className="flex items-center">
                  <h1 className="inline-block text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-3xl">
                    {feature.name}
                  </h1>
                </div>
              </div>
              <p
                className="mt-2 text-lg text-slate-700 dark:text-slate-400"
                dangerouslySetInnerHTML={{ __html: feature.description }}
              />
            </header>
            <ChevronDownIcon className="size-12 fill-transparent/80 group-data-[open]:rotate-180 group-data-[hover]:fill-transparent/50 dark:from-white dark:to-[hsla(0,0%,100%,.5)]" />
          </DisclosureButton>
          <DisclosurePanel className="isolate mx-auto text-sm/5 leading-6">
            <div className="w-full pb-10">
              <div className="wrap-balance mt-4 w-full max-w-lg divide-y divide-white/5 rounded-xl bg-black bg-gradient-to-br bg-clip-text text-left text-sm/6 font-medium leading-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:leading-tight">
                {feature.listOfFeatures.map((item) => {
                  return (
                    <Disclosure
                      key={item.id}
                      as="div"
                      className="py-3"
                      defaultOpen={false}
                    >
                      <DisclosureButton className="group flex w-full items-center justify-between">
                        <span className="wrap-balance mt-4 bg-black bg-gradient-to-br bg-clip-text text-left text-sm/6 font-medium leading-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:leading-tight">
                          {item.name}
                        </span>
                        <ChevronDownIcon className="size-5 fill-transparent/80 group-data-[open]:rotate-180 group-data-[hover]:fill-transparent/50 dark:from-white dark:to-[hsla(0,0%,100%,.5)]" />
                      </DisclosureButton>
                      <DisclosurePanel className="mt-2 text-sm/5 leading-6">
                        <p
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                      </DisclosurePanel>
                    </Disclosure>
                  )
                })}
              </div>
            </div>
            <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 text-left md:max-w-7xl md:grid-cols-2 lg:grid-cols-2">
              <div className="border-secondary-600 mt-10 w-full rounded-xl border-dashed shadow-none sm:mx-auto sm:p-1 md:border md:shadow-xl lg:p-7">
                <Form className="h-full w-full" method="post" {...form.props}>
                  <AuthenticityTokenInput />
                  <input
                    type="hidden"
                    name="intent"
                    defaultValue="generateContent"
                  />
                  <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-7xl lg:grid-cols-1">
                    <div className="w-full space-y-6">
                      <div>
                        <Label htmlFor="brandname">Marca/Negócio</Label>
                        <div className="mt-2">
                          <Input
                            error={brandname.error}
                            id="brandname"
                            type="text"
                            placeholder="Entre com o nome da marca ou do seu negócio"
                            required
                            {...conform.input(brandname, { type: "text" })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">
                          Descreva o que sua marca/empresa faz? (Em 5 a 6
                          palavras)
                        </Label>
                        <div className="mt-2">
                          <Input
                            error={description.error}
                            id="description"
                            type="text"
                            placeholder=""
                            {...conform.input(description, { type: "text" })}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="problem">
                            Identifique um problema enfrentado pelo seu
                            público-alvo
                          </Label>
                        </div>
                        <div className="mt-2">
                          <Input
                            error={problem.error}
                            id="problem"
                            type="text"
                            placeholder="Exemplo: 'Luta para encontrar habitação acessível'"
                            {...conform.input(problem, { type: "text" })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="agitate">Destaque o problema</Label>
                        <div className="mt-2">
                          <Input
                            error={agitate.error}
                            id="agitate"
                            type="text"
                            placeholder="Destaque o impacto negativo do problema"
                            {...conform.input(agitate, { type: "text" })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="solution">
                          Apresente seu produto ou serviço como a solução
                        </Label>
                        <div className="mt-2">
                          <Input
                            error={solution.error}
                            id="solution"
                            type="text"
                            placeholder="Explique como seu produto ou serviço resolve o problema"
                            {...conform.input(solution, { type: "text" })}
                          />
                        </div>
                      </div>

                      <div className="w-full space-y-6">
                        <Button
                          disabled={isSigningUpWithsituation}
                          className="isolate grid h-full max-w-md auto-cols-max grid-flow-col grid-cols-2 justify-items-start rounded-lg border-slate-300 text-left hover:border-solid hover:bg-rose-500"
                          type="submit"
                        >
                          <ScanText className="h-5 w-5" />
                          {isSigningUpWithsituation && (
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Escrever
                        </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>

              <div className="border-secondary-600 mt-10 w-full rounded-xl border border-dashed p-7 shadow-xl sm:mx-auto">
                <Flex gap="small" vertical className="mb-10">
                  <Flex className="my-2 lg:mb-0" gap="8px 0" wrap>
                    {selectedCategory && (
                      <p className="pb-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        Seus conteúdos serão organizados em
                        <Tag color="default" className="mx-2">
                          {" "}
                          {
                            categories.filter(
                              (category) =>
                                category.keyname === selectedCategory
                            )[0].name
                          }{" "}
                        </Tag>
                        e o conteúdo atual será gerado com a ferramenta de
                        <Tag color="default" className="mx-2">
                          Copywriting
                        </Tag>
                      </p>
                    )}
                  </Flex>
                </Flex>

                {executionResult ? (
                  <BookmarkContent
                    project={project}
                    content={JSON.parse(executionResult).event}
                    feature={feature.keyname}
                    category={selectedCategory}
                    session={session.id}
                  />
                ) : (
                  lastSubmission?.executionArn && (
                    <div>Aguardando o resultado da execução...</div>
                  )
                )}
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>

        <div
          style={{
            marginTop: 34,
          }}
        >
          <p className="flex-grow pb-12 pt-3 text-sm text-muted-foreground">
            <NavLink
              to={"/dashboard/project/" + project}
              className="my-10 rounded-lg border-slate-300 py-2 text-left hover:border-solid"
            >
              <Button size="sm" variant="link" className="px-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="mr-3 size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Voltar
              </Button>
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  )
}

export function ErrorBoundary() {
  return <CommonErrorBoundary />
}
