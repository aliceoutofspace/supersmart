import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { StatusDot } from '../components/ui/StatusDot'
import { Button } from '../components/ui/Button'
import { IconArrowLeft, IconCheck, IconX } from '../components/ui/Icons'
import { useStore } from '../store/useStore'
import { getAlternativesForProduct } from '../store/storeLayouts'
import './StoreMap.css'

export function StoreMap() {
  const navigate = useNavigate()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showAlternatives, setShowAlternatives] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState(null)

  const {
    products,
    selectedStore,
    storeLayout,
    markAsFound,
    markAsNotFound,
    replaceWithAlternative,
    prioritizeProduct,
    isShoppingComplete,
    finishShopping,
  } = useStore()

  const activeProducts = useMemo(() => products.filter(p => !p.checked), [products])
  const currentProduct = activeProducts[0]
  const checkedCount = products.filter(p => p.checked).length

  const handleBack = () => {
    finishShopping()
    navigate('/list')
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setShowAlternatives(false)
  }

  const handleFound = () => {
    if (selectedProduct) {
      markAsFound(selectedProduct.id)
      setSelectedProduct(null)
    }
  }

  const handleNotFound = () => {
    setShowAlternatives(true)
  }

  const handleSelectAlternative = (alt) => {
    if (selectedProduct) {
      replaceWithAlternative(selectedProduct.id, alt.name, alt.category)
      setSelectedProduct(null)
      setShowAlternatives(false)
    }
  }

  const handleSkip = () => {
    if (selectedProduct) {
      markAsNotFound(selectedProduct.id)
      setSelectedProduct(null)
      setShowAlternatives(false)
    }
  }

  const handleFinish = () => {
    finishShopping()
    navigate('/')
  }

  // ── Complete screen ───────────────────────────────────────────────────────
  if (isShoppingComplete()) {
    return (
      <div className="store-map store-map--complete">
        <header className="store-map__header">
          <button className="store-map__back" onClick={handleBack}>
            <IconArrowLeft />
            <span>back to list</span>
          </button>
          <span className="store-map__store-name">{selectedStore?.name}</span>
        </header>

        <main className="store-map__complete-content">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="store-map__complete-icon"
          >
            <IconCheck />
          </motion.div>
          <h1 className="store-map__complete-title">Shopping finished</h1>

          <ul className="store-map__complete-list">
            {products.map(product => (
              <li key={product.id} className="store-map__complete-item">
                <StatusDot status="checked" size="md" />
                <span>{product.name}</span>
              </li>
            ))}
          </ul>

          <Button variant="secondary" onClick={handleFinish}>
            Back to Overview
          </Button>
        </main>
      </div>
    )
  }

  // ── Main shopping view ────────────────────────────────────────────────────
  return (
    <div className="store-map">
      <header className="store-map__header">
        <button className="store-map__back" onClick={handleBack}>
          <IconArrowLeft />
          <span>back to list</span>
        </button>
        <span className="store-map__store-name">{selectedStore?.name}</span>
      </header>

      {/* Map */}
      <div className="store-map__canvas">
        {storeLayout && (
          <svg
            viewBox={`0 0 ${storeLayout.width} ${storeLayout.height}`}
            className="store-map__svg"
          >
            {/* Store floor */}
            <rect
              x={0} y={0}
              width={storeLayout.width} height={storeLayout.height}
              rx={10}
              className="store-map__floor"
            />

            {/* Zone fills */}
            {storeLayout.zones?.map(zone => (
              <rect
                key={zone.id}
                x={zone.x} y={zone.y}
                width={zone.width} height={zone.height}
                rx={3}
                className="store-map__zone"
              />
            ))}

            {/* Shelves */}
            {storeLayout.shelves?.map(shelf => (
              <rect
                key={shelf.id}
                x={shelf.x} y={shelf.y}
                width={shelf.width} height={shelf.height}
                rx={2}
                className="store-map__shelf"
              />
            ))}

            {/* Zone labels */}
            {storeLayout.zones?.map(zone => (
              <text
                key={`label-${zone.id}`}
                x={zone.x + 6}
                y={zone.y + 12}
                className="store-map__zone-label"
              >
                {zone.label}
              </text>
            ))}

            {/* Checkout */}
            {storeLayout.checkout && (
              <g>
                <rect
                  x={storeLayout.checkout.x}
                  y={storeLayout.checkout.y}
                  width={storeLayout.checkout.width}
                  height={storeLayout.checkout.height}
                  rx={4}
                  className="store-map__checkout"
                />
                <text
                  x={storeLayout.checkout.x + storeLayout.checkout.width / 2}
                  y={storeLayout.checkout.y + storeLayout.checkout.height / 2 + 1}
                  className="store-map__checkout-label"
                >
                  KASSE
                </text>
              </g>
            )}

            {/* Entrance */}
            {storeLayout.entrance && (
              <g>
                <circle
                  cx={storeLayout.entrance.x}
                  cy={storeLayout.entrance.y}
                  r={14}
                  className="store-map__entrance-circle"
                />
                <text
                  x={storeLayout.entrance.x}
                  y={storeLayout.entrance.y + 4}
                  className="store-map__entrance-arrow"
                >
                  ↑
                </text>
                <text
                  x={storeLayout.entrance.x}
                  y={storeLayout.entrance.y - 20}
                  className="store-map__entrance-text"
                >
                  EINGANG
                </text>
              </g>
            )}

            {/* Product dots */}
            {products.map((product) => {
              if (!product.position || product.checked) return null

              const isCurrent = product.id === currentProduct?.id
              const isHovered = hoveredProduct?.id === product.id
              // Tooltip: show above dot, flip to below if too close to top
              const tx = product.position.x
              const ty = product.position.y < 40
                ? product.position.y + 22
                : product.position.y - 16
              const labelW = Math.min(product.name.length * 6.2 + 14, 140)

              return (
                <g
                  key={product.id}
                  className={`store-map__product-dot${isCurrent ? ' store-map__product-dot--current' : ''}`}
                  onClick={() => handleProductClick(product)}
                  onMouseEnter={() => setHoveredProduct(product)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {isCurrent && (
                    <circle
                      cx={product.position.x}
                      cy={product.position.y}
                      r={18}
                      className="store-map__dot-ring"
                    />
                  )}
                  <circle
                    cx={product.position.x}
                    cy={product.position.y}
                    r={10}
                    className={`store-map__dot store-map__dot--${product.status}`}
                  />
                  {isCurrent && (
                    <circle
                      cx={product.position.x}
                      cy={product.position.y}
                      r={4}
                      fill="white"
                      opacity={0.85}
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                  {/* Hover tooltip */}
                  {isHovered && (
                    <g style={{ pointerEvents: 'none' }}>
                      <rect
                        x={tx - labelW / 2}
                        y={ty - 11}
                        width={labelW}
                        height={16}
                        rx={4}
                        className="store-map__tooltip-bg"
                      />
                      <text
                        x={tx}
                        y={ty}
                        className="store-map__tooltip-text"
                      >
                        {product.name}
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </svg>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="store-map__modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className="store-map__modal"
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="store-map__modal-close"
                onClick={() => setSelectedProduct(null)}
              >
                <IconX />
              </button>

              <h2 className="store-map__modal-title">{selectedProduct.name}</h2>

              {selectedProduct.position?.zoneName && (
                <p className="store-map__modal-zone">
                  {selectedProduct.position.zoneName}
                </p>
              )}

              {selectedProduct.tags?.includes('vegan') && (
                <div className="store-map__modal-tag">
                  <IconCheck /> vegan
                </div>
              )}

              {!showAlternatives ? (
                <div className="store-map__modal-actions">
                  <button className="store-map__action-btn store-map__action-btn--found" onClick={handleFound}>
                    <IconCheck />
                    Found
                  </button>
                  <button className="store-map__action-btn store-map__action-btn--notfound" onClick={handleNotFound}>
                    <IconX />
                    Not Found
                  </button>
                  <button className="store-map__search-now-btn" onClick={() => {
                    prioritizeProduct(selectedProduct.id)
                    setSelectedProduct(null)
                  }}>
                    search now
                  </button>
                </div>
              ) : (
                <div className="store-map__alternatives">
                  <p className="store-map__modal-alt-title">Alternatives:</p>

                  {getAlternativesForProduct(selectedProduct).map((alt, i) => (
                    <button
                      key={i}
                      className="store-map__alt-item"
                      onClick={() => handleSelectAlternative(alt)}
                    >
                      <span>{alt.name}</span>
                      {alt.tags?.length > 0 && (
                        <span className="store-map__alt-tags">
                          {alt.tags.map(t => (
                            <span key={t} className="store-map__alt-tag">{t}</span>
                          ))}
                        </span>
                      )}
                    </button>
                  ))}

                  <button className="store-map__skip-btn" onClick={handleSkip}>
                    Skip for now
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom panel — Next Products */}
      <div className="store-map__products-panel">
        <div className="store-map__products-header">
          <span>Next Products:</span>
        </div>

        <ul className="store-map__products-list">
          {activeProducts.map((product, index) => (
            <li
              key={product.id}
              className={`store-map__products-item${index === 0 ? ' store-map__products-item--current' : ''}`}
              onClick={() => handleProductClick(product)}
            >
              <StatusDot
                status={index === 0 ? 'available' : product.status}
                size="lg"
                showRing={index === 0}
              />
              <span className="store-map__products-name">{product.name}</span>
              {product.position?.zoneName && (
                <span className="store-map__products-zone">{product.position.zoneName}</span>
              )}
            </li>
          ))}
        </ul>

        <div className="store-map__progress">
          <div
            className="store-map__progress-bar"
            style={{ width: `${products.length ? (checkedCount / products.length) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default StoreMap
