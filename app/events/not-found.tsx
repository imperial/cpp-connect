import NotFoundPage from "@/components/NotFoundPage"

import React from "react"

export default function NotFound() {
  return (
    <NotFoundPage
      message="We could not find the event you were looking for."
      btnName="Go to all events page"
      btnUrl="/events"
    />
  )
}
