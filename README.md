# MatrixOne Intelligence Dashboard

这是一个基于React + TypeScript + Tailwind CSS构建的现代化数据分析仪表盘界面。

## 功能特性

- 🔧 **工作流管理** - 可视化工作流配置与执行状态
- 📊 **数据监控** - 实时显示数据处理进度和状态
- 📁 **文件管理** - 支持多种文件类型的批量处理
- 🎨 **现代UI** - 采用Tailwind CSS构建的美观界面
- 📱 **响应式设计** - 适配各种屏幕尺寸

## 技术栈

- **前端框架**: React 18 + TypeScript
- **样式框架**: Tailwind CSS
- **图标库**: Lucide React
- **构建工具**: Create React App

## 开始使用

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动。

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
  components/
    Dashboard.tsx      # 主仪表盘组件
    Sidebar.tsx        # 侧边栏导航
    Header.tsx         # 顶部头部
    MainContent.tsx    # 主内容区域
    BasicInfo.tsx      # 基本信息组件
    ExecutionInfo.tsx  # 执行信息组件
    WorkflowDiagram.tsx # 工作流图表
    ExecutionDetails.tsx # 执行详情表格
  App.tsx             # 主应用组件
  index.tsx           # 应用入口
  index.css           # 全局样式
```

## 界面预览

该界面包含以下主要部分：

1. **侧边栏导航** - 包含所有功能模块的快速访问
2. **基本信息** - 显示工作流的基本配置信息
3. **执行信息** - 展示当前执行状态和统计数据
4. **工作流图表** - 可视化展示工作流的执行结构
5. **执行详情** - 详细的文件处理状态表格

## 开发说明

- 使用TypeScript进行类型检查
- 采用组件化开发模式
- 遵循React Hooks最佳实践
- 使用Tailwind CSS实现响应式设计