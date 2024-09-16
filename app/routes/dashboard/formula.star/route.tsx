import React, { useEffect, useId, useState } from "react"
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
import { BookOutlined, CopyOutlined } from "@ant-design/icons"
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
import { Button as AntButton, Flex, Tag, Tooltip } from "antd"
import { ScanText } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { z } from "zod"

import { validateCsrfToken } from "@/lib/server/csrf.server"
import { mergeMeta } from "@/lib/server/seo/seo-helpers"
import { authenticator } from "@/services/auth.server"
import checkExecutionStatus from "@/services/aws/checkExecutionStatus"
import { getAllCategoriesActive } from "@/models/category"
import { getFeatureByKeyname } from "@/models/feature"
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
  return [{ title: "Gerar Conteúdo com a Fórmula STAR" }]
})

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)

  const project = url.searchParams.get("p")
  const selectedCategory = url.searchParams.get("c")

  const categories = await getAllCategoriesActive()
  let feature = await getFeatureByKeyname("STAR")
  feature = feature[0]

  return {
    project,
    selectedCategory,
    categories,
    feature,
  }
}
export const action = async ({ request }: ActionFunctionArgs) => {
  await validateCsrfToken(request)
  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()

  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  console.log("generating content with formula star")
  const submission = await parse(formData, {
    schema: schema.superRefine(async (data, ctx) => {}),
    async: true,
  })

  if (!submission.value || submission.intent !== "submit") {
    return json(submission)
  }

  const { situation, brandname, task, action, result } = submission.value

  // Configurar o cliente SFN e iniciar a Step Function
  const client = new SFNClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    },
  })

  const command = new StartExecutionCommand({
    stateMachineArn: process.env.REACT_APP_AWS_SFN_ARN,
    input: JSON.stringify({
      event_type: "process-copywriting-star",
      timestamp: Date.now().toString(),
      data: { situation, brand_name: brandname, task, action, result },
    }),
  })

  console.log("iniciando a execução da Step Function")
  try {
    const data = await client.send(command)
    console.log("Resultado da execução da Step Function:", data)
    const response = { ...submission, executionArn: data.executionArn }

    return json(response)
  } catch (error) {
    console.error("Erro ao iniciar a execução da Step Function:", error)
    return json({ ...submission, error: error.message }, { status: 500 })
  }
}

const schema = z.object({
  brandname: z.string({
    required_error: "Por favor, entre com o nome da marca ou do seu negócio",
  }),
  situation: z.string({
    required_error: "Por favor, defina a situação para continuar",
  }),
  action: z.string({
    required_error: "Por favor, explique a ação a ser tomada",
  }),
  task: z.string({
    required_error:
      "Por favor, informe a necessidade especifica a ser atendida",
  }),
  result: z.string({
    required_error: "Por favor, informe o benefício alcançado",
  }),
})

export default function FormulaPage() {
  const [executionResult, setExecutionResult] = useState(null)
  const { project, feature, categories, selectedCategory } =
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

  const [form, { brandname, situation, task, action, result }] = useForm({
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
      <div className="mx-auto max-w-7xl px-6 lg:px-2">
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
                        <Label htmlFor="situation">
                          Defina a situação para o seu público-alvo
                        </Label>
                        <div className="mt-2">
                          <Input
                            error={situation.error}
                            id="situation"
                            type="text"
                            placeholder="Em uma cidade movimentada, Entrega atrasada, Atividades inseguras"
                            {...conform.input(situation, { type: "text" })}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="task">Ação a ser tomada</Label>
                        </div>
                        <div className="mt-2">
                          <Input
                            error={task.error}
                            id="task"
                            type="text"
                            placeholder="Explique as ações tomadas para resolver o problema"
                            {...conform.input(task, { type: "text" })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full space-y-6">
                      <div>
                        <Label htmlFor="action">
                          Descreva a necessidade específica a ser atendida
                        </Label>
                        <div className="mt-2">
                          <Input
                            error={action.error}
                            id="action"
                            type="text"
                            placeholder="Aumente o tráfego do site em 30%, melhore a satisfação do cliente"
                            {...conform.input(action, { type: "text" })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="result">
                          Destacar os benefícios alcançados com as ações
                        </Label>
                        <div className="mt-2">
                          <Input
                            error={result.error}
                            id="result"
                            type="text"
                            placeholder="Melhor envolvimento do cliente, receita de vendas, clientes satisfeitos"
                            {...conform.input(result, { type: "text" })}
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
                  <Flex wrap gap="small">
                    <Tooltip title="Copiar Contéudo para o área de transferência">
                      <AntButton
                        disabled={!executionResult}
                        type="default"
                        icon={<CopyOutlined />}
                      >
                        Copiar
                      </AntButton>
                    </Tooltip>

                    <Tooltip title="Salvar Contéudo">
                      <AntButton
                        disabled={!executionResult}
                        type="primary"
                        icon={<BookOutlined />}
                      >
                        Salvar
                      </AntButton>
                    </Tooltip>
                  </Flex>
                </Flex>

                {executionResult ? (
                  <ReactMarkdown>
                    {JSON.parse(executionResult).event}
                  </ReactMarkdown>
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
          <NavLink
            to={"/dashboard/project/" + project}
            className="m-6 rounded-lg border-slate-300 px-6 py-2 text-left hover:border-solid"
          >
            Voltar
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export function ErrorBoundary() {
  return <CommonErrorBoundary />
}
