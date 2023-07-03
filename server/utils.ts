export async function waitMs(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

export async function delayHelper(args: { delayMs?: number }) {
  if (args.delayMs) {
    await waitMs(args.delayMs)
  }
}
