"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Upload, Database, MessageSquare, ArrowLeft, FileSpreadsheet, BarChart3, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useChat } from "@ai-sdk/react"
import { ProtectedRoute } from "@/components/protected-route"
import { UserNav } from "@/components/user-nav"

export default function ChatWithData() {
  const [file, setFile] = useState<File | null>(null)
  const [dataPreview, setDataPreview] = useState<any>(null)
  const [dragActive, setDragActive] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/data-chat",
  })

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.name.endsWith(".csv") || droppedFile.name.endsWith(".xlsx")) {
        setFile(droppedFile)
        processFile(droppedFile)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      processFile(selectedFile)
    }
  }

  const processFile = (file: File) => {
    // Simulate file processing and data preview
    setTimeout(() => {
      setDataPreview({
        fileName: file.name,
        rows: 1250,
        columns: 8,
        headers: ["Date", "Product", "Category", "Sales", "Quantity", "Region", "Customer_Type", "Revenue"],
        sampleData: [
          ["2024-01-15", "Laptop Pro", "Electronics", "$1,299", "5", "North", "Business", "$6,495"],
          ["2024-01-16", "Wireless Mouse", "Accessories", "$29", "15", "South", "Consumer", "$435"],
          ["2024-01-17", "Monitor 4K", "Electronics", "$399", "8", "East", "Business", "$3,192"],
        ],
        insights: [
          "Total revenue: $2.4M across all regions",
          "Electronics category leads with 45% of sales",
          "North region shows highest performance",
          "Business customers generate 60% more revenue",
        ],
      })
    }, 1500)
  }

  const sampleQuestions = [
    "What's the total sales for January?",
    "Which product category performs best?",
    "Show me revenue trends by region",
    "What's the average order value?",
    "Which customers buy the most?",
  ]

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
                      dragActive ? "border-green-500 bg-green-500/10" : "border-gray-700 hover:border-gray-600"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">Drag and drop your data file here, or click to browse</p>
                    <p className="text-sm text-gray-500 mb-4">Supports CSV and Excel files up to 50MB</p>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                      id="data-upload"
                    />
                    <label htmlFor="data-upload"
                      className="inline-block cursor-pointer px-4 py-2 rounded-md font-medium transition-colors focus:outline-none border border-gray-300 text-white hover:text-gray-700 hover:bg-gray-50 bg-transparent">
                        Choose File
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Data Preview */}
              {dataPreview && (
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-green-400" />
                      <span>Data Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">File:</span>
                        <span className="font-medium break-words text-right max-w-[60%]">{dataPreview.fileName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Rows:</span>
                        <Badge variant="secondary">{dataPreview.rows.toLocaleString()}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Columns:</span>
                        <Badge variant="secondary">{dataPreview.columns}</Badge>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Column Headers:</h4>
                        <div className="flex flex-wrap gap-2">
                          {dataPreview.headers.map((header: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs break-words max-w-full">
                              {header}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Sample Data:</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-gray-700">
                                {dataPreview.headers.slice(0, 4).map((header: string, index: number) => (
                                  <th key={index} className="text-left p-2 text-gray-400 break-words min-w-0">
                                    <div className="break-words">{header}</div>
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {dataPreview.sampleData.map((row: string[], index: number) => (
                                <tr key={index} className="border-b border-gray-800">
                                  {row.slice(0, 4).map((cell: string, cellIndex: number) => (
                                    <td key={cellIndex} className="p-2 text-gray-300 break-words min-w-0 max-w-xs">
                                      <div className="break-words overflow-wrap-anywhere">{cell}</div>
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-medium mb-2 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
                          Quick Insights:
                        </h4>
                        <ul className="space-y-1">
                          {dataPreview.insights.map((insight: string, index: number) => (
                            <li key={index} className="text-sm text-gray-300 flex items-start">
                              <div className="h-1.5 w-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                              <span className="break-words min-w-0 flex-1">{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Chat Interface */}
            <div className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-green-400" />
                    <span>Chat with Your Data</span>
                  </CardTitle>
                  <CardDescription>Ask questions about your data in natural language</CardDescription>
                </CardHeader>
                <CardContent>
                  {!dataPreview ? (
                    <div className="text-center py-8">
                      <Database className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Upload a data file to start chatting</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Sample Questions */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Try asking:</h4>
                        <div className="flex flex-wrap gap-2">
                          {sampleQuestions.map((question, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-auto py-1 px-2 bg-transparent"
                              onClick={() => handleInputChange({ target: { value: question } } as any)}
                            >
                              {question}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {messages.length === 0 && (
                          <div className="text-center py-4">
                            <p className="text-gray-400 text-sm">Start a conversation about your data</p>
                          </div>
                        )}
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`p-3 rounded-lg ${
                              message.role === "user" ? "bg-green-600/20 ml-8" : "bg-gray-800/50 mr-8"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                        ))}
                      </div>

                      {/* Chat Input */}
                      <form onSubmit={handleSubmit} className="flex space-x-2">
                        <Input
                          value={input}
                          onChange={handleInputChange}
                          placeholder="Ask about your data... e.g., 'What's the total revenue?'"
                          className="flex-1 bg-gray-800 border-gray-700"
                        />
                        <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                          Send
                        </Button>
                      </form>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
