import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMotionValue, useSpring, motion, AnimatePresence } from 'framer-motion'
import { StatusDot } from '../components/ui/StatusDot'
import { Button } from '../components/ui/Button'
import { IconArrowLeft, IconCheck, IconX, IconMap, IconLocation } from '../components/ui/Icons'
import { useStore } from '../store/useStore'
import { getAlternativesForProduct } from '../store/storeLayouts'
import './StoreMap.css'

const SVG_W = 500
const SVG_H = 400
const MOBILE_ZOOM = 1.8
const MIN_ZOOM = 1.0
const MAX_ZOOM = 4.0
const SPRING = { stiffness: 500, damping: 38, mass: 0.5 }

export function StoreMap() {
  const navigate = useNavigate()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showAlternatives, setShowAlternatives] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [mobilePreview, setMobilePreview] = useState(false)
  const [zoom, setZoom] = useState(1)          // React state: used for button icon only
  const [focusedProductId, setFocusedProductId] = useState(null)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  const svgRef    = useRef(null)   // direct DOM ref → we write viewBox ourselves
  const canvasRef = useRef(null)

  // Spring-driven SVG center + zoom (in SVG user-unit space)
  const motCx   = useMotionValue(SVG_W / 2)
  const motCy   = useMotionValue(SVG_H / 2)
  const motZoom = useMotionValue(1)
  const sprCx   = useSpring(motCx,   SPRING)
  const sprCy   = useSpring(motCy,   SPRING)
  const sprZoom = useSpring(motZoom, SPRING)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const isMobileView = isMobile || mobilePreview

  // ── viewBox writer: fires on every spring tick ────────────────────────────
  useEffect(() => {
    const write = () => {
      const el = svgRef.current
      if (!el) return
      if (!isMobileView) {
        el.setAttribute('viewBox', `0 0 ${SVG_W} ${SVG_H}`)
        return
      }
      const z  = Math.max(0.01, sprZoom.get())
      const vw = SVG_W / z
      const vh = SVG_H / z
      // Clamp center so we never show blank space outside the map
      const cx = Math.max(vw / 2, Math.min(SVG_W - vw / 2, sprCx.get()))
      const cy = Math.max(vh / 2, Math.min(SVG_H - vh / 2, sprCy.get()))
      el.setAttribute('viewBox', `${cx - vw / 2} ${cy - vh / 2} ${vw} ${vh}`)
    }
    const u1 = sprCx.on('change', write)
    const u2 = sprCy.on('change', write)
    const u3 = sprZoom.on('change', write)
    write()
    return () => { u1(); u2(); u3() }
  }, [sprCx, sprCy, sprZoom, isMobileView])

  // ── Initial zoom-in animation ─────────────────────────────────────────────
  useEffect(() => {
    if (!isMobileView) {
      motZoom.set(1); sprZoom.set(1); setZoom(1)
      return
    }
    // Instantly show full map …
    motZoom.set(1); sprZoom.set(1); setZoom(1)
    // … then spring-zoom into first product after a beat
    const t = setTimeout(() => {
      motZoom.set(MOBILE_ZOOM)
      setZoom(MOBILE_ZOOM)
    }, 420)
    return () => clearTimeout(t)
  }, [isMobileView]) // eslint-disable-line

  const {
    products, selectedStore, storeLayout,
    markAsFound, markAsNotFound, replaceWithAlternative, prioritizeProduct,
    isShoppingComplete, finishShopping,
  } = useStore()

  const activeProducts = useMemo(() => products.filter(p => !p.checked), [products])
  const currentProduct = activeProducts[0]
  const checkedCount   = products.filter(p => p.checked).length

  useEffect(() => {
    setShowAlternatives(false)
    setFocusedProductId(null)
  }, [currentProduct?.id])

  // ── Sync focus target → spring center ────────────────────────────────────
  const focusTarget = (focusedProductId && products.find(p => p.id === focusedProductId)) || currentProduct
  const focusX = focusTarget?.position?.x ?? SVG_W / 2
  const focusY = focusTarget?.position?.y ?? SVG_H / 2

  useEffect(() => {
    motCx.set(focusX)
    motCy.set(focusY)
  }, [focusX, focusY]) // eslint-disable-line

  // ── Gestures: pinch zoom + one-finger pan + wheel + mouse drag ────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isMobileView) return

    const g = {
      pinch: { on: false, d0: 0, z0: 1 },
      drag:  { on: false, x0: 0, y0: 0, cx0: 0, cy0: 0 },
    }

    const dist2 = (t) => {
      const dx = t[0].clientX - t[1].clientX
      const dy = t[0].clientY - t[1].clientY
      return Math.sqrt(dx * dx + dy * dy)
    }

    // CSS pixels → SVG unit delta (depends on current zoom)
    const toSvg = (px) => {
      const el = svgRef.current
      if (!el || !el.clientWidth) return 0
      const z  = Math.max(0.01, sprZoom.get())
      const vw = SVG_W / z
      return px * (vw / el.clientWidth)
    }

    const onTouchStart = (e) => {
      e.preventDefault()
      if (e.touches.length === 1) {
        g.drag.on  = true; g.pinch.on = false
        g.drag.x0  = e.touches[0].clientX
        g.drag.y0  = e.touches[0].clientY
        g.drag.cx0 = sprCx.get()
        g.drag.cy0 = sprCy.get()
      }
      if (e.touches.length === 2) {
        g.pinch.on = true; g.drag.on = false
        g.pinch.d0 = dist2(e.touches)
        g.pinch.z0 = sprZoom.get()
      }
    }

    const onTouchMove = (e) => {
      e.preventDefault()
      if (e.touches.length === 1 && g.drag.on && sprZoom.get() > MIN_ZOOM + 0.05) {
        const dx = e.touches[0].clientX - g.drag.x0
        const dy = e.touches[0].clientY - g.drag.y0
        const nx = g.drag.cx0 - toSvg(dx)
        const ny = g.drag.cy0 - toSvg(dy)
        sprCx.set(nx); motCx.set(nx)
        sprCy.set(ny); motCy.set(ny)
      }
      if (e.touches.length === 2 && g.pinch.on) {
        const ratio = dist2(e.touches) / g.pinch.d0
        const nz    = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, g.pinch.z0 * ratio))
        motZoom.set(nz); setZoom(nz)
      }
    }

    const onTouchEnd = () => { g.drag.on = false; g.pinch.on = false }

    const onWheel = (e) => {
      e.preventDefault()
      const factor = e.deltaY < 0 ? 1.08 : 0.93
      const nz = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, sprZoom.get() * factor))
      motZoom.set(nz); setZoom(nz)
    }

    const onMouseDown = (e) => {
      g.drag.on  = true
      g.drag.x0  = e.clientX; g.drag.y0  = e.clientY
      g.drag.cx0 = sprCx.get(); g.drag.cy0 = sprCy.get()
      canvas.classList.add('store-map__canvas--grabbing')
    }
    const onMouseMove = (e) => {
      if (!g.drag.on || sprZoom.get() <= MIN_ZOOM + 0.05) return
      const nx = g.drag.cx0 - toSvg(e.clientX - g.drag.x0)
      const ny = g.drag.cy0 - toSvg(e.clientY - g.drag.y0)
      sprCx.set(nx); motCx.set(nx)
      sprCy.set(ny); motCy.set(ny)
    }
    const onMouseUp = () => {
      g.drag.on = false
      canvas.classList.remove('store-map__canvas--grabbing')
    }

    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove',  onTouchMove,  { passive: false })
    canvas.addEventListener('touchend',   onTouchEnd)
    canvas.addEventListener('wheel',      onWheel,      { passive: false })
    canvas.addEventListener('mousedown',  onMouseDown)
    window.addEventListener('mousemove',  onMouseMove)
    window.addEventListener('mouseup',    onMouseUp)
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove',  onTouchMove)
      canvas.removeEventListener('touchend',   onTouchEnd)
      canvas.removeEventListener('wheel',      onWheel)
      canvas.removeEventListener('mousedown',  onMouseDown)
      window.removeEventListener('mousemove',  onMouseMove)
      window.removeEventListener('mouseup',    onMouseUp)
    }
  }, [isMobileView, sprCx, sprCy, sprZoom, motCx, motCy, motZoom])

  const progressPct = products.length ? (checkedCount / products.length) * 100 : 0

  const handleZoomToggle = () => {
    const nz = zoom > MIN_ZOOM + 0.05 ? MIN_ZOOM : MOBILE_ZOOM
    motZoom.set(nz); setZoom(nz)
    // Re-snap center to current focus target
    motCx.set(focusX); motCy.set(focusY)
  }

  const handleChipClick = (id) => {
    setFocusedProductId(prev => prev === id ? null : id)
  }

  // Desktop handlers
  const handleBack         = () => { finishShopping(); navigate('/list') }
  const handleProductClick = (p) => { setSelectedProduct(p); setShowAlternatives(false) }
  const handleFound        = () => { if (selectedProduct) { markAsFound(selectedProduct.id); setSelectedProduct(null) } }
  const handleNotFound     = () => setShowAlternatives(true)
  const handleSelectAlt    = (alt) => {
    if (selectedProduct) { replaceWithAlternative(selectedProduct.id, alt.name, alt.category); setSelectedProduct(null); setShowAlternatives(false) }
  }
  const handleSkip = () => {
    if (selectedProduct) { markAsNotFound(selectedProduct.id); setSelectedProduct(null); setShowAlternatives(false) }
  }

  // Mobile handlers
  const handleMobileFound    = () => { if (currentProduct) markAsFound(currentProduct.id) }
  const handleMobileNotFound = () => setShowAlternatives(true)
  const handleMobileSelectAlt = (alt) => {
    if (currentProduct) { replaceWithAlternative(currentProduct.id, alt.name, alt.category); setShowAlternatives(false) }
  }
  const handleMobileSkip = () => {
    if (currentProduct) { markAsNotFound(currentProduct.id); setShowAlternatives(false) }
  }

  const handleFinish = () => { finishShopping(); navigate('/') }

  // ── Complete screen ───────────────────────────────────────────────────────
  if (isShoppingComplete()) {
    return (
      <div className="store-map store-map--complete">
        <header className="store-map__header">
          <button className="store-map__back" onClick={handleBack}><IconArrowLeft /><span>back to list</span></button>
          <span className="store-map__store-name">{selectedStore?.name}</span>
        </header>
        <main className="store-map__complete-content">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="store-map__complete-icon">
            <IconCheck />
          </motion.div>
          <h1 className="store-map__complete-title">Shopping finished</h1>
          <ul className="store-map__complete-list">
            {products.map(p => (
              <li key={p.id} className="store-map__complete-item">
                <StatusDot status="checked" size="md" /><span>{p.name}</span>
              </li>
            ))}
          </ul>
          <Button variant="secondary" onClick={handleFinish}>Back to Overview</Button>
        </main>
      </div>
    )
  }

  // ── Main view ─────────────────────────────────────────────────────────────
  return (
    <div className={`store-map${isMobileView ? ' store-map--mobile' : ''}`}>
      <header className="store-map__header">
        <button className="store-map__back" onClick={handleBack}><IconArrowLeft /><span>back to list</span></button>
        <span className="store-map__store-name">{selectedStore?.name}</span>
        {!isMobile && (
          <button
            className={`store-map__preview-toggle${mobilePreview ? ' store-map__preview-toggle--active' : ''}`}
            onClick={() => setMobilePreview(v => !v)}
          >
            <IconLocation />
            <span>{mobilePreview ? 'Exit preview' : 'Mobile preview'}</span>
          </button>
        )}
      </header>

      <div className="store-map__canvas" ref={canvasRef}>
        {storeLayout && (
          // viewBox is written directly via svgRef — no motion.g needed
          <svg ref={svgRef} viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="store-map__svg">
            <rect x={0} y={0} width={storeLayout.width} height={storeLayout.height} rx={10} className="store-map__floor" />

            {storeLayout.zones?.map(z => (
              <rect key={z.id} x={z.x} y={z.y} width={z.width} height={z.height} rx={3} className="store-map__zone" />
            ))}
            {storeLayout.shelves?.map(s => (
              <rect key={s.id} x={s.x} y={s.y} width={s.width} height={s.height} rx={2} className="store-map__shelf" />
            ))}

            {storeLayout.checkout && (
              <g>
                <rect x={storeLayout.checkout.x} y={storeLayout.checkout.y}
                  width={storeLayout.checkout.width} height={storeLayout.checkout.height}
                  rx={4} className="store-map__checkout" />
                <text x={storeLayout.checkout.x + storeLayout.checkout.width / 2}
                  y={storeLayout.checkout.y + storeLayout.checkout.height / 2 + 1}
                  className="store-map__checkout-label">CHECKOUT</text>
              </g>
            )}
            {storeLayout.entrance && (
              <g>
                <circle cx={storeLayout.entrance.x} cy={storeLayout.entrance.y} r={14} className="store-map__entrance-circle" />
                <text x={storeLayout.entrance.x} y={storeLayout.entrance.y} className="store-map__entrance-arrow">↑</text>
                <text x={storeLayout.entrance.x} y={storeLayout.entrance.y - 20} className="store-map__entrance-text">ENTRANCE</text>
              </g>
            )}

            {products.map(product => {
              if (!product.position || product.checked) return null
              const isCurrent = product.id === currentProduct?.id
              const isFocused = product.id === focusedProductId
              const isHovered = hoveredProduct?.id === product.id
              const dotR  = isCurrent ? (isMobileView ? 14 : 10) : (isMobileView ? 8 : 10)
              const ringR = isMobileView ? 24 : 18
              const tx = product.position.x
              const ty = product.position.y < 40 ? product.position.y + 22 : product.position.y - 16
              const labelW = Math.min(product.name.length * 6.2 + 14, 140)
              return (
                <g key={product.id}
                  className={['store-map__product-dot', isCurrent && 'store-map__product-dot--current', isFocused && 'store-map__product-dot--focused'].filter(Boolean).join(' ')}
                  onClick={() => !isMobileView && handleProductClick(product)}
                  onMouseEnter={() => !isMobileView && setHoveredProduct(product)}
                  onMouseLeave={() => !isMobileView && setHoveredProduct(null)}
                  style={{ cursor: isMobileView ? 'default' : 'pointer' }}
                >
                  {(isCurrent || isFocused) && (
                    <circle cx={product.position.x} cy={product.position.y} r={ringR}
                      className={isFocused && !isCurrent ? 'store-map__dot-ring store-map__dot-ring--focused' : 'store-map__dot-ring'} />
                  )}
                  <circle cx={product.position.x} cy={product.position.y} r={dotR}
                    className={`store-map__dot store-map__dot--${product.status}`} />
                  {isCurrent && (
                    <circle cx={product.position.x} cy={product.position.y} r={isMobileView ? 5 : 4}
                      fill="white" opacity={0.85} style={{ pointerEvents: 'none' }} />
                  )}
                  {!isMobileView && isHovered && (
                    <g style={{ pointerEvents: 'none' }}>
                      <rect x={tx - labelW / 2} y={ty - 11} width={labelW} height={16} rx={4} className="store-map__tooltip-bg" />
                      <text x={tx} y={ty} className="store-map__tooltip-text">{product.name}</text>
                    </g>
                  )}
                </g>
              )
            })}

            {storeLayout.zones?.map(z => (
              <text key={`lbl-${z.id}`} x={z.x + 6} y={z.y + 12} className="store-map__zone-label">{z.label}</text>
            ))}
          </svg>
        )}

        {isMobileView && (
          <button
            className={`store-map__zoom-toggle${zoom <= MIN_ZOOM + 0.05 ? ' store-map__zoom-toggle--out' : ''}`}
            onClick={handleZoomToggle}
          >
            {zoom > MIN_ZOOM + 0.05 ? <IconMap /> : <IconLocation />}
          </button>
        )}
      </div>

      {/* Desktop modal */}
      <AnimatePresence>
        {!isMobileView && selectedProduct && (
          <motion.div className="store-map__modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)}>
            <motion.div className="store-map__modal"
              initial={{ scale: 0.92, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}>
              <button className="store-map__modal-close" onClick={() => setSelectedProduct(null)}><IconX /></button>
              <h2 className="store-map__modal-title">{selectedProduct.name}</h2>
              {selectedProduct.position?.zoneName && <p className="store-map__modal-zone">{selectedProduct.position.zoneName}</p>}
              {selectedProduct.tags?.includes('vegan') && <div className="store-map__modal-tag"><IconCheck /> vegan</div>}
              {!showAlternatives ? (
                <div className="store-map__modal-actions">
                  <button className="store-map__action-btn store-map__action-btn--found" onClick={handleFound}><IconCheck /> Found</button>
                  <button className="store-map__action-btn store-map__action-btn--notfound" onClick={handleNotFound}><IconX /> Not Found</button>
                  <button className="store-map__search-now-btn" onClick={() => { prioritizeProduct(selectedProduct.id); setSelectedProduct(null) }}>search now</button>
                </div>
              ) : (
                <div className="store-map__alternatives">
                  <p className="store-map__modal-alt-title">Alternatives:</p>
                  {getAlternativesForProduct(selectedProduct).map((alt, i) => (
                    <button key={i} className="store-map__alt-item" onClick={() => handleSelectAlt(alt)}>
                      <span>{alt.name}</span>
                      {alt.tags?.length > 0 && <span className="store-map__alt-tags">{alt.tags.map(t => <span key={t} className="store-map__alt-tag">{t}</span>)}</span>}
                    </button>
                  ))}
                  <button className="store-map__skip-btn" onClick={handleSkip}>Skip for now</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom sheet */}
      {isMobileView ? (
        <div className="store-map__mobile-sheet">
          <AnimatePresence mode="wait">
            {currentProduct && (
              <motion.div key={currentProduct.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}>
                <div className="store-map__mobile-product-header">
                  <div className="store-map__mobile-product-info">
                    <div className="store-map__mobile-product-name">{currentProduct.name}</div>
                    {currentProduct.position?.zoneName && (
                      <div className="store-map__mobile-product-zone">{currentProduct.position.zoneName}</div>
                    )}
                  </div>
                  <div className="store-map__mobile-count">{checkedCount}/{products.length}</div>
                </div>
                {!showAlternatives ? (
                  <div className="store-map__mobile-actions">
                    <button className="store-map__mobile-btn store-map__mobile-btn--found" onClick={handleMobileFound}>
                      <IconCheck /> Found it
                    </button>
                    <button className="store-map__mobile-btn store-map__mobile-btn--notfound" onClick={handleMobileNotFound}>
                      <IconX /> Not found
                    </button>
                  </div>
                ) : (
                  <div className="store-map__alternatives">
                    <p className="store-map__modal-alt-title">Alternatives:</p>
                    {getAlternativesForProduct(currentProduct).map((alt, i) => (
                      <button key={i} className="store-map__alt-item" onClick={() => handleMobileSelectAlt(alt)}>
                        <span>{alt.name}</span>
                        {alt.tags?.length > 0 && <span className="store-map__alt-tags">{alt.tags.map(t => <span key={t} className="store-map__alt-tag">{t}</span>)}</span>}
                      </button>
                    ))}
                    <button className="store-map__skip-btn" onClick={handleMobileSkip}>Skip for now</button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {activeProducts.length > 1 && (
            <div className="store-map__mobile-upcoming">
              <span className="store-map__mobile-upcoming-label">Next:</span>
              {activeProducts.slice(1).map(p => (
                <button key={p.id}
                  className={`store-map__mobile-chip${focusedProductId === p.id ? ' store-map__mobile-chip--active' : ''}`}
                  onClick={() => handleChipClick(p.id)}>
                  {p.name}
                </button>
              ))}
            </div>
          )}

          <div className="store-map__progress">
            <div className="store-map__progress-bar" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      ) : (
        <div className="store-map__products-panel">
          <div className="store-map__products-header"><span>Next Products:</span></div>
          <ul className="store-map__products-list">
            {activeProducts.map((product, index) => (
              <li key={product.id}
                className={`store-map__products-item${index === 0 ? ' store-map__products-item--current' : ''}`}
                onClick={() => handleProductClick(product)}>
                <StatusDot status={index === 0 ? 'available' : product.status} size="lg" showRing={index === 0} />
                <span className="store-map__products-name">{product.name}</span>
                {product.position?.zoneName && <span className="store-map__products-zone">{product.position.zoneName}</span>}
              </li>
            ))}
          </ul>
          <div className="store-map__progress">
            <div className="store-map__progress-bar" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default StoreMap
