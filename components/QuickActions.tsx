import React from 'react';
import {
  Building2,
  BarChart3,
  GraduationCap,
  PhoneCall,
  FileText,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Zap,
} from 'lucide-react';

interface QuickActionsProps {
  onSelectAction: (query: string) => void;
  onOpenBlog?: (blogId?: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onSelectAction, onOpenBlog }) => {
  const featuredBlogs = [
    {
      id: 'uat-exam-guide',
      title: 'AAU UAT Exam Complete Guide',
      subtitle: '100 Qs in 120 mins, Verbal vs Quant pacing, Khan SAT strategy & 750 ETB fee',
      tag: 'Freshman Admission',
    },
    {
      id: 'department-placement-survey',
      title: '2017 Department Placement Survey',
      subtitle: 'MD, CS, AAiT & IS statistics + Savvy Researches placement portal',
      tag: 'Placement Data',
    },
    {
      id: 'cutoff-points-2024',
      title: '2024 Entry Cutoff Points Matrix',
      subtitle: 'Software Eng (99.60), Electrical, CS & Pre-Engineering thresholds',
      tag: 'Benchmarks',
    },
    {
      id: 'gpa-and-student-services',
      title: 'GPA Calculation & Student Services',
      subtitle: 'Official letter grade values, Tikur Anbessa health & dorms',
      tag: 'Campus Life',
    },
  ];

  const actions = [
    {
      title: 'AAU UAT Exam Guide',
      subtitle: 'Format, section breakdown, Khan SAT prep & Telebirr fee',
      query: 'What is the format, pacing, section guide, and Khan Academy prep plan for the AAU UAT exam?',
      icon: HelpCircle,
    },
    {
      title: '2024 Cutoff Points',
      subtitle: 'Computer Science, AAiT, Software Eng cutoffs',
      query: 'What are the 2024 cutoff points for Computer Science and AAiT Pre-Engineering?',
      icon: BarChart3,
    },
    {
      title: '2017 Student Survey',
      subtitle: 'Department placement analysis & Savvy Researches link',
      query: 'Provide the comprehensive department placement survey analysis and Savvy Researches data.',
      icon: FileText,
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
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Intro Header */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md text-[11px] font-mono text-zinc-300">
          <span>ADDIS ABABA UNIVERSITY</span>
          <span className="text-zinc-600">•</span>
          <span>STUDENT INTELLIGENCE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Academic Guides & FAQs
        </h2>
      </div>

      {/* Featured Detailed Guides Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-white" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Featured Guides & Knowledge Hub
            </h3>
          </div>
          {onOpenBlog && (
            <button
              onClick={() => onOpenBlog('')}
              className="text-[11px] font-mono text-zinc-300 hover:text-white underline underline-offset-4 transition-colors"
            >
              Browse All Blogs →
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {featuredBlogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => onOpenBlog?.(blog.id)}
              className="group cursor-pointer p-4.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all flex flex-col justify-between space-y-3.5 hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.06] text-zinc-200 border border-white/10">
                    {blog.tag}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-white mb-1.5 transition-colors">
                  {blog.title}
                </h4>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {blog.subtitle}
                </p>
              </div>

              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-mono font-medium text-white group-hover:text-zinc-200">
                <span className="flex items-center gap-1.5">
                  <BookOpen size={13} />
                  <span>Read Article</span>
                </span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform text-zinc-400 group-hover:text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Quick Question Shortcuts */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-white" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              FAQ Shortcuts
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {actions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={idx}
                onClick={() => onSelectAction(act.query)}
                className="group text-left p-3.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-white/[0.05] border border-white/10 text-zinc-300 group-hover:text-white group-hover:bg-white/10 transition-colors mt-0.5">
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-xs font-semibold text-white truncate">
                      {act.title}
                    </h4>
                    <ArrowRight
                      size={13}
                      className="text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {act.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;


