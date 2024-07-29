export interface Task {
  /** Id of the task */
  id: number
  /**
   * What the task itself is
   * @example Bake a cake
   */
  task: string
  /**
   * Name of the file in the upload directory
   * @example example.png
   */
  file: string
  /** Task completion status */
  completed: boolean
}
