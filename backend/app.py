import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from dotenv import load_dotenv
from services.embedding_service import EmbeddingService
from services.retrieval_service import RetrievalService
from services.llm_service import LLMService
import traceback

load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)
Config.validate()

# Enable CORS
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize services (singletons)
embedding_service = EmbeddingService()
retrieval_service = RetrievalService()
llm_service = LLMService()

print("\n" + "="*60)
print("Legal Mitra RAG Backend - Ready!")
print("="*60 + "\n")

@app.route('/', methods=['GET'])
def home():
    """Root endpoint"""
    return jsonify({
        "message": "Legal Mitra RAG API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "namespaces": "/namespaces",
            "query": "/api/query",
            "retrieve": "/api/retrieve"
        }
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        stats = retrieval_service.get_index_stats()
        
        return jsonify({
            "status": "healthy",
            "version": "1.0.0",
            "services": {
                "embedding_model": Config.EMBEDDING_MODEL,
                "pinecone": "connected",
                "gemini": Config.GEMINI_MODEL,
                "total_vectors": stats.get('total_vector_count', 0)
            }
        }), 200
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500


@app.route('/namespaces', methods=['GET'])
def get_namespaces():
    """Get available legal document namespaces"""
    try:
        # Get namespaces list
        namespaces = retrieval_service.get_available_namespaces()
        
        # Get full stats
        stats = retrieval_service.get_index_stats()
        namespaces_details = stats.get('namespaces', {})
        
        return jsonify({
            "total_namespaces": len(namespaces),
            "namespaces": namespaces,
            "details": namespaces_details
        }), 200
        
    except Exception as e:
        print(f"Error in /namespaces: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": str(e),
            "total_namespaces": 0,
            "namespaces": []
        }), 200

@app.route('/api/query', methods=['POST'])
def query_legal_documents():
    """
    Main endpoint to query legal documents and get AI-generated answers
    """
    try:
        # Validate request
        data = request.get_json()
        
        if not data or 'question' not in data:
            return jsonify({"error": "Missing 'question' in request body"}), 400
        
        question = data['question'].strip()
        
        if len(question) < 3:  # Reduced from 5
            return jsonify({"error": "Question must be at least 3 characters long"}), 400
        
        if len(question) > 500:
            return jsonify({"error": "Question must be less than 500 characters"}), 400
        
        # Extract parameters with improved defaults
        top_k = data.get('top_k', Config.TOP_K)
        namespaces = data.get('namespaces', None)
        include_sources = data.get('include_sources', True)
        
        # Validate top_k
        if not isinstance(top_k, int) or top_k < 1 or top_k > 20:  # Increased max
            top_k = Config.TOP_K
        
        print(f"\n{'='*60}")
        print(f"📝 Query: {question}")
        print(f"🔍 Top K: {top_k}")
        print(f"📚 Namespaces: {namespaces or 'all'}")
        print(f"{'='*60}")
        
        # 1. Generate query embedding
        query_embedding = embedding_service.embed_query(question)
        
        # 2. Retrieve relevant documents
        retrieved_docs = retrieval_service.retrieve(
            query_embedding=query_embedding,
            top_k=top_k,
            namespaces=namespaces,
            score_threshold=Config.SCORE_THRESHOLD,
            query_text=question
        )
        
        print(f"✅ Retrieved {len(retrieved_docs)} documents")
        
        # Handle no results with more helpful message
        if not retrieved_docs:
            print("⚠️  No relevant documents found")
            return jsonify({
                "question": question,
                "answer": "I couldn't find relevant information in the legal documents to answer your question. Please try:\n- Rephrasing your question\n- Using more specific legal terms\n- Mentioning specific acts or sections if known\n- Asking about a different legal topic",
                "sources": [],
                "metadata": {
                    "retrieved_count": 0,
                    "threshold_used": Config.SCORE_THRESHOLD
                }
            }), 200
        
        # 3. Generate answer using LLM
        print("🤖 Generating answer with Gemini...")
        answer = llm_service.generate_answer(question, retrieved_docs)
        
        # 4. Prepare sources with extended preview
        sources = []
        if include_sources:
            for doc in retrieved_docs:
                metadata = doc.get('metadata', {})
                sources.append({
                    "act_name": metadata.get('act_name', 'Unknown'),
                    "section_number": metadata.get('section_number', 'N/A'),
                    "text_preview": metadata.get('text_preview', ''),
                    "score": round(doc.get('score', 0.0), 4),
                    "namespace": doc.get('namespace', '')
                })
        
        print("✅ Response generated successfully\n")
        
        return jsonify({
            "question": question,
            "answer": answer,
            "sources": sources,
            "metadata": {
                "retrieved_count": len(retrieved_docs),
                "model_used": Config.GEMINI_MODEL,
                "threshold_used": Config.SCORE_THRESHOLD,
                "namespaces_searched": namespaces or "all"
            }
        }), 200
    
    except Exception as e:
        print(f"❌ Error in /api/query: {e}")
        traceback.print_exc()
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@app.route('/api/retrieve', methods=['POST'])
def retrieve_only():
    """
    Retrieve relevant documents without LLM generation (for testing/debugging)
    """
    try:
        data = request.get_json()
        
        if not data or 'question' not in data:
            return jsonify({"error": "Missing 'question' in request body"}), 400
        
        question = data['question'].strip()
        top_k = data.get('top_k', Config.TOP_K)
        namespaces = data.get('namespaces', None)
        
        # Generate embedding
        query_embedding = embedding_service.embed_query(question)
        
        # Retrieve documents
        retrieved_docs = retrieval_service.retrieve(
            query_embedding=query_embedding,
            top_k=top_k,
            namespaces=namespaces,
            score_threshold=Config.SCORE_THRESHOLD,
            query_text=question  # ADD THIS
        )
        
        return jsonify({
            "question": question,
            "retrieved_count": len(retrieved_docs),
            "documents": retrieved_docs
        }), 200
    
    except Exception as e:
        print(f"Error in /api/retrieve: {e}")
        return jsonify({"error": str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({"error": "Method not allowed"}), 405


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(
        host='0.0.0.0',
        port=port,
        debug=Config.DEBUG
    )