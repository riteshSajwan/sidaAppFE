# Map Services Module

A reusable **Map Component Library** for **React Native Expo projects** with support for:
- Google Maps (via `react-native-maps`)
- Route/Path Directions (via `react-native-maps-directions`)

---

## Features
- Draw route/path between two locations.
- Show current and destination location markers.
- Show nearby markers with respect to current location marker.
- Show a Error modal when route/path is not fetch.
- Works with **React Native Expo (Android/iOS)**.

---

### Prerequisites

- Node.js (v18 or above)
- Expo CLI
- React 
- React Native
- React Native Paper
- React Native Maps
- React Native Maps Direction
- Expo Location
- Geolib

---

## 📦 Installation Guide (Main App)
```bash
# 1. Add this Module as a Git Submodule
git submodule add <repo-link> src/submodules/MapServices

## 2. Install Dependencies

### Core Dependencies (Required for all components)
npx expo install react-native-maps react-native-paper react-native-maps-directions

### Core Dependencies (Required for web map)
npx expo install leaflet react-leaflet leaflet-polylinedecorator @types/leaflet

### Optional Dependencies
For location tracking & distance calculation features:
npx expo install expo-location geolib

