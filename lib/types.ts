export interface FormPassBackState {
  message?: string
  status?: "success" | "error"
}

export type ServerSideFormHandler<T extends FormPassBackState = FormPassBackState> = (
  prevState: T,
  formData: FormData,
) => Promise<T>
