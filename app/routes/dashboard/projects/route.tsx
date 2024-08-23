import { redirect } from "@remix-run/node"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import type { MetaFunction } from "@remix-run/react"
import { FolderKanban, FolderPlus } from "lucide-react"

import { mergeMeta } from "@/lib/server/seo/seo-helpers"
import { authenticator } from "@/services/auth.server"
import { getProjectByUserId } from "@/models/project"
import { getSubscriptionByUserId } from "@/models/subscription"
import { Button } from "@/components/ui/button"

// TODO: to be discussed with Keyur
declare global {
  interface BigInt {
    toJSON(): string
  }
}

export const meta: MetaFunction = mergeMeta(
  // these will override the parent meta
  () => {
    return [{ title: "Seus Projeto e Campanhas" }]
  }
)

BigInt.prototype.toJSON = function () {
  return this.toString()
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  const subscription = await getSubscriptionByUserId(session.id)

  let features = await getProjectByUserId(session.id)

  return {
    features,
    subscription,
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const action = formData.get("action")?.toString().toLowerCase()
  const keyname = formData.get("keyname")?.toString().toLowerCase()

  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  if (action === "create") {
    return redirect("/dashboard/project/create")
  }

  if (!keyname) {
    return redirect("/dashboard/projects")
  }

  return redirect("/dashboard/project/" + keyname)
}

export default function ProjectsPage() {
  const { features } = useLoaderData<typeof loader>()

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
      <div className="mx-auto max-w-7xl lg:px-8">
        <div className="mx-auto max-w-7xl px-6 pb-32 pt-2 lg:px-8">
          <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
            <div className="w-full max-w-xl xl:max-w-2xl">
              <h1 className="font-ivyora-display bg-black bg-gradient-to-br bg-clip-text text-4xl tracking-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] md:text-7xl lg:text-7xl">
                <b>Seus Projetos e Campanhas</b>
              </h1>
              <p className="font-ivyora-display relative mt-6 bg-black bg-gradient-to-br bg-clip-text text-lg leading-8 text-gray-600 text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:max-w-md lg:max-w-none">
                Organize seus projetos com escritores IA especializados, focados
                em seu setor. Aumente a autoridade e a confiança na marca,
                organizando suas campanhas em um único lugar para alcançar
                resultados impactantes.
              </p>
            </div>
            <div className="mt-20 flex justify-end gap-8 sm:justify-start lg:mt-0 lg:pl-0">
              <div className="ml-auto w-1/4 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;h=528&amp;q=80"
                    alt=""
                    className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"></div>
                </div>
              </div>

              <div className="mr-auto w-1/4 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;h=528&amp;q=80"
                    alt=""
                    className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"></div>
                </div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;crop=focalpoint&amp;fp-x=.4&amp;w=396&amp;h=528&amp;q=80"
                    alt=""
                    className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"></div>
                </div>
              </div>

              <div className="w-1/4 flex-none space-y-8 pt-32 sm:pt-0">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1670272504528-790c24957dda?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;crop=left&amp;w=400&amp;h=528&amp;q=80"
                    alt=""
                    className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"></div>
                </div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1670272505284-8faba1c31f7d?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;h=528&amp;q=80"
                    alt=""
                    className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 px-2 lg:max-w-7xl lg:grid-cols-1">
          <section>
            <header className="isolate mx-auto flex grid w-full max-w-md grid-cols-1 items-end justify-between space-y-4 bg-white p-4 px-2 sm:px-8 sm:py-6 lg:max-w-7xl lg:grid-cols-1 lg:p-4 xl:px-8 xl:py-6">
              <form className="group relative">
                {/* <svg width="20" height="20" fill="currentColor" className="absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none group-focus-within:text-blue-500" aria-hidden="true">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                </svg> */}
                <input
                  className="w-full appearance-none rounded-md py-2 pl-10 text-sm leading-6 text-slate-900 placeholder-slate-400 shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  aria-label="Pesquisar projetos"
                  placeholder="Pesquisar projetos..."
                />
              </form>
            </header>
            <ul className="grid grid-cols-1 gap-4 p-4 text-sm leading-6 sm:grid-cols-1 sm:px-0 sm:pb-8 sm:pt-6 lg:grid-cols-2 lg:p-4 xl:grid-cols-2 xl:px-8 xl:pb-8 xl:pt-6">
              <li className="flex items-center rounded-lg">
                <Form method="post" className="h-full w-full">
                  <input type="hidden" name="action" value="create" />
                  <Button
                    className="h-full w-full rounded-lg border-2 border-dashed border-slate-300 bg-white py-5 text-lg text-lg font-medium leading-6 text-slate-900 hover:border-solid hover:border-blue-500 hover:bg-white hover:text-blue-500"
                    type="submit"
                  >
                    <FolderPlus className="mr-2 h-6 w-6" />
                    Novo Projeto
                  </Button>
                </Form>
              </li>
              {features.map((feature) => {
                return (
                  <li className="group mx-auto block w-full space-y-3 rounded-lg bg-white p-6 shadow-lg ring-1 ring-slate-900/5 hover:bg-sky-500 hover:ring-sky-500">
                    <Form method="post" className="h-full w-full">
                      <input type="hidden" name="action" value="details" />
                      <input
                        type="hidden"
                        name="keyname"
                        value={feature.keyname}
                      />
                      <Button
                        className="isolate mx-auto grid h-full w-full max-w-md grid-cols-1 rounded-lg border-slate-300 bg-transparent text-left hover:border-solid hover:bg-transparent"
                        type="submit"
                      >
                        <div className="flex items-center space-x-3">
                          <h1 className="text-lg font-semibold text-slate-900 group-hover:text-white">
                            <FolderKanban />
                            {feature.name}
                          </h1>
                        </div>
                        <p className="text-sm text-slate-400 group-hover:text-white">
                          Criado em:{" "}
                          {new Date(feature.createdAt).toLocaleDateString()}
                        </p>
                      </Button>
                    </Form>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
