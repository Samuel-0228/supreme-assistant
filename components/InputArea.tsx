import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Command, X, FileText, BarChart3, Building2, GraduationCap, PhoneCall, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  isLoading: boolean;
}

interface CommandSuggestion {
  icon: React.ReactNode;
  label: string;
  description: string;
  prefix: string;
}

const commandSuggestions: CommandSuggestion[] = [
  {
    icon: <BarChart3 className="h-4 w-4 text-zinc-300" />,
    label: "Cutoff Points",
    description: "View latest AAU student cutoff requirements",
    prefix: "/cutoff",
  },
  {
    icon: <Building2 className="h-4 w-4 text-zinc-300" />,
    label: "Faculties & Colleges",
    description: "Explore all AAU schools and institutes",
    prefix: "/faculties",
  },
  {
    icon: <GraduationCap className="h-4 w-4 text-zinc-300" />,
    label: "Student Services",
    description: "Housing, GPA formulas & student support",
    prefix: "/services",
  },
  {
    icon: <PhoneCall className="h-4 w-4 text-zinc-300" />,
    label: "Leadership Contacts",
    description: "Registrar email and university contacts",
    prefix: "/contacts",
  },
  {
    icon: <FileText className="h-4 w-4 text-zinc-300" />,
    label: "Survey Analysis",
    description: "Detailed batch analysis and statistics",
    prefix: "/analysis",
  },
  {
    icon: <RotateCcw className="h-4 w-4 text-zinc-300" />,
    label: "Clear History",
    description: "Reset current conversation log",
    prefix: "/clear",
  },
];

export const InputArea: React.FC<InputAreaProps> = ({
  onSendMessage,
  onClearChat,
  isLoading,
}) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [showPalette, setShowPalette] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (text.startsWith('/') && !text.includes(' ')) {
      setShowPalette(true);
      const idx = commandSuggestions.findIndex((cmd) => cmd.prefix.startsWith(text));
      setActiveSuggestion(idx >= 0 ? idx : 0);
    } else {
      setShowPalette(false);
    }
  }, [text]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        setShowPalette(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = () => {
    if (!text.trim() || isLoading) return;
    const trimmed = text.trim();

    if (trimmed === '/clear') {
      onClearChat();
      setText('');
      setShowPalette(false);
      return;
    }

    onSendMessage(trimmed);
    setText('');
    setShowPalette(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleSelectCommand = (cmd: CommandSuggestion) => {
    if (cmd.prefix === '/clear') {
      onClearChat();
      setText('');
      setShowPalette(false);
      return;
    }
    setText(`${cmd.prefix} `);
    setShowPalette(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showPalette) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestion((prev) => (prev < commandSuggestions.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : commandSuggestions.length - 1));
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (commandSuggestions[activeSuggestion]) {
          handleSelectCommand(commandSuggestions[activeSuggestion]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowPalette(false);
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [text]);

  const handleAttachMockFile = () => {
    const mockFiles = ['AAU_Course_Guide.pdf', 'Grade_Report_2025.pdf', 'Faculty_Structure.doc'];
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    setAttachments((prev) => [...prev, randomFile]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto px-4 pb-4 pt-2">
      {/* Command Palette Floating Popup */}
      <AnimatePresence>
        {showPalette && (
          <motion.div
            ref={paletteRef}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute bottom-full left-4 right-4 mb-2 z-40 bg-[#09090b] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>COMMAND SUGGESTIONS</span>
              <span>Use ↑ ↓ to navigate, Enter to select</span>
            </div>
            <div className="p-1 max-h-60 overflow-y-auto">
              {commandSuggestions.map((cmd, idx) => (
                <button
                  key={cmd.prefix}
                  onClick={() => handleSelectCommand(cmd)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors ${
                    activeSuggestion === idx
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800">
                      {cmd.icon}
                    </div>
                    <div>
                      <div className="text-xs font-semibold">{cmd.label}</div>
                      <div className="text-[11px] text-zinc-400">{cmd.description}</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-zinc-400 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    {cmd.prefix}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Input Box */}
      <div className="relative rounded-xl bg-[#09090b] border border-zinc-800 focus-within:border-zinc-500 transition-all shadow-lg">
        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3 pt-3 pb-1 border-b border-zinc-800">
            {attachments.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md text-xs font-mono"
              >
                <span>{file}</span>
                <button
                  onClick={() => removeAttachment(idx)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Savvy AF 3.0 about AAU cutoffs, faculties, contacts... (Type / for commands)"
          disabled={isLoading}
          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-white placeholder-zinc-500 resize-none px-4 py-3.5 leading-relaxed max-h-40"
        />

        {/* Action Controls Bar */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-800/60 bg-[#09090b]">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleAttachMockFile}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Attach File"
            >
              <Paperclip size={16} />
            </button>
            <button
              type="button"
              onClick={() => setShowPalette((prev) => !prev)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
                showPalette ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              title="Toggle Commands"
            >
              <Command size={16} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[11px] font-mono text-zinc-500">
              Enter ↵ to send
            </span>
            <button
              type="button"
              onClick={handleSend}
              disabled={!text.trim() || isLoading}
              className="p-2.5 rounded-lg bg-white text-black font-semibold disabled:opacity-30 disabled:hover:bg-white hover:bg-zinc-200 transition-all flex items-center justify-center active:scale-95"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={15} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
