export interface SamplePaper {
  id: string;
  title: string;
  category: string;
  badge: string;
  abstract: string;
}

export const SAMPLE_PAPERS: SamplePaper[] = [
  {
    id: 'deep-learning-image-classification',
    title: 'Deep Learning for Image Classification',
    category: 'Computer Vision & AI',
    badge: 'Example 1',
    abstract: `We train a large, deep convolutional neural network (CNN) to classify the 1.2 million high-resolution images in the ImageNet LSVRC-2010 contest into the 1000 different classes. On the test data, we achieve top-1 and top-5 error rates of 37.5% and 17.0% which is considerably better than the previous state-of-the-art. The neural network, which has 60 million parameters and 650,000 neurons, consists of five convolutional layers, some of which are followed by max-pooling layers, and three fully-connected layers with a final 1000-way softmax. To make training faster, we use non-saturating neurons (ReLU) and a very efficient GPU implementation of the convolution operation. To reduce overfitting in the fully-connected layers we employed a recently-developed regularization method called "dropout" that proved to be very effective. However, the architecture strictly relies on millions of annotated training samples and requires significant GPU computing resources.`,
  },
  {
    id: 'blockchain-healthcare',
    title: 'Blockchain for Healthcare: Secure Medical Records',
    category: 'Health Informatics & Security',
    badge: 'Example 2',
    abstract: `Managing electronic medical records across disparate healthcare providers poses severe challenges regarding data integrity, privacy preservation, and interoperability. In this paper, we propose a decentralized healthcare data management system based on distributed ledger blockchain technology. Patient data is encrypted cryptographically, with access control rules governed by smart contracts deployed across a permissioned consortium network. Audit trails are cryptographically immutable, guaranteeing tamper-proof logs for medical histories and patient consent management. While our empirical evaluation demonstrates robust resilience against unauthorized data alteration and single-point-of-failure vulnerabilities, transaction throughput latency and ledger storage expansion present scalability challenges under enterprise medical data volumes.`,
  },
  {
    id: 'attention-is-all-you-need',
    title: 'Attention Is All You Need',
    category: 'Natural Language Processing',
    badge: 'Seminal Transformer',
    abstract: `The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU. Despite this, self-attention exhibits quadratic computational complexity with respect to sequence length, restricting standard Transformer architectures on extremely long document contexts.`,
  },
  {
    id: 'crispr-cas9',
    title: 'CRISPR-Cas9 System for Targeted Genome Engineering',
    category: 'Genomics & Molecular Biology',
    badge: 'Biotechnology',
    abstract: `Functional interrogation of genetic elements in biological systems requires precise tools for targeted genetic perturbation. Here, we describe an engineered system based on the microbial CRISPR (clustered regularly interspaced short palindromic repeats) associated Cas9 endonuclease that facilitates RNA-guided site-specific cleavage of double-stranded genomic DNA in eukaryotic organisms. By pairing Cas9 with synthetic short guide RNAs (sgRNAs), specific loci within the human genome can be cleaved with high precision to initiate non-homologous end joining or homology-directed repair. The system offers unprecedented programmability and multiplexing capacity compared to zinc-finger nucleases and TALENs, though off-target cleavage at non-intended genomic loci and variable delivery efficiency in vivo remain critical limitations currently undergoing engineering refinement.`,
  },
  {
    id: 'arxiv-transformers-url',
    title: 'arXiv:1706.03762 (Attention Is All You Need)',
    category: 'Paper URL / arXiv',
    badge: 'arXiv URL',
    abstract: 'https://arxiv.org/abs/1706.03762',
  },
];

export const POPULAR_TOPICS = [
  'Deep Learning for Image Classification',
  'Blockchain for Healthcare',
  'Transformer Self-Attention Mechanisms',
  'Diffusion Models for Generative Art',
  'Quantum Computing in Drug Discovery',
  'Reinforcement Learning with Human Feedback (RLHF)',
  'CRISPR Genome Editing',
  'Zero-Knowledge Proofs in Cryptography',
];
