import { PrismaClient } from "@prisma/client"
import type { Stripe } from "stripe"

import { DEFAULT_CATEGORY } from "@/services/copywriting/category.config"
import { DEFAULT_FEATURES } from "@/services/copywriting/features.config"
import { DEFAULT_TOOLS } from "@/services/copywriting/tools.config"
import { DEFAULT_PLANS } from "@/services/stripe/plans.config"
import {
  createStripePrice,
  createStripeProduct,
} from "@/services/stripe/stripe.server"

const prisma = new PrismaClient()

const seed = async () => {
  const category = await prisma.category.findMany()
  const tools = await prisma.tool.findMany()
  const features = await prisma.feature.findMany()
  const plans = await prisma.plan.findMany()

  if (category.length === 0) {
    const categoryPromises = Object.values(DEFAULT_CATEGORY).map(
      async (category) => {
        const { keyname, icon, name, description, isActive, listOfFeatures } =
          category
        await prisma.category.create({
          data: {
            keyname,
            icon,
            name,
            description,
            isActive,
            listOfFeatures,
          },
        })
        return {
          response: 200,
        }
      }
    )
  } else {
    console.log("Category already seeded")
    return
  }

  if (tools.length === 0) {
    const toolsPromises = Object.values(DEFAULT_TOOLS).map(async (tool) => {
      const { keyname, icon, name, description, isActive } = tool

      await prisma.tool.create({
        data: {
          keyname,
          icon,
          name,
          description,
          isActive,
        },
      })

      return {
        response: 200,
      }
    })
  } else {
    console.log("Tools already seeded")
    return
  }

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
