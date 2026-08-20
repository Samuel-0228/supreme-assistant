import React from 'react';
import {
  Building2,
  BarChart3,
  GraduationCap,
  PhoneCall,
  FileText,
  Terminal,
  ArrowRight
} from 'lucide-react';
import { Category } from '../types';

interface QuickActionsProps {
  onSelectAction: (query: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onSelectAction }) => {
  const actions = [
    {
      title: '2024 Cutoff Points',
      subtitle: 'Computer Science, AAiT, Software Eng cutoffs',
      query: 'What are the 2024 cutoff points for Computer Science and AAiT Pre-Engineering?',
      icon: BarChart3,
    },
    {
      title: 'Colleges & Schools',
      subtitle: 'List all faculties, institutes and departments',
      query: 'List all colleges, schools, and institutes at Addis Ababa University.',
      icon: Building2,
    },
    {
      title: 'Student Services & GPA',
      subtitle: 'Housing, scholarships and grade point breakdown',
      query: 'How is GPA calculated at AAU and what student services are available?',
      icon: GraduationCap,
    },
    {
      title: 'Registrar & Contacts',
      subtitle: 'Official emails, phone numbers & leadership info',
      query: 'Who are the university leaders and what are the registrar contact details?',
      icon: PhoneCall,
    },
    {
      title: '2017 Student Survey',
      subtitle: 'In-depth analysis for MD, CS & Pre-Engineering',
      query: 'Provide the comprehensive student analysis data for the 2017 batch.',
      icon: FileText,
    },
    {
      title: 'Command Palette Info',
      subtitle: 'Type / to quick-access preset AAU queries',
      query: 'How can I use command shortcuts to navigate AAU information?',
      icon: Terminal,
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Intro Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-[11px] font-mono text-zinc-300">
          <span>ADDIS ABABA UNIVERSITY</span>
          <span className="text-zinc-600">•</span>
          <span>STUDENT INTELLIGENCE</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          How can I assist your studies today?
        </h2>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          Select a prompt below or type your question in the search input.
        </p>
      </div>

      {/* Grid of Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectAction(act.query)}
              className="group text-left p-4 rounded-xl bg-[#09090b] border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 group-hover:text-white group-hover:border-zinc-700 transition-colors">
                  <Icon size={18} />
                </div>
                <ArrowRight
                  size={16}
                  className="text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-0.5">
                  {act.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-normal">
                  {act.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
