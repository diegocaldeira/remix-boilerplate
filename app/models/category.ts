import type { Category } from "@prisma/client"

import { prisma } from "@/services/db/db.server"

export const getCategoryById = async (id: Category["id"]) => {
  return await prisma.category.findUnique({
    where: { id },
  })
}

export const getCategoryByKeyname = async (keyname: Category["keyname"]) => {
  return await prisma.category.findFirst({
    where: { keyname: keyname },
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
