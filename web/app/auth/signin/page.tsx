"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Chrome, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { signIn, getProviders } from "next-auth/react"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  useEffect(() => {
    const setAuthProviders = async () => {
      try {
        const res = await getProviders()
        setProviders(res)
      } catch (error) {
        console.error("Failed to get providers:", error)
      }
    }
    setAuthProviders()
  }, [])

  const handleSignIn = async (providerId: string) => {
    setLoading(providerId)
    try {
      await signIn(providerId, { callbackUrl: "/" })
    } catch (error) {
      console.error("Sign in error:", error)
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900/50 border-gray-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to AI Platform
          </CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to access Legal Analyzer, Data Chat, and Resume Analyzer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm text-center">
                {error === "OAuthSignin" && "Error occurred during sign in"}
                {error === "OAuthCallback" && "Error occurred during callback"}
                {error === "OAuthCreateAccount" && "Could not create account"}
                {error === "EmailCreateAccount" && "Could not create account"}
                {error === "Callback" && "Error occurred during callback"}
                {error === "OAuthAccountNotLinked" && "Account not linked"}
                {error === "EmailSignin" && "Check your email"}
                {error === "CredentialsSignin" && "Invalid credentials"}
                {error === "SessionRequired" && "Please sign in to access this page"}
                {![
                  "OAuthSignin",
                  "OAuthCallback",
                  "OAuthCreateAccount",
                  "EmailCreateAccount",
                  "Callback",
                  "OAuthAccountNotLinked",
                  "EmailSignin",
                  "CredentialsSignin",
                  "SessionRequired",
                ].includes(error) && "An error occurred during authentication"}
              </p>
            </div>
          )}

          {providers ? (
            <>
              {providers.google && (
                <Button
                  onClick={() => handleSignIn("google")}
                  disabled={loading === "google"}
                  className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300"
                  size="lg"
                >
                  <Chrome className="h-5 w-5 mr-3" />
                  Continue with Google
                </Button>
              )}

              {providers.github && (
                <Button
                  onClick={() => handleSignIn("github")}
                  disabled={loading === "github"}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                  size="lg"
                >
                  <Github className="h-5 w-5 mr-3" />
                  Continue with GitHub
                </Button>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="w-full h-11 bg-gray-800 animate-pulse rounded-lg" />
              <div className="w-full h-11 bg-gray-800 animate-pulse rounded-lg" />
            </div>
          )}

          <div className="text-center pt-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-xs text-gray-500 text-center pt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
