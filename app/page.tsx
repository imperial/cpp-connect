import Auth from "@/components/Auth"
import NewTaskForm from "@/components/NewTaskForm"
import TodoItem from "@/components/TodoItem"
import { auth } from "@/lib/auth"
import { getTasks } from "@/lib/tasks"
import { Task } from "@/lib/types"

import styles from "./page.module.css"

import Image from "next/image"

const Home = async () => {
  const session = await auth()

  const tasks = await getTasks(session)

  return (
    <main className={styles.main}>
      <div>
        <Auth />
        {session && <NewTaskForm />}
      </div>
      <div>
        {tasks.map((task, key) => (
          <TodoItem task={task} key={key} />
        ))}
      </div>
    </main>
  )
}

export const dynamic = "force-dynamic"
export default Home
