import React, { useState, useEffect } from 'react';
import {
  Sun, Moon, Database, Zap, Maximize, Target, Activity, Layers,
  Terminal, Server, Box, Cpu, Braces, ChevronRight, FileCode2, Shield,
  FlaskConical, Dna, Microscope, Link, Award, BarChart3, Binary, Atom, Globe, Frame
} from 'lucide-react';
import { motion } from 'motion/react';
import Molecule3D from './components/Molecule3D';
import universalityImg from './assets/universality.png';
import structuralImg from './assets/structural.png';
import openscienceImg from './assets/openscience.png';
import coreCapabilitiesImg from './assets/core_capabilities.png';
import hierarchyStackImg from './assets/hierarchy_stack.png';
import pipelineIngestionImg from './assets/pipeline_ingestion.png';
import pipelinePackingImg from './assets/pipeline_packing.png';
import pipelineFramingImg from './assets/pipeline_framing.png';
import pipelineMaskingImg from './assets/pipeline_masking.png';
import pretrainingImg from './assets/pretraining.png';
import smallMoleculeImg from './assets/small_molecule.png';
import proteinProbingImg from './assets/protein_probing.png';
import benchmarkingProgressImg from './assets/benchmarking_progress.png';


const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string, key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const DOWNSTREAM_TASKS = [
  {
    category: "Small Molecules",
    icon: <Atom size={18} />,
    color: "teal",
    tasks: [
      { 
        name: "01. Quantum Property Prediction (SOTA)", 
        paper: "QM7, QM8", 
        goal: "MIND’s explicit (X, Y, Z) coordinate-binning allows it to internalize the fundamental electronic properties of molecules.", 
        data: "QM7, QM8", 
        result: "50.0 MAE on QM7 (15% improvement)", 
        insight: "By outperforming specialized quantum models like GEM (58.9) and MolCLR (66.8), MIND demonstrates that a universal foundation can surpass domain-specific architectures in high-precision energy prediction.",
        isSota: true 
      },
      { 
        name: "02. Medicinal Chemistry & Bioactivity", 
        paper: "HIV, Tox21, BACE", 
        goal: "Evaluated across the MoleculeNet physiology suite, MIND shows robust performance in predicting drug efficacy and toxicity.", 
        data: "HIV, Tox21, BACE", 
        result: "77.8 ROC-AUC (HIV) | 72.8 ROC-AUC (Tox21)", 
        insight: "This confirms the model's ability to translate 3D structural representations into actionable biological insights, making it a powerful tool for early-stage therapeutic screening." 
      },
      { 
        name: "03. Physicochemical Property Regression", 
        paper: "ESOL, FreeSolv, Lipo", 
        goal: "MIND provides a highly reliable baseline for physical chemistry, ensuring the model can be deployed as an 'all-rounder' for general property screening.", 
        data: "ESOL, FreeSolv, Lipophilicity", 
        result: "1.016 RMSE (ESOL) | 0.883 RMSE (Lipo)", 
        insight: "The stability of results across solubility and lipophilicity tasks confirms its readiness for standard drug discovery pipelines." 
      }
    ]
  },
  {
    category: "Proteins",
    icon: <Dna size={18} />,
    color: "blue",
    tasks: [
      { 
        name: "01. Secondary Structure Prediction (Probing)", 
        paper: "PDB (Structural Probing)", 
        goal: "By using a frozen backbone, we demonstrate that MIND’s self-supervised pretraining successfully captures the 'grammar of folding' directly from 3D coordinates.", 
        data: "PDB (Frozen Backbone)", 
        result: "65.1% Accuracy | 0.607 Macro-F1", 
        metricBreakdown: "Helices (H): 81.3% | Sheets (E): 70.9% | Coils (C): 56.7%",
        insight: "By using a frozen backbone, we demonstrate that MIND’s self-supervised pretraining successfully captures the \"grammar of folding\" directly from 3D coordinates. The model’s high sensitivity to Helices and Sheets confirms that its internal representational space is naturally aligned with the fundamental structural motifs of the proteome.",
        method: "Frozen Pretrained Backbone + Linear Head"
      }
    ]
  },
  {
    category: "RNA",
    icon: <Activity size={18} />,
    color: "emerald",
    isPlaceholder: true,
    status: "Benchmarking in Progress",
    description: "MIND is currently being evaluated across diverse RNA structural motifs and complex protein-ligand interaction datasets. Results for these modalities are updated weekly as we move through our validation pipeline.",
    upcoming: "ncRNA family classification",
    tasks: []
  },
  {
    category: "Multi-Modal",
    icon: <Link size={18} />,
    color: "purple",
    isPlaceholder: true,
    status: "Benchmarking in Progress",
    description: "MIND is currently being evaluated across diverse RNA structural motifs and complex protein-ligand interaction datasets. Results for these modalities are updated weekly as we move through our validation pipeline.",
    upcoming: "RNA-Protein binding prediction",
    tasks: []
  }
];

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="bg-[#f0fdfa] dark:bg-[#020c0b] text-slate-900 dark:text-slate-100 min-h-screen w-full overflow-x-hidden select-none font-sans transition-colors duration-500">

      {/* Loading Overlay */}
      <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#f0fdfa] dark:bg-[#020c0b] transition-opacity duration-1000 pointer-events-none ${isReady ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex flex-col items-center gap-6">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-teal-600 dark:text-teal-400 font-mono text-sm tracking-widest animate-pulse">LOADING...</div>
        </div>
      </div>

      <div className={`transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}>



        {/* Theme Toggle */}
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 hover:bg-emerald-200/50 dark:hover:bg-emerald-800/30 backdrop-blur-md border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} className="text-teal-400" /> : <Moon size={20} className="text-teal-600" />}
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden backdrop-blur-[3px]">
          <div className="atmosphere"></div>

          <div className="absolute inset-0 z-10 pointer-events-none">
            <Molecule3D isDarkMode={isDarkMode} onLoaded={() => setIsReady(true)} />
          </div>

          <div className="w-full max-w-6xl px-6 z-20 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex items-center mb-8">
                <div className="relative group cursor-default">
                  {/* Outer glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>

                  {/* Main badge body */}
                  <div className="relative px-4 py-1.5 rounded-full bg-white/40 dark:bg-emerald-950/20 backdrop-blur-xl border border-teal-500/30 dark:border-teal-400/20 flex items-center gap-3 shadow-[0_0_20px_rgba(45,212,191,0.1)] transition-all duration-500 group-hover:border-teal-500/50">
                    <div className="relative flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                      <div className="absolute w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping opacity-75"></div>
                    </div>
                    <span className="text-[10px] tracking-[0.4em] font-bold text-teal-900 dark:text-teal-300 uppercase">
                      MIND
                    </span>
                  </div>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tighter leading-[1.1] mb-8 drop-shadow-2xl">
                <span className="block">Molecular</span>
                <span className="block">Intelligence for</span>
                <span className="block text-teal-600 dark:text-teal-400 font-normal">Novel Discovery</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base md:text-xl font-light leading-relaxed mb-12 max-w-2xl mx-auto drop-shadow-sm">
                A universal foundation model that establishes a shared "language of life" across all molecular scales, from small organic compounds to complex biomolecules.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
                <a href="#mission" className="px-6 py-3 bg-emerald-900 dark:bg-emerald-100 text-white dark:text-emerald-900 rounded-lg text-sm font-medium hover:bg-emerald-800 dark:hover:bg-emerald-200 transition-colors shadow-sm">
                  Explore MIND
                </a>
                <div className="flex flex-col pl-4 border-l-2 border-emerald-200 dark:border-emerald-800/50">
                  <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium">Current Status</span>
                  <span className="text-sm font-semibold text-emerald-900 dark:text-white">Finetuning Downstream</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mission Section */}
        <div id="mission" className="py-32 px-6 md:px-20 relative z-20 bg-[#F4F6F2] dark:bg-[#020c0b] border-t border-emerald-100/50 dark:border-emerald-900/10 transition-colors duration-500">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <FadeIn>
                <h2 className="text-sm font-mono text-emerald-600 dark:text-emerald-400 tracking-[0.2em] uppercase mb-6">Our Mission</h2>
                <h3 className="text-4xl md:text-6xl font-light leading-tight mb-8 text-slate-900 dark:text-white">
                  Unifying the Biological and <br />
                  <span className="text-emerald-600 dark:text-emerald-400 italic font-normal">Chemical Universe</span>
                </h3>
                <p className="text-slate-700 dark:text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-4xl mx-auto">
                  MIND is the first foundation model designed to speak the universal language of every molecule. By treating 3D atomic coordinates as a high-dimensional narrative, we enable AI to reason across the entire spectrum of life—from simple drug-like compounds to complex macromolecular systems.
                </p>
              </FadeIn>
            </div>

            <div className="space-y-32">
              {/* Pillar 1 */}
              <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                <div className="w-full lg:w-1/2">
                  <FadeIn delay={0.1}>
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-emerald-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                      <img
                        src={universalityImg}
                        alt="Radical Universality"
                        className="relative rounded-3xl shadow-2xl border border-emerald-100 dark:border-emerald-900/30 w-full object-cover aspect-video"
                      />
                    </div>
                  </FadeIn>
                </div>
                <div className="w-full lg:w-1/2">
                  <FadeIn delay={0.2}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                        <Atom size={20} />
                      </div>
                      <span className="text-sm font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Pillar 01</span>
                    </div>
                    <h4 className="text-3xl font-light mb-6 text-slate-900 dark:text-white">Radical Universality</h4>
                    <p className="text-slate-700 dark:text-slate-400 text-lg font-light leading-relaxed">
                      Instead of fragmented, domain-specific models, MIND provides a single representational framework for proteins, RNA, and small molecules. We break down the silos of molecular AI to enable true cross-domain discovery.
                    </p>
                  </FadeIn>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
                <div className="w-full lg:w-1/2">
                  <FadeIn delay={0.1}>
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-teal-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                      <img
                        src={structuralImg}
                        alt="Structural Intelligence"
                        className="relative rounded-3xl shadow-2xl border border-teal-100 dark:border-teal-900/30 w-full object-cover aspect-video"
                      />
                    </div>
                  </FadeIn>
                </div>
                <div className="w-full lg:w-1/2">
                  <FadeIn delay={0.2}>
                    <div className="flex items-center gap-3 mb-6 lg:justify-end">
                      <span className="text-sm font-mono text-teal-600 dark:text-teal-400 uppercase tracking-widest">Pillar 02</span>
                      <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg text-teal-600 dark:text-teal-400">
                        <Dna size={20} />
                      </div>
                    </div>
                    <h4 className="text-3xl font-light mb-6 text-slate-900 dark:text-white lg:text-right">Structural Intelligence</h4>
                    <p className="text-slate-700 dark:text-slate-400 text-lg font-light leading-relaxed lg:text-right">
                      Our structure-aware architecture doesn't just see sequences; it internalizes the 3D geometry of life. By reasoning directly over atomic spatial arrangements, MIND captures the hidden biophysical grammar that dictates how molecules fold, bind, and function.
                    </p>
                  </FadeIn>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                <div className="w-full lg:w-1/2">
                  <FadeIn delay={0.1}>
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-emerald-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                      <img
                        src={openscienceImg}
                        alt="Open-Science Foundation"
                        className="relative rounded-3xl shadow-2xl border border-emerald-100 dark:border-emerald-900/30 w-full object-cover aspect-video"
                      />
                    </div>
                  </FadeIn>
                </div>
                <div className="w-full lg:w-1/2">
                  <FadeIn delay={0.2}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                        <Globe size={20} />
                      </div>
                      <span className="text-sm font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Pillar 03</span>
                    </div>
                    <h4 className="text-3xl font-light mb-6 text-slate-900 dark:text-white">Open-Science Foundation</h4>
                    <p className="text-slate-700 dark:text-slate-400 text-lg font-light leading-relaxed">
                      MIND isn't just a model; it's a programmatic tool for the global community. We are committed to an open-research ecosystem, providing the architecture and weights needed to catalyze independent breakthroughs in human health and chemistry.
                    </p>
                  </FadeIn>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Capabilities Section */}
        <div id="capabilities" className="py-32 px-6 md:px-20 relative z-20 bg-white dark:bg-[#020c0b] transition-colors duration-500">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center mb-24">
                <h2 className="text-sm font-mono text-emerald-600 dark:text-emerald-400 tracking-[0.2em] uppercase mb-6">Core Capabilities</h2>
                <h3 className="text-4xl md:text-5xl font-light leading-tight mb-8 text-slate-900 dark:text-white">
                  Engineered for extreme throughput and <br />
                  <span className="text-emerald-600 dark:text-emerald-400 italic font-normal">robust molecular reasoning.</span>
                </h3>
              </div>
            </FadeIn>

            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="w-full lg:w-1/2 space-y-12">
                {[
                  {
                    num: "01",
                    title: "Unified Multimodal Representation",
                    desc: "MIND establishes a single latent space for proteins, RNA, and small molecules. By moving beyond domain-specific models, the architecture enables seamless cross-domain transfer learning and zero-shot generalization across the chemical and biological universe."
                  },
                  {
                    num: "02",
                    title: "Sub-Angstrom Coordinate Awareness",
                    desc: "The model reasons directly over 3D spatial arrangements through explicit log-binning of (X, Y, Z) coordinates. This captures the precise biophysical nuances—distances and orientations—that dictate how molecules fold and interact in the real world."
                  },
                  {
                    num: "03",
                    title: "High-Throughput Batch Optimization",
                    desc: "To maximize GPU efficiency, MIND utilizes dynamic padding and sequence packing governed by a target token budget. Instead of fixed sequence counts, batches are populated to peak density, drastically reducing memory overhead and accelerating training on gigascale datasets."
                  },
                  {
                    num: "04",
                    title: "Standardized Residue Topology",
                    desc: "MIND employs virtual atom insertion to standardize residue representations and prevent structural \"shortcuts\" during training. These virtual nodes strengthen geometric grounding, forcing the model to internalize the true biophysical grammar of molecular structures."
                  }
                ].map((pillar, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="group cursor-default">
                      <div className="flex items-start gap-6">
                        <span className="text-lg font-mono text-emerald-500/50 dark:text-emerald-400/30 group-hover:text-emerald-500 transition-colors duration-300 pt-1">
                          {pillar.num}
                        </span>
                        <div>
                          <h4 className="text-xl font-medium mb-3 text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                            {pillar.title}
                          </h4>
                          <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed text-sm md:text-base">
                            {pillar.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>

              <div className="w-full lg:w-1/2">
                <FadeIn delay={0.3}>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-emerald-500/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative glass-panel p-2 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/30 overflow-hidden shadow-2xl">
                      <img
                        src={coreCapabilitiesImg}
                        alt="Core Capabilities Illustration"
                        className="w-full h-auto rounded-[2rem] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/10 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Decorative academic accents */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-emerald-500/20 rounded-tr-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-emerald-500/20 rounded-bl-3xl pointer-events-none"></div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>

        {/* Architecture Section */}
        <div className="py-24 px-6 md:px-20 relative z-20 bg-emerald-50/30 dark:bg-[#020c0b]/50 border-y border-emerald-100/50 dark:border-emerald-900/20">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <FadeIn>
                <div className="flex items-center mb-6">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-xs font-medium text-teal-700 dark:text-teal-400">
                    <Cpu size={14} />
                    <span>Architecture</span>
                  </div>
                </div>
                <h2 className="text-3xl md:text-5xl font-light mb-8 leading-tight">
                  Advanced Structural Architecture <br /> <span className="text-teal-600 dark:text-teal-400">Scaling ModernBERT</span>
                </h2>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="mt-1"><Layers size={20} className="text-teal-500" /></div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">Hierarchical Positional Encodings</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-light leading-relaxed">
                        MIND extends the ModernBERT encoder with a multi-tier embedding system. <strong>Slot Indexing</strong> encodes relative positions of larger structural units (residues, motifs), while <strong>Atom-Level Resolution</strong> maps every individual atom to its specific structural slot.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1"><Zap size={20} className="text-teal-500" /></div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">Flash Attention & High-Throughput Scaling</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-light leading-relaxed">
                        The model leverages Flash Attention to handle the massive computational demands of gigascale molecular datasets, ensuring near-peak hardware efficiency during training and inference.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1"><Shield size={20} className="text-teal-500" /></div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">Sequence-Aware Attention Masking</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-light leading-relaxed">
                        To support high-density packing, our attention masks are strictly aware of individual `sequence_ids`, preventing information "bleed" between independent molecules packed into the same training window.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="w-full lg:w-1/2">
              <FadeIn delay={0.2}>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-emerald-500/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative glass-panel p-2 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/30 overflow-hidden shadow-2xl">
                    <img
                      src={hierarchyStackImg}
                      alt="Hierarchical Embedding Stack"
                      className="w-full h-auto rounded-[1.5rem] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/5 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>

        {/* Data Pipeline Section */}
        <div id="pipeline" className="py-32 px-6 md:px-20 relative z-20 bg-[#F4F6F2] dark:bg-[#020c0b] transition-colors duration-500">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center mb-24">
                <h2 className="text-sm font-mono text-emerald-600 dark:text-emerald-400 tracking-[0.2em] uppercase mb-6">The Molecular Data Pipeline</h2>
                <h3 className="text-4xl md:text-6xl font-light leading-tight mb-8 text-slate-900 dark:text-white">
                  From Raw Atomic Shards to <br />
                  <span className="text-emerald-600 dark:text-emerald-400 italic font-normal">Foundation Intelligence</span>
                </h3>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {[
                {
                  num: "01",
                  title: "Gigascale Stream Ingestion",
                  icon: <Layers size={22} />,
                  image: pipelineIngestionImg,
                  desc: "To handle datasets far exceeding system memory, MIND utilizes a sharded streaming architecture. By implementing dual-level shuffling (at both the shard and intra-shard levels), the pipeline ensures high data stochasticity while maintaining a constant memory footprint, enabling seamless training on billions of molecular tokens."
                },
                {
                  num: "02",
                  title: "Long-Context Adaptive Packing & Random Cropping",
                  icon: <Box size={22} />,
                  image: pipelinePackingImg,
                  desc: "Our pipeline dynamically packs molecules into ultra-long 32,768-token context windows. For massive macromolecules—including large-scale proteins and RNA—we implement stochastic residue-wise cropping. This ensures every structure fits the attention budget while acting as a powerful data augmentation tool, forcing the model to learn robust features from diverse structural fragments."
                },
                {
                  num: "03",
                  title: "Residue Framing & Identity",
                  icon: <Frame size={22} />,
                  image: pipelineFramingImg,
                  desc: "To manage structural heterogeneity, MIND utilizes Virtual Atom Insertion to standardize residue sequence length. Beyond batch alignment, these nodes geometrically encode residue identity, providing the model with a robust structural fingerprint for every subunit. This ensures a consistent biophysical grammar across all molecular classes."
                },
                {
                  num: "04",
                  title: "Multi-Scale Masking Strategies",
                  icon: <Shield size={22} />,
                  image: pipelineMaskingImg,
                  desc: "MIND is trained using a sophisticated structure-aware masking protocol. The pipeline supports both Atomic Masking (hiding specific 4-token atom blocks) and Residue-Block Masking (hiding entire amino acid or nucleotide units). This dual approach forces the model to learn both local chemical bonding and high-level biological motifs."
                }
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 0.15}>
                  <div className="group relative glass-panel p-2 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/30 overflow-hidden bg-white/40 dark:bg-emerald-950/5 hover:border-emerald-500/50 transition-all duration-500 shadow-xl">
                    <div className="relative aspect-[21/9] mb-8 overflow-hidden rounded-[2rem]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal opacity-90 dark:opacity-100 group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-50/50 dark:from-emerald-950/20 to-transparent"></div>
                    </div>

                    <div className="px-8 pb-8 flex items-start gap-6">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-mono text-emerald-500/50 dark:text-emerald-400/50 uppercase tracking-widest">{item.num}</span>
                          <h4 className="text-2xl font-medium text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed text-sm md:text-base">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>

        {/* Self-Supervised Pretraining Section */}
        <div id="pretraining" className="py-32 px-6 md:px-20 relative z-20 bg-white dark:bg-[#020c0b] transition-colors duration-500">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center mb-24">
                <h2 className="text-sm font-mono text-emerald-600 dark:text-emerald-400 tracking-[0.2em] uppercase mb-6">Self-Supervised Pretraining</h2>
                <h3 className="text-4xl md:text-6xl font-light leading-tight mb-8 text-slate-900 dark:text-white">
                  Mastering the Hidden Grammar of <br />
                  <span className="text-emerald-600 dark:text-emerald-400 italic font-normal">the Molecular Universe</span>
                </h3>
              </div>
            </FadeIn>

            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="w-full lg:w-1/2 space-y-12">
                {[
                  {
                    num: "01",
                    title: "The Universal Learning Objective",
                    desc: "MIND is trained using a 3D-Aware Masked Language Modeling (MLM) objective. By masking both atomic coordinates and residue identities across 32k-token windows, the model is forced to reconstruct missing structural information. This process compels the architecture to internalize the fundamental laws of biophysics—from covalent bonding in small molecules to the complex tertiary folding of proteins and RNA."
                  },
                  {
                    num: "02",
                    title: "Large-Scale Compute & Convergence",
                    desc: "The model underwent intensive training on a high-performance GPU cluster, processing billions of molecular tokens. By leveraging our sequence packing and 32k-context window, we achieved unprecedented training density. The resulting loss curves demonstrate stable convergence across all molecular classes, indicating that MIND has successfully learned a unified representational framework that transcends traditional chemical silos."
                  },
                  {
                    num: "03",
                    title: "Emergent Structural Intelligence",
                    desc: "During pretraining, the model develops \"emergent\" capabilities. Without explicit supervision, MIND learns to recognize functional motifs, binding pockets, and evolutionary conserved sequences. This self-taught understanding of molecular \"grammar\" creates a powerful foundation that can be fine-tuned for a vast array of specialized biological tasks with minimal additional data."
                  }
                ].map((item, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="group cursor-default">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-800/50 group-hover:bg-teal-100 dark:group-hover:bg-teal-800/30 transition-all duration-300">
                          <span className="text-sm font-mono font-bold">{item.num}</span>
                        </div>
                        <div>
                          <h4 className="text-2xl font-medium mb-3 text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed text-sm md:text-base">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>

              <div className="w-full lg:w-1/2">
                <FadeIn delay={0.3}>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-teal-500/20 via-emerald-500/20 to-teal-500/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative glass-panel p-2 rounded-[2.5rem] border border-teal-100 dark:border-teal-900/30 overflow-hidden shadow-2xl">
                      <img
                        src={pretrainingImg}
                        alt="Self-Supervised Pretraining Illustration"
                        className="w-full h-auto rounded-[2rem] object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-teal-950/10 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Floating data pulse decoration */}
                    <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>

        {/* Downstream Tasks Section */}
        <div className="py-24 px-6 md:px-20 relative z-20 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center mb-16">
                <div className="flex justify-center items-center mb-6">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-xs font-medium text-teal-700 dark:text-teal-400">
                    <Award size={14} />
                    <span>Benchmarks</span>
                  </div>
                </div>
                <h2 className="text-3xl md:text-5xl font-light mb-4">Downstream Evaluations</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light">
                  MIND is rigorously tested across the biological and chemical spectrum, from quantum properties to complex protein-ligand interactions.
                </p>
              </div>
            </FadeIn>

            {/* Tabs */}
            <FadeIn delay={0.1}>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {DOWNSTREAM_TASKS.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 border ${activeTab === idx
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/50 text-slate-600 dark:text-slate-400 hover:bg-emerald-100 dark:hover:bg-emerald-800/20'
                      }`}
                  >
                    {cat.icon}
                    {cat.category}
                  </button>
                ))}
              </div>
            </FadeIn>

            {/* Task Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[400px]">
              {/* Exhibit Image for Small Molecules, Proteins or Benchmarking Progress */}
              <FadeIn className="lg:col-span-2 mb-8">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-emerald-500/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative glass-panel p-2 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/30 overflow-hidden shadow-2xl bg-white/50 dark:bg-emerald-950/5">
                    <img
                      src={activeTab === 0 ? smallMoleculeImg : activeTab === 1 ? proteinProbingImg : benchmarkingProgressImg}
                      alt="Downstream Evaluation Exhibit"
                      className="w-full h-auto rounded-[1.5rem] object-cover max-h-[400px]"
                    />
                    <div className="absolute top-8 right-8">
                      <div className="px-4 py-2 bg-white/80 dark:bg-emerald-900/80 backdrop-blur-md border border-emerald-200 dark:border-emerald-700 rounded-full shadow-xl flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${DOWNSTREAM_TASKS[activeTab].isPlaceholder ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`}></div>
                        <span className="text-xs font-bold text-emerald-900 dark:text-emerald-100 uppercase tracking-widest">
                          {DOWNSTREAM_TASKS[activeTab].isPlaceholder ? 'Under Review' : 'Active Exhibit'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {DOWNSTREAM_TASKS[activeTab].isPlaceholder ? (
                <FadeIn className="lg:col-span-2">
                  <div className="glass-panel p-12 rounded-[2.5rem] border-2 border-dashed border-emerald-500/20 bg-emerald-500/5 text-center">
                    <div className="flex justify-center mb-8">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-emerald-500/10 border-t-emerald-500/40 animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Activity size={24} className="text-emerald-500/50 animate-pulse" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-medium mb-4 text-slate-800 dark:text-slate-200">{DOWNSTREAM_TASKS[activeTab].status}</h3>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed mb-8">
                      {DOWNSTREAM_TASKS[activeTab].description}
                    </p>
                    <div className="bg-white/50 dark:bg-emerald-950/20 px-8 py-6 rounded-2xl border border-emerald-500/10 inline-block text-left shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] block">Upcoming Benchmarks</span>
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{DOWNSTREAM_TASKS[activeTab].upcoming}</span>
                    </div>
                  </div>
                </FadeIn>
              ) : (
                DOWNSTREAM_TASKS[activeTab].tasks.map((task: any, i: number) => (
                  <FadeIn key={`${activeTab}-${i}`} delay={i * 0.1}>
                    <div className="glass-panel p-8 rounded-2xl h-full flex flex-col group hover:border-emerald-500/50 transition-all bg-white/40 dark:bg-emerald-950/5">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="text-xs font-mono text-emerald-500 dark:text-emerald-400 mb-1">{task.paper}</h4>
                          <h3 className="text-xl font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{task.name}</h3>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                            Active
                          </div>
                          {task.isSota && (
                            <div className="px-2 py-1 bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800 rounded text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1 shadow-sm">
                              <Award size={10} />
                              SOTA Performance
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-600 dark:text-slate-400 text-sm font-light leading-relaxed mb-6 flex-grow">
                        {task.insight || task.goal}
                      </p>

                      <div className="space-y-4 pt-6 border-t border-emerald-100/50 dark:border-emerald-900/10">
                        <div className="flex items-start gap-3">
                          <Database size={14} className="mt-1 text-slate-400" />
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">Primary Dataset</span>
                            <span className="text-xs text-slate-700 dark:text-slate-300">{task.data}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <BarChart3 size={14} className="mt-1 text-slate-400" />
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">Key Result</span>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">{task.result || task.metrics}</span>
                          </div>
                        </div>
                        {task.metricBreakdown && (
                          <div className="flex items-start gap-3">
                            <Binary size={14} className="mt-1 text-slate-400" />
                            <div>
                              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">Metric Breakdown</span>
                              <span className="text-xs text-slate-700 dark:text-slate-300">{task.metricBreakdown}</span>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <Binary size={14} className="mt-1 text-slate-400" />
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">{task.insight ? "Scientific Insight" : "Finetuning Approach"}</span>
                            <span className="text-xs text-slate-700 dark:text-slate-300 italic">{task.insight ? task.goal : task.method}</span>
                          </div>
                        </div>
                      </div>

                      {/* Result Placeholder */}
                      <div className="mt-8">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Model Precision</span>
                          <span className="text-[10px] font-mono text-emerald-500">{task.isSota ? "95% CONFIDENCE" : "VALIDATED"}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: task.isSota ? "95%" : "65%" }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className={`h-full bg-gradient-to-r ${task.isSota ? "from-amber-500 to-emerald-400" : "from-emerald-500 to-teal-400"}`}
                          />
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                ))
              )}
            </div>

            <FadeIn delay={0.4}>
              <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-emerald-900/10 to-teal-900/5 border border-emerald-500/20 text-center">
                <p className="text-slate-600 dark:text-slate-400 text-sm italic">
                  * Benchmarks are executed using a frozen backbone with supervised heads, or full finetuning where specified.
                  Comparison against SOTA (State of the Art) models is updated weekly.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Engineering Foundations Section */}
        <div id="engineering" className="py-24 px-6 md:px-20 relative z-20 bg-emerald-50/20 dark:bg-[#020c0b] text-slate-900 dark:text-slate-100 border-t border-emerald-100 dark:border-emerald-900/30">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center mb-16">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
                  <h2 className="text-3xl md:text-5xl font-light">Engineering Foundations</h2>
                  <div className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest flex items-center gap-2 shadow-sm h-fit">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    Repo: Internal/Private
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light">
                  Built for scalability, reproducibility, and high-performance research.
                </p>
              </div>
            </FadeIn>

            <div className="flex flex-col lg:flex-row gap-8">
              <FadeIn delay={0.1} className="w-full lg:w-5/12">
                <div className="bg-emerald-50/30 dark:bg-[#041a18] rounded-xl border border-emerald-100 dark:border-emerald-900/30 overflow-hidden shadow-2xl h-full flex flex-col p-8 space-y-8">
                  <div className="space-y-6">
                    <div className="group">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400">
                          <Box size={16} />
                        </div>
                        <h4 className="text-lg font-medium text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">Modular Architecture</h4>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-light leading-relaxed">
                        The MIND framework is designed with a strict separation of data-loading, atomic-level tokenization, and model logic, allowing for seamless integration of new molecular modalities.
                      </p>
                    </div>

                    <div className="group">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded text-purple-600 dark:text-purple-400">
                          <Cpu size={16} />
                        </div>
                        <h4 className="text-lg font-medium text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">Config-Driven Research</h4>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-light leading-relaxed">
                        All experiments are orchestrated via centralized YAML configurations, ensuring that hyperparameter sweeps and multi-source training runs are 100% reproducible.
                      </p>
                    </div>

                    <div className="group">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-1.5 bg-teal-100 dark:bg-teal-900/30 rounded text-teal-600 dark:text-teal-400">
                          <Terminal size={16} />
                        </div>
                        <h4 className="text-lg font-medium text-slate-900 dark:text-white group-hover:text-teal-500 transition-colors">Developer-First Tooling</h4>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-light leading-relaxed">
                        Includes dedicated debugging scripts for virtual atom padding and geometric encoding, ensuring the biophysical integrity of the pipeline at every step.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-emerald-100 dark:border-emerald-900/20">
                    <div className="flex items-start gap-3 bg-emerald-100/30 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100/50 dark:border-emerald-900/20">
                      <Shield size={18} className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest mb-1">Note on Availability</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                          The MIND source code is currently undergoing internal review and optimization. We are working toward a public release to support the open-source molecular discovery community.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.2} className="w-full lg:w-7/12">
                <div className="bg-emerald-50/30 dark:bg-[#020c0b] rounded-xl border border-emerald-100 dark:border-emerald-900/30 overflow-hidden shadow-2xl h-full font-mono text-sm flex flex-col">
                  <div className="bg-emerald-50/50 dark:bg-[#062421] px-4 py-3 border-b border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal size={16} className="text-emerald-500" />
                      <span className="text-emerald-800 dark:text-emerald-400">Terminal</span>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-emerald-200 dark:bg-emerald-900"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-200 dark:bg-emerald-900"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-200 dark:bg-emerald-900"></div>
                    </div>
                  </div>
                  <div className="p-6 overflow-y-auto flex-grow text-slate-700 dark:text-slate-300">
                    <div className="mb-4">
                      <span className="text-teal-600 dark:text-teal-400">$</span> <span className="text-slate-900 dark:text-white">pip install -e .</span>
                      <p className="text-slate-500 mt-1"># Install the mind package in editable mode</p>
                    </div>
                    <div className="mb-4">
                      <span className="text-teal-600 dark:text-teal-400">$</span> <span className="text-slate-900 dark:text-white">python scripts/train.py --config configs/mlm_multisource.yaml</span>
                      <p className="text-slate-500 mt-1"># Launch training using multisource configuration</p>
                      <div className="mt-2 text-slate-600 dark:text-slate-400 text-xs border-l-2 border-slate-300 dark:border-slate-700 pl-3 py-1">
                        [INFO] Loading config configs/mlm_multisource.yaml<br />
                        [INFO] Building dataloaders for Proteins, RNA, Small Molecules<br />
                        [INFO] Model constructed with ModernBERT and SlotPosWrapper<br />
                        [INFO] Training initialized.
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="text-teal-600 dark:text-teal-400">$</span> <span className="text-slate-900 dark:text-white">python scripts/demos/demo_virtual_atom.py</span>
                      <p className="text-slate-500 mt-1"># Run educational script for virtual atom padding mechanics</p>
                    </div>
                    <div className="mt-8 flex items-center gap-2 text-slate-500 animate-pulse">
                      <span className="text-teal-500">_</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-emerald-100 dark:border-emerald-900/30 py-8 text-center text-emerald-600/60 dark:text-emerald-400/40 text-xs font-mono">
          <p>MIND &copy; {new Date().getFullYear()} - Molecular Intelligence for Novel Discovery</p>
        </div>
      </div>
    </div>
  );
}
