import { useId } from "react"
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node"
import { Form, NavLink, useActionData } from "@remix-run/react"
import type { MetaFunction } from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { ArrowRight } from "lucide-react"
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
import { TextArea } from "@/components/ui/textarea"

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
    await prisma.project
      .create({
        data: {
          keyname: slugify(submission.value.name),
          name: submission.value.name,
          description: submission.value.about,
          userId: session.id,
          isActive: true,
        },
      })
      .catch((error) => {
        console.error("Error:", error)
        return json({ error: error.message }, { status: 500 })
      })
  }

  return redirect("/dashboard/projects")
}

export default function ProjectsPage() {
  const lastSubmission = useActionData<typeof action>()
  const id = useId()

  const [form, { name, about }] = useForm({
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
      <div className="mx-auto max-w-7xl lg:px-2">
        <div className="mx-auto max-w-7xl px-2 pb-20 pt-2 lg:px-2">
          <div className="mx-auto max-w-2xl gap-x-10 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
            <div className="w-full max-w-xl xl:max-w-2xl">
              <h1 className="font-ivyora-display bg-black bg-gradient-to-br bg-clip-text text-4xl tracking-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] md:text-7xl lg:text-6xl">
                <b>Gerencie Suas Campanhas de Forma Inteligente e Eficiente</b>
              </h1>
              <p className="font-ivyora-display relative mt-6 bg-black bg-gradient-to-br bg-clip-text text-lg leading-8 text-gray-600 text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:max-w-md lg:max-w-none">
                Inicie novos projetos ou campanhas para organizar seus textos de
                marketing em um só lugar. Nossa plataforma oferece
                personalização de tom, suporte multilíngue e criação de conteúdo
                sem alucinações, garantindo que suas mensagens sejam claras e
                eficazes, sempre alinhadas com as necessidades do seu público.
                Organize suas ideias e transforme estratégias em resultados com
                facilidade.
              </p>
              <p className="flex-grow pt-3 text-sm text-muted-foreground">
                <NavLink
                  to={"/dashboard/projects"}
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
            </div>
            <div className="mt-20 flex justify-end gap-8 sm:justify-start lg:mt-0 lg:pl-0">
              <div className="ml-auto w-1/4 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&amp;auto=format&amp;fit=crop&amp;h=528&amp;q=80"
                    alt=""
                    className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"></div>
                </div>
              </div>

              <div className="mr-auto w-1/4 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&amp;auto=format&amp;fit=crop&amp;h=528&amp;q=80"
                    alt=""
                    className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"></div>
                </div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&amp;auto=format&amp;fit=crop&amp;crop=focalpoint&amp;fp-x=.4&amp;w=396&amp;h=528&amp;q=80"
                    alt=""
                    className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"></div>
                </div>
              </div>

              <div className="w-1/4 flex-none space-y-8 pt-32 sm:pt-0">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&amp;auto=format&amp;fit=crop&amp;crop=left&amp;w=400&amp;h=528&amp;q=80"
                    alt=""
                    className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"></div>
                </div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1543269664-56d93c1b41a6?ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&amp;auto=format&amp;fit=crop&amp;h=528&amp;q=80"
                    alt=""
                    className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 px-2 md:max-w-7xl lg:grid-cols-1">
          <Form className="h-full w-full" {...form.props} method="post">
            <AuthenticityTokenInput />

            <Disclosure
              key="general"
              as="div"
              className="mb-12 rounded-lg border-2 border-slate-200 p-7 shadow-xl lg:p-12"
              defaultOpen={true}
            >
              <DisclosureButton className="group flex w-full items-start justify-between">
                <div className="wrap-balance bg-black bg-gradient-to-br bg-clip-text text-left leading-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:leading-tight">
                  <h1 className="wrap-balance my-4 w-full bg-black bg-gradient-to-br bg-clip-text text-left text-xl font-medium leading-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:leading-tight">
                    Crie um novo projeto
                  </h1>
                  <small>
                    Inicie seu projeto fornecendo um nome claro e uma breve
                    descrição. <br />
                    Isso ajudará você a manter o foco e a orientar suas
                    campanhas de marketing para resultados impactantes
                  </small>
                </div>
                <ChevronDownIcon className="size-5 fill-transparent/80 group-data-[open]:rotate-180 group-data-[hover]:fill-transparent/50 dark:from-white dark:to-[hsla(0,0%,100%,.5)]" />
              </DisclosureButton>

              <DisclosurePanel className="mt-2 py-10 text-sm/5 leading-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-6 lg:col-span-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="name">Nome</Label>
                    </div>
                    <div className="mt-2">
                      <Input
                        error={name.error}
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
                      <TextArea
                        error={about.error}
                        id="about"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={""}
                        required
                        rows={6}
                        {...conform.input(about, { type: "text" })}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Escreva um pouco sobre o seu projeto.
                    </p>
                  </div>
                </div>
              </DisclosurePanel>
            </Disclosure>

            <div className="space-y-12">
              <div className="mb-24 pb-24">
                <div className="mt-10 gap-x-6 border-gray-900/10">
                  <Button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Pronto para começar
                    <ArrowRight className="ml-2 h-5 w-5" />
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
