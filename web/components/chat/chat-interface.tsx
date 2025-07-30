"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, Database, FileSpreadsheet, Send, Loader2 } from "lucide-react"
import { ChatState, DataPreview } from "@/types/chat"
import { MarkdownMessage } from "./markdown-message"

interface ChatInterfaceProps {
  chatState: ChatState
  dataPreview: DataPreview | null
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  sampleQuestions: string[]
}

export function ChatInterface({
  chatState,
  dataPreview,
  onInputChange,
  onSubmit,
  sampleQuestions,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatState.messages])

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-green-400" />
          <span>Chat with Your Data</span>
        </CardTitle>
        <CardDescription>
          {dataPreview?.chatSession
            ? "Ask questions about your CSV data in natural language"
            : "Upload a CSV file to enable interactive chat functionality"}
        </CardDescription>
      </CardHeader>
      <CardContent>
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
          <div className="space-y-4">
            {/* Sample Questions */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Try asking:</h4>
              <div className="flex flex-wrap gap-2">
                {dataPreview.sampleQuestions && dataPreview.sampleQuestions.length > 0 && (
                  dataPreview.sampleQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-1 px-2 bg-transparent break-words whitespace-normal"
                      onClick={() => onInputChange({ target: { value: question } } as any)}
                    >
                      {question}
                    </Button>
                  ))
                )}

                {!dataPreview.sampleQuestions &&
                  sampleQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-1 px-2 bg-transparent break-words whitespace-normal max-w-full"
                      onClick={() => onInputChange({ target: { value: question } } as any)}
                    >
                      {question}
                    </Button>
                  ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {chatState.messages.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm">Start a conversation about your data</p>
                </div>
              )}
              {chatState.messages.map((message) => (
                <div
                  key={message.id}
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
                </div>
              ))}
              {chatState.isLoading && (
                <div className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-lg mr-8">
                  <Loader2 className="h-4 w-4 animate-spin text-green-400" />
                  <span className="text-sm text-gray-400">AI is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={onSubmit} className="flex space-x-2">
              <Input
                value={chatState.input}
                onChange={onInputChange}
                placeholder="Ask about your data... e.g., 'What's the total revenue?'"
                className="flex-1 bg-gray-800 border-gray-700"
                disabled={chatState.isLoading}
              />
              <Button
                type="submit"
                disabled={chatState.isLoading || !chatState.input.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                {chatState.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 