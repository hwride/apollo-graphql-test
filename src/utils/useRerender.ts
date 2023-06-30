import { useState } from 'react'

export function useRerender() {
  const [key, setKey] = useState(0)
  return {
    key,
    rerender: () => setKey((key) => key + 1),
  }
}
