import NotFoundPage from "@/components/NotFoundPage"

import React from "react"

export default function NotFound() {
  return (
    <NotFoundPage
      message="We could not find the student you were looking for."
      btnName="Go to all students page"
      btnUrl="/students"
    />
  )
}
