import React, { useEffect, useId, useState } from "react"
import { json, redirect } from "@remix-run/node"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react"
import type { MetaFunction } from "@remix-run/react"
import {
  DescribeExecutionCommand,
  SFNClient,
  StartExecutionCommand,
} from "@aws-sdk/client-sfn"
import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { ReloadIcon } from "@radix-ui/react-icons"
import ReactMarkdown from "react-markdown"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { z } from "zod"

import { validateCsrfToken } from "@/lib/server/csrf.server"
import { mergeMeta } from "@/lib/server/seo/seo-helpers"
import { authenticator } from "@/services/auth.server"
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
  return [{ title: "Gerar Conteúdo com a Fórmula AIDPPC" }]
})

export const loader = async ({ params }: LoaderFunctionArgs) => {
  let feature = await getFeatureByKeyname("AIDPPC")
  feature = feature[0]

  return {
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

  console.log("generating content with formula AIDPPC")
  const submission = await parse(formData, {
    schema: schema.superRefine(async (data, ctx) => {}),
    async: true,
  })

  if (!submission.value || submission.intent !== "submit") {
    return json(submission)
  }

  const { brandname, description, interest, close } = submission.value

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
      event_type: "process-copywriting-aidppc",
      timestamp: Date.now().toString(),
      data: { brand_name: brandname, description, interest, close },
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

const checkExecutionStatus = async (executionArn, setExecutionResult) => {
  const client = new SFNClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    },
  })

  const describeCommand = new DescribeExecutionCommand({ executionArn })

  try {
    const data = await client.send(describeCommand)
    console.log("Execution status:", data.status)

    if (data.status === "SUCCEEDED") {
      console.log("Execution succeeded:", data.output)
      setExecutionResult(data.output) // Atualiza o estado com o resultado final
    } else if (["FAILED", "TIMED_OUT", "ABORTED"].includes(data.status)) {
      console.error("Execution did not succeed:", data.status)
      setExecutionResult(`Execution failed with status: ${data.status}`)
    } else {
      console.log("Execution is still running...")
      setTimeout(
        () => checkExecutionStatus(executionArn, setExecutionResult),
        5000
      )
    }
  } catch (error) {
    console.error("Error describing execution:", error)
    setExecutionResult(`Error fetching execution status: ${error.message}`)
  }
}

const schema = z.object({
  brandname: z.string({
    required_error: "Por favor, entre com o nome da marca ou do seu negócio",
  }),
  description: z.string({
    required_error:
      "Por favor, conte nos um pouco sobre a sua marca ou do seu negócio",
  }),
  interest: z.string({
    required_error:
      "Por favor, gere interesse destacando os benefícios ou resolvendo um problema para o seu público-alvo",
  }),
  close: z.string({
    required_error:
      "Por favor, estimule o público a dar a etapa final, como fazer uma compra ou inscrever-se",
  }),
})

export default function FormulaPage() {
  const [executionResult, setExecutionResult] = useState(null)
  const { feature } = useLoaderData<typeof loader>()
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

  const [form, { brandname, description, interest, close }] = useForm({
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
        <div className="max-w-4xl text-left">
          <h1 className="wrap-balance mt-16 bg-black bg-gradient-to-br bg-clip-text text-left text-4xl font-medium leading-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:text-5xl sm:leading-tight">
            {feature.name}
          </h1>
        </div>

        <p
          className="wrap-balance mt-6 text-left text-lg font-light leading-6 text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: feature.description }}
        />

        <div className="w-full pb-10">
          <div className="wrap-balance mx-auto mt-4 w-full max-w-lg divide-y divide-white/5 rounded-xl bg-black bg-gradient-to-br bg-clip-text text-left text-sm/6 font-medium leading-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:leading-tight">
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
                    <p dangerouslySetInnerHTML={{ __html: item.description }} />
                  </DisclosurePanel>
                </Disclosure>
              )
            })}
          </div>
        </div>

        <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-14 lg:max-w-7xl lg:grid-cols-2">
          <div className="mt-10 w-full sm:mx-auto">
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
                    <Label htmlFor="description">
                      Descreva o que sua empresa faz? ** (Em 2 a 3 palavras)
                    </Label>
                    <div className="mt-2">
                      <Input
                        error={description.error}
                        id="description"
                        type="text"
                        placeholder="Descreva brevemente seu produto ou serviço."
                        {...conform.input(description, { type: "text" })}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="interest">
                        Gerar interesse (descreva seus serviços)
                      </Label>
                    </div>
                    <div className="mt-2">
                      <Input
                        error={interest.error}
                        id="interest"
                        type="text"
                        placeholder="Economize tempo, comodidade, preço acessível, melhor atendimento, em minutos, segurança..."
                        {...conform.input(interest, { type: "text" })}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full space-y-6">
                  <div>
                    <Label htmlFor="close">
                      Ação imediata ** (call to action-CTA)
                    </Label>
                    <div className="mt-2">
                      <Input
                        error={close.error}
                        id="close"
                        type="text"
                        placeholder="Compre / Reserve / Experimente agora, Inscreva-se, Experimente gratuitamente, Ofertas antecipadas, Venda ..."
                        {...conform.input(close, { type: "text" })}
                      />
                    </div>
                  </div>

                  <Button
                    disabled={isSigningUpWithsituation}
                    className="w-full"
                    type="submit"
                  >
                    {isSigningUpWithsituation && (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Gerar
                  </Button>
                </div>
              </div>
            </Form>
          </div>

          <div className="mt-10 w-full bg-secondary p-7 sm:mx-auto">
            {executionResult ? (
              <ReactMarkdown>{JSON.parse(executionResult).event}</ReactMarkdown>
            ) : (
              lastSubmission?.executionArn && (
                <div>Aguardando o resultado da execução...</div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ErrorBoundary() {
  return <CommonErrorBoundary />
}
