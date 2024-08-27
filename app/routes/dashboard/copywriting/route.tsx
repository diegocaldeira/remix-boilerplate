import { redirect } from "@remix-run/node"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { TextSelect } from "lucide-react"

import { authenticator } from "@/services/auth.server"
import { getAllFeatures } from "@/models/feature"
import { getSubscriptionByUserId } from "@/models/subscription"
import {
  CTAContainer,
  FeatureListContainer,
  PricingCard,
} from "@/components/pricing/containers"
import type { FeatureType } from "@/components/pricing/feature"
import {
  Feature,
  FeatureDescription,
  FeatureTitle,
} from "@/components/pricing/feature"
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  const subscription = await getSubscriptionByUserId(session.id)

  let features = await getAllFeatures()

  return {
    features,
    subscription,
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const keyname = formData.get("keyname")?.toString().toLowerCase()

  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  if (!keyname) {
    return redirect("/dashboard/copywriting")
  }

  return redirect("/dashboard/formula/" + keyname)
}

export default function FeaturesPage() {
  const { features } = useLoaderData<typeof loader>()

  return (
    <div className="relative isolate overflow-hidden bg-background">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="inset-0 -z-10 h-full w-full [mask-image:radial-gradient(100%_100%_at_top_right,black,transparent)] dark:[mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
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
                <b>AI Caldeira Copywriting</b>.
              </h1>
              <p className="font-ivyora-display relative mt-6 bg-black bg-gradient-to-br bg-clip-text text-lg leading-8 text-gray-600 text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:max-w-md lg:max-w-none">
                Quer você seja um profissional de marketing experiente ou esteja
                apenas começando, nossas ferramentas de IA estão aqui para
                ajudá-lo a criar textos atraentes com facilidade.
                <br />
                Descubra uma variedade de fórmulas comprovadas de direitos
                autorais projetadas para aprimorar suas campanhas de marketing e
                criar conteúdo persuasivo incluindo <b>4C's</b>, <b>STAR</b>,{" "}
                <b>PAS</b>, <b>AIDPPC</b>, <b>3R's</b>,{" "}
                <b>Emotional Triggers</b>, <b>ACCA</b>, <b>OATH</b>, <b>FAB</b>,{" "}
                <b>BAB</b>, <b>AIDA</b> e <b>APP</b>.
              </p>
            </div>

            <div className="mt-20 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
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

        <div className="max-w-3xl px-6 text-left">
          <TextSelect className="mr-2 h-8 w-8" />
          <h3 className="wrap-balance mt-8 bg-black bg-gradient-to-br bg-clip-text text-left text-3xl font-medium leading-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:text-5xl sm:leading-tight">
            <b>Fórmulas de Copywriting</b>
          </h3>
        </div>

        <div className="isolate mx-auto mt-20 grid max-w-md grid-cols-1 gap-8 lg:max-w-7xl lg:grid-cols-3">
          {features.map((feature) => {
            return (
              <PricingCard key={feature.keyname}>
                <FeatureTitle>{feature.name}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
                <CTAContainer>
                  <Form method="post">
                    <input
                      type="hidden"
                      name="keyname"
                      value={feature.keyname}
                    />

                    <Button
                      disabled={!feature.isActive}
                      className="mt-8 w-full"
                      type="submit"
                    >
                      {feature.isActive ? "Gerar Conteúdo" : "Em Breve"}
                    </Button>
                  </Form>
                </CTAContainer>
              </PricingCard>
            )
          })}
        </div>
      </div>
    </div>
  )
}
