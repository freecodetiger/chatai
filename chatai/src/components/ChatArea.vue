<template>
  <div class="chat-container">
    <div class="model-selector">
      <select 
        :value="chatStore.currentModel"
        @change="handleModelChange"
        class="model-select"
      >
        <option 
          v-for="model in chatStore.models" 
          :key="model.id" 
          :value="model.id"
        >
          {{ model.name }}
        </option>
      </select>
    </div>
    <div class="messages" ref="messagesContainer">
      <div
        v-for="message in chatStore.currentChat?.messages"
        :key="message.id"
        :class="['message', message.role]"
      >
        <div class="avatar">
          <Icon :icon="message.role === 'user' ? 'carbon:user-avatar' : 'carbon:watson'" />
        </div>
        <div class="message-content">
          <div class="text" v-html="message.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useChatStore } from '../stores/chat'

const chatStore = useChatStore()
const messagesContainer = ref<HTMLElement | null>(null)

const handleModelChange = (event: Event) => {
  const select = event.target as HTMLSelectElement
  chatStore.switchModel(select.value)
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(() => chatStore.currentChat?.messages.length, () => {
  setTimeout(scrollToBottom, 100)
})

onMounted(() => {
  scrollToBottom()
})
</script>

<style lang="scss" scoped>
.chat-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.model-selector {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--sidebar-bg);
}

.model-select {
  width: 200px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--message-bg);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: var(--text-secondary);
  }

  option {
    background: var(--message-bg);
    color: var(--text-primary);
  }
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  scroll-behavior: smooth;
}

.message {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  
  &.user {
    flex-direction: row-reverse;
    
    .message-content {
      background: var(--user-message-gradient);
      border-radius: 16px 16px 0 16px;
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .avatar {
      background: var(--user-message-gradient);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      
      .icon {
        color: white;
      }
    }
  }
  
  &.assistant {
    .message-content {
      background: var(--message-bg);
      border-radius: 16px 16px 16px 0;
      color: var(--text-primary);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--border-color);
    }

    .avatar {
      background: var(--brand-gradient);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      
      .icon {
        color: white;
      }
    }
  }
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
  
  .icon {
    font-size: 24px;
  }
}

.message-content {
  padding: 12px 16px;
  max-width: 80%;
  word-break: break-word;
  transition: all 0.3s ease;
  
  .text {
    line-height: 1.6;
  }
}
</style> 