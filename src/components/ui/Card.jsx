import { motion } from 'framer-motion'
import './Card.css'

/**
 * Card Komponente
 * 
 * Die charakteristischen glassmorphism Cards aus deinem Design.
 * 
 * Varianten:
 * - default: Standard Card mit Blur-Effekt
 * - elevated: Etwas stärkerer Schatten
 * - interactive: Mit Hover-Effekt für klickbare Cards
 */
export function Card({ 
  children, 
  variant = 'default',
  padding = 'md',
  onClick,
  className = '',
  as: Component = 'div',
  ...props 
}) {
  const isInteractive = variant === 'interactive' || onClick

  const classes = [
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    isInteractive && 'card--interactive',
    className
  ].filter(Boolean).join(' ')

  const MotionComponent = motion[Component] || motion.div

  return (
    <MotionComponent
      className={classes}
      onClick={onClick}
      whileHover={isInteractive ? { scale: 1.02, y: -2 } : undefined}
      whileTap={isInteractive ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}

/**
 * Card Header - Für Titel-Bereiche
 */
export function CardHeader({ children, className = '' }) {
  return (
    <div className={`card__header ${className}`}>
      {children}
    </div>
  )
}

/**
 * Card Content - Für den Hauptinhalt
 */
export function CardContent({ children, className = '' }) {
  return (
    <div className={`card__content ${className}`}>
      {children}
    </div>
  )
}

/**
 * Card Footer - Für Aktionen am Ende
 */
export function CardFooter({ children, className = '' }) {
  return (
    <div className={`card__footer ${className}`}>
      {children}
    </div>
  )
}

export default Card
