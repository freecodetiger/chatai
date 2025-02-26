# ChatAI - 智能对话助手

这是一个基于现代前端技术栈开发的 AI 聊天应用，支持多种 AI 模型的对话功能。

## 技术栈

### 前端
- **框架**: Vue 3 (使用 Composition API)
- **构建工具**: Vite 6
- **状态管理**: Pinia
- **样式处理**: SCSS
- **UI 组件**:
  - @iconify/vue (图标库)
  - @vueuse/core (Vue 组合式工具集)
- **HTTP 客户端**: Axios
- **包管理器**: npm

### AI 服务集成
- Moonshot AI (Kimi)
- 百度文心一言

## 功能特点

- 🌓 深色/浅色主题切换
- 💬 多模型支持（Kimi、文心一言）
- 📱 响应式设计
- 🔄 实时对话
- 💾 会话历史记录
- ⚡ 快速响应
- 📎 文件上传功能
  - 支持文本文件、图片、PDF、Word、Excel等格式
  - 拖拽上传
  - 文本文件内容预览
  - 文件类型图标显示
  - 文件大小显示

## 开发环境设置

1. 克隆项目
```bash
git clone <repository-url>
cd chatai
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## 项目结构

```
chatai/
├── src/
│   ├── components/     # Vue 组件
│   │   ├── FileUploader.vue    # 文件上传组件
│   │   ├── InputArea.vue       # 输入区域组件
│   │   └── ...
│   ├── services/       # API 服务
│   │   ├── api.ts            # AI API 服务
│   │   └── upload.ts         # 文件上传服务
│   ├── stores/         # Pinia 状态管理
│   ├── assets/         # 静态资源
│   ├── App.vue         # 根组件
│   └── main.ts         # 入口文件
├── public/             # 公共资源
├── index.html          # HTML 模板
├── vite.config.ts      # Vite 配置
└── package.json        # 项目配置和依赖
```

## 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

## API 密钥配置

使用前需要配置以下 API 密钥：

- Moonshot AI (Kimi) API Key
- 百度文心一言 Access Token

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

[MIT License](LICENSE)
