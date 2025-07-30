"use client"

import { MarkdownMessage } from "./markdown-message"

const demoMarkdown = `# Data Analysis Results

Based on your CSV data, here are the key findings:

## Summary Statistics

| Metric | Value |
|--------|-------|
| Total Records | 1,250 |
| Average Salary | $75,000 |
| Highest Department | Engineering |
| Data Quality Score | 95% |

## Key Insights

1. **Salary Distribution**: The data shows a normal distribution with most employees earning between $60k-$90k
2. **Department Performance**: Engineering leads with an average salary of $85,000
3. **Experience Correlation**: There's a strong positive correlation (r=0.78) between experience and salary

## Code Example

Here's a Python snippet to analyze your data:

\`\`\`python
import pandas as pd
import matplotlib.pyplot as plt

# Load the data
df = pd.read_csv('employee_data.csv')

# Calculate summary statistics
summary = df.groupby('Department')['Salary'].agg(['mean', 'count'])
print(summary)

# Create visualization
plt.figure(figsize=(10, 6))
df.boxplot(column='Salary', by='Department')
plt.title('Salary Distribution by Department')
plt.show()
\`\`\`

## Recommendations

> **Important**: Consider implementing a salary review process to address the 15% pay gap between departments.

### Next Steps:
- [ ] Review salary bands by department
- [ ] Implement performance-based bonuses
- [ ] Conduct employee satisfaction survey

For more details, visit our [analytics dashboard](https://example.com/dashboard).
`

export function MarkdownDemo() {
  return (
    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Markdown Formatting Demo</h3>
      <MarkdownMessage content={demoMarkdown} />
    </div>
  )
} 