"use client"

import { toggleCheckbox } from "@/lib/tasks"
import { Task } from "@/lib/types"

import React from "react"

interface TodoItemProps {
  task: Task
}

/**
 * Individual todo item with a checkbox to mark it complete
 */
const TodoItem: React.FC<TodoItemProps> = ({ task: { id, task, file, completed } }) => {
  return (
    <div>
      <input
        type="checkbox"
        defaultChecked={completed}
        id={`task-${id}`}
        onChange={event => toggleCheckbox(event.target.checked, id)}
      />
      <label htmlFor={`task-${id}`} style={completed ? { textDecoration: "line-through" } : {}}>
        {" "}
        {task}
      </label>{" "}
      (
      <a href={`/api/uploads?file=${file}`} target="_blank" rel="noopener noreferrer">
        open <u>{file} ↗️</u>
      </a>
      )
      <br />
    </div>
  )
}

export default TodoItem
