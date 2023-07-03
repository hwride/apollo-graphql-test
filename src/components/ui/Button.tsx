import { clsx } from 'clsx'
import { HTMLMotionProps, motion } from 'framer-motion'

export function Button({
  className,
  children,
  ...rest
}: HTMLMotionProps<'button'>) {
  return (
    <motion.button
      whileTap={{
        scale: 0.9,
      }}
      className={clsx(className, 'px-2 hover:bg-gray-100')}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

export function BorderButton({
  className,
  children,
  ...rest
}: HTMLMotionProps<'button'>) {
  return (
    <Button
      className={clsx(className, 'rounded border border-black')}
      {...rest}
    >
      {children}
    </Button>
  )
}
