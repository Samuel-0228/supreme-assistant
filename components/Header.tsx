import React from 'react';
import { Menu, RotateCcw, Bot, Terminal } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  onClearChat: () => void;
  messageCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onClearChat,
  messageCount,
}) => {
  return (
    <header className="h-14 border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors md:hidden"
          aria-label="Toggle Menu"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
            <Bot size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                Savvy AF 3.0
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border border-zinc-700 bg-zinc-900 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                ONLINE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              AAU Academic & Cutoff Intelligence
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 font-mono bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md">
          <Terminal size={12} />
          <span>Gemini 3 Flash</span>
        </div>

        {messageCount > 0 && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-md transition-all font-mono"
            title="Reset conversation"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
