
import React from 'react';
import { Message } from '../types';
import { Bot, User, CheckCheck } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  darkMode?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, darkMode }) => {
  const isBot = message.role === 'model';

  const formatText = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, i) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={i} className={`font-bold text-base mt-4 mb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className={`font-bold text-lg mt-5 mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={i} className="font-bold text-xl mt-6 mb-4">{line.replace('# ', '')}</h1>;
      }

      // Bullet points
      const bulletMatch = line.match(/^(\s*)([*+-])\s+(.*)/);
      if (bulletMatch) {
        const content = bulletMatch[3];
        return (
          <div key={i} className="flex gap-3 ml-1 mb-2 items-start group">
            <span className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all group-hover:scale-125 ${darkMode ? 'bg-indigo-500' : 'bg-indigo-600'}`}></span>
            <span className={`flex-1 ${darkMode ? 'text-white/90' : 'text-slate-800'}`}>{parseInlineStyles(content)}</span>
          </div>
        );
      }

      // Horizontal Rule
      if (line.trim() === '---') {
        return <hr key={i} className={`my-6 border-t ${darkMode ? 'border-white/10' : 'border-slate-200'}`} />;
      }

      // Standard lines
      if (line.trim() === '') return <div key={i} className="h-3"></div>;

      return <p key={i} className={`mb-2 leading-relaxed ${darkMode ? 'text-white/90' : 'text-slate-800'}`}>{parseInlineStyles(line)}</p>;
    });
  };

  const parseInlineStyles = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-indigo-400">{part.slice(2, -2)}</strong>;
      }
      
      const subParts = part.split(/(\*.*?\*|_.*?_)/g);
      if (subParts.length > 1) {
        return subParts.map((subPart, subIndex) => {
          if ((subPart.startsWith('*') && subPart.endsWith('*')) || (subPart.startsWith('_') && subPart.endsWith('_'))) {
            return <em key={subIndex} className="italic opacity-80">{subPart.slice(1, -1)}</em>;
          }
          return subPart;
        });
      }

      return part;
    });
  };

  return (
    <div className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} group`}>
      <div className={`flex gap-3 max-w-[90%] md:max-w-[80%] ${!isBot && 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-1 ${
          isBot 
            ? darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
            : darkMode ? 'bg-white/10 text-white/70' : 'bg-slate-200 text-slate-600'
        }`}>
          {isBot ? <Bot size={18} /> : <User size={18} />}
        </div>

        {/* Bubble */}
        <div className="flex flex-col gap-1">
          <div
            className={`px-5 py-3.5 rounded-2xl transition-all duration-300 ${
              isBot 
                ? darkMode 
                  ? 'bg-white/[0.03] border border-white/10 text-white' 
                  : 'bg-white border border-slate-200 text-slate-900 shadow-sm' 
                : darkMode
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/10'
                  : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/10'
            }`}
          >
            <div className="break-words text-[15px] md:text-[16px]">
              {formatText(message.text)}
            </div>
          </div>
          
          <div className={`text-[10px] flex items-center gap-1.5 px-1 ${
            isBot 
              ? darkMode ? 'text-white/30' : 'text-slate-400' 
              : darkMode ? 'text-white/50 justify-end' : 'text-slate-400 justify-end'
          }`}>
            <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {!isBot && <CheckCheck size={12} className="text-indigo-400" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
