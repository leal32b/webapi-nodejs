export default interface Hasher {
  hash: (value: string) => Promise<string>
}
