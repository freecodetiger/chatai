<template>
  <div class="input-container">
    <!-- 文件上传区域 -->
    <FileUploader
      v-if="showUploader"
      @filesUploaded="handleFilesUploaded"
      class="file-uploader"
    />
    
    <div class="input-actions">
      <div class="input-wrapper">
        <textarea
          ref="textarea"
          v-model="inputText"
          class="input-field"
          placeholder="输入消息..."
          @keydown.enter.prevent="handleEnter"
          @input="autoResize"
        ></textarea>
        <div class="action-buttons">
          <button
            class="action-btn"
            @click="handleVoiceInput"
            title="语音输入"
          >
            <Icon icon="carbon:microphone" />
          </button>
          <button
            class="action-btn"
            @click="toggleUploader"
            title="上传文件"
          >
            <Icon icon="carbon:document-attachment" />
          </button>
        </div>
      </div>
      <button
        class="send-btn"
        @click="sendMessage"
        :disabled="!inputText.trim()"
      >
        <Icon icon="carbon:send" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useChatStore } from '../stores/chat'
import FileUploader from './FileUploader.vue'
import { UploadService, type UploadedFile } from '../services/upload'

const chatStore = useChatStore()
const inputText = ref('')
const textarea = ref<HTMLTextAreaElement | null>(null)
const showUploader = ref(false)

const autoResize = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = textarea.value.scrollHeight + 'px'
  }
}

const handleEnter = (e: KeyboardEvent) => {
  if (!e.shiftKey) {
    sendMessage()
  }
}

const sendMessage = () => {
  if (inputText.value.trim()) {
    chatStore.addMessage(inputText.value.trim())
    inputText.value = ''
    if (textarea.value) {
      textarea.value.style.height = 'auto'
    }
  }
}

const handleVoiceInput = () => {
  // TODO: 实现语音输入功能
  console.log('语音输入')
}

const toggleUploader = () => {
  showUploader.value = !showUploader.value
}

const handleFilesUploaded = (files: UploadedFile[]) => {
  files.forEach(file => {
    let message = `已上传文件：${file.name}\n`
    if (file.type.startsWith('text/')) {
      message += `\n文件内容：\n${file.content}`
    } else if (file.type.startsWith('image/')) {
      message += `\n<img src="${file.content}" alt="${file.name}" style="max-width: 100%; max-height: 300px; border-radius: 8px; margin-top: 8px;">`
    } else {
      const icon = UploadService.getFileTypeIcon(file.type)
      message += `\n<div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
        <i-icon name="${icon}" style="font-size: 24px;"></i-icon>
        <span>[${file.type}文件]</span>
      </div>`
    }
    chatStore.addMessage(message)
  })
  showUploader.value = false
}
</script>

<style lang="scss" scoped>
.input-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: var(--sidebar-bg);
  border-radius: 12px;
  margin: 0 20px 20px;
}

.input-actions {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.input-wrapper {
  flex: 1;
  position: relative;
}

.input-field {
  width: 100%;
  min-height: 40px;
  max-height: 200px;
  padding: 10px 12px;
  padding-right: 100px;
  background: var(--message-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  overflow-y: auto;

  &:focus {
    outline: none;
    border-color: var(--text-secondary);
  }

  &::placeholder {
    color: var(--text-secondary);
  }
}

.action-buttons {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 8px;
}

.action-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--hover-bg);
    color: var(--text-primary);
  }
}

.send-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--brand-gradient);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.file-uploader {
  margin-top: -8px;
  margin-bottom: 8px;
}
</style> 