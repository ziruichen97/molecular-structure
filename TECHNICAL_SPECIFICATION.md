# MolBuilder 技术规格文档

## 目录

1. [项目概述](#1-项目概述)
2. [功能需求规格](#2-功能需求规格)
3. [技术架构](#3-技术架构)
4. [前端技术栈详解](#4-前端技术栈详解)
5. [后端与云托管方案](#5-后端与云托管方案)
6. [数据模型设计](#6-数据模型设计)
7. [用户界面设计](#7-用户界面设计)
8. [性能优化策略](#8-性能优化策略)
9. [化学计算引擎](#9-化学计算引擎)
10. [文件格式与导入导出](#10-文件格式与导入导出)
11. [安全性考虑](#11-安全性考虑)
12. [测试策略](#12-测试策略)
13. [部署方案](#13-部署方案)
14. [未来扩展规划](#14-未来扩展规划)

---

## 1. 项目概述

### 1.1 项目背景

传统的球棍模型（Ball-and-Stick Model）是化学教学和分子结构研究中的重要工具。物理模型套件存在以下局限：

- 模型套件价格昂贵且组件有限
- 无法构建大型复杂分子
- 难以展示动态的立体化学特性
- 不便于保存和分享

MolBuilder 旨在提供一个基于 Web 的数字化解决方案，通过 3D 可视化技术将球棍模型搬到浏览器中。

### 1.2 目标用户

- **化学专业学生**：学习有机化学、立体化学时的辅助工具
- **化学教师**：课堂演示分子结构
- **研究人员**：快速构建和检查分子构型
- **药物设计人员**：初步的分子构建和可视化

### 1.3 核心价值主张

| 特性 | 物理模型 | MolBuilder |
|------|----------|------------|
| 成本 | 套件 ¥200-2000 | 免费在线使用 |
| 原子数量 | 受限于套件 | 无限制 |
| 存储分享 | 需要拍照 | JSON/MOL文件一键分享 |
| 立体化学标注 | 不支持 | R/S、顺反标记 |
| 几何参数 | 需要量角器 | 实时自动计算 |
| 预设模板 | 无 | 10+ 常见分子 |

---

## 2. 功能需求规格

### 2.1 核心功能 (P0 - 已实现)

#### 2.1.1 三维可视化

| 需求 ID | 描述 | 状态 |
|---------|------|------|
| VIS-001 | WebGL 三维渲染画布 | ✅ |
| VIS-002 | 球棍模型显示（原子球 + 化学键棒） | ✅ |
| VIS-003 | 轨道控制（旋转、缩放、平移） | ✅ |
| VIS-004 | 环境光 + 定向光照系统 | ✅ |
| VIS-005 | 抗锯齿渲染 | ✅ |
| VIS-006 | 坐标网格和坐标轴辅助 | ✅ |

**技术实现**：
- 使用 React Three Fiber 封装 Three.js
- `OrbitControls` 实现轨道控制
- `GizmoHelper` + `GizmoViewport` 显示坐标轴
- `Grid` 组件提供参考网格
- 球体使用 32x32 细分面片实现平滑渲染

#### 2.1.2 原子操作

| 需求 ID | 描述 | 状态 |
|---------|------|------|
| ATOM-001 | 添加指定元素原子 | ✅ |
| ATOM-002 | 按 CPK 配色方案着色 | ✅ |
| ATOM-003 | 按范德华半径比例显示 | ✅ |
| ATOM-004 | 选择原子（单选/多选） | ✅ |
| ATOM-005 | 移动原子（3D 拖拽） | ✅ |
| ATOM-006 | 删除原子（级联删除关联键） | ✅ |
| ATOM-007 | 显示元素标签 | ✅ |
| ATOM-008 | 设置原子手性 (R/S) | ✅ |
| ATOM-009 | 设置原子电荷 | ✅ |

**原子颜色方案 (CPK)**：

| 元素 | 颜色代码 | 显示 |
|------|----------|------|
| H (氢) | #FFFFFF | 白色 |
| C (碳) | #333333 | 深灰 |
| N (氮) | #3050F8 | 蓝色 |
| O (氧) | #FF0D0D | 红色 |
| F (氟) | #90E050 | 浅绿 |
| P (磷) | #FF8000 | 橙色 |
| S (硫) | #FFFF30 | 黄色 |
| Cl (氯) | #1FF01F | 绿色 |
| Br (溴) | #A62929 | 暗红 |
| I (碘) | #940094 | 紫色 |

#### 2.1.3 化学键操作

| 需求 ID | 描述 | 状态 |
|---------|------|------|
| BOND-001 | 创建两原子间化学键 | ✅ |
| BOND-002 | 支持单键、双键、三键、芳香键 | ✅ |
| BOND-003 | 可视化不同键型（多圆柱体表示） | ✅ |
| BOND-004 | 选择化学键 | ✅ |
| BOND-005 | 删除化学键 | ✅ |
| BOND-006 | 双击切换键类型 | ✅ |
| BOND-007 | 显示键长信息 | ✅ |
| BOND-008 | 芳香键半透明渲染 | ✅ |

**键型渲染规则**：
- **单键**：单个圆柱体
- **双键**：两个平行圆柱体，间距 0.15Å
- **三键**：三个圆柱体（中心 + 两侧偏移 0.15Å）
- **芳香键**：一实一虚（半透明）双线

#### 2.1.4 分子模板

| 模板名称 | 分子式 | 原子数 | 化学键数 |
|----------|--------|--------|----------|
| 甲烷 Methane | CH₄ | 5 | 4 |
| 乙烷 Ethane | C₂H₆ | 8 | 7 |
| 乙烯 Ethylene | C₂H₄ | 6 | 5 |
| 乙炔 Acetylene | C₂H₂ | 4 | 3 |
| 苯 Benzene | C₆H₆ | 12 | 12 |
| 水 Water | H₂O | 3 | 2 |
| 氨 Ammonia | NH₃ | 4 | 3 |
| 甲醇 Methanol | CH₃OH | 6 | 5 |
| 环己烷 Cyclohexane | C₆H₁₂ | 18 | 18 |
| 甲醛 Formaldehyde | CH₂O | 4 | 3 |

#### 2.1.5 文件操作

| 需求 ID | 描述 | 状态 |
|---------|------|------|
| FILE-001 | 导出 JSON 格式 | ✅ |
| FILE-002 | 导出 MOL 文件 (V2000) | ✅ |
| FILE-003 | 导出 SDF 文件 | ✅ |
| FILE-004 | 导入 JSON 文件 | ✅ |
| FILE-005 | 本地存储保存/加载 | ✅ |

#### 2.1.6 撤销/重做系统

| 需求 ID | 描述 | 状态 |
|---------|------|------|
| HIST-001 | 操作历史记录（最多 50 步） | ✅ |
| HIST-002 | 撤销 (Ctrl+Z) | ✅ |
| HIST-003 | 重做 (Ctrl+Y / Ctrl+Shift+Z) | ✅ |
| HIST-004 | 深拷贝状态快照 | ✅ |

### 2.2 化学计算功能 (P0 - 已实现)

| 需求 ID | 描述 | 状态 |
|---------|------|------|
| CALC-001 | 分子式计算（Hill 排序） | ✅ |
| CALC-002 | 分子量计算 | ✅ |
| CALC-003 | 键长计算（欧几里得距离） | ✅ |
| CALC-004 | 键角计算（向量夹角） | ✅ |
| CALC-005 | 原子计数统计 | ✅ |
| CALC-006 | 化学键计数统计 | ✅ |

### 2.3 增强功能 (P1 - 未来迭代)

| 需求 ID | 描述 | 优先级 |
|---------|------|--------|
| ENH-001 | SMILES 输入解析 | P1 |
| ENH-002 | InChI 格式支持 | P1 |
| ENH-003 | IUPAC 命名建议 | P1 |
| ENH-004 | 极性计算 | P1 |
| ENH-005 | 自动补氢功能 | P1 |
| ENH-006 | 力场优化（MMFF94） | P2 |
| ENH-007 | 分子对称性检测 | P2 |
| ENH-008 | Newman 投影图 | P2 |
| ENH-009 | Fischer 投影图 | P2 |
| ENH-010 | 分子轨道可视化 | P3 |

---

## 3. 技术架构

### 3.1 整体架构图

```
┌──────────────────────────────────────────────────────┐
│                    Browser (客户端)                     │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────────┐  ┌──────────────────────────────┐  │
│  │  React UI   │  │   Three.js 渲染引擎           │  │
│  │  Components │◄─┤   ├── React Three Fiber      │  │
│  │  (Toolbar,  │  │   ├── OrbitControls          │  │
│  │   Sidebar,  │  │   ├── Sphere/Cylinder Mesh   │  │
│  │   Panels)   │  │   └── HTML Overlay (drei)    │  │
│  └──────┬──────┘  └──────────────┬───────────────┘  │
│         │                        │                   │
│         ▼                        ▼                   │
│  ┌────────────────────────────────────────────────┐  │
│  │            Zustand State Store                 │  │
│  │  ├── atoms: Atom[]                            │  │
│  │  ├── bonds: Bond[]                            │  │
│  │  ├── toolMode / selection state               │  │
│  │  ├── history: HistoryEntry[]                  │  │
│  │  └── computed: formula, weight, etc.          │  │
│  └────────────────────────────────────────────────┘  │
│         │                        │                   │
│         ▼                        ▼                   │
│  ┌──────────────┐  ┌────────────────────────────┐   │
│  │ File I/O     │  │ Chemistry Engine           │   │
│  │ (JSON/MOL/   │  │ (geometry calc, element    │   │
│  │  SDF export) │  │  data, bond tables)        │   │
│  └──────────────┘  └────────────────────────────┘   │
│                                                      │
├──────────────────────────────────────────────────────┤
│              localStorage (本地持久化)                 │
└──────────────────────────────────────────────────────┘
          │
          ▼  (未来扩展)
┌──────────────────────────────────────────────────────┐
│                  Cloud Backend                       │
│  ├── 用户认证 (Auth0 / Firebase Auth)                │
│  ├── 分子数据存储 (PostgreSQL / MongoDB)              │
│  ├── SMILES/InChI 解析 API (RDKit Python)            │
│  ├── 力场优化计算 (WebAssembly / Server)              │
│  └── CDN 静态资源分发                                 │
└──────────────────────────────────────────────────────┘
```

### 3.2 前端架构

```
┌─ App.tsx ──────────────────────────────────────────┐
│                                                    │
│  ┌─ Header ────────────────────────────────────┐  │
│  │  Logo + Title                               │  │
│  └─────────────────────────────────────────────┘  │
│                                                    │
│  ┌─ Toolbar ───────────────────────────────────┐  │
│  │  [选择][添加原子][添加键][移动][删除]         │  │
│  │  [撤销][重做] [删除选中][清空]               │  │
│  └─────────────────────────────────────────────┘  │
│                                                    │
│  ┌─ Main Area ──────────┐ ┌─ Sidebar ──────────┐ │
│  │                      │ │  ┌─ Tabs ────────┐ │ │
│  │  ┌─ Canvas3D ─────┐ │ │  │ 元素│模板│属性 │ │ │
│  │  │                 │ │ │  │ 文件│设置     │ │ │
│  │  │  Three.js       │ │ │  └───────────────┘ │ │
│  │  │  Scene          │ │ │                    │ │
│  │  │                 │ │ │  ┌─ Panel Content─┐│ │
│  │  │  ┌──Atoms──┐   │ │ │  │  (根据选中Tab  ││ │
│  │  │  │ ○ ● ○   │   │ │ │  │   切换内容)    ││ │
│  │  │  │ ● ○ ●   │   │ │ │  │               ││ │
│  │  │  │   │ │   │   │ │ │  └───────────────┘│ │
│  │  │  └──Bonds──┘   │ │ │                    │ │
│  │  │                 │ │ │                    │ │
│  │  │  Grid + Axes    │ │ │                    │ │
│  │  └─────────────────┘ │ │                    │ │
│  │                      │ │                    │ │
│  └──────────────────────┘ └────────────────────┘ │
│                                                    │
│  ┌─ StatusBar ─────────────────────────────────┐  │
│  │  原子: N  化学键: M  分子式  分子量  工具    │  │
│  └─────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

### 3.3 数据流

```
用户操作 → React 事件处理 → Zustand Action → State 更新 → React 重渲染 → Three.js 场景更新
                                    ↓
                              History 快照记录
```

---

## 4. 前端技术栈详解

### 4.1 核心依赖

| 包名 | 版本 | 用途 | 选择理由 |
|------|------|------|----------|
| `react` | ^19 | UI 框架 | 生态最丰富，R3F 深度集成 |
| `three` | ^0.172 | 3D 渲染引擎 | Web 3D 标准，WebGL 封装完善 |
| `@react-three/fiber` | ^9 | React Three.js 绑定 | 声明式 3D 组件，与 React 生命周期同步 |
| `@react-three/drei` | ^9 | 3D 辅助组件库 | OrbitControls、Html overlay、Grid 等 |
| `zustand` | ^5 | 状态管理 | 轻量（<1KB），无 boilerplate，支持选择器 |
| `uuid` | ^11 | 唯一 ID 生成 | 原子/键的标识符 |
| `tailwindcss` | ^4 | CSS 框架 | 原子化 CSS，开发效率高 |
| `vite` | ^8 | 构建工具 | 极速 HMR，ESM 原生支持 |
| `typescript` | ^5 | 类型系统 | 化学数据模型的类型安全保证 |

### 4.2 Three.js 技术选型理由

**为何选择 Three.js 而非其他方案？**

| 方案 | 优势 | 劣势 | 评估 |
|------|------|------|------|
| **Three.js + R3F** | 成熟生态、React 集成、声明式 API | 包体积较大 | ✅ 采用 |
| Babylon.js | 内置物理引擎、TypeScript 原生 | React 集成较弱 | ❌ |
| PlayCanvas | 编辑器强大 | 偏游戏引擎 | ❌ |
| 原生 WebGL | 最轻量 | 开发成本极高 | ❌ |
| WebGPU | 下一代标准 | 浏览器支持不足 | ❌ (未来考虑) |

**React Three Fiber 的关键优势**：
1. 将 Three.js 对象映射为 React 组件，利用 React 的声明式范式
2. 与 React 生态无缝集成（hooks, context, suspense）
3. 自动管理 Three.js 资源的创建和销毁
4. `useFrame` 提供高效的逐帧更新循环

### 4.3 状态管理设计

选择 Zustand 而非 Redux/MobX 的理由：

```typescript
// Zustand 的简洁 API - 无需 Provider 包裹
const useMoleculeStore = create<MoleculeState>((set, get) => ({
  atoms: [],
  bonds: [],
  addAtom: (element, position) => {
    set((state) => ({ atoms: [...state.atoms, newAtom] }));
    get().pushHistory('Add atom');
  },
}));

// 组件中直接使用，支持选择器避免不必要的重渲染
function AtomSphere({ atom }) {
  const toolMode = useMoleculeStore(state => state.toolMode);
  // ...
}
```

---

## 5. 后端与云托管方案

### 5.1 当前阶段：纯静态部署

当前版本为纯前端应用，可以部署到任何静态文件托管服务：

| 平台 | 优势 | 免费额度 | 推荐场景 |
|------|------|----------|----------|
| **Vercel** | Git 集成、自动部署、Edge CDN | 100GB/月 | ✅ 首选 |
| Netlify | 类似 Vercel | 100GB/月 | 备选 |
| Cloudflare Pages | 全球 CDN、无限带宽 | 无限 | 大流量场景 |
| GitHub Pages | 免费、简单 | 100GB/月 | 开源项目 |
| AWS S3 + CloudFront | 高度可定制 | 免费层有限 | 企业级 |

**推荐部署流程**：

```
GitHub Push → Vercel Auto Build → CDN 分发 → 用户访问
```

### 5.2 未来阶段：后端服务架构

当需要用户认证、云端存储、高级计算功能时：

```
┌─────────────────────────────────────────┐
│          Frontend (Vercel / CDN)         │
│          React SPA + Three.js           │
└──────────────────┬──────────────────────┘
                   │ REST API / GraphQL
                   ▼
┌─────────────────────────────────────────┐
│           API Gateway                    │
│    (AWS API Gateway / Cloudflare Workers)│
└──────┬──────────────┬───────────────────┘
       │              │
       ▼              ▼
┌──────────┐  ┌───────────────┐
│ Auth     │  │ Molecule API  │
│ Service  │  │ (Node.js/     │
│ (Auth0)  │  │  Python)      │
└──────────┘  └───────┬───────┘
                      │
              ┌───────┴───────┐
              │               │
              ▼               ▼
       ┌──────────┐  ┌───────────────┐
       │ Database │  │ Compute       │
       │ (Postgres│  │ (RDKit/WASM)  │
       │  / Mongo)│  │               │
       └──────────┘  └───────────────┘
```

**后端技术选型建议**：

| 组件 | 推荐方案 | 理由 |
|------|----------|------|
| API 服务 | Node.js (Fastify) 或 Python (FastAPI) | JS 统一栈或 Python 化学库生态 |
| 数据库 | PostgreSQL + JSON 字段 | 结构化 + 半结构化数据混合存储 |
| 认证 | Auth0 或 Firebase Auth | 开箱即用，支持社交登录 |
| 文件存储 | AWS S3 / Cloudflare R2 | 分子文件持久化 |
| 计算服务 | RDKit (Python) 或 OpenBabel | SMILES 解析、分子优化、属性计算 |
| 缓存 | Redis | 计算结果缓存 |

### 5.3 化学计算 API 设计

```
POST /api/molecule/parse-smiles
  Request:  { smiles: "CCO" }
  Response: { atoms: [...], bonds: [...], name: "Ethanol" }

POST /api/molecule/optimize
  Request:  { atoms: [...], bonds: [...], forcefield: "MMFF94" }
  Response: { atoms: [...] }  // 优化后的坐标

GET  /api/molecule/properties?formula=C2H6O
  Response: { mw: 46.07, logP: -0.31, hba: 1, hbd: 1 }

POST /api/molecule/name
  Request:  { atoms: [...], bonds: [...] }
  Response: { iupac: "ethanol", common: "乙醇" }
```

---

## 6. 数据模型设计

### 6.1 核心类型定义

```typescript
interface Atom {
  id: string;          // UUID v4
  element: string;     // 元素符号 ("C", "H", "O", ...)
  position: Vec3;      // 3D 坐标 { x, y, z }
  chirality: 'none' | 'R' | 'S';  // 手性标记
  charge: number;      // 形式电荷
}

interface Bond {
  id: string;
  atomId1: string;     // 第一个原子 ID
  atomId2: string;     // 第二个原子 ID
  type: 'single' | 'double' | 'triple' | 'aromatic';
  cisTransConfig: 'none' | 'cis' | 'trans';
}

interface ElementData {
  symbol: string;
  name: string;
  nameCN: string;
  atomicNumber: number;
  atomicMass: number;
  color: string;           // CPK 颜色
  radius: number;          // 显示半径
  covalentRadius: number;  // 共价半径
  maxBonds: number;        // 最大成键数
  electronegativity: number;
  category: string;
}
```

### 6.2 状态管理结构

```typescript
interface MoleculeState {
  // 分子数据
  atoms: Atom[];
  bonds: Bond[];
  moleculeName: string;

  // UI 状态
  toolMode: ToolMode;
  selectedElement: string;
  selectedBondType: BondType;
  selectedAtomIds: string[];
  selectedBondIds: string[];
  hoveredAtomId: string | null;
  hoveredBondId: string | null;

  // 显示设置
  showLabels: boolean;
  showBondInfo: boolean;
  showAxes: boolean;

  // 历史记录
  history: HistoryEntry[];
  historyIndex: number;

  // 操作方法
  addAtom, removeAtom, moveAtom, ...
  addBond, removeBond, updateBondType, ...
  undo, redo, pushHistory, ...
  exportMOL, exportJSON, importJSON, ...
  getMolecularWeight, getMolecularFormula, ...
}
```

### 6.3 存储格式

**JSON 格式（原生格式）**：
```json
{
  "name": "Ethanol",
  "atoms": [
    { "id": "...", "element": "C", "position": { "x": 0, "y": 0, "z": 0 }, "chirality": "none", "charge": 0 },
    { "id": "...", "element": "C", "position": { "x": 1.54, "y": 0, "z": 0 }, "chirality": "none", "charge": 0 }
  ],
  "bonds": [
    { "id": "...", "atomId1": "...", "atomId2": "...", "type": "single", "cisTransConfig": "none" }
  ]
}
```

**MOL V2000 格式**（行业标准）：
```
Ethanol
  MolBuilder   3D

  9  8  0  0  0  0  0  0  0  0999 V2000
    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    ...
  1  2  1  0  0  0  0
  ...
M  END
```

---

## 7. 用户界面设计

### 7.1 设计原则

1. **深色主题**：减少长时间使用时的眼疲劳，同时让 3D 场景更突出
2. **最小干扰**：UI 元素紧凑，最大化 3D 视口面积
3. **一致的操作语义**：所有工具遵循"选择 → 操作"模式
4. **即时反馈**：悬停高亮、选中动画、操作提示

### 7.2 色彩系统

```
背景色：  #1a1a2e (3D 场景) / #1f2937 (UI 面板)
面板色：  #374151 (gray-700)
边框色：  #4b5563 (gray-600)
文字色：  #e5e7eb (gray-200) / #9ca3af (gray-400)
强调色：  #3b82f6 (blue-500) — 选中、激活
警告色：  #ef4444 (red-500) — 删除
```

### 7.3 布局结构

- **顶部**：应用 Logo + 标题 (40px)
- **工具栏**：操作工具 + 撤销重做 + 快捷操作 (44px)
- **主区域**：
  - 左侧：3D 画布（自适应宽度）
  - 右侧：属性面板 (256px / 16rem)
- **底部**：状态栏 (24px)

### 7.4 交互设计

| 操作 | 鼠标 | 键盘 |
|------|------|------|
| 旋转视角 | 左键拖拽（选择模式） | — |
| 平移视角 | 右键拖拽 | — |
| 缩放 | 滚轮 | — |
| 选择 | 左键点击 | — |
| 多选 | Shift + 左键 | — |
| 切换键型 | 双击化学键 | — |
| 撤销 | — | Ctrl+Z |
| 重做 | — | Ctrl+Y |
| 删除选中 | — | Delete |

---

## 8. 性能优化策略

### 8.1 渲染优化

| 策略 | 应用场景 | 预期效果 |
|------|----------|----------|
| **几何体实例化** (InstancedMesh) | 相同元素的原子共享几何体 | 减少 draw call 50-90% |
| **LOD (Level of Detail)** | 远处原子降低面片数 | GPU 负载降低 30% |
| **视锥剔除** (Frustum Culling) | 视野外对象不渲染 | 自动优化 |
| **选择器优化** | Zustand 细粒度选择器 | 避免不必要的 React 重渲染 |

**实例化渲染示例（大分子优化）**：
```typescript
// 当原子数 > 100 时自动启用
function InstancedAtoms({ atoms }: { atoms: Atom[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    atoms.forEach((atom, i) => {
      dummy.position.set(atom.position.x, atom.position.y, atom.position.z);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current!.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, atoms.length]}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
}
```

### 8.2 状态优化

```typescript
// 使用 Zustand 选择器避免全量重渲染
const atomCount = useMoleculeStore(state => state.atoms.length);
const toolMode = useMoleculeStore(state => state.toolMode);
// 而不是 const { atoms, bonds, toolMode, ... } = useMoleculeStore();
```

### 8.3 内存优化

- 历史记录限制为 50 步，防止内存泄漏
- 深拷贝状态快照，避免引用共享导致的问题
- Three.js 几何体在组件卸载时自动释放

### 8.4 性能基准目标

| 场景 | 原子数 | 目标帧率 | 交互延迟 |
|------|--------|----------|----------|
| 小分子（甲烷等） | < 20 | 60 FPS | < 16ms |
| 中等分子（苯环等） | 20-100 | 60 FPS | < 16ms |
| 大分子 | 100-500 | 30+ FPS | < 33ms |
| 超大分子 | 500-2000 | 15+ FPS | < 66ms |

---

## 9. 化学计算引擎

### 9.1 分子式计算

遵循 Hill 排序规则：
1. 含碳分子：C 优先，然后 H，其余按字母序
2. 不含碳分子：全部按字母序

```typescript
getMolecularFormula(): string {
  const counts = {};
  atoms.forEach(atom => { counts[atom.element] = (counts[atom.element] || 0) + 1; });
  const order = ['C', 'H'];
  const sorted = Object.keys(counts).sort((a, b) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });
  return sorted.map(el => counts[el] === 1 ? el : `${el}${counts[el]}`).join('');
}
```

### 9.2 几何计算

```typescript
// 键长：两原子间欧几里得距离
distance(a, b) = √((ax-bx)² + (ay-by)² + (az-bz)²)

// 键角：以中心原子为顶点的两个向量夹角
angle(A, Center, B) = arccos(v1·v2 / |v1||v2|) × (180/π)
```

### 9.3 参考键长表

| 键 | 键长 (Å) | 键 | 键长 (Å) |
|-----|---------|-----|---------|
| C-C | 1.54 | C=C | 1.34 |
| C≡C | 1.20 | C-H | 1.09 |
| C-N | 1.47 | C=N | 1.29 |
| C≡N | 1.16 | C-O | 1.43 |
| C=O | 1.23 | O-H | 0.96 |
| N-H | 1.01 | C-Cl | 1.77 |

---

## 10. 文件格式与导入导出

### 10.1 支持的格式

| 格式 | 导入 | 导出 | 说明 |
|------|------|------|------|
| JSON (自定义) | ✅ | ✅ | 完整保存所有属性，包括 UI 元数据 |
| MOL V2000 | ❌ (P1) | ✅ | MDL Molfile 标准，广泛兼容 |
| SDF | ❌ (P1) | ✅ | 支持多分子和属性数据 |
| SMILES | ❌ (P1) | ❌ (P1) | 线性分子表示，需后端解析 |
| PDB | ❌ (P2) | ❌ (P2) | 蛋白质数据库格式 |
| XYZ | ❌ (P2) | ❌ (P2) | 简单坐标格式 |

### 10.2 MOL V2000 导出实现

```
行 1: 分子名称
行 2: 程序信息
行 3: 注释（空）
行 4: 原子数 键数 0 0 0 0 0 0 0 0999 V2000
行 5+: x y z 元素符号 ...（每行一个原子）
原子后: 原子1 原子2 键型 ...（每行一个键）
最后:  M  END
```

---

## 11. 安全性考虑

### 11.1 前端安全

| 风险 | 缓解措施 |
|------|----------|
| XSS | React 自动转义、无 `dangerouslySetInnerHTML` |
| 文件注入 | 导入时严格 JSON 解析，try/catch 包裹 |
| 本地存储滥用 | 限制存储条目数量 |
| 第三方依赖漏洞 | `npm audit` + Dependabot |

### 11.2 未来后端安全

| 风险 | 缓解措施 |
|------|----------|
| 认证 | OAuth 2.0 / JWT |
| API 滥用 | Rate limiting |
| 数据泄露 | 加密传输 (TLS) + 加密存储 |
| CORS | 严格来源白名单 |

---

## 12. 测试策略

### 12.1 测试分层

| 层级 | 工具 | 覆盖目标 |
|------|------|----------|
| 单元测试 | Vitest | 数据模型、几何计算、化学引擎 |
| 组件测试 | React Testing Library | UI 组件渲染和交互 |
| 集成测试 | Playwright | 端到端用户流程 |
| 视觉回归 | Playwright Screenshot | 3D 渲染一致性 |

### 12.2 关键测试场景

```
✓ 添加原子到画布
✓ 创建两原子间化学键
✓ 删除原子级联删除关联键
✓ 撤销/重做操作一致性
✓ 分子式计算准确性
✓ MOL 导出格式合规性
✓ 模板加载正确性
✓ 键角计算精度 (±0.1°)
✓ 键长显示精度 (±0.001Å)
```

---

## 13. 部署方案

### 13.1 推荐部署流程 (Vercel)

```bash
# 1. 连接 GitHub 仓库到 Vercel
# 2. 配置构建命令
Build Command: npm run build
Output Directory: dist
Install Command: npm install

# 3. 环境变量（未来后端）
VITE_API_URL=https://api.molbuilder.app

# 4. 自定义域名
molbuilder.app → Vercel DNS
```

### 13.2 CI/CD 流水线

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run build
      - run: npx tsc --noEmit
      # Vercel 自动部署（通过 Git 集成）
```

### 13.3 监控

| 指标 | 工具 | 阈值 |
|------|------|------|
| 页面加载时间 | Vercel Analytics | < 3s |
| LCP | Web Vitals | < 2.5s |
| FID | Web Vitals | < 100ms |
| 错误率 | Sentry | < 0.1% |
| 构建大小 | Bundle Analyzer | < 2MB gzipped |

---

## 14. 未来扩展规划

### 14.1 短期 (P1)

| 功能 | 技术方案 | 依赖 |
|------|----------|------|
| SMILES 输入 | 后端 RDKit API | Python 后端 |
| MOL 文件导入 | 前端解析器 | 无 |
| 自动补氢 | 基于价电子规则 | 无 |
| 极性分析 | 电负性差计算 | 无 |
| 多语言支持 | i18next | 无 |

### 14.2 中期 (P2)

| 功能 | 技术方案 | 依赖 |
|------|----------|------|
| 力场优化 | MMFF94 via WebAssembly | WASM 编译 |
| 分子对称性 | 群论算法 | 无 |
| Newman/Fischer 投影 | 2D Canvas 叠加 | 无 |
| 协作编辑 | WebSocket + CRDT | 后端 |
| 用户账号系统 | Auth0 | 后端 |

### 14.3 长期 (P3)

| 功能 | 技术方案 | 依赖 |
|------|----------|------|
| 分子轨道可视化 | GPU 体积渲染 | WebGPU |
| AI 分子生成 | 生成模型 API | ML 后端 |
| VR/AR 模式 | WebXR | XR 设备 |
| 反应路径模拟 | 过渡态搜索 | HPC 后端 |
| 蛋白质查看器 | PDB 格式支持 | 无 |

---

## 附录 A：开发环境配置

```bash
# 系统要求
Node.js >= 22
npm >= 10

# 初始化
git clone <repo-url>
cd molbuilder
npm install

# 开发
npm run dev      # 启动开发服务器 (localhost:5173)
npm run build    # 构建生产版本
npm run preview  # 预览构建结果

# 代码检查
npx tsc --noEmit  # TypeScript 类型检查
```

## 附录 B：浏览器兼容性

| 浏览器 | 最低版本 | WebGL 支持 |
|--------|----------|------------|
| Chrome | 90+ | WebGL 2.0 |
| Firefox | 90+ | WebGL 2.0 |
| Safari | 15+ | WebGL 2.0 |
| Edge | 90+ | WebGL 2.0 |
| iOS Safari | 15+ | WebGL 2.0 |
| Android Chrome | 90+ | WebGL 2.0 |

---

*文档版本: 1.0 | 最后更新: 2026-03-22*
