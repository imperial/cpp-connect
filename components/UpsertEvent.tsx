"use client"

import DateTimePicker from "@/components/DateTimePicker"
import { PlusButton } from "@/components/buttons/PlusButton"
import { FormInModal } from "@/components/forms/FormInModal"
import { GenericFormModal } from "@/components/modals/GenericFormModal"
import { TIMEZONE } from "@/lib/constants"
import { createEvent, updateEvent } from "@/lib/crud/events"
import { FormPassBackState } from "@/lib/types"

import { InfoCallout } from "./Callouts"

import { Event } from "@prisma/client"
import { Pencil1Icon } from "@radix-ui/react-icons"
import { Card, Grid, IconButton, Text, TextField } from "@radix-ui/themes"
import dynamic from "next/dynamic"
import { useState } from "react"
import { useMediaQuery } from "react-responsive"

const MdEditor = dynamic(() => import("@/components/MdEditor"), { ssr: false })

const UpsertEventForm = ({
  close,
  prevEvent,
  companyID,
}: {
  close: () => void
  prevEvent?: Event
  companyID?: number
}) => {
  const [summary, setSummary] = useState(prevEvent?.richSummary ?? "")
  const SMALL_SCREEN_PIXELS = 560
  const isSmallScreen = useMediaQuery({ query: `(max-width: ${SMALL_SCREEN_PIXELS}px)` })

  const createEventWithArgs = async (prevState: FormPassBackState, formData: FormData) =>
    createEvent(prevState, formData, companyID ?? -1)

  const updateEventWithArgs = async (prevState: FormPassBackState, formData: FormData) =>
    updateEvent(prevState, formData, companyID ?? -1, prevEvent?.id ?? -1)

  return (
    <FormInModal action={prevEvent ? updateEventWithArgs : createEventWithArgs} close={close}>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Title*
        </Text>
        <TextField.Root
          name="title"
          placeholder="E.g., Summer networking event"
          required
          defaultValue={prevEvent?.title}
        />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Location*
        </Text>
        <TextField.Root name="location" placeholder="E.g., London" required defaultValue={prevEvent?.location} />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Short Description*
        </Text>
        <TextField.Root
          name="shortDescription"
          placeholder="E.g., Networking event in London."
          required
          defaultValue={prevEvent?.location}
        />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Link*
        </Text>
        <TextField.Root
          name="link"
          placeholder="E.g., https://imperial.ic.ac.uk/event"
          required
          type="url"
          defaultValue={prevEvent?.link}
        />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Spaces*
        </Text>
        <TextField.Root name="spaces" placeholder="E.g., 100" required type="number" defaultValue={prevEvent?.spaces} />
      </label>
      <InfoCallout message={`The times correspond to the ${TIMEZONE} timezone.`} />
      <Grid columns={isSmallScreen ? "1" : "2"} rows={isSmallScreen ? "2" : "1"} gapY="3">
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Start date*
          </Text>
          <DateTimePicker
            name="dateStart"
            placeholder="Enter start date here"
            defaultDate={prevEvent?.dateStart}
            required
          />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            End date
          </Text>
          <DateTimePicker name="dateEnd" placeholder="Enter end date here" defaultDate={prevEvent?.dateEnd} />
        </label>
      </Grid>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Summary*
        </Text>
        <Card>
          <MdEditor markdown={summary} onChange={setSummary} />
        </Card>
        <input type="hidden" readOnly name="richSummary" value={summary} />
      </label>
    </FormInModal>
  )
}

const UpsertEvent = ({
  children,
  prevEvent,
  companyID,
}: {
  children: React.ReactNode
  prevEvent?: Event
  companyID: number
}) => {
  const formRenderer = ({ close }: { close: () => void }) => (
    <UpsertEventForm close={close} prevEvent={prevEvent} companyID={companyID} />
  )

  return (
    <GenericFormModal
      title={prevEvent ? "Update event" : "Add new event"}
      description={prevEvent ? "Update event details" : "Add a new event listing"}
      form={formRenderer}
    >
      {children}
    </GenericFormModal>
  )
}

export const AddEvent = ({ companyID }: { companyID: number }) => {
  return (
    <UpsertEvent companyID={companyID}>
      <PlusButton>
        <Text>Add Event</Text>
      </PlusButton>
    </UpsertEvent>
  )
}

export const EditEvent = ({ companyID, prevEvent }: { companyID: number; prevEvent: Event }) => {
  return (
    <UpsertEvent companyID={companyID} prevEvent={prevEvent}>
      <IconButton size="3">
        <Pencil1Icon />
      </IconButton>
    </UpsertEvent>
  )
}
