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
    <header className="h-14 border-b border-white/10 bg-black/60 backdrop-blur-xl px-3 sm:px-4 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left side brand info */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-1 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-all active:scale-95 md:hidden flex items-center justify-center min-w-[36px] min-h-[36px]"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white flex-shrink-0">
            <Bot size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-xs font-mono font-bold tracking-wider text-white uppercase truncate">
                Savvy AF 3.0
              </h1>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono border border-white/10 bg-white/[0.05] text-zinc-300 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>ONLINE</span>
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-400 font-mono hidden sm:block truncate">
              AAU Academic & Cutoff Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Right side navigation action buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <button
          onClick={onOpenBlogs}
          className="flex items-center gap-1.5 text-xs text-white bg-white/10 hover:bg-white/15 border border-white/10 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg transition-all font-mono shadow-sm active:scale-95 min-h-[34px]"
          title="Open Academic Knowledge Hub"
        >
          <BookOpen size={14} className="flex-shrink-0" />
          <span className="hidden sm:inline">Blogs & FAQs</span>
          <span className="inline sm:hidden text-[11px]">Blogs</span>
        </button>

        <a
          href={CHANNEL_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-white bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg transition-all font-mono shadow-sm active:scale-95 group min-h-[34px]"
          title="Join Savvy Society Telegram Channel (@savvy_society)"
        >
          <Send size={13} className="text-zinc-300 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          <span className="font-semibold hidden sm:inline">Join society</span>
          <span className="font-semibold inline sm:hidden text-[11px]">Join</span>
        </a>

        {messageCount > 0 && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-white/[0.05] hover:bg-white/10 border border-white/10 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg transition-all font-mono active:scale-95 min-h-[34px]"
            title="Reset conversation"
          >
            <RotateCcw size={14} className="flex-shrink-0" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;



