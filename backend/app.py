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
    
    Expected JSON body:
    {
        "question": "What is the punishment for theft under IPC?",
        "top_k": 5,
        "namespaces": ["ipc"],  // optional
        "include_sources": true
    }
    """
    try:
        # Validate request
        data = request.get_json()
        
        if not data or 'question' not in data:
            return jsonify({"error": "Missing 'question' in request body"}), 400
        
        question = data['question'].strip()
        
        if len(question) < 5:
            return jsonify({"error": "Question must be at least 5 characters long"}), 400
        
        if len(question) > 500:
            return jsonify({"error": "Question must be less than 500 characters"}), 400
        
        # Extract parameters
        top_k = data.get('top_k', Config.TOP_K)
        namespaces = data.get('namespaces', None)
        include_sources = data.get('include_sources', True)
        
        # Validate top_k
        if not isinstance(top_k, int) or top_k < 1 or top_k > 10:
            top_k = Config.TOP_K
        
        # 1. Generate query embedding
        print(f"Query: {question}")
        query_embedding = embedding_service.embed_query(question)
        
        # 2. Retrieve relevant documents
        print(f"Retrieving from namespaces: {namespaces or 'all'}")
        retrieved_docs = retrieval_service.retrieve(
            query_embedding=query_embedding,
            top_k=top_k,
            namespaces=namespaces,
            score_threshold=Config.SCORE_THRESHOLD
        )
        
        print(f"Retrieved {len(retrieved_docs)} documents")
        
        # Handle no results
        if not retrieved_docs:
            return jsonify({
                "question": question,
                "answer": "I couldn't find relevant information in the legal documents to answer your question. Please try rephrasing or asking about a different topic.",
                "sources": [],
                "metadata": {
                    "retrieved_count": 0
                }
            }), 200
        
        # 3. Generate answer using LLM
        print("Generating answer...")
        answer = llm_service.generate_answer(question, retrieved_docs)
        
        # 4. Prepare sources
        sources = []
        if include_sources:
            for doc in retrieved_docs:
                metadata = doc.get('metadata', {})
                sources.append({
                    "act_name": metadata.get('act_name', 'Unknown'),
                    "section_number": metadata.get('section_number', 'N/A'),
                    "text_preview": metadata.get('text_preview', ''),
                    "score": doc.get('score', 0.0),
                    "namespace": doc.get('namespace', '')
                })
        
        print("Response generated successfully")
        
        return jsonify({
            "question": question,
            "answer": answer,
            "sources": sources,
            "metadata": {
                "retrieved_count": len(retrieved_docs),
                "model_used": Config.GEMINI_MODEL
            }
        }), 200
    
    except Exception as e:
        print(f"Error in /api/query: {e}")
        traceback.print_exc()
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@app.route('/api/retrieve', methods=['POST'])
def retrieve_only():
    """
    Retrieve relevant documents without LLM generation (for testing/debugging)
    
    Expected JSON body:
    {
        "question": "What is theft?",
        "top_k": 5,
        "namespaces": ["ipc"]  // optional
    }
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
            score_threshold=Config.SCORE_THRESHOLD
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
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=Config.DEBUG
    )