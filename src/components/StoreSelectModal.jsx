import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { IconLocation } from './ui/Icons'
import berlinStores from '../assets/berlin-stores.json'
import './StoreSelectModal.css'

export function StoreSelectModal({ onSelect, onClose }) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      // Show a diverse mix: up to 3 stores per brand, all brands represented
      const seen = {}
      const mixed = []
      for (const s of berlinStores) {
        const key = (s.brand || '').toLowerCase()
        if ((seen[key] || 0) < 3) {
          seen[key] = (seen[key] || 0) + 1
          mixed.push(s)
        }
      }
      return mixed
    }
    const tokens = q.split(/\s+/).filter(Boolean)
    return berlinStores
      .filter(s => {
        const haystack = `${s.name} ${s.district} ${s.address}`.toLowerCase()
        return tokens.every(token => haystack.includes(token))
      })
      .slice(0, 30)
  }, [query])

  return (
    <motion.div
      className="store-modal__backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="store-modal"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
      >
        <div className="store-modal__header">
          <h2 className="store-modal__title">Select a store</h2>
          <button className="store-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="store-modal__search">
          <IconLocation />
          <input
            type="text"
            className="store-modal__input"
            placeholder="Search for Rewe, Lidl, Edeka…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <ul className="store-modal__results">
          {results.length === 0 && (
            <li className="store-modal__empty">No stores found</li>
          )}
          {results.map(store => (
            <li key={store.id}>
              <button
                className="store-modal__result"
                onClick={() => onSelect(store)}
              >
                <span className="store-modal__result-name">{store.name}</span>
                <span className="store-modal__result-meta">
                  {[store.address, store.district].filter(Boolean).join(' · ')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  )
}
