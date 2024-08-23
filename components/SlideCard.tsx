"use client"

import { Card, CardProps } from "@radix-ui/themes"
import { useInView } from "framer-motion"
import React, { useRef } from "react"

const SlideCard = (props: CardProps & React.RefAttributes<HTMLDivElement> & { direction?: "left" | "right" }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-30%" })

  return (
    <Card
      {...props}
      ref={ref}
      style={{
        transform: isInView ? "none" : props.direction === "left" ? "translateX(-200px)" : "translateX(200px)",
        opacity: isInView ? 1 : 0,
        transition: "all cubic-bezier(0.17, 0.55, 0.55, 1) 0.3s",
      }}
    />
  )
}

export default SlideCard
