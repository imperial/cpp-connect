export interface FormPassBackState {
  message?: string
  status?: "success" | "error"
}

export type ServerSideFormHandler = (prevState: FormPassBackState, formData: FormData) => Promise<FormPassBackState>
