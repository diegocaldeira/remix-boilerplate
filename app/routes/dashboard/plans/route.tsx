import { useState } from "react"
import { redirect } from "@remix-run/node"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"

import { getformattedCurrency } from "@/lib/utils"
import { authenticator } from "@/services/auth.server"
import { createCheckoutSession } from "@/models/checkout"
import { getAllPlans, getPlanByIdWithPrices } from "@/models/plan"
import { getSubscriptionByUserId } from "@/models/subscription"
import { getUserById } from "@/models/user"
import { getUserCurrencyFromRequest } from "@/utils/currency"
import {
  CTAContainer,
  FeaturedBadgeContainer,
  FeatureListContainer,
  PricingCard,
} from "@/components/pricing/containers"
import type { FeatureType } from "@/components/pricing/feature"
import {
  Feature,
  FeatureDescription,
  FeaturePrice,
  FeatureTitle,
} from "@/components/pricing/feature"
import { PricingSwitch } from "@/components/pricing/pricing-switch"
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

  const defaultCurrency = getUserCurrencyFromRequest(request)

  let plans = await getAllPlans()

  plans = plans
    .map((plan) => {
      return {
        ...plan,
        prices: plan.prices
          .filter((price) => price.currency === defaultCurrency)
          .map((price) => ({
            ...price,
            amount: price.amount / 100,
          })),
      }
    })
    .sort((a, b) => a.prices[0].amount - b.prices[0].amount)

  return {
    plans,
    subscription,
    defaultCurrency,
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const planId = formData.get("planId")
  const interval = formData.get("interval") as "mensal" | "anual"
  const currency = formData.get("currency") as string

  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  if (!planId || !interval) {
    return redirect("/dashboard/plans")
  }

  const dbPlan = await getPlanByIdWithPrices(planId as string)

  if (!dbPlan) {
    return redirect("/dashboard/plans")
  }

  const user = await getUserById(session.id)

  const price = dbPlan.prices.find(
    (p) => p.interval === interval && p.currency === currency
  )

  if (!price) {
    return redirect("/dashboard/plans")
  }

  const checkout = await createCheckoutSession(
    user?.customerId as string,
    price.stripePriceId,
    `${process.env.HOST_URL}/dashboard/plans`,
    `${process.env.HOST_URL}/dashboard/plans`
  )

  if (!checkout) {
    return redirect("/dashboard/plans")
  }

  return redirect(checkout.url as string)
}

export default function PlansPage() {
  const { plans, subscription, defaultCurrency } =
    useLoaderData<typeof loader>()
  const [interval, setInterval] = useState<"month" | "year">("month")
  // render shadcn ui pricing table using Card

  return (
    <div>
      <div className="mx-auto max-w-7xl px-6 text-left lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="wrap-balance mt-16 bg-black bg-gradient-to-br bg-clip-text text-4xl font-medium leading-tight text-transparent dark:from-white dark:to-[hsla(0,0%,100%,.5)] sm:text-5xl sm:leading-tight">
            Escolha o Plano Perfeito para Impulsionar Suas Campanhas
          </h1>
        </div>
        <div className="mx-auto max-w-5xl">
          <p className="wrap-balance text-md mt-6 font-light leading-7">
            Transforme suas ideias em campanhas de sucesso com nossos planos
            personalizados para atender às suas necessidades. Oferecemos opções
            que escalam com o seu crescimento.
          </p>
          <p className="wrap-balance text-md mt-6 font-light leading-7">
            Acesse ferramentas de IA avançadas, crie conteúdos irresistíveis e
            veja sua marca ganhar destaque. Escolha o plano ideal e comece a
            dominar o marketing com inteligência!
          </p>
        </div>
        <div className="mt-16 flex justify-center"></div>
        <PricingSwitch
          onSwitch={(value) => setInterval(value === "0" ? "Mensal" : "Anual")}
        />

        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:max-w-5xl lg:grid-cols-3">
          {plans.map((plan) => {
            const discount = plan.prices[0].amount * 12 - plan.prices[1].amount
            const showDiscount =
              interval === "year" && plan.prices[0].amount !== 0
            const planPrice = plan.prices.find(
              (p) => p.currency === defaultCurrency && p.interval == interval
            )?.amount as number

            return (
              <PricingCard key={plan.id} isFeatured={showDiscount}>
                {showDiscount && discount > 0 && (
                  <FeaturedBadgeContainer>
                    Save {getformattedCurrency(discount, defaultCurrency)}
                  </FeaturedBadgeContainer>
                )}
                <FeatureTitle>{plan.name}</FeatureTitle>
                <FeatureDescription>{plan.description}</FeatureDescription>
                <FeaturePrice
                  interval={interval}
                  price={getformattedCurrency(planPrice, defaultCurrency)}
                />
                <FeatureListContainer>
                  {(plan.listOfFeatures as FeatureType[]).map(
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
                    <input type="hidden" name="planId" value={plan.id} />
                    <input type="hidden" name="interval" value={interval} />
                    <input
                      type="hidden"
                      name="currency"
                      value={defaultCurrency}
                    />

                    <Button
                      className="mt-8 w-full"
                      disabled={subscription?.planId === plan.id}
                      type="submit"
                    >
                      {subscription?.planId === plan.id
                        ? "Seu Plano Ativo"
                        : "Escolher Plano"}
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
