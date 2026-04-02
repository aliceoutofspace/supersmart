import './StatusDot.css'

/**
 * StatusDot Komponente
 * 
 * Die farbigen Dots neben den Produkten, die die Verfügbarkeit anzeigen.
 * 
 * Status:
 * - available: Grün - Produkt ist verfügbar
 * - uncertain: Gelb - Verfügbarkeit unsicher
 * - unknown: Grau - Keine Info
 * - unavailable: Rot - Nicht verfügbar
 * - checked: Grau mit Häkchen - Bereits abgehakt
 */
export function StatusDot({ 
  status = 'unknown', 
  size = 'md',
  showRing = false,
  className = '' 
}) {
  const classes = [
    'status-dot',
    `status-dot--${status}`,
    `status-dot--${size}`,
    showRing && 'status-dot--ring',
    className
  ].filter(Boolean).join(' ')

  return (
    <span className={classes}>
      {status === 'checked' && (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3"
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="status-dot__check"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </span>
  )
}

/**
 * Hilfsfunktion um Status basierend auf Verfügbarkeits-Daten zu bestimmen
 */
export function getStatusFromAvailability(availability) {
  if (availability === true || availability > 0.8) return 'available'
  if (availability === false || availability < 0.2) return 'unavailable'
  if (availability >= 0.5) return 'uncertain'
  return 'unknown'
}

export default StatusDot
