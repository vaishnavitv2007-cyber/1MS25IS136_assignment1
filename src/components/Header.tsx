import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Sun,
  Moon,
  Search,
  FileText,
  Bookmark,
} from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeTab: 'analyzer' | 'topic' | 'history';
  setActiveTab: (tab: 'analyzer' | 'topic' | 'history') => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-colors dark:border-slate-800/80 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Title */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                AI Research Paper Agent
              </h1>
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-950/60 dark:text-indigo-300 dark:ring-indigo-500/20">
                <Sparkles className="mr-1 h-3 w-3" />
                Student Edition
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
              Transform complex academic papers into clear, structured insights
            </p>
          </div>
        </div>

        {/* Navigation Tabs & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Tab Navigation */}
          <nav className="flex items-center space-x-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
                activeTab === 'analyzer'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Abstract Analyzer</span>
            </button>

            <button
              onClick={() => setActiveTab('topic')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
                activeTab === 'topic'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Topic Search</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`relative flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
                activeTab === 'history'
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Saved</span>
              {historyCount > 0 && (
                <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white dark:bg-indigo-500">
                  {historyCount}
                </span>
              )}
            </button>
          </nav>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-indigo-400"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
