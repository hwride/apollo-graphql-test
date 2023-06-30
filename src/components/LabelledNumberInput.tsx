import { InputHTMLAttributes, ReactNode } from 'react'
import { TextInput } from './TextInput.tsx'

export function LabelledNumberInput({
  id,
  label,
  value,
  onNumChange,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode
  value: number
  onNumChange: (value: number) => void
}) {
  return (
    <>
      <label htmlFor={id}>{<code>{label}</code>}</label>
      <TextInput
        id={id}
        type="number"
        value={value}
        onChange={(e) => onNumChange(Number(e.target.value))}
        {...rest}
      />
    </>
  )
}
