import { clsx } from 'clsx'
import { ReactNode } from 'react'

/**
 * Grid used for displaying controls used in examples.
 */
export function ControlGrid({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={clsx(className, 'mx-auto w-fit max-w-full')}>
      <div className="grid w-full grid-cols-[1fr_minmax(0,1fr)] gap-x-2">
        {children}
      </div>
    </div>
  )
}
