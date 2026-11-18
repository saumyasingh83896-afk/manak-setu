import React, { useState } from 'react';
import { ActiveTab, LanguageCode } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { QuickCards } from './components/QuickCards';
import { ChatAssistant } from './components/ChatAssistant';
import { StandardFinder } from './components/StandardFinder';
import { CertificationFlow } from './components/CertificationFlow';
import { LabFinder } from './components/LabFinder';
import { ConsumerCorner } from './components/ConsumerCorner';
import { ArchitectureView } from './components/ArchitectureView';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [chatInitialQuery, setChatInitialQuery] = useState<string>('');

  const handleLaunchChatWithQuery = (query: string) => {
    setChatInitialQuery(query);
    setActiveTab('chat');
  };

  const getFontSizeClass = () => {
    if (fontSize === 'large') return 'text-[1.08rem]';
    if (fontSize === 'xlarge') return 'text-[1.18rem]';
    return 'text-base';
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      highContrast 
        ? 'bg-black text-white high-contrast-mode' 
        : 'bg-slate-50 text-slate-900'
    } ${getFontSizeClass()}`}>
      {/* Persistent Government/BIS Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        fontSize={fontSize}
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-4">
            <Hero
              language={language}
              onSearchSubmit={handleLaunchChatWithQuery}
              setActiveTab={setActiveTab}
            />
            <QuickCards
              language={language}
              setActiveTab={setActiveTab}
              onAskChatWithQuery={handleLaunchChatWithQuery}
            />
            
            {/* Embedded Live Chat Preview on Landing Page */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Try ManakSetu Conversational Assistant
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Ask any compliance question or choose from trending industry topics below
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="px-4 py-2 bg-bis-saffron hover:bg-bis-saffronDark text-white font-bold text-xs rounded-lg shadow transition-colors"
                  >
                    Open Fullscreen Chat →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { q: 'What standard applies to LED bulbs?', desc: 'CRS Scheme, IS 16102 safety & lumen parameters' },
                    { q: 'How do I get ISI certification for my food product?', desc: 'Scheme-I factory audit, in-house lab & testing' },
                    { q: 'Is my 22K gold jewellery hallmark valid?', desc: '3-sign system, 22K916 fineness & 6-digit HUID' },
                    { q: 'What documents are needed for a CRS license?', desc: 'MeitY test report, CCL list & Form-I submission' }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLaunchChatWithQuery(item.q)}
                      className="text-left p-4 rounded-xl bg-slate-50 hover:bg-bis-light border border-slate-200 hover:border-bis-saffron transition-all group"
                    >
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-bis-navy">
                        "{item.q}"
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="px-2 sm:px-4">
            <ChatAssistant
              language={language}
              initialQuery={chatInitialQuery}
              onClearInitialQuery={() => setChatInitialQuery('')}
            />
          </div>
        )}

        {activeTab === 'standard-finder' && (
          <StandardFinder
            language={language}
            onAskChatWithQuery={handleLaunchChatWithQuery}
          />
        )}

        {activeTab === 'certification' && (
          <CertificationFlow
            language={language}
            onAskChatWithQuery={handleLaunchChatWithQuery}
          />
        )}

        {activeTab === 'labs' && (
          <LabFinder
            language={language}
            onAskChatWithQuery={handleLaunchChatWithQuery}
          />
        )}

        {activeTab === 'consumer' && (
          <ConsumerCorner
            language={language}
            onAskChatWithQuery={handleLaunchChatWithQuery}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureView
            language={language}
          />
        )}
      </main>

      {/* Footer */}
      <Footer language={language} />
    </div>
  );
};
