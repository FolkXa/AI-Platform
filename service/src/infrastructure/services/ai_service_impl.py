import pandas as pd
from typing import List
import json
from ...clients.openrouter_client import OpenRouterClient
from ...services.ai_service import AIServiceInterface

class AIServiceImpl(AIServiceInterface):
    def __init__(self, api_key: str, model: str = "deepseek/deepseek-chat-v3-0324:free"):
        """
        Initialize OpenRouter AI Service using OpenAI SDK
        
        Args:
            api_key: Your OpenRouter API key
            model: Model to use (default: anthropic/claude-3.5-sonnet)
                   Other options: openai/gpt-4, openai/gpt-3.5-turbo, 
                   meta-llama/llama-2-70b-chat, etc.
        """
        self.api_key = api_key
        self.model = model
        
        # Initialize OpenAI client with OpenRouter base URL
        self.client = OpenRouterClient(api_key=api_key, model=model)
    
    def _make_api_request(self, messages: List[dict], max_tokens: int = 1000) -> str:
        """Make synchronous request using OpenAI SDK"""
        try:
            response = self.client.chat(
                messages=messages,
                max_tokens=max_tokens,
                temperature=0.7
            )
            return response
        except Exception as e:
            raise Exception(f"OpenRouter API error: {str(e)}")
    
    def make_api_request(self, messages: List[dict], max_tokens: int = 1000) -> str:
        """Public method to make API requests"""
        return self._make_api_request(messages, max_tokens)
    
    def _get_data_summary(self, df: pd.DataFrame) -> str:
        """Get a concise summary of the dataframe structure"""
        summary = {
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "columns": {}
        }
        
        for col in df.columns:
            col_info = {
                "type": str(df[col].dtype),
                "non_null_count": int(df[col].count()),
                "null_count": int(df[col].isnull().sum())
            }
            
            if df[col].dtype in ['int64', 'float64']:
                if not df[col].empty and df[col].notna().any():
                    col_info.update({
                        "min": float(df[col].min()),
                        "max": float(df[col].max()),
                        "mean": float(df[col].mean()),
                        "std": float(df[col].std()) if df[col].std() == df[col].std() else 0  # Handle NaN
                    })
            elif df[col].dtype == 'object':
                col_info.update({
                    "unique_count": int(df[col].nunique()),
                    "most_common": str(df[col].mode().iloc[0]) if not df[col].mode().empty else "N/A"
                })
            
            summary["columns"][col] = col_info
        
        return json.dumps(summary, indent=2)
    
    async def generate_insights(self, df: pd.DataFrame, file_name: str) -> List[str]:
        """Generate AI-powered insights about the data"""
        try:
            data_summary = self._get_data_summary(df)
            
            prompt = f"""
            Analyze the following dataset summary and provide 4 key insights about the data.
            
            Dataset: {file_name}
            Data Summary:
            {data_summary}
            
            Please provide exactly 4 concise, actionable insights about this dataset. 
            Focus on:
            1. Data quality and completeness
            2. Key statistical patterns
            3. Notable distributions or outliers potential
            4. Business-relevant observations
            
            Format each insight as a single, clear sentence. Be specific and mention actual numbers/values where relevant.
            Return only the 4 insights, one per line, without numbering or bullet points.
            """
            
            messages = [
                {
                    "role": "system", 
                    "content": "You are a data analyst expert. Provide clear, concise insights about datasets. Always return exactly 4 insights, one per line."
                },
                {"role": "user", "content": prompt}
            ]
            
            response = self._make_api_request(messages, max_tokens=500)
            
            # Parse the response into individual insights
            insights = []
            for line in response.strip().split('\n'):
                line = line.strip()
                if line and not line.startswith('#') and len(line) > 10:
                    # Remove numbering and bullet points
                    clean_line = line.lstrip('0123456789.- ').strip()
                    if clean_line:
                        insights.append(clean_line)
            # Ensure we have exactly 4 insights
            if len(insights) < 4:
                fallback_insights = self._generate_fallback_insights(df)
                insights.extend(fallback_insights[len(insights):])
            return insights[:4]
        
        except Exception as e:
            # Fallback to basic insights if AI service fails
            print(f"AI service failed, using fallback: {e}")
            return self._generate_fallback_insights(df)
    
    def _generate_fallback_insights(self, df: pd.DataFrame) -> List[str]:
        """Fallback method that generates basic insights without AI"""
        insights = []
        
        # Basic statistical insights
        total_rows = len(df)
        insights.append(f"Dataset contains {total_rows:,} records across {len(df.columns)} columns")
        
        # Data quality insight
        missing_data = df.isnull().sum().sum()
        if missing_data > 0:
            missing_percentage = (missing_data / (len(df) * len(df.columns))) * 100
            insights.append(f"Data completeness: {missing_percentage:.1f}% missing values detected across all fields")
        else:
            insights.append("Data quality: No missing values detected - clean dataset ready for analysis")
        
        # Numeric analysis
        numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns
        if len(numeric_cols) > 0:
            col = numeric_cols[0]
            if df[col].notna().any():
                avg = df[col].mean()
                std = df[col].std()
                insights.append(f"Key metric: {col} averages {avg:,.2f} with standard deviation of {std:,.2f}")
            else:
                insights.append(f"Numeric column {col} contains only missing values")
        
        # Categorical analysis
        categorical_cols = df.select_dtypes(include=['object']).columns
        if len(categorical_cols) > 0:
            col = categorical_cols[0]
            unique_count = df[col].nunique()
            if unique_count > 0:
                insights.append(f"Diversity: {col} has {unique_count} unique values representing different categories")
            else:
                insights.append(f"Categorical column {col} has no unique values")
        
        # Ensure we always return 4 insights
        while len(insights) < 4:
            insights.append("Additional analysis recommended to uncover deeper patterns in the data")
        
        return insights[:4]
    
    async def generate_sample_questions(self, df: pd.DataFrame, headers: List[str]) -> List[str]:
        """Generate AI-powered sample questions based on the data structure"""
        try:
            data_summary = self._get_data_summary(df)
            
            prompt = f"""
            Based on the following dataset structure, generate 5 specific, actionable questions that would be valuable for data analysis.
            
            Available columns: {', '.join(headers)}
            Data Summary:
            {data_summary}
            
            Generate questions that:
            1. Use the actual column names from the dataset
            2. Would provide business or analytical value
            3. Are answerable with the available data
            4. Cover different types of analysis (trends, comparisons, distributions, correlations)
            5. Are phrased as natural questions someone would ask
            
            Return exactly 5 questions, one per line, without numbering or bullet points.
            Each question should end with a question mark.
            """
            
            messages = [
                {
                    "role": "system", 
                    "content": "You are a data analyst expert. Generate insightful, specific questions for data exploration using actual column names."
                },
                {"role": "user", "content": prompt}
            ]
            
            response = self._make_api_request(messages, max_tokens=400)
            
            # Parse the response into individual questions
            questions = []
            for line in response.strip().split('\n'):
                line = line.strip()
                if line and ('?' in line or len(line) > 10):
                    # Remove numbering and bullet points
                    clean_line = line.lstrip('0123456789.- ').strip()
                    if clean_line:
                        # Ensure question ends with question mark
                        if not clean_line.endswith('?'):
                            clean_line += '?'
                        questions.append(clean_line)
            
            # Ensure we have exactly 5 questions
            if len(questions) < 5:
                fallback_questions = self._generate_fallback_questions(df, headers)
                questions.extend(fallback_questions[len(questions):])
            
            return questions[:5]
            
        except Exception as e:
            # Fallback to basic questions if AI service fails
            print(f"AI service failed, using fallback: {e}")
            return self._generate_fallback_questions(df, headers)
    
    def _generate_fallback_questions(self, df: pd.DataFrame, headers: List[str]) -> List[str]:
        """Fallback method that generates basic questions without AI"""
        questions = []
        
        # Analyze column types
        numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns.tolist()
        categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
        date_cols = df.select_dtypes(include=['datetime64']).columns.tolist()
        
        # Add potential date columns
        for col in df.columns:
            if any(keyword in col.lower() for keyword in ['date', 'time', 'day', 'month', 'year']):
                if col not in date_cols:
                    date_cols.append(col)
        
        # Generate questions based on available columns
        if numeric_cols:
            questions.append(f"What is the distribution and range of {numeric_cols[0]} values?")
            if len(numeric_cols) > 1:
                questions.append(f"How strongly are {numeric_cols[0]} and {numeric_cols[1]} correlated?")
        
        if categorical_cols:
            questions.append(f"Which {categorical_cols[0]} category appears most frequently in the dataset?")
            if len(categorical_cols) > 1 and numeric_cols:
                questions.append(f"How does {numeric_cols[0]} vary across different {categorical_cols[0]} categories?")
        
        if date_cols and numeric_cols:
            questions.append(f"What trends can be observed in {numeric_cols[0]} over time using {date_cols[0]}?")
        
        # Fill remaining slots with generic but valuable questions
        generic_questions = [
            "What are the most significant patterns and outliers in this dataset?",
            "Which variables show the strongest relationships with each other?",
            "What data quality issues need to be addressed before analysis?",
            "What insights from this data could drive business decisions?",
            "What additional analysis would provide the most value?"
        ]
        
        # Add generic questions to reach exactly 5 total
        for q in generic_questions:
            if len(questions) < 5:
                questions.append(q)
        
        return questions[:5]
    
    def close(self):
        """Close the client connection"""
        self.client.close()