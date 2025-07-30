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

  // Create a new chat session for CSV file
  createChatSession: async (file: File): Promise<ChatSession> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await api.post("/chat/create-session", formData, {
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

  // Send a message to the chat session
  sendChatMessage: async (sessionId: string, message: string, file: File) => {
    const formData = new FormData()
    formData.append("session_id", sessionId)
    formData.append("message", message)
    formData.append("file", file)

    const response = await api.post("/chat/send-message", formData, {
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

  // Get all messages in a chat session
  getSessionMessages: async (sessionId: string): Promise<ChatMessage[]> => {
    const response = await api.get(`/chat/session/${sessionId}/messages`)
    return response.data.map((msg: any) => ({
      id: msg.id,
      content: msg.content,
      role: msg.role,
      timestamp: msg.timestamp,
      fileName: msg.file_name,
    }))
  },

  // Get session details
  getSessionDetails: async (sessionId: string): Promise<ChatSession> => {
    const response = await api.get(`/chat/session/${sessionId}`)
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