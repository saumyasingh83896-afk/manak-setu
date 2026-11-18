import os
import sys
import shutil
from pathlib import Path
from dotenv import load_dotenv

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

DATA_DIR = Path("./bis_data")
CHROMA_DIR = Path("./chroma_db")
EMBEDDING_MODEL_NAME = "BAAI/bge-m3"

def build_knowledge_base():
    print("=" * 60)
    print("ManakSetu AI - Knowledge Base Indexing Engine")
    print("=" * 60)
    
    # 1. Verify BIS documents
    pdf_files = list(DATA_DIR.glob("*.pdf"))
    if not pdf_files:
        print(f"[!] No PDF files found in {DATA_DIR.absolute()}")
        return False

    print(f"[+] Found {len(pdf_files)} BIS Standard PDF(s):")
    for f in pdf_files:
        print(f"  * {f.name} ({round(f.stat().st_size / 1024, 2)} KB)")

    # 2. Clean previous database if rebuilding
    if CHROMA_DIR.exists():
        print(f"[+] Clearing existing index in {CHROMA_DIR}...")
        shutil.rmtree(CHROMA_DIR)
    CHROMA_DIR.mkdir(parents=True, exist_ok=True)

    # 3. Load PDF Documents & attach 1-indexed page metadata
    print("\n[+] Extracting and parsing document pages...")
    all_docs = []
    for pdf_path in pdf_files:
        try:
            loader = PyPDFLoader(str(pdf_path))
            docs = loader.load()
            for doc in docs:
                doc.metadata["source_file"] = pdf_path.name
                doc.metadata["page_number"] = doc.metadata.get("page", 0) + 1
            all_docs.extend(docs)
            print(f"  [✓] Loaded {len(docs)} page(s) from {pdf_path.name}")
        except Exception as e:
            print(f"  [X] Error loading {pdf_path.name}: {e}")

    if not all_docs:
        print("[!] No documents extracted.")
        return False

    # 4. Text Chunking
    print("\n[+] Chunking text with RecursiveCharacterTextSplitter...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        separators=["\n\n", "\n", "Clause ", "IS ", " ", ""],
    )
    chunks = text_splitter.split_documents(all_docs)
    print(f"  [✓] Generated {len(chunks)} contextual chunks across all standards.")

    # 5. Multilingual Embeddings & Vector Store Generation
    print(f"\n[+] Initializing Multilingual Embeddings ({EMBEDDING_MODEL_NAME})...")
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL_NAME,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )

    print(f"[+] Ingesting chunks into ChromaDB at {CHROMA_DIR}...")
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=str(CHROMA_DIR),
    )
    print(f"[✓] Vector index successfully built and persisted!")

    # 6. Test Retrieval Verification
    print("\n[+] Testing Retrieval Verification...")
    test_queries = [
        "What are the TDS and microbiological limits for packaged drinking water under IS 14543?",
        "What is HUID and how many digits does it have in gold hallmarking?",
        "What concessions do MSMEs get for BIS Scheme-I licence?",
    ]

    retriever = vectorstore.as_retriever(search_kwargs={"k": 2})
    for q in test_queries:
        print(f"\nQuery: '{q}'")
        results = retriever.invoke(q)
        for i, res in enumerate(results, 1):
            src = res.metadata.get("source_file")
            page = res.metadata.get("page_number")
            preview = res.page_content.replace("\n", " ")[:120]
            print(f"  [Match {i}] File: {src} | Page: {page} | Snippet: {preview}...")

    print("\n[✓] Knowledge Base is ready for ManakSetu AI!")
    return True

if __name__ == "__main__":
    build_knowledge_base()
