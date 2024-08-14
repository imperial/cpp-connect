"use client"

import { SuccessCallout } from "@/components/Callouts"
import Link from "@/components/Link"

import { EnvelopeClosedIcon } from "@radix-ui/react-icons"
import { Button, Flex, Heading, Separator, Spinner, Text, TextField } from "@radix-ui/themes"
import { signIn } from "next-auth/react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import React, { useEffect, useState, useTransition } from "react"

const SuccessPage = () => {
  return <SuccessCallout message="Check your inbox for a link to sign in" style={{ width: "100%" }} />
}

export default SuccessPage
