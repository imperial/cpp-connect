import SlideCard from "@/components/SlideCard"
import "@/styling/globals.scss"

import styles from "./page.module.scss"

import * as React from "react"

const Home = async () => {
  const titles = [
    "Welcome to CPP Connect",
    "Connecting quality Imperial students with quality employers",
    "Find your next opportunity",
    "Join today",
  ]

  return (
    <main className={styles.main}>
      {titles.map((title, index) => (
        <SlideCard key={index} className={styles.slideCard} direction={index % 2 === 0 ? "left" : "right"}>
          <h1>{title}</h1>
        </SlideCard>
      ))}
    </main>
  )
}

export const dynamic = "force-dynamic"
export default Home
