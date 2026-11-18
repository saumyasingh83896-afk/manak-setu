# ManakSetu AI 🇮🇳 - Your Bridge to BIS Compliance

**ManakSetu AI** is an AI-powered compliance assistant designed to help Indian MSMEs, startups, and consumers navigate **Bureau of Indian Standards (BIS)** regulations, IS Codes, Hallmarking/HUID, and ISI Mark certification processes with **Zero Hallucination** through Strict Retrieval-Augmented Generation (RAG).

---

## 🚀 Key Features

1. **Strict Zero-Hallucination RAG**: Only responds using retrieved official BIS standard documents. If information is not in the context, it guides users directly to official BIS portals (`manakonline.in`).
2. **Mandatory Citations**: Returns exact IS Codes, Clauses, Document names, and 1-indexed Page numbers with context snippets.
3. **Multilingual Embeddings**: Uses open-source `BAAI/bge-m3` via HuggingFace for multilingual semantic search (English, Hindi, Hinglish).
4. **LLM Integration**: Powered by Google Gemini (`gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-2.0-flash` via `langchain-google-genai`).
5. **Interactive UI**: Clean Streamlit dashboard with built-in PDF uploader, 1-click vectorstore re-indexer, source citation accordions, and statutory disclaimers.

---

## 📁 Project Structure

```text
manaksetu-ai/
├── app.py                  # Main Streamlit Application & RAG Pipeline
├── requirements.txt        # Python Dependencies
├── .env.example            # Environment Variable Template
├── .env                    # Your Local Environment Keys (Not committed)
├── bis_data/               # Directory for BIS Standard PDFs (e.g., IS 14543.pdf)
└── chroma_db/              # Local Chroma Vector Database (Auto-generated)
```

---

## 🛠️ Quickstart Guide

### 1. Create and Activate a Virtual Environment

```bash
python -m venv venv

# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1

# On Linux / macOS:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure API Key

Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Add your Google Gemini API Key in `.env`:
```env
GOOGLE_API_KEY="your-google-gemini-api-key-here"
```
*(Alternatively, enter it directly in the Streamlit sidebar at runtime).*

### 4. Add BIS PDF Standards

Place your official BIS PDF files (e.g., `IS_14543_Packaged_Drinking_Water.pdf`, `IS_10500_Drinking_Water.pdf`, `BIS_Hallmarking_Guidelines.pdf`) into the `./bis_data` directory, or use the drag-and-drop uploader in the Streamlit sidebar.

### 5. Launch the Application

```bash
streamlit run app.py
```

Click the **🔄 Build / Re-index Knowledge Base** button in the sidebar to index your documents, and start asking compliance questions!
