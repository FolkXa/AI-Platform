"use client"

import { Button } from "@/components/ui/button"
import { Database, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { UserNav } from "@/components/user-nav"
import { FileUpload } from "@/components/chat/file-upload"
import { DataPreview } from "@/components/chat/data-preview"
import { ChatInterface } from "@/components/chat/chat-interface"
import { useChat } from "@/hooks/use-chat"

const sampleQuestions = [
  "What's the total sales for January?",
  "Which product category performs best?",
  "Show me revenue trends by region",
  "What's the average order value?",
  "Which customers buy the most?",
  "Create a summary table of the data",
  "Show me the data structure and types",
]

export default function ChatWithData() {
  const {
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
  } = useChat()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Header */}
        <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Platform
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center">
                    <Database className="h-4 w-4" />
                  </div>
                  <h1 className="text-xl font-bold">Chat with My Data</h1>
                </div>
              </div>
              <UserNav />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload and Data Preview */}
            <div className="space-y-6">
              <FileUpload
                uploadState={uploadState}
                dataPreview={dataPreview}
                onFileChange={handleFileChange}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                isValidFileType={isValidFileType}
                formatFileSize={formatFileSize}
              />

              {dataPreview && (
                <DataPreview dataPreview={dataPreview} formatFileSize={formatFileSize} />
              )}
            </div>

            {/* Chat Interface */}
            <div className="space-y-6">
              <ChatInterface
                chatState={chatState}
                dataPreview={dataPreview}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                sampleQuestions={sampleQuestions}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
