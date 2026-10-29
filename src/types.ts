/**
 * Type definitions for AI Research Paper Agent
 */

export interface KeyConcept {
  term: string;
  definition: string;
}

export interface ProjectIdea {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  techStack: string[];
  deliverable: string;
}

export interface PaperAnalysis {
  title?: string;
  summary: string;
  problemStatement: string;
  methodology: string;
  keyContributions: string[];
  mermaidFlowchart: string;
  advantages: string[];
  limitations: string[];
  futureWork: string[];
  projectIdeas: ProjectIdea[];
  studentTakeaway?: string;
  keyConcepts?: KeyConcept[];
  readingDifficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | string;
}

export interface TopicPaper {
  id: string;
  title: string;
  authors: string;
  year: string;
  venue: string;
  abstract: string;
  keyTakeaway: string;
  tags: string[];
}

export interface TopicSearchResult {
  topicOverview: string;
  papers: TopicPaper[];
}

export interface HistoryItem {
  id: string;
  title: string;
  abstract: string;
  analysis: PaperAnalysis;
  timestamp: number;
}
