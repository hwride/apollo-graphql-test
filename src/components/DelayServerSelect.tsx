import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { SET_SERVER_DELAY } from '../examples/queries.ts'
import { LabelledSelect } from './ui/LabelledSelect.tsx'

export function DelayServerSelect() {
  const [delayMs, setDelayMs] = useState(2000)
  const [setServerDelay] = useMutation(SET_SERVER_DELAY, {
    variables: {
      delayMs,
    },
  })
  return (
    <LabelledSelect
      label="Delay server response (ms)"
      selectClassName="font-mono"
      value={String(delayMs)}
      onOptionChange={(newMs) => {
        setDelayMs(Number(newMs))
        setServerDelay({
          variables: {
            delayMs: Number(newMs),
          },
        })
      }}
    >
      <option value="0">0</option>
      <option value="1000">1000</option>
      <option value="2000">2000</option>
      <option value="3000">3000</option>
      <option value="4000">4000</option>
    </LabelledSelect>
  )
}
