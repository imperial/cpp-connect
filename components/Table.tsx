import type { Company, Opportunity } from "@prisma/client"
import { Table } from "@radix-ui/themes"
import React from "react"

interface ListingTableProps {
  opportunities: ({ company: Company } & Opportunity)[]
}

const formatDate = (date: Date): string => {
  const MILLIS_PER_MINUTE = 60000
  const MILLIS_PER_HOUR = 3600000
  const MILLIS_PER_DAY = 86400000
  const MILLIS_PER_WEEK = 604800000

  const currentDate = new Date()
  // get difference in milliseconds
  const difference = currentDate.getTime() - date.getTime()
  if (difference < MILLIS_PER_MINUTE) {
    return "Just now"
  } else if (difference < MILLIS_PER_HOUR) {
    return `${Math.floor(difference / MILLIS_PER_MINUTE)} minutes ago`
  } else if (difference < MILLIS_PER_DAY) {
    return `${Math.floor(difference / MILLIS_PER_HOUR)} hours ago`
  } else if (difference < MILLIS_PER_WEEK) {
    return `${Math.floor(difference / MILLIS_PER_DAY)} days ago`
  } else {
    return date.toLocaleDateString()
  }
}

const ListingTable = ({ opportunities }: ListingTableProps) => {
  return (
    <Table.Root size="3">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Company</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Position</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Posted</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {opportunities
          .filter(opportunity => opportunity.available)
          .map((opportunity, index) => (
            <Table.Row key={index}>
              <Table.RowHeaderCell>{opportunity.company.id}</Table.RowHeaderCell>
              <Table.Cell>{opportunity.position}</Table.Cell>
              <Table.Cell>{opportunity.location}</Table.Cell>
              <Table.Cell>{opportunity.type}</Table.Cell>
              <Table.Cell>{formatDate(opportunity.createdAt)}</Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table.Root>
  )
}

export default ListingTable
