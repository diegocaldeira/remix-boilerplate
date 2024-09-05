import { useState } from "react"
import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node"
import { NavLink, useLoaderData } from "@remix-run/react"
import type { MetaFunction } from "@remix-run/react"
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { Table } from "antd"
import { ArrowRight, NotebookPen, ScanText, Webhook } from "lucide-react"

import { mergeMeta } from "@/lib/server/seo/seo-helpers"
import { authenticator } from "@/services/auth.server"
import { getAllCategoriesActive } from "@/models/category"
import { getProjectByUserIdAndKeyname } from "@/models/project"
import { getSubscriptionByUserId } from "@/models/subscription"
import { Button } from "@/components/ui/button"

const columns = [
  {
    title: "Título",
    dataIndex: "title",
    filters: [
      {
        text: "Joe",
        value: "Joe",
      },
      {
        text: "Category 1",
        value: "Category 1",
      },
      {
        text: "Category 2",
        value: "Category 2",
      },
    ],
    filterMode: "tree",
    filterSearch: true,
    onFilter: (value, record) => record.title.startsWith(value),
    width: "60%",
  },
  {
    title: "Tags",
    dataIndex: "tags",
    filters: [
      {
        text: "London",
        value: "London",
      },
      {
        text: "New York",
        value: "New York",
      },
    ],
    onFilter: (value, record) => record.tags.startsWith(value),
    filterSearch: true,
  },
]
const data = [
  {
    key: "1",
    title: "John Brown",
    content: "New York No. 1 Lake Park",
    category: 32,
    tags: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    title: "Jim Green",
    content: "New York No. 1 Lake Park",
    category: 42,
    tags: "London No. 1 Lake Park",
  },
  {
    key: "3",
    title: "Joe Black",
    content: "New York No. 1 Lake Park",
    category: 32,
    tags: "Sydney No. 1 Lake Park",
  },
  {
    key: "4",
    title: "Jim Red",
    content: "New York No. 1 Lake Park",
    category: 32,
    tags: "London No. 2 Lake Park",
  },
]

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra)
}

// TODO: to be discussed with Keyur
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

  return {
    categories,
    features,
    subscription,
  }
}

export const meta: MetaFunction = mergeMeta(
  // these will override the parent meta
  () => {
    return [{ title: "Detalhes do Projeto" }]
  }
)

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  console.log("creating a new project")

  return redirect("/dashboard/projects")
}

export default function ProjectsPage() {
  const { categories, features } = useLoaderData<typeof loader>()

  const [selectedItems, setSelectedItems] = useState([])

  const handleCheckboxChange = (itemKey: any) => {
    setSelectedItems((prevSelectedItems: any) => {
      if (prevSelectedItems.includes(itemKey)) {
        // Se o item já está na lista, removê-lo
        return prevSelectedItems.filter((key: any) => key !== itemKey)
      } else {
        // Se o item não está na lista, adicioná-lo
        return [...prevSelectedItems, itemKey]
      }
    })
  }

  const isItemSelected = (itemKey: any) => selectedItems.includes(itemKey)

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
            <div className="mx-auto max-w-7xl px-4 pb-24 lg:px-8">
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

            <Disclosure
              key="sugests"
              as="div"
              className="rounded-lg border-2 border-slate-200 p-7 shadow-xl lg:p-12"
              defaultOpen={true}
            >
              <DisclosureButton className="group flex w-full items-start justify-between text-left">
                <header id="header" className="relative z-20 py-5">
                  <div>
                    <p className="mb-2 text-sm font-semibold leading-6 text-sky-500 dark:text-sky-400">
                      O que vamos criar hoje?
                    </p>
                    <div className="flex items-center">
                      <h1 className="inline-block text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-3xl">
                        Organize seus conteúdos
                      </h1>
                    </div>
                  </div>
                  <p className="mt-2 text-lg text-slate-700 dark:text-slate-400">
                    Selecione os tipos de conteúdo que deseja criar e agrupar
                    neste projeto. Organize artigos de blog, e-mails, anúncios,
                    histórias e mais, tudo em um único lugar para uma gestão
                    eficaz de suas campanhas.
                  </p>
                </header>
                <ChevronDownIcon className="size-12 fill-transparent/80 group-data-[open]:rotate-180 group-data-[hover]:fill-transparent/50 dark:from-white dark:to-[hsla(0,0%,100%,.5)]" />
              </DisclosureButton>
              <DisclosurePanel className="isolate mx-auto mt-2 grid max-w-md grid-cols-1 gap-8 px-0 py-10 text-sm/5 leading-6 lg:max-w-7xl lg:grid-cols-3">
                {categories.map((item) => {
                  return (
                    <NavLink key={item.keyname} to="/dashboard/copywriting">
                      <div className="rounded-lg bg-white p-10 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900">
                        <h1 className="text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                          {item.name}
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    </NavLink>
                  )
                })}
              </DisclosurePanel>
            </Disclosure>

            <div className="my-16"></div>

            <div className="px-4">
              <header id="header" className="relative z-20 mb-5 py-5">
                <div>
                  <div>
                    <span className="mb-4 inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 text-white shadow-lg">
                      <ScanText />
                    </span>
                  </div>
                  <div className="flex items-center">
                    <h1 className="inline-block text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-200 sm:text-3xl">
                      Seus Conteúdos Gerados
                    </h1>
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-400">
                  Selecione os tipos de conteúdo que deseja criar e agrupar
                  neste projeto. Organize artigos de blog, e-mails, anúncios,
                  histórias e mais, tudo em um único lugar para uma gestão
                  eficaz de suas campanhas.
                </p>
              </header>
              <Table columns={columns} dataSource={data} onChange={onChange} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
