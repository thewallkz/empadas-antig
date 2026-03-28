import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/app/generated/prisma'

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL

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
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
