<script setup lang="ts">
import { ref, provide, watch } from 'vue'
import Sidebar from './components/Sidebar.vue'
import ChatArea from './components/ChatArea.vue'
import InputArea from './components/InputArea.vue'
import DeveloperInfo from './components/DeveloperInfo.vue'

// 从 localStorage 获取主题设置，默认为深色主题
const isDark = ref(localStorage.getItem('theme') !== 'light')

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// 监听主题变化并更新 DOM
watch(isDark, (newValue) => {
  if (newValue) {
    document.documentElement.classList.remove('light-theme')
  } else {
    document.documentElement.classList.add('light-theme')
  }
}, { immediate: true })

provide('toggleTheme', toggleTheme)
provide('isDark', isDark)
</script>

<template>
  <div class="app-container" :class="{ 'light-theme': !isDark }">
    <Sidebar class="sidebar" />
    <main class="main-content">
      <ChatArea class="chat-area" />
      <InputArea class="input-area" />
    </main>
    <footer class="developer-info">
      <DeveloperInfo />
    </footer>
  </div>
</template>

<style lang="scss">
:root {
  // 深色主题
  --primary-bg: #1A1A1A;
  --sidebar-bg: #121212;
  --brand-gradient: linear-gradient(135deg, #00FF88 0%, #00CCFF 100%);
  --text-primary: #FFFFFF;
  --text-secondary: #CCCCCC;
  --message-bg: #2A2A2A;
  --hover-bg: rgba(255, 255, 255, 0.1);
  --border-color: rgba(255, 255, 255, 0.1);
  --user-message-gradient: linear-gradient(135deg, #1a73e8 0%, #185abc 100%);
  --scrollbar-thumb: #666666;
  --scrollbar-track: #2A2A2A;
}

.light-theme {
  // 浅色主题
  --primary-bg: #F8F9FA;
  --sidebar-bg: #FFFFFF;
  --text-primary: #2C3E50;
  --text-secondary: #606F7B;
  --message-bg: #FFFFFF;
  --hover-bg: rgba(0, 0, 0, 0.05);
  --border-color: #E2E8F0;
  --user-message-gradient: linear-gradient(135deg, #00B4DB 0%, #0083B0 100%);
  --scrollbar-thumb: #CBD5E0;
  --scrollbar-track: #EDF2F7;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  
  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--scrollbar-track);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 4px;
    
    &:hover {
      background: var(--text-secondary);
    }
  }
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: var(--primary-bg);
  color: var(--text-primary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.app-container {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr auto;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--primary-bg);
}

.sidebar {
  grid-row: 1 / -1;
  background-color: var(--sidebar-bg);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  border-right: 1px solid var(--border-color);
  z-index: 10;
}

.main-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--primary-bg);
  overflow: hidden;
}

.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: var(--primary-bg);
}

.input-area {
  padding: 20px;
  border-top: 1px solid var(--border-color);
  background-color: var(--primary-bg);
}

.developer-info {
  grid-column: 2;
  padding: 10px 20px;
  background-color: var(--sidebar-bg);
  border-top: 1px solid var(--border-color);
}

button {
  font-family: inherit;
}
</style>
