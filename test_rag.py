import os
import sys
from pathlib import Path
from dotenv import load_dotenv

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

load_dotenv()

from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

CHROMA_DIR = Path("./chroma_db")
EMBEDDING_MODEL_NAME = "BAAI/bge-m3"

SYSTEM_PROMPT_TEMPLATE = """You are ManakSetu AI, an expert official assistant for the Bureau of Indian Standards (BIS). Your primary goal is to help Indian MSMEs, startups, and consumers understand manufacturing standards, certification processes, HUID, and laboratory testing guidelines.

Strict Operational Rules:

1. Zero Hallucination: You must base your answers ONLY on the retrieved context provided below. If the answer is not present in the context, explicitly state:
"Sorry, I could not find this information in the available BIS documents. Please check the official Manakonline portal."
Do not guess or invent rules, standards, fees, or testing procedures.

2. Mandatory Citations: For every claim, rule, or requirement you mention, you must cite the specific 'IS Code' (e.g., IS 14543) and the specific 'Clause/Page' from the context whenever available.

3. Language & Tone: Be highly professional, empathetic, and encouraging. MSMEs often find compliance stressful, so keep your language simple and accessible. If the user asks in Hindi or Hinglish, respond in the same language.

4. Disclaimer: Conclude with a brief reminder that ManakSetu AI provides guidance only, and final legal compliance must be verified through official BIS authorities.

5. Identity: Never break character. You are ManakSetu AI, bridging the gap between complex standards and ease of business.

----------------
Retrieved BIS Standards Context:
{context}
----------------
Conversation History:
{chat_history}
----------------
User Question:
{question}

Response (with specific IS code citations, clause/page references, and clear step-by-step guidance):"""

def run_test_query(query: str):
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("[!] No GOOGLE_API_KEY found in .env. Skipping LLM generation test.")
        return

    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL_NAME,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )
    vectorstore = Chroma(
        persist_directory=str(CHROMA_DIR),
        embedding_function=embeddings,
    )
    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
    docs = retriever.invoke(query)
    
    formatted_chunks = []
    for i, doc in enumerate(docs, 1):
        source = doc.metadata.get("source_file", "Unknown BIS Document")
        page = doc.metadata.get("page_number", doc.metadata.get("page", 1))
        content = doc.page_content.strip()
        formatted_chunks.append(f"--- [Chunk {i}] (Source: {source}, Page {page}) ---\n{content}")
    context_str = "\n\n".join(formatted_chunks)

    prompt = PromptTemplate(
        template=SYSTEM_PROMPT_TEMPLATE,
        input_variables=["context", "chat_history", "question"]
    )
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=api_key, temperature=0.1)
    chain = prompt | llm | StrOutputParser()
    
    print(f"\nUser Query: {query}")
    response = chain.invoke({"context": context_str, "chat_history": "", "question": query})
    print("\nManakSetu AI Response:")
    print("-" * 50)
    print(response)
    print("-" * 50)

if __name__ == "__main__":
    test_q = "What is the fee concession for micro enterprises applying for BIS ISI mark under Scheme-I?"
    run_test_query(test_q)
