import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client utility
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// JSON Schema for structured paper analysis
const paperAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'The formal academic title of the research paper',
    },
    summary: {
      type: Type.STRING,
      description: 'Clear, concise summary of the research paper suitable for university students',
    },
    problemStatement: {
      type: Type.STRING,
      description: 'The core research question, real-world motivation, and limitations of existing approaches',
    },
    methodology: {
      type: Type.STRING,
      description: 'The technical methodology, architecture, mathematical formulation, and experimental setup',
    },
    keyContributions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Primary scientific contributions, algorithmic novelties, and empirical milestones',
    },
    mermaidFlowchart: {
      type: Type.STRING,
      description: 'Valid, concise Mermaid.js flowchart (starting with "flowchart TD" or "graph TD") detailing the pipeline from input data through preprocessing, model layers, loss/training, to evaluation/output',
    },
    advantages: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Strengths, benefits, and competitive advantages over conventional baselines',
    },
    limitations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Weaknesses, constraints, dataset dependencies, computational costs, and boundary conditions',
    },
    futureWork: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Directions for future research, unexplored challenges, or prospective extensions',
    },
    projectIdeas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          difficulty: { type: Type.STRING, description: 'Beginner, Intermediate, or Advanced' },
          techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
          deliverable: { type: Type.STRING },
        },
        required: ['title', 'description', 'difficulty', 'techStack', 'deliverable'],
      },
      description: '2 to 3 hands-on student internship, thesis, or capstone project ideas inspired by this paper',
    },
    studentTakeaway: {
      type: Type.STRING,
      description: 'Plain English takeaway in 1-2 friendly sentences explaining why this matters',
    },
    keyConcepts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          definition: { type: Type.STRING },
        },
        required: ['term', 'definition'],
      },
      description: '3 to 5 key technical terms or acronyms explained in simple student-friendly terms',
    },
    readingDifficulty: {
      type: Type.STRING,
      description: 'Estimated difficulty level: Beginner, Intermediate, or Advanced',
    },
  },
  required: [
    'summary',
    'problemStatement',
    'methodology',
    'keyContributions',
    'mermaidFlowchart',
    'advantages',
    'limitations',
    'futureWork',
    'projectIdeas',
  ],
};

const topicSearchSchema = {
  type: Type.OBJECT,
  properties: {
    topicOverview: {
      type: Type.STRING,
      description: 'A 2-3 sentence overview of this research field and its significance',
    },
    papers: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          authors: { type: Type.STRING },
          year: { type: Type.STRING },
          venue: { type: Type.STRING },
          abstract: { type: Type.STRING },
          keyTakeaway: { type: Type.STRING },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['id', 'title', 'authors', 'year', 'venue', 'abstract', 'keyTakeaway', 'tags'],
      },
    },
  },
  required: ['topicOverview', 'papers'],
};

// Safe JSON parser stripping code fences
function parseJsonSafe(text: string) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

// Resilient model fallback chain to guarantee high availability and low latency
async function generateWithModelFallback(params: { contents: string; config?: any }) {
  const models = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash-lite', 'gemini-3.8-flash'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      console.warn(`[Model ${model}] failed (${err.status || err.message}), attempting fallback...`);
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to generate content from AI models.');
}

// Helper to fetch and extract content if the user inputs a URL
async function resolveUrlContent(input: string): Promise<{ resolvedText: string; detectedTitle?: string }> {
  const trimmed = input.trim();
  const isUrl = /^https?:\/\//i.test(trimmed);

  if (!isUrl) {
    return { resolvedText: trimmed };
  }

  try {
    console.log(`[URL Resolver] Fetching content from: ${trimmed}`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(trimmed, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,text/plain',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const html = await res.text();

      // Check for arXiv abstract specifically
      if (trimmed.includes('arxiv.org')) {
        const titleMatch = html.match(/<h1 class="title[^"]*">([^<]+(?:<span[^>]*>[^<]*<\/span>[^<]*)*)<\/h1>/i) ||
                           html.match(/<title>([^<]+)<\/title>/i);
        const abstractMatch = html.match(/<blockquote class="abstract[^"]*">([\s\S]*?)<\/blockquote>/i);

        let title = titleMatch ? titleMatch[1].replace(/Title:/i, '').replace(/<[^>]+>/g, '').trim() : '';
        let abstract = abstractMatch ? abstractMatch[1].replace(/Abstract:/i, '').replace(/<[^>]+>/g, '').trim() : '';

        if (abstract) {
          return {
            resolvedText: `Title: ${title}\n\nAbstract:\n${abstract}`,
            detectedTitle: title,
          };
        }
      }

      // Generic meta description or title extraction
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);

      const title = titleMatch ? titleMatch[1].trim() : '';
      const desc = descMatch ? descMatch[1].trim() : '';

      if (desc.length > 50) {
        return {
          resolvedText: `Paper URL: ${trimmed}\nTitle: ${title}\n\nAbstract/Description:\n${desc}`,
          detectedTitle: title,
        };
      }
    }
  } catch (err: any) {
    console.warn('[URL Resolver] Direct fetch skipped, relying on AI knowledge of URL:', err.message);
  }

  return { resolvedText: `Research Paper reference URL: ${trimmed}` };
}

// API: Analyze research paper abstract, title, or URL
app.post('/api/analyze', async (req, res) => {
  const startTime = Date.now();
  try {
    const { abstract, title } = req.body;
    if (!abstract || typeof abstract !== 'string' || !abstract.trim()) {
      return res.status(400).json({ error: 'Please provide a valid research paper title, abstract, or URL.' });
    }

    const { resolvedText, detectedTitle } = await resolveUrlContent(abstract);
    const effectiveTitle = title || detectedTitle || '';

    console.log(`[API /analyze] Processing: "${effectiveTitle || 'Untitled'}"`);

    const prompt = `You are an expert AI Research Paper Assistant helping undergraduate and graduate students thoroughly deconstruct academic papers.
Analyze the following research paper input (which may be an abstract, paper title, or paper URL/summary).

Paper Title (if provided): ${effectiveTitle || 'Not specified'}

Paper Input Content:
"""
${resolvedText}
"""

Few-shot reference examples:
Example 1:
Input: Deep Learning for Image Classification
Summary: This paper proposes deep learning models for image classification.
Method: CNN
Advantage: High accuracy
Limitation: Needs large datasets.

Example 2:
Input: Blockchain for Healthcare
Summary: Uses blockchain for secure medical records.
Method: Distributed Ledger
Advantage: Security
Limitation: Scalability.

Now generate a structured, comprehensive, student-friendly analysis with:
1. title: The actual academic title of the paper.
2. summary: Accessible summary for students (2-3 sentences).
3. problemStatement: What fundamental problem or limitation of prior work does this address?
4. methodology: Clear breakdown of the architecture, algorithms, data, and experimental procedure.
5. keyContributions: 3-5 bullet points of primary novel contributions.
6. mermaidFlowchart: A valid Mermaid.js flowchart string (starting with "flowchart TD") representing the architecture/system pipeline (e.g. Input -> Preprocessing -> Key Layers/Mechanisms -> Loss/Training -> Evaluation/Output). Use plain labels with alphanumeric IDs, e.g. A[Input] --> B[Encoder].
7. advantages: 3-4 strengths, efficiency gains, accuracy improvements over prior work.
8. limitations: 3-4 constraints, data requirements, computational complexity, or edge cases.
9. futureWork: 2-3 promising research extensions or open questions.
10. projectIdeas: 2-3 concrete student projects or thesis ideas with title, difficulty (Beginner/Intermediate/Advanced), techStack array, and deliverable description.
11. studentTakeaway: Plain conversational English TL;DR.
12. keyConcepts: 3-4 technical terms or acronyms explained simply.
13. readingDifficulty: Beginner, Intermediate, or Advanced.`;

    const response = await generateWithModelFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: paperAnalysisSchema,
        temperature: 0.2,
      },
    });

    const text = response.text;
    console.log(`[API /analyze] Completed in ${Date.now() - startTime}ms`);
    if (!text) {
      throw new Error('No content returned from Gemini model.');
    }

    const parsed = parseJsonSafe(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error(`[API /analyze] Error in ${Date.now() - startTime}ms:`, error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze paper. Please check the input or try again.',
    });
  }
});

// API: Search research topic to discover relevant papers
app.post('/api/search-topic', async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({ error: 'Please provide a research topic to search.' });
    }

    const prompt = `You are an AI Research Paper Agent. A student wants to explore the research topic: "${topic.trim()}".
Generate a structured response with:
1. A concise 2-sentence overview of this research domain for students.
2. A curated collection of 3 seminal or trending research papers in this field.
For each paper provide:
- Realistic/Actual well-known Title
- Authors (e.g. "Vaswani et al.")
- Year of publication
- Venue (e.g. NeurIPS, ICML, Nature, IEEE)
- A concise, realistic abstract (~70-100 words) covering objective, method, and outcome
- A 1-sentence Key Takeaway for students
- 2-3 category tags

Ensure abstracts are concise and ready for one-click student analysis.`;

    const response = await generateWithModelFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: topicSearchSchema,
        temperature: 0.2,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No content returned from Gemini model.');
    }

    const parsed = parseJsonSafe(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error searching research topic:', error);
    return res.status(500).json({
      error: error.message || 'Failed to search research topic. Please try again.',
    });
  }
});

// API: Ask student follow-up question about the paper
app.post('/api/ask-question', async (req, res) => {
  try {
    const { abstract, analysis, question } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Please provide a question.' });
    }

    const prompt = `You are the AI Research Paper Agent acting as a supportive, brilliant tutor for a student.
The student has a question about the following research paper:

Paper Title: ${analysis?.title || 'Research Paper'}
Abstract:
"""
${abstract || 'No abstract provided'}
"""

Analysis Summary:
Summary: ${analysis?.summary || 'N/A'}
Problem: ${analysis?.problemStatement || 'N/A'}
Method: ${analysis?.methodology || 'N/A'}
Contributions: ${(analysis?.keyContributions || []).join('; ')}
Advantages: ${(analysis?.advantages || []).join('; ')}
Limitations: ${(analysis?.limitations || []).join('; ')}

Student Question:
"${question.trim()}"

Provide a clear, engaging, easy-to-understand explanation. Break down equations, jargon, or concepts intuitively with analogies if helpful. Keep it within 2-3 concise paragraphs.`;

    const response = await generateWithModelFallback({
      contents: prompt,
      config: {
        temperature: 0.4,
      },
    });

    return res.json({ answer: response.text || 'No response generated.' });
  } catch (error: any) {
    console.error('Error answering question:', error);
    return res.status(500).json({
      error: error.message || 'Failed to answer student question.',
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Research Paper Agent server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
