import React from 'react'
import prisma from "@/lib/db"
import { notFound } from 'next/navigation';
import { Flex, Text } from '@radix-ui/themes';

const CompanyPage = async ({ params }: { params: { id: string } }) => {
  const companyProfile = await prisma.companyProfile.findUnique({where: {id: parseInt(params.id)}})

  if (!companyProfile) {
    notFound()
  }

  return (
    <Flex direction="column">
      <Flex>
        <Text>{companyProfile.name}</Text>
      </Flex>
      <Flex>
        <Text>Summary</Text>
      <Text>{companyProfile.summary}</Text>
      </Flex>
      <Flex direction="row" wrap="wrap">
        <Flex >
          <Text>Sector</Text>
          <Text>{companyProfile.sector}</Text>
        </Flex>
        <Flex >
          <Text>Size</Text>
          <Text>{companyProfile.size ?? "N/A"}</Text>
        </Flex>
        <Flex >
          <Text>HQ</Text>
          <Text>{companyProfile.hq ?? "N/A"}</Text>
        </Flex>
        <Flex >
          <Text>Founded</Text>
          <Text>{companyProfile.founded ?? "N/A"}</Text>
        </Flex>
        <Flex >
          <Text>Contacts</Text>
          <Text>{companyProfile.website}</Text>
          <Text>{companyProfile.email ?? "N/A"}</Text>
          <Text>{companyProfile.phone ?? "N/A"}</Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default CompanyPage