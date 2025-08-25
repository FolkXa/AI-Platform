"use client"

import { motion } from "framer-motion"
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
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Platform
                    </Button>
                  </Link>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <motion.div 
                    className="h-8 w-8 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Database className="h-4 w-4" />
                  </motion.div>
                  <h1 className="text-xl font-bold">Chat with My Data</h1>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <UserNav />
              </motion.div>
            </div>
          </div>
        </header>

        <motion.div 
          className="container mx-auto px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload and Data Preview */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
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
            </motion.div>

            {/* Chat Interface */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <ChatInterface
                chatState={chatState}
                dataPreview={dataPreview}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                sampleQuestions={sampleQuestions}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  )
}
