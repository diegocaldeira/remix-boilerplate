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
      <div className="max-w-8xl mx-auto lg:px-8">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-2 lg:px-2">
          <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
            <div className="w-full max-w-xl xl:max-w-2xl">
              <h1 className="font-ivyora-display bg-black bg-gradient-to-br bg-clip-text text-4xl tracking-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] md:text-7xl lg:text-6xl">
                <b>Gerencie Suas Campanhas e Projetos de Forma Eficiente</b>
              </h1>
              <p className="font-ivyora-display relative mt-6 bg-black bg-gradient-to-br bg-clip-text text-lg leading-8 text-gray-600 text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:max-w-md lg:max-w-none">
                Centralize todos os seus projetos e campanhas com o suporte de
                escritores IA especializados no seu setor. Eleve a autoridade e
                a confiança da sua marca ao organizar e gerenciar seu conteúdo
                de forma estratégica, com tudo em um só lugar para garantir
                resultados mais rápidos e eficazes.
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
        <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 pb-20 lg:max-w-7xl lg:grid-cols-1">
          <section>
            <ul className="grid grid-cols-1 gap-4 text-sm leading-6 sm:grid-cols-1 sm:px-0 sm:pb-8 sm:pt-6 lg:grid-cols-2 lg:p-4 xl:grid-cols-2 xl:px-8 xl:pb-8 xl:pt-6">
              <li className="flex items-center rounded-lg">
                <Form method="post" className="h-full w-full">
                  <input type="hidden" name="action" value="create" />
                  <Button
                    className="font-ivyora-display h-full w-full space-y-3 rounded-lg border-2 border-dashed border-sky-500 bg-white p-4 text-black ring-1 ring-slate-900/5 hover:border-0 hover:bg-zinc-900 hover:text-white"
                    type="submit"
                  >
                    <FolderPlus className="mr-2 h-6 w-6" />
                    Novo Projeto
                  </Button>
                </Form>
              </li>

              {features.map((feature) => {
                return (
                  <li
                    key={feature.keyname}
                    className="group mx-auto block w-full space-y-3 rounded-lg bg-white p-6 shadow-lg ring-1 ring-slate-900/5 hover:bg-sky-500 hover:ring-sky-500"
                  >
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
