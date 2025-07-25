"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, AlertTriangle, CheckCircle, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useChat } from "@ai-sdk/react"
import { ProtectedRoute } from "@/components/protected-route"
import { UserNav } from "@/components/user-nav"

export default function LegalAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [dragActive, setDragActive] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/legal-chat",
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
      if (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".docx")) {
        setFile(droppedFile)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const analyzeDocument = async () => {
    if (!file) return

    setAnalyzing(true)

    // Simulate analysis process
    setTimeout(() => {
      setAnalysisResult({
        summary:
          "This contract appears to be a standard service agreement with several key provisions. The payment terms are net 30 days, and there's a termination clause allowing either party to terminate with 30 days notice.",
        risks: [
          { level: "high", text: "Unlimited liability clause found in section 5.2" },
          { level: "medium", text: "Vague intellectual property ownership terms" },
          { level: "low", text: "Standard force majeure clause present" },
        ],
        recommendations: [
          "Consider adding a liability cap to limit exposure",
          "Clarify intellectual property ownership rights",
          "Review termination notice period requirements",
        ],
        keyTerms: [
          { term: "Payment Terms", value: "Net 30 days" },
          { term: "Contract Duration", value: "12 months" },
          { term: "Termination Notice", value: "30 days" },
          { term: "Governing Law", value: "State of California" },
        ],
      })
      setAnalyzing(false)
    }, 3000)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

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
                  <div className="h-8 w-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                  </div>
                  <h1 className="text-xl font-bold">Legal Document Analyzer</h1>
                </div>
              </div>
              <UserNav />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5 text-blue-400" />
                    <span>Upload Legal Document</span>
                  </CardTitle>
                  <CardDescription>Upload PDF or DOCX files for AI-powered legal analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive ? "border-blue-500 bg-blue-500/10" : "border-gray-700 hover:border-gray-600"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">Drag and drop your legal document here, or click to browse</p>
                    <p className="text-sm text-gray-500 mb-4">Supports PDF and DOCX files up to 10MB</p>
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer bg-transparent">
                        Choose File
                      </Button>
                    </label>
                  </div>

                  {file && (
                    <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-400" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          onClick={analyzeDocument}
                          disabled={analyzing}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {analyzing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            "Analyze Document"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {analyzing && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Analyzing document...</span>
                        <span className="text-sm text-gray-400">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Chat Section */}
              {analysisResult && (
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle>Ask Questions About Your Document</CardTitle>
                    <CardDescription>Chat with AI about your legal document analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 rounded-lg ${
                            message.role === "user" ? "bg-blue-600/20 ml-8" : "bg-gray-800/50 mr-8"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleSubmit} className="flex space-x-2">
                      <Textarea
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask about risks, clauses, or recommendations..."
                        className="flex-1 bg-gray-800 border-gray-700"
                        rows={2}
                      />
                      <Button type="submit" disabled={isLoading}>
                        Send
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Analysis Results */}
            <div className="space-y-6">
              {analysisResult && (
                <>
                  {/* Summary */}
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span>Document Summary</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">{analysisResult.summary}</p>
                    </CardContent>
                  </Card>

                  {/* Risk Analysis */}
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        <span>Risk Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysisResult.risks.map((risk: any, index: number) => (
                          <div key={index} className="flex items-start space-x-3">
                            <Badge className={getRiskColor(risk.level)}>{risk.level.toUpperCase()}</Badge>
                            <p className="text-gray-300 text-sm flex-1">{risk.text}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Terms */}
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle>Key Terms</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysisResult.keyTerms.map((term: any, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0"
                          >
                            <span className="text-gray-400">{term.term}</span>
                            <span className="text-white font-medium">{term.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle>Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysisResult.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="h-1.5 w-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-300 text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
