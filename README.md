# MolBuilder - 3D 分子结构构建器

一个基于 Web 的交互式 3D 分子结构构建工具，使用球棍模型在线创建和可视化分子结构，替代传统物理模型套件。

## 功能特点

- **3D 可视化**：基于 Three.js 的实时 3D 渲染，支持旋转、缩放、平移
- **交互式构建**：添加原子、创建化学键、移动和删除组件
- **元素选择器**：支持 H、C、N、O、F、P、S、Cl、Br、I 等常见有机化学元素
- **分子模板**：预设甲烷、乙烷、乙烯、乙炔、苯、水、氨、甲醇、环己烷、甲醛等分子
- **立体化学**：支持 R/S 手性标记和顺反异构
- **几何参数**：显示键长、键角等空间参数
- **文件操作**：保存/加载/导出为 JSON、MOL (V2000)、SDF 格式
- **撤销/重做**：完整的操作历史记录
- **分子属性**：自动计算分子式和分子量

## 技术栈

| 技术 | 用途 |
|------|------|
| React 19 | UI 框架 |
| TypeScript | 类型安全 |
| Three.js + React Three Fiber | 3D 渲染引擎 |
| @react-three/drei | 3D 辅助组件 |
| Zustand | 状态管理 |
| Tailwind CSS 4 | 样式系统 |
| Vite | 构建工具 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 使用说明

### 工具栏

| 工具 | 功能 | 操作说明 |
|------|------|----------|
| 选择 | 选择原子或化学键 | 左键点击选择，Shift+点击多选，双击键切换类型 |
| 添加原子 | 放置新原子 | 选择元素后点击画布 |
| 添加键 | 创建化学键 | 先选择第一个原子，再点击第二个原子 |
| 移动 | 移动原子位置 | 拖拽原子 |
| 删除 | 删除组件 | 点击要删除的原子或键 |

### 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| Ctrl+Z | 撤销 |
| Ctrl+Y / Ctrl+Shift+Z | 重做 |
| Delete / Backspace | 删除选中项 |

### 视角控制

| 操作 | 功能 |
|------|------|
| 左键拖拽 | 旋转视角（选择模式下） |
| 右键拖拽 | 平移视角 |
| 滚轮 | 缩放 |

## 项目结构

```
src/
├── components/          # React 组件
│   ├── AtomSphere.tsx   # 原子球渲染
│   ├── BondStick.tsx    # 化学键棒渲染
│   ├── MoleculeScene.tsx # 3D 场景
│   ├── Toolbar.tsx      # 工具栏
│   ├── Sidebar.tsx      # 侧边栏容器
│   ├── ElementSelector.tsx  # 元素选择器
│   ├── TemplatePanel.tsx    # 分子模板面板
│   ├── PropertiesPanel.tsx  # 属性面板
│   ├── SettingsPanel.tsx    # 设置面板
│   ├── FilePanel.tsx        # 文件操作面板
│   └── StatusBar.tsx        # 状态栏
├── store/
│   └── useMoleculeStore.ts  # Zustand 状态管理
├── data/
│   ├── elements.ts      # 元素数据
│   └── templates.ts     # 分子模板
├── types/
│   └── chemistry.ts     # TypeScript 类型定义
├── utils/
│   └── geometry.ts      # 几何计算工具
├── App.tsx              # 根组件
├── main.tsx             # 入口文件
└── index.css            # 全局样式
```

## 许可

MIT
