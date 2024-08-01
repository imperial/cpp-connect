import type { Company, Opportunity } from "@prisma/client"
import { Table } from "@radix-ui/themes"
import { formatDistanceToNowStrict } from "date-fns"
import React from "react"

interface ListingTableProps {
  opportunities: ({ company: Company } & Opportunity)[]
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
              <Table.Cell>{formatDistanceToNowStrict(opportunity.createdAt, { addSuffix: true })}</Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table.Root>
  )
}

export default ListingTable
