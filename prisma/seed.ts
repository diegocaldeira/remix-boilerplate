import { PrismaClient } from "@prisma/client"
import type { Stripe } from "stripe"

import { DEFAULT_FEATURES } from "@/services/copywriting/features.config"
import { DEFAULT_PLANS } from "@/services/stripe/plans.config"
import {
  createStripePrice,
  createStripeProduct,
} from "@/services/stripe/stripe.server"

const prisma = new PrismaClient()

const seed = async () => {
  const plans = await prisma.plan.findMany()

  const features = await prisma.feature.findMany()

  if (features.length === 0) {
    const featuresPromises = Object.values(DEFAULT_FEATURES).map(
      async (feature) => {
        const {
          keyname,
          name,
          description,
          observations,
          example,
          isActive,
          listOfFeatures,
        } = feature

        await prisma.feature.create({
          data: {
            keyname,
            name,
            description,
            observations,
            example,
            isActive,
            listOfFeatures: listOfFeatures as any,
          },
        })

        return {
          response: 200,
        }
      }
    )
  } else {
    console.log("Features already seeded")
    return
  }

  if (plans.length === 0) {
    const planPromises = Object.values(DEFAULT_PLANS).map(async (plan) => {
      const { limits, prices, name, description, isActive, listOfFeatures } =
        plan

      const pricesByInterval = Object.entries(prices).flatMap(
        ([interval, price]) => {
          return Object.entries(price).map(([currency, amount]) => ({
            interval,
            currency,
            amount,
          }))
        }
      )

      const stripeProduct = await createStripeProduct({
        name,
        description,
      })

      const stripePrices = await Promise.all(
        pricesByInterval.map((price) =>
          createStripePrice(stripeProduct.id, {
            ...price,
            amount: price.amount * 100,
            nickname: name,
          })
        )
      )

      await prisma.plan.create({
        data: {
          name,
          description,
          isActive,
          listOfFeatures: listOfFeatures as any,
          limits: {
            create: limits,
          },
          stripePlanId: stripeProduct.id,
          prices: {
            create: stripePrices.map((price) => ({
              interval: price?.recurring?.interval || "month",
              currency: price.currency,
              amount: price.unit_amount || 0,
              nickname: price.nickname,
              isActive: true,
              stripePriceId: price.id,
            })),
          },
        },
      })

      return {
        product: stripeProduct.id,
        prices: stripePrices.map((price) => price.id),
      }
    })

    const products: Stripe.BillingPortal.ConfigurationCreateParams.Features.SubscriptionUpdate.Product[] =
      await Promise.all(planPromises)
  } else {
    console.log("Plans already seeded")
    return
  }

  //await setupStripeCustomerPortal(products);
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    console.log("Seeding done")
    await prisma.$disconnect()
  })
