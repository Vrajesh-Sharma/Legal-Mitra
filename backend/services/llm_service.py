from typing import List, Dict, Any
import google.generativeai as genai
import time

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
            print("✓ Gemini configured")
    
    def generate_answer(
        self,
        question: str,
        contexts: List[Dict[str, Any]],
        max_retries: int = 2
    ) -> str:
        """
        Generate answer using retrieved contexts with improved error handling
        """
        if not contexts:
            return "I couldn't find relevant information in the legal documents to answer your question. Please try rephrasing or asking about a different topic."
        
        # Build enriched context
        context_text = self._build_context(contexts)
        
        # Create optimized prompt
        prompt = self._create_prompt(question, context_text, contexts)
        
        # Try with different safety settings if needed
        for attempt in range(max_retries):
            try:
                print(f"🤖 Attempt {attempt + 1}/{max_retries} - Generating response...")
                
                model = genai.GenerativeModel(
                    self.model_name,
                    safety_settings={
                        'HARM_CATEGORY_HARASSMENT': 'BLOCK_NONE',
                        'HARM_CATEGORY_HATE_SPEECH': 'BLOCK_NONE',
                        'HARM_CATEGORY_SEXUALLY_EXPLICIT': 'BLOCK_NONE',
                        'HARM_CATEGORY_DANGEROUS_CONTENT': 'BLOCK_NONE',
                    }
                )
                
                response = model.generate_content(
                    prompt,
                    generation_config=genai.GenerationConfig(
                        temperature=self.temperature,
                        max_output_tokens=self.max_tokens,
                        top_p=0.95,
                        top_k=40,
                    )
                )
                
                # Check if response was blocked
                if not response.text or response.text.strip() == "":
                    print("⚠️  Empty response received")
                    
                    # Check for safety ratings
                    if hasattr(response, 'prompt_feedback'):
                        print(f"Prompt feedback: {response.prompt_feedback}")
                    
                    if hasattr(response, 'candidates') and response.candidates:
                        candidate = response.candidates[0]
                        if hasattr(candidate, 'safety_ratings'):
                            print(f"Safety ratings: {candidate.safety_ratings}")
                        if hasattr(candidate, 'finish_reason'):
                            print(f"Finish reason: {candidate.finish_reason}")
                    
                    # Try with simpler prompt
                    if attempt < max_retries - 1:
                        print("🔄 Retrying with simplified prompt...")
                        time.sleep(1)
                        prompt = self._create_simple_prompt(question, context_text)
                        continue
                    else:
                        return self._create_fallback_answer(contexts)
                
                return response.text.strip()
            
            except Exception as e:
                error_msg = str(e)
                print(f"❌ Error on attempt {attempt + 1}: {error_msg}")
                
                # Check for specific error types
                if "safety" in error_msg.lower() or "blocked" in error_msg.lower():
                    print("⚠️  Content blocked by safety filters")
                    if attempt < max_retries - 1:
                        print("🔄 Retrying with educational framing...")
                        time.sleep(1)
                        prompt = self._create_educational_prompt(question, context_text)
                        continue
                    else:
                        return self._create_fallback_answer(contexts)
                
                elif "quota" in error_msg.lower() or "rate" in error_msg.lower():
                    print("⚠️  Rate limit or quota exceeded")
                    if attempt < max_retries - 1:
                        time.sleep(2)
                        continue
                    else:
                        return "I'm currently experiencing high demand. Please try again in a moment."
                
                elif "api_key" in error_msg.lower():
                    return "There's an issue with the API configuration. Please contact support."
                
                else:
                    import traceback
                    traceback.print_exc()
                    if attempt < max_retries - 1:
                        time.sleep(1)
                        continue
                    else:
                        return self._create_fallback_answer(contexts)
        
        # If all retries failed
        return self._create_fallback_answer(contexts)
    
    def _build_context(self, contexts: List[Dict[str, Any]]) -> str:
        """Build enriched context from retrieved documents"""
        from config import Config
        
        context_parts = []
        total_length = 0
        
        for idx, ctx in enumerate(contexts, 1):
            metadata = ctx.get('metadata', {})
            
            act_name = metadata.get('act_name', 'Unknown Act')
            section = metadata.get('section_number', 'Unknown')
            text = metadata.get('text_preview', '')
            score = ctx.get('score', 0.0)
            
            # Build context entry
            context_entry = f"""
[Document {idx}] {act_name} - Section {section} (Relevance: {score:.2f})
{text}
"""
            
            # Check if adding this would exceed max length
            if total_length + len(context_entry) > Config.MAX_CONTEXT_LENGTH:
                break
            
            context_parts.append(context_entry)
            total_length += len(context_entry)
        
        return "\n".join(context_parts)
    
    def _create_prompt(self, question: str, context: str, contexts: List[Dict]) -> str:
        """Create optimized prompt for legal Q&A"""
        
        # Get unique acts mentioned
        acts_mentioned = set()
        for ctx in contexts:
            act_name = ctx.get('metadata', {}).get('act_name', '')
            if act_name:
                acts_mentioned.add(act_name)
        
        acts_list = ", ".join(sorted(acts_mentioned)) if acts_mentioned else "Indian Legal Acts"
        
        prompt = f"""You are Legal Mitra, an AI assistant providing legal information based on Indian law.

**Context:** Educational legal information resource

**Available Legal Sources:**
{acts_list}

**Retrieved Legal Provisions:**
{context}

**Question:**
{question}

**Instructions:**
Provide an informative answer based ONLY on the legal documents above. Structure your response as:

1. Direct answer to the question
2. Relevant legal provisions with section citations
3. Brief explanation in simple terms

If the provided documents don't fully answer the question, clearly state what information is available and what cannot be determined.

**Answer:**"""

        return prompt
    
    def _create_simple_prompt(self, question: str, context: str) -> str:
        """Create simplified prompt to avoid safety blocks"""
        return f"""Based on the following Indian legal provisions, answer the question.

Legal Provisions:
{context}

Question: {question}

Provide a factual answer citing the relevant sections."""
    
    def _create_educational_prompt(self, question: str, context: str) -> str:
        """Create educational framing to bypass safety filters"""
        return f"""You are providing educational information about Indian law for academic purposes.

Legal Reference Materials:
{context}

Student Question: {question}

Provide an educational explanation of the relevant legal provisions, citing specific sections."""
    
    def _create_fallback_answer(self, contexts: List[Dict[str, Any]]) -> str:
        """Create fallback answer from contexts when LLM fails"""
        if not contexts:
            return "I couldn't generate a response. Please try rephrasing your question."
        
        # Extract key information from contexts
        answer_parts = ["Based on the retrieved legal documents:\n"]
        
        for idx, ctx in enumerate(contexts[:3], 1):  # Use top 3
            metadata = ctx.get('metadata', {})
            act_name = metadata.get('act_name', 'Unknown Act')
            section = metadata.get('section_number', 'N/A')
            text = metadata.get('text_preview', '')[:300]
            
            answer_parts.append(f"\n**{idx}. {act_name} - Section {section}:**")
            answer_parts.append(f"{text}...")
        
        answer_parts.append("\n\n*Note: For a detailed interpretation, please consult with a legal professional.*")
        
        return "\n".join(answer_parts)