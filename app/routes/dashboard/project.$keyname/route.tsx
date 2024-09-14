import React, { useState } from "react"
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node"
import { Form, NavLink, useHref, useLoaderData } from "@remix-run/react"
import type { MetaFunction } from "@remix-run/react"
import { parse } from "@conform-to/zod"
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react"
import {
  ChevronDoubleRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid"
import { Button as AntButton, Flex, message, Steps, Tag, theme } from "antd"
import { NotebookPen, ScanText, Webhook } from "lucide-react"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { z } from "zod"

import { validateCsrfToken } from "@/lib/server/csrf.server"
import { mergeMeta } from "@/lib/server/seo/seo-helpers"
import { authenticator } from "@/services/auth.server"
import { prisma } from "@/services/db/db.server"
import { getAllCategoriesActive } from "@/models/category"
import { getAllFeatures } from "@/models/feature"
import { getProjectByUserIdAndKeyname } from "@/models/project"
import { getSubscriptionByUserId } from "@/models/subscription"
import { CTAContainer, PricingCard } from "@/components/pricing/containers"
import { FeatureDescription, FeatureTitle } from "@/components/pricing/feature"
import { Button } from "@/components/ui/button"

const steps = [
  {
    title: "Organize seus Conteúdos",
  },
  {
    title: "Escolha sua Ferramentas de IA",
  },
  {
    title: "Tipo de Conteúdo",
  },
]

declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  const subscription = await getSubscriptionByUserId(session.id)

  const features = await getProjectByUserIdAndKeyname(
    params.keyname as string,
    session.id
  )

  const categories = await getAllCategoriesActive()
  let copywritingCards = await getAllFeatures()

  return {
    categories,
    features,
    subscription,
    copywritingCards,
  }
}

export const meta: MetaFunction = mergeMeta(
  // these will override the parent meta
  () => {
    return [{ title: "Detalhes do Projeto" }]
  }
)

const schema = z.object({
  project: z.string({
    required_error: "Por favor, entre com o nome do seu projeto.",
  }),
  category: z.string().optional(),
  //   z.string({
  //   required_error: "Por favor, selecione o contêiner de escrita que você deseja utilizar",
  // }),
  tool: z.string().optional(),
  // z.string({
  //   required_error: "Por favor, selecione a ferramenta de escrita que você deseja utilizar",
  // }),
  copywritingFormula: z.string().optional(),
  //   z.string({
  //   required_error: "Por favor, selecione a fórmula de copywriting",
  // }),
})

export const action = async ({ request }: ActionFunctionArgs) => {
  // const [current, setCurrent] = useState(0)
  await validateCsrfToken(request)

  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()

  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  const submission = await parse(formData, {
    schema: schema.superRefine(async (data: any) => {
      return await prisma.project.findFirst({
        where: {
          name: data.project,
          userId: session.id,
        },
        select: { id: true },
      })
    }),
    async: true,
  })

  if (!submission.value || submission.intent !== "submit") {
    console.log("sumbission: ", submission)
    return json(submission)
  } else {
    console.log("selecting project with id: " + submission.value.project)
    console.log("selecting category with id: " + submission.value.category)
    console.log("selecting tool with id: " + submission.value.tool)
    console.log(
      "selecting copywriting with id: " + submission.value.copywritingFormula
    )
  }

  return redirect("/dashboard/project/" + submission.value.project)
}

const aiToolsOptions = [
  {
    label: "AI Writers",
    value: "ai-writers",
    description:
      "Escritores de IA especializados e focados em seu negócio, economize tempo, esforço e aumente a produtividade.",
  },
  {
    label: "AI Copywriting",
    value: "ai-copywriting",
    description:
      "Transforme suas ideias em conteúdo de marketing cativante sem esforço, crie textos atraentes com facilidade.",
  },
  {
    label: "AI Social",
    value: "ai-social",
    description:
      "O futuro do marketing de mídia social. Crie postagens e legendas sem esforço e eleve sua presença nas redes sociais.",
    disabled: false,
  },
]

export default function ProjectsPage() {
  const [selectedAITool, selectAITool] = React.useState("")
  const [selectedCategory, selectCategory] = React.useState("")

  const { categories, features, copywritingCards } =
    useLoaderData<typeof loader>()

  const { token } = theme.useToken()
  const [current, setCurrent] = useState(0)

  const startGenerator = (project: string, type: string) => {
    console.log("project with id: " + project)
    console.log("category with id: " + selectedCategory)
    console.log("tool with id: " + selectedAITool)
    console.log("copywriting with id: " + type)
  }

  const next = () => {
    setCurrent(current + 1)
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }))

  const contentStyle = {
    lineHeight: "260px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  }

  return (
    <div className="">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="inset-0 z-10 h-full w-full [mask-image:radial-gradient(100%_100%_at_top_right,black,transparent)] dark:[mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      >
        <defs>
          <pattern
            id="a"
            width={20}
            height={20}
            patternTransform="scale(10)"
            patternUnits="userSpaceOnUse"
          >
            <rect width="100%" height="100%" fill="hsla(0, 0%, 100%, 0)" />
            <path
              fill="none"
              stroke="hsla(259, 0%, 100%, 0.08)"
              strokeWidth={0.1}
              d="M10 0v20ZM0 10h20Z"
              className="dark:text-[hsla(259, 0%, 100%, 0.08)] stroke-current text-border"
            />
          </pattern>
        </defs>
        <rect
          width="800%"
          height="800%"
          fill="url(#a)"
          transform="translate(-108)"
        />
      </svg>
      {features.map((feature) => {
        return (
          <div key={feature.id} className="mx-auto max-w-7xl lg:px-8">
            <div className="mx-auto max-w-7xl px-4 lg:px-8 lg:pb-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="w-full max-w-xl xl:max-w-2xl">
                  <h1 className="font-ivyora-display bg-black bg-gradient-to-br bg-clip-text text-4xl tracking-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] md:text-7xl lg:text-7xl">
                    <b>
                      Detalhamento Estratégico
                      <span className="relative ml-2 inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-pink-500 md:text-6xl lg:text-6xl">
                        <span className="relative text-white">
                          {" "}
                          {feature.name}
                        </span>
                      </span>
                    </b>
                  </h1>
                  <p className="font-ivyora-display relative mt-6 bg-black bg-gradient-to-br bg-clip-text text-lg leading-8 text-gray-600 text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:max-w-md lg:max-w-none">
                    Vamos explorar em profundidade as estratégias e conteúdos
                    criados. Veja como cada elemento do projeto contribui para
                    fortalecer a presença da sua marca e aumentar a confiança do
                    público.
                  </p>
                </div>
                <div className="mt-10 flex justify-end gap-8 sm:justify-start lg:mt-0 lg:pl-0">
                  <div className="ml-auto hidden w-2/4 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 md:block lg:order-last lg:block lg:pt-36 xl:order-none xl:pt-80">
                    <div className="relative">
                      <NavLink to="/dashboard/copywriting">
                        <div className="rounded-lg bg-white p-10 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900">
                          <div>
                            <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 text-white shadow-lg">
                              <ScanText />
                            </span>
                          </div>
                          <h1 className="mt-5 text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                            AI Copywriting
                          </h1>
                          <p className="mt-2 hidden text-sm text-slate-500 dark:text-slate-400 md:block lg:block">
                            Transforme suas ideias em conteúdo de marketing
                            cativante sem esforço, nossas poderosas ferramentas
                            de IA estão aqui para ajudá-lo a criar textos
                            atraentes com facilidade.
                          </p>
                        </div>
                      </NavLink>
                      <div className="pointer-events-none absolute inset-0 rounded-xl"></div>
                    </div>
                  </div>

                  <div className="mr-auto hidden w-2/4 flex-none space-y-8 sm:mr-0 sm:pt-52 md:block lg:block lg:pt-36">
                    <div className="relative">
                      <NavLink to="/dashboard/ai-writers">
                        <div className="rounded-lg bg-white p-10 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900">
                          <div>
                            <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 text-white shadow-lg">
                              <NotebookPen />
                            </span>
                          </div>
                          <h1 className="mt-5 text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                            AI Writers
                          </h1>
                          <p className="mt-2 hidden text-sm text-slate-500 dark:text-slate-400 md:block lg:block">
                            Escritores de IA especializados e focados em seu
                            negócio, nossa ferramenta economiza tempo e esforço
                            e aumenta a produtividade.
                          </p>
                        </div>
                      </NavLink>
                      <div className="pointer-events-none absolute inset-0 rounded-xl"></div>
                    </div>

                    <div className="relative">
                      <NavLink to="/dashboard/ai-social">
                        <div className="rounded-lg bg-white p-10 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900">
                          <div>
                            <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 text-white shadow-lg">
                              <Webhook />
                            </span>
                          </div>
                          <h1 className="mt-5 text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                            AI Social
                          </h1>
                          <p className="mt-2 hidden text-sm text-slate-500 dark:text-slate-400 md:block lg:block">
                            Descubra o futuro do marketing de mídia social com
                            nossa IA, crie postagens e legendas sem esforço e
                            eleve sua presença nas redes sociais.
                          </p>
                        </div>
                      </NavLink>
                      <div className="pointer-events-none absolute inset-0 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Steps current={current} items={items} className="my-8" />

            <Form
              key={feature.keyname}
              method="post"
              action={"/dashboard/project/" + feature.keyname}
            >
              <input type="hidden" name="project" value={feature.keyname} />

              <AuthenticityTokenInput />

              {selectedCategory && (
                <p className="pb-4 text-slate-700 dark:text-slate-400">
                  <p className="mt-10 text-sm leading-6">
                    Seus conteúdos serão organizados em{" "}
                    {
                      categories.filter(
                        (category) => category.keyname === selectedCategory
                      )[0].name
                    }{" "}
                    e o conteúdo atual será criado com a ferramenta de
                    Copywriting.
                  </p>
                </p>
              )}

              <div style={contentStyle}>
                {current === 0 && (
                  <Disclosure
                    key="sugests"
                    as="div"
                    className="rounded-lg p-7 shadow-xl lg:p-12"
                    defaultOpen={true}
                  >
                    <DisclosureButton className="group flex w-full items-start justify-between text-left">
                      <header id="header" className="relative z-20">
                        <div>
                          <p className="mb-2 text-sm font-semibold leading-6 text-sky-500 dark:text-sky-400">
                            O que vamos criar hoje?
                          </p>
                          <div className="flex items-center">
                            <h1 className="inline-block text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-3xl">
                              Organize seus Conteúdos
                            </h1>
                          </div>
                        </div>
                        <p className="mt-2 text-lg text-slate-700 dark:text-slate-400">
                          Selecione os tipos de conteúdo que deseja criar e
                          agrupar neste projeto. <br />
                          Organize artigos de blog, e-mails, anúncios, histórias
                          e mais, tudo em um único lugar para uma gestão eficaz
                          de suas campanhas.
                        </p>
                      </header>
                      <ChevronDownIcon className="size-12 fill-transparent/80 group-data-[open]:rotate-180 group-data-[hover]:fill-transparent/50 dark:from-white dark:to-[hsla(0,0%,100%,.5)]" />
                    </DisclosureButton>
                    <DisclosurePanel className="isolate mx-auto grid max-w-md grid-cols-1 gap-4 px-0 py-5 text-sm/5 leading-6 lg:max-w-7xl lg:grid-cols-2">
                      {categories.map((item) => {
                        return (
                          <ul
                            key={item.keyname}
                            className="text-sm leading-6 sm:grid-cols-1 sm:px-0 sm:pb-8 sm:pt-6 xl:py-1 xl:pb-0"
                          >
                            <li className="group mx-auto block w-full space-y-3 rounded-lg bg-white p-6 shadow-lg ring-1 ring-slate-900/5 hover:bg-sky-500 hover:ring-sky-500">
                              <Button
                                className="isolate mx-auto grid h-full w-full max-w-md grid-cols-1 rounded-lg border-slate-300 bg-transparent text-left hover:border-solid hover:bg-transparent"
                                type="button"
                                onClick={() => {
                                  selectCategory(item.keyname)
                                  next()
                                }}
                              >
                                <input
                                  type="hidden"
                                  name="category"
                                  value={item.keyname}
                                />
                                <div className="flex items-center space-x-3">
                                  <h1 className="text-wrap text-lg font-semibold text-slate-900 group-hover:text-white">
                                    {item.name}
                                  </h1>
                                </div>
                                <p className="text-wrap text-sm text-slate-400 group-hover:text-white">
                                  {item.description}
                                </p>
                              </Button>
                            </li>
                          </ul>
                        )
                      })}
                    </DisclosurePanel>
                  </Disclosure>
                )}

                {current === 1 && (
                  <Disclosure
                    key="tools"
                    as="div"
                    className="rounded-lg p-7 shadow-xl lg:p-12"
                    defaultOpen={true}
                  >
                    <DisclosureButton className="group flex w-full items-start justify-between text-left">
                      <header id="header" className="relative z-20">
                        <div>
                          <p className="mb-2 text-sm font-semibold leading-6 text-sky-500 dark:text-sky-400">
                            Ferramentas de escrita
                          </p>
                          <div className="flex items-center">
                            <h1 className="inline-block text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-3xl">
                              Crie o melhor conteúdo de IA para o seu negócio.
                            </h1>
                          </div>
                        </div>
                        <p className="mt-2 text-lg text-slate-700 dark:text-slate-400">
                          Transforme suas ideias em conteúdo de marketing
                          cativante sem esforço com as ferramentas de escritas
                          de IA.
                        </p>
                        <p className="text-lg text-slate-700 dark:text-slate-400">
                          Somos o seu parceiro para inovação e crescimento.
                        </p>
                        <p className="text-lg text-slate-700 dark:text-slate-400">
                          Gaste menos tempo planejando e mais tempo construindo
                          seu negócio.
                        </p>
                        <Flex className="my-7 lg:mb-0" gap="8px 0" wrap>
                          <Tag color="default">Livre de Alucinação</Tag>
                          <Tag color="default">Baseado em Fatos</Tag>
                          <Tag color="default">Personalize o Tom</Tag>
                          <Tag color="default">Zero Prompts</Tag>
                          <Tag color="default">Multilínguagem</Tag>
                        </Flex>
                      </header>
                      <ChevronDownIcon className="size-12 fill-transparent/80 group-data-[open]:rotate-180 group-data-[hover]:fill-transparent/50 dark:from-white dark:to-[hsla(0,0%,100%,.5)]" />
                    </DisclosureButton>
                    <DisclosurePanel className="isolate mx-auto text-sm/5 leading-6">
                      <div className="my-8 grid gap-5 text-left lg:grid-cols-3">
                        {aiToolsOptions.map((item) => {
                          return (
                            <ul
                              key={item.value}
                              className="text-sm leading-6 sm:grid-cols-1 sm:px-0 sm:pb-8 sm:pt-6 lg:grid-cols-3 lg:p-4 xl:grid-cols-2 xl:px-1 xl:pb-8 xl:pt-6"
                            >
                              <li className="group mx-auto block w-full space-y-3 rounded-lg bg-white p-4 shadow-lg ring-1 ring-slate-900/5 hover:bg-sky-500 hover:ring-sky-500">
                                <Button
                                  className="isolate mx-auto grid h-full w-full max-w-md grid-cols-1 rounded-lg border-slate-300 bg-transparent text-left hover:border-solid hover:bg-transparent"
                                  type="button"
                                  onClick={() => {
                                    selectAITool(item.value)
                                    next()
                                  }}
                                >
                                  <div className="col-auto">
                                    <h1 className="text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                                      {item.value === "ai-writers" && (
                                        <NotebookPen />
                                      )}
                                      {item.value === "ai-copywriting" && (
                                        <ScanText />
                                      )}
                                      {item.value === "ai-social" && (
                                        <Webhook />
                                      )}
                                      {item.label}
                                    </h1>
                                    <p className="text-wrap py-3 text-sm text-slate-400 group-hover:text-white">
                                      {item.description}
                                    </p>
                                    <div className="pointer-events-none absolute inset-0 rounded-xl"></div>
                                  </div>
                                </Button>
                              </li>
                            </ul>
                          )
                        })}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                )}

                {current === 2 && (
                  <Disclosure
                    key="tools"
                    as="div"
                    className="rounded-lg p-7 shadow-xl lg:p-12"
                    defaultOpen={true}
                  >
                    <DisclosureButton className="group flex w-full items-start justify-between text-left">
                      <header id="header" className="relative z-20">
                        <div>
                          <p className="mb-2 text-sm font-semibold leading-6 text-sky-500 dark:text-sky-400">
                            Tipo de Conteúdo
                          </p>
                          <div className="flex items-center">
                            <h1 className="inline-block text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-3xl">
                              AI Copywriting
                            </h1>
                          </div>
                        </div>
                        <p className="mt-2 text-lg text-slate-700 dark:text-slate-400">
                          Quer você seja um profissional de marketing experiente
                          ou esteja apenas começando, nossas ferramentas de IA
                          estão aqui para ajudá-lo a criar textos atraentes com
                          facilidade.
                          <br />
                          Descubra uma variedade de fórmulas comprovadas de
                          direitos autorais projetadas para aprimorar suas
                          campanhas de marketing e criar conteúdo persuasivo
                          incluindo <b>4C's</b>, <b>STAR</b>, <b>PAS</b>,{" "}
                          <b>AIDPPC</b>, <b>3R's</b>, <b>Emotional Triggers</b>,{" "}
                          <b>ACCA</b>, <b>OATH</b>, <b>FAB</b>, <b>BAB</b>,{" "}
                          <b>AIDA</b> e <b>APP</b>.
                        </p>
                      </header>
                      <ChevronDownIcon className="size-12 fill-transparent/80 group-data-[open]:rotate-180 group-data-[hover]:fill-transparent/50 dark:from-white dark:to-[hsla(0,0%,100%,.5)]" />
                    </DisclosureButton>
                    <DisclosurePanel className="isolate mx-auto text-sm/5 leading-6">
                      <div className="isolate mx-auto mt-20 grid max-w-md grid-cols-1 gap-8 text-left md:max-w-7xl md:grid-cols-2 lg:grid-cols-3">
                        {selectedAITool === "ai-copywriting" &&
                          copywritingCards.map((copy) => {
                            return (
                              <PricingCard key={copy.keyname}>
                                <FeatureTitle>{copy.name}</FeatureTitle>
                                <FeatureDescription>
                                  {copy.description}
                                </FeatureDescription>
                                <CTAContainer>
                                  <Button
                                    disabled={!copy.isActive}
                                    className="isolate mx-auto grid h-full w-full max-w-md auto-cols-max grid-flow-col grid-cols-2 justify-items-end rounded-lg border-slate-300 text-left hover:border-solid hover:bg-rose-500"
                                    type="button"
                                    onClick={() => {
                                      startGenerator(
                                        feature.keyname,
                                        copy.keyname
                                      )
                                    }}
                                  >
                                    {copy.isActive
                                      ? "Gerar Conteúdo"
                                      : "Em Breve"}

                                    <ChevronDoubleRightIcon className="h-5 w-5" />
                                  </Button>
                                </CTAContainer>
                              </PricingCard>
                            )
                          })}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                )}
              </div>
            </Form>

            <div
              style={{
                marginTop: 34,
              }}
            >
              {current > 0 && (
                <AntButton
                  style={{
                    margin: "0 8px",
                  }}
                  onClick={() => prev()}
                >
                  Voltar
                </AntButton>
              )}

              {current < steps.length - 1 && (
                <AntButton type="primary" onClick={() => next()}>
                  Próximo
                </AntButton>
              )}

              {current === steps.length - 1 && (
                <AntButton
                  type="primary"
                  onClick={() => message.success("Processing complete!")}
                >
                  Pronto! Vamos Gerar Conteúdo
                </AntButton>
              )}
            </div>

            <div className="my-16"></div>
          </div>
        )
      })}
    </div>
  )
}
