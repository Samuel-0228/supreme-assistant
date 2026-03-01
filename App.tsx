
import React, { useState, useEffect, useRef } from 'react';
import { Message } from './types';
import { gemini } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';
import { ADMIN_HANDLE, CHANNEL_LINK } from './constants';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  ChevronDown, 
  GraduationCap, 
  Info, 
  LifeBuoy, 
  Moon, 
  Sun, 
  Trophy,
  LayoutDashboard,
  Sparkles
} from 'lucide-react';

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true); // Default to dark for Grok feel

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "🤖 **Welcome to Savvy AF 3.0**\n\nI'm your official AAU student assistant. Ask me anything about faculties, cutoff points, or the latest student data analysis. How can I help you today?",
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
      tg.setHeaderColor(darkMode ? '#000000' : '#ffffff');
      tg.setBackgroundColor(darkMode ? '#000000' : '#f8fafc');
    }
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
    <div className={`fixed inset-0 flex flex-col transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'} overflow-hidden font-sans`}>
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 ${darkMode ? 'bg-indigo-500' : 'bg-indigo-200'}`}></div>
        <div className={`absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-10 ${darkMode ? 'bg-blue-600' : 'bg-blue-300'}`}></div>
      </div>

      {/* Header */}
      <header className={`relative z-20 px-6 py-4 flex items-center justify-between border-b ${darkMode ? 'border-white/5 bg-black/50' : 'border-black/5 bg-white/50'} backdrop-blur-xl`}>
        <div className="flex items-center gap-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20"
          >
            <Sparkles size={20} />
          </motion.div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-tight leading-none">Savvy AF 3.0</h1>
            <p className={`text-[10px] font-medium uppercase tracking-[0.2em] mt-1 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
              Addis Ababa University
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <button 
             onClick={toggleDarkMode}
             className={`p-2 rounded-full transition-all ${darkMode ? 'hover:bg-white/10 text-yellow-400' : 'hover:bg-black/5 text-slate-600'}`}
           >
             {darkMode ? <Sun size={18} /> : <Moon size={18} />}
           </button>
           <a 
             href={CHANNEL_LINK} 
             target="_blank" 
             rel="noopener noreferrer" 
             className={`p-2 rounded-full transition-all ${darkMode ? 'hover:bg-white/10 text-white/70' : 'hover:bg-black/5 text-slate-600'}`}
           >
             <LayoutDashboard size={18} />
           </a>
        </div>
      </header>

      {/* Chat History */}
      <main className="flex-1 overflow-y-auto px-4 py-6 no-scrollbar relative z-10">
        <div className="max-w-3xl mx-auto w-full flex flex-col gap-6">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChatMessage message={msg} darkMode={darkMode} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className={`px-5 py-3 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                      className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/40' : 'bg-slate-400'}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Quick Access Buttons */}
      <div className="relative z-20 px-4 py-3 border-t border-transparent">
        <div className="max-w-3xl mx-auto w-full flex overflow-x-auto no-scrollbar gap-2 pb-1">
           <button 
             onClick={() => quickAction('2017 Survey Analysis')}
             className={`flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap ${
               darkMode 
                 ? 'bg-white/5 text-white border-white/10 hover:bg-white/10' 
                 : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
             }`}
           >
             <BarChart3 size={14} className="text-indigo-400" />
             Analysis
           </button>
           <button 
             onClick={() => quickAction('Cutoff Points')}
             className={`flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap ${
               darkMode 
                 ? 'bg-white/5 text-white border-white/10 hover:bg-white/10' 
                 : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
             }`}
           >
             <Trophy size={14} className="text-amber-400" />
             Cutoffs
           </button>
           <button 
             onClick={() => quickAction('AAU Faculties')}
             className={`flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-xl border transition-all whitespace-nowrap ${
               darkMode 
                 ? 'bg-white/5 text-white border-white/10 hover:bg-white/10' 
                 : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
             }`}
           >
             <GraduationCap size={14} className="text-blue-400" />
             Faculties
           </button>
           <button 
             onClick={() => window.open(`https://t.me/${ADMIN_HANDLE.replace('@','')}`, '_blank')}
             className={`flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-xl transition-all whitespace-nowrap bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20`}
           >
             <LifeBuoy size={14} />
             Support
           </button>
        </div>
      </div>

      {/* Input Area */}
      <footer className="relative z-20 w-full p-4 pt-0 pb-safe">
        <div className="max-w-3xl mx-auto w-full">
          <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} darkMode={darkMode} />
        </div>
      </footer>
    </div>
  );
};

export default App;
