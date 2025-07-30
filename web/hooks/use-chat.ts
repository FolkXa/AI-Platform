import { useState, useEffect } from "react"
import { dataAPI } from "@/lib/api"
import { ChatState, ChatMessage, DataPreview, FileUploadState } from "@/types/chat"
import { toast } from "@/hooks/use-toast"
import { isValidFileType, formatFileSize } from "@/utils/file-utils"

export function useChat() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    input: "",
    isLoading: false,
    sessionId: null,
  })

  const [uploadState, setUploadState] = useState<FileUploadState>({
    file: null,
    uploading: false,
    error: null,
    dragActive: false,
  })

  const [dataPreview, setDataPreview] = useState<DataPreview | null>(null)



  const processFile = async (file: File) => {
    setUploadState(prev => ({ ...prev, uploading: true, error: null }))
    setDataPreview(null)
    setChatState({
      messages: [],
      input: "",
      isLoading: false,
      sessionId: null,
    })

    try {
      const result = await dataAPI.analyzeData(file)

      // Create chat session for CSV files
      let chatSession
      if (file.name.endsWith(".csv")) {
        try {
          const session = await dataAPI.createChatSession(file)
          chatSession = session
          setChatState(prev => ({ ...prev, sessionId: session.sessionId }))

          toast({
            title: "Chat session created!",
            description: "You can now ask questions about your CSV data",
          })
        } catch (error) {
          console.warn("Failed to create chat session:", error)
          toast({
            title: "Chat session creation failed",
            description: "File analysis completed, but chat functionality may be limited",
            variant: "destructive",
          })
        }
      }

      setDataPreview({
        ...result,
        chatSession,
      })

      toast({
        title: "File uploaded successfully!",
        description: `Analyzed ${result.rows.toLocaleString()} rows of data${
          chatSession ? " and created chat session" : ""
        }`,
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to process file"
      setUploadState(prev => ({ ...prev, error: errorMessage }))
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setUploadState(prev => ({ ...prev, uploading: false }))
    }
  }

  const handleFileChange = (file: File) => {
    setUploadState(prev => ({ ...prev, file }))
    processFile(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setUploadState(prev => ({ ...prev, dragActive: true }))
    } else if (e.type === "dragleave") {
      setUploadState(prev => ({ ...prev, dragActive: false }))
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setUploadState(prev => ({ ...prev, dragActive: false }))

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (isValidFileType(droppedFile)) {
        handleFileChange(droppedFile)
      } else {
        setUploadState(prev => ({ ...prev, error: "Please upload a CSV, XLS, or XLSX file" }))
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatState(prev => ({ ...prev, input: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!chatState.input.trim() || !uploadState.file || !chatState.sessionId) return

    const userMessage = chatState.input.trim()

    // Add user message to chat
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      content: userMessage,
      role: "user",
      timestamp: new Date().toISOString(),
      fileName: uploadState.file.name,
    }

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newUserMessage],
      input: "",
      isLoading: true,
    }))

    try {
      const response = await dataAPI.sendChatMessage(
        chatState.sessionId,
        userMessage,
        uploadState.file
      )

      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.aiResponse,
        role: "assistant",
        timestamp: new Date().toISOString(),
        fileName: uploadState.file.name,
      }

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false,
      }))
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to send message"

      // Add error message to chat
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `Error: ${errorMessage}`,
        role: "assistant",
        timestamp: new Date().toISOString(),
        fileName: uploadState.file.name,
      }

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMsg],
        isLoading: false,
      }))

      toast({
        title: "Chat error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const loadChatHistory = async (sessionId: string) => {
    try {
      const messages = await dataAPI.getSessionMessages(sessionId)
      setChatState(prev => ({ ...prev, messages }))
    } catch (error) {
      console.warn("Failed to load chat history:", error)
    }
  }

  // Load chat history when session is created
  useEffect(() => {
    if (chatState.sessionId) {
      loadChatHistory(chatState.sessionId)
    }
  }, [chatState.sessionId])

  return {
    chatState,
    uploadState,
    dataPreview,
    isValidFileType,
    formatFileSize,
    handleFileChange,
    handleDrag,
    handleDrop,
    handleInputChange,
    handleSubmit,
  }
} 