import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Pages
import { StartScreen } from './pages/StartScreen'
import { ShoppingList } from './pages/ShoppingList'
import { StoreMap } from './pages/StoreMap'

// Styles
import './App.css'

/**
 * SuperSmart App
 * 
 * Die Haupt-App-Komponente mit Routing.
 * 
 * Routen:
 * - / = StartScreen (Liste wählen oder neu erstellen)
 * - /list = ShoppingList (Produkte verwalten)
 * - /map = StoreMap (Im Store navigieren)
 */
function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <div className="app">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<StartScreen />} />
            <Route path="/list" element={<ShoppingList />} />
            <Route path="/map" element={<StoreMap />} />
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  )
}

export default App
