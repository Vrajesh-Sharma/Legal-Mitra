from typing import List
from sentence_transformers import SentenceTransformer
import numpy as np

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
    
    def embed_query(self, text: str) -> List[float]:
        embedding = self._model.encode(text, convert_to_tensor=False)
        embedding = embedding / np.linalg.norm(embedding)
        return embedding.tolist()
    
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        embeddings = self._model.encode(texts, convert_to_tensor=False, show_progress_bar=False)
        norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
        normalized = embeddings / norms
        return normalized.tolist()