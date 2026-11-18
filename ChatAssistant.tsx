import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Sparkles, 
  FileText, 
  ChevronRight, 
  RotateCcw, 
  Download, 
  ThumbsUp, 
  ThumbsDown, 
  ShieldCheck, 
  Info,
  HelpCircle,
  ExternalLink,
  Bot,
  User,
  Paperclip
} from 'lucide-react';
import { ChatMessage, SourceCitation, LanguageCode } from '../types';
import { queryRagEngine } from '../services/rag_engine';
import { SourceModal } from './SourceModal';
import { UI_TRANSLATIONS } from '../data/translations';

interface ChatAssistantProps {
  language: LanguageCode;
  initialQuery?: string;
  onClearInitialQuery?: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-msg',
    sender: 'assistant',
    timestamp: 'Just now',
    text: `Namaste! I am **ManakSetu AI (मानक सेतु)** — the conversational intelligence assistant for the **Bureau of Indian Standards (BIS)**. 

I provide **100% source-backed, clause-grounded guidance** for:
- 💡 Finding applicable **Indian Standards (IS Codes)** for your product
- 📜 Navigating **ISI Mark (Scheme-I)**, **CRS (Scheme-II)** & **FMCS (Foreign)** certification
- 💎 Verifying **Gold & Silver Hallmarking (HUID)** purity
- 🔬 Finding accredited **Testing Laboratories** across India
- 💰 Claiming **50% MSME fee concessions** & startup incentives

How may I assist your business or compliance journey today?`,
    hindiText: `नमस्ते! मैं मानक सेतु AI हूँ — भारतीय मानक ब्यूरो (BIS) का आधिकारिक सहायक। मैं भारतीय मानकों, ISI मार्क प्रमाणन, गोल्ड हॉलमार्किंग (HUID) और मान्यता प्राप्त प्रयोगशालाओं के लिए स्रोत-सत्यापित सहायता प्रदान करता हूँ। मैं आज आपकी क्या सहायता कर सकता हूँ?`,
    citations: [
      {
        id: 'cit-welcome-1',
        isNumber: 'BIS Act, 2016',
        title: 'National Standards Body Regulatory Charter',
        clause: 'Section 10 & Conformity Assessment Rules',
        documentType: 'Gazette Notification',
        snippet: 'Bureau of Indian Standards is the National Standards Body of India responsible for the harmonious development of standardization, marking and quality certification of goods.',
        portalUrl: 'https://www.bis.gov.in'
      }
    ],
    suggestedFollowUps: [
      'What standard applies to LED bulbs?',
      'How do I get ISI certification for my food product?',
      'Is my 22K gold jewellery hallmark valid?',
      'What documents are needed for a CRS license?'
    ],
    intent: 'Welcome & System Capability Overview',
    confidenceScore: 0.99,
    schemeBadge: 'BIS AI Intelligence Engine'
  }
];

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ 
  language, 
  initialQuery, 
  onClearInitialQuery 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<SourceCitation | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'up' | 'down'>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSend(initialQuery);
      if (onClearInitialQuery) {
        onClearInitialQuery();
      }
    }
  }, [initialQuery]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const ragResponse = await queryRagEngine(query, language);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: ragResponse.text,
        hindiText: ragResponse.hindiText,
        citations: ragResponse.citations,
        suggestedFollowUps: ragResponse.suggestedFollowUps,
        intent: ragResponse.intent,
        confidenceScore: ragResponse.confidenceScore,
        schemeBadge: ragResponse.schemeBadge
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string, hindiText?: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking === id) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const contentToRead = (language === 'hi' && hindiText) ? hindiText : text.replace(/[#*`_\[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(contentToRead);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Simulate voice input for demonstration
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setInputText('What standard applies to LED bulbs?');
        inputRef.current?.focus();
      }, 1500);
      return;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      inputRef.current?.focus();
    };

    recognition.start();
  };

  const handleFeedback = (msgId: string, type: 'up' | 'down') => {
    setFeedbackGiven(prev => ({ ...prev, [msgId]: type }));
  };

  const handleExportChat = () => {
    const chatExport = messages.map(m => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.text}\n${m.citations ? `Sources: ${m.citations.map(c => c.isNumber).join(', ')}` : ''}\n---\n`).join('\n');
    const blob = new Blob([chatExport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manaksetu-chat-transcript-${Date.now()}.txt`;
    a.click();
  };

  const renderFormattedText = (text: string) => {
    // Simple markdown renderer for headers, bold, bullet points, links
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-bold text-bis-navy mt-3 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-bold text-bis-navy mt-4 mb-2">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('- ')) {
        const itemContent = line.replace('- ', '');
        return (
          <li key={idx} className="ml-4 list-disc text-slate-800 text-xs sm:text-sm my-0.5 leading-relaxed">
            <span dangerouslySetInnerHTML={{ 
              __html: itemContent
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, '<code class="bg-slate-200 px-1 py-0.5 rounded text-xs text-blue-900 font-mono">$1</code>')
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-600 underline font-semibold hover:text-blue-800">$1</a>')
            }} />
          </li>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <div key={idx} className="p-2.5 my-2 bg-amber-50 border-l-4 border-bis-saffron rounded text-xs text-amber-900 font-medium">
            {line.replace('> ', '')}
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-800 my-1 leading-relaxed">
          <span dangerouslySetInnerHTML={{ 
            __html: line
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/`(.*?)`/g, '<code class="bg-slate-200 px-1 py-0.5 rounded text-xs text-blue-900 font-mono">$1</code>')
              .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-600 underline font-semibold hover:text-blue-800">$1</a>')
          }} />
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden my-4">
      {/* Assistant Header & Status Bar */}
      <div className="bg-bis-navy text-white px-4 py-3 flex flex-wrap justify-between items-center border-b-2 border-bis-saffron">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-bis-saffron to-amber-500 flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-bis-navy rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">ManakSetu AI Assistant</h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                Grounding Active
              </span>
            </div>
            <p className="text-[11px] text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-bis-saffron" />
              Retriever Index: 21,500+ Gazette & IS Codes
            </p>
          </div>
        </div>

        {/* Quick Chat Actions */}
        <div className="flex items-center gap-1.5 mt-2 sm:mt-0">
          <button
            onClick={() => setMessages(INITIAL_MESSAGES)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-white/10 hover:bg-white/20 text-slate-200 rounded transition-colors"
            title="Reset Chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.clearChat}</span>
          </button>
          <button
            onClick={handleExportChat}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-white/10 hover:bg-white/20 text-slate-200 rounded transition-colors"
            title="Export Transcript"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.exportChat}</span>
          </button>
        </div>
      </div>

      {/* Suggested Demo Prompts Ribbon */}
      <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap">
        <span className="text-slate-500 font-semibold flex items-center gap-1 text-[11px] flex-shrink-0">
          <Sparkles className="w-3 h-3 text-bis-saffron" />
          Popular Inquiries:
        </span>
        {[
          'What standard applies to LED bulbs?',
          'How do I get ISI certification for my food product?',
          'Is my 22K gold jewellery hallmark valid?',
          'What documents are needed for a CRS license?',
          'Is certification mandatory for toys in India?',
          'What is FMCS scheme for foreign manufacturers?'
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 bg-white hover:bg-bis-light text-slate-700 hover:text-bis-navy border border-slate-200 hover:border-bis-saffron rounded-full text-xs font-medium transition-all shadow-2xs flex-shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          const displayedText = (language === 'hi' && msg.hindiText) ? msg.hindiText : msg.text;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'} animate-fadeIn`}
            >
              {/* Assistant Avatar */}
              {isAssistant && (
                <div className="w-8 h-8 rounded-full bg-bis-navy text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                  <Bot className="w-4 h-4 text-amber-400" />
                </div>
              )}

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-sm border ${
                isAssistant 
                  ? 'bg-white border-slate-200 text-slate-900' 
                  : 'bg-bis-navy text-white border-bis-dark'
              }`}>
                {/* Assistant Metadata Header */}
                {isAssistant && msg.schemeBadge && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100 text-xs">
                    <span className="font-bold text-bis-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {msg.schemeBadge}
                    </span>
                    {msg.confidenceScore && (
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Confidence: {Math.round(msg.confidenceScore * 100)}% Grounded
                      </span>
                    )}
                  </div>
                )}

                {/* Body Content */}
                <div className="prose-sm">
                  {isAssistant ? renderFormattedText(displayedText) : <p className="text-sm">{msg.text}</p>}
                </div>

                {/* Citations Section for Assistant */}
                {isAssistant && msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                      <FileText className="w-3.5 h-3.5 text-bis-saffron" />
                      <span>{t.sourcesCited} ({msg.citations.length} Grounded References):</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((citation) => (
                        <button
                          key={citation.id}
                          onClick={() => setSelectedCitation(citation)}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50/80 hover:bg-amber-100/90 text-amber-900 border border-amber-300/80 rounded-lg text-xs font-medium transition-all group shadow-2xs text-left"
                          title="Click to inspect verified standard clause"
                        >
                          <span className="w-2 h-2 rounded-full bg-bis-saffron"></span>
                          <span className="font-bold">{citation.isNumber}</span>
                          <span className="text-[11px] text-amber-700">({citation.clause})</span>
                          <span className="text-[10px] bg-amber-200/60 px-1 rounded text-amber-800 group-hover:bg-amber-300">
                            {t.inspectClause} →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up Suggested Queries */}
                {isAssistant && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="mt-3.5 pt-2.5 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mb-1.5">
                      <HelpCircle className="w-3 h-3 text-bis-blue" />
                      <span>{t.suggestedQueries}:</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {msg.suggestedFollowUps.map((followUp, fIdx) => (
                        <button
                          key={fIdx}
                          onClick={() => handleSend(followUp)}
                          className="flex items-center justify-between text-left px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded text-xs text-slate-700 hover:text-bis-navy font-medium transition-all group"
                        >
                          <span>{followUp}</span>
                          <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-bis-navy group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assistant Message Actions (Copy, TTS, Feedback) */}
                {isAssistant && (
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs text-slate-400">
                    <span className="text-[10px]">{msg.timestamp}</span>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleSpeak(msg.id, msg.text, msg.hindiText)}
                        className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                          isSpeaking === msg.id ? 'text-bis-saffron font-bold' : 'text-slate-500'
                        }`}
                        title={isSpeaking === msg.id ? 'Stop audio' : t.readAloud}
                      >
                        {isSpeaking === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleCopy(msg.id, displayedText)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-500 transition-colors"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <div className="flex items-center pl-1 border-l border-slate-200">
                        <button
                          onClick={() => handleFeedback(msg.id, 'up')}
                          className={`p-1 rounded hover:bg-slate-100 ${
                            feedbackGiven[msg.id] === 'up' ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                          title="Helpful"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, 'down')}
                          className={`p-1 rounded hover:bg-slate-100 ${
                            feedbackGiven[msg.id] === 'down' ? 'text-rose-600' : 'text-slate-400'
                          }`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {!isAssistant && (
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                  <User className="w-4 h-4 text-slate-200" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 items-center animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-bis-navy text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-amber-400" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-bis-saffron animate-spin" />
                Retrieving BIS Standards & Synthesizing Grounded Answer...
              </span>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-bis-saffron rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-bis-saffron rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-bis-saffron rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-2.5 rounded-lg border transition-colors ${
              isListening 
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-300'
            }`}
            title={isListening ? 'Listening...' : t.voicePrompt}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.askInputPlaceholder}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-bis-saffron focus:bg-white transition-all shadow-inner"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="px-5 py-2.5 bg-bis-saffron hover:bg-bis-saffronDark disabled:opacity-50 text-white rounded-lg font-bold text-sm flex items-center gap-1.5 shadow-md hover:shadow-glow transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <span>{t.askButton}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex justify-between items-center px-1 mt-2 text-[11px] text-slate-400">
          <span>Every response is grounded in BIS Gazette Orders & Technical Standards.</span>
          <span className="hidden sm:inline">Zero Hallucination Guaranteed</span>
        </div>
      </div>

      {/* Source Inspector Modal */}
      <SourceModal
        citation={selectedCitation}
        onClose={() => setSelectedCitation(null)}
      />
    </div>
  );
};
