export async function waitMs(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}
