"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react"
import { FileUploadState, DataPreview } from "@/types/chat"

interface FileUploadProps {
  uploadState: FileUploadState
  dataPreview: DataPreview | null
  onFileChange: (file: File) => void
  onDragEnter: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  isValidFileType: (file: File) => boolean
  formatFileSize: (bytes: number) => string
}

export function FileUpload({
  uploadState,
  dataPreview,
  onFileChange,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  isValidFileType,
  formatFileSize,
}: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (isValidFileType(selectedFile)) {
        onFileChange(selectedFile)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <CardTitle className="flex items-center space-x-2">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              >
                <Upload className="h-5 w-5 text-green-400" />
              </motion.div>
              <span>Upload Your Data</span>
            </CardTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <CardDescription>Upload CSV or Excel files to start chatting with your data</CardDescription>
          </motion.div>
        </CardHeader>
      <CardContent>
        <motion.div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            uploadState.dragActive ? "border-green-500 bg-green-500/10" : "border-gray-700 hover:border-gray-600"
          }`}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            scale: uploadState.dragActive ? 1.05 : 1,
            borderColor: uploadState.dragActive ? "#10b981" : "#374151"
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ 
              rotate: uploadState.dragActive ? [0, 10, -10, 0] : 0,
              scale: uploadState.dragActive ? 1.1 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          </motion.div>
          <motion.p 
            className="text-gray-300 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Drag and drop your data file here, or click to browse
          </motion.p>
          <motion.p 
            className="text-sm text-gray-500 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Supports CSV, XLS, and XLSX files up to 50MB
          </motion.p>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="data-upload"
            disabled={uploadState.uploading}
          />
          <motion.label
            htmlFor="data-upload"
            className="inline-block cursor-pointer px-4 py-2 rounded-md font-medium transition-colors focus:outline-none border border-gray-300 text-white hover:text-gray-700 hover:bg-gray-50 bg-transparent"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            {uploadState.uploading ? "Processing..." : "Choose File"}
          </motion.label>
        </motion.div>

        {/* Upload Status */}
        <AnimatePresence>
          {uploadState.uploading && (
            <motion.div 
              className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <motion.div 
                  className="rounded-full h-4 w-4 border-b-2 border-blue-400"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="text-blue-400 text-sm">Processing your file...</span>
              </div>
            </motion.div>
          )}

          {/* Upload Error */}
          {uploadState.error && (
            <motion.div 
              className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  <AlertCircle className="h-4 w-4 text-red-400" />
                </motion.div>
                <span className="text-red-400 text-sm">{uploadState.error}</span>
              </div>
            </motion.div>
          )}

          {/* File Info */}
          {uploadState.file && !uploadState.uploading && (
            <motion.div 
              className="mt-4 p-4 bg-gray-800/50 rounded-lg"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                >
                  <FileSpreadsheet className="h-5 w-5 text-green-400" />
                </motion.div>
                <div className="flex-1">
                  <p className="font-medium">{uploadState.file.name}</p>
                  <p className="text-sm text-gray-400">{formatFileSize(uploadState.file.size)}</p>
                </div>
                {dataPreview && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </motion.div>
                )}
              </div>
              {dataPreview?.chatSession && (
                <motion.div 
                  className="mt-2 pt-2 border-t border-gray-700"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                    Chat Session Active
                  </Badge>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
    </motion.div>
  )
} 