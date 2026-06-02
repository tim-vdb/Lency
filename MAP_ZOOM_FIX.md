# Fix: Zoom sur la Carte avec Recherche d'Adresse

## 🎯 Résumé des changements

### ✅ Problème corrigé
Le zoom sur la carte ne fonctionnait pas quand l'utilisateur sélectionnait une adresse car le `ref` sur `MapContainer` n'était pas correctement utilisé dans react-leaflet 5.

### ✅ Solution implémentée

#### 1. **ProjectsMapInner.tsx** - Utilisation du hook `useMap()`
```typescript
// Ancien code (broken)
const mapRef = useRef<L.Map>(null)
<MapContainer ref={mapRef} center={[46.6, 2.3]} zoom={6}>

// Nouveau code (fonctionnel)
function MapZoomController({ addressCoords }) {
  const map = useMap() // Hook react-leaflet
  
  useEffect(() => {
    if (!addressCoords || !map) return
    map.setView([addressCoords.lat, addressCoords.lon], 12, { 
      animate: true,
      duration: 0.5 
    })
  }, [addressCoords, map])
  
  return null
}
```

**Avantages:**
- ✅ Le hook `useMap()` fonctionne avec react-leaflet 5+
- ✅ Animation fluide lors du zoom (`animate: true, duration: 0.5`)
- ✅ Gestion correcte du cycle de vie de la map

#### 2. **MapFilters.tsx** - Améliorations UX
- ⚡ Debounce réduit de 500ms → 300ms (plus réactif)
- 🔍 Jusqu'à 8 suggestions (au lieu de 5)
- ❌ Bouton X pour effacer rapidement la recherche
- 💬 Message d'erreur quand aucun résultat
- 🎨 Meilleure présentation avec séparateurs

## 📍 Fonctionnement complet

### Flow utilisateur:

```
1. Utilisateur tape une adresse
   ↓
2. Après 300ms de pause, l'API Nominatim est appelée
   ↓
3. Suggestions apparaissent au fur et à mesure
   ↓
4. Utilisateur clique sur une suggestion
   ↓
5. ExploreBlock reçoit les coordonnées (lat, lon)
   ↓
6. La carte zoom automatiquement sur le lieu
   ↓
7. Les markers des projets s'affichent au zoom
```

### Composants impliqués:

```
ExploreBlock.tsx
  ├─ state: addressCoords
  └─ handler: handleAddressChange()
       ↓
MapFilters.tsx
  ├─ Input adresse avec debounce 300ms
  ├─ API /api/geocode (Nominatim)
  └─ Retourne {lat, lon}
       ↓
ProjectsMap.tsx (wrapper avec SSR: false)
  └─ ProjectsMapInner.tsx (composant Leaflet)
       ├─ MapContainer (OpenStreetMap)
       ├─ MapZoomController (nouveau hook)
       └─ Markers des projets
```

## 🧪 Comment tester

1. **Accédez au Dashboard > Explorer**
2. **Tape une adresse** : "Paris", "Lyon", "75001", etc.
3. **Sélectionne une suggestion**
4. **La carte doit zoomer** avec animation fluide
5. **Les marqueurs** des projets doivent être visibles

### Exemples d'adresses à tester:
- `Paris` → Zoom sur Paris, France
- `Lyon` → Zoom sur Lyon, France
- `75001` → Zoom sur le 1er arrondissement de Paris
- `Champs-Élysées, Paris` → Adresse spécifique
- `New York` → Coordonnées internationales

## 🔧 Configuration

### API Nominatim (OpenStreetMap)
- **Gratuit** ✅
- **Sans clé** ✅
- **Limites:** ~1 requête par seconde (debounce de 300ms = OK)
- **Source:** `/api/geocode` (route handler Next.js)

```typescript
// Route: src/app/api/geocode/route.ts
const response = await fetch(
  `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`
)
```

### Animation du zoom
```typescript
map.setView(
  [lat, lon],
  12,  // zoom level
  {
    animate: true,    // Animation fluide
    duration: 0.5     // 500ms
  }
)
```

## 📝 Notes

- Les coordonnées utilisées partout sont en format **[lat, lon]** (standard Leaflet)
- Nominatim retourne les coordonnées séparées (`lat` et `lon`)
- Le composant les combine correctement : `[addressCoords.lat, addressCoords.lon]`

## 🚀 Améliorations futures possibles

1. **Géolocalisation** : Utiliser l'IP/GPS de l'utilisateur pour un zoom initial
2. **Cache** : Mémoriser les recherches précédentes
3. **Historique** : Dernier endroit recherché
4. **Zones** : Permettre de dessiner des zones sur la carte
5. **Reverse geocoding** : Cliquer sur la map pour obtenir l'adresse

