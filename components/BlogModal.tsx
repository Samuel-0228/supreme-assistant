import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Clock,
  Calendar,
  User,
  ExternalLink,
  Share2,
  Check,
  Search,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { BLOG_POSTS, getBlogById } from '../lib/blogData';
import { BlogPost } from '../types';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogId: string | null;
  onSelectBlog: (id: string) => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({
  isOpen,
  onClose,
  blogId,
  onSelectBlog,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentBlog = blogId ? getBlogById(blogId) : null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredBlogs = BLOG_POSTS.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(
    new Set(BLOG_POSTS.flatMap((post) => post.tags))
  );

  const renderBlogMarkdown = (text: string) => {
    const lines = text.split('\n');
    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = () => {
      if (!inTable || tableRows.length === 0) return null;
      const headers = tableRows[0];
      const dataRows = tableRows.slice(1).filter((r) => !r.every((c) => c.includes('---')));

      const tableElement = (
        <div key={`table-${Math.random()}`} className="my-8 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.05] border-b border-white/10 text-white font-mono">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-5 py-3.5 font-semibold tracking-wider text-xs uppercase text-zinc-200">
                    {parseInline(h.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/[0.04] transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-5 py-3.5 leading-relaxed">
                      {parseInline(cell.trim())}
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

    const parseInline = (str: string) => {
      const parts = str.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);
      return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={idx} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={idx}
              className="font-mono bg-white/10 text-white px-1.5 py-0.5 rounded text-xs border border-white/10"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          const isExternal = linkMatch[2].startsWith('http');
          return (
            <a
              key={idx}
              href={linkMatch[2]}
              target={isExternal ? '_blank' : '_self'}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white font-medium transition-all inline-flex items-center gap-1"
            >
              <span>{linkMatch[1]}</span>
              {isExternal && <ExternalLink size={12} className="inline opacity-80" />}
            </a>
          );
        }
        return part;
      });
    };

    const renderedElements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      if (line.trim().startsWith('|')) {
        inTable = true;
        const cells = line
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());
        tableRows.push(cells);
        return;
      } else if (inTable) {
        const tableNode = flushTable();
        if (tableNode) renderedElements.push(tableNode);
      }

      if (line.startsWith('# ')) {
        renderedElements.push(
          <h1 key={idx} className="text-2xl sm:text-3xl font-bold text-white mt-10 mb-4 tracking-tight pb-3 border-b border-white/10">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        renderedElements.push(
          <h2 key={idx} className="text-xl sm:text-2xl font-bold text-white mt-9 mb-4 tracking-tight">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        renderedElements.push(
          <h3 key={idx} className="text-lg font-semibold text-zinc-100 mt-7 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('> ')) {
        renderedElements.push(
          <div key={idx} className="my-6 p-4 sm:p-5 rounded-xl bg-white/[0.03] backdrop-blur-md border-l-2 border-white/60 border-white/10 text-zinc-200 text-sm sm:text-base leading-relaxed">
            {parseInline(line.replace('> ', ''))}
          </div>
        );
      } else if (line.trim() === '---') {
        renderedElements.push(<hr key={idx} className="my-8 border-white/10" />);
      } else if (line.match(/^(\s*)([*+-]|\d+\.)\s+(.*)/)) {
        const bulletMatch = line.match(/^(\s*)([*+-]|\d+\.)\s+(.*)/);
        if (bulletMatch) {
          renderedElements.push(
            <div key={idx} className="flex gap-3 ml-2 mb-2.5 items-start text-sm sm:text-base text-zinc-300">
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />
              <span className="leading-relaxed flex-1">{parseInline(bulletMatch[3])}</span>
            </div>
          );
        }
      } else if (line.trim() !== '') {
        renderedElements.push(
          <p key={idx} className="mb-4 text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
            {parseInline(line)}
          </p>
        );
      }
    });

    if (inTable) {
      const tableNode = flushTable();
      if (tableNode) renderedElements.push(tableNode);
    }

    return renderedElements;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl overflow-y-auto flex flex-col animate-in fade-in duration-200">
      {/* Sticky Glass Navigation Bar */}
      <div className="sticky top-0 z-30 bg-black/70 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 text-white flex items-center justify-center font-bold">
            <BookOpen size={16} />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              AAU Academic Knowledge Hub
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentBlog && (
            <button
              onClick={() => onSelectBlog('')}
              className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg border border-white/10 transition-colors font-mono"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">All Articles</span>
            </button>
          )}
          <button
            onClick={handleShare}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Copy Link"
          >
            {copied ? <Check size={18} className="text-white" /> : <Share2 size={18} />}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close page"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 sm:px-8 py-8 max-w-4xl mx-auto w-full">
        {currentBlog ? (
          /* Single Article Reader View - Clean, plain, readable editorial layout */
          <article className="max-w-3xl mx-auto space-y-8 py-4">
            {/* Header Meta */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white/10 border border-white/15 text-white uppercase tracking-wider">
                  {currentBlog.category}
                </span>
                {currentBlog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-white/[0.03] border border-white/10 text-zinc-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {currentBlog.title}
              </h1>

              <p className="text-lg text-zinc-300 leading-relaxed font-normal">
                {currentBlog.subtitle}
              </p>

              {/* Author and Date strip */}
              <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-zinc-400 py-4 border-y border-white/10">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-zinc-400" />
                  <span>{currentBlog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-zinc-400" />
                  <span>{currentBlog.readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-zinc-400" />
                  <span>{currentBlog.date}</span>
                </div>
              </div>
            </div>

            {/* External Portal Link Banner */}
            {currentBlog.externalLink && (
              <div className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono text-white uppercase tracking-wider font-bold">
                    Official Web Portal
                  </div>
                  <p className="text-xs text-zinc-400">
                    Explore interactive charts and research data tools.
                  </p>
                </div>
                <a
                  href={currentBlog.externalLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold text-xs rounded-lg hover:bg-zinc-200 transition-all active:scale-95 shadow-md"
                >
                  <span>{currentBlog.externalLink.label}</span>
                </a>
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-invert max-w-none">
              {renderBlogMarkdown(currentBlog.content)}
            </div>

            {/* Related Articles Footer */}
            <div className="pt-10 border-t border-white/10 space-y-4">
              <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Related Academic Guides
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BLOG_POSTS.filter((b) => b.id !== currentBlog.id)
                  .slice(0, 2)
                  .map((post) => (
                    <button
                      key={post.id}
                      onClick={() => onSelectBlog(post.id)}
                      className="text-left p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-white/20 transition-all group"
                    >
                      <div className="text-[10px] font-mono text-zinc-400 mb-1">
                        {post.category} • {post.readTime}
                      </div>
                      <div className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors line-clamp-2">
                        {post.title}
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </article>
        ) : (
          /* All Blogs Glassmorphic Grid View */
          <div className="space-y-8 py-4">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Academic Knowledge Base
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                Detailed guides on AAU UAT exams, department cutoffs, placement analytics, and student services.
              </p>
            </div>

            {/* Search & Tag Filter Bar */}
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="Search articles, UAT topics, cutoffs, placement data..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/25 transition-all font-sans"
                />
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                    selectedTag === null
                      ? 'bg-white text-black font-semibold'
                      : 'bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  All Topics
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                      selectedTag === tag
                        ? 'bg-white text-black font-semibold'
                        : 'bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Article Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredBlogs.map((post) => (
                <div
                  key={post.id}
                  onClick={() => onSelectBlog(post.id)}
                  className="group cursor-pointer p-6 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all flex flex-col justify-between hover:shadow-xl"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white/[0.06] border border-white/10 text-zinc-200 uppercase">
                        {post.category}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {post.readTime}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-zinc-100 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400 group-hover:text-white">
                    <span>Read Article</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogModal;

