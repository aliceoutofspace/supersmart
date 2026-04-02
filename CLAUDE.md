# SuperSmart – Einkaufsapp

## Stack
- React 18 + Vite (Port 3000: `npm run dev`)
- React Router v6
- Zustand (State Management)
- Framer Motion (Animationen)
- Kein TypeScript, kein CSS-Framework – reines CSS mit Design Tokens

## Projektstruktur

```
src/
  assets/
    einkaufskorb.svg          # Haupt-Icon (Einkaufskorb mit grünem +)
    berlin-stores.json        # 868 Berliner Supermärkte von Overpass API (OpenStreetMap)
  components/
    Logo.jsx / Logo.css
    StoreSelectModal.jsx      # Shared Modal für Store-Auswahl (wird auf Start + List verwendet)
    StoreSelectModal.css
    ui/
      Button.jsx / Button.css
      Card.jsx / Card.css
      Icons.jsx
      StatusDot.jsx / StatusDot.css
      index.js
  pages/
    StartScreen.jsx / StartScreen.css   # Startseite
    ShoppingList.jsx / ShoppingList.css # Einkaufsliste
    StoreMap.jsx / StoreMap.css         # Store-Navigation (Map)
  store/
    useStore.js               # Zustand Store (gesamter App-State)
  styles/
    design-tokens.css         # Alle CSS-Variablen (Farben, Spacing, etc.)
  App.jsx / App.css
  main.jsx
```

## Design System (design-tokens.css)

- **Primärfarbe:** `--color-primary: #8fa872` (Grün)
- **Hintergrund:** Sanfter Beige-Grün Gradient
- **Surface:** `rgba(255,255,255,0.92)` – leicht transparent
- **Font:** DM Sans
- **Spacing:** `--space-xs` (4px) bis `--space-3xl` (64px)
- **Status-Farben:** available (#9BC65C), uncertain (#E8C547), unknown (#888), unavailable (#D4645C)

## Seiten & Features

### StartScreen (`/`)
- Zwei Glas-Cards: "Continue last list" + "New shopping list"
- Cards: Glassmorphism (rgba weiß, backdrop-blur, weiße Outline + Inset-Reflection)
- "Select store (optional)" Button öffnet `StoreSelectModal`
- Sobald Store gewählt: Button zeigt Store-Namen

### ShoppingList (`/list`)
- Produktliste mit Abhak-Funktion: Kreis klicken → grüner Checkmark, Item wird ausgegraut (opacity 0.45) + durchgestrichen, nochmal klicken = rückgängig
- Status-Anzeige: available (grün Dot), uncertain (gelb), unknown (grau), **unavailable = roter Text + durchgestrichen + "not available" Badge**
- Demo-Produkt "Chips" hat `status: 'unavailable'` als Beispiel
- "Change store" öffnet `StoreSelectModal`
- "Show store preview" Toggle mit Beschreibungstext darunter
- Sidebar zeigt gewählten Store mit Adresse

### StoreMap (`/map`)
- Store-Navigation mit Regal-Darstellung
- Produkt-Dots auf der Karte
- **TODO: Noch nicht vollständig fertig / sieht nicht gut aus – muss überarbeitet werden**

### StoreSelectModal (shared component)
- Sucht durch `berlin-stores.json` (868 Einträge)
- **Multi-Wort-Suche:** z.B. "Edeka Wedding" → splittet in Tokens, alle müssen in Name/Adresse/Bezirk matchen
- Zeigt standardmäßig erste 20, gefiltert max 30 Ergebnisse
- Store-Objekt: `{ id, name, brand, address, district, lat, lon }`

## Zustand (useStore.js)

Wichtige Actions:
- `startNewList()` – leere Liste
- `continueLastList()` – lädt `demoProducts`
- `addProduct(name)` – fügt Produkt hinzu (status: 'unknown')
- `removeProduct(id)`
- `toggleChecked(id)` – abhaken / wieder aktivieren
- `selectStore(storeObj)` – nimmt `{ id, name, address, district }` oder nichts für Demo
- `startShopping()` – wechselt in Shopping-Modus
- `markAsFound(id)`, `markAsNotFound(id)`
- `getAvailabilityStats()` – gibt `{ total, available, text }` zurück

Demo-Produkte in `useStore.js` (demoProducts) – "Chips" ist `unavailable` als Beispiel.

## Bekannte TODOs / nächste Schritte

- **StoreMap überarbeiten** – sieht noch nicht gut aus, Funktionalität ist teilweise da aber UI braucht komplett überarbeitung
- Die App hat kein Backend – alles ist Demo-Daten / localStorage wäre nächster Schritt für Persistenz
- berlin-stores.json enthält nur Nodes (keine Ways/Relations) von OSM – manche große Märkte fehlen eventuell
- StoreMap hat noch keinen echten Zusammenhang mit den Overpass-Store-Daten (nutzt noch Demo-Layout)

## Arbeitsweise & Präferenzen

- Deutsch kommunizieren, Code auf Englisch
- Immer erst lesen bevor ändern
- Keine unnötigen Abstraktionen oder Features
- CSS direkt in `.css` Dateien, keine CSS-in-JS
