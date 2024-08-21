import type { Feature } from "@prisma/client"

import { prisma } from "@/services/db/db.server"

export const getFeatureById = async (id: Feature["id"]) => {
  return await prisma.feature.findUnique({
    where: { id },
  })
}

export const getFeatureByKeyname = async (keyname: Feature["keyname"]) => {
  return await prisma.feature.findMany({
    where: { keyname: { equals: keyname } },
  })
}

export const getAllFeatures = async () => {
  return await prisma.feature.findMany({
    // where: { isActive: true },
    include: {},
  })
}
