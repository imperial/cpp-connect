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

  await prisma.user.upsert({
    where: { email: 'ab1223@ic.ac.uk' },
    update: {},
    create: {
      email: 'ab1223@ic.ac.uk',
      role: 'STUDENT',
    },
  })
  await prisma.user.upsert({
    where: { email: 'ma4723@ic.ac.uk' },
    update: {},
    create: {
      email: 'ma4723@ic.ac.uk',
      role: 'STUDENT',
    },
  })

  const positions = []
  for (let i = 0; i < 50; i++) {
    positions.push(createFakeOpportunity())
  }

  const events = []
  for (let i = 0; i < 30; i++) {
    events.push(createFakeEvent())
  }

  await prisma.companyProfile.upsert({
    where: { name: "Doc EdTech" },
    update: {
        summary: "Technological innovation drives the growth of Amazon and we're delighted to be offering exciting internship and graduate opportunities for Software Development Engineers. Whether it's in our UK Headquarters or Development Centres (Edinburgh, Dublin, Central London) or Seattle, you could be working on a number of initiatives for Amazons global websites and services. For ambitious graduates, like you, intent on developing a successful career, the result is a technical learning environment quite unlike any other. Work Hard. Have Fun. Make History. To find out more see our UK Opportunities and our US Opportunities.",
        hq: "Slough, UK",
        founded: "1994",
        size: "10000+",
    },
    create: {
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