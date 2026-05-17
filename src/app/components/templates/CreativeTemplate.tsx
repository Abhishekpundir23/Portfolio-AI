"use client";
import type { Portfolio } from "@/types/portfolio";
import { ExternalLink, ArrowUpRight, Download, Target, Zap, BookOpen, Lightbulb, Eye } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CreativeTemplate({ portfolio }: { portfolio: Portfolio }) {
  const [pageUrl, setPageUrl] = useState("");
  useEffect(() => { setPageUrl(window.location.href); }, []);
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent("Check out my case study! " + pageUrl)}`;

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
      <nav className="border-b border-white/10 px-8 py-4 flex justify-between items-center no-print flex-wrap gap-4">
        <Link href="/" className="text-white/40 hover:text-white transition-colors text-sm">← Portfolio.ai</Link>
        <div className="flex gap-3 flex-wrap">
          {portfolio.repo_url && (
            <a href={portfolio.repo_url} target="_blank" rel="noreferrer"
              className="px-4 py-2 border border-white/10 rounded-lg flex items-center gap-2 text-sm text-white/60 hover:text-white hover:border-white/30 transition-all">
              <ExternalLink className="w-4 h-4" /> Project Link
            </a>
          )}
          <a href={whatsappUrl} target="_blank" rel="noreferrer"
            className="px-4 py-2 border border-white/10 rounded-lg flex items-center gap-2 text-sm text-white/60 hover:text-white hover:border-white/30 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            WhatsApp
          </a>
          <a href={linkedInUrl} target="_blank" rel="noreferrer"
            className="px-4 py-2 border border-white/10 rounded-lg flex items-center gap-2 text-sm text-white/60 hover:text-white hover:border-white/30 transition-all">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </a>
        </div>
      </nav>

      <motion.article 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto px-6 py-20 relative z-10"
      >
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-xl flex gap-4 mb-8" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <Target className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#a78bfa" }} />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color: "#a78bfa" }}>TL;DR</span>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                {portfolio.problem?.split('.')[0]}. Leveraged <span style={{ color: "#c4b5fd", fontWeight: 600 }}>{(portfolio.toolsUsed || portfolio.tech_stack)?.slice(0, 3).join(', ')}</span> to drive results. Result: <span style={{ color: "#86efac", fontWeight: 600 }}>{portfolio.win?.split('.')[0]}.</span>
              </p>
            </div>
          </motion.div>

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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {portfolio.keyMetrics.map((metric, i) => (
              <div key={i} className="p-5 rounded-xl text-center group hover:-translate-y-1 transition-transform"
                style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(236,72,153,0.1))", border: "1px solid rgba(139,92,246,0.2)" }}>
                <div className="text-2xl md:text-3xl font-bold mb-1 group-hover:scale-105 transition-transform" style={{ color: "#c4b5fd" }}>{metric.value}</div>
                <div className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>{metric.label}</div>
              </div>
            ))}
          </motion.div>
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="grid lg:grid-cols-5 gap-12">
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
                  <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Project Link</div>
                  <a href={portfolio.repo_url} target="_blank" rel="noreferrer"
                    className="text-sm flex items-center gap-1 break-all" style={{ color: "#a78bfa" }}>
                    {portfolio.repo_url.replace('https://github.com/', '').replace('https://', '')} <ArrowUpRight className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              )}
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Published</div>
                  <div className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {new Date(portfolio.created_at).toLocaleDateString('en-US', { dateStyle: 'long' })}
                  </div>
                </div>
                {portfolio.views !== undefined && (
                  <div className="text-right">
                    <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Views</div>
                    <div className="text-sm font-medium flex items-center gap-1 justify-end" style={{ color: "rgba(255,255,255,0.7)" }}><Eye className="w-3.5 h-3.5" /> {portfolio.views}</div>
                  </div>
                )}
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
        </motion.div>
      </motion.article>

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
