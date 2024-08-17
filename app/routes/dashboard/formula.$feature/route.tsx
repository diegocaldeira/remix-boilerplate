import { redirect } from "@remix-run/node"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

import { authenticator } from "@/services/auth.server"
import { getFeatureById } from "@/models/feature"

// TODO: to be discussed with Keyur
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.feature) {
    return redirect("/dashboard/copywriting")
  }

  let feature = await getFeatureById(params.feature)

  return {
    feature,
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  // const formData = await request.formData()

  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
}

export default function FormulaPage() {
  const { feature } = useLoaderData<typeof loader>()

  return (
    <div>
      <div className="mx-auto max-w-7xl px-6 lg:px-2">
        <div className="max-w-4xl text-left">
          <h1 className="wrap-balance mt-16 bg-black bg-gradient-to-br bg-clip-text text-left text-4xl font-medium leading-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:text-5xl sm:leading-tight">
            {feature.name}
          </h1>
        </div>

        <p
          className="wrap-balance mt-6 text-left text-lg font-light leading-6 text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: feature.description }}
        />

        <div className="mt-16 flex justify-center"></div>

        <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-7xl lg:grid-cols-2">
          <p
            className="wrap-balance mt-6 text-left text-lg font-light leading-6 text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: feature.observations }}
          />
          <p
            className="wrap-balance mt-6 text-left text-lg font-light leading-6 text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: feature.example }}
          />
        </div>
      </div>
    </div>
  )
}
