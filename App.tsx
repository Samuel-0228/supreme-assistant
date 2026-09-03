import React, { useState, useRef, useEffect } from 'react';
import { Message, Category } from './types';
import { gemini } from './services/geminiService';
import { findMatchingFAQ } from './lib/blogData';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';
import QuickActions from './components/QuickActions';
import BlogModal from './components/BlogModal';
import RibbonFieldCanvas from './components/RibbonFieldCanvas';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState<boolean>(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleOpenBlog = (blogId?: string) => {
    setSelectedBlogId(blogId || null);
    setIsBlogModalOpen(true);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Check instant local FAQ match to save API cost
    const localMatch = findMatchingFAQ(text);
    if (localMatch) {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: localMatch.shortAnswer,
        timestamp: new Date(),
        blogId: localMatch.blogId,
        isLocalResponse: true,
      };
      setMessages((prev) => [...prev, botMessage]);
      return;
    }

    // Fallback to Gemini AI Service for custom questions
    setIsLoading(true);

    try {
      const responseText = await gemini.generateResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Error generating AI response:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'An unexpected error occurred while communicating with the university server. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCategory = (category: Category) => {
    let query = '';
    switch (category) {
      case Category.UAT:
        query = 'What is the format, section guide, pacing, and Khan Academy prep plan for the AAU UAT exam?';
        break;
      case Category.FACULTIES:
        query = 'List all colleges, schools, and institutes at Addis Ababa University.';
        break;
      case Category.CUTOFFS:
        query = 'What are the 2024 cutoff points for Computer Science and AAiT Pre-Engineering?';
        break;
      case Category.SERVICES:
        query = 'Tell me about student services, housing, scholarships, and how GPA is calculated.';
        break;
      case Category.CONTACTS:
        query = 'Who are the leaders of AAU and how can I contact the registrar?';
        break;
      case Category.ANALYSIS:
        query = 'Provide the comprehensive department placement survey analysis and Savvy Researches data.';
        break;
    }
    if (query) {
      handleSendMessage(query);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-black text-zinc-100 font-sans antialiased">
      {/* Animated Monochrome Ribbon Gradient Background Canvas */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <RibbonFieldCanvas
          angle={135}
          wave={15}
          softness={30}
          scale={75}
          vignette={50}
          grain={80}
          animated={true}
          speed={15}
        />
      </div>

      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectCategory={handleSelectCategory}
        onNewChat={handleClearChat}
        onOpenBlogs={handleOpenBlog}
      />

      {/* Main chat view */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10">
        {/* Header bar */}
        <Header
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onClearChat={handleClearChat}
          onOpenBlogs={() => handleOpenBlog()}
          messageCount={messages.length}
        />

        {/* Scrollable messages container */}
        <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.length === 0 ? (
            <QuickActions
              onSelectAction={handleSendMessage}
              onOpenBlog={handleOpenBlog}
            />
          ) : (
            <div className="w-full max-w-3xl mx-auto space-y-4">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onOpenBlog={handleOpenBlog}
                />
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 w-fit my-2">
                  <div className="w-6 h-6 rounded bg-white/10 border border-white/15 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-300">
                    <span>Processing response...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Input Dock */}
        <div className="w-full border-t border-white/10 bg-black/60 backdrop-blur-xl">
          <InputArea
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Detailed Blog Knowledge Hub Modal */}
      <BlogModal
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
        blogId={selectedBlogId}
        onSelectBlog={(id) => setSelectedBlogId(id || null)}
      />
    </div>
  );
}


