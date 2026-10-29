import React from 'react';
import { Bookmark, Clock, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { HistoryItem } from '../types';

interface SavedPapersProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  onDeleteOne: (id: string) => void;
}

export const SavedPapers: React.FC<SavedPapersProps> = ({
  history,
  onSelect,
  onClear,
  onDeleteOne,
}) => {
  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
        <Bookmark className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
        <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
          No saved analyses yet
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          When you analyze research paper abstracts, they will be automatically saved here for quick reference during your study sessions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Saved Paper Analyses ({history.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Stored locally in your browser for revision and study.
          </p>
        </div>
        <button
          onClick={onClear}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-rose-600 transition hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear All History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteOne(item.id);
                  }}
                  className="text-slate-400 hover:text-rose-500 transition"
                  title="Remove from history"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {item.title}
              </h3>

              <p className="text-xs leading-relaxed text-slate-600 line-clamp-2 dark:text-slate-400">
                {item.analysis.summary}
              </p>

              <div className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Method: </span>
                {item.analysis.methodology}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onSelect(item)}
                className="inline-flex w-full items-center justify-center space-x-2 rounded-xl bg-slate-100 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:bg-slate-800 dark:text-indigo-400 dark:hover:bg-slate-700"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>View Full Analysis</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
