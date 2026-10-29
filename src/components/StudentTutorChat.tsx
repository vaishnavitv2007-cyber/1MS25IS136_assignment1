import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  HelpCircle,
} from 'lucide-react';
import { PaperAnalysis } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface StudentTutorChatProps {
  abstract: string;
  analysis: PaperAnalysis;
}

export const StudentTutorChat: React.FC<StudentTutorChatProps> = ({
  abstract,
  analysis,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your AI Research Tutor for this paper. Feel free to ask me anything about the methodology, concepts, math, or practical takeaways!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    'Explain the methodology with a simple real-world analogy.',
    'Why is this better than traditional approaches?',
    'What are the biggest challenges if I want to replicate this?',
    'Explain the limitations in plain English.',
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ask-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          abstract,
          analysis,
          question: textToSend,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get answer.');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.answer || 'No response.' },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an issue answering that. Please try again!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Ask the AI Paper Tutor
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Have questions about this paper? Get instant student-friendly explanations.
          </p>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            disabled={loading}
            onClick={() => handleSend(q)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300 text-left"
          >
            <HelpCircle className="mr-1 inline h-3 w-3 text-indigo-500" />
            {q}
          </button>
        ))}
      </div>

      {/* Message Thread */}
      <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2.5 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-300">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-xs text-indigo-600 dark:text-indigo-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>AI Tutor is thinking...</span>
          </div>
        )}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-4 flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this paper (e.g. 'Can you clarify the methodology?')..."
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
};
