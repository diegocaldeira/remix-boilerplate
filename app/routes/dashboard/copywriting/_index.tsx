import { redirect } from "@remix-run/node"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"

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
  const keyname = formData.get("keyname")

  console.log("copywriting - home " + keyname)

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
    <div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-4xl text-left">
          <h1 className="wrap-balance mt-16 bg-black bg-gradient-to-br bg-clip-text text-left text-4xl font-medium leading-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:text-5xl sm:leading-tight">
            Sala de Redação
          </h1>
        </div>
        <p className="wrap-balance mt-6 text-left text-lg font-light leading-6 text-muted-foreground">
          Quer você seja um profissional de marketing experiente ou esteja
          apenas começando, nossas ferramentas de IA estão aqui para ajudá-lo a
          criar textos atraentes com facilidade.
          <br />
          <br />
          Descubra uma variedade de fórmulas comprovadas de direitos autorais
          projetadas para aprimorar suas campanhas de marketing, incluindo{" "}
          <b>4C's</b>, <b>STAR</b>, <b>PAS</b>, <b>AIDPPC</b>, <b>3R's</b>,{" "}
          <b>Emotional Triggers</b>, <b>ACCA</b>, <b>OATH</b>, <b>FAB</b>,{" "}
          <b>BAB</b>, <b>AIDA</b> e <b>APP</b>.<br />
          <br />
          Basta inserir seus dados e deixar nossa IA gerar conteúdo persuasivo
          que repercuta em seu público.
          <br />
          Explore as fórmulas abaixo para começar!
        </p>
        <div className="mt-16 flex justify-center"></div>

        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:max-w-7xl lg:grid-cols-3">
          {features.map((feature) => {
            return (
              <PricingCard key={feature.keyname}>
                <FeatureTitle>{feature.name}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
                <FeatureListContainer>
                  {(feature.listOfFeatures as FeatureType[]).map(
                    (feature, index) => (
                      <Feature
                        key={index}
                        name={feature.name}
                        isAvailable={feature.isAvailable}
                        inProgress={feature.inProgress}
                      />
                    )
                  )}
                </FeatureListContainer>
                <CTAContainer>
                  <Form method="post">
                    <input type="hidden" name="keyname" value={feature.id} />

                    <Button className="mt-8 w-full" type="submit">
                      Gerar Conteúdo
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
