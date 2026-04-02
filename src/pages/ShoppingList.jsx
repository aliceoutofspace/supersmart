import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '../components/Logo'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { StatusDot } from '../components/ui/StatusDot'
import { IconArrowLeft, IconPlus, IconChevronDown, IconChevronUp } from '../components/ui/Icons'
import { StoreSelectModal } from '../components/StoreSelectModal'
import { useStore } from '../store/useStore'
import { getLayoutForStore, getProductPosition } from '../store/storeLayouts'
import './ShoppingList.css'

export function ShoppingList() {
  const navigate = useNavigate()
  const [showPreview, setShowPreview] = useState(false)
  const [newProductName, setNewProductName] = useState('')
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [showStoreSelect, setShowStoreSelect] = useState(false)

  const {
    products,
    selectedStore,
    addProduct,
    selectStore,
    toggleChecked,
    startShopping,
    getAvailabilityStats
  } = useStore()

  const stats = getAvailabilityStats()

  const handleBack = () => navigate('/')

  const handleStartShopping = () => {
    if (!selectedStore) selectStore()
    startShopping()
    navigate('/map')
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    if (newProductName.trim()) {
      addProduct(newProductName.trim())
      setNewProductName('')
      setIsAddingProduct(false)
    }
  }

  const handleCheck = (productId) => {
    toggleChecked(productId)
  }

  const handleStoreSelect = (store) => {
    selectStore(store)
    setShowStoreSelect(false)
  }

  return (
    <div className="shopping-list">
      <header className="shopping-list__header">
        <Logo size="md" />
      </header>

      <button className="shopping-list__back" onClick={handleBack}>
        <IconArrowLeft />
        <span>back</span>
      </button>

      <main className="shopping-list__main">
        <div className="shopping-list__content">
          {/* Left: Product List */}
          <Card padding="lg" className="shopping-list__list-card">
            <h1 className="shopping-list__title">Today's list</h1>

            <ul className="shopping-list__products">
              <AnimatePresence>
                {products.map((product, index) => {
                  const isChecked = product.checked
                  const isUnavailable = product.status === 'unavailable'
                  return (
                    <motion.li
                      key={product.id}
                      className={[
                        'shopping-list__product',
                        isChecked && 'shopping-list__product--checked',
                        isUnavailable && !isChecked && 'shopping-list__product--unavailable',
                      ].filter(Boolean).join(' ')}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40, scale: 0.95 }}
                      transition={{ duration: 0.25, delay: index * 0.03 }}
                    >
                      <div className="shopping-list__product-label">
                        <button
                          className={[
                            'shopping-list__check-circle',
                            isChecked && 'shopping-list__check-circle--checked',
                            isUnavailable && !isChecked && 'shopping-list__check-circle--unavailable',
                          ].filter(Boolean).join(' ')}
                          onClick={() => handleCheck(product.id)}
                          aria-label={`Mark ${product.name} as done`}
                        >
                          {isChecked && (
                            <svg className="shopping-list__checkmark" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M5 12l4 4L19 7"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>

                        <span className={[
                          'shopping-list__product-name',
                          isChecked && 'shopping-list__product-name--checked',
                          isUnavailable && !isChecked && 'shopping-list__product-name--unavailable',
                        ].filter(Boolean).join(' ')}>
                          {product.name}
                        </span>

                        {!isChecked && isUnavailable ? (
                          <span className="shopping-list__unavailable-badge">not available</span>
                        ) : !isChecked ? (
                          <StatusDot status={product.status} size="md" />
                        ) : null}
                      </div>
                    </motion.li>
                  )
                })}
              </AnimatePresence>
            </ul>

            <div className="shopping-list__add">
              {isAddingProduct ? (
                <form onSubmit={handleAddProduct} className="shopping-list__add-form">
                  <input
                    type="text"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="Product name..."
                    autoFocus
                    className="shopping-list__add-input"
                  />
                  <Button type="submit" variant="primary" size="sm">Add</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddingProduct(false)}>Cancel</Button>
                </form>
              ) : (
                <Button variant="secondary" icon={<IconPlus />} onClick={() => setIsAddingProduct(true)} fullWidth>
                  Add product
                </Button>
              )}
            </div>
          </Card>

          {/* Right: Store Info */}
          <aside className="shopping-list__sidebar">
            <div className="shopping-list__store-info">
              <h2 className="shopping-list__store-title">Store & Info</h2>

              <div className="shopping-list__store-details">
                <div className="shopping-list__store-field">
                  <span className="shopping-list__store-label">Store:</span>
                  <span className="shopping-list__store-value">
                    {selectedStore?.name || 'Not selected'}
                  </span>
                  {selectedStore?.address && (
                    <span className="shopping-list__store-address">
                      {selectedStore.address}{selectedStore.district ? `, ${selectedStore.district}` : ''}
                    </span>
                  )}
                </div>

                {selectedStore && (
                  <div className="shopping-list__store-field">
                    <span className="shopping-list__store-label">Availability:</span>
                    <span className="shopping-list__store-value">{stats.text}</span>
                  </div>
                )}
              </div>

              <Button variant="secondary" size="sm" onClick={() => setShowStoreSelect(true)}>
                Change store
              </Button>

              <div className="shopping-list__divider" />

              <Button
                variant="secondary"
                onClick={handleStartShopping}
                fullWidth
                disabled={products.length === 0}
              >
                Start shopping
              </Button>
            </div>

            {/* Store Preview Toggle */}
            <button
              className="shopping-list__preview-toggle"
              onClick={() => setShowPreview(!showPreview)}
            >
              <span>Show store preview</span>
              {showPreview ? <IconChevronUp /> : <IconChevronDown />}
            </button>

            {/* Hint always visible under the toggle */}
            <p className="shopping-list__preview-hint-static">
              See where your products are in the store before you go.
            </p>

            <AnimatePresence>
              {showPreview && (
                <motion.div
                  className="shopping-list__preview"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <StorePreviewMini selectedStore={selectedStore} products={products} />
                </motion.div>
              )}
            </AnimatePresence>
          </aside>
        </div>
      </main>

      {/* Change Store Modal */}
      <AnimatePresence>
        {showStoreSelect && (
          <StoreSelectModal
            onSelect={handleStoreSelect}
            onClose={() => setShowStoreSelect(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}


function StorePreviewMini({ selectedStore, products }) {
  const layout = getLayoutForStore(selectedStore || {})

  const productsWithPos = products.map(p => ({
    ...p,
    position: getProductPosition(p, layout),
  }))

  return (
    <div className="store-preview-mini">
      <svg
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        className="store-preview-mini__svg"
      >
        {/* Floor */}
        <rect x={0} y={0} width={layout.width} height={layout.height} rx={8} className="store-preview-mini__floor" />

        {/* Zones */}
        {layout.zones?.map(zone => (
          <rect
            key={zone.id}
            x={zone.x} y={zone.y}
            width={zone.width} height={zone.height}
            rx={2}
            className="store-preview-mini__zone"
          />
        ))}

        {/* Shelves */}
        {layout.shelves?.map(shelf => (
          <rect
            key={shelf.id}
            x={shelf.x} y={shelf.y}
            width={shelf.width} height={shelf.height}
            rx={1}
            className="store-preview-mini__shelf"
          />
        ))}

        {/* Zone labels */}
        {layout.zones?.map(zone => (
          <text
            key={`lbl-${zone.id}`}
            x={zone.x + 5}
            y={zone.y + 11}
            className="store-preview-mini__label"
          >
            {zone.label}
          </text>
        ))}

        {/* Entrance */}
        {layout.entrance && (
          <circle
            cx={layout.entrance.x} cy={layout.entrance.y}
            r={10}
            className="store-preview-mini__entrance"
          />
        )}

        {/* Checkout */}
        {layout.checkout && (
          <rect
            x={layout.checkout.x} y={layout.checkout.y}
            width={layout.checkout.width} height={layout.checkout.height}
            rx={3}
            className="store-preview-mini__checkout"
          />
        )}

        {/* Product dots */}
        {productsWithPos.map(p => {
          if (!p.position || p.checked) return null
          const colorClass =
            p.status === 'available'   ? 'store-preview-mini__dot--available' :
            p.status === 'unavailable' ? 'store-preview-mini__dot--unavailable' :
                                         'store-preview-mini__dot--unknown'
          return (
            <circle
              key={p.id}
              cx={p.position.x}
              cy={p.position.y}
              r={6}
              className={`store-preview-mini__dot ${colorClass}`}
            />
          )
        })}
      </svg>
    </div>
  )
}

export default ShoppingList
