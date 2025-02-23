import axios from 'axios'

interface ChatResponse {
  content: string
  error?: string
}

interface MessageContent {
  type: string
  text?: string
  image_url?: {
    url: string
  }
}

interface ChatMessage {
  role: string
  content: string | MessageContent[]
}

export class ChatService {
  private static readonly KIMI_API_KEY = 'sk-eE6fKsNBZi76KgnnO1vJ5eGu35NWWOu6I1Gz911B3CvQqlpp'
  private static readonly BAIDU_ACCESS_TOKEN = '24.1caea75d49c9b23728e6112c93f27ca2.2592000.1742829187.282335-117681134'

  static async analyzeImage(base64Image: string): Promise<string> {
    try {
      // 移除base64前缀
      const imageData = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '')
      
      const response = await axios.post(
        `https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=${this.BAIDU_ACCESS_TOKEN}`,
        {
          image: imageData
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      if (response.data.result && response.data.result.length > 0) {
        const descriptions = response.data.result.map((item: any) => 
          `${item.keyword}(可能性：${Math.floor(item.score * 100)}%)`
        ).join('、')
        return `这张图片可能包含：${descriptions}`
      }
      
      return '抱歉，我无法识别这张图片的内容。'
    } catch (error) {
      console.error('图像识别错误:', error)
      return '图像识别服务出现错误，请稍后重试。'
    }
  }

  static async sendMessageToKimi(message: string, imageUrl?: string): Promise<ChatResponse> {
    try {
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: `你是一名专业摄影评分师，拥有10年国际摄影大赛评审经验。你需要根据以下评分体系对照片进行专业评估，严禁主观臆断。总分=各维度加权得分（满分100）

评分维度与权重：

1. 构图设计（20%）
- 视觉动线合理性
- 主体位置
- 空间平衡感
优秀案例：黄金分割构图（+15-20分）
缺陷案例：主体居中无层次（5分以下）

2. 光影控制（20%）
- 自然光：柔光/硬光运用
- 人造光：布光专业性
特殊评估项：避免死黑/过曝（每处-3分）

3. 色彩表现（15%）
- 色彩和谐度
- 色调情绪传达
- 饱和度控制
△警告项：色偏超过±15%（本项最高8分）

4. 主题表达（25%）
- 信息传达明确性
- 情感共鸣强度
- 叙事完整性
经典扣分项：主题模糊（-12分起）

5. 技术质量（20%）
- 清晰度
- 噪点控制
- 焦点准确性
硬性标准：解析度不足（每压低一档-5分）

评分标准锚点：
▶ 90-100：教科书级作品（需满足全部维度≥18分）
▶ 80-89：专业级（允许1个维度≤15分）
▶ 70-79：优质作品（存在2处明显改进点）
▶ 60-69：合格作品（3个及以上技术缺陷）
▶ ＜60：未达标作品

你的评分必须严格按照以下格式输出：

［总分］X/100

► 维度评分（加权前原始分）
构图：X/20
光影：X/20
色彩：X/15
主题：X/25
技术：X/20

► 3条优先改进建议
1. xxx
2. xxx
3. xxx`
        },
        {
          role: 'user',
          content: imageUrl ? [
            { type: 'image_url', image_url: { url: imageUrl } },
            { type: 'text', text: message || '请对这张照片进行专业评分' }
          ] : message
        }
      ]

      const response = await axios.post(
        'https://api.moonshot.cn/v1/chat/completions',
        {
          model: 'moonshot-v1-32k-vision-preview',
          messages,
          temperature: 0.8
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.KIMI_API_KEY}`
          }
        }
      )
      
      return {
        content: response.data.choices[0].message.content
      }
    } catch (error) {
      console.error('Kimi API调用错误:', error)
      return {
        content: '抱歉，服务器出现错误，请稍后再试。',
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  static async sendMessageToBaidu(message: string): Promise<ChatResponse> {
    try {
      const response = await axios.post(
        `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=${this.BAIDU_ACCESS_TOKEN}`,
        {
          messages: [{ role: 'user', content: message }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      
      return {
        content: response.data.result
      }
    } catch (error) {
      console.error('百度API调用错误:', error)
      return {
        content: '抱歉，服务器出现错误，请稍后再试。',
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }
}