# Legal Mitra

## Project Overview

Legal Mitra is an advanced AI-powered legal intelligence platform designed to democratize access to the Indian legal system. It leverages Generative AI and Retrieval-Augmented Generation (RAG) to provide accurate, citation-backed legal information to citizens, streamlining the understanding of complex legal statutes like the Bharatiya Nyaya Sanhita (BNS), Indian Penal Code (IPC), and the Constitution of India.

## Problem Statement

The Indian legal framework is extensive and often inaccessible to the general public due to complex legal terminology and procedural intricacies. This creates a significant barrier for individuals seeking to understand their rights or navigate legal challenges without immediate professional assistance.

## Project Workflow

The application operates on a sophisticated pipeline that ensures accuracy and relevance:

1.  **Data Ingestion**: Official legal documents and statutes are processed and indexed into a vector database. This preserves the semantic meaning of sections and clauses rather than relying on simple keyword matching.

2.  **Query Processing**: When a user submits a legal query, the system converts it into a vector embedding to understand the specific intent and context behind the question.

3.  **Semantic Retrieval**: The system searches the vector database to retrieve the most relevant legal sections and case laws that pertain specifically to the user's situation.

4.  **Context-Aware Generation**: The retrieved legal context is passed to a Large Language Model (LLM). The model generates a response based strictly on this provided context to minimize hallucinations and ensure factual accuracy.

5.  **Structured Output**: The final response is presented to the user in a clear format containing the specific Legal Provision, a Simplified Explanation, and Actionable Next Steps.

## Key Features

*   **Citation-Backed Responses**: All answers are grounded in official legal texts, strictly referencing specific Acts and Sections.
*   **Simplification of Legal Jargon**: Transforms complex legal language into plain English for better comprehension by laypersons.
*   **Actionable Guidance**: Provides users with concrete steps to take, such as filing specific forms or sending legal notices.
*   **Real-Time Retrieval**: Accesses a dynamic database of legal knowledge to ensure answers are based on relevant statutes.

## Technology Stack

*   **Frontend**: React.js, Tailwind CSS
*   **Backend**: Python, Flask
*   **AI Architecture**: Retrieval-Augmented Generation (RAG)
*   **Vector Database**: Pinecone
*   **LLM Integration**: Google Gemini
*   **Embeddings**: Sentence-Transformers

## Local Setup

1.  Clone the repository to your local machine.
2.  Navigate to the `backend` directory.
3.  Create a virtual environment and activate it.
4.  Install dependencies using `pip install -r requirements.txt`.
5.  Configure the `.env` file with your Pinecone and Gemini API keys.
6.  Start the backend server using `python -m flask run --port 8000`.
7.  Open a new terminal and navigate to the `frontend` directory.
8.  Install dependencies using `npm install`.
9.  Start the frontend application using `npm run dev`.

## Future Roadmap

*   Integration of multilingual support for regional Indian languages.
*   Implementation of live video consultation features.
*   Document analysis capabilities for automated legal notice summarization.
