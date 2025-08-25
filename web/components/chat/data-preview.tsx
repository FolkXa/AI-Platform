"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp } from "lucide-react"
import { DataPreview as DataPreviewType } from "@/types/chat"

interface DataPreviewProps {
  dataPreview: DataPreviewType
  formatFileSize: (bytes: number) => string
}

export function DataPreview({ dataPreview, formatFileSize }: DataPreviewProps) {
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
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <BarChart3 className="h-5 w-5 text-green-400" />
              </motion.div>
              <span>Data Overview</span>
            </CardTitle>
          </motion.div>
        </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">File:</span>
              <span className="font-medium text-sm truncate ml-2">{dataPreview.fileName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Size:</span>
              <span className="font-medium text-sm">{formatFileSize(dataPreview.fileSize)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Rows:</span>
              <Badge variant="secondary">{dataPreview.rows.toLocaleString()}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Columns:</span>
              <Badge variant="secondary">{dataPreview.columns}</Badge>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Column Headers:</h4>
            <div className="flex flex-wrap gap-2">
              {dataPreview.headers.map((header: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
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
                      <th key={index} className="text-left p-2 text-gray-400">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataPreview.sampleData.map((row: string[], index: number) => (
                    <tr key={index} className="border-b border-gray-800">
                      {row.slice(0, 4).map((cell: string, cellIndex: number) => (
                        <td key={cellIndex} className="p-2 text-gray-300">
                          {cell}
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
              AI Insights:
            </h4>
            <ul className="space-y-1">
              {dataPreview.insights.map((insight: string, index: number) => (
                <li key={index} className="text-sm text-gray-300 flex items-start">
                  <div className="h-1.5 w-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  )
} 