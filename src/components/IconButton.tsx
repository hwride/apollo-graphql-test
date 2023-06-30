import { clsx } from 'clsx'
import { HTMLMotionProps, motion } from 'framer-motion'
import { ButtonHTMLAttributes, forwardRef } from 'react'

const iconButtonClasses = 'block rounded p-1 text-gray-600 hover:bg-gray-200'

export function IconButton({
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  'aria-label': string // Make this required.
}) {
  return (
    <button className={clsx(iconButtonClasses, className)} {...rest}>
      {children}
    </button>
  )
}

type MotionIconButtonProps = HTMLMotionProps<'button'> & {
  'aria-label': string
}

/**
 * An icon button with support for Framer Motion.
 */
export const MotionIconButton = forwardRef<
  HTMLButtonElement,
  MotionIconButtonProps
>(function ({ children, className, ...rest }, ref) {
  return (
    <motion.button
      ref={ref}
      className={clsx(iconButtonClasses, className)}
      {...rest}
    >
      {children}
    </motion.button>
  )
})
