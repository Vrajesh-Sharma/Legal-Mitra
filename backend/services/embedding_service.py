from typing import List
from sentence_transformers import SentenceTransformer
import numpy as np
import re

class EmbeddingService:
    _instance = None
    _model = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._model is None:
            from config import Config
            print(f"Loading embedding model: {Config.EMBEDDING_MODEL}")
            self._model = SentenceTransformer(Config.EMBEDDING_MODEL)
            print("Embedding model loaded")
    
    def preprocess_query(self, text: str) -> str:
        """Enhanced query preprocessing"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Expand common abbreviations
        abbreviations = {
            'ipc': 'Indian Penal Code',
            'crpc': 'Code of Criminal Procedure',
            'bns': 'Bharatiya Nyaya Sanhita',
            'sec': 'section',
            'sect': 'section',
        }
        
        text_lower = text.lower()
        for abbr, full in abbreviations.items():
            if abbr in text_lower:
                text = text + " " + full
        
        return text
    
    def embed_query(self, text: str) -> List[float]:
        """Generate normalized embedding for query"""
        # Preprocess query
        processed_text = self.preprocess_query(text)
        
        # Generate embedding
        embedding = self._model.encode(processed_text, convert_to_tensor=False)
        
        # Normalize
        embedding = embedding / np.linalg.norm(embedding)
        
        return embedding.tolist()
    
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate normalized embeddings for batch of texts"""
        embeddings = self._model.encode(texts, convert_to_tensor=False, show_progress_bar=False)
        
        # Normalize
        norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
        normalized = embeddings / norms
        
        return normalized.tolist()