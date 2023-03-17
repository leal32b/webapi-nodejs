export interface Translator {
  t: (key: string, opt?: { lng: string }) => string
}
