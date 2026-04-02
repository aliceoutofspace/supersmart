/**
 * Icon Komponenten
 * 
 * Alle Icons als React-Komponenten für konsistente Verwendung.
 * Größe und Farbe werden über CSS gesteuert.
 */

const iconProps = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

// Location Pin (Logo)
export function IconLocation(props) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

// Plus
export function IconPlus(props) {
  return (
    <svg {...iconProps} {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

// Check
export function IconCheck(props) {
  return (
    <svg {...iconProps} {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// X / Close
export function IconX(props) {
  return (
    <svg {...iconProps} {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

// Arrow Left
export function IconArrowLeft(props) {
  return (
    <svg {...iconProps} {...props}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

// Arrow Right
export function IconArrowRight(props) {
  return (
    <svg {...iconProps} {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

// Chevron Down
export function IconChevronDown(props) {
  return (
    <svg {...iconProps} {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

// Chevron Up
export function IconChevronUp(props) {
  return (
    <svg {...iconProps} {...props}>
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

// Shopping Basket
export function IconBasket(props) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M5.757 6H18.243a2 2 0 0 1 1.977 2.304l-1.286 9A2 2 0 0 1 16.957 19H7.043a2 2 0 0 1-1.977-1.696l-1.286-9A2 2 0 0 1 5.757 6z" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

// Map / Store Layout
export function IconMap(props) {
  return (
    <svg {...iconProps} {...props}>
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  )
}

// Search
export function IconSearch(props) {
  return (
    <svg {...iconProps} {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

// Settings / Gear
export function IconSettings(props) {
  return (
    <svg {...iconProps} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

export default {
  IconLocation,
  IconPlus,
  IconCheck,
  IconX,
  IconArrowLeft,
  IconArrowRight,
  IconChevronDown,
  IconChevronUp,
  IconBasket,
  IconMap,
  IconSearch,
  IconSettings,
}
