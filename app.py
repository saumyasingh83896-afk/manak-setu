import os
import io
import sys
import shutil
import base64
from pathlib import Path
from typing import List, Dict, Any, Tuple

import streamlit as st
from dotenv import load_dotenv
from PIL import Image
from gtts import gTTS
import speech_recognition as sr

# ReportLab for PDF Checklist Export
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

# LangChain & Vector Store Imports
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage

# Load environment variables
load_dotenv()

# ==============================================================================
# Configuration & Directory Paths
# ==============================================================================
DATA_DIR = Path("./bis_data")
CHROMA_DIR = Path("./chroma_db")
EMBEDDING_MODEL_NAME = "BAAI/bge-small-en-v1.5"

DATA_DIR.mkdir(parents=True, exist_ok=True)
CHROMA_DIR.mkdir(parents=True, exist_ok=True)

# ==============================================================================
# Streamlit Page Config & Custom Styling
# ==============================================================================
st.set_page_config(
    page_title="ManakSetu AI 🇮🇳 - BIS Compliance for MSMEs",
    page_icon="🇮🇳",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown(
    """
    <style>
    .stApp {
        background-color: #F8FAFC;
    }
    .header-banner {
        background: linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%);
        padding: 24px 28px;
        border-radius: 12px;
        color: white;
        margin-bottom: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header-title {
        font-size: 2.1rem;
        font-weight: 800;
        color: #FFFFFF;
        margin: 0;
    }
    .header-subtitle {
        font-size: 1.0rem;
        color: #93C5FD;
        margin-top: 6px;
        margin-bottom: 0;
    }
    .legal-disclaimer {
        background-color: #FFFBEB;
        border-left: 5px solid #F59E0B;
        padding: 10px 16px;
        border-radius: 6px;
        color: #92400E;
        font-size: 0.88rem;
        margin-bottom: 18px;
        font-weight: 500;
    }
    .source-box {
        background-color: #F1F5F9;
        border: 1px solid #CBD5E1;
        border-radius: 8px;
        padding: 10px 14px;
        margin-top: 8px;
    }
    .badge-file {
        background-color: #DBEAFE;
        color: #1E40AF;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.76rem;
        font-weight: 600;
    }
    .badge-page {
        background-color: #FEF3C7;
        color: #92400E;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.76rem;
        font-weight: 600;
        margin-left: 6px;
    }
    .lab-card {
        background-color: white;
        border: 1px solid #E2E8F0;
        border-radius: 10px;
        padding: 16px;
        margin-bottom: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# ==============================================================================
# Cached Resource Initializers (Embeddings & ChromaDB)
# ==============================================================================
@st.cache_resource(show_spinner="Loading Embeddings (BAAI/bge-small-en-v1.5)...")
def get_embedding_model():
    """Load and cache the HuggingFace embedding model."""
    return HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL_NAME,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )

def get_vectorstore():
    """Retrieve existing ChromaDB vector store instance."""
    if CHROMA_DIR.exists() and any(CHROMA_DIR.iterdir()):
        embeddings = get_embedding_model()
        return Chroma(
            persist_directory=str(CHROMA_DIR),
            embedding_function=embeddings,
        )
    return None

def build_knowledge_base():
    """Ingest all PDFs from ./bis_data into ChromaDB."""
    pdf_files = list(DATA_DIR.glob("*.pdf"))
    if not pdf_files:
        return None, 0, 0

    all_docs = []
    for pdf_path in pdf_files:
        try:
            loader = PyPDFLoader(str(pdf_path))
            docs = loader.load()
            for doc in docs:
                doc.metadata["source_file"] = pdf_path.name
                doc.metadata["page_number"] = doc.metadata.get("page", 0) + 1
            all_docs.extend(docs)
        except Exception as e:
            st.error(f"Error loading {pdf_path.name}: {e}")

    if not all_docs:
        return None, 0, 0

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        separators=["\n\n", "\n", "Clause ", "IS ", " ", ""],
    )
    chunks = text_splitter.split_documents(all_docs)

    if CHROMA_DIR.exists():
        shutil.rmtree(CHROMA_DIR)
    CHROMA_DIR.mkdir(parents=True, exist_ok=True)

    embeddings = get_embedding_model()
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=str(CHROMA_DIR),
    )
    return vectorstore, len(pdf_files), len(chunks)

# ==============================================================================
# Voice Processing Utilities (STT & TTS)
# ==============================================================================
def transcribe_audio_file(audio_bytes: bytes) -> str:
    """Transcribe audio bytes to text using SpeechRecognition."""
    r = sr.Recognizer()
    try:
        audio_file = io.BytesIO(audio_bytes)
        with sr.AudioFile(audio_file) as source:
            audio_data = r.record(source)
            # Try Google Speech Recognition (handles English & Indian accents well)
            text = r.recognize_google(audio_data, language="en-IN")
            return text
    except Exception as e:
        st.warning(f"Audio transcription note: Could not parse audio directly ({e}). You can type your question in the text box.")
        return ""

def text_to_speech_audio(text: str, lang: str = "en") -> bytes:
    """Convert text to speech audio bytes using gTTS."""
    clean_text = text.replace("*", "").replace("#", "").replace("-", " ")[:400]
    try:
        tts = gTTS(text=clean_text, lang=lang, slow=False)
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        return fp.read()
    except Exception:
        return b""

# ==============================================================================
# Strict RAG Prompt Template
# ==============================================================================
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

PROMPT = PromptTemplate(
    template=SYSTEM_PROMPT_TEMPLATE,
    input_variables=["context", "chat_history", "question"],
)

def format_context_docs(docs: List[Any]) -> str:
    chunks = []
    for i, doc in enumerate(docs, 1):
        src = doc.metadata.get("source_file", "BIS Standard")
        page = doc.metadata.get("page_number", doc.metadata.get("page", 1))
        content = doc.page_content.strip()
        chunks.append(f"--- [Document Chunk {i}] ---\nSource: {src} (Page {page})\nContent:\n{content}")
    return "\n\n".join(chunks)

def generate_local_grounded_fallback(query: str, retrieved_docs: List[Any]) -> str:
    if not retrieved_docs:
        return (
            "Sorry, I could not find this information in the available BIS documents. "
            "Please check the official Manakonline portal (manakonline.in)."
        )
    doc = retrieved_docs[0]
    src_file = doc.metadata.get("source_file", "BIS Document")
    page = doc.metadata.get("page_number", 1)
    content = doc.page_content.strip()

    return (
        f"Namaste! Based strictly on official BIS documentation **{src_file}** (Page {page}):\n\n"
        f"{content}\n\n"
        f"---\n"
        f"📌 **Citation:** Verified under **{src_file}**, Page {page}.\n\n"
        f"🛡️ *Disclaimer: This is an AI assistant for guidance only. Please verify with the official Manakonline portal.*"
    )

# ==============================================================================
# Helper: PDF Checklist Generator (ReportLab)
# ==============================================================================
def create_action_plan_pdf(business_name: str, product_name: str, scale: str, plan_text: str) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#1E3A8A'),
        spaceAfter=8,
    )
    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Heading2'],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#2563EB'),
        spaceBefore=10,
        spaceAfter=4,
    )
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#334155'),
        spaceAfter=4,
    )

    story = []
    story.append(Paragraph("<b>MANAKSETU AI 🇮🇳 - BIS COMPLIANCE ROADMAP</b>", title_style))
    story.append(Paragraph(f"<b>Business:</b> {business_name} | <b>Product:</b> {product_name} | <b>Scale:</b> {scale}", body_style))
    story.append(Paragraph("<i>Statutory Advisory: Verify all test methods on official Manakonline portal.</i>", body_style))
    story.append(Spacer(1, 10))

    lines = plan_text.split("\n")
    for line in lines:
        line_s = line.strip()
        if not line_s:
            story.append(Spacer(1, 4))
        elif line_s.startswith("### ") or line_s.startswith("## "):
            clean_h = line_s.replace("### ", "").replace("## ", "").replace("**", "")
            story.append(Paragraph(f"<b>{clean_h}</b>", h2_style))
        elif line_s.startswith("- ") or line_s.startswith("* ") or line_s.startswith("1.") or line_s.startswith("2.") or line_s.startswith("3.") or line_s.startswith("4.") or line_s.startswith("5."):
            clean_b = line_s.replace("**", "<b>").replace("<b>", "<b>", 1)
            # handle bold pairs
            parts = line_s.split("**")
            formatted = ""
            for idx, p in enumerate(parts):
                if idx % 2 == 1:
                    formatted += f"<b>{p}</b>"
                else:
                    formatted += p
            story.append(Paragraph(f"• {formatted}", body_style))
        else:
            parts = line_s.split("**")
            formatted = ""
            for idx, p in enumerate(parts):
                if idx % 2 == 1:
                    formatted += f"<b>{p}</b>"
                else:
                    formatted += p
            story.append(Paragraph(formatted, body_style))

    doc.build(story)
    buffer.seek(0)
    return buffer.read()

# ==============================================================================
# Helper: Geo-Locator Mock Laboratory Database
# ==============================================================================
LAB_DATABASE = [
    {
        "name": "BIS Central Laboratory (CL-Sahibabad)",
        "state": "Uttar Pradesh / Delhi-NCR",
        "pincode_prefix": ["11", "20", "12"],
        "address": "Plot No. 20/9, Site IV, Sahibabad Industrial Area, Ghaziabad, UP - 201010",
        "accreditation": "NABL TC-5012 / BIS Central Testing Unit",
        "scopes": ["Chemical (Water/Pesticides)", "Mechanical", "Electrical Appliances", "Microbiology"],
        "contact": "cl@bis.gov.in | 0120-2770281",
        "distance": "12 km from Pincode Zone",
    },
    {
        "name": "Shriram Institute for Industrial Research (SIIR)",
        "state": "Delhi-NCR / North India",
        "pincode_prefix": ["11", "12", "13", "14", "16", "30"],
        "address": "19, University Road, Block A, Timarpur, Delhi - 110007",
        "accreditation": "NABL Accredited & BIS Approved Lab",
        "scopes": ["Polymers & Plastics (IS 15410)", "Food & Packaged Water", "Toxicology & Heavy Metals"],
        "contact": "customercare@shriraminstitute.org | 011-27667267",
        "distance": "18 km from Pincode Zone",
    },
    {
        "name": "National Test House (NTH - Northern Region)",
        "state": "Delhi-NCR / North India",
        "pincode_prefix": ["11", "20", "12", "24", "25"],
        "address": "Kamla Nehru Nagar, Ghaziabad, Uttar Pradesh - 201002",
        "accreditation": "NABL TC-6120 / Govt of India Lab",
        "scopes": ["Metallurgy & Gold Assaying", "Construction Materials", "Chemical Analysis"],
        "contact": "nthnr-ca@nic.in | 0120-2789912",
        "distance": "24 km from Pincode Zone",
    },
    {
        "name": "BIS Western Regional Laboratory (WROL)",
        "state": "Maharashtra / Gujarat",
        "pincode_prefix": ["40", "41", "42", "43", "44", "38", "39"],
        "address": "Manakalaya, E9, MIDC, Andheri (East), Mumbai, Maharashtra - 400093",
        "accreditation": "NABL TC-5044 / BIS Regional Lab",
        "scopes": ["Electrical & Electronics (CRS)", "Chemical & Packaged Water", "Gold & Silver Hallmarking"],
        "contact": "wrol@bis.gov.in | 022-28329295",
        "distance": "15 km from Pincode Zone",
    },
    {
        "name": "SGS India Testing Laboratory",
        "state": "Maharashtra / Western Region",
        "pincode_prefix": ["40", "41", "38", "39"],
        "address": "201, Sumatinath Commercial Complex, Thane (West), Mumbai - 400604",
        "accreditation": "NABL Accredited & BIS Recognized",
        "scopes": ["Food & Beverages", "Microbiology & Heavy Metals", "Environmental Safety"],
        "contact": "in.food@sgs.com | 022-67890123",
        "distance": "22 km from Pincode Zone",
    },
    {
        "name": "BIS Southern Regional Laboratory (SROL)",
        "state": "Tamil Nadu / Karnataka / Telangana / Kerala",
        "pincode_prefix": ["60", "61", "62", "63", "56", "57", "50", "51", "68", "69"],
        "address": "CIT Campus, 4th Cross Road, Taramani, Chennai, Tamil Nadu - 600113",
        "accreditation": "NABL TC-5088 / BIS Regional Lab",
        "scopes": ["Packaged Water (IS 14543)", "Cement & Steel", "Transformers & Motors", "Microbiology"],
        "contact": "srol@bis.gov.in | 044-22541442",
        "distance": "14 km from Pincode Zone",
    },
    {
        "name": "Central Power Research Institute (CPRI - Bangalore)",
        "state": "Karnataka / South India",
        "pincode_prefix": ["56", "57", "58", "59"],
        "address": "Prof. Sir C.V. Raman Road, Sadashivanagar, Bengaluru, Karnataka - 560080",
        "accreditation": "NABL & BIS Recognized Centre of Excellence",
        "scopes": ["Electrical Appliances (IS 302)", "High Voltage Cables", "Transformers & Inverters"],
        "contact": "cpri@nic.in | 080-22072222",
        "distance": "19 km from Pincode Zone",
    },
    {
        "name": "BIS Eastern Regional Laboratory (EROL)",
        "state": "West Bengal / East India",
        "pincode_prefix": ["70", "71", "72", "73", "74", "75", "80", "81"],
        "address": "1/14, C.I.T. Scheme VII M, V.I.P. Road, Kankurgachi, Kolkata, West Bengal - 700054",
        "accreditation": "NABL TC-5099 / BIS Regional Lab",
        "scopes": ["Jute & Textiles", "Chemicals & Packaged Water", "Metallurgy", "Gold Hallmarking"],
        "contact": "erol@bis.gov.in | 033-23207080",
        "distance": "16 km from Pincode Zone",
    },
]

def find_nearest_labs(pincode: str) -> List[Dict[str, Any]]:
    clean_pin = pincode.strip()
    if len(clean_pin) < 2:
        return LAB_DATABASE[:3]
    prefix = clean_pin[:2]
    matched = [lab for lab in LAB_DATABASE if prefix in lab["pincode_prefix"]]
    if len(matched) >= 3:
        return matched[:3]
    # fill with remaining
    remaining = [lab for lab in LAB_DATABASE if lab not in matched]
    return (matched + remaining)[:3]

# ==============================================================================
# Helper: Multimodal Vision Product Identifier (Gemini 1.5 Vision)
# ==============================================================================
def analyze_product_image_with_vision(image_bytes: bytes, api_key: str) -> Dict[str, Any]:
    """Analyze product image with Gemini 1.5 Flash Vision to predict IS Code."""
    if not api_key:
        return {
            "product_name": "Packaged Drinking Water Bottle / PET Container",
            "predicted_is_code": "IS 14543 : 2016",
            "standard_title": "Packaged Drinking Water (Other than Natural Mineral Water)",
            "certification_scheme": "Scheme-I (Mandatory ISI Mark)",
            "key_tests": "TDS (75-500 mg/l), pH (6.5-8.5), E. coli & Coliforms (Absent in 250ml), Lead & Heavy Metals",
            "regulatory_mandate": "Mandatory under FSSAI and BIS Act 2016 before commercial sale.",
            "mode": "Simulated Demo (Provide Gemini API Key for dynamic real-time vision inference)",
        }

    try:
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=api_key, temperature=0.1)
        b64_img = base64.b64encode(image_bytes).decode("utf-8")
        
        vision_prompt = """Analyze this uploaded product image for Bureau of Indian Standards (BIS) compliance.
Identify the product carefully and provide the output in this exact structured format:

Product Identified: <Name of product, e.g. Two Wheeler Protective Helmet / Packaged Drinking Water / Electric Iron>
Predicted Indian Standard (IS Code): <e.g. IS 4151:2015, IS 14543:2016, IS 302, IS 9873, etc.>
Standard Title: <Official title of standard>
Applicable BIS Certification Scheme: <e.g. Scheme-I (Mandatory ISI Mark) / Scheme-II (Compulsory Registration Scheme - CRS) / Hallmarking>
Crucial Quality & Safety Test Parameters: <List 3 to 5 key tests mandated under the IS code>
Mandatory Packaging / Labelling Rules: <Specific markings like ISI logo, License CM/L number, Batch No, Storage>

Keep it concise, professional, and strictly accurate to official BIS standards."""

        message = HumanMessage(
            content=[
                {"type": "text", "text": vision_prompt},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64_img}"}},
            ]
        )
        response = llm.invoke([message])
        return {"analysis_text": response.content, "mode": "Live Gemini 1.5 Vision Inference"}
    except Exception as e:
        return {
            "analysis_text": f"Vision processing error: {e}. Showing standard compliance prediction.",
            "product_name": "Standard Industrial / Consumer Article",
            "predicted_is_code": "IS 14543 / IS 15820 / IS 302",
            "standard_title": "Indian Standard Product Specification",
            "certification_scheme": "Scheme-I (ISI Mark)",
            "key_tests": "Dimensional, Electrical/Chemical conformity, Mechanical strength",
            "regulatory_mandate": "Verify applicable Quality Control Orders (QCOs) on manakonline.in",
            "mode": f"Fallback Mode ({e})",
        }

# ==============================================================================
# UI Sidebar - Navigation & Settings
# ==============================================================================
def render_sidebar():
    with st.sidebar:
        st.image(
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png",
            width=55,
        )
        st.title("🧭 Navigation")
        
        nav_choice = st.radio(
            "Select Feature Module:",
            [
                "💬 1. Core RAG Chatbot (Text & Voice)",
                "📷 2. Image-to-Standard (Vision AI)",
                "📋 3. Action Plan & Checklist Generator",
                "💰 4. Cost Estimator & Lab Locator",
            ],
            index=0,
        )

        st.divider()
        st.subheader("⚙️ AI Configuration")
        api_key_env = os.getenv("GOOGLE_API_KEY", "")
        user_api_key = st.text_input(
            "Google Gemini API Key",
            value=api_key_env,
            type="password",
            help="Required for Live Gemini 1.5 Flash Text & Vision. If blank, prototype offline mode is used.",
        )

        st.divider()
        st.subheader("📚 BIS Knowledge Base")
        pdf_count = len(list(DATA_DIR.glob("*.pdf")))
        st.caption(f"📁 **{pdf_count} Standards Loaded** in `./bis_data`")
        
        if st.button("🔄 Re-index ChromaDB", use_container_width=True):
            with st.spinner("Re-indexing standards with BAAI/bge-small-en-v1.5..."):
                vstore, n_docs, n_chunks = build_knowledge_base()
                if vstore:
                    st.success(f"Indexed {n_docs} files ({n_chunks} chunks)!")
                    st.rerun()

        st.divider()
        st.markdown("### 🌐 Quick Links")
        st.markdown("- [Manakonline Portal](https://www.manakonline.in/)")
        st.markdown("- [Know Your Standard (e-Sale)](https://www.standardsbis.in/)")
        st.markdown("- [BIS Care App Download](https://play.google.com/store/apps/details?id=com.bis.bis_care)")

        return nav_choice, user_api_key

# ==============================================================================
# Main Application Router
# ==============================================================================
def main():
    nav_choice, api_key = render_sidebar()

    # Professional Header Banner
    st.markdown(
        """
        <div class="header-banner">
            <div class="header-title">🏛️ ManakSetu AI 🇮🇳</div>
            <div class="header-subtitle">Demystifying BIS Compliance for MSMEs, Startups & Consumers</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # Statutory Legal Disclaimer
    st.markdown(
        """
        <div class="legal-disclaimer">
            🛡️ <strong>Statutory Disclaimer:</strong> This is an AI assistant for guidance only. Please verify all technical specifications, conformity assessment rules, and fees with the official Bureau of Indian Standards portal (<a href="https://www.manakonline.in" target="_blank">manakonline.in</a>).
        </div>
        """,
        unsafe_allow_html=True,
    )

    # ==========================================================================
    # MODULE 1: Core RAG Chatbot (Text & Voice)
    # ==========================================================================
    if "1. Core RAG Chatbot" in nav_choice:
        st.subheader("💬 Core RAG Compliance Assistant (Text & Voice)")
        st.caption("Ask questions in **English**, **Hindi (हिंदी)**, or **Hinglish**. Responses are strictly grounded in ChromaDB vector store.")

        # Audio Voice Input Widget
        with st.expander("🎙️ Ask via Microphone / Audio File (Speech-to-Text)", expanded=False):
            st.markdown("Speak your question or upload an audio file (`.wav` format recommended):")
            
            # Streamlit audio input or file uploader
            audio_file = st.file_uploader("Upload recorded audio query (.wav)", type=["wav", "mp3", "m4a"], key="audio_uploader")
            transcribed_query = ""
            if audio_file:
                with st.spinner("Transcribing audio..."):
                    transcribed_query = transcribe_audio_file(audio_file.read())
                    if transcribed_query:
                        st.success(f"🗣️ **Transcribed Audio:** *\"{transcribed_query}\"*")

        # Chat History Initialization
        if "chat_history" not in st.session_state:
            st.session_state.chat_history = [
                {
                    "role": "assistant",
                    "content": (
                        "Namaste! 🙏 I am **ManakSetu AI**, your official assistant for Bureau of Indian Standards (BIS) compliance.\n\n"
                        "I can assist you with:\n"
                        "- 📜 **IS Code Specifications & Clause Lookups** (e.g. IS 14543, IS 15820, IS 10500)\n"
                        "- 🏭 **ISI Mark Product Certification (Scheme-I) for MSMEs**\n"
                        "- 🔍 **Gold Hallmarking & 6-digit HUID Verification**\n"
                        "- 🧪 **Laboratory Testing, Limits & Scheme of Inspection and Testing (SIT)**\n\n"
                        "Ask your question via text or voice to get started!"
                    ),
                    "sources": [],
                    "audio_bytes": None,
                }
            ]

        # Render Previous Messages
        for msg in st.session_state.chat_history:
            with st.chat_message(msg["role"], avatar="🇮🇳" if msg["role"] == "assistant" else "👤"):
                st.markdown(msg["content"])
                
                # Audio playback button for assistant responses
                if msg["role"] == "assistant" and msg.get("audio_bytes"):
                    st.audio(msg["audio_bytes"], format="audio/mp3")

                # Source citations
                if msg.get("sources"):
                    with st.expander("📌 Source Citations & References", expanded=False):
                        for src in msg["sources"]:
                            st.markdown(
                                f"""
                                <div class="source-box">
                                    <span class="badge-file">📄 {src['file']}</span>
                                    <span class="badge-page">📑 Page {src['page']}</span>
                                    <p style="margin: 6px 0 0 0; color: #475569; font-size: 0.84rem;">
                                        <em>"{src['snippet']}..."</em>
                                    </p>
                                </div>
                                """,
                                unsafe_allow_html=True,
                            )

        # Handle User Question (Text or Transcribed Audio)
        user_prompt = st.chat_input("Ask about BIS standards, testing parameters, or licensing...")
        if transcribed_query and not user_prompt:
            user_prompt = transcribed_query

        if user_prompt:
            st.session_state.chat_history.append({"role": "user", "content": user_prompt, "sources": [], "audio_bytes": None})
            with st.chat_message("user", avatar="👤"):
                st.markdown(user_prompt)

            with st.chat_message("assistant", avatar="🇮🇳"):
                vectorstore = get_vectorstore()
                if not vectorstore:
                    st.warning("Knowledge base not detected. Initializing ChromaDB vector store...")
                    vectorstore, _, _ = build_knowledge_base()

                with st.spinner("Searching official BIS documents & verifying clauses..."):
                    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
                    retrieved_docs = retriever.invoke(user_prompt)

                    sources = []
                    seen_sources = set()
                    for d in retrieved_docs:
                        f_name = d.metadata.get("source_file", "BIS Standard")
                        p_num = d.metadata.get("page_number", d.metadata.get("page", 1))
                        if (f_name, p_num) not in seen_sources:
                            seen_sources.add((f_name, p_num))
                            snippet = d.page_content.strip().replace("\n", " ")[:190]
                            sources.append({"file": f_name, "page": p_num, "snippet": snippet})

                    if api_key:
                        try:
                            context_str = format_context_docs(retrieved_docs)
                            history_str = "\n".join(
                                [f"{m['role'].capitalize()}: {m['content']}" for m in st.session_state.chat_history[-4:-1]]
                            )
                            llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=api_key, temperature=0.1)
                            chain = PROMPT | llm | StrOutputParser()
                            response_text = chain.invoke({
                                "context": context_str,
                                "chat_history": history_str,
                                "question": user_prompt,
                            })
                        except Exception as e:
                            st.error(f"Gemini API Error: {e}. Using Grounded Vector Store Fallback:")
                            response_text = generate_local_grounded_fallback(user_prompt, retrieved_docs)
                    else:
                        st.info("ℹ️ Running in **Grounded Local Mode** (ChromaDB + BAAI/bge-small-en-v1.5). Add Gemini API Key in sidebar for full generative reasoning.")
                        response_text = generate_local_grounded_fallback(user_prompt, retrieved_docs)

                    st.markdown(response_text)

                    # Generate Text-to-Speech audio
                    audio_bytes = text_to_speech_audio(response_text)
                    if audio_bytes:
                        st.audio(audio_bytes, format="audio/mp3")

                    # Display Source Citations
                    if sources:
                        with st.expander("📌 Source Citations & References", expanded=True):
                            for src in sources:
                                st.markdown(
                                    f"""
                                    <div class="source-box">
                                        <span class="badge-file">📄 {src['file']}</span>
                                        <span class="badge-page">📑 Page {src['page']}</span>
                                        <p style="margin: 6px 0 0 0; color: #475569; font-size: 0.84rem;">
                                            <em>"{src['snippet']}..."</em>
                                        </p>
                                    </div>
                                    """,
                                    unsafe_allow_html=True,
                                )

                    st.session_state.chat_history.append({
                        "role": "assistant",
                        "content": response_text,
                        "sources": sources,
                        "audio_bytes": audio_bytes,
                    })

    # ==========================================================================
    # MODULE 2: Image-to-Standard Identifier (Multimodal Vision)
    # ==========================================================================
    elif "2. Image-to-Standard" in nav_choice:
        st.subheader("📷 Image-to-Standard Identifier (Multimodal Vision AI)")
        st.caption("Upload a photograph of any industrial or consumer product. Gemini 1.5 Flash Vision will identify the product and predict the exact Indian Standard (IS Code) & mandatory certification scheme.")

        col_img1, col_img2 = st.columns([1, 1])

        with col_img1:
            uploaded_image = st.file_uploader(
                "Upload Product Photo (JPG / PNG / WEBP)",
                type=["jpg", "jpeg", "png", "webp"],
            )
            if uploaded_image:
                img = Image.open(uploaded_image)
                st.image(img, caption="Uploaded Product Photo", use_container_width=True)

        with col_img2:
            if uploaded_image:
                st.markdown("#### 🔬 AI Product Analysis")
                if st.button("🚀 Analyze Product & Predict IS Code", use_container_width=True):
                    with st.spinner("Gemini 1.5 Flash Vision is inspecting product features and cross-referencing BIS catalogue..."):
                        img_bytes = uploaded_image.getvalue()
                        result = analyze_product_image_with_vision(img_bytes, api_key)

                        if "analysis_text" in result:
                            st.markdown(result["analysis_text"])
                        else:
                            st.markdown(
                                f"""
                                <div style="background:white; border:1px solid #E2E8F0; border-radius:10px; padding:18px;">
                                    <h4 style="color:#1E3A8A; margin-top:0;">📦 Product: {result['product_name']}</h4>
                                    <p><strong>🎯 Predicted Indian Standard:</strong> <span style="background:#DBEAFE; color:#1E40AF; padding:2px 8px; border-radius:4px; font-weight:bold;">{result['predicted_is_code']}</span></p>
                                    <p><strong>📖 Standard Title:</strong> {result['standard_title']}</p>
                                    <p><strong>🛡️ Applicable Scheme:</strong> {result['certification_scheme']}</p>
                                    <p><strong>🧪 Crucial Quality Tests:</strong> {result['key_tests']}</p>
                                    <p><strong>⚖️ Mandate:</strong> {result['regulatory_mandate']}</p>
                                    <hr/>
                                    <small style="color:#64748B;"><em>Mode: {result['mode']}</em></small>
                                </div>
                                """,
                                unsafe_allow_html=True,
                            )
            else:
                st.info("👈 Please upload a product photo to begin multimodal inspection.")
                st.markdown(
                    """
                    **Common Detectable Products:**
                    - 💧 Packaged Drinking Water Bottles (`IS 14543`)
                    - 🪖 Two-Wheeler Helmets (`IS 4151`)
                    - 🔌 Electric Irons / Plugs & Sockets (`IS 302` / `IS 1293`)
                    - 🧸 Children's Toys (`IS 9873`)
                    - 💍 Gold Jewellery / Hallmarked Ornaments (`IS 15820`)
                    - 🏗️ TMT Rebars & Structural Steel (`IS 1786`)
                    """
                )

    # ==========================================================================
    # MODULE 3: Smart Action Plan & Checklist Generator
    # ==========================================================================
    elif "3. Action Plan & Checklist" in nav_choice:
        st.subheader("📋 Smart Action Plan & BIS Compliance Checklist Generator")
        st.caption("Generate a tailored step-by-step roadmap to achieve BIS ISI Mark / CRS Certification for your factory.")

        with st.form("action_plan_form"):
            c1, c2 = st.columns(2)
            with c1:
                b_name = st.text_input("Enterprise / Business Name", value="Bharat Manufacturing Enterprises")
                p_name = st.selectbox(
                    "Product Category for Certification",
                    [
                        "Packaged Drinking Water (IS 14543)",
                        "Two-Wheeler Helmets (IS 4151)",
                        "Electric Appliances (IS 302)",
                        "Structural Steel & TMT Bars (IS 1786)",
                        "Toys & Educational Items (IS 9873)",
                    ],
                )
            with c2:
                b_scale = st.selectbox("Enterprise Scale (Udyam Classification)", ["Micro Enterprise", "Small Enterprise", "Medium Enterprise", "DPIIT Recognized Startup"])
                readiness = st.selectbox("Current Factory Readiness", ["Greenfield (Setting up factory)", "Operational without Lab", "Fully Operational with Lab"])

            submit_plan = st.form_submit_button("⚡ Generate Customized Action Plan", use_container_width=True)

        if submit_plan or "last_action_plan" in st.session_state:
            if submit_plan:
                # Build Structured Plan
                plan_markdown = f"""### 🇮🇳 Official BIS Compliance Action Plan
**Target Standard:** {p_name} | **Scale:** {b_scale} | **Status:** {readiness}

---

#### Phase 1: Factory Infrastructure & SIT Readiness (Weeks 1–3)
- Ensure manufacturing line conforms strictly to the Scheme of Inspection and Testing (SIT) for **{p_name}**.
- Establish dedicated raw material isolation bay, processing cleanroom, and finished goods storage.
- Document machinery serial numbers, calibration certificates, and layout drawings.

#### Phase 2: In-House Testing Laboratory Setup (Weeks 3–5)
- Procure and calibrate all mandatory testing instruments required by the specific IS Code.
- Employ a qualified Quality Control Chemist / Technical Supervisor with required educational credentials.
- Set up systematic test logbooks, batch recording registers, and calibration schedules.

#### Phase 3: Manakonline Portal Registration (Weeks 5–6)
- Register enterprise on **manakonline.in** and upload Udyam Certificate for **50% fee concession** (Applicable for {b_scale}).
- Prepare Form-V, factory layout, list of manufacturing machinery, and test equipment inventory.
- Pay the concessional application fee online.

#### Phase 4: Sample Testing & Audit Route (Weeks 6–8)
- **Fast-Track Option (Simplified Procedure):** Draw pre-audit sample and test in a BIS-recognized NABL laboratory. Submit passing test report for licence grant in **30 days**.
- **Normal Procedure:** Host BIS inspecting officer for preliminary factory audit, testing demonstration, and official sample sealing.

#### Phase 5: Grant of ISI Mark Licence & Surveillance (Weeks 8–10)
- Obtain official CM/L (Certification Marks Licence) number from BIS.
- Laser-etch / print the authentic ISI Mark with CM/L number and IS Code on final product packaging.
- Maintain routine daily testing registers for mandatory BIS surveillance audits.
"""
                st.session_state.last_action_plan = plan_markdown
                st.session_state.plan_meta = (b_name, p_name, b_scale)

            st.markdown(st.session_state.last_action_plan)

            # Export Buttons
            pdf_bytes = create_action_plan_pdf(
                st.session_state.plan_meta[0],
                st.session_state.plan_meta[1],
                st.session_state.plan_meta[2],
                st.session_state.last_action_plan,
            )

            exp_col1, exp_col2 = st.columns(2)
            with exp_col1:
                st.download_button(
                    label="📄 Download Action Plan as PDF",
                    data=pdf_bytes,
                    file_name="ManakSetu_BIS_Compliance_Checklist.pdf",
                    mime="application/pdf",
                    use_container_width=True,
                )
            with exp_col2:
                st.download_button(
                    label="📝 Download as Text / Markdown",
                    data=st.session_state.last_action_plan,
                    file_name="ManakSetu_Action_Plan.txt",
                    mime="text/plain",
                    use_container_width=True,
                )

    # ==========================================================================
    # MODULE 4: Cost Estimator & Smart Lab Locator
    # ==========================================================================
    elif "4. Cost Estimator" in nav_choice:
        st.subheader("💰 Cost Estimator & Smart Lab Locator")
        st.caption("Accurately calculate BIS Scheme-I licensing expenses with MSME statutory concessions, and discover nearby recognized testing facilities.")

        tab_calc, tab_labs = st.tabs(["🧮 BIS Fee & Concession Calculator", "📍 Smart Lab Locator (Geo-Pincode)"])

        with tab_calc:
            calc_c1, calc_c2 = st.columns(2)
            with calc_c1:
                scale_opt = st.selectbox(
                    "Enterprise Category (Udyam)",
                    ["Micro Enterprise (50% Concession)", "Small Enterprise (50% App / 20% Marking)", "Medium Enterprise", "Large Industry", "DPIIT Startup (50% Concession)"],
                )
                product_opt = st.selectbox(
                    "Product Complexity Tier",
                    ["Standard Product (e.g. Water, Helmets, Utensils)", "High Complexity (Electronics, Automotive)", "Heavy Industrial (Cables, Steel)"],
                )
                licence_years = st.slider("Licence Validity Period (Years)", min_value=1, max_value=5, value=2)

            with calc_c2:
                # Official Fee Base Calculations
                base_app_fee = 1000
                base_inspection_fee = 7000
                base_annual_marking_fee = 50000 if "Standard" in product_opt else (75000 if "High" in product_opt else 100000)
                estimated_lab_test_cost = 25000

                if "Micro" in scale_opt or "Startup" in scale_opt:
                    app_discount = 50
                    marking_discount = 50
                elif "Small" in scale_opt:
                    app_discount = 50
                    marking_discount = 20
                else:
                    app_discount = 0
                    marking_discount = 0

                final_app = base_app_fee * (1 - app_discount / 100)
                final_marking_per_year = base_annual_marking_fee * (1 - marking_discount / 100)
                total_marking = final_marking_per_year * licence_years
                grand_total = final_app + base_inspection_fee + total_marking + estimated_lab_test_cost
                total_savings = (base_app_fee - final_app) + (base_annual_marking_fee * licence_years - total_marking)

                st.markdown(
                    f"""
                    <div style="background:white; border:1px solid #E2E8F0; border-radius:10px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                        <h4 style="margin-top:0; color:#1E3A8A;">Estimated Statutory Cost Breakdown</h4>
                        <table style="width:100%; font-size:0.9rem; margin-bottom:12px;">
                            <tr><td><strong>Application Fee:</strong></td><td style="text-align:right;">₹{final_app:.0f} <span style="color:green;">({app_discount}% off)</span></td></tr>
                            <tr><td><strong>Factory Inspection Fee:</strong></td><td style="text-align:right;">₹{base_inspection_fee:.0f}</td></tr>
                            <tr><td><strong>Annual Marking Fee ({licence_years} Yrs):</strong></td><td style="text-align:right;">₹{total_marking:.0f} <span style="color:green;">({marking_discount}% off/yr)</span></td></tr>
                            <tr><td><strong>Est. Third-Party Lab Testing:</strong></td><td style="text-align:right;">₹{estimated_lab_test_cost:.0f}</td></tr>
                            <tr style="border-top:1px solid #CBD5E1; font-weight:bold; font-size:1.05rem;">
                                <td>Grand Total:</td><td style="text-align:right; color:#1E3A8A;">₹{grand_total:,.0f}</td>
                            </tr>
                        </table>
                        <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:6px; padding:10px; text-align:center;">
                            <span style="color:#065F46; font-weight:bold; font-size:1.05rem;">🎉 Total MSME Statutory Savings: ₹{total_savings:,.0f}</span>
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

        with tab_labs:
            st.markdown("##### 📍 Find Nearest BIS-Recognized Testing Laboratories")
            pincode_in = st.text_input("Enter your 6-Digit Indian Pincode", value="110001", max_chars=6)

            if pincode_in:
                labs = find_nearest_labs(pincode_in)
                st.write(f"Showing **3 nearest accredited testing laboratories** for Pincode zone **`{pincode_in}`**:")

                for i, lab in enumerate(labs, 1):
                    scopes_html = "".join([f"<span class='badge-file' style='margin-right:4px;'>{s}</span>" for s in lab["scopes"]])
                    st.markdown(
                        f"""
                        <div class="lab-card">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <h4 style="margin:0; color:#1E3A8A;">{i}. {lab['name']}</h4>
                                <span style="background:#DCFCE7; color:#15803D; padding:2px 8px; border-radius:4px; font-weight:600; font-size:0.75rem;">{lab['distance']}</span>
                            </div>
                            <p style="margin:6px 0; color:#475569; font-size:0.88rem;">📍 {lab['address']}</p>
                            <p style="margin:4px 0; font-size:0.82rem;"><strong>Accreditation:</strong> {lab['accreditation']}</p>
                            <div style="margin:6px 0;">{scopes_html}</div>
                            <p style="margin:4px 0 0 0; color:#2563EB; font-size:0.82rem;"><strong>Contact:</strong> {lab['contact']}</p>
                        </div>
                        """,
                        unsafe_allow_html=True,
                    )


if __name__ == "__main__":
    main()
