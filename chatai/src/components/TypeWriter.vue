<template>
  <div class="typewriter">
    <span class="text">{{ displayText }}</span>
    <span class="cursor" :class="{ blink: isComplete }">|</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  content: string
  speed?: number
}>()

const displayText = ref('')
const isComplete = ref(false)
let currentIndex = 0

const typeText = () => {
  if (currentIndex < props.content.length) {
    displayText.value += props.content[currentIndex]
    currentIndex++
    setTimeout(typeText, props.speed || 50)
  } else {
    isComplete.value = true
  }
}

watch(() => props.content, () => {
  displayText.value = ''
  isComplete.value = false
  currentIndex = 0
  typeText()
})

onMounted(() => {
  typeText()
})
</script>

<style lang="scss" scoped>
.typewriter {
  display: inline-flex;
  align-items: center;
}

.text {
  white-space: pre-wrap;
  line-height: 1.5;
}

.cursor {
  display: inline-block;
  margin-left: 2px;
  font-weight: bold;
  color: var(--text-primary);
  
  &.blink {
    animation: blink 1s step-end infinite;
  }
}

@keyframes blink {
  from, to {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style> 