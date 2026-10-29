# AI Research Paper Agent 🎓

An intelligent full-stack academic research assistant built for students and researchers to understand, deconstruct, and implement scientific research papers.

## Features

- **Home Page**: Clean interface titled **"AI Research Paper Agent"**.
- **Universal Input**: Paste a research paper title, abstract, or paper URL (including direct arXiv links).
- **Comprehensive Academic Deconstruction**:
  - **Summary**: Clear, accessible summary of the paper.
  - **Problem Statement**: The core research question, real-world motivation, and limitations of prior baselines.
  - **Methodology**: Systematic breakdown of the architectures, algorithms, and experimental procedures.
  - **Key Contributions**: Primary scientific breakthroughs and empirical milestones.
  - **Mermaid Architecture Flowchart**: Interactive, visual Mermaid.js diagram illustrating the model and data pipeline.
  - **Advantages & Strengths**: Competitive benefits over existing work.
  - **Limitations & Constraints**: Data requirements, computational costs, and boundary edge cases.
  - **Future Work**: Promising research frontiers and open questions.
  - **Internship & Project Ideas**: Actionable hands-on capstone and student portfolio projects with difficulty levels and recommended tech stacks.
  - **Student Glossary**: Key technical terms demystified for learners.
- **Topic Search**: Explore research domains with curated seminal and trending research papers ready to analyze with 1 click.
- **Interactive AI Paper Tutor**: Ask follow-up questions directly about the paper's math, code, or methodology.
- **Light & Dark Mode**: Seamless theme switching with system preference detection and smooth transitions.
- **Saved History**: Local browser session persistence for easy revision.
- **Export & Share**: Copy full structured notes or export directly to clean Markdown.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Mermaid.js
- **Backend**: Node.js, Express, tsx
- **AI Engine**: Google Gemini API (`@google/genai`) with server-side proxy routes and resilient model fallback
- **Build Tool**: Vite

## Project Structure

```
├── server.ts                    # Express server with Gemini integration and Vite middleware
├── src/
│   ├── main.tsx                 # Client entry point
│   ├── App.tsx                  # Primary React application component
│   ├── types.ts                 # TypeScript interfaces for paper analysis and topics
│   ├── index.css                # Tailwind CSS v4 global styling & dark mode variants
│   ├── components/
│   │   ├── Header.tsx           # Navigation bar with dark/light mode toggle
│   │   ├── AnalysisCards.tsx    # Clean cards displaying structured paper breakdown
│   │   ├── MermaidViewer.tsx    # Interactive Mermaid architecture flowchart renderer
│   │   ├── ProjectIdeasCard.tsx # Student internship & capstone project proposals
│   │   ├── StudentTutorChat.tsx # Interactive Q&A AI tutor for analyzed papers
│   │   ├── TopicSearchSection.tsx# Topic explorer with paper discovery
│   │   └── SavedPapers.tsx      # Local history & saved paper management
│   └── data/
│       └── samples.ts           # Pre-loaded few-shot examples and popular topics
├── index.html                   # HTML entry point with synchronized metadata
├── metadata.json                # AI Studio applet configuration
├── package.json                 # Dependencies and execution scripts
├── tsconfig.json                # TypeScript compiler configuration
└── vite.config.ts               # Vite bundler configuration
```

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   ```bash
   GEMINI_API_KEY="your-google-gemini-api-key"
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## License

Apache-2.0
