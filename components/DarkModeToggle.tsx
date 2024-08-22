"use client"

import { IconButton, Tooltip } from "@radix-ui/themes"
import { useTheme } from "next-themes"
import { BsFillMoonFill, BsSunFill } from "react-icons/bs"

const DarkModeToggle = ({ fill = "currentColor" }: { fill?: string }) => {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Tooltip content={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}>
      <IconButton
        variant="ghost"
        radius="full"
        size="3"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        style={{ width: "fit-content", alignSelf: "center" }}
      >
        {resolvedTheme === "dark" ? (
          <BsSunFill size="1.5em" fill={fill} />
        ) : (
          <BsFillMoonFill size="1.5em" fill={fill} />
        )}
      </IconButton>
    </Tooltip>
  )
}

export default DarkModeToggle
