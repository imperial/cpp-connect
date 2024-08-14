import NotFoundPage from "@/components/NotFoundPage"

import React from "react"

export default function NotFound() {
  return (
    <NotFoundPage
      message="We could not find the opportunity you were looking for."
      btnName="Go to all opportunities page"
      btnUrl="/opportunitites"
    />
  )
}
