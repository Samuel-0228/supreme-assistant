import React from 'react';
import { Message } from '../types';
import { Bot, User, Copy, Check, BookOpen, ExternalLink, ArrowUpRight } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onOpenBlog?: (blogId: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onOpenBlog }) => {
  const isBot = message.role === 'model';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatText = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = (keyPrefix: string) => {
      if (!inTable || tableRows.length === 0) return null;
      const headers = tableRows[0];
      const dataRows = tableRows.slice(1).filter((r) => !r.every((c) => c.includes('---')));

      const tableElement = (
        <div key={`table-${keyPrefix}`} className="my-4 overflow-x-auto rounded-lg border border-white/10 bg-white/[0.02] backdrop-blur-md">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.05] border-b border-white/10 text-white font-mono">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-3 py-2 font-semibold uppercase tracking-wider">
                    {parseInlineStyles(h.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/[0.04] transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 leading-relaxed">
                      {parseInlineStyles(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

      tableRows = [];
      inTable = false;
      return tableElement;
    };

    lines.forEach((line, i) => {
      // Table row detection
      if (line.trim().startsWith('|')) {
        inTable = true;
        const cells = line
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());
        tableRows.push(cells);
        return;
      } else if (inTable) {
        const tableNode = flushTable(`row-${i}`);
        if (tableNode) elements.push(tableNode);
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="font-semibold text-base text-white mt-5 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60"></span>
            {line.replace('### ', '')}
          </h3>
        );
        return;
      }
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="font-bold text-lg text-white mt-6 mb-3 pb-1 border-b border-white/10 tracking-tight">
            {line.replace('## ', '')}
          </h2>
        );
        return;
      }
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="font-bold text-xl text-white mt-6 mb-4 pb-2 border-b border-white/10 tracking-tight">
            {line.replace('# ', '')}
          </h1>
        );
        return;
      }

      // Bullet points
      const bulletMatch = line.match(/^(\s*)([*+-]|\d+\.)\s+(.*)/);
      if (bulletMatch) {
        const content = bulletMatch[3];
        elements.push(
          <div key={i} className="flex gap-2.5 ml-1 mb-2 items-start group">
            <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-white/40 group-hover:bg-white transition-colors"></span>
            <span className="flex-1 text-zinc-300 text-sm leading-relaxed">{parseInlineStyles(content)}</span>
          </div>
        );
        return;
      }

      // Horizontal Rule
      if (line.trim() === '---') {
        elements.push(<hr key={i} className="my-5 border-t border-white/10" />);
        return;
      }

      // Standard lines
      if (line.trim() === '') {
        elements.push(<div key={i} className="h-2"></div>);
        return;
      }

      elements.push(
        <p key={i} className="mb-2 leading-relaxed text-zinc-300 text-sm">
          {parseInlineStyles(line)}
        </p>
      );
    });

    if (inTable) {
      const tableNode = flushTable('end');
      if (tableNode) elements.push(tableNode);
    }

    return elements;
  };

  const parseInlineStyles = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\)|https?:\/\/[^\s]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="font-mono bg-white/10 text-white px-1.5 py-0.5 rounded text-xs border border-white/10">
            {part.slice(1, -1)}
          </code>
        );
      }

      const mdLinkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (mdLinkMatch) {
        const label = mdLinkMatch[1];
        const url = mdLinkMatch[2];
        const isExternal = url.startsWith('http');
        return (
          <a
            key={index}
            href={url}
            target={isExternal ? '_blank' : '_self'}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white font-medium transition-all inline-flex items-center gap-1"
          >
            <span>{label}</span>
            {isExternal && <ExternalLink size={11} className="inline opacity-80" />}
          </a>
        );
      }

      if (part.startsWith('http://') || part.startsWith('https://')) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white font-medium transition-all inline-flex items-center gap-1"
          >
            <span>{part}</span>
            <ExternalLink size={11} className="inline opacity-80" />
          </a>
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

  const hasSavvyResearchesLink = message.text.includes('https://savvyresearches.vercel.app/');

  return (
    <div className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} group my-2`}>
      <div className={`flex gap-3 max-w-[95%] md:max-w-[85%] ${!isBot && 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border text-xs font-mono transition-colors ${
          isBot 
            ? 'bg-white/[0.05] border-white/10 text-white group-hover:border-white/20'
            : 'bg-white text-black font-semibold border-white'
        }`}>
          {isBot ? <Bot size={16} /> : <User size={16} />}
        </div>

        {/* Message Content Container */}
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-zinc-400 tracking-wider uppercase">
                {isBot ? 'Savvy AI' : 'You'}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div
            className={`relative px-4 py-3.5 rounded-2xl border text-sm leading-relaxed transition-all ${
              isBot 
                ? 'bg-white/[0.03] backdrop-blur-md border-white/10 text-zinc-200 shadow-sm hover:border-white/20' 
                : 'bg-white/10 backdrop-blur-md border-white/15 text-white font-normal'
            }`}
          >
            <div className="break-words space-y-2">
              {formatText(message.text)}
            </div>

            {/* Special Callout Card for Savvy Researches Portal Link */}
            {isBot && hasSavvyResearchesLink && (
              <div className="mt-4 p-3.5 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                    <span>Savvy Researches Placement Portal</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Explore interactive charts, cutoffs & placement data
                  </div>
                </div>
                <a
                  href="https://savvyresearches.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all flex-shrink-0"
                >
                  <span>Visit Portal</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            )}

            {/* Action Bar Footer */}
            {isBot && (
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10">
                {message.blogId && onOpenBlog ? (
                  <button
                    type="button"
                    onClick={() => onOpenBlog(message.blogId!)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-zinc-200 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg border border-white/10 transition-all font-mono active:scale-95"
                  >
                    <BookOpen size={14} />
                    <span>Read Article</span>
                  </button>
                ) : <div />}

                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors py-0.5 px-1.5 rounded hover:bg-white/10 font-mono"
                >
                  {copied ? <Check size={12} className="text-white" /> : <Copy size={12} />}
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


