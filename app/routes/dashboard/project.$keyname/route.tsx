import { useId } from "react"
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node"
import { Form, NavLink, useLoaderData } from "@remix-run/react"
import type { MetaFunction } from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import {
  Blocks,
  BookOpenText,
  LandPlot,
  Mail,
  Megaphone,
  MessageCircleQuestion,
  NotebookPen,
  ScanText,
  Webhook,
} from "lucide-react"
import slugify from "react-slugify"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { z } from "zod"

import { validateCsrfToken } from "@/lib/server/csrf.server"
import { mergeMeta } from "@/lib/server/seo/seo-helpers"
import { authenticator } from "@/services/auth.server"
import { prisma } from "@/services/db/db.server"
import { getProjectByUserIdAndKeyname } from "@/models/project"
import { getSubscriptionByUserId } from "@/models/subscription"
import { Button } from "@/components/ui/button"

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

  return {
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
      {features.map((feature) => {
        return (
          <div className="mx-auto max-w-7xl lg:px-8">
            <div className="mx-auto max-w-7xl px-4 pb-32 pt-2 lg:px-2">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="w-full max-w-xl xl:max-w-2xl">
                  <h1 className="font-ivyora-display bg-black bg-gradient-to-br bg-clip-text text-4xl tracking-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] md:text-7xl lg:text-7xl">
                    <b>
                      Detalhamento Estratégico
                      <span className="relative ml-2 inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-pink-500">
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
            <h1 className="mb-12 ml-2 text-2xl font-medium tracking-tight text-slate-900 dark:text-white">
              <Blocks /> Ferramentas de IA
            </h1>
            <div className="grid max-w-md grid-cols-1 gap-8 px-2 lg:max-w-7xl lg:grid-cols-3">
              <NavLink to="/forgot-password">
                <div className="rounded-lg bg-white p-10 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900">
                  <div>
                    <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 text-white shadow-lg">
                      <NotebookPen />
                    </span>
                  </div>
                  <h1 className="mt-5 text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                    AI Writers
                  </h1>
                  <p className="text-md mt-2 text-slate-500 dark:text-slate-400">
                    Escritores de IA especializados e focados em seu negócio,
                    nossa ferramenta economiza tempo e esforço e aumenta a
                    produtividade.
                  </p>
                </div>
              </NavLink>
              <NavLink to="/dashboard/copywriting">
                <div className="rounded-lg bg-white p-10 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900">
                  <div>
                    <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 text-white shadow-lg">
                      <ScanText />
                    </span>
                  </div>
                  <h1 className="mt-5 text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                    AI Copywriting Tools
                  </h1>
                  <p className="text-md mt-2 text-slate-500 dark:text-slate-400">
                    Transforme suas ideias em conteúdo de marketing cativante
                    sem esforço, nossas poderosas ferramentas de IA estão aqui
                    para ajudá-lo a criar textos atraentes com facilidade.
                  </p>
                </div>
              </NavLink>
              <NavLink to="/forgot-password">
                <div className="rounded-lg bg-white p-10 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900">
                  <div>
                    <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 text-white shadow-lg">
                      <Webhook />
                    </span>
                  </div>
                  <h1 className="mt-5 text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                    AI Social
                  </h1>
                  <p className="text-md mt-2 text-slate-500 dark:text-slate-400">
                    Descubra o futuro do marketing de mídia social com nossa IA,
                    crie postagens e legendas sem esforço e eleve sua presença
                    nas redes sociais.
                  </p>
                </div>
              </NavLink>
            </div>

            <div className="my-12"></div>

            <h1 className="mb-12 ml-2 text-2xl font-medium tracking-tight text-slate-900 dark:text-white">
              <LandPlot /> Sugestões de Conteúdo
            </h1>

            <div className="isolate grid max-w-md grid-cols-1 gap-8 px-2 lg:max-w-7xl lg:grid-cols-3">
              <NavLink to="/forgot-password">
                <div className="rounded-lg bg-white p-10 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900">
                  <div>
                    <span className="inline-flex items-center justify-center rounded-md bg-black p-2 text-white shadow-lg">
                      <NotebookPen />
                    </span>
                  </div>
                  <h1 className="mt-5 text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                    Artigos de Blog
                  </h1>
                  <p className="text-md mt-2 text-slate-500 dark:text-slate-400">
                    Compartilhe seu conhecimento e posicione sua marca como
                    líder do setor. Crie artigos de blog envolventes que
                    eduquem, inspirem e engajem seu público.
                  </p>
                </div>
              </NavLink>

              <NavLink to="/forgot-password">
                <div className="rounded-lg bg-white p-10 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900">
                  <div>
                    <span className="inline-flex items-center justify-center rounded-md bg-black p-2 text-white shadow-lg">
                      <Mail />
                    </span>
                  </div>
                  <h1 className="mt-5 text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                    E-mails
                  </h1>
                  <p className="text-md mt-2 text-slate-500 dark:text-slate-400">
                    Aproxime-se dos seus clientes com campanhas de e-mail
                    personalizadas. Construa conexões fortes e aumente suas
                    conversões com mensagens eficazes e direcionadas.
                  </p>
                </div>
              </NavLink>
              <NavLink to="/forgot-password">
                <div className="rounded-lg bg-white p-10 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900">
                  <div>
                    <span className="inline-flex items-center justify-center rounded-md bg-black p-2 text-white shadow-lg">
                      <Megaphone />
                    </span>
                  </div>
                  <h1 className="mt-5 text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                    Anúncios
                  </h1>
                  <p className="text-md mt-2 text-slate-500 dark:text-slate-400">
                    Capture a atenção do seu público-alvo com anúncios
                    impactantes. Crie campanhas publicitárias que destacam sua
                    oferta e geram resultados reais.
                  </p>
                </div>
              </NavLink>
              <NavLink to="/forgot-password">
                <div className="rounded-lg bg-white p-10 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900">
                  <div>
                    <span className="inline-flex items-center justify-center rounded-md bg-black p-2 text-white shadow-lg">
                      <NotebookPen />
                    </span>
                  </div>
                  <h1 className="mt-5 text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                    Histórias
                  </h1>
                  <p className="text-md mt-2 text-slate-500 dark:text-slate-400">
                    Conecte-se emocionalmente com seu público. Conte histórias
                    cativantes que ressoam com os valores e desejos de seus
                    clientes, fortalecendo sua marca.
                  </p>
                </div>
              </NavLink>

              <NavLink to="/forgot-password">
                <div className="rounded-lg bg-white p-10 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900">
                  <div>
                    <span className="inline-flex items-center justify-center rounded-md bg-black p-2 text-white shadow-lg">
                      <MessageCircleQuestion />
                    </span>
                  </div>
                  <h1 className="mt-5 text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                    Perguntas e Respostas
                  </h1>
                  <p className="text-md mt-2 text-slate-500 dark:text-slate-400">
                    Antecipe as dúvidas do seu público e responda com clareza.
                    Crie sessões de perguntas e respostas que informem e
                    construam confiança.
                  </p>
                </div>
              </NavLink>

              <NavLink to="/forgot-password">
                <div className="rounded-lg bg-white p-10 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-900">
                  <div>
                    <span className="inline-flex items-center justify-center rounded-md bg-black p-2 text-white shadow-lg">
                      <Webhook />
                    </span>
                  </div>
                  <h1 className="mt-5 text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                    Conteúdos para Redes Sociais
                  </h1>
                  <p className="text-md mt-2 text-slate-500 dark:text-slate-400">
                    Engaje e cresça sua audiência nas redes sociais. Crie
                    conteúdos que chamem a atenção, promovam interação e
                    mantenham sua marca sempre em destaque.
                  </p>
                </div>
              </NavLink>
            </div>

            <div className="my-12"></div>
          </div>
        )
      })}
    </div>
  )
}
