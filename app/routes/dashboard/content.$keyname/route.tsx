import { useId } from "react"
import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node"
import { Form, NavLink, useActionData, useLoaderData } from "@remix-run/react"
import type { MetaFunction } from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { z } from "zod"

import { validateCsrfToken } from "@/lib/server/csrf.server"
import { mergeMeta } from "@/lib/server/seo/seo-helpers"
import { authenticator } from "@/services/auth.server"
import { getAllCategoriesActive } from "@/models/category"
import { getContentGeneratedByUserIdAndKeyname } from "@/models/content-generated"
import { getSubscriptionByUserId } from "@/models/subscription"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TextArea } from "@/components/ui/textarea"

// import { ArrowRight } from "lucide-react"

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

  const contentGenerated = await getContentGeneratedByUserIdAndKeyname(
    params.keyname as string,
    session.id
  )

  const categories = await getAllCategoriesActive()

  return {
    contentGenerated,
    categories,
    subscription,
  }
}

const schema = z.object({
  name: z.string({
    required_error: "Por favor, entre com o nome do seu projeto.",
  }),
  content: z.string({
    required_error: "Por favor, conte um pouco sobre o seu projeto",
  }),
})

export const meta: MetaFunction = mergeMeta(
  // these will override the parent meta
  () => {
    return [{ title: "Seu conteúdo" }]
  }
)

export const action = async ({ request }: ActionFunctionArgs) => {
  await validateCsrfToken(request)
  // const clonedRequest = request.clone()
  // const formData = await clonedRequest.formData()

  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  console.log("details of content")

  return redirect("/dashboard/projects")
}

export default function ProjectsContentDetailsPage() {
  const lastSubmission = useActionData<typeof action>()
  const id = useId()

  const { contentGenerated } = useLoaderData<typeof loader>()

  const [form, { name, content }] = useForm({
    id,
    lastSubmission,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parse(formData, { schema })
    },
  })

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

      <div className="mx-auto mb-24 max-w-7xl lg:px-8">
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-2 lg:px-2">
          <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
            <div className="w-full max-w-xl xl:max-w-2xl">
              <h1 className="font-ivyora-display bg-black bg-gradient-to-br bg-clip-text text-4xl tracking-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] md:text-7xl lg:text-7xl">
                <b>Revise e Aperfeiçoe Seu Conteúdo Gerado</b>
              </h1>
              <p className="font-ivyora-display relative mt-6 bg-black bg-gradient-to-br bg-clip-text text-lg leading-8 text-gray-600 text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:max-w-md lg:max-w-none">
                Aqui está o conteúdo criado pela IA para seu projeto. <br />
                Revise, edite e personalize cada detalhe para garantir que ele
                esteja perfeitamente alinhado com a voz da sua marca e os
                objetivos da campanha. Faça ajustes para maximizar o impacto e a
                conexão com o público.
              </p>
            </div>
          </div>
        </div>

        {contentGenerated.map((feature) => {
          return (
            <div
              key={feature.keyname}
              className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 px-2 pb-24 lg:max-w-7xl lg:grid-cols-1"
            >
              <p className="flex-grow pb-12 pt-3 text-sm text-muted-foreground">
                <NavLink
                  to={"/dashboard/project/" + feature.projectId}
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

              <Form className="h-full w-full" {...form.props} method="post">
                <AuthenticityTokenInput />
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-6 lg:col-span-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="name">Título</Label>
                    </div>
                    <div className="mt-2">
                      <Input
                        id="name"
                        type="text"
                        placeholder=""
                        autoComplete="name"
                        defaultValue={feature.title}
                        className="block w-full rounded-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        required
                        {...conform.input(name, { type: "text" })}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-full lg:col-span-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="content">Conteúdo</Label>
                    </div>
                    <div className="mt-2">
                      <TextArea
                        id="content"
                        className="h-500 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={feature.content}
                        required
                        {...conform.input(content, { type: "text" })}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6 lg:col-span-4">
                    <div className="grid grid-cols-1 gap-y-8">
                      <div className="col-span-7 mt-5 flex justify-between">
                        <p className="flex-grow text-sm text-muted-foreground">
                          <Button size="sm" variant="link" className="px-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="mr-5 size-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                            Excluir
                          </Button>
                        </p>
                        <Button
                          type="submit"
                          className="rounded-md bg-black px-6 py-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="mr-5 size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 12.75 6 6 9-13.5"
                            />
                          </svg>
                          Salvar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          )
        })}
      </div>
    </div>
  )
}
