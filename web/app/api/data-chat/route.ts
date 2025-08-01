import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, sessionId, file } = await req.json()

  // If sessionId is provided, this is a CSV chat request
  if (sessionId && file) {
    // For CSV chat, we'll use the backend service
    // This route is kept for backward compatibility
    // The actual CSV chat is handled by the frontend directly calling the backend
    return new Response("CSV chat should use the backend service directly", { status: 400 })
  }

  // Legacy chat functionality for non-CSV data
  const result = streamText({
    model: openai("gpt-4o"),
    system: `You are a data analysis assistant that helps users understand and analyze their data through natural language queries.

Key capabilities:
- Answer questions about data trends, patterns, and insights
- Perform calculations and statistical analysis
- Generate data visualizations descriptions
- Provide business intelligence insights
- Help with data interpretation and recommendations

Sample data context: Sales data with columns for Date, Product, Category, Sales, Quantity, Region, Customer_Type, Revenue.

When answering questions:
1. Provide specific, actionable insights
2. Use data-driven language
3. Suggest follow-up questions or analysis
4. Format numbers clearly (e.g., $2.4M, 1,250 units)
5. Reference specific data points when possible`,
    messages,
  })

  return result.toDataStreamResponse()
}
