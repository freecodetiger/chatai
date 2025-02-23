<template>
  <aside class="sidebar-container" :class="{ 'collapsed': isCollapsed }">
    <div class="sidebar-header">
      <button class="new-chat-btn" @click="chatStore.createNewChat">
        <Icon icon="carbon:add" class="icon" />
        <span class="btn-text">新建会话</span>
      </button>
      <button class="toggle-btn" @click="toggleSidebar">
        <Icon :icon="isCollapsed ? 'carbon:menu' : 'carbon:close'" />
      </button>
    </div>
    
    <div class="theme-switch" v-show="!isCollapsed">
      <button 
        class="theme-btn" 
        @click="toggleTheme"
        :class="{ 'light': !isDark }"
        :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
      >
        <div class="theme-icons">
          <Icon icon="carbon:moon" class="moon" />
          <Icon icon="carbon:sun" class="sun" />
        </div>
        <div class="slider"></div>
      </button>
      <span class="theme-text">{{ isDark ? '深色模式' : '浅色模式' }}</span>
    </div>
    
    <div class="chat-list">
      <div
        v-for="chat in chatStore.chats"
        :key="chat.id"
        class="chat-item"
        @click="chatStore.selectChat(chat.id)"
        :class="{ active: chatStore.currentChatId === chat.id }"
      >
        <Icon icon="carbon:chat" class="chat-icon" />
        <span class="chat-title">{{ chat.title }}</span>
        <button 
          class="delete-btn"
          @click.stop="chatStore.deleteChat(chat.id)"
          v-if="chatStore.chats.length > 1"
        >
          <Icon icon="carbon:trash-can" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { Icon } from '@iconify/vue'
import { useChatStore } from '../stores/chat'

const chatStore = useChatStore()
const isCollapsed = ref(false)
const isDark = inject('isDark', ref(true))
const toggleTheme = inject('toggleTheme', () => {})

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style lang="scss" scoped>
.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  width: 240px;

  &.collapsed {
    width: 60px;

    .btn-text {
      display: none;
    }

    .chat-title {
      display: none;
    }

    .delete-btn {
      display: none;
    }
  }
}

.sidebar-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.new-chat-btn {
  background: var(--brand-gradient);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  .icon {
    font-size: 20px;
  }
}

.toggle-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;

  &:hover {
    background: var(--hover-bg);
  }
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;

  &:hover {
    background: var(--hover-bg);

    .delete-btn {
      opacity: 1;
    }
  }

  &.active {
    background: var(--hover-bg);
  }

  .chat-icon {
    font-size: 20px;
    color: var(--text-secondary);
    flex-shrink: 0;
  }

  .chat-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .delete-btn {
    opacity: 0;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    padding: 4px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: #ff4d4f;
      background: var(--hover-bg);
    }
  }
}

.theme-switch {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
}

.theme-text {
  color: var(--text-secondary);
  font-size: 14px;
}

.theme-btn {
  position: relative;
  width: 64px;
  height: 32px;
  border-radius: 16px;
  background: var(--message-bg);
  border: 2px solid var(--border-color);
  cursor: pointer;
  padding: 2px;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    border-color: var(--text-secondary);
  }

  .theme-icons {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4px;
    color: var(--text-secondary);
    z-index: 1;

    .sun, .moon {
      font-size: 16px;
      transition: color 0.3s ease;
    }
  }

  .slider {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--brand-gradient);
    transition: transform 0.3s ease;
  }

  &.light {
    .slider {
      transform: translateX(32px);
    }

    .sun {
      color: var(--text-primary);
    }
  }

  &:not(.light) {
    .moon {
      color: var(--text-primary);
    }
  }
}
</style> 