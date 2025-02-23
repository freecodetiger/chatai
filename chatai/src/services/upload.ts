import { ref } from 'vue'

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  content: string
}

export class UploadService {
  static async handleFileUpload(file: File): Promise<UploadedFile> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string
          
          // 创建上传文件对象
          const uploadedFile: UploadedFile = {
            id: Date.now().toString(),
            name: file.name,
            size: file.size,
            type: file.type,
            content: content
          }
          
          resolve(uploadedFile)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => {
        reject(new Error('文件读取失败'))
      }
      
      // 如果是文本文件，直接读取文本内容
      if (file.type.startsWith('text/')) {
        reader.readAsText(file)
      } else {
        // 其他类型文件读取为 base64
        reader.readAsDataURL(file)
      }
    })
  }
  
  static getFileTypeIcon(type: string): string {
    if (type.startsWith('text/')) return 'carbon:document-text'
    if (type.startsWith('image/')) return 'carbon:image'
    if (type.startsWith('application/pdf')) return 'carbon:pdf'
    if (type.startsWith('application/msword') || type.includes('document')) return 'carbon:document'
    if (type.startsWith('application/vnd.ms-excel') || type.includes('sheet')) return 'carbon:spreadsheet'
    return 'carbon:document-unknown'
  }
} 