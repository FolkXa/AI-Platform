// utils/api.ts หรือ libs/api.ts
import axios from "axios"

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for authentication
api.interceptors.request.use(
  async (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    console.log("token: ", token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    console.error("Request error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/auth/signin"
    } else {
      console.error("Response error:", error)
    }
    return Promise.reject(error)
  },
)

// Import types from centralized types file
import { ChatSession, ChatMessage } from "@/types/chat"

// Data analysis API functions
export const dataAPI = {
  // Upload and analyze data file with chat session
  analyzeData: async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await api.post("/analysis-upload-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
        console.log(`Upload Progress: ${percentCompleted}%`)
      },
    })

    return response.data
  },

  // Create a new Ollama chat session for CSV file
  createChatSession: async (file: File): Promise<ChatSession> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await api.post("/ollama-chat/create-session", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return {
      sessionId: response.data.session_id,
      fileName: response.data.file_name,
      createdAt: response.data.created_at,
      lastUpdated: response.data.last_updated,
    }
  },

  // Send a message to the Ollama chat session (non-streaming)
  sendChatMessage: async (sessionId: string, message: string, file: File) => {
    const formData = new FormData()
    formData.append("session_id", sessionId)
    formData.append("message", message)
    formData.append("file", file)

    const response = await api.post("/ollama-chat/send-message", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return {
      sessionId: response.data.session_id,
      userMessage: response.data.user_message,
      aiResponse: response.data.ai_response,
      timestamp: response.data.timestamp,
    }
  },

  // Send a streaming message to the Ollama chat session
  sendStreamingMessage: async (sessionId: string, message: string, file: File, onChunk: (chunk: string) => void) => {
    const formData = new FormData()
    formData.append("session_id", sessionId)
    formData.append("message", message)
    formData.append("file", file)

    const response = await fetch(`${api.defaults.baseURL}/ollama-chat/send-streaming-message`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No response body reader available')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      
      // Try to parse complete objects from the buffer (handling Python dict format)
      let braceCount = 0
      let startIndex = -1
      let objects: string[] = []
      
      for (let i = 0; i < buffer.length; i++) {
        if (buffer[i] === '{') {
          if (braceCount === 0) {
            startIndex = i
          }
          braceCount++
        } else if (buffer[i] === '}') {
          braceCount--
          if (braceCount === 0 && startIndex !== -1) {
            // Complete object found
            const objStr = buffer.substring(startIndex, i + 1)
            objects.push(objStr)
            startIndex = -1
          }
        }
      }
      
      // Process complete objects
      for (const objStr of objects) {
        try {
          // Convert Python dict format to valid JSON
          const jsonStr = objStr
            .replace(/'/g, '"')  // Replace single quotes with double quotes
            .replace(/True/g, 'true')  // Replace Python True with JSON true
            .replace(/False/g, 'false')  // Replace Python False with JSON false
          
          const data = JSON.parse(jsonStr)
          if (data.message && data.message.content && !data.done) {
            onChunk(data.message.content)
          }
        } catch (error) {
          console.warn('Failed to parse object chunk:', objStr, error)
        }
      }
      
      // Keep remaining incomplete object in buffer
      if (startIndex !== -1) {
        buffer = buffer.substring(startIndex)
      } else {
        buffer = ''
      }
    }
  },

  // Get all messages in an Ollama chat session
  getSessionMessages: async (sessionId: string): Promise<ChatMessage[]> => {
    const response = await api.get(`/ollama-chat/session/${sessionId}/messages`)
    return response.data.map((msg: any) => ({
      id: msg.id,
      content: msg.content,
      role: msg.role,
      timestamp: msg.timestamp,
      fileName: msg.file_name,
    }))
  },

  // Get Ollama session details
  getSessionDetails: async (sessionId: string): Promise<ChatSession> => {
    const response = await api.get(`/ollama-chat/session/${sessionId}`)
    return {
      sessionId: response.data.session_id,
      fileName: response.data.file_name,
      createdAt: response.data.created_at,
      lastUpdated: response.data.last_updated,
    }
  },

  // Legacy chat function (keeping for backward compatibility)
  chatWithData: async (message: string, fileId?: string) => {
    const response = await api.post("/data-chat", {
      message,
      fileId,
    })
    return response.data
  },
}

// Legal document API functions
export const legalAPI = {
  // Analyze legal document
  analyzeLegal: async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await api.post("/analyze-legal", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  },
}

// Resume analysis API functions
export const resumeAPI = {
  // Analyze resume
  analyzeResume: async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await api.post("/analyze-resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  },
}

export default api