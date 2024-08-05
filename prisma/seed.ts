import { PrismaClient, Event } from '@prisma/client'
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient()

function createFakeOpportunity() {
  return {
    position: faker.person.jobTitle(),
    type: faker.person.jobType(),
    location: faker.location.city(),
    available: faker.datatype.boolean(0.75),
  }
}

function createFakeEvent(): Omit<Event, "id" | "companyID" | "createdAt" | "updatedAt"> {
  return {
    title: faker.company.buzzPhrase(),
    dateStart: faker.date.recent(),
    dateEnd: faker.date.future(),
    shortDescription: faker.lorem.sentences(2),
    richSummary: faker.lorem.paragraphs(3),
    spaces: faker.number.int(1000),
    location: faker.location.city(),
    link: faker.internet.url(),
  }
}

async function main() {
  // await prisma.user.upsert({
  //   where: { email: 'ab1223@ic.ac.uk' },
  //   update: {},
  //   create: {
  //     email: 'ab1223@ic.ac.uk',
  //   },
  // })
  // await prisma.user.upsert({
  //   where: { email: 'ma4723@ic.ac.uk' },
  //   update: {},
  //   create: {
  //     email: 'ma4723@ic.ac.uk',
  //   },
  // })


  const positions = []
  for (let i = 0; i < 50; i++) {
    positions.push(createFakeOpportunity())
  }

  const events = []
  for (let i = 0; i < 30; i++) {
    events.push(createFakeEvent())
  }

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
        create: positions
      },
      events: {
        create: events
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