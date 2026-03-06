
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  darkMode?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading, darkMode }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [text]);

  return (
    <div className={`relative flex items-end gap-3 p-2 rounded-[24px] transition-all duration-300 ${
      darkMode 
        ? 'bg-white/[0.03] border border-white/10 focus-within:border-white/20' 
        : 'bg-white border border-slate-200 shadow-lg shadow-slate-200/50 focus-within:border-slate-300'
    }`}>
      <button className={`p-2.5 rounded-full transition-colors ${darkMode ? 'text-white/40 hover:text-white/70 hover:bg-white/5' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
        <Paperclip size={20} />
      </button>
      
      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask Savvy anything..."
        disabled={isLoading}
        className={`flex-1 bg-transparent border-none focus:ring-0 text-[15px] md:text-base resize-none py-3 px-1 max-h-[150px] leading-relaxed transition-colors ${
          darkMode ? 'text-white placeholder-white/20' : 'text-slate-800 placeholder-slate-400'
        }`}
      />
      
      <div className="flex items-center gap-1 mb-1 mr-1">
        <button className={`p-2.5 rounded-full transition-colors hidden md:flex ${darkMode ? 'text-white/40 hover:text-white/70 hover:bg-white/5' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}>
          <Smile size={20} />
        </button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!text.trim() || isLoading}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            !text.trim() || isLoading
              ? darkMode ? 'bg-white/5 text-white/20' : 'bg-slate-100 text-slate-300'
              : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ArrowUp size={20} />
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default InputArea;
