"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, MessageSquare, ArrowRight, Shield, BarChart3, Briefcase, LogIn } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { UserNav } from "@/components/user-nav"

export default function HomePage() {
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Legal Document Analyzer",
      description: "Upload legal documents (PDF/DOCX) for AI-powered analysis, risk detection, and contract review",
      href: "/legal-analyzer",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      features: ["Contract Summarization", "Risk Detection", "Clause Analysis", "Compliance Check"],
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Chat with My Data",
      description: "Upload your data files (CSV/Excel) and have natural language conversations with your data",
      href: "/chat-with-data",
      color: "bg-green-500/10 text-green-400 border-green-500/20",
      features: ["Natural Language Queries", "Data Visualization", "Trend Analysis", "Export Insights"],
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Resume Analyzer & Job Match",
      description: "Analyze resumes, extract skills, and get personalized job recommendations with improvement tips",
      href: "/resume-analyzer",
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      features: ["Skills Extraction", "Job Matching", "Resume Feedback", "Career Insights"],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Platform
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/legal-analyzer" className="text-gray-300 hover:text-white transition-colors">
                Legal Analyzer
              </Link>
              <Link href="/chat-with-data" className="text-gray-300 hover:text-white transition-colors">
                Chat with Data
              </Link>
              <Link href="/resume-analyzer" className="text-gray-300 hover:text-white transition-colors">
                Resume Analyzer
              </Link>
            </nav>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section 
        className="py-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              AI-Powered Document Intelligence Platform
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Transform your documents with cutting-edge AI. Analyze legal contracts, chat with your data, and optimize
              resumes with intelligent insights and recommendations.
            </motion.p>
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge variant="secondary" className="bg-gray-800 text-gray-300 px-4 py-2">
                  <FileText className="h-4 w-4 mr-2" />
                  Document Analysis
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge variant="secondary" className="bg-gray-800 text-gray-300 px-4 py-2">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Natural Language Processing
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge variant="secondary" className="bg-gray-800 text-gray-300 px-4 py-2">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Data Intelligence
                </Badge>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <motion.section 
        className="py-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10 }}
              >
                <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 group h-full">
                  <CardHeader>
                    <motion.div
                      className={`w-16 h-16 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      whileHover={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {feature.features.map((item, idx) => (
                        <motion.li 
                          key={idx} 
                          className="text-sm text-gray-300 flex items-center"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + index * 0.2 + idx * 0.1, duration: 0.3 }}
                        >
                          <div className="h-1.5 w-1.5 bg-gray-500 rounded-full mr-3" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href={feature.href}>
                        <Button className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium group transition-all duration-200">
                          <motion.span
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            Get Started
                          </motion.span>
                          <motion.div
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </motion.div>
                        </Button>
                      </Link>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-16 px-4 bg-gray-900/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.8 }}
      >
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10K+", label: "Documents Analyzed", color: "text-blue-400" },
              { value: "95%", label: "Accuracy Rate", color: "text-green-400" },
              { value: "24/7", label: "AI Processing", color: "text-purple-400" },
              { value: "5min", label: "Average Analysis Time", color: "text-yellow-400" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className={`text-3xl font-bold ${stat.color} mb-2`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.1, duration: 0.5, type: "spring", stiffness: 200 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; 2024 AI Platform. Powered by advanced AI technology.</p>
        </div>
      </footer>
    </div>
  )
}

function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 animate-pulse bg-gray-700 rounded-full" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <Link href="/auth/signin">
        <Button variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-800 bg-transparent">
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      </Link>
    )
  }

  if (session) {
    return <UserNav />
  }

  return (
    <Link href="/auth/signin">
      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
        <LogIn className="h-4 w-4 mr-2" />
        Sign In
      </Button>
    </Link>
  )
}
