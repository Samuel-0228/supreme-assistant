
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  darkMode?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, darkMode }) => {
  const isBot = message.role === 'model';

  const formatText = (text: string) => {
    // 1. Handle code blocks or tables if any (simplified)
    const lines = text.split('\n');
    
    return lines.map((line, i) => {
      // 2. Headers
      if (line.startsWith('### ')) {
        return <h3 key={i} className={`font-bold text-base mt-3 mb-1 ${darkMode ? 'text-blue-300' : 'text-[#0088cc]'}`}>{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className={`font-bold text-lg mt-4 mb-2 border-b pb-1 ${darkMode ? 'border-gray-700 text-blue-400' : 'border-gray-200 text-[#006699]'}`}>{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={i} className="font-bold text-xl mt-4 mb-2">{line.replace('# ', '')}</h1>;
      }

      // 3. Bullet points (Handling *, -, or +)
      const bulletMatch = line.match(/^(\s*)([*+-])\s+(.*)/);
      if (bulletMatch) {
        const content = bulletMatch[3];
        return (
          <div key={i} className="flex gap-2 ml-1 mb-1 items-start">
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${darkMode ? 'bg-blue-400' : 'bg-[#0088cc]'}`}></span>
            <span className="flex-1">{parseInlineStyles(content)}</span>
          </div>
        );
      }

      // 4. Horizontal Rule
      if (line.trim() === '---') {
        return <hr key={i} className={`my-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />;
      }

      // 5. Standard lines (empty or text)
      if (line.trim() === '') return <div key={i} className="h-2"></div>;

      return <p key={i} className="mb-1 leading-relaxed">{parseInlineStyles(line)}</p>;
    });
  };

  // Helper to handle bold (**text**) and italics (*text*)
  const parseInlineStyles = (text: string) => {
    // Regex for bold **...**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      
      // Handle italics *...* or _..._ (only if not bold)
      const subParts = part.split(/(\*.*?\*|_.*?_)/g);
      if (subParts.length > 1) {
        return subParts.map((subPart, subIndex) => {
          if ((subPart.startsWith('*') && subPart.endsWith('*')) || (subPart.startsWith('_') && subPart.endsWith('_'))) {
            return <em key={subIndex} className="italic">{subPart.slice(1, -1)}</em>;
          }
          return subPart;
        });
      }

      return part;
    });
  };

  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'} animate-fadeIn px-2`}>
      <div
        className={`max-w-[88%] md:max-w-[75%] px-4 py-3 rounded-2xl shadow-sm relative transition-all duration-300 ${
          isBot 
            ? darkMode 
              ? 'bg-[#182533] text-[#e0e0e0] rounded-tl-none border border-[#233344]' 
              : 'bg-white text-gray-800 rounded-tl-none border border-[#e0e4e8]' 
            : darkMode
              ? 'bg-[#2b5278] text-white rounded-tr-none'
              : 'bg-[#0088cc] text-white rounded-tr-none'
        }`}
      >
        <div className="break-words text-[15px] md:text-[16px]">
          {formatText(message.text)}
        </div>
        
        <div className={`text-[10px] mt-2 flex justify-end items-center gap-1 select-none ${
          isBot 
            ? darkMode ? 'text-gray-500' : 'text-gray-400' 
            : darkMode ? 'text-blue-200' : 'text-blue-100'
        }`}>
          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {!isBot && <i className="fa-solid fa-check-double text-[8px]"></i>}
        </div>
        
        {/* Telegram-style message tail */}
        <div className={`absolute top-0 w-2 h-4 ${
          isBot 
            ? darkMode 
              ? '-left-1 bg-[#182533]' 
              : '-left-1 bg-white' 
            : darkMode
              ? '-right-1 bg-[#2b5278]'
              : '-right-1 bg-[#0088cc]'
          }`} 
          style={{ 
            clipPath: isBot ? 'polygon(100% 0, 0 0, 100% 100%)' : 'polygon(0 0, 100% 0, 0 100%)',
            marginTop: '-1px'
          }}>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
