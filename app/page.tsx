import Auth from "@/components/Auth"
import Navbar from "@/components/Navbar"
import { auth } from "@/lib/auth"

import styles from "./page.module.css"

const Home = async () => {
  return (
    <main className={styles.main}>
      <div>
        <Navbar />
        <Auth />
      </div>
    </main>
  )
}

export const dynamic = "force-dynamic"
export default Home
