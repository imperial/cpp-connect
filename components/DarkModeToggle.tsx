"use client"

import { IconButton, Tooltip } from "@radix-ui/themes"
import { useTheme } from "next-themes"
import { useEffect } from "react"
import { BsFillMoonFill, BsSunFill } from "react-icons/bs"
import { useMediaQuery } from "react-responsive"

let previousSystemTheme: boolean

const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme()

  const prefersDarkMode = useMediaQuery({ query: "(prefers-color-scheme: dark)" })

  // Save the initial system theme
  useEffect(() => {
    previousSystemTheme = prefersDarkMode
  }, [])

  // Update the theme when the system theme actively changes while the user is on the page
  useEffect(() => {
    if (previousSystemTheme !== prefersDarkMode) {
      previousSystemTheme = prefersDarkMode
      setTheme(prefersDarkMode ? "dark" : "light")
    }
  }, [prefersDarkMode, setTheme])

  return (
    <Tooltip content={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
      <IconButton variant="solid" radius="full" size="3" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        {theme === "dark" ? <BsSunFill size="1.5em" /> : <BsFillMoonFill size="1.5em" />}
      </IconButton>
    </Tooltip>
  )
}

export default DarkModeToggle
