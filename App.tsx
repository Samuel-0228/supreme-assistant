
import React, { useState, useEffect, useRef } from 'react';
import { Message } from './types';
import { gemini } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';
import { ADMIN_HANDLE, CHANNEL_LINK } from './constants';

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "🤖 **Welcome to Savvy AF 3.0**\n\nI'm your official AAU student assistant. Ask me anything about faculties, cutoff points, or the latest student data analysis.",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.setHeaderColor(darkMode ? '#17212b' : '#ffffff');
      tg.setBackgroundColor(darkMode ? '#0f1721' : '#e7ebf0');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await gemini.generateResponse(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickAction = (topic: string) => {
    handleSendMessage(`Tell me about ${topic}`);
  };

  return (
    <div className={`fixed inset-0 flex flex-col transition-colors duration-300 ${darkMode ? 'bg-[#0f1721] text-white' : 'bg-[#e7ebf0] text-gray-900'} overflow-hidden font-sans`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-[#17212b] border-gray-800' : 'bg-white border-gray-200'} border-b px-4 py-3 flex items-center justify-between z-10 shrink-0 shadow-sm`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center text-white shadow-inner">
            <i className="fa-solid fa-bolt text-lg"></i>
          </div>
          <div>
            <h1 className={`font-bold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Savvy AF 3.0</h1>
            <p className="text-[10px] text-green-500 font-medium uppercase tracking-wide">Ready to assist</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={toggleDarkMode}
             className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${darkMode ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
           >
             <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
           </button>
           <a href={CHANNEL_LINK} target="_blank" rel="noopener noreferrer" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-[#0088cc]'} transition-colors`}>
             <i className="fa-solid fa-bullhorn text-lg"></i>
           </a>
        </div>
      </header>

      {/* Chat History */}
      <main className="flex-1 overflow-y-auto px-0 py-4 no-scrollbar scroll-smooth bg-transparent">
        <div className="max-w-3xl mx-auto w-full flex flex-col px-2">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} darkMode={darkMode} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4 px-2">
              <div className={`px-4 py-2 rounded-2xl rounded-tl-none shadow-sm border ${darkMode ? 'bg-[#182533] border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className="flex space-x-1 py-1">
                  <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`}></div>
                  <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s] ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`}></div>
                  <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s] ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Quick Access Buttons */}
      <div className="bg-transparent px-4 py-2 flex overflow-x-auto no-scrollbar shrink-0">
        <div className="max-w-3xl mx-auto w-full flex flex-nowrap gap-2">
           <button 
             onClick={() => quickAction('2017 Survey Analysis')}
             className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all shadow-sm whitespace-nowrap ${
               darkMode 
                 ? 'bg-[#182533] text-purple-400 border-purple-900' 
                 : 'bg-white text-purple-600 border-purple-200'
             }`}
           >
             📊 Analysis
           </button>
           <button 
             onClick={() => quickAction('Cutoff Points')}
             className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all shadow-sm whitespace-nowrap ${
               darkMode 
                 ? 'bg-[#182533] text-blue-400 border-blue-900' 
                 : 'bg-white text-[#0088cc] border-blue-100'
             }`}
           >
             📉 Cutoffs
           </button>
           <button 
             onClick={() => quickAction('AAU Faculties')}
             className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all shadow-sm whitespace-nowrap ${
               darkMode 
                 ? 'bg-[#182533] text-emerald-400 border-emerald-900' 
                 : 'bg-white text-emerald-600 border-emerald-100'
             }`}
           >
             🏛️ Faculties
           </button>
           <button 
             onClick={() => window.open(`https://t.me/${ADMIN_HANDLE.replace('@','')}`, '_blank')}
             className={`text-xs font-semibold px-4 py-2 rounded-full shadow-sm bg-[#0088cc] text-white whitespace-nowrap`}
           >
             🆘 Support
           </button>
        </div>
      </div>

      {/* Input Area */}
      <footer className="shrink-0 w-full p-2 pb-safe">
        <div className="max-w-3xl mx-auto w-full">
          <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} darkMode={darkMode} />
        </div>
      </footer>
    </div>
  );
};

export default App;
