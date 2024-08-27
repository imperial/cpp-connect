import { Prisma, PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
  let options: ConstructorParameters<typeof PrismaClient>[0] = {}

  if (process.env.NODE_ENV === "production") {
    options = {
      datasourceUrl: `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`,
    }
  }

  return new PrismaClient(options)
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma
