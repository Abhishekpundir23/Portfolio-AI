"use client";
import type { Portfolio } from "@/types/portfolio";
import { GitBranch, ArrowUpRight, Download, Terminal, Zap, BookOpen, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CreativeTemplate({ portfolio }: { portfolio: Portfolio }) {
  const [pageUrl, setPageUrl] = useState("");
  useEffect(() => { setPageUrl(window.location.href); }, []);
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
  return (
    <div className="min-h-screen font-sans" style={{ background: "linear-gradient(135deg, #0f0a1e 0%, #130d2a 50%, #0a0f1e 100%)" }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      {/* Top gradient bar */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#8b5cf6,#ec4899,#f59e0b)" }} />

      {/* Ambient glows */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)" }} />
      <div className="fixed bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)" }} />

      {/* Nav */}
      <nav className="border-b border-white/10 px-8 py-4 flex justify-between items-center no-print">
        <Link href="/" className="text-white/40 hover:text-white transition-colors text-sm">← Portfolio.ai</Link>
        <div className="flex gap-3">
          {portfolio.repo_url && (
            <a href={portfolio.repo_url} target="_blank" rel="noreferrer"
              className="px-4 py-2 border border-white/10 rounded-lg flex items-center gap-2 text-sm text-white/60 hover:text-white hover:border-white/30 transition-all">
              <GitBranch className="w-4 h-4" /> Source Code
            </a>
          )}
          <a href={linkedInUrl} target="_blank" rel="noreferrer"
            className="px-4 py-2 border border-white/10 rounded-lg flex items-center gap-2 text-sm text-white/60 hover:text-white hover:border-white/30 transition-all">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            Share on LinkedIn
          </a>
          <button onClick={() => window.print()}
            className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-white transition-colors font-semibold"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </nav>

      <article className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        {/* Header */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6 text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
            <span className="px-2 py-1 rounded font-semibold" style={{ background: "rgba(139,92,246,0.2)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }}>CASE STUDY</span>
            {portfolio.category && (
              <><span>/</span><span className="px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>{portfolio.category}</span></>
            )}
            <span>/</span>
            <span>{new Date(portfolio.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-[1.05] mb-8 max-w-3xl"
            style={{ background: "linear-gradient(135deg,#c4b5fd,#f9a8d4,#ffffff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {portfolio.hook}
          </h1>

          {/* TL;DR */}
          <div className="p-5 rounded-xl flex gap-4 mb-8" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <Terminal className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#a78bfa" }} />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "#a78bfa" }}>TL;DR</span>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                {portfolio.problem?.split('.')[0]}. Built using <span style={{ color: "#c4b5fd", fontWeight: 600 }}>{(portfolio.toolsUsed || portfolio.tech_stack)?.slice(0, 3).join(', ')}</span>. Result: <span style={{ color: "#86efac", fontWeight: 600 }}>{portfolio.win?.split('.')[0]}.</span>
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2">
            {(portfolio.toolsUsed || portfolio.tech_stack)?.map((tech, i) => (
              <span key={i} className="px-3 py-1.5 rounded-md text-xs font-mono"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                {tech}
              </span>
            ))}
          </div>
        </header>

        {/* Key Metrics or Impact */}
        {portfolio.keyMetrics && portfolio.keyMetrics.length > 0 ? (
          <div className="mb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {portfolio.keyMetrics.map((metric, i) => (
              <div key={i} className="p-5 rounded-xl text-center"
                style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(236,72,153,0.1))", border: "1px solid rgba(139,92,246,0.2)" }}>
                <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: "#c4b5fd" }}>{metric.value}</div>
                <div className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>{metric.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-16 p-8 rounded-2xl relative overflow-hidden"
            style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(236,72,153,0.15))", border: "1px solid rgba(139,92,246,0.3)" }}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)" }} />
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(139,92,246,0.3)", border: "1px solid rgba(139,92,246,0.4)" }}>
                <Zap className="w-6 h-6" style={{ color: "#c4b5fd" }} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(167,139,250,0.7)" }}>Measurable Impact</div>
                <p className="text-2xl md:text-3xl font-bold leading-snug text-white">{portfolio.win}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main grid */}
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 space-y-14">
            {/* Problem */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <span className="text-xs font-bold" style={{ color: "#f87171" }}>01</span>
                </div>
                <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>The Problem</h2>
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
              </div>
              <p className="text-lg leading-relaxed pl-11" style={{ color: "rgba(255,255,255,0.75)" }}>{portfolio.problem}</p>
            </section>

            {/* Solution */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  <span className="text-xs font-bold" style={{ color: "#818cf8" }}>02</span>
                </div>
                <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>The Solution</h2>
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
              </div>
              <p className="text-lg leading-relaxed pl-11" style={{ color: "rgba(255,255,255,0.75)" }}>{portfolio.solution}</p>
            </section>

            {/* Learning */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                  <span className="text-xs font-bold" style={{ color: "#fbbf24" }}>03</span>
                </div>
                <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>Key Takeaway</h2>
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
              </div>
              <blockquote className="pl-11" style={{ borderLeft: "2px solid rgba(245,158,11,0.3)" }}>
                <p className="text-lg leading-relaxed italic" style={{ color: "rgba(255,255,255,0.65)" }}>"{portfolio.learning}"</p>
              </blockquote>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2 mb-5">
                <BookOpen className="w-4 h-4" style={{ color: "#a78bfa" }} />
                <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>Tools & Skills</h3>
              </div>
              <div className="space-y-2">
                {(portfolio.toolsUsed || portfolio.tech_stack)?.map((tech, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#a78bfa" }} />
                    <span className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.7)" }}>{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl space-y-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2 mb-5">
                <Lightbulb className="w-4 h-4" style={{ color: "#fbbf24" }} />
                <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>Project Info</h3>
              </div>
              {portfolio.repo_url && (
                <div>
                  <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Repository</div>
                  <a href={portfolio.repo_url} target="_blank" rel="noreferrer"
                    className="text-sm flex items-center gap-1 break-all" style={{ color: "#a78bfa" }}>
                    {portfolio.repo_url.replace('https://github.com/', '')} <ArrowUpRight className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              )}
              <div>
                <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Published</div>
                <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {new Date(portfolio.created_at).toLocaleDateString('en-US', { dateStyle: 'long' })}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl no-print"
              style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(236,72,153,0.1))", border: "1px solid rgba(139,92,246,0.25)" }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#a78bfa" }}>📎 Attach to Applications</div>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>Download this case study as a PDF and attach it alongside your resume.</p>
              <button onClick={() => window.print()}
                className="w-full py-2.5 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </aside>
        </div>
      </article>

      <footer className="px-8 py-6 mt-12 flex justify-between items-center no-print"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Proof of Work Portfolio</p>
        <Link href="/" className="text-xs flex items-center gap-1 transition-colors" style={{ color: "rgba(255,255,255,0.25)" }}>
          Built with Portfolio.ai <ArrowUpRight className="w-3 h-3" />
        </Link>
      </footer>
    </div>
  );
}
