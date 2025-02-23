import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ChatService } from '../services/api'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

interface Chat {
  id: number
  title: string
  messages: Message[]
  model: string
}

interface Model {
  id: string
  name: string
  description: string
}

export const useChatStore = defineStore('chat', () => {
  const models: Model[] = [
    { 
      id: 'kimi', 
      name: 'Kimi AI(照片打分）', 
      description: '由Moonshot AI提供的智能助手'
    },
    { 
      id: 'baidu', 
      name: '文心一言', 
      description: '由百度提供的智能助手'
    },
    { 
      id: 'demo', 
      name: '演示模式', 
      description: '仅用于演示的模拟回复模式'
    }
  ]
  
  const currentModel = ref(models[0].id)
  const chats = ref<Chat[]>([])
  const currentChatId = ref(0)
  const isLoading = ref(false)

  const currentChat = computed(() => {
    const chat = chats.value.find(chat => chat.id === currentChatId.value)
    if (chat) {
      currentModel.value = chat.model
    }
    return chat
  })

  const createNewChat = (model?: string) => {
    const modelId = model || currentModel.value
    const modelInfo = models.find(m => m.id === modelId)
    const newChat: Chat = {
      id: Date.now(),
      title: `新会话 ${chats.value.length + 1}`,
      messages: [],
      model: modelId
    }
    
    chats.value.push(newChat)
    currentChatId.value = newChat.id
    currentModel.value = modelId
    
    // 添加欢迎消息
    addMessage(`已切换至${modelInfo?.name}，你好，有什么可以帮助你的吗？`, 'assistant')
    
    return newChat
  }

  const deleteChat = (id: number) => {
    const index = chats.value.findIndex(chat => chat.id === id)
    if (index !== -1) {
      chats.value.splice(index, 1)
      if (currentChatId.value === id) {
        if (chats.value.length > 0) {
          currentChatId.value = chats.value[0].id
        } else {
          createNewChat()
        }
      }
    }
  }

  const selectChat = (id: number) => {
    const chat = chats.value.find(chat => chat.id === id)
    if (chat) {
      currentChatId.value = id
      currentModel.value = chat.model
    }
  }

  const addMessage = async (content: string, role: 'user' | 'assistant' = 'user') => {
    const chat = currentChat.value
    if (!chat) return

    const message: Message = {
      id: Date.now(),
      role,
      content: role === 'user' ? content : content.replace(/\n/g, '<br>')
    }
    chat.messages.push(message)

    // 如果是用户消息，调用相应的API获取回复
    if (role === 'user') {
      isLoading.value = true
      let response
      
      try {
        // 检查是否包含图片
        if (content.includes('<img')) {
          // 提取base64图片数据
          const base64Match = content.match(/src="(data:image\/[^"]+)"/)
          if (base64Match) {
            const imageUrl = base64Match[1]
            const textContent = content.replace(/<[^>]*>/g, '').trim()
            
            switch (chat.model) {
              case 'kimi':
                response = await ChatService.sendMessageToKimi(textContent || '请描述这张图片', imageUrl)
                break
              case 'baidu':
                response = { content: '抱歉，当前模型不支持图片分析功能。请切换到 Kimi AI 来分析图片。' }
                break
              default:
                response = { content: '演示模式：这是一条模拟的回复消息。' }
            }
          } else {
            response = { content: '抱歉，无法解析图片内容。' }
          }
        } else {
          switch (chat.model) {
            case 'kimi':
              response = await ChatService.sendMessageToKimi(content.replace(/<[^>]*>/g, ''))
              break
            case 'baidu':
              response = await ChatService.sendMessageToBaidu(content.replace(/<[^>]*>/g, ''))
              break
            default:
              response = { content: '演示模式：这是一条模拟的回复消息。' }
          }
        }

        chat.messages.push({
          id: Date.now(),
          role: 'assistant',
          content: response.content.replace(/\n/g, '<br>')
        })

        // 更新会话标题（使用第一条用户消息）
        if (chat.title.startsWith('新会话') && chat.messages.length === 3) {
          const plainText = content.replace(/<[^>]*>/g, '')
          chat.title = plainText.length > 20 ? plainText.slice(0, 20) + '...' : plainText
        }
      } catch (error) {
        console.error('API调用错误:', error)
        chat.messages.push({
          id: Date.now(),
          role: 'assistant',
          content: '抱歉，服务器响应出错，请稍后重试。'
        })
      } finally {
        isLoading.value = false
      }
    }
  }

  const switchModel = (modelId: string) => {
    if (currentModel.value !== modelId && models.find(m => m.id === modelId)) {
      createNewChat(modelId)
    }
  }

  // 初始化默认会话
  if (chats.value.length === 0) {
    createNewChat()
  }

  return {
    models,
    currentModel,
    chats,
    currentChatId,
    currentChat,
    isLoading,
    createNewChat,
    deleteChat,
    selectChat,
    addMessage,
    switchModel
  }
})