import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Copy, Check, Code2, Eye, AlertCircle, Maximize2 } from 'lucide-react';

interface MermaidViewerProps {
  chart: string;
  darkMode?: boolean;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart, darkMode = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [viewSource, setViewSource] = useState(false);
  const [copied, setCopied] = useState(false);

  // Clean raw input from any markdown wrappers
  const cleanChart = (raw: string): string => {
    let clean = raw.trim();
    if (clean.startsWith('```mermaid')) {
      clean = clean.replace(/^```mermaid\s*/, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    // Default to flowchart TD if missing direction
    if (!clean.startsWith('graph') && !clean.startsWith('flowchart') && !clean.startsWith('sequenceDiagram') && !clean.startsWith('classDiagram')) {
      clean = `flowchart TD\n${clean}`;
    }
    return clean;
  };

  useEffect(() => {
    const renderDiagram = async () => {
      const sanitized = cleanChart(chart);
      if (!sanitized) {
        setSvgContent('');
        return;
      }

      try {
        setError(null);
        mermaid.initialize({
          startOnLoad: false,
          theme: darkMode ? 'dark' : 'neutral',
          securityLevel: 'loose',
          fontFamily: 'Inter, system-ui, sans-serif',
          flowchart: {
            curve: 'basis',
            padding: 15,
            nodeSpacing: 50,
            rankSpacing: 50,
          },
        });

        const id = `mermaid-chart-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, sanitized);
        setSvgContent(svg);
      } catch (err: any) {
        console.warn('Mermaid rendering warning:', err);
        setError('Could not render visual diagram. View raw diagram flowchart code below.');
      }
    };

    renderDiagram();
  }, [chart, darkMode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanChart(chart));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/60">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/70 px-4 py-2.5 backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Code2 className="h-4 w-4 text-indigo-500" />
          <span>Architecture Pipeline Flowchart</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewSource(!viewSource)}
            className="inline-flex items-center space-x-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {viewSource ? (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span>Visual Flow</span>
              </>
            ) : (
              <>
                <Code2 className="h-3.5 w-3.5" />
                <span>Source Code</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center space-x-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            title="Copy Mermaid code"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Render Area */}
      <div className="p-4 sm:p-6">
        {viewSource ? (
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 font-mono text-xs text-indigo-200 dark:bg-slate-950">
            <code>{cleanChart(chart)}</code>
          </pre>
        ) : error ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 font-mono text-xs text-slate-300 dark:bg-slate-950">
              <code>{cleanChart(chart)}</code>
            </pre>
          </div>
        ) : svgContent ? (
          <div
            ref={containerRef}
            className="flex justify-center overflow-x-auto py-2 [&>svg]:max-w-full [&>svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            Rendering architecture pipeline...
          </div>
        )}
      </div>
    </div>
  );
};
