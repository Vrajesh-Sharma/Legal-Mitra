import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration"""
    
    # Flask
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    
    # Pinecone
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    INDEX_NAME = os.getenv("INDEX_NAME")
    
    # Gemini
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL = os.getenv("GEMINI_MODEL")
    
    # Embedding
    EMBEDDING_MODEL = "all-mpnet-base-v2"
    EMBEDDING_DIM = 768
    
    # Retrieval
    TOP_K = 7
    SCORE_THRESHOLD = 0.5
    
    # LLM
    MAX_TOKENS = 2048
    TEMPERATURE = 0.3
    
    @classmethod
    def validate(cls):
        if not cls.PINECONE_API_KEY:
            raise ValueError("PINECONE_API_KEY not found in environment")
        if not cls.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not found in environment")