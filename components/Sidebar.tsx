import React, { useState } from 'react';
import {
  GraduationCap,
  BarChart3,
  Building2,
  PhoneCall,
  FileText,
  Search,
  ChevronRight,
  X,
  Command,
  PlusCircle,
  BookOpen
} from 'lucide-react';
import { Category } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: Category) => void;
  onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onNewChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const categoryItems = [
    {
      type: Category.CUTOFFS,
      label: 'Cutoff Points (2024)',
      description: 'Computer Science, AAiT, EIABC & Health cutoffs',
      icon: BarChart3,
    },
    {
      type: Category.FACULTIES,
      label: 'Colleges & Schools',
      description: 'Natural Sciences, AAiT, Law, Social Sciences',
      icon: Building2,
    },
    {
      type: Category.SERVICES,
      label: 'Services & GPA Calculator',
      description: 'Housing, scholarships & Grade Point formula',
      icon: GraduationCap,
    },
    {
      type: Category.CONTACTS,
      label: 'Leadership & Registrar',
      description: 'President, VPs, email & phone channels',
      icon: PhoneCall,
    },
    {
      type: Category.ANALYSIS,
      label: 'Student Analysis (2017)',
      description: 'Medicine, CS, AAiT, Dental & IS survey data',
      icon: FileText,
    },
  ];

  const filteredCategories = categoryItems.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:static top-0 left-0 bottom-0 z-50 w-72 bg-[#09090b] border-r border-zinc-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header / New Chat */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-medium text-xs py-2.5 px-3 rounded-lg hover:bg-zinc-200 transition-all active:scale-[0.98]"
          >
            <PlusCircle size={16} />
            <span>New Conversation</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-2 py-1.5 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            Academic Knowledge Core
          </div>

          {filteredCategories.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.type}
                onClick={() => {
                  onSelectCategory(item.type);
                  if (window.innerWidth < 768) onClose();
                }}
                className="w-full group text-left p-2.5 rounded-lg border border-transparent hover:border-zinc-800 hover:bg-zinc-900/90 transition-all flex items-start gap-3"
              >
                <div className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-white group-hover:border-zinc-700 transition-colors mt-0.5">
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-zinc-200 group-hover:text-white truncate flex items-center justify-between">
                    <span>{item.label}</span>
                    <ChevronRight
                      size={12}
                      className="text-zinc-600 group-hover:text-zinc-300 transition-colors"
                    />
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate mt-0.5">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-zinc-800 bg-[#09090b]">
          <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-300">
              <Command size={12} className="text-zinc-400" />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="text-[11px] text-zinc-500 space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Command palette</span>
                <kbd className="px-1 bg-zinc-800 rounded text-[10px] text-zinc-300">
                  /
                </kbd>
              </div>
              <div className="flex justify-between">
                <span>Send message</span>
                <kbd className="px-1 bg-zinc-800 rounded text-[10px] text-zinc-300">
                  Enter
                </kbd>
              </div>
            </div>
          </div>
          <div className="mt-3 text-center text-[10px] font-mono text-zinc-600">
            Savvy Society Team • AAU 2026
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
