import { PrismaClient, Role, Event } from '@prisma/client'
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


function createFakeStudent() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: Role.STUDENT,
    studentProfile: {
      create: {
        bio: faker.lorem.paragraph(),
        personalWebsite: faker.internet.url(),
        lookingFor: faker.helpers.arrayElement(['Internship', 'Graduate Job', 'Part-time Job', 'Full-time Job']),
        github: faker.internet.url(),
        linkedIn: faker.internet.url(),
        course: `Computing (${faker.helpers.arrayElements(['Software Engineering', 'Artificial Intelligence', 'Machine Learning', 'Visual Computing', 'Security and Reliability', 'Management'], {min: 1, max: 2}).join(' and ')})`,
        graduationDate: faker.date.future(),
        cv: faker.system.filePath(),
        skills: faker.helpers.arrayElements(['Python', 'Java', 'C++', 'JavaScript', 'React', 'Node.js', 'SQL', 'NoSQL', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure'], {min: 1, max: 5}),
        interests: faker.helpers.arrayElements(['Web Development', 'Mobile Development', 'Machine Learning', 'Data Science', 'Cybersecurity', 'DevOps', 'Cloud Computing'], {min: 1, max: 3}),
      }
    }
  }
}

async function main() {

  const firstStudent = createFakeStudent()
  console.log("a student id: ", firstStudent.id)
  await prisma.user.create({
    data: firstStudent
  })

  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: createFakeStudent()
    })
  }

  const positions = []
  for (let i = 0; i < 10; i++) {
    positions.push(createFakeOpportunity())
  }

  const events = []
  for (let i = 0; i < 30; i++) {
    events.push(createFakeEvent())
  }

  await prisma.companyProfile.upsert({
    where: { id: 1 },
    update: {
      summary: "Technological innovation drives the growth of Amazon and we're delighted to be offering exciting internship and graduate opportunities for Software Development Engineers. Whether it's in our UK Headquarters or Development Centres (Edinburgh, Dublin, Central London) or Seattle, you could be working on a number of initiatives for Amazons global websites and services. For ambitious graduates, like you, intent on developing a successful career, the result is a technical learning environment quite unlike any other. Work Hard. Have Fun. Make History. To find out more see our UK Opportunities and our US Opportunities.",
      hq: "Slough, UK",
      founded: "1994",
      size: "10000+",
    },
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