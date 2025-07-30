"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import type { Components } from "react-markdown"

interface MarkdownMessageProps {
  content: string
  className?: string
}

export function MarkdownMessage({ content, className = "" }: MarkdownMessageProps) {
  const components: Components = {
    // Custom code block with syntax highlighting
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "")
      const isInline = !match
      return !isInline && match ? (
        <SyntaxHighlighter
          style={oneDark as any}
          language={match[1]}
          PreTag="div"
          className="rounded-md"
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      )
    },
    // Custom table styling
    table({ children }) {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700 border border-gray-700 rounded-lg">
            {children}
          </table>
        </div>
      )
    },
    // Custom table header styling
    th({ children }) {
      return (
        <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-gray-800 border-b border-gray-700">
          {children}
        </th>
      )
    },
    // Custom table cell styling
    td({ children }) {
      return (
        <td className="px-3 py-2 text-sm text-gray-300 border-b border-gray-800">
          {children}
        </td>
      )
    },
    // Custom blockquote styling
    blockquote({ children }) {
      return (
        <blockquote className="border-l-4 border-green-500 pl-4 py-2 my-4 bg-green-500/10 rounded-r-lg">
          {children}
        </blockquote>
      )
    },
    // Custom list styling
    ul({ children }) {
      return <ul className="list-disc list-inside space-y-1 my-4">{children}</ul>
    },
    ol({ children }) {
      return <ol className="list-decimal list-inside space-y-1 my-4">{children}</ol>
    },
    // Custom link styling
    a({ children, href }) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 hover:text-green-300 underline"
        >
          {children}
        </a>
      )
    },
    // Custom heading styling
    h1({ children }) {
      return <h1 className="text-xl font-bold text-white mt-6 mb-4">{children}</h1>
    },
    h2({ children }) {
      return <h2 className="text-lg font-semibold text-white mt-5 mb-3">{children}</h2>
    },
    h3({ children }) {
      return <h3 className="text-base font-medium text-white mt-4 mb-2">{children}</h3>
    },
    // Custom paragraph styling
    p({ children }) {
      return <p className="text-gray-300 leading-relaxed mb-3">{children}</p>
    },
    // Custom strong styling
    strong({ children }) {
      return <strong className="font-semibold text-white">{children}</strong>
    },
    // Custom emphasis styling
    em({ children }) {
      return <em className="italic text-gray-200">{children}</em>
    },
  }

  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
} 