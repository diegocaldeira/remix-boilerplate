import React, { useState } from "react"
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node"
import { Form, useLoaderData, useNavigate } from "@remix-run/react"
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
import { Button as AntButton, Flex, Steps, Tag, theme } from "antd"
import { NotebookPen, ScanText, Webhook } from "lucide-react"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { z } from "zod"

import { validateCsrfToken } from "@/lib/server/csrf.server"
import { mergeMeta } from "@/lib/server/seo/seo-helpers"
import { authenticator } from "@/services/auth.server"
import { prisma } from "@/services/db/db.server"
import { getAllCategoriesActive } from "@/models/category"
import { getAllContentGeneratedActiveByUser } from "@/models/content-generated"
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

const columns = [
  {
    title: "Título",
    dataIndex: "title",
    filters: [],
    filterMode: "tree",
    filterSearch: true,
    onFilter: (value: any, record: any) => record.title.startsWith(value),
    width: "60%",
  },
  {
    title: "Categoria",
    dataIndex: "categoryName",
    filters: [],
    onFilter: (value: any, record: any) =>
      record.categoryName.startsWith(value),
    filterSearch: true,
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

const populateTitleFilters = (titles: any) => {
  return columns.map((column: any) => {
    // Verifica se a coluna corresponde à categoria desejada
    if (column.dataIndex === "title") {
      // Adiciona categorias ao campo filters
      column.filters = titles.map((title: any) => ({
        text: title.title,
        value: title.title,
      }))
    }
    return column
  })
}

const populateCategoryFilters = (categories: any) => {
  return columns.map((column: any) => {
    // Verifica se a coluna corresponde à categoria desejada
    if (column.dataIndex === "categoryName") {
      // Adiciona categorias ao campo filters
      column.filters = categories.map((category: any) => ({
        text: category.name,
        value: category.name,
      }))
    }
    return column
  })
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)

  const project = url.searchParams.get("p")
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  const subscription = await getSubscriptionByUserId(session.id)

  const features = await getProjectByUserIdAndKeyname(
    project as string,
    session.id
  )

  const categories = await getAllCategoriesActive()
  let copywritingCards = await getAllFeatures()

  const contentGeneratedResults = await getAllContentGeneratedActiveByUser(
    session.id
  )

  const contentGeneratedCollection = contentGeneratedResults.map(
    (item, index) => ({
      ...item,
      key: index,
      categoryName:
        categories
          .filter((category) => category.keyname === item.categoryId)
          .map((category) => category.name)[0] || "Categoria não encontrada",
    })
  )

  let columnsFiltered = populateCategoryFilters(categories)
  columnsFiltered = populateTitleFilters(contentGeneratedCollection)

  return {
    contentGeneratedCollection,
    categories,
    features,
    subscription,
    copywritingCards,
    columnsFiltered,
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
  tool: z.string().optional(),
  copywritingFormula: z.string().optional(),
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
  const navigate = useNavigate()
  const [selectedAITool, selectAITool] = React.useState("")
  const [selectedCategory, selectCategory] = React.useState("")

  const { categories, features, copywritingCards } =
    useLoaderData<typeof loader>()

  const { token } = theme.useToken()
  const [current, setCurrent] = useState(0)

  const startGenerator = (project: string, type: string) => {
    navigate(`/dashboard/formula/${type}?p=${project}&c=${selectedCategory}`)
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
            <Steps current={current} items={items} className="my-8" />

            <Form
              key={feature.keyname}
              method="post"
              action={"/dashboard/project/" + feature.keyname}
            >
              <input type="hidden" name="project" value={feature.keyname} />

              <AuthenticityTokenInput />

              {selectedCategory && (
                <p className="mt-10 pb-4 text-sm leading-6 text-slate-700 dark:text-slate-400">
                  Seus conteúdos serão organizados em{" "}
                  {
                    categories.filter(
                      (category) => category.keyname === selectedCategory
                    )[0].name
                  }{" "}
                  e o conteúdo atual será criado com a ferramenta de
                  Copywriting.
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
