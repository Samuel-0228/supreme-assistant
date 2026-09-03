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
  BookOpen,
  HelpCircle,
  BookMarked
} from 'lucide-react';
import { Category } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: Category) => void;
  onNewChat: () => void;
  onOpenBlogs: (blogId?: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onNewChat,
  onOpenBlogs,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const categoryItems = [
    {
      type: Category.UAT,
      label: 'UAT Exam Guide',
      description: 'Pacing, Verbal/Quant breakdown, Khan SAT prep',
      icon: HelpCircle,
    },
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

  const blogItems = [
    {
      id: 'uat-exam-guide',
      title: 'UAT Exam Complete Guide',
      subtitle: '100 Qs / 120 Mins & SAT Prep',
    },
    {
      id: 'department-placement-survey',
      title: '2017 Department Survey',
      subtitle: 'Placement stats & Savvy Researches link',
    },
    {
      id: 'cutoff-points-2024',
      title: '2024 Cutoff Score Matrix',
      subtitle: 'CS, SiTE, AAiT, EIABC breakdown',
    },
    {
      id: 'gpa-and-student-services',
      title: 'GPA & Student Services',
      subtitle: 'Grading scale & Tikur Anbessa care',
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
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:static top-0 left-0 bottom-0 z-50 w-[280px] sm:w-72 max-w-[85vw] bg-black/90 backdrop-blur-xl border-r border-white/10 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header / New Chat */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-medium text-xs py-2.5 px-3 rounded-lg hover:bg-zinc-200 transition-all active:scale-[0.98] min-h-[38px]"
          >
            <PlusCircle size={16} />
            <span>New Conversation</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-zinc-300 hover:text-white rounded-lg hover:bg-white/10 active:scale-95 md:hidden min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Close menu"
          >
            <X size={20} />
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
              className="w-full bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-white/25 transition-colors font-sans"
            />
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          <div className="space-y-1">
            <div className="px-2 py-1 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
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
                  className="w-full group text-left p-2.5 rounded-lg border border-transparent hover:border-white/10 hover:bg-white/[0.04] transition-all flex items-start gap-3"
                >
                  <div className="p-1.5 rounded-md bg-white/[0.05] border border-white/10 text-zinc-400 group-hover:text-white group-hover:border-white/20 transition-colors mt-0.5">
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

          {/* Detailed Blogs & FAQ Hub Section */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between px-2 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5 font-bold text-white">
                <BookMarked size={13} className="text-white" />
                <span>Detailed Blogs & FAQs</span>
              </span>
            </div>

            <div className="space-y-1">
              {blogItems.map((blog) => (
                <button
                  key={blog.id}
                  onClick={() => {
                    onOpenBlogs(blog.id);
                    if (window.innerWidth < 768) onClose();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.06] border border-white/10 hover:border-white/20 transition-all group flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-medium text-zinc-300 group-hover:text-white truncate">
                      {blog.title}
                    </div>
                    <div className="text-[10px] text-zinc-500 truncate">
                      {blog.subtitle}
                    </div>
                  </div>
                  <BookOpen size={13} className="text-zinc-500 group-hover:text-white flex-shrink-0" />
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                onOpenBlogs('');
                if (window.innerWidth < 768) onClose();
              }}
              className="w-full text-center py-2 text-xs font-mono text-zinc-300 hover:text-white bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-lg hover:border-white/20 transition-colors"
            >
              Browse All Articles →
            </button>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-white/10 bg-black/40">
          <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-300">
              <Command size={12} className="text-zinc-400" />
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="text-[11px] text-zinc-500 space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Command palette</span>
                <kbd className="px-1 bg-white/10 rounded text-[10px] text-zinc-300">
                  /
                </kbd>
              </div>
              <div className="flex justify-between">
                <span>Send message</span>
                <kbd className="px-1 bg-white/10 rounded text-[10px] text-zinc-300">
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


