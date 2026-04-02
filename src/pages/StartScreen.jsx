import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '../components/Logo'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { IconLocation } from '../components/ui/Icons'
import { StoreSelectModal } from '../components/StoreSelectModal'
import { useStore } from '../store/useStore'
import einkaufskorb from '../assets/einkaufskorb.svg'
import './StartScreen.css'

export function StartScreen() {
  const navigate = useNavigate()
  const [showStoreSelect, setShowStoreSelect] = useState(false)
  const { lastList, startNewList, continueLastList, selectStore, selectedStore } = useStore()

  const handleNewList = () => {
    startNewList()
    navigate('/list')
  }

  const handleContinueList = () => {
    continueLastList()
    navigate('/list')
  }

  const handleStoreSelect = (store) => {
    selectStore(store)
    setShowStoreSelect(false)
  }

  return (
    <div className="start-screen">
      <header className="start-screen__header">
        <Logo size="md" />
      </header>

      <main className="start-screen__main">
        <motion.div
          className="start-screen__greeting"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="start-screen__title">What do you need today?</h1>
          <p className="start-screen__subtitle">
            Plan your shopping at your leisure – or start right in the store.
          </p>
        </motion.div>

        <div className="start-screen__cards">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card
              variant="interactive"
              padding="lg"
              onClick={handleContinueList}
              className="start-screen__card"
            >
              <div className="start-screen__card-icon">
                <img src={einkaufskorb} alt="" className="start-screen__basket-icon" />
              </div>
              <h2 className="start-screen__card-title">Continue last list</h2>
              <p className="start-screen__card-date">{lastList.date}</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card
              variant="interactive"
              padding="lg"
              onClick={handleNewList}
              className="start-screen__card"
            >
              <div className="start-screen__card-icon">
                <img src={einkaufskorb} alt="" className="start-screen__basket-icon" />
              </div>
              <h2 className="start-screen__card-title">New shopping list</h2>
            </Card>
          </motion.div>
        </div>

        <motion.div
          className="start-screen__store-select"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            variant="secondary"
            icon={<IconLocation />}
            onClick={() => setShowStoreSelect(true)}
          >
            {selectedStore ? selectedStore.name : 'Select store (optional)'}
          </Button>
        </motion.div>
      </main>

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

export default StartScreen
