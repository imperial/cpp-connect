import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { email: 'ab1223@ic.ac.uk' },
    update: {},
    create: {
      email: 'ab1223@ic.ac.uk',
    },
  })
  await prisma.user.upsert({
    where: { email: 'ma4723@ic.ac.uk' },
    update: {},
    create: {
      email: 'ma4723@ic.ac.uk',
    },
  })

  await prisma.company.upsert({
    where: { id: "1234"},
    update: {},
    create: { id: "1234" },
  })

  await prisma.opportunity.upsert({
    where: { opportunityID: "1"},
    update: {},
    create: { opportunityID: "1",
      position: "software engineer",
      location: "london",
      available: true,
      type: "internship",
      companyID: "1234"
    }
  })

  await prisma.opportunity.upsert({
    where: { opportunityID: "2"},
    update: {},
    create: { opportunityID: "2",
      position: "prompt engineer",
      location: "mars",
      available: false,
      type: "job",
      companyID: "1234"
    }
  })

  const opportunities = await prisma.opportunity.findMany()
  console.log(opportunities)

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })