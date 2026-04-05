import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  className = '',
}) {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true })

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
      x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  }

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}