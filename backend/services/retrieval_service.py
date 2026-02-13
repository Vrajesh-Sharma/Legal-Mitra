from typing import List, Optional, Dict, Any
from pinecone import Pinecone, Index


class RetrievalService:    
    _instance = None
    _pinecone_client = None
    _index = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if self._pinecone_client is None:
            from config import Config
            print(f"Connecting to Pinecone index: {Config.INDEX_NAME}")
            self._pinecone_client = Pinecone(api_key=Config.PINECONE_API_KEY)
            self._index = self._pinecone_client.Index(Config.INDEX_NAME)
            print("Pinecone connected")
    
    def retrieve(
        self,
        query_embedding: List[float],
        top_k: int = 5,
        namespaces: Optional[List[str]] = None,
        score_threshold: float = 0.7
    ) -> List[Dict[str, Any]]:
        """
        Retrieve relevant documents from Pinecone
        
        Args:
            query_embedding: Query vector
            top_k: Number of results per namespace
            namespaces: List of namespaces to search (None = all)
            score_threshold: Minimum similarity score
            
        Returns:
            List of retrieved documents with metadata
        """
        all_results = []
        
        if namespaces is None or len(namespaces) == 0:
            namespaces = self.get_available_namespaces()
            print(f"🔍 No namespaces specified, searching: {namespaces}")
        
        if not namespaces:
            print("No namespaces available")
            return []
        
        for namespace in namespaces:
            try:
                print(f"Querying namespace: {namespace}")
                response = self._index.query(
                    vector=query_embedding,
                    top_k=top_k,
                    include_metadata=True,
                    namespace=namespace
                )
                
                print(f"  Found {len(response.matches)} matches in {namespace}")
                
                for match in response.matches:
                    if match.score >= score_threshold:
                        print(f" Match score: {match.score:.4f} (above threshold {score_threshold})")
                        result = {
                            "id": match.id,
                            "score": float(match.score),
                            "namespace": namespace,
                            "metadata": dict(match.metadata) if match.metadata else {}
                        }
                        all_results.append(result)
                    else:
                        print(f" Match score: {match.score:.4f} (below threshold {score_threshold})")
            
            except Exception as e:
                print(f"⚠️ Error querying namespace {namespace}: {e}")
                import traceback
                traceback.print_exc()
                continue
        
        print(f"Total results after filtering: {len(all_results)}")
        
        all_results.sort(key=lambda x: x['score'], reverse=True)
        return all_results[:top_k]
    
    def get_available_namespaces(self) -> List[str]:
        try:
            stats = self._index.describe_index_stats()
            
            if hasattr(stats, 'namespaces'):
                namespaces_dict = stats.namespaces
            elif isinstance(stats, dict):
                namespaces_dict = stats.get('namespaces', {})
            else:
                stats_dict = dict(stats)
                namespaces_dict = stats_dict.get('namespaces', {})
            
            namespace_list = list(namespaces_dict.keys()) if namespaces_dict else []
            print(f"Available namespaces: {namespace_list}")
            return namespace_list
            
        except Exception as e:
            print(f"Error getting namespaces: {e}")
            import traceback
            traceback.print_exc()
            return ['ipc', 'bns', 'crpc', 'iea', 'constitution', 'hma', 'cpa', 'ica']
    
    def get_index_stats(self) -> Dict[str, Any]:
        try:
            stats = self._index.describe_index_stats()
            if hasattr(stats, 'to_dict'):
                return stats.to_dict()
            elif isinstance(stats, dict):
                return stats
            else:
                result = {}
                if hasattr(stats, 'total_vector_count'):
                    result['total_vector_count'] = stats.total_vector_count
                if hasattr(stats, 'namespaces'):
                    result['namespaces'] = dict(stats.namespaces)
                return result
                
        except Exception as e:
            print(f"Error getting index stats: {e}")
            return {"error": str(e)}