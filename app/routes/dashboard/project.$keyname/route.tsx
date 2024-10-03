import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node"
import { NavLink, useLoaderData, useNavigate } from "@remix-run/react"
import type { MetaFunction } from "@remix-run/react"
import { parse } from "@conform-to/zod"
import { ChevronDoubleRightIcon } from "@heroicons/react/20/solid"
import { Flex, List, Tag } from "antd"
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
import { Button } from "@/components/ui/button"

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
  action: z.string().optional(),
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
    if (submission.value.action === "create") {
      return redirect("/dashboard/content/create")
    }

    console.log("selecting project with id: " + submission.value.project)
    console.log("selecting category with id: " + submission.value.category)
    console.log("selecting tool with id: " + submission.value.tool)
    console.log(
      "selecting copywriting with id: " + submission.value.copywritingFormula
    )
  }

  return redirect("/dashboard/project/" + submission.value.project)
}

export default function ProjectsPage() {
  const navigate = useNavigate()

  const { categories, features, contentGeneratedCollection } =
    useLoaderData<typeof loader>()

  const startGeneratorPage = (project: string) => {
    navigate(`/dashboard/content/create?p=${project}`)
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
            <div className="mx-auto max-w-6xl px-4 lg:px-8 lg:pb-32">
              <div className="mx-auto max-w-xl gap-x-6 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="w-full max-w-lg xl:max-w-2xl">
                  <h1 className="font-ivyora-display bg-black bg-gradient-to-br bg-clip-text text-4xl tracking-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] md:text-7xl lg:text-7xl">
                    <b>
                      Detalhamento Estratégico
                      <span className="relative ml-2 inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-gradient-to-r before:from-violet-900 before:via-indigo-500 before:to-violet-800 md:text-6xl lg:text-6xl">
                        <span className="relative text-white">
                          {" "}
                          {feature.name}
                        </span>
                      </span>
                    </b>
                  </h1>
                  <p className="font-ivyora-display relative mt-6 bg-black bg-gradient-to-br bg-clip-text text-lg leading-8 text-gray-600 text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:max-w-md lg:max-w-none">
                    Descubra como cada conteúdo criado pela IA está alinhado com
                    suas estratégias de marca. Analise e refine os textos que
                    fortalecem sua presença no mercado e aumentam a confiança do
                    seu público, maximizando o impacto das suas campanhas.
                  </p>
                  <p className="flex-grow pb-12 pt-3 text-sm text-muted-foreground">
                    <NavLink
                      to={"/dashboard/projects"}
                      className="my-10 rounded-lg border-slate-300 py-2 text-left hover:border-solid"
                    >
                      <Button size="md" variant="link" className="px-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="mr-3 size-7"
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

                  <p className="mx-auto flex-grow pb-24 pt-3 text-center text-sm text-muted-foreground md:mr-10 md:text-right">
                    <Button
                      type="button"
                      className="rounded-md bg-black px-12 py-6 text-sm font-semibold text-white shadow-sm hover:bg-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => {
                        startGeneratorPage(feature.keyname)
                      }}
                    >
                      <ChevronDoubleRightIcon className="mr-2 h-5 w-5" />
                      Gerar Conteúdo
                    </Button>
                  </p>
                </div>
                <div className="flex justify-end gap-8 border border-dashed sm:justify-start lg:px-4">
                  <div className="mb-8 w-full max-w-xl xl:max-w-2xl">
                    <h1 className="font-ivyora-display mx-4 bg-black bg-gradient-to-br bg-clip-text text-4xl tracking-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] md:text-4xl lg:text-4xl">
                      <b>
                        <span className="relative ml-2 inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-gradient-to-r before:from-violet-900 before:via-indigo-500 before:to-violet-800">
                          <span className="relative text-white">
                            Explore e Aprofunde-se nos Conteúdos Gerados
                          </span>
                        </span>
                      </b>
                    </h1>
                    <p className="text-dark mx-5 mb-5 mt-8 text-sm font-semibold leading-6 dark:text-sky-400">
                      Conteúdos gerados recentemente
                    </p>
                    <List
                      itemLayout="vertical"
                      size="large"
                      pagination={{
                        onChange: (page) => {
                          console.log(page)
                        },
                        pageSize: 3,
                      }}
                      dataSource={contentGeneratedCollection}
                      footer={
                        <div className="mx-auto mt-3 text-center">
                          <b>AI Caldeira</b> | Seus conteúdos gerados
                        </div>
                      }
                      renderItem={(item) => (
                        <List.Item key={item.title}>
                          <List.Item.Meta
                            title={
                              <a href={"/dashboard/content/" + item.keyname}>
                                {item.title}
                              </a>
                            }
                            description={
                              <a href={"/dashboard/content/" + item.keyname}>
                                {item.description}
                              </a>
                            }
                          />
                          <Flex className="my-7 lg:mb-0" gap="8px 0" wrap>
                            <Tag color="default">
                              {
                                categories.filter(
                                  (category) =>
                                    category.keyname === item.categoryId
                                )[0].name
                              }{" "}
                            </Tag>
                          </Flex>
                        </List.Item>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="my-16"></div>
          </div>
        )
      })}
    </div>
  )
}
