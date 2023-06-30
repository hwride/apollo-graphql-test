import { clsx } from 'clsx'
import { ReactNode } from 'react'
import { H2 } from './Headings.tsx'

export function Page({
  title,
  className,
  children,
}: {
  title?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={clsx(className, 'p-2')}>
      {title && <H2>{title}</H2>}
      {children}
    </div>
  )
}
