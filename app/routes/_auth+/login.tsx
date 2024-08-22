import { useId } from "react"
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node"
import type { MetaFunction } from "@remix-run/react"
import { Form, NavLink, useActionData, useNavigation } from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import { AuthenticityTokenInput } from "remix-utils/csrf/react"
import { z } from "zod"

import GoogleLogo from "@/lib/assets/logos/google"
import { sendVerificationCode } from "@/lib/server/auth-utils.sever"
import { validateCsrfToken } from "@/lib/server/csrf.server"
import { mergeMeta } from "@/lib/server/seo/seo-helpers"
import { authenticator } from "@/services/auth.server"
import { prisma } from "@/services/db/db.server"
import { commitSession, getSession } from "@/services/session.server"
import { CommonErrorBoundary } from "@/components/error-boundry"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const schema = z.object({
  email: z
    .string({
      required_error: "Por favor, entre com seu e-mail para continuar",
    })
    .email("Por favor, entre com um e-mail válido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
})

export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard/projects",
  })
}

export const meta: MetaFunction = mergeMeta(
  // these will override the parent meta
  () => {
    return [{ title: "Entrar" }]
  }
)

export const action = async ({ request }: ActionFunctionArgs) => {
  await validateCsrfToken(request)
  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()

  const submission = await parse(formData, {
    schema: schema.superRefine(async (data, ctx) => {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
        },
        select: { id: true },
      })

      if (!existingUser) {
        ctx.addIssue({
          path: ["email"],
          code: z.ZodIssueCode.custom,
          message: "E-mail ou senha incorretos",
        })
        return
      }
    }),
    async: true,
  })

  if (!submission.value || submission.intent !== "submit") {
    return json(submission)
  }

  try {
    const user = await authenticator.authenticate("user-pass", request, {
      throwOnError: true,
      context: {
        ...submission.value,
        type: "login",
      },
    })

    let session = await getSession(request.headers.get("cookie"))
    // and store the user data
    session.set(authenticator.sessionKey, user)

    let headers = new Headers({ "Set-Cookie": await commitSession(session) })

    // Todo: make redirect config driven e.g add login success route
    if (user.emailVerified) {
      return redirect("/dashboard/projects", { headers })
    }
    await sendVerificationCode(user)
    return redirect("/verify-email", { headers })
  } catch (error) {
    // TODO: fix type here
    // TODO: create constant for message type of auth errors
    const typedError = error as any

    switch (typedError.message) {
      case "INVALID_PASSWORD":
        return {
          ...submission,
          error: { email: ["E-mail ou senha incorretos"] },
        }
      case "GOOGLE_SIGNUP":
        return {
          ...submission,
          error: {
            email: [
              "Você já possui uma conta com o google. Por favor, use o google para entrar.",
            ],
          },
        }
      default:
        return null
    }
  }
}

export default function Login() {
  const navigation = useNavigation()
  const isFormSubmitting = navigation.state === "submitting"
  const isSigningInWithEmail =
    isFormSubmitting && navigation.formAction !== "/auth/google"
  const isSigningInWithGoogle =
    isFormSubmitting && navigation.formAction === "/auth/google"
  const lastSubmission = useActionData<typeof action>()
  const id = useId()

  const [form, { email, password }] = useForm({
    id,
    lastSubmission,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parse(formData, { schema })
    },
  })
  return (
    <>
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
        Entre com sua conta
      </h2>
      <div className="mt-10 w-full sm:mx-auto">
        <Form className="space-y-6" method="post" {...form.props}>
          <AuthenticityTokenInput />
          <div>
            <Label htmlFor="email">Endereço de e-mail</Label>
            <div className="mt-2">
              <Input
                placeholder="seu@email.com"
                id="email"
                type="email"
                autoComplete="email"
                error={email.error}
                {...conform.input(email, { type: "email" })}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
            </div>
            <div className="mt-2">
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                error={password.error}
                {...conform.input(password, { type: "password" })}
              />
            </div>
          </div>

          <Button
            disabled={isSigningInWithEmail}
            className="w-full"
            type="submit"
          >
            {isSigningInWithEmail && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Entrar
          </Button>
        </Form>
        <Form action="/auth/google" method="post" className="mt-4">
          <Button
            disabled={isSigningInWithGoogle}
            className="w-full"
            type="submit"
            variant="outline"
          >
            <span className="flex items-center space-x-2">
              <GoogleLogo height={18} /> <span>Entre com Google</span>
            </span>
          </Button>
        </Form>
        <div className="mt-5 flex justify-between">
          <p className="flex-grow text-sm text-muted-foreground">
            Não é um membro?{" "}
            <NavLink to="/signup">
              <Button size="sm" variant="link" className="px-1">
                Criar Conta
              </Button>
            </NavLink>
          </p>
          <NavLink to="/forgot-password">
            <Button variant="link" size="sm">
              Esqueceu sua senha
            </Button>
          </NavLink>
        </div>
      </div>
    </>
  )
}

export function ErrorBoundary() {
  return <CommonErrorBoundary />
}
