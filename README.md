# MolBuilder - 3D Molecular Structure Builder

An interactive web-based 3D molecular structure building tool. Create and visualize molecular structures using ball-and-stick models online, replacing traditional physical model kits.

## Features

- **3D Visualization**: Real-time 3D rendering powered by Three.js with rotation, zoom, and pan controls
- **Interactive Building**: Add atoms, create chemical bonds, move and delete components
- **Element Selector**: Supports common organic chemistry elements — H, C, N, O, F, P, S, Cl, Br, I
- **Molecule Templates**: Preset molecules including methane, ethane, ethylene, acetylene, benzene, water, ammonia, methanol, cyclohexane, formaldehyde
- **Stereochemistry**: R/S chirality labeling and cis-trans isomerism support
- **Geometric Parameters**: Displays bond lengths, bond angles, and other spatial parameters
- **File Operations**: Save/load/export in JSON, MOL (V2000), and SDF formats
- **Undo/Redo**: Complete operation history tracking
- **Molecular Properties**: Automatic molecular formula and molecular weight calculation

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Three.js + React Three Fiber | 3D Rendering Engine |
| @react-three/drei | 3D Helper Components |
| Zustand | State Management |
| Tailwind CSS 4 | Styling System |
| Vite 8 | Build Tool |

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

## Usage

### Toolbar

| Tool | Function | Instructions |
|---|---|---|
| Select | Select atoms or bonds | Left-click to select, Shift+click for multi-select, double-click a bond to toggle type |
| Add Atom | Place a new atom | Choose an element, then click on the canvas |
| Add Bond | Create a chemical bond | Select the first atom, then click the second atom |
| Move | Reposition atoms | Drag an atom to move it |
| Delete | Remove components | Click an atom or bond to delete it |

### Keyboard Shortcuts

| Shortcut | Function |
|---|---|
| Ctrl+Z | Undo |
| Ctrl+Y / Ctrl+Shift+Z | Redo |
| Delete / Backspace | Delete selected items |

### Camera Controls

| Action | Function |
|---|---|
| Left-click drag | Rotate view (in Select mode) |
| Right-click drag | Pan view |
| Scroll wheel | Zoom |

## Project Structure

```
src/
├── components/             # React components
│   ├── AtomSphere.tsx      # Atom sphere rendering
│   ├── BondStick.tsx       # Chemical bond stick rendering
│   ├── MoleculeScene.tsx   # 3D scene
│   ├── Toolbar.tsx         # Toolbar
│   ├── Sidebar.tsx         # Sidebar container
│   ├── ElementSelector.tsx # Element selector
│   ├── TemplatePanel.tsx   # Molecule template panel
│   ├── PropertiesPanel.tsx # Properties panel
│   ├── SettingsPanel.tsx   # Settings panel
│   ├── FilePanel.tsx       # File operations panel
│   └── StatusBar.tsx       # Status bar
├── store/
│   └── useMoleculeStore.ts # Zustand state management
├── data/
│   ├── elements.ts         # Element data
│   └── templates.ts        # Molecule templates
├── types/
│   └── chemistry.ts        # TypeScript type definitions
├── utils/
│   └── geometry.ts         # Geometry calculation utilities
├── App.tsx                 # Root component
├── main.tsx                # Entry point
└── index.css               # Global styles
```

## License

MIT
