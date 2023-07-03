import { LabelledSelect } from './ui/LabelledSelect.tsx'

export function DelayServerSelect({
  delayMs,
  setDelayMs,
}: {
  delayMs: number
  setDelayMs: (n: number) => void
}) {
  return (
    <LabelledSelect
      label="Delay server response (ms)"
      selectClassName="font-mono"
      value={String(delayMs)}
      onOptionChange={(newMs) => setDelayMs(Number(newMs))}
    >
      <option value="0">0</option>
      <option value="1000">1000</option>
      <option value="2000">2000</option>
      <option value="3000">3000</option>
      <option value="4000">4000</option>
    </LabelledSelect>
  )
}
