import { create } from 'zustand'
import {
  getLayoutForStore,
  getProductPosition,
  sortProductsByLayout,
  reweLayout,
} from './storeLayouts'

// Demo-Produkte für den Start
const demoProducts = [
  { id: '1',  name: 'Milk',               status: 'available',  checked: false, category: 'dairy' },
  { id: '2',  name: 'Oatmilk',            status: 'unknown',    checked: false, category: 'dairy',     tags: ['vegan'] },
  { id: '3',  name: 'Bread',              status: 'available',  checked: false, category: 'bakery' },
  { id: '4',  name: 'Rice',               status: 'available',  checked: false, category: 'grains' },
  { id: '5',  name: 'Marmalade',          status: 'available',  checked: false, category: 'spreads' },
  { id: '6',  name: 'Chips',              status: 'unavailable', checked: false, category: 'snacks' },
  { id: '7',  name: 'Melon',              status: 'available',  checked: false, category: 'produce' },
  { id: '8',  name: 'Flour',              status: 'available',  checked: false, category: 'baking' },
  { id: '9',  name: 'Cleaning detergent', status: 'unknown',    checked: false, category: 'household' },
  { id: '10', name: 'Bubblegum',          status: 'uncertain',  checked: false, category: 'snacks' },
  { id: '11', name: 'Thuna',              status: 'available',  checked: false, category: 'canned' },
]

export const useStore = create((set, get) => ({
  // ========================================
  // STATE
  // ========================================

  products: [],
  selectedStore: null,
  storeLayout: null,

  lastList: {
    date: '09.03.2025',
    products: demoProducts,
  },

  isShoppingMode: false,
  currentProductIndex: 0,

  // ========================================
  // ACTIONS
  // ========================================

  startNewList: () => set({
    products: [],
    isShoppingMode: false,
    currentProductIndex: 0,
  }),

  continueLastList: () => set((state) => ({
    products: state.lastList.products.map(p => ({ ...p, checked: false })),
    isShoppingMode: false,
    currentProductIndex: 0,
  })),

  addProduct: (name, category = 'other') => set((state) => ({
    products: [
      ...state.products,
      {
        id: `product-${Date.now()}`,
        name,
        status: 'unknown',
        checked: false,
        category,
      }
    ]
  })),

  removeProduct: (productId) => set((state) => ({
    products: state.products.filter(p => p.id !== productId)
  })),

  toggleChecked: (productId) => set((state) => ({
    products: state.products.map(p =>
      p.id === productId ? { ...p, checked: !p.checked } : p
    )
  })),

  markAsFound: (productId) => set((state) => {
    const products = state.products.map(p =>
      p.id === productId ? { ...p, checked: true, foundStatus: 'found' } : p
    )
    const lastListProducts = products.map(p =>
      ({ ...p, checked: false, foundStatus: null, skipped: false })
    )
    return {
      products,
      lastList: { date: new Date().toLocaleDateString('de-DE'), products: lastListProducts },
    }
  }),

  // Produkt überspringen: bleibt unchecked damit isShoppingComplete es ignoriert,
  // aber checked=true damit es aus der aktiven Route rausfällt.
  // skipped=true merkt sich, dass es für die gespeicherte lastList erhalten bleibt.
  markAsNotFound: (productId) => set((state) => {
    const products = state.products.map(p =>
      p.id === productId ? { ...p, checked: true, foundStatus: 'not_found', skipped: true } : p
    )
    // lastList aktualisieren: skipped-Produkte bleiben drin (checked=false für nächstes Mal)
    const lastListProducts = products.map(p =>
      p.skipped
        ? { ...p, checked: false, foundStatus: null, skipped: false }
        : { ...p, checked: false, foundStatus: null }
    )
    return {
      products,
      lastList: { date: new Date().toLocaleDateString('de-DE'), products: lastListProducts },
    }
  }),

  replaceWithAlternative: (productId, alternativeName, alternativeCategory) => set((state) => {
    const layout = state.storeLayout || reweLayout
    const updatedProducts = state.products.map(p => {
      if (p.id !== productId) return p
      const updated = {
        ...p,
        name: alternativeName,
        category: alternativeCategory || p.category,
        foundStatus: null,
      }
      return { ...updated, position: getProductPosition(updated, layout) }
    })
    return { products: updatedProducts }
  }),

  // Store auswählen — speichert brand für Layout-Auswahl
  selectStore: (store) => {
    const selectedStore = store
      ? { id: store.id, name: store.name, brand: store.brand, address: store.address, district: store.district }
      : { id: reweLayout.id, name: reweLayout.name, brand: 'REWE' }

    const layout = getLayoutForStore(store || { brand: 'REWE' })

    set({ selectedStore, storeLayout: layout })

    const state = get()
    const productsWithPositions = state.products.map(product => ({
      ...product,
      position: getProductPosition(product, layout),
    }))
    set({ products: productsWithPositions })
  },

  // Shopping-Modus starten — stellt sicher dass Positionen aktuell sind, dann sortiert
  startShopping: () => {
    const state = get()

    // Immer selectStore aufrufen um Positionen frisch zu berechnen
    // (deterministische Positionen = kein sichtbarer Effekt beim Wiederaufruf)
    get().selectStore(state.selectedStore || null)

    const currentState = get()
    const sorted = sortProductsByLayout(currentState.products, currentState.storeLayout)

    set({
      isShoppingMode: true,
      currentProductIndex: 0,
      products: sorted,
    })
  },

  // Produkt an den Anfang der aktiven Liste schieben
  prioritizeProduct: (productId) => set((state) => {
    const target = state.products.find(p => p.id === productId)
    if (!target) return {}
    const others = state.products.filter(p => p.id !== productId)
    return { products: [target, ...others] }
  }),

  finishShopping: () => set({
    isShoppingMode: false,
  }),

  goToNextProduct: () => set((state) => {
    const unchecked = state.products.filter(p => !p.checked)
    const next = unchecked.findIndex(
      (p) => state.products.indexOf(p) > state.currentProductIndex
    )
    return {
      currentProductIndex: next >= 0
        ? state.products.indexOf(unchecked[next])
        : state.currentProductIndex
    }
  }),

  getAvailabilityStats: () => {
    const state = get()
    const total = state.products.length
    const available = state.products.filter(p => p.status === 'available').length
    return {
      total,
      available,
      text: `${available} of ${total} products likely available`
    }
  },

  isShoppingComplete: () => {
    const state = get()
    // checked=true gilt sowohl für found als auch für skipped (not_found)
    return state.products.length > 0 && state.products.every(p => p.checked)
  },
}))

export default useStore
