import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  ArrowRight,
  Loader2,
  Calendar,
  Users,
  Compass,
  Sparkles,
  Tag,
  Bookmark,
} from 'lucide-react';
import { POPULAR_TOPICS } from '../data/samples';
import { TopicSearchResult, TopicPaper } from '../types';

interface TopicSearchSectionProps {
  onSelectPaperForAnalysis: (title: string, abstract: string) => void;
}

export const TopicSearchSection: React.FC<TopicSearchSectionProps> = ({
  onSelectPaperForAnalysis,
}) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TopicSearchResult | null>(null);

  const handleSearch = async (searchTopic?: string) => {
    const q = (searchTopic || topic).trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    if (searchTopic) setTopic(searchTopic);

    try {
      const response = await fetch('/api/search-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: q }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to search topic.');
      }

      const data: TopicSearchResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while searching the topic.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
            <Compass className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Research Landscape Explorer
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            Search Any Research Topic
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Discover seminal and trending research papers with student-friendly breakdowns, ready to decompose with one click.
          </p>
        </div>

        {/* Search Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="relative flex flex-col gap-2 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Deep Learning for Image Classification, CRISPR, Blockchain..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="inline-flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Searching Papers...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Search Topic</span>
              </>
            )}
          </button>
        </form>

        {/* Popular Topics Chips */}
        <div className="mt-4">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Suggested Research Topics:
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {POPULAR_TOPICS.map((t, idx) => (
              <button
                key={idx}
                onClick={() => handleSearch(t)}
                className="rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      )}

      {/* Search Results */}
      {result && (
        <div className="space-y-6">
          {/* Topic Domain Overview */}
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 p-6 shadow-sm dark:border-indigo-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30">
            <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300">
              <Sparkles className="h-5 w-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Topic Synthesis & Background
              </h3>
            </div>
            <p className="mt-2 text-base leading-relaxed text-slate-800 dark:text-slate-200">
              {result.topicOverview}
            </p>
          </div>

          {/* Paper Cards List */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Seminal & Featured Papers ({result.papers.length})
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {result.papers.map((paper: TopicPaper) => (
                <div
                  key={paper.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                >
                  <div className="space-y-3">
                    {/* Venue & Year Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                        {paper.venue} • {paper.year}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                        <Users className="h-3.5 w-3.5" />
                        <span>{paper.authors}</span>
                      </div>
                    </div>

                    {/* Paper Title */}
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {paper.title}
                    </h4>

                    {/* Key Takeaway Pill */}
                    <div className="rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        Key Takeaway:{' '}
                      </span>
                      {paper.keyTakeaway}
                    </div>

                    {/* Abstract preview */}
                    <p className="text-xs leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-400">
                      {paper.abstract}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {paper.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        >
                          <Tag className="mr-1 h-2.5 w-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => onSelectPaperForAnalysis(paper.title, paper.abstract)}
                      className="inline-flex w-full items-center justify-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Analyze This Paper</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
