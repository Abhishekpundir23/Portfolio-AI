"use client";
import type { Portfolio } from "@/types/portfolio";
import { useEffect, useState } from "react";
import { GitBranch, Download, ArrowUpRight, Terminal, Zap, BookOpen, Lightbulb, Clock } from "lucide-react";
import Link from "next/link";

export default function BoldTemplate({ portfolio }: { portfolio: Portfolio }) {
  const handleExportPDF = () => window.print();
  const [pageUrl, setPageUrl] = useState("");
  useEffect(() => { setPageUrl(window.location.href); }, []);
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans">
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #0d0d0d !important; color: white !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />

      {/* Nav */}
      <nav className="border-b border-zinc-900 px-8 py-4 flex justify-between items-center no-print">
        <Link href="/" className="text-zinc-500 hover:text-white transition-colors text-sm flex items-center gap-2">
          ← Portfolio.ai
        </Link>
        <div className="flex gap-3">
          {portfolio.repo_url && (
            <a href={portfolio.repo_url} target="_blank" rel="noreferrer"
              className="px-4 py-2 border border-zinc-800 rounded-lg flex items-center gap-2 text-sm text-zinc-400 hover:text-white hover:border-zinc-600 transition-all">
              <GitBranch className="w-4 h-4" /> Source Code
            </a>
          )}
          <a href={linkedInUrl} target="_blank" rel="noreferrer"
            className="px-4 py-2 border border-zinc-700 rounded-lg flex items-center gap-2 text-sm text-zinc-300 hover:text-white hover:border-zinc-500 transition-all">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            Share on LinkedIn
          </a>
          <button onClick={handleExportPDF}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-2 text-sm text-white transition-colors">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </nav>

      <article className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6 text-xs font-mono text-zinc-500">
            <span className="px-2 py-1 bg-indigo-900/40 border border-indigo-500/30 text-indigo-400 rounded">CASE STUDY</span>
            <span>/</span>
            <span className="text-zinc-600">{new Date(portfolio.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6 max-w-3xl text-white">
            {portfolio.hook}
          </h1>

          {/* TL;DR box */}
          <div className="p-5 bg-zinc-900/70 border border-zinc-700/50 rounded-xl flex gap-4 mb-8">
            <Terminal className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">TL;DR</span>
              <p className="text-zinc-300 text-sm leading-relaxed">
                {portfolio.problem?.split('.')[0]}. Built a solution using <span className="text-indigo-300">{portfolio.tech_stack?.slice(0, 3).join(', ')}</span>. Result: <span className="text-green-400 font-semibold">{portfolio.win?.split('.')[0]}.</span>
              </p>
            </div>
          </div>

          {/* Tech stack tags */}
          <div className="flex flex-wrap gap-2">
            {portfolio.tech_stack?.map((tech, i) => (
              <span key={i} className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-mono text-zinc-400 hover:border-indigo-500/50 hover:text-indigo-300 transition-colors">
                {tech}
              </span>
            ))}
          </div>
        </header>

        {/* Big Impact Metric */}
        <div className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-green-950/60 to-emerald-950/30 border border-green-800/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-green-500/70 uppercase tracking-widest mb-2">Measurable Impact</div>
              <p className="text-2xl md:text-3xl font-bold text-green-100 leading-snug">{portfolio.win}</p>
            </div>
          </div>
        </div>

        {/* Main content - two column */}
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left - main narrative */}
          <div className="lg:col-span-3 space-y-14">

            {/* Problem */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-400 text-xs font-bold">01</span>
                </div>
                <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">The Problem</h2>
                <div className="h-px bg-zinc-800 flex-1" />
              </div>
              <p className="text-lg text-zinc-300 leading-relaxed pl-11">{portfolio.problem}</p>
            </section>

            {/* Solution */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 text-xs font-bold">02</span>
                </div>
                <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">The Solution</h2>
                <div className="h-px bg-zinc-800 flex-1" />
              </div>
              <p className="text-lg text-zinc-300 leading-relaxed pl-11">{portfolio.solution}</p>
            </section>

            {/* Learning */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-400 text-xs font-bold">03</span>
                </div>
                <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Key Takeaway</h2>
                <div className="h-px bg-zinc-800 flex-1" />
              </div>
              <blockquote className="pl-11 border-l-2 border-amber-500/30 ml-0">
                <p className="text-lg text-zinc-300 leading-relaxed italic">"{portfolio.learning}"</p>
              </blockquote>
            </section>
          </div>

          {/* Right sidebar */}
          <aside className="lg:col-span-2 space-y-6">
            {/* Stack breakdown */}
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <div className="flex items-center gap-2 mb-5">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Tech Stack</h3>
              </div>
              <div className="space-y-2">
                {portfolio.tech_stack?.map((tech, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span className="text-sm font-mono text-zinc-300">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Meta info */}
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 mb-5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Project Info</h3>
              </div>
              {portfolio.repo_url && (
                <div>
                  <div className="text-xs text-zinc-600 mb-1">Repository</div>
                  <a href={portfolio.repo_url} target="_blank" rel="noreferrer"
                    className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 break-all">
                    {portfolio.repo_url.replace('https://github.com/', '')} <ArrowUpRight className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              )}
              <div>
                <div className="text-xs text-zinc-600 mb-1">Published</div>
                <div className="text-sm text-zinc-300">{new Date(portfolio.created_at).toLocaleDateString('en-US', { dateStyle: 'long' })}</div>
              </div>
            </div>

            {/* PDF Export Card */}
            <div className="p-6 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl no-print">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">📎 Attach to Applications</div>
              <p className="text-zinc-400 text-sm mb-4 leading-relaxed">Download this case study as a PDF and attach it alongside your resume.</p>
              <button onClick={handleExportPDF}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </aside>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-zinc-900 px-8 py-6 mt-12 flex justify-between items-center no-print">
        <p className="text-xs text-zinc-600">Proof of Work Portfolio</p>
        <Link href="/" className="text-xs text-zinc-600 hover:text-white transition-colors flex items-center gap-1">
          Built with Portfolio.ai <ArrowUpRight className="w-3 h-3" />
        </Link>
      </footer>
    </div>
  );
}
