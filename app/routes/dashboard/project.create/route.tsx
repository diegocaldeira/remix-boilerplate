import { useId } from "react"
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node"
import { Form, useActionData } from "@remix-run/react"
import type { MetaFunction } from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import { Check } from "lucide-react"
import slugify from "react-slugify"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { z } from "zod"

import { validateCsrfToken } from "@/lib/server/csrf.server"
import { mergeMeta } from "@/lib/server/seo/seo-helpers"
import { authenticator } from "@/services/auth.server"
import { prisma } from "@/services/db/db.server"
import { getSubscriptionByUserId } from "@/models/subscription"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// TODO: to be discussed with Keyur
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  const subscription = await getSubscriptionByUserId(session.id)

  return {
    subscription,
  }
}

export const meta: MetaFunction = mergeMeta(
  // these will override the parent meta
  () => {
    return [{ title: "Criar Projeto" }]
  }
)

const schema = z.object({
  name: z.string({
    required_error: "Por favor, entre com o nome do seu projeto.",
  }),
  about: z.string({
    required_error: "Por favor, conte um pouco sobre o seu projeto",
  }),
  category: z.string({
    required_error:
      "Por favor, entre com uma categoria para facilitar na organização do seu projeto.",
  }),
})

export const action = async ({ request }: ActionFunctionArgs) => {
  await validateCsrfToken(request)
  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()

  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  console.log("creating a new project")

  const submission = await parse(formData, {
    schema: schema.superRefine(async (data, ctx) => {
      const existingProject = await prisma.project.findFirst({
        where: {
          name: data.name,
          userId: session.id,
        },
        select: { id: true },
      })

      if (existingProject) {
        ctx.addIssue({
          path: ["name"],
          code: z.ZodIssueCode.custom,
          message:
            "Você já possui um projeto com este nome. Por favor, escolha outro nome.",
        })
        return
      }
    }),
    async: true,
  })

  if (!submission.value || submission.intent !== "submit") {
    return json(submission)
  } else {
    await prisma.project.create({
      data: {
        keyname: slugify(submission.value.name),
        name: submission.value.name,
        description: submission.value.about,
        category: submission.value.category,
        userId: session.id,
        isActive: true,
      },
    })
  }

  return redirect("/dashboard/projects")
}

export default function ProjectsPage() {
  const lastSubmission = useActionData<typeof action>()
  const id = useId()

  const [form, { name, about, category }] = useForm({
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
      <div className="mx-auto max-w-7xl lg:px-8">
        <div className="mx-auto max-w-7xl px-4 pb-32 pt-2 lg:px-2">
          <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
            <div className="w-full max-w-xl xl:max-w-2xl">
              <h1 className="font-ivyora-display bg-black bg-gradient-to-br bg-clip-text text-4xl tracking-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] md:text-7xl lg:text-7xl">
                <b>Organize Suas Campanhas com Projetos Personalizados</b>
              </h1>
              <p className="font-ivyora-display relative mt-6 bg-black bg-gradient-to-br bg-clip-text text-lg leading-8 text-gray-600 text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:max-w-md lg:max-w-none">
                Crie projetos ou campanhas para agrupar seus textos relacionados
                e mantenha suas iniciativas de marketing organizadas. Com opções
                de personalização de tom, suporte multilíngue e conteúdo livre
                de alucinações, seus textos serão precisos e alinhados com as
                necessidades específicas de cada campanha, sem a necessidade de
                prompts adicionais.
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
          <Form className="h-full w-full" {...form.props} method="post">
            <AuthenticityTokenInput />
            <div className="space-y-12">
              <div className="pb-24">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-6 lg:col-span-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="name">Nome</Label>
                    </div>
                    <div className="mt-2">
                      <Input
                        id="name"
                        type="text"
                        placeholder=""
                        autoComplete="name"
                        className="block w-full rounded-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        required
                        {...conform.input(name, { type: "text" })}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Como você deseja chamar esse projeto?
                    </p>
                  </div>

                  <div className="sm:col-span-full lg:col-span-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="about">Descrição</Label>
                    </div>
                    <div className="mt-2">
                      <Input
                        id="about"
                        type="textarea"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={""}
                        required
                        {...conform.input(about, { type: "text" })}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Escreva um pouco sobre o seu projeto.
                    </p>
                  </div>

                  <div className="sm:col-span-6  lg:col-span-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="about">Categoria</Label>
                    </div>
                    <div className="mt-2">
                      <Input
                        id="category"
                        type="text"
                        placeholder=""
                        autoComplete="category"
                        className="block w-full rounded-md border-0 py-1.5 pl-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        required
                        {...conform.input(category, { type: "text" })}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Facilite a organização dos seus projetos.
                    </p>
                  </div>
                </div>

                <div className=" mt-16 gap-x-6 border-gray-900/10 lg:col-span-4">
                  <Button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <Check className="mr-2 h-5 w-5" />
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
