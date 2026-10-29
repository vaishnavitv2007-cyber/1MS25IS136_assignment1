import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  FileText,
  Search,
  BookOpen,
  ArrowRight,
  Loader2,
  Trash2,
  RotateCcw,
  GraduationCap,
  ClipboardPaste,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';
import { Header } from './components/Header';
import { AnalysisCards } from './components/AnalysisCards';
import { StudentTutorChat } from './components/StudentTutorChat';
import { TopicSearchSection } from './components/TopicSearchSection';
import { SavedPapers } from './components/SavedPapers';
import { SAMPLE_PAPERS } from './data/samples';
import { PaperAnalysis, HistoryItem } from './types';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'analyzer' | 'topic' | 'history'>('analyzer');

  // Input states
  const [paperTitle, setPaperTitle] = useState('');
  const [abstractText, setAbstractText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('Initializing AI analysis...');
  const [error, setError] = useState<string | null>(null);

  // Results & History
  const [analysis, setAnalysis] = useState<PaperAnalysis | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('paper_agent_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const resultsRef = useRef<HTMLDivElement>(null);
  const tutorRef = useRef<HTMLDivElement>(null);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('paper_agent_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Rotate loading messages for engaging student experience
  useEffect(() => {
    if (!loading) return;
    const stages = [
      'Reading and parsing paper abstract...',
      'Synthesizing main objective & research question...',
      'Deconstructing algorithm architecture and methodology...',
      'Extracting empirical key findings & benchmarks...',
      'Evaluating competitive advantages and strengths...',
      'Identifying constraints, dataset dependencies & limitations...',
      'Mapping out future research frontiers...',
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % stages.length;
      setLoadingStage(stages[idx]);
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async (overrideTitle?: string, overrideAbstract?: string) => {
    const targetTitle = (overrideTitle !== undefined ? overrideTitle : paperTitle).trim();
    const targetAbstract = (overrideAbstract !== undefined ? overrideAbstract : abstractText).trim();

    if (!targetAbstract) {
      setError('Please paste or type a research paper abstract to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setLoadingStage('Reading and parsing paper abstract...');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: targetTitle || undefined,
          abstract: targetAbstract,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to analyze paper abstract.');
      }

      const data: PaperAnalysis = await response.json();
      setAnalysis(data);

      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        title: targetTitle || 'Untitled Paper Analysis',
        abstract: targetAbstract,
        analysis: data,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newItem, ...prev.slice(0, 19)]); // keep last 20

      // Scroll smoothly to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (sample: (typeof SAMPLE_PAPERS)[0], autoRun = false) => {
    setPaperTitle(sample.title);
    setAbstractText(sample.abstract);
    setError(null);
    if (autoRun) {
      handleAnalyze(sample.title, sample.abstract);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setAbstractText(text);
        setError(null);
      }
    } catch {
      // Browser permissions may restrict, fallback gracefully
    }
  };

  const handleClear = () => {
    setPaperTitle('');
    setAbstractText('');
    setAnalysis(null);
    setError(null);
  };

  const handleSelectTopicPaper = (title: string, abstract: string) => {
    setPaperTitle(title);
    setAbstractText(abstract);
    setActiveTab('analyzer');
    handleAnalyze(title, abstract);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setPaperTitle(item.title);
    setAbstractText(item.abstract);
    setAnalysis(item.analysis);
    setActiveTab('analyzer');
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const wordCount = abstractText.trim() ? abstractText.trim().split(/\s+/).length : 0;
  const charCount = abstractText.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Top Navigation Bar */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* TAB 1: ABSTRACT ANALYZER */}
        {activeTab === 'analyzer' && (
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-200/80 bg-indigo-50/70 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800/80 dark:bg-indigo-950/60 dark:text-indigo-300">
                <GraduationCap className="h-4 w-4" />
                <span>AI Research Assistant for Students & Academics</span>
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                Understand Research Papers in Seconds
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
                Paste any research paper abstract below. Our AI agent instantly extracts the{' '}
                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                  summary, main objective, methodology, key findings, advantages, limitations
                </strong>
                , and <strong className="font-semibold text-slate-800 dark:text-slate-200">future work</strong> into clean, structured cards.
              </p>
            </div>

            {/* Quick-Load Few-Shot Examples */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Lightbulb className="mr-1.5 h-4 w-4 text-amber-500" />
                  Try Instant Examples:
                </span>
                <span className="text-xs text-slate-400">Click to auto-populate abstract</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                {SAMPLE_PAPERS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => loadSample(sample, false)}
                    className="flex flex-col items-start rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-left transition hover:border-indigo-400 hover:bg-indigo-50/40 hover:shadow-2xs dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/30"
                  >
                    <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                      {sample.badge}
                    </span>
                    <span className="mt-1.5 text-xs font-bold text-slate-900 line-clamp-1 dark:text-white">
                      {sample.title}
                    </span>
                    <span className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {sample.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Input Form */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition dark:border-slate-800 dark:bg-slate-900">
              <div className="space-y-4">
                {/* Paper Title (Optional) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Research Paper Title <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={paperTitle}
                    onChange={(e) => setPaperTitle(e.target.value)}
                    placeholder="e.g. Deep Learning for Image Classification or Attention Is All You Need"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                  />
                </div>

                {/* Abstract Text Area */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Research Paper Abstract, Title, or URL <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={handlePasteClipboard}
                        className="inline-flex items-center space-x-1 text-xs font-medium text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                        title="Paste from clipboard"
                      >
                        <ClipboardPaste className="h-3.5 w-3.5" />
                        <span>Paste</span>
                      </button>
                      {(paperTitle || abstractText) && (
                        <button
                          type="button"
                          onClick={handleClear}
                          className="inline-flex items-center space-x-1 text-xs font-medium text-slate-400 transition hover:text-rose-600 dark:hover:text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Clear</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="relative mt-1.5">
                    <textarea
                      rows={6}
                      value={abstractText}
                      onChange={(e) => setAbstractText(e.target.value)}
                      placeholder="Paste research paper abstract, title, or arXiv URL here...&#10;e.g. 'https://arxiv.org/abs/1706.03762' or 'We train a large, deep convolutional neural network...'"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/50 p-4 text-sm leading-relaxed text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 font-mono text-xs sm:text-sm"
                    />
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
                    <span>
                      {wordCount} words • {charCount} characters
                    </span>
                    <span className="hidden sm:inline">
                      Tip: You can paste text, an abstract, or an arXiv URL.
                    </span>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
                    {error}
                  </div>
                )}

                {/* Submit & Quick Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveTab('topic')}
                      type="button"
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition dark:text-slate-400 dark:hover:text-indigo-400"
                    >
                      <Search className="h-3.5 w-3.5" />
                      <span>Don't have an abstract? Search topics instead</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Primary Analyze Button */}
                  <button
                    onClick={() => handleAnalyze()}
                    disabled={loading || !abstractText.trim()}
                    className="inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-7 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:from-indigo-500 hover:to-indigo-600 hover:shadow-indigo-600/30 disabled:cursor-not-allowed disabled:opacity-50 dark:from-indigo-500 dark:to-indigo-600 dark:hover:from-indigo-400 dark:hover:to-indigo-500"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Analyzing Paper...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Analyze Abstract</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Loading Indicator Status Card */}
            {loading && (
              <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/50 p-6 text-center dark:border-indigo-900/60 dark:bg-indigo-950/30 animate-pulse">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                <h4 className="mt-3 text-base font-bold text-indigo-900 dark:text-indigo-200">
                  {loadingStage}
                </h4>
                <p className="mt-1 text-xs text-indigo-700 dark:text-indigo-300">
                  Our academic AI agent is extracting methodology, advantages, limitations, and future work...
                </p>
              </div>
            )}

            {/* Analysis Results Section */}
            {analysis && (
              <div ref={resultsRef} className="pt-2">
                <AnalysisCards
                  paperTitle={paperTitle || 'Analyzed Research Paper'}
                  abstractText={abstractText}
                  analysis={analysis}
                  darkMode={darkMode}
                  onAskQuestion={() => {
                    tutorRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />

                {/* Interactive AI Paper Tutor Panel */}
                <div ref={tutorRef}>
                  <StudentTutorChat abstract={abstractText} analysis={analysis} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TOPIC SEARCH */}
        {activeTab === 'topic' && (
          <TopicSearchSection onSelectPaperForAnalysis={handleSelectTopicPaper} />
        )}

        {/* TAB 3: SAVED PAPERS HISTORY */}
        {activeTab === 'history' && (
          <SavedPapers
            history={history}
            onSelect={handleSelectHistoryItem}
            onClear={() => setHistory([])}
            onDeleteOne={(id) => setHistory((prev) => prev.filter((item) => item.id !== id))}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              AI Research Paper Agent
            </span>
            <span>— Designed for students, researchers, and curious minds.</span>
          </div>
          <div>
            <span>Structured insights: Summary • Objective • Methodology • Findings • Advantages • Limitations • Future Work</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
