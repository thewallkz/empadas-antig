import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/app/generated/prisma'

function createPrismaClient() {
  const url = process.env.DATABASE_URL?.trim()

  if (!url) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please add it to your .env file or Vercel environment variables.'
    )
  }

  return new PrismaClient({
    adapter: new PrismaPg(url),
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof createPrismaClient>
}

export function getPrisma() {
  if (!globalThis.prisma) {
    globalThis.prisma = createPrismaClient()
  }

  return globalThis.prisma
}
