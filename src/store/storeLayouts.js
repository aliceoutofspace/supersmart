/**
 * German Supermarket Layouts — 4 visually distinct floor plans
 *
 * RULE: No zone spans the full store width.
 * Each layout has a different structure so stores look different:
 *
 *  REWE:      5 rows × 2 cols, 20px row gap, entrance bottom-right
 *  Edeka:     4 rows × 2 cols, wider rows + more side space, entrance bottom-center
 *  Aldi/Lidl: 3 rows × 2 cols, very wide zones (fewer categories), entrance bottom-right
 *  Kaufland:  6 rows × 2 cols, narrow rows, entrance bottom-left (mirrored snake)
 */

const W = 500
const H = 400

// ── REWE ─────────────────────────────────────────────────────────────────────
// 5 rows, 20px gaps, 18px side margins, 90px centre aisle
const R = (() => {
  const MX = 18, CW = 187, MID = 90, BH = 20, RH = 26, RG = 20
  const LX = MX, RX = MX + CW + MID   // 18, 295
  const BY = 10
  const ry = (i) => BY + BH + 12 + i * (RH + RG)
  return { MX, CW, MID, BH, RH, RG, LX, RX, BY, ry }
})()

export const reweLayout = {
  id: 'rewe', name: 'REWE', type: 'rewe', width: W, height: H,
  entrance: { x: 455, y: 382 },
  checkout: { x: R.LX, y: 354, width: 150, height: 18 },
  zones: [
    // Back wall — two halves
    { id: 'dairy-l', label: 'Milk & Cheese',        categories: ['dairy'],            visitOrder: 6,  x: R.LX, y: R.BY,    width: R.CW, height: R.BH },
    { id: 'dairy-r', label: 'Yogurt & Quark',       categories: [],                   visitOrder: 6,  x: R.RX, y: R.BY,    width: R.CW, height: R.BH },
    // Row 0 — deep (right=5 because we snake up right first)
    { id: 'meat',      label: 'Meat & Cold Cuts',    categories: ['meat'],             visitOrder: 5,  x: R.RX, y: R.ry(0), width: R.CW, height: R.RH },
    { id: 'frozen',    label: 'Frozen',               categories: ['frozen'],           visitOrder: 7,  x: R.LX, y: R.ry(0), width: R.CW, height: R.RH },
    // Row 1
    { id: 'household', label: 'Household & Care',    categories: ['household'],        visitOrder: 4,  x: R.RX, y: R.ry(1), width: R.CW, height: R.RH },
    { id: 'canned',    label: 'Canned Goods',         categories: ['canned'],           visitOrder: 8,  x: R.LX, y: R.ry(1), width: R.CW, height: R.RH },
    // Row 2
    { id: 'beverages', label: 'Beverages',            categories: ['beverages'],        visitOrder: 3,  x: R.RX, y: R.ry(2), width: R.CW, height: R.RH },
    { id: 'grains',    label: 'Pasta & Rice',         categories: ['grains', 'baking'], visitOrder: 9,  x: R.LX, y: R.ry(2), width: R.CW, height: R.RH },
    // Row 3
    { id: 'snacks',    label: 'Sweets & Snacks',      categories: ['snacks'],           visitOrder: 2,  x: R.RX, y: R.ry(3), width: R.CW, height: R.RH },
    { id: 'bakery',    label: 'Bakery',                categories: ['bakery'],           visitOrder: 10, x: R.LX, y: R.ry(3), width: R.CW, height: R.RH },
    // Row 4 — near entrance
    { id: 'produce',   label: 'Fruit & Veg',          categories: ['produce'],          visitOrder: 1,  x: R.RX, y: R.ry(4), width: R.CW, height: R.RH },
    { id: 'spreads',   label: 'Coffee & Breakfast',   categories: ['spreads'],          visitOrder: 11, x: R.LX, y: R.ry(4), width: R.CW, height: R.RH },
  ],
}

// ── Edeka ─────────────────────────────────────────────────────────────────────
// 4 rows, taller rows (38px), wider side margins (28px), smaller centre (70px)
// Entrance bottom-centre → customer walks left or right equally
const E = (() => {
  const MX = 28, CW = 192, MID = 60, BH = 22, RH = 38, RG = 18
  const LX = MX, RX = MX + CW + MID   // 28, 280
  const BY = 10
  const ry = (i) => BY + BH + 14 + i * (RH + RG)
  return { MX, CW, MID, BH, RH, RG, LX, RX, BY, ry }
})()

export const edekaLayout = {
  id: 'edeka', name: 'Edeka', type: 'edeka', width: W, height: H,
  entrance: { x: 250, y: 382 },
  checkout: { x: E.LX, y: 352, width: 140, height: 20 },
  zones: [
    // Back — two halves
    { id: 'dairy',     label: 'Milk & Cheese',       categories: ['dairy'],            visitOrder: 5,  x: E.LX, y: E.BY,    width: E.CW, height: E.BH },
    { id: 'deli',      label: 'Meat & Fish',          categories: ['meat'],             visitOrder: 6,  x: E.RX, y: E.BY,    width: E.CW, height: E.BH },
    // Row 0
    { id: 'frozen',    label: 'Frozen',               categories: ['frozen'],           visitOrder: 7,  x: E.LX, y: E.ry(0), width: E.CW, height: E.RH },
    { id: 'household', label: 'Household & Care',     categories: ['household'],        visitOrder: 4,  x: E.RX, y: E.ry(0), width: E.CW, height: E.RH },
    // Row 1
    { id: 'canned',    label: 'Canned Goods',          categories: ['canned'],           visitOrder: 8,  x: E.LX, y: E.ry(1), width: E.CW, height: E.RH },
    { id: 'beverages', label: 'Beverages',             categories: ['beverages'],        visitOrder: 3,  x: E.RX, y: E.ry(1), width: E.CW, height: E.RH },
    // Row 2
    { id: 'grains',    label: 'Pasta & Spices',        categories: ['grains', 'baking'], visitOrder: 9,  x: E.LX, y: E.ry(2), width: E.CW, height: E.RH },
    { id: 'snacks',    label: 'Snacks & Spreads',      categories: ['snacks', 'spreads'],visitOrder: 2,  x: E.RX, y: E.ry(2), width: E.CW, height: E.RH },
    // Row 3 — near entrance
    { id: 'bakery',    label: 'Bakery',                categories: ['bakery'],           visitOrder: 10, x: E.LX, y: E.ry(3), width: E.CW, height: E.RH },
    { id: 'produce',   label: 'Fruit & Veg',           categories: ['produce'],          visitOrder: 1,  x: E.RX, y: E.ry(3), width: E.CW, height: E.RH },
  ],
}

// ── Aldi / Lidl ───────────────────────────────────────────────────────────────
// 3 rows only, very wide zones (220px), huge centre aisle (52px), tight gaps (12px)
// Looks spare and open — typical discounter feel
const A = (() => {
  const MX = 12, CW = 210, MID = 56, BH = 30, RH = 56, RG = 50
  const LX = MX, RX = MX + CW + MID   // 12, 278  →  12+210+56+210+12=500 ✓
  const BY = 10
  const ry = (i) => BY + BH + 12 + i * (RH + RG)
  return { MX, CW, MID, BH, RH, RG, LX, RX, BY, ry }
})()

export const aldiLayout = {
  id: 'aldi', name: 'Aldi · Lidl', type: 'aldi', width: W, height: H,
  entrance: { x: 455, y: 382 },
  checkout: { x: A.LX, y: 334, width: 180, height: 22 },
  zones: [
    // Back — two halves
    { id: 'dairy',     label: 'Milk & Cheese',               categories: ['dairy'],                               visitOrder: 4,  x: A.LX, y: A.BY,    width: A.CW, height: A.BH },
    { id: 'chilled',   label: 'Meat · Cold Cuts',            categories: ['meat'],                                visitOrder: 5,  x: A.RX, y: A.BY,    width: A.CW, height: A.BH },
    // Row 0
    { id: 'grains',    label: 'Canned · Pasta · Spreads',    categories: ['canned', 'grains', 'baking', 'spreads'], visitOrder: 6, x: A.LX, y: A.ry(0), width: A.CW, height: A.RH },
    { id: 'household', label: 'Household & Care',             categories: ['household'],                           visitOrder: 3,  x: A.RX, y: A.ry(0), width: A.CW, height: A.RH },
    // Row 1
    { id: 'frozen',    label: 'Frozen',                       categories: ['frozen'],                              visitOrder: 7,  x: A.LX, y: A.ry(1), width: A.CW, height: A.RH },
    { id: 'beverages', label: 'Beverages',                    categories: ['beverages'],                           visitOrder: 2,  x: A.RX, y: A.ry(1), width: A.CW, height: A.RH },
    // Row 2 — near entrance
    { id: 'bakery',    label: 'Bakery & Snacks',              categories: ['bakery', 'snacks'],                    visitOrder: 8,  x: A.LX, y: A.ry(2), width: A.CW, height: A.RH },
    { id: 'produce',   label: 'Fruit & Veg',                  categories: ['produce'],                             visitOrder: 1,  x: A.RX, y: A.ry(2), width: A.CW, height: A.RH },
  ],
}

// ── Kaufland ──────────────────────────────────────────────────────────────────
// 6 rows, narrow rows (22px), tight gaps (10px), large store feel
// Entrance bottom-LEFT → snake up LEFT col first, then right col down
const K = (() => {
  const MX = 18, CW = 187, MID = 90, BH = 18, RH = 22, RG = 10
  const LX = MX, RX = MX + CW + MID   // 18, 295
  const BY = 10
  const ry = (i) => BY + BH + 10 + i * (RH + RG)
  return { MX, CW, MID, BH, RH, RG, LX, RX, BY, ry }
})()

export const kauflandLayout = {
  id: 'kaufland', name: 'Kaufland', type: 'kaufland', width: W, height: H,
  entrance: { x: 45, y: 382 },
  checkout: { x: W - K.MX - 150, y: 354, width: 150, height: 18 },
  zones: [
    // Back — two halves
    { id: 'dairy',     label: 'Milk & Cheese',          categories: ['dairy'],            visitOrder: 7,  x: K.LX, y: K.BY,    width: K.CW, height: K.BH },
    { id: 'frozen-b',  label: 'Frozen',                 categories: ['frozen'],           visitOrder: 8,  x: K.RX, y: K.BY,    width: K.CW, height: K.BH },
    // Row 0 (left col = first, snake goes up left)
    { id: 'bakery',    label: 'Bakery & Café',           categories: ['bakery'],           visitOrder: 6,  x: K.LX, y: K.ry(0), width: K.CW, height: K.RH },
    { id: 'snacks',    label: 'Sweets & Snacks',         categories: ['snacks','spreads'],  visitOrder: 9,  x: K.RX, y: K.ry(0), width: K.CW, height: K.RH },
    // Row 1
    { id: 'grains',    label: 'Pasta & Rice',            categories: ['grains','baking'],  visitOrder: 5,  x: K.LX, y: K.ry(1), width: K.CW, height: K.RH },
    { id: 'household', label: 'Household & Care',        categories: ['household'],        visitOrder: 10, x: K.RX, y: K.ry(1), width: K.CW, height: K.RH },
    // Row 2
    { id: 'canned',    label: 'Canned & Sauces',         categories: ['canned'],           visitOrder: 4,  x: K.LX, y: K.ry(2), width: K.CW, height: K.RH },
    { id: 'beverages', label: 'Beverages',               categories: ['beverages'],        visitOrder: 11, x: K.RX, y: K.ry(2), width: K.CW, height: K.RH },
    // Row 3
    { id: 'meat',      label: 'Meat & Fish',             categories: ['meat'],             visitOrder: 3,  x: K.LX, y: K.ry(3), width: K.CW, height: K.RH },
    { id: 'organic',   label: 'Organic',                 categories: [],                   visitOrder: 12, x: K.RX, y: K.ry(3), width: K.CW, height: K.RH },
    // Row 4
    { id: 'spreads',   label: 'Coffee & Spreads',        categories: [],                   visitOrder: 2,  x: K.LX, y: K.ry(4), width: K.CW, height: K.RH },
    { id: 'deli',      label: 'Deli',                    categories: [],                   visitOrder: 13, x: K.RX, y: K.ry(4), width: K.CW, height: K.RH },
    // Row 5 — near entrance (left = first for entrance-left)
    { id: 'produce',   label: 'Fruit & Veg',             categories: ['produce'],          visitOrder: 1,  x: K.LX, y: K.ry(5), width: K.CW, height: K.RH },
    { id: 'flowers',   label: 'Flowers & Plants',        categories: [],                   visitOrder: 14, x: K.RX, y: K.ry(5), width: K.CW, height: K.RH },
  ],
}

// ── Shared shelf bar generator ────────────────────────────────────────────────
function zoneShelfBars(zoneId, x, y, w, h) {
  const thick = Math.min(5, Math.floor(h * 0.22))
  const pad = 2
  if (h <= 10) {
    return [{ id: `${zoneId}-s0`, x: x + pad, y: y + pad, width: w - pad * 2, height: h - pad * 2 }]
  }
  return [
    { id: `${zoneId}-s0`, x: x + pad, y: y + pad,             width: w - pad * 2, height: thick },
    { id: `${zoneId}-s1`, x: x + pad, y: y + h - pad - thick, width: w - pad * 2, height: thick },
  ]
}

reweLayout.shelves     = reweLayout.zones.flatMap(z => zoneShelfBars(z.id, z.x, z.y, z.width, z.height))
edekaLayout.shelves    = edekaLayout.zones.flatMap(z => zoneShelfBars(z.id, z.x, z.y, z.width, z.height))
aldiLayout.shelves     = aldiLayout.zones.flatMap(z => zoneShelfBars(z.id, z.x, z.y, z.width, z.height))
kauflandLayout.shelves = kauflandLayout.zones.flatMap(z => zoneShelfBars(z.id, z.x, z.y, z.width, z.height))

// ── Registry & helpers ────────────────────────────────────────────────────────
export const storeLayouts = {
  rewe: reweLayout, edeka: edekaLayout, aldi: aldiLayout, kaufland: kauflandLayout,
}

export function getLayoutForStore(store) {
  const brand = (store?.brand || store?.name || '').toLowerCase()
  if (brand.includes('rewe'))                                                        return reweLayout
  if (brand.includes('edeka') || brand.includes('netto'))                            return edekaLayout
  if (brand.includes('aldi') || brand.includes('lidl') || brand.includes('penny'))   return aldiLayout
  if (brand.includes('kaufland') || brand.includes('real'))                          return kauflandLayout
  const all = [reweLayout, edekaLayout, aldiLayout, kauflandLayout]
  const hash = (store?.id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return all[hash % all.length]
}

// Deterministic position — each category gets its own horizontal slot within the zone
export function getProductPosition(product, storeLayout) {
  if (!storeLayout?.zones) return null
  const zone = storeLayout.zones.find(z => z.categories.includes(product.category))
  if (!zone) return null

  let hash = 0
  const id = String(product.id)
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
  }
  hash = Math.abs(hash)

  // Split zone into equal slots per category so different categories never overlap
  const catCount = Math.max(zone.categories.length, 1)
  const catIndex = zone.categories.indexOf(product.category)
  const slotWidth = zone.width / catCount
  const slotX = zone.x + catIndex * slotWidth

  // Margin scales with slot size so dots stay well inside their slot
  const marginX = Math.max(8, Math.floor(slotWidth * 0.12))
  const xRaw = slotX + marginX + ((hash * 40503) % 100000) / 100000 * (slotWidth - marginX * 2)
  const x = Math.max(slotX + marginX, Math.min(slotX + slotWidth - marginX, xRaw))
  const y = zone.y + zone.height / 2

  return { x, y, zoneId: zone.id, zoneName: zone.label, visitOrder: zone.visitOrder }
}

export function sortProductsByLayout(products, storeLayout) {
  if (!storeLayout?.zones) return products
  const order = (p) => {
    const zone = storeLayout.zones.find(z => z.categories.includes(p.category))
    return zone?.visitOrder ?? 999
  }
  return [...products].sort((a, b) => order(a) - order(b))
}

// ── Product alternatives ──────────────────────────────────────────────────────
const byName = {
  'milk':               [{ name: 'Oat Milk', category: 'dairy', tags: ['vegan'] }, { name: 'Soy Milk', category: 'dairy', tags: ['vegan'] }, { name: 'Rice Milk', category: 'dairy', tags: ['vegan'] }, { name: 'Almond Milk', category: 'dairy', tags: ['vegan'] }],
  'oatmilk':            [{ name: 'Soy Milk', category: 'dairy', tags: ['vegan'] }, { name: 'Rice Milk', category: 'dairy', tags: ['vegan'] }, { name: 'Whole Milk', category: 'dairy' }],
  'bread':              [{ name: 'Toast', category: 'bakery' }, { name: 'Baguette', category: 'bakery' }, { name: 'Whole Grain Bread', category: 'bakery' }],
  'chips':              [{ name: 'Popcorn', category: 'snacks' }, { name: 'Rice Cakes', category: 'snacks' }, { name: 'Pretzels', category: 'snacks' }],
  'melon':              [{ name: 'Watermelon', category: 'produce' }, { name: 'Pineapple', category: 'produce' }, { name: 'Mango', category: 'produce' }],
  'marmalade':          [{ name: 'Strawberry Jam', category: 'spreads' }, { name: 'Honey', category: 'spreads' }, { name: 'Nutella', category: 'spreads' }],
  'rice':               [{ name: 'Pasta', category: 'grains' }, { name: 'Couscous', category: 'grains' }, { name: 'Quinoa', category: 'grains' }],
  'flour':              [{ name: 'Whole Wheat Flour', category: 'baking' }, { name: 'Spelt Flour', category: 'baking' }, { name: 'Almond Flour', category: 'baking', tags: ['vegan', 'gluten-free'] }],
  'thuna':              [{ name: 'Salmon Tin', category: 'canned' }, { name: 'Sardines', category: 'canned' }, { name: 'Mackerel', category: 'canned' }],
  'bubblegum':          [{ name: 'Chewing Gum', category: 'snacks' }, { name: 'Mints', category: 'snacks' }],
  'cleaning detergent': [{ name: 'Multi-Purpose Spray', category: 'household' }, { name: 'All-Purpose Cleaner', category: 'household' }, { name: 'Eco Cleaner', category: 'household', tags: ['vegan'] }],
}
const byCategory = {
  dairy:     [{ name: 'Oat Milk', category: 'dairy', tags: ['vegan'] }, { name: 'Soy Yogurt', category: 'dairy', tags: ['vegan'] }],
  bakery:    [{ name: 'Crackers', category: 'bakery' }, { name: 'Toast', category: 'bakery' }],
  produce:   [{ name: 'Seasonal Fruit', category: 'produce' }],
  snacks:    [{ name: 'Popcorn', category: 'snacks' }, { name: 'Rice Cakes', category: 'snacks' }],
  household: [{ name: 'Multi-Purpose Cleaner', category: 'household' }],
  canned:    [{ name: 'Frozen version', category: 'frozen' }],
  grains:    [{ name: 'Pasta', category: 'grains' }, { name: 'Couscous', category: 'grains' }],
  spreads:   [{ name: 'Honey', category: 'spreads' }, { name: 'Nut Butter', category: 'spreads', tags: ['vegan'] }],
}

export function getAlternativesForProduct(product) {
  if (!product) return []
  const key = product.name.toLowerCase()
  return byName[key] || byCategory[product.category] || []
}
