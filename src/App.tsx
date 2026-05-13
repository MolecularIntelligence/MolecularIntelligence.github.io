import React, { useState, useEffect } from 'react';
import {
  Sun, Moon, Database, Zap, Maximize, Target, Activity, Layers,
  Terminal, Server, Box, Cpu, Braces, ChevronRight, FileCode2, Shield,
  FlaskConical, Dna, Microscope, Link, Award, BarChart3, Binary, Atom
} from 'lucide-react';
import { motion } from 'motion/react';
import Molecule3D from './components/Molecule3D';

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
      { name: "Molecular Property Prediction", paper: "Uni-Mol (2023)", goal: "Predicting biological, chemical, or physical properties of molecules.", data: "MoleculeNet (BBBP, BACE, Tox21, QM9, etc.)", metrics: "ROC-AUC / RMSE", method: "Uses [CLS] representation or mean of all atoms with a linear head." },
      { name: "Conformation Generation", paper: "Uni-Mol (2023)", goal: "Transforming initial 3D generative conformations into optimized stable states.", data: "GEOM-QM9, GEOM-Drugs", metrics: "Coverage (COV) / Matching (MAT)", method: "SE(3)-Equivariant head to predict coordinate updates iteratively." },
      { name: "Quantum Property Prediction", paper: "Uni-Mol2 (2024)", goal: "Predicting geometric, energetic, electronic, and thermodynamic properties.", data: "QM9 (HOMO, LUMO, gap, etc.)", metrics: "MAE", method: "Two-track transformer processing atom and pair features concurrently." },
      { name: "Molecular Property Prediction", paper: "ChemBERTa (2020)", goal: "Evaluating medicinal chemistry applications like toxicity and penetrability.", data: "MoleculeNet (BBBP, HIV, Tox21)", metrics: "ROC-AUC / PRC-AUC", method: "Linear classification layer on base model with full backpropagation." }
    ]
  },
  {
    category: "Proteins",
    icon: <Dna size={18} />,
    color: "blue",
    tasks: [
      { name: "Secondary Structure Prediction", paper: "ESM-1b (2021)", goal: "Predicting local 3D structure (8-class: helix, sheet, etc.) per residue.", data: "Structural Split", metrics: "8-class Accuracy", method: "Linear head trained on top of frozen representations." },
      { name: "Long-range Contact Prediction", paper: "ESM-1b (2021)", goal: "Identifying residue pairs far in sequence but close in 3D space.", data: "Structural Split benchmarks", metrics: "Top-L Precision", method: "Recovers structural info better than standard sequence profiles." },
      { name: "Remote Homology Detection", paper: "ESM-1b (2021)", goal: "Detecting shared structural folds with very low sequence similarity.", data: "Fold and Superfamily levels", metrics: "Hit-10, AUC", method: "Unsupervised classifier based on Euclidean distance in embedding space." },
      { name: "Atomic-Level Structure Prediction", paper: "ESMFold (2023)", goal: "Generating full 3D Cartesian coordinates for all atoms.", data: "CAMEO, CASP14", metrics: "TM-score, lDDT, RMSD", method: "Folding Trunk + Structure Module on top of 15B parameter model." }
    ]
  },
  {
    category: "RNA",
    icon: <Activity size={18} />,
    color: "emerald",
    tasks: [
      { name: "RNA Secondary Structure Prediction", paper: "ERNIE-RNA (2025)", goal: "Predicting base-pairing interactions, including complex pseudoknots.", data: "bpRNA-1m, ArchiveII", metrics: "F1-Score, Precision", method: "Zero-shot via attention heads or fine-tuned ResNet/CNN on embeddings." },
      { name: "RNA 3D Closeness / Contact Map", paper: "ERNIE-RNA (2025)", goal: "Identifying nucleotide pairs spatially close (< 8Å) in folded structure.", data: "RNAcontact (TR221/TS80)", metrics: "Long-Range Top-L Precision", method: "Feeding structure-aware attention maps into downstream ResNet." },
      { name: "ncRNA Family Classification", paper: "ERNIE-RNA (2025)", goal: "Categorizing non-coding RNA into functional families.", data: "Rfam v14 (88 families)", metrics: "Classification Accuracy", method: "4-layer ResNet classification head on pre-trained token embeddings." },
      { name: "APA Prediction", paper: "ERNIE-RNA (2025)", goal: "Predicting relative usage of proximal vs distal polyA sites.", data: "APARENT (BEACON benchmark)", metrics: "R² score (MSE)", method: "Regression head (1D Conv + ResNet layers) on pre-trained backbone." }
    ]
  },
  {
    category: "Multi-Modal",
    icon: <Link size={18} />,
    color: "purple",
    tasks: [
      { name: "Protein-Ligand Binding Pose", paper: "Uni-Mol (2023)", goal: "Predicting 3D complex structure of ligand in protein pocket.", data: "CASF-2016, PDBbind", metrics: "Top 1 Success Rate, RMSD < 2.0Å", method: "LBFGS optimization to refine coordinates from predicted distance matrices." },
      { name: "MS/MS Spectral Annotation", paper: "Bohde et al. (2025)", goal: "Predicting mass spectrometry fragmentation patterns for identification.", data: "GNPS / NPLIB1", metrics: "Spectral Similarity", method: "Contrastive Learning and Retrieval on 3D Cloud + Spectral data." },
      { name: "Stereochemistry Assignment", paper: "Orsi & Reymond (2024)", goal: "Translating 2D/3D structures into isomeric labels (R/S, E/Z).", data: "COCONUT Chiral Set", metrics: "Accuracy, Validity", method: "Classification / Seq2Seq on 3D Point Cloud / SMILES." },
      { name: "Membrane Permeability", paper: "PeptideMTR (2026)", goal: "Predicting how well complex peptides cross biological membranes.", data: "CycPeptMPDB", metrics: "R-squared, RMSE", method: "Regression on pooled representations from 3D Point Cloud." }
    ]
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
                Training an advanced Transformer encoder using Masked Language Modeling (MLM). Seamlessly mix heterogeneous datasets (Proteins, RNA, Small Molecules) with dynamic padding and virtual atoms.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
                <button className="px-6 py-3 bg-emerald-900 dark:bg-emerald-100 text-white dark:text-emerald-900 rounded-lg text-sm font-medium hover:bg-emerald-800 dark:hover:bg-emerald-200 transition-colors shadow-sm">
                  Explore Documentation
                </button>
                <div className="flex flex-col pl-4 border-l-2 border-emerald-200 dark:border-emerald-800/50">
                  <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium">Architecture</span>
                  <span className="text-sm font-semibold text-emerald-900 dark:text-white">ModernBERT Base</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-24 px-6 md:px-20 relative z-20 border-t border-emerald-100/50 dark:border-emerald-900/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              <div className="w-full lg:w-1/2">
                <FadeIn>
                  <h2 className="text-sm font-mono text-emerald-600 dark:text-emerald-400 tracking-[0.2em] uppercase mb-6">Our Mission</h2>
                  <h3 className="text-4xl md:text-5xl font-light leading-tight mb-8">
                    Bridging the Gap Between <br />
                    <span className="text-emerald-600 dark:text-emerald-400 italic font-normal">Sequence and Structure</span>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-lg font-light leading-relaxed mb-8">
                    MIND is a research initiative focused on building a unified foundation model for the biological and chemical universe. By treating molecular structures as a high-dimensional language, we enable AI to reason about proteins, RNA, and chemistry within a single, highly-scalable architecture.
                  </p>
                </FadeIn>
              </div>
              
              <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { label: "01", title: "Unified Foundation", desc: "A single encoder trained across Proteins, RNA, and Small Molecules simultaneously." },
                  { label: "02", title: "Massive Throughput", desc: "Sequence packing algorithms that maximize GPU utilization for gigascale datasets." },
                  { label: "03", title: "Geometric Awareness", desc: "Explicit coordinate-binning logic that preserves the 3D reality of molecular shapes." },
                  { label: "04", title: "Cross-Domain Intel", desc: "Transferring knowledge from protein domains to chemical binding motifs seamlessly." }
                ].map((item, i) => (
                  <FadeIn key={i} delay={0.2 + i * 0.1}>
                    <div className="flex flex-col p-6 rounded-2xl bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 group hover:border-emerald-500/30 transition-colors">
                      <span className="text-xs font-mono text-emerald-500 mb-4">{item.label}</span>
                      <h4 className="text-lg font-medium mb-2">{item.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="py-24 px-6 md:px-20 relative z-20">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-light mb-4">Core Capabilities</h2>
              <p className="text-slate-500 max-w-2xl mx-auto font-light">
                MIND is engineered for extreme throughput and robust handling of heterogeneous molecular topologies.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              { icon: <Database className="text-teal-500" />, title: "Multi-Source Training", desc: "Seamlessly mix heterogeneous datasets like Proteins, RNA, and Small Molecules." },
              { icon: <Maximize className="text-teal-500" />, title: "Advanced Sequence Packing", desc: "Pack multiple sequences into long context windows with a robust, stall-breaking algorithm." },
              { icon: <Box className="text-teal-500" />, title: "Dynamic Padding", desc: "Batches are efficiently padded, with virtual atoms inserted to standardize geometry encodings." },
              { icon: <Target className="text-teal-500" />, title: "Coordinate-Aware", desc: "Model and tokenizer handle atomic coordinates (X, Y, Z) explicitly via log-binning." },
              { icon: <Activity className="text-teal-500" />, title: "Granular Monitoring", desc: "Highly detailed, source-aware metrics and rolling window trackers for Weights & Biases." },
              { icon: <Layers className="text-teal-500" />, title: "Complex Embeddings", desc: "Optional SlotPosWrapper enables Slot and Atom-level hierarchical position embeddings." }
            ].map((feature, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="glass-panel p-8 rounded-2xl h-full hover:border-emerald-500/50 transition-all group">
                  <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-light text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
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
                  ModernBERT Base <br /> <span className="text-teal-600 dark:text-teal-400">&</span> Hierarchical Slots
                </h2>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="mt-1"><Zap size={20} className="text-teal-500" /></div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">Rotary Position Embeddings & Flash Attention</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-light leading-relaxed">
                        Utilizes RoPE to generalize to varying sequence lengths and packed contexts, paired with Flash Attention for highly optimized scaling on remote compute nodes.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1"><Layers size={20} className="text-teal-500" /></div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">SlotPosWrapper</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-light leading-relaxed">
                        Standard 1D sequence IDs are insufficient. The architecture dynamically wraps the encoder to inject secondary (Slot Index) and tertiary (Atom Index) positional IDs.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1"><Shield size={20} className="text-teal-500" /></div>
                    <div>
                      <h4 className="text-lg font-medium mb-1">Sequence Packing Compatibility</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-light leading-relaxed">
                        Loss functions and attention masks are strictly aware of `sequence_ids`, ensuring attention operations do not bleed across independent molecules packed into the same window.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="w-full lg:w-1/2">
              <FadeIn delay={0.2}>
                <div className="glass-panel p-2 rounded-2xl border border-emerald-200/30 dark:border-emerald-900/30 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full"></div>
                  <div className="bg-emerald-50/20 dark:bg-[#020c0b]/80 rounded-xl p-8 backdrop-blur-sm relative z-10">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-emerald-100 dark:border-emerald-900/30">
                      <span className="font-mono text-sm text-emerald-800 dark:text-emerald-400">src/mind/model/builder.py</span>
                      <span className="flex space-x-1">
                        <div className="w-3 h-3 rounded-full bg-emerald-200 dark:bg-emerald-900"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-200 dark:bg-emerald-900"></div>
                        <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                      </span>
                    </div>

                    <div className="space-y-4 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-300">
                      <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 rounded flex items-center gap-3 border-l-2 border-emerald-500">
                        <span className="text-emerald-600 dark:text-emerald-400">1.</span>
                        <span>Config parse: `use_rope_atom_ids`</span>
                      </div>
                      <div className="flex justify-center my-2 text-emerald-300/50">↓</div>
                      <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 rounded flex items-center gap-3 border-l-2 border-emerald-500">
                        <span className="text-emerald-600 dark:text-emerald-400">2.</span>
                        <span>Instantiate ModernBERT Base</span>
                      </div>
                      <div className="flex justify-center my-2 text-emerald-300/50">↓</div>
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100 rounded flex flex-col gap-2 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <div className="flex items-center gap-3">
                          <span className="text-teal-600 dark:text-teal-400">3.</span>
                          <span className="font-semibold">Wrap: `SlotPosWrapper`</span>
                        </div>
                        <div className="pl-6 text-xs text-teal-700/80 dark:text-teal-200/70">
                          <span className="block">+ Inject 1D Sequence ID</span>
                          <span className="block">+ Inject Slot Index (Residue/Motif)</span>
                          <span className="block">+ Inject Atom Index (Unique ID)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>

        {/* Data Pipeline Section */}
        <div className="py-24 px-6 md:px-20 relative z-20">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <FadeIn>
              <div className="flex justify-center items-center mb-6">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-xs font-medium text-teal-700 dark:text-teal-400">
                  <Server size={14} />
                  <span>Data Pipeline</span>
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-light mb-4">Streaming & Masking</h2>
            </FadeIn>
          </div>

          <div className="max-w-5xl mx-auto relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-teal-500/0 via-teal-500/50 to-teal-500/0"></div>

            {[
              {
                step: "01",
                title: "NPZTokenDataset",
                desc: "Streaming IterableDataset reading from .npz or .npy shard files. Implements dual-shuffling (shard-level and intra-shard) to handle datasets far larger than memory."
              },
              {
                step: "02",
                title: "Sequence Packing & Stall-Breaking",
                desc: "Dynamic packing of short molecules into length-8192 windows. Includes robust `_refill_until_ready` safety valves to force-emit batches if min-fill ratios cannot be met, avoiding deadlocks."
              },
              {
                step: "03",
                title: "Virtual Atom Insertion",
                desc: "Triggered by `mask_mode`. Residues with fewer atoms than `residue_length` receive verification Virtual Atoms to standardize geometry, while larger residues are safely preserved."
              },
              {
                step: "04",
                title: "Masking Strategies",
                desc: "Supports `atom_block_mask` (masking [Atom, X, Y, Z] chunks) for small molecules, and `residue_real_block_mask` for entire integer residues in Protein/RNA data."
              }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className={`relative flex flex-col md:flex-row items-start md:items-center mb-12 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-teal-500 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.8)] transform -translate-x-1.5 mt-2 md:mt-0"></div>

                  <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${i % 2 === 0 ? 'md:pl-16' : 'md:pr-16 text-left md:text-right'}`}>
                    <div className="glass-panel p-6 rounded-2xl hover:bg-white/5 dark:hover:bg-slate-900/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 font-medium text-xs mb-4">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 font-light text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
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
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 border ${
                      activeTab === idx
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[400px]">
              {DOWNSTREAM_TASKS[activeTab].tasks.map((task, i) => (
                <FadeIn key={`${activeTab}-${i}`} delay={i * 0.1}>
                  <div className="glass-panel p-8 rounded-2xl h-full flex flex-col group hover:border-emerald-500/50 transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="text-xs font-mono text-emerald-500 dark:text-emerald-400 mb-1">{task.paper}</h4>
                        <h3 className="text-xl font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{task.name}</h3>
                      </div>
                      <div className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                        Active
                      </div>
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-light leading-relaxed mb-6 flex-grow">
                      {task.goal}
                    </p>

                    <div className="space-y-4 pt-6 border-t border-emerald-100/50 dark:border-emerald-900/10">
                      <div className="flex items-start gap-3">
                        <Database size={14} className="mt-1 text-slate-400" />
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">Dataset</span>
                          <span className="text-xs text-slate-700 dark:text-slate-300">{task.data}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <BarChart3 size={14} className="mt-1 text-slate-400" />
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">Metrics</span>
                          <span className="text-xs text-slate-700 dark:text-slate-300">{task.metrics}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Binary size={14} className="mt-1 text-slate-400" />
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">Finetuning Approach</span>
                          <span className="text-xs text-slate-700 dark:text-slate-300 italic">{task.method}</span>
                        </div>
                      </div>
                    </div>

                    {/* Result Placeholder */}
                    <div className="mt-8">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Current Performance</span>
                        <span className="text-[10px] font-mono text-emerald-500">EVALUATING...</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "65%" }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        />
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
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

        {/* Project Structure Section */}
        <div className="py-24 px-6 md:px-20 relative z-20 bg-emerald-50/20 dark:bg-[#020c0b] text-slate-900 dark:text-slate-100 border-t border-emerald-100 dark:border-emerald-900/30">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-light mb-4">Project Structure</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light">
                  A modular, scalable foundation designed for rigorous evaluation and clear separation of concerns.
                </p>
              </div>
            </FadeIn>

            <div className="flex flex-col lg:flex-row gap-8">
              <FadeIn delay={0.1} className="w-full lg:w-5/12">
                <div className="bg-emerald-50/30 dark:bg-[#041a18] rounded-xl border border-emerald-100 dark:border-emerald-900/30 overflow-hidden shadow-2xl h-full font-mono text-sm flex flex-col">
                  <div className="bg-emerald-50/50 dark:bg-[#062421] px-4 py-3 border-b border-emerald-100 dark:border-emerald-900/30 flex items-center gap-2">
                    <Braces size={16} className="text-emerald-500" />
                    <span className="text-emerald-800 dark:text-emerald-400">Workspace Explorer</span>
                  </div>
                  <div className="p-4 overflow-y-auto flex-grow text-slate-600 dark:text-slate-400">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                        <ChevronRight size={14} className="text-slate-500" /> <span>src/mind/</span>
                      </div>
                      <div className="pl-6 flex flex-col gap-1.5 border-l border-slate-300 dark:border-slate-800 ml-2">
                        <div className="flex items-center gap-2"><Box size={14} className="text-blue-500 dark:text-blue-400" /> <span>data/ <span className="text-slate-500 dark:text-slate-600 text-xs ml-2"># Loaders, masking, packing</span></span></div>
                        <div className="flex items-center gap-2"><Cpu size={14} className="text-purple-500 dark:text-purple-400" /> <span>model/ <span className="text-slate-500 dark:text-slate-600 text-xs ml-2"># ModernBERT & Wrappers</span></span></div>
                        <div className="flex items-center gap-2"><Activity size={14} className="text-green-500 dark:text-green-400" /> <span>training/ <span className="text-slate-500 dark:text-slate-600 text-xs ml-2"># Loop & Loss functions</span></span></div>
                        <div className="flex items-center gap-2"><Target size={14} className="text-orange-500 dark:text-orange-400" /> <span>evaluation/ <span className="text-slate-500 dark:text-slate-600 text-xs ml-2"># Metrics & Validations</span></span></div>
                        <div className="flex items-center gap-2"><FileCode2 size={14} className="text-yellow-600 dark:text-yellow-400" /> <span>tokenizer/ <span className="text-slate-500 dark:text-slate-600 text-xs ml-2"># Atom+Coord logic</span></span></div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium mt-3">
                        <ChevronRight size={14} className="text-slate-500" /> <span>scripts/</span>
                      </div>
                      <div className="pl-6 flex flex-col gap-1.5 border-l border-slate-300 dark:border-slate-800 ml-2">
                        <div className="flex items-center gap-2"><Terminal size={14} className="text-teal-600 dark:text-teal-400" /> <span>train.py <span className="text-slate-500 dark:text-slate-600 text-xs ml-2"># Main orchestration</span></span></div>
                        <div className="flex items-center gap-2"><FileCode2 size={14} className="text-slate-400 dark:text-slate-500" /> <span>analysis/</span></div>
                        <div className="flex items-center gap-2"><FileCode2 size={14} className="text-slate-400 dark:text-slate-500" /> <span>demos/</span></div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium mt-3">
                        <ChevronRight size={14} className="text-slate-500" /> <span>configs/</span>
                      </div>
                      <div className="pl-6 flex flex-col gap-1.5 border-l border-slate-300 dark:border-slate-800 ml-2">
                        <div className="flex items-center gap-2"><FileCode2 size={14} className="text-yellow-600" /> <span>mlm_multisource.yaml</span></div>
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
