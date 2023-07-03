import { clsx } from 'clsx'
import { ReactNode, SelectHTMLAttributes, useState } from 'react'

type LabelledSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: ReactNode
  value: string
  onOptionChange: (value: string) => void
  selectClassName?: string
}

let id = 0
function getNextId() {
  return String(id++)
}

export function LabelledSelect({
  id = getNextId(),
  label,
  value,
  children,
  onOptionChange,
  selectClassName,
}: LabelledSelectProps) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        className={clsx(selectClassName, 'border border-gray-100')}
        value={value}
        onChange={(e) => onOptionChange(e.target.value)}
      >
        {children}
      </select>
    </>
  )
}

type BoolLabelledSelectProps = Omit<
  LabelledSelectProps,
  'value' | 'onOptionChange' | 'children'
> & {
  value: boolean
  onOptionChange: (value: boolean) => void
}
export function BoolLabelledSelect({
  value,
  onOptionChange,
  ...rest
}: BoolLabelledSelectProps) {
  return (
    <LabelledSelect
      {...rest}
      value={String(value)}
      selectClassName="font-mono"
      onOptionChange={(val) => onOptionChange(val === 'true')}
    >
      <option value="true">true</option>
      <option value="false">false</option>
    </LabelledSelect>
  )
}

/**
 * Helper to manage the boolean state for a BoolLabelledSelect. Basically means
 * you don't need to declare the state yourself and hook up the setters. Not
 * sure if this is overkill, but leaving in as an experiment.
 */
export function useBoolLabelledSelect(
  props: Omit<BoolLabelledSelectProps, 'value' | 'onOptionChange'> & {
    initialValue?: boolean
  }
): [
  JSX.Element,
  boolean,
  (value: ((prevState: boolean) => boolean) | boolean) => void
] {
  const [bool, setBool] = useState(props.initialValue ?? false)

  return [
    <BoolLabelledSelect {...props} value={bool} onOptionChange={setBool} />,
    bool,
    setBool,
  ]
}
