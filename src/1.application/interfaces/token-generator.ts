export default interface TokenGenerator {
  generate: (id: string) => Promise<string>
}
