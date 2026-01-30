
import React, { useState, useRef, useEffect } from 'react';

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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [text]);

  return (
    <div className={`${darkMode ? 'bg-[#17212b] border-gray-800' : 'bg-white border-gray-100'} border-t p-2 md:p-4 flex items-end gap-2 shadow-2xl z-20 transition-colors`}>
      <div className={`flex-1 rounded-2xl px-4 py-1 flex items-center border transition-all ${
        darkMode 
          ? 'bg-[#0f1721] border-gray-800 focus-within:border-blue-900' 
          : 'bg-[#f1f1f1] border-transparent focus-within:border-gray-200'
      }`}>
        <button className={`transition-colors px-1 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
          <i className="fa-solid fa-paperclip"></i>
        </button>
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message..."
          disabled={isLoading}
          className={`flex-1 bg-transparent border-none focus:ring-0 text-sm md:text-base resize-none py-2 px-2 max-h-[150px] leading-tight transition-colors ${
            darkMode ? 'text-white placeholder-gray-600' : 'text-gray-800 placeholder-gray-400'
          }`}
        />
        <button className={`transition-colors px-1 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
          <i className="fa-regular fa-face-smile"></i>
        </button>
      </div>
      
      <button
        onClick={handleSend}
        disabled={!text.trim() || isLoading}
        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
          !text.trim() || isLoading
            ? darkMode ? 'bg-gray-800 text-gray-600' : 'bg-gray-100 text-gray-300'
            : 'bg-[#0088cc] text-white hover:bg-[#0077b5] active:scale-95'
        }`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <i className="fa-solid fa-paper-plane"></i>
        )}
      </button>
    </div>
  );
};

export default InputArea;
