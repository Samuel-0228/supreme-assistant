import React from 'react';
import { Menu, RotateCcw, Bot, BookOpen, Send } from 'lucide-react';
import { CHANNEL_LINK } from '../constants';

interface HeaderProps {
  onToggleSidebar: () => void;
  onClearChat: () => void;
  onOpenBlogs: () => void;
  messageCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onClearChat,
  onOpenBlogs,
  messageCount,
}) => {
  return (
    <header className="h-14 border-b border-white/10 bg-black/60 backdrop-blur-xl px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors md:hidden"
          aria-label="Toggle Menu"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white">
            <Bot size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                Savvy AF 3.0
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border border-white/10 bg-white/[0.05] text-zinc-300">
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
        <button
          onClick={onOpenBlogs}
          className="flex items-center gap-1.5 text-xs text-white bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-1.5 rounded-lg transition-all font-mono shadow-sm active:scale-95"
          title="Open Academic Knowledge Hub"
        >
          <BookOpen size={14} />
          <span className="hidden sm:inline">Blogs & FAQs</span>
        </button>

        <a
          href={CHANNEL_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-white bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-lg transition-all font-mono shadow-sm active:scale-95 group"
          title="Join Savvy Society Telegram Channel (@savvy_society)"
        >
          <Send size={13} className="text-zinc-300 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          <span className="font-semibold">Join the society</span>
        </a>

        {messageCount > 0 && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-white/[0.05] hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-all font-mono"
            title="Reset conversation"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;


