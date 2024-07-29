"use server"

/**
 * Create-Read-Update-Delete (CRUD) actions for todo tasks
 * @packageDocumentation
 */
import { auth } from "@/lib/auth"

import connection from "./db"
import { Task } from "./types"

import { promises as fs } from "fs"
import { Session, User } from "next-auth"
import { revalidatePath } from "next/cache"
import { join } from "path"

/**
 * Create a Tasks table if it doesn't exist
 */
const createTableIfNotExists = async () => {
  const sql =
    "CREATE TABLE IF NOT EXISTS `tasks` (`id` INT(11) AUTO_INCREMENT, `task` TEXT, `file` TEXT, `completed` BOOLEAN DEFAULT FALSE, `uid` TEXT, PRIMARY KEY (`id`))"
  await connection.query(sql)
}

/**
 * Return true if the user is authenticated
 * @remarks Narrows the type of session
 * @param session Current SSO session
 */
const validateSession = (session: Session | null): session is { user: User; expires: string } => {
  return !!session?.user
}

/**
 * Create a new task if the user is authenticated
 * @param form Data straight from the form
 * @param session Current SSO session
 */
export const createTask = async (form: FormData, session: Session | null) => {
  if (!validateSession(session)) {
    return
  }

  const fileToUpload = form.get("fileUpload") as File
  createTableIfNotExists()
  const insertQuery = "INSERT INTO `tasks` (`task`, `file`, `uid`) VALUES (?, ?, ?)"
  await connection.query(insertQuery, [form.get("task"), fileToUpload.name, session.user.email])

  if (!process.env.UPLOAD_DIR) {
    throw new Error("UPLOAD_DIR not set")
  }

  await fs.writeFile(join(process.env.UPLOAD_DIR, fileToUpload.name), Buffer.from(await fileToUpload.arrayBuffer()))

  // force a reload of the page since the data has only been changed on the server
  revalidatePath("/")
}

/**
 * Update status of a todo task
 * @param checked Task completion status
 * @param id Task id
 */
export const toggleCheckbox = async (checked: boolean, id: number) => {
  const session = await auth()
  if (!validateSession(session)) {
    return
  }
  const query = `UPDATE \`tasks\` SET \`completed\` = ${checked ? "TRUE" : "FALSE"} WHERE \`id\` = ? AND \`uid\` = ?;`
  await connection.execute(query, [id, session.user.email])

  // force a reload of the page since the data has only been changed on the server
  revalidatePath("/")
}

/**
 * Return the list of tasks associated with the authenticated user
 * @param session Current SSO session
 */
export const getTasks = async (session: Session | null): Promise<Task[]> => {
  if (!validateSession(session)) {
    return []
  }
  createTableIfNotExists()
  const [res] = await connection.query("SELECT * FROM `tasks` WHERE `uid` = ?;", [session.user.email])

  return res as Task[]
}

/**
 * Return true if the user of the associated session owns the uploaded file
 * @param session Current SSO session
 * @param filename Name of the file
 */
export const validateFileOwner = async (session: Session | null, filename: string): Promise<boolean> => {
  if (!validateSession(session)) {
    return false
  }
  createTableIfNotExists()
  const query = "SELECT * FROM `tasks` WHERE `uid` = ? AND `file` = ?"
  const [res] = await connection.query(query, [session.user.email, filename])
  return (res as Task[]).length > 0
}
