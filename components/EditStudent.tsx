"use client"

import { DangerZone } from "@/components/DeleteStudent"
import DialogTOS from "@/components/DialogTOS"
import { updateStudent } from "@/lib/crud/students"
import { ServerSideFormHandler } from "@/lib/types"

import Chip from "./Chip"
import FileInput from "./FileInput"
import { FormInModal } from "./forms/FormInModal"
import { GenericFormModal } from "./modals/GenericFormModal"

import { MDXEditorMethods } from "@mdxeditor/editor"
import { OpportunityType, StudentProfile } from "@prisma/client"
import { PlusIcon } from "@radix-ui/react-icons"
import { Pencil1Icon } from "@radix-ui/react-icons"
import { Select } from "@radix-ui/themes"
import { Card, Flex, IconButton, Text, TextField } from "@radix-ui/themes"
import { format } from "date-fns"
import dynamic from "next/dynamic"
import React, { useRef, useState } from "react"

const NUM_YEARS_DROPDOWN = 10
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const YEARS = Array.from({ length: NUM_YEARS_DROPDOWN }, (_, i) => i + new Date().getFullYear())

const MdEditor = dynamic(() => import("@/components/MdEditor"), { ssr: false })

const EditStudentForm = ({
  close,
  prevStudentProfile,
  isAdmin,
}: {
  close: () => void
  prevStudentProfile: StudentProfile
  isAdmin: boolean
}) => {
  const updateStudentWithID: ServerSideFormHandler = (prevState, formData) =>
    updateStudent(prevState, formData, prevStudentProfile.userId)

  const [bio, setBio] = useState(prevStudentProfile.bio ?? "")
  const [acceptedTOS, setAcceptedTOS] = useState(prevStudentProfile.acceptedTOS || isAdmin)
  const mdxEditorRef = useRef<MDXEditorMethods>(null)

  const [skill, setSkill] = useState("")
  const [skills, setSkills] = useState(prevStudentProfile.skills)

  const [interest, setInterest] = useState("")
  const [interests, setInterests] = useState(prevStudentProfile.interests)

  const TosDialogButton = () => <DialogTOS accept={() => setAcceptedTOS(true)} />

  const addSkill = () => {
    if (skills.includes(skill.trim())) return

    if (skill) {
      setSkills([...skills, skill])
    }
    setSkill("")
  }

  const addInterest = () => {
    if (interests.includes(interest.trim())) return

    if (interest) {
      setInterests([...interests, interest])
    }
    setInterest("")
  }

  return (
    <>
      <FormInModal action={updateStudentWithID} close={close} submitButton={!acceptedTOS ? TosDialogButton : undefined}>
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
            Graduation Date
          </Text>
          <Flex gap="2">
            <Select.Root
              name="gradMonth"
              defaultValue={
                prevStudentProfile.graduationDate ? format(prevStudentProfile.graduationDate, "MMM") : undefined
              }
            >
              <Select.Trigger placeholder="Month" />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Month</Select.Label>
                  {MONTHS.map((month, id) => (
                    <Select.Item key={id} value={month}>
                      {month}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
            <Select.Root
              name="gradYear"
              defaultValue={
                prevStudentProfile.graduationDate ? format(prevStudentProfile.graduationDate, "yyyy") : undefined
              }
            >
              <Select.Trigger placeholder="Year" />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Year</Select.Label>
                  {YEARS.map((year, id) => (
                    <Select.Item key={id} value={year.toString()}>
                      {year}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </Flex>
        </label>

        <FileInput name="cv" header="CV" />
        <FileInput name="avatar" header="Profile Picture" />

        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Looking For
          </Text>

          <Select.Root name="lookingFor" defaultValue={prevStudentProfile.lookingFor ?? undefined}>
            <Select.Trigger placeholder="Looking for" />
            <Select.Content>
              <Select.Group>
                <Select.Label>Looking for</Select.Label>
                {Object.values(OpportunityType).map((type, id) => (
                  <Select.Item key={id} value={type}>
                    {type.replaceAll("_", " ")} {/* Sorts e.g. Not_Looking_For in the enum to Not Looking For */}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
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
            Skills
          </Text>
          <Flex gap="2" direction="column">
            <Flex gap="2">
              <TextField.Root
                value={skill}
                onChange={e => setSkill(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSkill()
                  }
                }}
                placeholder="e.g. Python"
                style={{ flexGrow: 1 }}
              />
              <IconButton size="2" onClick={addSkill} type="button">
                <PlusIcon />
              </IconButton>
            </Flex>
            <Flex gap="1" wrap="wrap">
              {skills.map((skill, id) => (
                <Chip label={skill} key={id} deletable onDelete={() => setSkills(skills.filter(val => val != skill))} />
              ))}
              {!skills.length && <Text>No skills added yet</Text>}
            </Flex>
          </Flex>
          <input type="hidden" readOnly name="skills" value={JSON.stringify(skills)} />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Interests
          </Text>
          <Flex gap="2" direction="column">
            <Flex gap="2">
              <TextField.Root
                value={interest}
                onChange={e => setInterest(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addInterest()
                  }
                }}
                placeholder="e.g. Game development"
                style={{ flexGrow: 1 }}
              />
              <IconButton size="2" onClick={addInterest} type="button">
                <PlusIcon />
              </IconButton>
            </Flex>
            <Flex gap="1" wrap="wrap">
              {interests.map((interest, id) => (
                <Chip
                  label={interest}
                  key={id}
                  deletable
                  onDelete={() => setInterests(interests.filter(val => val != interest))}
                />
              ))}
              {!interests.length && <Text>No interests added yet</Text>}
            </Flex>
          </Flex>
          <input type="hidden" readOnly name="interests" value={JSON.stringify(interests)} />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Website
          </Text>
          <TextField.Root
            name="website"
            placeholder="https://site@example.com"
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
        <input type="checkbox" name="acceptedTOS" checked={acceptedTOS} style={{ visibility: "hidden" }} readOnly />
      </FormInModal>
      <DangerZone id={prevStudentProfile.userId} />
    </>
  )
}

export const EditStudent = ({
  prevStudentProfile,
  isAdmin,
}: {
  prevStudentProfile: StudentProfile
  isAdmin: boolean
}) => {
  const formRenderer = ({ close }: { close: () => void }) => (
    <EditStudentForm close={close} prevStudentProfile={prevStudentProfile} isAdmin={isAdmin} />
  )

  return (
    <GenericFormModal title="Edit Your Profile" form={formRenderer}>
      <IconButton size="3">
        <Pencil1Icon />
      </IconButton>
    </GenericFormModal>
  )
}
