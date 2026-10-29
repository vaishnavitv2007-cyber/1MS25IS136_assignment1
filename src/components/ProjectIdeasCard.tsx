import React, { useState } from 'react';
import {
  Lightbulb,
  Briefcase,
  Code2,
  CheckCircle,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ProjectIdea } from '../types';

interface ProjectIdeasCardProps {
  ideas: ProjectIdea[];
}

export const ProjectIdeasCard: React.FC<ProjectIdeasCardProps> = ({ ideas }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const getDifficultyBadge = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
      case 'intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      case 'advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const handleCopyIdea = (idea: ProjectIdea, index: number) => {
    const text = `
Project Title: ${idea.title}
Difficulty: ${idea.difficulty}
Tech Stack: ${idea.techStack.join(', ')}

Description:
${idea.description}

Proposed Deliverable:
${idea.deliverable}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (!ideas || ideas.length === 0) return null;

  return (
    <div className="rounded-2xl border border-indigo-200/90 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-indigo-900/60 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="rounded-xl bg-indigo-100 p-2.5 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Student Career & Research
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Internship & Hands-on Project Ideas
            </h3>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
          <Sparkles className="mr-1 h-3 w-3" />
          {ideas.length} Practical Projects
        </span>
      </div>

      <p className="mb-6 text-xs text-slate-500 dark:text-slate-400">
        Ready-to-build student portfolio, capstone, or research internship projects derived directly from this paper.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {ideas.map((idea, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 transition hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-indigo-600 dark:hover:bg-slate-800/70"
          >
            <div className="space-y-3">
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold ${getDifficultyBadge(
                    idea.difficulty
                  )}`}
                >
                  {idea.difficulty}
                </span>

                <button
                  onClick={() => handleCopyIdea(idea, idx)}
                  className="inline-flex items-center space-x-1 text-xs text-slate-400 transition hover:text-indigo-600 dark:hover:text-indigo-400"
                  title="Copy project proposal"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-500 text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span className="text-[11px]">Copy Proposal</span>
                    </>
                  )}
                </button>
              </div>

              {/* Title */}
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {idea.title}
              </h4>

              {/* Description */}
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {idea.description}
              </p>

              {/* Tech Stack Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                  Tech Stack:
                </span>
                {idea.techStack.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="inline-flex items-center rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 shadow-2xs border border-slate-200/60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Deliverable Callout */}
            <div className="mt-4 rounded-lg bg-indigo-50/70 p-2.5 text-xs text-indigo-950 dark:bg-indigo-950/40 dark:text-indigo-200 border border-indigo-100/80 dark:border-indigo-900/40">
              <span className="font-bold text-indigo-700 dark:text-indigo-300">
                Target Deliverable:{' '}
              </span>
              {idea.deliverable}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
