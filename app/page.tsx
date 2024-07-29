import Auth from "@/components/Auth"
import { auth } from "@/lib/auth"

import styles from "./page.module.css"

const Home = async () => {
  return (
    <main className={styles.main}>
      <div>
        <Auth />
      </div>
    </main>
  )
}

export const dynamic = "force-dynamic"
export default Home
