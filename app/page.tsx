import { auth } from "@/auth"
import Auth from "@/components/Auth"
import Navbar from "@/components/Navbar"

import "./globals.scss"
import styles from "./page.module.scss"

const Home = async () => {
  return <main className={styles.main}></main>
}

export const dynamic = "force-dynamic"
export default Home
