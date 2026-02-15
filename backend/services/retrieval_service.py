from typing import List, Optional, Dict, Any
from pinecone import Pinecone, Index
from collections import defaultdict
import re

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
    
    def _extract_section_number(self, query: str) -> Optional[str]:
        """Extract section/article number from query if present"""
        patterns = [
            r'(?:section|article|sec)\s+(\d{1,3}[A-Z]?)',
            r'\b(\d{1,3}[A-Z]?)\s+(?:ipc|bns|crpc|article)',
            r'(?:ipc|bns|crpc)\s+(\d{1,3}[A-Z]?)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, query.lower())
            if match:
                return match.group(1).upper()
        
        return None
    
    def _detect_mentioned_acts(self, query: str) -> List[str]:
        """
        Detect which legal acts are mentioned in the query
        Returns list of namespace identifiers
        """
        query_lower = query.lower()
        mentioned_namespaces = []
        
        # Act detection patterns
        act_patterns = {
            'ipc': [r'\bipc\b', r'indian penal code'],
            'bns': [r'\bbns\b', r'bharatiya nyaya sanhita', r'bhartiya nyaya sanhita'],
            'crpc': [r'\bcrpc\b', r'criminal procedure code', r'code of criminal procedure'],
            'iea': [r'\biea\b', r'evidence act', r'indian evidence act'],
            'constitution': [r'\bconstitution\b', r'article \d+'],
            'hma': [r'\bhma\b', r'hindu marriage act'],
            'cpa': [r'\bcpa\b', r'consumer protection act'],
            'ica': [r'\bica\b', r'contract act', r'indian contract act'],
        }
        
        for namespace, patterns in act_patterns.items():
            if any(re.search(pattern, query_lower) for pattern in patterns):
                mentioned_namespaces.append(namespace)
        
        return mentioned_namespaces
    
    def retrieve(
        self,
        query_embedding: List[float],
        top_k: int = 10,
        namespaces: Optional[List[str]] = None,
        score_threshold: float = 0.3,
        query_text: str = ""
    ) -> List[Dict[str, Any]]:
        """
        Retrieve relevant documents from Pinecone with query-aware ranking
        """
        all_results = []
        
        # Extract specific section number if mentioned
        target_section = self._extract_section_number(query_text)
        if target_section:
            print(f"🎯 Detected target section: {target_section}")
        
        # Detect mentioned acts to determine which namespaces to search
        if query_text and not namespaces:
            detected_namespaces = self._detect_mentioned_acts(query_text)
            if detected_namespaces:
                namespaces = detected_namespaces
                print(f"🔍 Query mentions specific acts: {namespaces}")
        
        # Get all namespaces if none specified and none detected
        if namespaces is None or len(namespaces) == 0:
            namespaces = self.get_available_namespaces()
            print(f"🔍 Searching all namespaces: {namespaces}")
        
        if not namespaces:
            print("❌ No namespaces available")
            return []
        
        # Query each namespace
        for namespace in namespaces:
            try:
                print(f"🔎 Querying namespace: {namespace}")
                response = self._index.query(
                    vector=query_embedding,
                    top_k=top_k * 2,  # Get more results initially
                    include_metadata=True,
                    namespace=namespace
                )
                
                print(f"  ✓ Found {len(response.matches)} matches in {namespace}")
                
                for match in response.matches:
                    if match.score >= score_threshold:
                        result = {
                            "id": match.id,
                            "score": float(match.score),
                            "namespace": namespace,
                            "metadata": dict(match.metadata) if match.metadata else {},
                            "is_target_section": False
                        }
                        
                        # Mark if this is the target section
                        if target_section:
                            section_num = match.metadata.get('section_number', '')
                            if section_num == target_section:
                                result["is_target_section"] = True
                                result["score"] = result["score"] * 1.2  # Boost score
                                print(f"    🎯 EXACT MATCH: Section {section_num} in {namespace.upper()} (boosted score: {result['score']:.4f})")
                        
                        all_results.append(result)
                        print(f"    ✓ Score: {match.score:.4f} | Section: {match.metadata.get('section_number', 'N/A')}")
                    else:
                        print(f"    ✗ Score: {match.score:.4f} (below threshold)")
            
            except Exception as e:
                print(f"⚠️  Error querying namespace {namespace}: {e}")
                continue
        
        # Apply smart ranking based on query type
        if target_section:
            # Specific section query: prioritize exact match
            ranked_results = self._rank_for_specific_section(all_results, target_section, top_k)
        else:
            # General query: promote diversity
            ranked_results = self._diversify_results(all_results, top_k)
        
        print(f"📊 Total results: {len(ranked_results)} (after smart ranking)")
        
        return ranked_results[:top_k]
    
    def _rank_for_specific_section(
        self, 
        results: List[Dict], 
        target_section: str, 
        top_k: int
    ) -> List[Dict]:
        """
        Ranking for queries about a specific section:
        1. Target section from all acts (IPC 302, BNS 302, etc.)
        2. Related sections (376A, 376B if asking about 376)
        3. Other high-scoring sections
        """
        if not results:
            return []
        
        target_results = []
        related_results = []
        other_results = []
        
        for result in results:
            section_num = result['metadata'].get('section_number', '')
            
            if section_num == target_section:
                target_results.append(result)
            elif section_num.startswith(target_section):
                # Related sections (376A, 376B for 376)
                related_results.append(result)
            else:
                other_results.append(result)
        
        # Sort each group by score
        target_results.sort(key=lambda x: x['score'], reverse=True)
        related_results.sort(key=lambda x: x['score'], reverse=True)
        other_results.sort(key=lambda x: x['score'], reverse=True)
        
        # Combine: target first, then related, then others
        ranked = target_results + related_results + other_results
        
        # Show breakdown by namespace for target sections
        if target_results:
            namespaces_found = {}
            for result in target_results:
                ns = result['namespace']
                act_name = result['metadata'].get('act_short_name', ns.upper())
                namespaces_found[ns] = act_name
            
            print(f"  📌 Section {target_section} found in: {', '.join(namespaces_found.values())}")
        
        print(f"  📊 Ranking: {len(target_results)} target, {len(related_results)} related, {len(other_results)} others")
        
        return ranked[:top_k]
    
    def _diversify_results(self, results: List[Dict], top_k: int) -> List[Dict]:
        """
        Re-rank results to promote diversity across sections/acts
        """
        if not results:
            return []
        
        # Sort by score first
        results.sort(key=lambda x: x['score'], reverse=True)
        
        # Track seen sections to promote diversity
        seen_sections = set()
        diverse_results = []
        remaining_results = []
        
        # First pass: get one result per section
        for result in results:
            section_key = (
                result['metadata'].get('act_name', ''),
                result['metadata'].get('section_number', '')
            )
            
            if section_key not in seen_sections:
                diverse_results.append(result)
                seen_sections.add(section_key)
                
                if len(diverse_results) >= top_k:
                    break
            else:
                remaining_results.append(result)
        
        # Second pass: fill remaining slots with highest scores
        if len(diverse_results) < top_k:
            diverse_results.extend(remaining_results[:top_k - len(diverse_results)])
        
        # Final sort by score
        diverse_results.sort(key=lambda x: x['score'], reverse=True)
        
        return diverse_results
    
    def get_available_namespaces(self) -> List[str]:
        """Get list of available namespaces"""
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
            print(f"📚 Available namespaces: {namespace_list}")
            return namespace_list
            
        except Exception as e:
            print(f"⚠️  Error getting namespaces: {e}")
            return ['ipc', 'bns', 'crpc', 'iea', 'constitution', 'hma', 'cpa', 'ica']
    
    def get_index_stats(self) -> Dict[str, Any]:
        """Get Pinecone index statistics"""
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
            print(f"❌ Error getting index stats: {e}")
            return {"error": str(e)}