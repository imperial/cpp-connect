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

  await prisma.companyProfile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Doc EdTech",
      summary: "We the best",
      sector: "Education",
      logo: "",
      website: "https://scientia.doc.ic.ac.uk",
      opportunities: {
        create: [
          {
            position: "software engineer",
            location: "london",
            available: true,
            type: "internship",
          },
          {
            position: "prompt engineer",
            location: "mars",
            available: false,
            type: "job",
          }
        ]
      }
    },
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