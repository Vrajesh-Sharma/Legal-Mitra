from typing import List, Dict, Any
import google.generativeai as genai


class LLMService:    
    _instance = None
    _configured = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not self._configured:
            from config import Config
            print(f"Configuring Gemini API: {Config.GEMINI_MODEL}")
            genai.configure(api_key=Config.GEMINI_API_KEY)
            self.model_name = Config.GEMINI_MODEL
            self.temperature = Config.TEMPERATURE
            self.max_tokens = Config.MAX_TOKENS
            self._configured = True
            print("Gemini configured")
    
    def generate_answer(
        self,
        question: str,
        contexts: List[Dict[str, Any]]
    ) -> str:
        """
        Generate answer using retrieved contexts
        
        Args:
            question: User's question
            contexts: Retrieved document contexts
            
        Returns:
            Generated answer
        """
        context_text = self._build_context(contexts)
        prompt = self._create_prompt(question, context_text)
        try:
            model = genai.GenerativeModel(self.model_name)
            response = model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    temperature=self.temperature,
                    max_output_tokens=self.max_tokens,
                )
            )
            return response.text
        
        except Exception as e:
            print(f"Error generating response: {e}")
            return f"I apologize, but I encountered an error while generating the response. Please try again."
    
    def _build_context(self, contexts: List[Dict[str, Any]]) -> str:
        context_parts = []
        for idx, ctx in enumerate(contexts, 1):
            metadata = ctx.get('metadata', {})
            act_name = metadata.get('act_name', 'Unknown Act')
            section = metadata.get('section_number', 'Unknown')
            text = metadata.get('text_preview', '')
            context_parts.append(
                f"[Source {idx}] {act_name} - Section {section}\n{text}\n"
            )
        return "\n".join(context_parts)
    
    def _create_prompt(self, question: str, context: str) -> str:
        return f"""You are a helpful legal assistant specializing in Indian law. Your role is to provide clear, accurate guidance based on the provided legal documents.
**Context from Indian Legal Acts:**
{context}
**User Question:**
{question}
**Instructions:**
1. Answer the question based ONLY on the provided context
2. Cite specific sections and act names when providing information
3. If the context doesn't contain enough information, clearly state that
4. Use simple language while maintaining legal accuracy
5. Provide practical guidance where appropriate
6. Do not make up information not present in the context
**Answer:**"""