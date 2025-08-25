"use client"

import { useRef, useEffect, useState, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, Database, FileSpreadsheet, Send, Loader2, Maximize2, Minimize2 } from "lucide-react"
import { ChatState, DataPreview } from "@/types/chat"
import { MarkdownMessage } from "./markdown-message"
import { ChatModal } from "./chat-modal"

interface ChatInterfaceProps {
  chatState: ChatState
  dataPreview: DataPreview | null
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  sampleQuestions: string[]
}

// Simple loading dots without motion
const LoadingDots = memo(() => (
  <div className="flex space-x-1">
    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75"></div>
    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></div>
  </div>
))

LoadingDots.displayName = 'LoadingDots'

// Memoized sample questions component without excessive motion
const SampleQuestions = memo(({ 
  dataPreview, 
  sampleQuestions, 
  onQuestionClick 
}: {
  dataPreview: DataPreview | null
  sampleQuestions: string[]
  onQuestionClick: (question: string) => void
}) => {
  const questions = dataPreview?.sampleQuestions && dataPreview?.sampleQuestions?.length > 0 
    ? dataPreview?.sampleQuestions 
    : sampleQuestions

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-400 mb-2">Try asking:</h4>
      <div className="flex flex-wrap gap-2">
        {questions.map((question) => (
          <Button
            key={question}
            variant="outline"
            size="sm"
            className="text-xs text-left h-auto py-1 px-2 bg-transparent break-words whitespace-normal hover:scale-105 transition-transform duration-200"
            onClick={() => onQuestionClick(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  )
})

SampleQuestions.displayName = 'SampleQuestions'

// Memoized single message component
const ChatMessage = memo(({ 
  message,
  isNew = false
}: {
  message: ChatState['messages'][0]
  isNew?: boolean
}) => {
  return (
    <motion.div
      key={message.id}
      initial={isNew ? { opacity: 0, x: message.role === "user" ? 50 : -50, y: 20 } : false}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        duration: 0.4,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className={`p-3 rounded-lg ${
        message.role === "user" ? "bg-green-600/20 ml-8" : "bg-gray-800/50 mr-8"
      }`}
    >
      {message.role === "user" ? (
        <p className="text-sm">{message.content}</p>
      ) : (
        <MarkdownMessage content={message.content} className="text-sm" />
      )}
      <p className="text-xs text-gray-500 mt-1">
        {new Date(message.timestamp).toLocaleTimeString()}
      </p>
    </motion.div>
  )
})

ChatMessage.displayName = 'ChatMessage'

// Memoized chat messages component
const ChatMessages = memo(({ 
  messages, 
  isLoading, 
  isFullScreen,
  messagesContainerRef 
}: {
  messages: ChatState['messages']
  isLoading: boolean
  isFullScreen: boolean
  messagesContainerRef: React.RefObject<HTMLDivElement | null>
}) => (
  <div 
    ref={messagesContainerRef} 
    className={`space-y-4 overflow-y-auto ${
      isFullScreen ? 'flex-1 min-h-0' : 'max-h-96'
    }`}
    style={isFullScreen ? { height: '100%' } : undefined}
  >
    {messages.length === 0 && (
      <div className="text-center py-4">
        <p className="text-gray-400 text-sm">Start a conversation about your data</p>
      </div>
    )}
    
    {messages.map((message, index) => (
      <ChatMessage 
        key={message.id}
        message={message}
        isNew={index === messages.length - 1}
      />
    ))}
    
    {isLoading && (
      <motion.div 
        className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-lg mr-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <LoadingDots />
        <span className="text-sm text-gray-400">AI is typing...</span>
      </motion.div>
    )}
  </div>
))

ChatMessages.displayName = 'ChatMessages'

// Memoized chat input component without motion
const ChatInput = memo(({ 
  input, 
  isLoading, 
  onInputChange, 
  onSubmit 
}: {
  input: string
  isLoading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
}) => (
  <form onSubmit={onSubmit} className="flex space-x-2">
    <Input
      value={input}
      onChange={onInputChange}
      placeholder="Ask about your data... e.g., 'What's the total revenue?'"
      className="flex-1 bg-gray-800 border-gray-700 focus:scale-[1.02] transition-transform duration-200"
      disabled={isLoading}
    />
    <Button
      type="submit"
      disabled={isLoading || !input.trim()}
      className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-transform duration-200"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Send className="h-4 w-4" />
      )}
    </Button>
  </form>
))

ChatInput.displayName = 'ChatInput'

// Main content component without motion wrapper
const ChatContent = memo(({ 
  isFullScreen,
  dataPreview,
  chatState,
  sampleQuestions,
  handleQuestionClick,
  onInputChange,
  onSubmit,
  handleToggleFullScreen,
  messagesContainerRef
}: {
  isFullScreen: boolean
  dataPreview: DataPreview | null
  chatState: ChatState
  sampleQuestions: string[]
  handleQuestionClick: (question: string) => void
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  handleToggleFullScreen: () => void
  messagesContainerRef: React.RefObject<HTMLDivElement | null>
}) => (
  <Card className="bg-gray-900/50 border-gray-800 h-full flex flex-col">
    <CardHeader className="flex-shrink-0">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-green-400" />
          <span>Chat with Your Data</span>
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:scale-110 transition-transform duration-200"
          onClick={handleToggleFullScreen}
        >
          {isFullScreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      <CardDescription>
        {dataPreview?.chatSession
          ? "Ask questions about your CSV data in natural language"
          : "Upload a CSV file to enable interactive chat functionality"}
      </CardDescription>
    </CardHeader>
    <CardContent className={isFullScreen ? 'flex-1 overflow-hidden flex flex-col min-h-0' : ''}>
      {!dataPreview ? (
        <div className="text-center py-8">
          <Database className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Upload a data file to start chatting</p>
        </div>
      ) : !dataPreview.chatSession ? (
        <div className="text-center py-8">
          <FileSpreadsheet className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Chat functionality is available for CSV files only</p>
          <p className="text-sm text-gray-500 mt-2">Upload a CSV file to enable interactive chat</p>
        </div>
      ) : (
        <div className={`space-y-4 ${isFullScreen ? 'flex-1 flex flex-col min-h-0' : ''}`}>
          <SampleQuestions 
            dataPreview={dataPreview}
            sampleQuestions={sampleQuestions}
            onQuestionClick={handleQuestionClick}
          />
          
          <ChatMessages 
            messages={chatState.messages}
            isLoading={chatState.isLoading}
            isFullScreen={isFullScreen}
            messagesContainerRef={messagesContainerRef}
          />

          <div className="flex-shrink-0">
            <ChatInput 
              input={chatState.input}
              isLoading={chatState.isLoading}
              onInputChange={onInputChange}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      )}
    </CardContent>
  </Card>
))

ChatContent.displayName = 'ChatContent'

export const ChatInterface = memo(function ChatInterface({
  chatState,
  dataPreview,
  onInputChange,
  onSubmit,
  sampleQuestions,
}: ChatInterfaceProps) {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chatState.messages.length, scrollToBottom])

  const handleToggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev)
  }, [])

  // Memoized question click handler
  const handleQuestionClick = useCallback((question: string) => {
    onInputChange({ target: { value: question } } as React.ChangeEvent<HTMLInputElement>)
  }, [onInputChange])

  return (
    <>
      {isFullScreen ? (
        <ChatModal isOpen={isFullScreen} onClose={handleToggleFullScreen}>
          <div className="h-full flex flex-col">
            <ChatContent 
              isFullScreen={true}
              dataPreview={dataPreview}
              chatState={chatState}
              sampleQuestions={sampleQuestions}
              handleQuestionClick={handleQuestionClick}
              onInputChange={onInputChange}
              onSubmit={onSubmit}
              handleToggleFullScreen={handleToggleFullScreen}
              messagesContainerRef={messagesContainerRef}
            />
          </div>
        </ChatModal>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ChatContent 
            isFullScreen={false}
            dataPreview={dataPreview}
            chatState={chatState}
            sampleQuestions={sampleQuestions}
            handleQuestionClick={handleQuestionClick}
            onInputChange={onInputChange}
            onSubmit={onSubmit}
            handleToggleFullScreen={handleToggleFullScreen}
            messagesContainerRef={messagesContainerRef}
          />
        </motion.div>
      )}
    </>
  )
})