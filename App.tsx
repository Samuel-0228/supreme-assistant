import React, { useState, useRef, useEffect } from 'react';
import { Message, Category } from './types';
import { gemini } from './services/geminiService';
import { AAU_INFO } from './constants';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';
import QuickActions from './components/QuickActions';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send to Gemini AI Service
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
        text: '⚠️ An unexpected error occurred while communicating with the university server. Please try again.',
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
      case Category.FACULTIES:
        query = 'List all colleges, schools, and institutes at Addis Ababa University.';
        break;
      case Category.CUTOFFS:
        query = 'What are the cutoff points for Computer Science, AAiT Pre-Engineering, and other programs?';
        break;
      case Category.SERVICES:
        query = 'Tell me about student services, housing, scholarships, and how GPA is calculated.';
        break;
      case Category.CONTACTS:
        query = 'Who are the leaders of AAU and how can I contact the registrar?';
        break;
      case Category.ANALYSIS:
        query = 'Give me the comprehensive student survey analysis for Medicine, CS, and Pre-Engineering.';
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
    <div className="flex h-screen w-screen overflow-hidden bg-black text-zinc-100 font-sans antialiased">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectCategory={handleSelectCategory}
        onNewChat={handleClearChat}
      />

      {/* Main chat view */}
      <div className="flex-1 flex flex-col min-w-0 h-full bg-[#000000] relative">
        {/* Header bar */}
        <Header
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onClearChat={handleClearChat}
          messageCount={messages.length}
        />

        {/* Scrollable messages container */}
        <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.length === 0 ? (
            <QuickActions onSelectAction={handleSendMessage} />
          ) : (
            <div className="w-full max-w-3xl mx-auto space-y-4">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[#09090b] border border-zinc-800 w-fit my-2">
                  <div className="w-6 h-6 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
                    <span>Analyzing university core...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Input Dock */}
        <div className="w-full border-t border-zinc-800/80 bg-black/90 backdrop-blur-md">
          <InputArea
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
