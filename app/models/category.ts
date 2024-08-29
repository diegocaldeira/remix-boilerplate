import type { Category } from "@prisma/client"

import { prisma } from "@/services/db/db.server"

export const getCategoryById = async (id: Category["id"]) => {
  return await prisma.category.findUnique({
    where: { id },
  })
}

export const getCategoryByUserId = async (projectId: Category["projectId"]) => {
  return await prisma.category.findMany({
    where: { projectId: { equals: projectId } },
  })
}

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    include: {},
  })
}

export const getAllCategoriesActive = async () => {
  return await prisma.category.findMany({
    where: { isActive: true },
    include: {},
  })
}
