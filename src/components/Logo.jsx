import './Logo.css'

/**
 * SuperSmart Logo
 * 
 * Das charakteristische Location-Pin Icon mit dem App-Namen.
 */
export function Logo({ size = 'md', showText = true, className = '' }) {
  const classes = [
    'logo',
    `logo--${size}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <div className="logo__icon">
        <svg viewBox="0 0 48 48" fill="none">
          {/* Äußerer Kreis mit Gradient */}
          <circle cx="24" cy="24" r="22" fill="url(#logoGradient)" />
          
          {/* Location Pin */}
          <path 
            d="M24 12C19.58 12 16 15.58 16 20C16 26 24 36 24 36C24 36 32 26 32 20C32 15.58 28.42 12 24 12Z" 
            fill="white"
          />
          <circle cx="24" cy="20" r="3" fill="url(#logoGradient)" />
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="48" y2="48">
              <stop offset="0%" stopColor="#a8b892" />
              <stop offset="100%" stopColor="#8fa872" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {showText && (
        <span className="logo__text">SupersMart</span>
      )}
    </div>
  )
}

export default Logo
