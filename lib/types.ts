export interface FormPassBackState {
  message: string
  status: "success" | "error"
}

export type ServerSideFormHandler<
  T extends FormPassBackState = FormPassBackState,
  Args extends unknown[] = unknown[],
> = (prevState: T, formData: FormData, ...args: Args) => Promise<T>

export type ServerActionDecorator<T extends FormPassBackState, Args extends unknown[]> = (
  action: ServerSideFormHandler<T, Args>,
) => ServerSideFormHandler<T, Args>
