<template>
  <div class="file-uploader">
    <input
      type="file"
      ref="fileInput"
      @change="handleFileChange"
      class="file-input"
      :accept="acceptedTypes"
      multiple
    >
    <div class="upload-area" @click="triggerFileInput" @drop.prevent="handleDrop" @dragover.prevent>
      <Icon icon="carbon:upload" class="upload-icon" />
      <p class="upload-text">点击或拖拽文件到此处上传</p>
      <p class="upload-hint">支持的文件类型：文本、图片、PDF、Word、Excel</p>
    </div>
    
    <!-- 上传文件列表 -->
    <div v-if="uploadedFiles.length > 0" class="uploaded-files">
      <div v-for="file in uploadedFiles" :key="file.id" class="file-item">
        <Icon :icon="getFileIcon(file.type)" class="file-icon" />
        <div class="file-info">
          <span class="file-name">{{ file.name }}</span>
          <span class="file-size">{{ formatFileSize(file.size) }}</span>
        </div>
        <button class="remove-btn" @click="removeFile(file.id)">
          <Icon icon="carbon:close" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { UploadService, type UploadedFile } from '../services/upload'

const emit = defineEmits<{
  (e: 'filesUploaded', files: UploadedFile[]): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFiles = ref<UploadedFile[]>([])
const acceptedTypes = '.txt,.pdf,.doc,.docx,.xls,.xlsx,image/*'

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    await processFiles(Array.from(input.files))
  }
}

const handleDrop = async (event: DragEvent) => {
  const files = event.dataTransfer?.files
  if (files) {
    await processFiles(Array.from(files))
  }
}

const processFiles = async (files: File[]) => {
  try {
    const newFiles = await Promise.all(
      files.map(file => UploadService.handleFileUpload(file))
    )
    uploadedFiles.value.push(...newFiles)
    emit('filesUploaded', newFiles)
  } catch (error) {
    console.error('文件处理错误:', error)
    // TODO: 显示错误提示
  }
}

const removeFile = (fileId: string) => {
  uploadedFiles.value = uploadedFiles.value.filter(file => file.id !== fileId)
}

const getFileIcon = (type: string) => {
  return UploadService.getFileTypeIcon(type)
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}
</script>

<style lang="scss" scoped>
.file-uploader {
  width: 100%;
  margin-bottom: 16px;
}

.file-input {
  display: none;
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--text-secondary);
    background: var(--hover-bg);
  }
}

.upload-icon {
  font-size: 48px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.upload-text {
  color: var(--text-primary);
  font-size: 16px;
  margin-bottom: 8px;
}

.upload-hint {
  color: var(--text-secondary);
  font-size: 14px;
}

.uploaded-files {
  margin-top: 16px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px;
  background: var(--message-bg);
  border-radius: 8px;
  margin-bottom: 8px;

  &:hover {
    background: var(--hover-bg);
  }
}

.file-icon {
  font-size: 24px;
  color: var(--text-secondary);
  margin-right: 12px;
}

.file-info {
  flex: 1;
  overflow: hidden;

  .file-name {
    display: block;
    color: var(--text-primary);
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .file-size {
    color: var(--text-secondary);
    font-size: 12px;
  }
}

.remove-btn {
  padding: 4px;
  color: var(--text-secondary);
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: #ff4d4f;
    background: var(--hover-bg);
  }
}
</style> 