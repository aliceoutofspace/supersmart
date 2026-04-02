import { motion } from 'framer-motion'
import './Button.css'

/**
 * Button Komponente
 * 
 * Varianten:
 * - primary: Gefüllter Button für Hauptaktionen
 * - secondary: Outline Button für sekundäre Aktionen
 * - ghost: Transparenter Button für subtile Aktionen
 * 
 * Größen:
 * - sm: Klein (für Listen, kompakte Bereiche)
 * - md: Standard
 * - lg: Groß (für Call-to-Actions)
 */
export function Button({ 
  children, 
  variant = 'secondary', 
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full-width',
    disabled && 'btn--disabled',
    className
  ].filter(Boolean).join(' ')

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="btn__icon btn__icon--left">{icon}</span>
      )}
      <span className="btn__text">{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="btn__icon btn__icon--right">{icon}</span>
      )}
    </motion.button>
  )
}

export default Button
