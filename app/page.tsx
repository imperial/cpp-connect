import { auth } from "@/auth"
import Auth from "@/components/Auth"
import Navbar from "@/components/Navbar"

import styles from "./page.module.css"

const Home = async () => {
  return <main className={styles.main}></main>
}

export const dynamic = "force-dynamic"
export default Home
