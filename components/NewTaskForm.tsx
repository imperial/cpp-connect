import { auth } from "@/lib/auth"
import { createTask } from "@/lib/tasks"

import React from "react"

/**
 * Form to add a new task
 */
const NewTaskForm: React.FC = async () => {
  const session = await auth()

  const handleSubmit = async (data: FormData) => {
    "use server"
    await createTask(data, session)
  }

  return (
    <form action={handleSubmit}>
      <div>
        <label htmlFor="task">Task Name:</label>
        <input type="text" id="task" name="task" required />
      </div>
      <div>
        <label htmlFor="fileUpload">Upload File:</label>
        <input type="file" id="fileUpload" name="fileUpload" required />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

export default NewTaskForm
