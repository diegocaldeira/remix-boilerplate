import type { ContentGenerated } from "@prisma/client"

import { prisma } from "@/services/db/db.server"

export const getContentGeneratedById = async (id: ContentGenerated["id"]) => {
  return await prisma.contentGenerated.findUnique({
    where: { id },
  })
}

export const getContentGeneratedByKeyname = async (
  keyname: ContentGenerated["keyname"]
) => {
  return await prisma.contentGenerated.findFirst({
    where: { keyname: keyname },
  })
}

export const getAllContentGenerated = async () => {
  return await prisma.contentGenerated.findMany({})
}

export const getAllContentGeneratedActiveByUser = async (
  userId: ContentGenerated["userId"]
) => {
  return await prisma.contentGenerated.findMany({
    where: { isActive: true, userId: userId },
  })
}
