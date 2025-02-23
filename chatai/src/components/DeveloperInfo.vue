<template>
  <div class="developer-container">
    <div class="brand">
      <Icon icon="carbon:chat-bot" class="logo" />
      <span class="brand-name">ChatAI</span>
    </div>

    <div class="social-links">
      <a
        v-for="link in socialLinks"
        :key="link.icon"
        :href="link.url"
        target="_blank"
        class="social-link"
        :title="link.title"
      >
        <Icon :icon="link.icon" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

const socialLinks = [
  {
    icon: 'carbon:logo-github',
    url: 'https://github.com',
    title: 'GitHub'
  },
  {
    icon: 'carbon:logo-linkedin',
    url: 'https://linkedin.com',
    title: 'LinkedIn'
  },
  {
    icon: 'carbon:email',
    url: 'mailto:contact@example.com',
    title: '联系我们'
  }
]
</script>

<style lang="scss" scoped>
.developer-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-top: 1px solid var(--border-color);
  background-color: var(--sidebar-bg);
  height: 60px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .logo {
    font-size: 24px;
    color: var(--text-primary);
    background: var(--brand-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .brand-name {
    font-weight: 600;
    font-size: 16px;
    background: var(--brand-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-link {
  color: var(--text-secondary);
  font-size: 20px;
  transition: all 0.2s;
  
  &:hover {
    color: var(--text-primary);
    transform: translateY(-2px);
  }
}
</style> 