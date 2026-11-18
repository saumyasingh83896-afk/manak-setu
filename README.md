# ManakSetu AI 🇮🇳 - Your Bridge to BIS Compliance

ManakSetu AI is an AI-powered compliance assistant designed to help Indian MSMEs, startups, and consumers navigate Bureau of Indian Standards (BIS) regulations, IS Codes, Hallmarking/HUID, and ISI Mark certification processes using Retrieval-Augmented Generation (RAG).

## 🚀 Key Features

1. **Strict RAG:** Answers using retrieved BIS standard documents.
2. **Mandatory Citations:** Provides IS Codes, clauses, document names, and page numbers.
3. **Multilingual Embeddings:** Uses BAAI/bge-m3 for English, Hindi, and Hinglish.
4. **LLM Integration:** Powered by Google Gemini.
5. **Interactive UI:** Streamlit dashboard with PDF uploader and knowledge-base re-indexing.

## 📁 Project Structure

```text
manaksetu-ai/
├── app.py
├── requirements.txt
├── .env.example
├── .env
├── bis_data/
└── chroma_db/
```

## 🛠️ Quickstart Guide

### 1. Create Virtual Environment

```bash
python -m venv venv
```

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure API Key

Create a `.env` file using `.env.example` and add:

```env
GOOGLE_API_KEY="your-google-gemini-api-key-here"
```

### 4. Add BIS PDF Standards

Place official BIS PDF documents inside the `bis_data` folder.

### 5. Run the Application

```bash
streamlit run app.py
```

Build or re-index the knowledge base from the application sidebar before asking compliance questions.
