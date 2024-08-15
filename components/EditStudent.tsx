"use client"

import { SLUG_START, slugComputer } from "@/app/companies/slug"
import { updateStudent } from "@/lib/crud/students"
import { ServerSideFormHandler } from "@/lib/types"

import { FormInModal } from "./forms/FormInModal"
import { GenericFormModal } from "./modals/GenericFormModal"

import { MDXEditorMethods } from "@mdxeditor/editor"
import { StudentProfile } from "@prisma/client"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Pencil1Icon } from "@radix-ui/react-icons"
import { Tooltip } from "@radix-ui/themes"
import { Card, Flex, IconButton, Text, TextField } from "@radix-ui/themes"
import dynamic from "next/dynamic"
import React, { useRef, useState } from "react"

/* Need to be able to change:
 * - Course
 * - Graduation date
 * - CV
 * - Looking for
 * - Bio
 * - Skills
 * - Interests
 * - Website
 * - GitHub
 * - LinkedIn
 */

const MdEditor = dynamic(() => import("@/components/MdEditor"), { ssr: false })

const EditStudentForm = ({ close, prevStudentProfile }: { close: () => void; prevStudentProfile: StudentProfile }) => {
  const updateStudentWithID: ServerSideFormHandler = (prevState, formData) =>
    updateStudent(prevState, formData, prevStudentProfile.userId)

  const [bio, setBio] = useState(prevStudentProfile.bio ?? "")
  const mdxEditorRef = useRef<MDXEditorMethods>(null)

  return (
    <FormInModal action={updateStudentWithID} close={close}>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Course
        </Text>
        <TextField.Root
          name="course"
          placeholder="e.g. Computing (BEng)"
          defaultValue={prevStudentProfile.course ?? undefined}
        />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Bio
        </Text>
        <Card>
          <MdEditor markdown={bio} editorRef={mdxEditorRef} onChange={setBio} />
        </Card>
        <input type="hidden" readOnly name="bio" value={bio} />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Website
        </Text>
        <TextField.Root
          name="website"
          placeholder="site@example.com"
          defaultValue={prevStudentProfile.personalWebsite ?? undefined}
          type="url"
        />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          GitHub
        </Text>
        <TextField.Root
          name="github"
          placeholder="https://github.com/username"
          defaultValue={prevStudentProfile.github ?? undefined}
          type="url"
        />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          LinkedIn
        </Text>
        <TextField.Root
          name="linkedIn"
          placeholder="https://www.linkedin.com/in/username"
          defaultValue={prevStudentProfile.linkedIn ?? undefined}
          type="url"
        />
      </label>
    </FormInModal>
  )
}

export const EditStudent = ({ prevStudentProfile }: { prevStudentProfile: StudentProfile }) => {
  const formRenderer = ({ close }: { close: () => void }) => (
    <EditStudentForm close={close} prevStudentProfile={prevStudentProfile} />
  )

  return (
    <GenericFormModal title="Edit Your Profile" form={formRenderer}>
      <IconButton size="3" mt="3">
        <Pencil1Icon />
      </IconButton>
    </GenericFormModal>
  )
}
