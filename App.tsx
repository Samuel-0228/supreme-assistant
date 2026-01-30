
import React, { useState, useEffect, useRef } from 'react';
import { Message } from './types';
import { gemini } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';
import { ADMIN_HANDLE, CHANNEL_LINK, AAU_INFO } from './constants';

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
      text: "🤖 Hello! I’m Savvy Chatbot — your AAU AI assistant built by Savvy Society Coordinator.\n\nSend me any question about Addis Ababa University or general topics!\n\nUse the buttons below for quick info.",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Telegram Web App and Theme
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.setHeaderColor(darkMode ? '#17212b' : '#ffffff');
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
    <div className={`flex flex-col h-screen max-w-2xl mx-auto transition-colors duration-300 ${darkMode ? 'bg-[#0f1721] text-white' : 'bg-[#e7ebf0] text-gray-900'} shadow-xl overflow-hidden font-sans`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-[#17212b] border-gray-800' : 'bg-white border-gray-200'} border-b px-4 py-3 flex items-center justify-between z-10 transition-colors`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center text-white shadow-inner">
            <i className="fa-solid fa-graduation-cap text-lg"></i>
          </div>
          <div>
            <h1 className={`font-bold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Savvy AAU Bot</h1>
            <p className="text-[10px] text-green-500 font-medium uppercase tracking-wide">Online AI Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={toggleDarkMode}
             className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${darkMode ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
             title="Toggle Theme"
           >
             <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
           </button>
           <a href={CHANNEL_LINK} target="_blank" rel="noopener noreferrer" className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-[#0088cc]'} transition-colors`}>
             <i className="fa-solid fa-bullhorn"></i>
           </a>
        </div>
      </header>

      {/* Chat History */}
      <main className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} darkMode={darkMode} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className={`px-4 py-2 rounded-2xl rounded-tl-none shadow-sm border ${darkMode ? 'bg-[#182533] border-gray-700' : 'bg-white border-gray-100'}`}>
              <div className="flex space-x-1">
                <div className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-gray-500' : 'bg-gray-300'}`}></div>
                <div className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s] ${darkMode ? 'bg-gray-500' : 'bg-gray-300'}`}></div>
                <div className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s] ${darkMode ? 'bg-gray-500' : 'bg-gray-300'}`}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Quick Access Buttons */}
      <div className="bg-transparent px-4 py-2 flex flex-wrap gap-2 mb-2 overflow-x-auto no-scrollbar">
         <button 
           onClick={() => quickAction('Student Analysis')}
           className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all shadow-sm whitespace-nowrap ${
             darkMode 
               ? 'bg-[#182533] text-purple-400 border-purple-900 hover:bg-[#202f3f]' 
               : 'bg-white text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white'
           }`}
         >
           📊 Student Analysis
         </button>
         <button 
           onClick={() => quickAction('Cutoff Points')}
           className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all shadow-sm whitespace-nowrap ${
             darkMode 
               ? 'bg-[#182533] text-blue-400 border-blue-900 hover:bg-[#202f3f]' 
               : 'bg-white text-[#0088cc] border-[#0088cc] hover:bg-[#0088cc] hover:text-white'
           }`}
         >
           📉 Cutoff Points
         </button>
         <button 
           onClick={() => quickAction('GPA Calculation')}
           className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all shadow-sm whitespace-nowrap ${
             darkMode 
               ? 'bg-[#182533] text-blue-400 border-blue-900 hover:bg-[#202f3f]' 
               : 'bg-white text-[#0088cc] border-[#0088cc] hover:bg-[#0088cc] hover:text-white'
           }`}
         >
           🧮 GPA Formula
         </button>
         <button 
           onClick={() => window.open(`https://t.me/${ADMIN_HANDLE.replace('@','')}`, '_blank')}
           className={`text-xs font-semibold px-4 py-2 rounded-full shadow-sm hover:opacity-90 transition-all whitespace-nowrap bg-[#0088cc] text-white`}
         >
           🆘 Contact Admin
         </button>
      </div>

      {/* Input Area */}
      <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} darkMode={darkMode} />
    </div>
  );
};

export default App;
