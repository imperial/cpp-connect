"use client"

import { SLUG_START, slugComputer } from "@/app/companies/slug"
import { updateCompany } from "@/lib/crud/companies"
import { ServerSideFormHandler } from "@/lib/types"

import { FormInModal } from "./forms/FormInModal"
import { GenericFormModal } from "./modals/GenericFormModal"

import { MDXEditorMethods } from "@mdxeditor/editor"
import { CompanyProfile } from "@prisma/client"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Pencil1Icon } from "@radix-ui/react-icons"
import { Tooltip } from "@radix-ui/themes"
import { Card, Flex, IconButton, Text, TextField } from "@radix-ui/themes"
import dynamic from "next/dynamic"
import React, { useRef, useState } from "react"

const MdEditor = dynamic(() => import("@/components/MdEditor"), { ssr: false })

const EditCompanyForm = ({ close, prevCompanyProfile }: { close: () => void; prevCompanyProfile: CompanyProfile }) => {
  const updateCompanyWithID: ServerSideFormHandler = (prevState, formData) =>
    updateCompany(prevState, formData, prevCompanyProfile.id)

  const [summary, setSummary] = useState(prevCompanyProfile.summary)
  const mdxEditorRef = useRef<MDXEditorMethods>(null)

  const [companyName, setCompanyName] = useState(prevCompanyProfile.name)
  const [slug, setSlug] = useState(prevCompanyProfile.slug)

  return (
    <FormInModal action={updateCompanyWithID} close={close}>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Company Name*
        </Text>
        <TextField.Root
          name="name"
          placeholder="e.g. Imperial College London"
          required
          onChange={e => {
            setCompanyName(e.target.value)
            setSlug(slugComputer(e.target.value))
          }}
          value={companyName}
        />
      </label>
      <label>
        <Flex direction="row" align="center" gap="1">
          <Text as="div" size="2" mb="1" weight="bold">
            Slug*
          </Text>
          <Tooltip content="Used to access the company in the URL. Must be unique.">
            <InfoCircledIcon style={{ marginBottom: "3px" }} />
          </Tooltip>
        </Flex>
        <Flex direction="row" gap="1" align="center">
          <Text>{SLUG_START}</Text>
          <TextField.Root name="slug" required value={slug} onChange={e => setSlug(e.target.value)} />
        </Flex>
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Summary
        </Text>
        <Card>
          <MdEditor markdown={summary} editorRef={mdxEditorRef} onChange={setSummary} />
        </Card>
        <input type="hidden" readOnly name="summary" value={summary} />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Website*
        </Text>
        <TextField.Root
          name="website"
          placeholder="site@example.com"
          required
          defaultValue={prevCompanyProfile.website}
          type="url"
        />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Sector*
        </Text>
        <TextField.Root name="sector" placeholder="e.g. Education" required defaultValue={prevCompanyProfile.sector} />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Size
        </Text>
        <TextField.Root name="size" placeholder="e.g. 100+" defaultValue={prevCompanyProfile.size ?? undefined} />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Headquarters
        </Text>
        <TextField.Root name="hq" placeholder="e.g. London" defaultValue={prevCompanyProfile.hq ?? undefined} />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Contact Email
        </Text>
        <TextField.Root
          name="email"
          placeholder="mail@company.com"
          defaultValue={prevCompanyProfile.email ?? undefined}
        />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Contact Phone
        </Text>
        <TextField.Root name="phone" placeholder="07123456789" defaultValue={prevCompanyProfile.phone ?? undefined} />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Founded
        </Text>
        <TextField.Root name="founded" placeholder="e.g. 1984" defaultValue={prevCompanyProfile.founded ?? undefined} />
      </label>
    </FormInModal>
  )
}

export const EditCompany = ({ prevCompanyProfile }: { prevCompanyProfile: CompanyProfile }) => {
  const formRenderer = ({ close }: { close: () => void }) => (
    <EditCompanyForm close={close} prevCompanyProfile={prevCompanyProfile} />
  )

  return (
    <GenericFormModal title="Edit company" form={formRenderer}>
      <IconButton size="3" mt="3">
        <Pencil1Icon />
      </IconButton>
    </GenericFormModal>
  )
}
