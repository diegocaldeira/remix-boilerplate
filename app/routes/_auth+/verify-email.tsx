import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node"
import type { MetaFunction } from "@remix-run/react"
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react"
import { ReloadIcon } from "@radix-ui/react-icons"
import { z } from "zod"

import {
  isWithinExpiration,
  sendVerificationCode,
} from "@/lib/server/auth-utils.sever"
import { mergeMeta } from "@/lib/server/seo/seo-helpers"
import buildTags from "@/lib/server/seo/seo-utils"
import { authenticator } from "@/services/auth.server"
import { prisma } from "@/services/db/db.server"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const requestCodeSchema = z.object({
  email: z
    .string({
      required_error: "Por favor, entre com seu e-mail para continuar",
    })
    .email("Por favor, entre com um e-mail valido."),
})

const codeVerificationSchema = z.object({
  code: z.string({
    required_error: "Por favor, entre com o código de verificação",
  }),
})

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)

  if (user) {
    if (user.emailVerified) {
      return redirect("/dashboard/projects")
    }

    const result = await prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
      },
    })

    if (!result) {
      return json({
        codeAvailableWithUser: false,
        email: user.email,
      })
    }

    if (!isWithinExpiration(result.expires)) {
      await prisma.verificationCode.deleteMany({
        where: {
          userId: user.id,
        },
      })
      return json({
        codeAvailableWithUser: false,
        email: user.email,
      })
    }

    return json({
      codeAvailableWithUser: true,
      email: user.email,
    })
  }

  return redirect("/login")
}

export const meta: MetaFunction = mergeMeta(
  // these will override the parent meta
  () => {
    return buildTags({
      title: "Verifique seu e-mail",
      description: "Verifique seu e-mail",
    })
  }
)

type FormDataType = {
  intent: "requestCode" | "verifyCode"
} & z.infer<typeof requestCodeSchema> &
  z.infer<typeof codeVerificationSchema>

export const action = async ({ request }: ActionFunctionArgs) => {
  const clonedRequest = request.clone()
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  const formData = Object.fromEntries(
    await clonedRequest.formData()
  ) as unknown as FormDataType

  switch (formData.intent) {
    case "verifyCode":
      const requestCodeSubmission = await codeVerificationSchema
        .superRefine(async (data, ctx) => {
          const verificationCode = await prisma.verificationCode.findFirst({
            where: {
              userId: user.id,
            },
          })

          if (verificationCode?.code !== formData.code) {
            ctx.addIssue({
              path: ["code"],
              code: z.ZodIssueCode.custom,
              message: "Por favor, entre com o código de verificação correto.",
            })
            return
          }
        })
        .safeParseAsync(formData)

      if (requestCodeSubmission.success) {
        const updatedUser = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            emailVerified: true,
          },
        })

        await prisma.verificationCode.deleteMany({
          where: {
            userId: user.id,
          },
        })
        return json({ verified: true })
      } else {
        return json({
          errors: requestCodeSubmission.error.flatten().fieldErrors,
        })
      }
    case "requestCode":
      const verifyCodeSubmission = requestCodeSchema.safeParse(formData)
      if (verifyCodeSubmission.success) {
        await sendVerificationCode(user)
        return json({ verified: false })
      } else {
        return json({
          errors: verifyCodeSubmission.error.flatten().fieldErrors,
        })
      }
    default:
      break
  }
}

export default function VerifyEmail() {
  const navigation = useNavigation()
  const data = useLoaderData<typeof loader>()
  const isFormSubmitting = navigation.state === "submitting"
  const actionData = useActionData<{
    errors: { code: Array<string>; email: Array<string> }
    verified?: boolean
  }>()

  const isVerifiying =
    navigation.state === "submitting" &&
    navigation.formData?.get("intent") === "verifyCode"

  if (actionData?.verified) {
    return (
      <div className="mt-10">
        <Alert>
          <AlertTitle>E-mail verificado!</AlertTitle>
          <AlertDescription>E-mail verificado com sucesso!</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (data.codeAvailableWithUser) {
    return (
      <>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Entre com o código de verificação
        </h2>
        {data.codeAvailableWithUser && (
          <p className="mt-10 text-muted-foreground">
            Você deve ter recebido um e-mail de verificação para {data?.email}.
          </p>
        )}
        <div className="mt-4 w-full sm:mx-auto">
          <Form className="space-y-6" method="post">
            <input type="text" name="intent" defaultValue="verifyCode" hidden />
            <div>
              <Label htmlFor="code">Código de verificação</Label>
              <div className="mt-2">
                <Input
                  id="code"
                  type="code"
                  name="code"
                  placeholder="Entre com o código de verificação"
                  error={actionData?.errors?.code?.[0]}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button disabled={isVerifiying} className="w-full" type="submit">
                {isVerifiying && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Verificar
              </Button>
            </div>
          </Form>
          <div className="mt-5 flex">
            <p className="flex-grow text-center text-sm text-gray-500">
              Não recebeu o e-mail de verificação?
              <Form method="post">
                <input
                  type="text"
                  name="intent"
                  defaultValue="requestCode"
                  hidden
                />
                <input
                  defaultValue={data.email}
                  id="email"
                  type="email"
                  name="email"
                  readOnly
                  className="pointer-events-none cursor-none"
                  hidden
                />
                <Button type="submit" size="sm" variant="link" className="px-1">
                  Solicitar novo código
                </Button>
              </Form>
            </p>
          </div>
        </div>
      </>
    )
  }

  if (!data.codeAvailableWithUser) {
    return (
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form className="space-y-6" method="post">
          <div>
            <input
              type="text"
              name="intent"
              defaultValue="requestCode"
              hidden
            />
            <Label htmlFor="email">E-mail</Label>
            <div className="mt-2">
              <Input
                defaultValue={data.email}
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                readOnly
                className="pointer-events-none cursor-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Button
              disabled={isFormSubmitting}
              className="w-full"
              type="submit"
            >
              {isFormSubmitting && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Solicitar código de verificação
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}
