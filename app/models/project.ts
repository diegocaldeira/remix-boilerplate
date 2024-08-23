import type { Project } from "@prisma/client"

import { prisma } from "@/services/db/db.server"

export const getProjectById = async (id: Project["id"]) => {
  return await prisma.project.findUnique({
    where: { id },
  })
}

export const getProjectByUserId = async (userId: Project["userId"]) => {
  return await prisma.project.findMany({
    where: { userId: { equals: userId } },
  })
}

export const getProjectByUserIdAndKeyname = async (
  keyname: Project["keyname"],
  userId: Project["userId"]
) => {
  return await prisma.project.findMany({
    where: { keyname: { equals: keyname }, userId: { equals: userId } },
  })
}

export const getAllProjects = async () => {
  return await prisma.project.findMany({
    // where: { isActive: true },
    include: {},
  })
}
