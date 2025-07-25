"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, User, Star, ArrowLeft, FileText, Briefcase, Award } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { UserNav } from "@/components/user-nav"

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [dragActive, setDragActive] = useState(false)

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
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const analyzeResume = async () => {
    if (!file) return

    setAnalyzing(true)

    // Simulate analysis process
    setTimeout(() => {
      setAnalysis({
        profile: {
          name: "John Smith",
          title: "Senior Software Engineer",
          experience: "5+ years",
          location: "San Francisco, CA",
        },
        overallScore: 85,
        skills: [
          { name: "JavaScript", level: 90, category: "Programming" },
          { name: "React", level: 85, category: "Frontend" },
          { name: "Node.js", level: 80, category: "Backend" },
          { name: "Python", level: 75, category: "Programming" },
          { name: "AWS", level: 70, category: "Cloud" },
          { name: "Docker", level: 65, category: "DevOps" },
        ],
        strengths: [
          "Strong technical skills in modern web technologies",
          "Proven track record with 5+ years experience",
          "Leadership experience managing small teams",
          "Good educational background in Computer Science",
        ],
        improvements: [
          "Add more quantifiable achievements and metrics",
          "Include certifications in cloud technologies",
          "Expand on project management experience",
          "Add links to portfolio or GitHub projects",
        ],
        jobMatches: [
          {
            title: "Senior Frontend Developer",
            company: "TechCorp Inc.",
            match: 92,
            salary: "$120k - $150k",
            location: "San Francisco, CA",
            requirements: ["React", "JavaScript", "TypeScript", "Node.js"],
          },
          {
            title: "Full Stack Engineer",
            company: "StartupXYZ",
            match: 88,
            salary: "$110k - $140k",
            location: "Remote",
            requirements: ["JavaScript", "React", "Python", "AWS"],
          },
          {
            title: "Lead Software Engineer",
            company: "Enterprise Solutions",
            match: 85,
            salary: "$130k - $160k",
            location: "San Francisco, CA",
            requirements: ["Leadership", "JavaScript", "Cloud", "Architecture"],
          },
        ],
        sections: {
          contact: 90,
          summary: 80,
          experience: 85,
          skills: 90,
          education: 85,
          projects: 70,
        },
      })
      setAnalyzing(false)
    }, 3000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getMatchColor = (match: number) => {
    if (match >= 90) return "bg-green-500/10 text-green-400 border-green-500/20"
    if (match >= 80) return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
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
                  <div className="h-8 w-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <h1 className="text-xl font-bold">Resume Analyzer & Job Match</h1>
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
                    <Upload className="h-5 w-5 text-purple-400" />
                    <span>Upload Resume</span>
                  </CardTitle>
                  <CardDescription>Upload your resume (PDF) for AI-powered analysis and job matching</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive ? "border-purple-500 bg-purple-500/10" : "border-gray-700 hover:border-gray-600"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">Drag and drop your resume here, or click to browse</p>
                    <p className="text-sm text-gray-500 mb-4">Supports PDF files up to 5MB</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload">
                      <Button variant="outline" className="cursor-pointer bg-transparent">
                        Choose File
                      </Button>
                    </label>
                  </div>

                  {file && (
                    <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-purple-400" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          onClick={analyzeResume}
                          disabled={analyzing}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          {analyzing ? "Analyzing..." : "Analyze Resume"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {analyzing && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Analyzing resume...</span>
                        <span className="text-sm text-gray-400">80%</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Resume Score */}
              {analysis && (
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span>Resume Score</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)} mb-2`}>
                        {analysis.overallScore}/100
                      </div>
                      <p className="text-gray-400">Overall Resume Score</p>
                    </div>

                    <div className="space-y-3">
                      {Object.entries(analysis.sections).map(([section, score]) => (
                        <div key={section} className="flex items-center justify-between">
                          <span className="text-gray-300 capitalize">{section}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={score as number} className="w-20 h-2" />
                            <span className={`text-sm font-medium ${getScoreColor(score as number)}`}>{score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Analysis Results */}
            <div className="space-y-6">
              {analysis && (
                <>
                  {/* Profile Summary */}
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle>Profile Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name:</span>
                          <span className="font-medium">{analysis.profile.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Title:</span>
                          <span className="font-medium">{analysis.profile.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Experience:</span>
                          <span className="font-medium">{analysis.profile.experience}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Location:</span>
                          <span className="font-medium">{analysis.profile.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills Analysis */}
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-purple-400" />
                        <span>Skills Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analysis.skills.map((skill: any, index: number) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{skill.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {skill.category}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Progress value={skill.level} className="w-16 h-2" />
                              <span className="text-sm text-gray-400 w-8">{skill.level}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Job Matches */}
                  <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Briefcase className="h-5 w-5 text-purple-400" />
                        <span>Job Matches</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analysis.jobMatches.map((job: any, index: number) => (
                          <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium">{job.title}</h4>
                                <p className="text-sm text-gray-400">{job.company}</p>
                              </div>
                              <Badge className={getMatchColor(job.match)}>{job.match}% Match</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                              <span>{job.salary}</span>
                              <span>{job.location}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {job.requirements.map((req: string, reqIndex: number) => (
                                <Badge key={reqIndex} variant="secondary" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Strengths & Improvements */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="bg-gray-900/50 border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-green-400">Strengths</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.strengths.map((strength: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="h-1.5 w-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm text-gray-300">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900/50 border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-yellow-400">Improvements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.improvements.map((improvement: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="h-1.5 w-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm text-gray-300">{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
