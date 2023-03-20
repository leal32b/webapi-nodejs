export interface Logger {
  error: (label: string, message: string | Record<string, unknown> | string[]) => void
  info: (label: string, message: string | Record<string, unknown> | string[]) => void
}
