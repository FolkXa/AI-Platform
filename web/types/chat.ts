// Chat-related types and interfaces

export interface ChatSession {
  sessionId: string
  fileName: string
  createdAt: string
  lastUpdated?: string
}

export interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: string
  fileName: string
}

export interface ChatState {
  messages: ChatMessage[]
  input: string
  isLoading: boolean
  sessionId: string | null
}

export interface DataPreview {
  fileName: string
  rows: number
  columns: number
  headers: string[]
  sampleData: string[][]
  insights: string[]
  sampleQuestions: string[]
  uploadedAt: string
  fileSize: number
  chatSession?: ChatSession
}

export interface FileUploadState {
  file: File | null
  uploading: boolean
  error: string | null
  dragActive: boolean
} 