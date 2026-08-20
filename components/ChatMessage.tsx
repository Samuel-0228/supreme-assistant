import React from 'react';
import { Message } from '../types';
import { Bot, User, Copy, Check } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === 'model';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatText = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, i) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h3 key={i} className="font-semibold text-base text-white mt-5 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={i} className="font-bold text-lg text-white mt-6 mb-3 pb-1 border-b border-zinc-800 tracking-tight">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h1 key={i} className="font-bold text-xl text-white mt-6 mb-4 pb-2 border-b border-zinc-700 tracking-tight">
            {line.replace('# ', '')}
          </h1>
        );
      }

      // Bullet points
      const bulletMatch = line.match(/^(\s*)([*+-])\s+(.*)/);
      if (bulletMatch) {
        const content = bulletMatch[3];
        return (
          <div key={i} className="flex gap-2.5 ml-1 mb-2 items-start group">
            <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-zinc-500 group-hover:bg-white transition-colors"></span>
            <span className="flex-1 text-zinc-300 text-sm leading-relaxed">{parseInlineStyles(content)}</span>
          </div>
        );
      }

      // Horizontal Rule
      if (line.trim() === '---') {
        return <hr key={i} className="my-5 border-t border-zinc-800" />;
      }

      // Standard lines
      if (line.trim() === '') return <div key={i} className="h-2"></div>;

      return (
        <p key={i} className="mb-2 leading-relaxed text-zinc-300 text-sm">
          {parseInlineStyles(line)}
        </p>
      );
    });
  };

  const parseInlineStyles = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="font-mono bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded text-xs border border-zinc-700/50">
            {part.slice(1, -1)}
          </code>
        );
      }
      
      const subParts = part.split(/(\*.*?\*|_.*?_)/g);
      if (subParts.length > 1) {
        return subParts.map((subPart, subIndex) => {
          if ((subPart.startsWith('*') && subPart.endsWith('*')) || (subPart.startsWith('_') && subPart.endsWith('_'))) {
            return <em key={subIndex} className="italic text-zinc-400">{subPart.slice(1, -1)}</em>;
          }
          return subPart;
        });
      }

      return part;
    });
  };

  return (
    <div className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} group my-2`}>
      <div className={`flex gap-3 max-w-[92%] md:max-w-[82%] ${!isBot && 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border text-xs font-mono transition-colors ${
          isBot 
            ? 'bg-zinc-900 border-zinc-700 text-zinc-300 group-hover:border-zinc-500'
            : 'bg-zinc-100 border-white text-black font-semibold'
        }`}>
          {isBot ? <Bot size={16} /> : <User size={16} />}
        </div>

        {/* Message Content Container */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="text-[11px] font-mono text-zinc-500 tracking-wider uppercase">
              {isBot ? 'Savvy AI' : 'You'}
            </span>
            <span className="text-[10px] text-zinc-600 font-mono">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div
            className={`relative px-4 py-3.5 rounded-xl border text-sm leading-relaxed transition-all ${
              isBot 
                ? 'bg-[#09090b] border-zinc-800 text-zinc-200 shadow-sm hover:border-zinc-700' 
                : 'bg-zinc-800 border-zinc-700 text-white font-normal'
            }`}
          >
            <div className="break-words">
              {formatText(message.text)}
            </div>

            {isBot && (
              <div className="flex items-center justify-end mt-2 pt-2 border-t border-zinc-800/80">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors py-0.5 px-1.5 rounded hover:bg-zinc-800"
                >
                  {copied ? <Check size={12} className="text-zinc-300" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
