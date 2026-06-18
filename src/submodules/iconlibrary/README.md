# 📦 iconlibraryfe-module

A reusable **React Native + Expo icon library** for managing and consuming SVG icons across your projects.  
It supports **TypeScript**, **react-native-svg**, and **expo metro transformer** out of the box.

---

## 🚀 Features

- 📂 Organized folder structure for scalable icon management  
- 🎨 SVG support via `react-native-svg` and `react-native-svg-transformer`  
- 🔧 TypeScript typings with `svg.d.ts`  
- ⚡ Works as a Git submodule (no npm publish required)  
- 🛠️ Provides a customizable `<CustomIcon />` component  

---

## 📂 Folder Structure

iconlibrary/
├── src/
│ ├── assets/
│ │ └── icons/ # All your SVG icons
│ ├── components/
│ │ └── CustomIcon.tsx
│ ├── index.ts # Root exports
│ └── svg.d.ts # SVG type declarations
├── lib/ # Built files (after running tsc)
├── package.json
├── tsconfig.json
└── README.md


### 1. Add as a Git Submodule
In your main project:

```sh
git submodule add <git-repo-url> iconlibraryfe-module

## 2. Install Dependencies

### Core Dependencies (Required for all components)

npm install react react-native react-native-svg react-native-svg-transformer

## 3. In your main project, update metro.config.ts shared in react-native-svg-transformer docs
