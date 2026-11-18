import os
import sys
from pathlib import Path
from typing import List, Optional
from dotenv import load_dotenv

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Initialize FastAPI App
app = FastAPI(
    title="ManakSetu AI Backend API",
    description="REST API for Bureau of Indian Standards (BIS) RAG Assistant & Verification",
    version="1.0.0"
)

# Enable CORS for Vite frontend (http://localhost:5173, http://127.0.0.1:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Data Models -----------------
class ChatRequest(BaseModel):
    query: str
    language: Optional[str] = "en"
    chat_history: Optional[str] = ""

class CitationItem(BaseModel):
    id: str
    isNumber: str
    title: str
    clause: str
    documentType: str
    pageNumber: Optional[int] = 1
    snippet: str
    mandatoryStatus: Optional[str] = "Mandatory (QCO Active)"
    portalUrl: Optional[str] = "https://manakonline.in"

class ChatResponse(BaseModel):
    text: str
    hindiText: Optional[str] = None
    citations: List[CitationItem]
    suggestedFollowUps: List[str]
    intent: str
    confidenceScore: float
    schemeBadge: Optional[str] = "BIS AI Intelligence Engine"
    source: str = "fastapi_rag_backend"

class HuidRequest(BaseModel):
    huid: str

class IsiRequest(BaseModel):
    cmlNumber: str

class CrsRequest(BaseModel):
    rNumber: str

# ----------------- Mock Verification DB -----------------
MOCK_HUID_DB = {
    "AH9821": {
        "huid": "AH9821",
        "isValid": True,
        "jewellerName": "Tanishq (Titan Company Ltd), Connaught Place",
        "jewellerRegNo": "HM/JL-0891234",
        "ahcName": "Delhi Assaying & Hallmarking Centre, Okhla (AHC-011)",
        "ahcNo": "AHC-9921",
        "articleType": "Gold Bangle (Pair)",
        "purity": "22K916",
        "hallmarkDate": "14 Jan 2026",
        "status": "VERIFIED_ACTIVE",
        "message": "Valid BIS Hallmark. Verified as 22 Karat (91.6% purity) genuine gold artefact."
    },
    "MN4029": {
        "huid": "MN4029",
        "isValid": True,
        "jewellerName": "Kalyan Jewellers, T. Nagar, Chennai",
        "jewellerRegNo": "HM/JL-0439120",
        "ahcName": "Madras Precious Metals Assaying Centre (AHC-044)",
        "ahcNo": "AHC-4412",
        "articleType": "Gold Necklace & Pendant",
        "purity": "22K916",
        "hallmarkDate": "02 Feb 2026",
        "status": "VERIFIED_ACTIVE",
        "message": "Valid BIS Hallmark. Verified as 22 Karat (91.6% purity) genuine gold artefact."
    },
    "DL7712": {
        "huid": "DL7712",
        "isValid": True,
        "jewellerName": "Malabar Gold & Diamonds, Bandra West, Mumbai",
        "jewellerRegNo": "HM/JL-0228190",
        "ahcName": "Mumbai Hallmark Assayers Pvt Ltd (AHC-022)",
        "ahcNo": "AHC-2290",
        "articleType": "24K Investment Gold Coin (10 Grams)",
        "purity": "24K995",
        "hallmarkDate": "28 Dec 2025",
        "status": "VERIFIED_ACTIVE",
        "message": "Valid BIS Hallmark. Verified as 24 Karat (99.5% purity) bullion-grade gold coin."
    }
}

MOCK_ISI_DB = {
    "CM/L-8400123": {
        "cmlNumber": "CM/L-8400123",
        "isValid": True,
        "brandName": "Bisleri Aqua Pure",
        "licenseeName": "Bisleri International Pvt Ltd",
        "factoryAddress": "Plot 12, Industrial Area, Phase II, Noida, Uttar Pradesh - 201305",
        "standardNumber": "IS 14543: 2024",
        "productName": "Packaged Drinking Water (20L Jar & 1L Bottle)",
        "validUpto": "31 Dec 2027",
        "status": "OPERATIVE",
        "message": "Valid & Operative License. The manufacturer is certified to apply standard ISI Mark."
    },
    "CM/L-9128304": {
        "cmlNumber": "CM/L-9128304",
        "isValid": True,
        "brandName": "Steelbird Hi-Tech Helmets",
        "licenseeName": "Steelbird Hi-Tech India Ltd",
        "factoryAddress": "Industrial Focal Point, Baddi, Solan, Himachal Pradesh - 173205",
        "standardNumber": "IS 4151: 2020",
        "productName": "Protective Helmets for Two Wheeler Riders",
        "validUpto": "15 Aug 2027",
        "status": "OPERATIVE",
        "message": "Valid & Operative License. Product meets mandatory safety impact standards."
    }
}

# ----------------- RAG Engine Setup -----------------
CHROMA_DIR = Path("./chroma_db")
EMBEDDING_MODEL_NAME = "BAAI/bge-m3"

SYSTEM_PROMPT = """You are ManakSetu AI, an expert official assistant for the Bureau of Indian Standards (BIS). Your primary goal is to help Indian MSMEs, startups, and consumers understand manufacturing standards, certification processes, HUID, and laboratory testing guidelines.

Strict Operational Rules:
1. Zero Hallucination: Base your answers ONLY on the retrieved BIS context below. If not present, state that and guide user to manakonline.in.
2. Mandatory Citations: For every claim, cite the specific 'IS Code' and 'Clause/Page'.
3. Language: Keep tone professional, empathetic, and encouraging. If asked in Hindi, respond in Hindi.
4. Disclaimer: Conclude with a statutory reminder that final compliance must be verified with official BIS authorities.

Retrieved Context:
{context}

Chat History:
{chat_history}

User Question:
{question}
"""

def execute_rag(query: str, chat_history: str = "") -> Optional[dict]:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return None

    try:
        from langchain_community.vectorstores import Chroma
        from langchain_huggingface import HuggingFaceEmbeddings
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.prompts import PromptTemplate
        from langchain_core.output_parsers import StrOutputParser

        if not CHROMA_DIR.exists():
            return None

        embeddings = HuggingFaceEmbeddings(
            model_name=EMBEDDING_MODEL_NAME,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )
        vectorstore = Chroma(
            persist_directory=str(CHROMA_DIR),
            embedding_function=embeddings,
        )
        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
        docs = retriever.invoke(query)

        formatted_chunks = []
        citations = []
        for i, doc in enumerate(docs, 1):
            source = doc.metadata.get("source_file", "IS Standard Document")
            page = doc.metadata.get("page_number", doc.metadata.get("page", 1))
            content = doc.page_content.strip()
            formatted_chunks.append(f"--- [Chunk {i}] (Source: {source}, Page {page}) ---\n{content}")
            
            citations.append({
                "id": f"cit-rag-{i}",
                "isNumber": source.replace(".pdf", "").replace("_", " "),
                "title": f"BIS Standard Document - {source}",
                "clause": f"Section / Page {page}",
                "documentType": "Indian Standard",
                "pageNumber": page,
                "snippet": content[:220] + "...",
                "mandatoryStatus": "Mandatory (QCO Active)",
                "portalUrl": "https://manakonline.in"
            })

        context_str = "\n\n".join(formatted_chunks)

        prompt = PromptTemplate(
            template=SYSTEM_PROMPT,
            input_variables=["context", "chat_history", "question"]
        )
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=api_key, temperature=0.1)
        chain = prompt | llm | StrOutputParser()
        llm_response = chain.invoke({"context": context_str, "chat_history": chat_history, "question": query})

        return {
            "text": llm_response,
            "citations": citations,
            "confidenceScore": 0.98,
            "intent": "Strict Vector RAG (LangChain + Gemini)"
        }
    except Exception as e:
        print(f"[!] RAG Pipeline Error: {e}")
        return None

# ----------------- API Endpoints -----------------

@app.get("/api/health")
def health_check():
    has_gemini = bool(os.getenv("GOOGLE_API_KEY"))
    has_chroma = CHROMA_DIR.exists()
    return {
        "status": "healthy",
        "service": "ManakSetu AI Backend",
        "geminiApiKeyConfigured": has_gemini,
        "chromaDbFound": has_chroma
    }

@app.post("/api/chat", response_model=ChatResponse)
def handle_chat(req: ChatRequest):
    query = req.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    # 1. Try real ChromaDB + Gemini LangChain RAG pipeline if configured
    rag_result = execute_rag(query, req.chat_history or "")
    if rag_result:
        return ChatResponse(
            text=rag_result["text"],
            citations=[CitationItem(**c) for c in rag_result["citations"]],
            suggestedFollowUps=[
                "What is the fee concession for micro enterprises under this standard?",
                "What laboratory tests are required before licensing?",
                "How do I submit Form-V on Manakonline?"
            ],
            intent=rag_result["intent"],
            confidenceScore=rag_result["confidenceScore"],
            schemeBadge="Gemini 1.5 RAG • Live VectorDB",
            source="python_langchain_gemini"
        )

    # 2. Rule-based intelligent fallback matching
    q_lower = query.lower()
    if "led" in q_lower or "bulb" in q_lower:
        return ChatResponse(
            text="""For **Self-Ballasted LED Bulbs** in India, the mandatory Indian Standard is **IS 16102 (Part 1 & Part 2): 2012**.

### Key Compliance Requirements:
1. **Applicable Scheme**: **CRS (Compulsory Registration Scheme - Scheme-II)** under MeitY & BIS.
2. **Safety Standard**: **IS 16102 (Part 1)** covers insulation resistance (minimum 4 MΩ at 500V DC) and electric strength (1.5 kV for 1 min).
3. **Performance Standard**: **IS 16102 (Part 2)** mandates luminous efficacy and lumen maintenance (>95% after 1,000 hrs).
4. **No Factory Audit**: Registration is granted online on [crsbis.in](https://www.crsbis.in) based on an accredited lab test report.""",
            citations=[
                CitationItem(
                    id="cit-led-1",
                    isNumber="IS 16102 (Part 1): 2012",
                    title="Self-Ballasted LED Lamps - Safety Requirements",
                    clause="Clause 6.3 & Clause 8.1",
                    documentType="Indian Standard",
                    pageNumber=8,
                    snippet="Insulation resistance shall not be less than 4 MΩ. Marking must include rated wattage and BIS CRS R-number.",
                    mandatoryStatus="Mandatory (QCO Active)",
                    portalUrl="https://www.crsbis.in"
                )
            ],
            suggestedFollowUps=[
                "What is the testing fee for LED bulb CRS registration?",
                "Can I group multiple LED bulb wattages under a single CRS series?",
                "Find accredited LED testing labs in India"
            ],
            intent="Standard & Scheme Lookup",
            confidenceScore=0.96,
            schemeBadge="CRS (Scheme-II) - Mandatory",
            source="python_fastapi_server"
        )
    elif "water" in q_lower or "food" in q_lower or "isi" in q_lower:
        return ChatResponse(
            text="""To obtain an **ISI Mark (Scheme-I)** license for food/water products like **Packaged Drinking Water (IS 14543: 2024)**:

### 5-Step ISI Mark Certification Flow:
1. **In-House Lab**: Set up laboratory with testing apparatus for daily batch microbiological testing.
2. **Online Form-V**: Apply on [manakonline.in](https://manakonline.in) with machinery layout and calibration certificates.
3. **Factory Audit**: BIS auditor inspects manufacturing premises and draws samples.
4. **Independent Lab Testing**: Samples tested for microbes, heavy metals, and pesticides.
5. **Grant of CM/L**: BIS issues CM/L license number with 50% concession for Micro enterprises.""",
            citations=[
                CitationItem(
                    id="cit-water-1",
                    isNumber="IS 14543: 2024",
                    title="Packaged Drinking Water Specification",
                    clause="Clause 8.1 & 8.2 (In-House Lab)",
                    documentType="Indian Standard",
                    pageNumber=15,
                    snippet="The factory shall maintain an in-house laboratory equipped to conduct routine daily microbiological tests as per SIT.",
                    mandatoryStatus="Mandatory (QCO Active)",
                    portalUrl="https://manakonline.in"
                )
            ],
            suggestedFollowUps=[
                "What is the total fee and timeline for obtaining an ISI mark for water plants?",
                "What are the testing parameters under IS 14543?",
                "Verify an ISI license CM/L number"
            ],
            intent="Certification Guidance",
            confidenceScore=0.95,
            schemeBadge="ISI Mark (Scheme-I) - Mandatory",
            source="python_fastapi_server"
        )
    else:
        return ChatResponse(
            text=f"""I processed your query: **"{query}"** against BIS regulatory databases.

### General BIS Compliance Guidance:
1. **Search Standard**: Check [knowyourstandards.bis.gov.in](https://knowyourstandards.bis.gov.in) to locate your product's IS code.
2. **Select Scheme**: Choose between **Scheme-I (ISI Mark)** for physical safety/food, **Scheme-II (CRS)** for electronics, or **Hallmarking** for gold/silver.
3. **MSME Concession**: Micro and Small enterprises receive **50% concession** on application and marking fees.""",
            citations=[
                CitationItem(
                    id="cit-gen-1",
                    isNumber="BIS Act, 2016",
                    title="Statutory Standards Framework",
                    clause="Section 16 (Conformity Assessment)",
                    documentType="Gazette Notification",
                    pageNumber=1,
                    snippet="BIS is authorized to notify mandatory standards in public interest.",
                    mandatoryStatus="Mandatory (QCO Active)",
                    portalUrl="https://manakonline.in"
                )
            ],
            suggestedFollowUps=[
                "What standard applies to LED bulbs?",
                "How do I get ISI certification for my food product?",
                "Is my 22K gold jewellery hallmark valid?",
                "What documents are needed for a CRS license?"
            ],
            intent="General BIS Regulatory Guidance",
            confidenceScore=0.90,
            schemeBadge="BIS Statutory Guidance",
            source="python_fastapi_server"
        )

@app.post("/api/verify/huid")
def verify_huid(req: HuidRequest):
    code = req.huid.strip().toUpperCase() if hasattr(req.huid.strip(), 'toUpperCase') else req.huid.strip().upper()
    if code in MOCK_HUID_DB:
        return MOCK_HUID_DB[code]
    return {
        "huid": code,
        "isValid": False,
        "status": "NOT_FOUND",
        "message": "No active hallmarking record found in central BIS portal."
    }

@app.post("/api/verify/isi")
def verify_isi(req: IsiRequest):
    code = req.cmlNumber.strip()
    if code in MOCK_ISI_DB:
        return MOCK_ISI_DB[code]
    return {
        "cmlNumber": code,
        "isValid": False,
        "status": "NOT_FOUND",
        "message": "CM/L license number not found in active BIS registry."
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting ManakSetu AI FastAPI Backend on http://127.0.0.1:8000 ...")
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
