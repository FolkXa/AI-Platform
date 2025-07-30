"use client"

import { useState } from "react"
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
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5 text-green-400" />
          <span>Upload Your Data</span>
        </CardTitle>
        <CardDescription>Upload CSV or Excel files to start chatting with your data</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            uploadState.dragActive ? "border-green-500 bg-green-500/10" : "border-gray-700 hover:border-gray-600"
          }`}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300 mb-2">Drag and drop your data file here, or click to browse</p>
          <p className="text-sm text-gray-500 mb-4">Supports CSV, XLS, and XLSX files up to 50MB</p>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="data-upload"
            disabled={uploadState.uploading}
          />
          <label
            htmlFor="data-upload"
            className="inline-block cursor-pointer px-4 py-2 rounded-md font-medium transition-colors focus:outline-none border border-gray-300 text-white hover:text-gray-700 hover:bg-gray-50 bg-transparent"
          >
            {uploadState.uploading ? "Processing..." : "Choose File"}
          </label>
        </div>

        {/* Upload Status */}
        {uploadState.uploading && (
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
              <span className="text-blue-400 text-sm">Processing your file...</span>
            </div>
          </div>
        )}

        {/* Upload Error */}
        {uploadState.error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-400 text-sm">{uploadState.error}</span>
            </div>
          </div>
        )}

        {/* File Info */}
        {uploadState.file && !uploadState.uploading && (
          <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="h-5 w-5 text-green-400" />
              <div className="flex-1">
                <p className="font-medium">{uploadState.file.name}</p>
                <p className="text-sm text-gray-400">{formatFileSize(uploadState.file.size)}</p>
              </div>
              {dataPreview && <CheckCircle className="h-5 w-5 text-green-400" />}
            </div>
            {dataPreview?.chatSession && (
              <div className="mt-2 pt-2 border-t border-gray-700">
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  Chat Session Active
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 