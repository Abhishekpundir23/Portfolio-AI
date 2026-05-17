"use client";
import type { Portfolio } from "@/types/portfolio";
import { GitBranch, ArrowUpRight, Download, Terminal, Zap, BookOpen, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MinimalTemplate({ portfolio }: { portfolio: Portfolio }) {
  const [pageUrl, setPageUrl] = useState("");
  useEffect(() => { setPageUrl(window.location.href); }, []);
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent("Check out my case study! " + pageUrl)}`;

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      {/* Top accent line */}
      <div className="h-1 w-full bg-zinc-900" />

      {/* Nav */}
      <nav className="border-b border-zinc-100 px-8 py-4 flex justify-between items-center no-print flex-wrap gap-4">
        <Link href="/" className="text-zinc-400 hover:text-zinc-900 transition-colors text-sm">← Portfolio.ai</Link>
        <div className="flex gap-3 flex-wrap">
          {portfolio.repo_url && (
            <a href={portfolio.repo_url} target="_blank" rel="noreferrer"
              className="px-4 py-2 border border-zinc-200 rounded-lg flex items-center gap-2 text-sm text-zinc-600 hover:border-zinc-400 transition-all">
              <GitBranch className="w-4 h-4" /> Source Code
            </a>
          )}
          <a href={whatsappUrl} target="_blank" rel="noreferrer"
            className="px-4 py-2 border border-zinc-200 rounded-lg flex items-center gap-2 text-sm text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            WhatsApp
          </a>
          <a href={linkedInUrl} target="_blank" rel="noreferrer"
            className="px-4 py-2 border border-zinc-200 rounded-lg flex items-center gap-2 text-sm text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-all">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
        </div>
      </nav>

      <article className="max-w-5xl mx-auto px-8 py-20">
        {/* Header */}
        <header className="mb-16 pb-16 border-b border-zinc-100">
          <div className="flex items-center gap-3 mb-6 text-xs font-mono text-zinc-400">
            <span className="px-2 py-1 bg-zinc-100 text-zinc-500 rounded font-semibold">CASE STUDY</span>
            {portfolio.category && (
              <><span>/</span><span className="px-2 py-1 bg-zinc-100 text-zinc-500 rounded">{portfolio.category}</span></>
            )}
            <span>/</span>
            <span>{new Date(portfolio.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-[1.05] mb-8 text-zinc-900 max-w-3xl">
            {portfolio.hook}
          </h1>

          {/* TL;DR */}
          <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-xl flex gap-4 mb-8">
            <Terminal className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">TL;DR</span>
              <p className="text-zinc-700 text-sm leading-relaxed">
                {portfolio.problem?.split('.')[0]}. Built using <span className="font-semibold">{(portfolio.toolsUsed || portfolio.tech_stack)?.slice(0, 3).join(', ')}</span>. Result: <span className="font-semibold text-green-700">{portfolio.win?.split('.')[0]}.</span>
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2">
            {(portfolio.toolsUsed || portfolio.tech_stack)?.map((tech, i) => (
              <span key={i} className="px-3 py-1.5 bg-zinc-100 border border-zinc-200 rounded-md text-xs font-mono text-zinc-600 hover:bg-zinc-200 transition-colors">
                {tech}
              </span>
            ))}
          </div>
        </header>

        {/* Key Metrics or Impact */}
        {portfolio.keyMetrics && portfolio.keyMetrics.length > 0 ? (
          <div className="mb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {portfolio.keyMetrics.map((metric, i) => (
              <div key={i} className="p-5 rounded-xl bg-zinc-900 text-white text-center">
                <div className="text-2xl md:text-3xl font-bold mb-1">{metric.value}</div>
                <div className="text-xs text-zinc-400 uppercase tracking-wider">{metric.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-16 p-8 rounded-2xl bg-zinc-900 text-white relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Measurable Impact</div>
                <p className="text-2xl md:text-3xl font-bold text-white leading-snug">{portfolio.win}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main grid */}
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 space-y-14">
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-500 text-xs font-bold">01</span>
                </div>
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">The Problem</h2>
                <div className="h-px bg-zinc-100 flex-1" />
              </div>
              <p className="text-lg text-zinc-700 leading-relaxed pl-11">{portfolio.problem}</p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-500 text-xs font-bold">02</span>
                </div>
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">The Solution</h2>
                <div className="h-px bg-zinc-100 flex-1" />
              </div>
              <p className="text-lg text-zinc-700 leading-relaxed pl-11">{portfolio.solution}</p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-600 text-xs font-bold">03</span>
                </div>
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Key Takeaway</h2>
                <div className="h-px bg-zinc-100 flex-1" />
              </div>
              <blockquote className="pl-11 border-l-4 border-zinc-200">
                <p className="text-lg text-zinc-600 leading-relaxed italic">"{portfolio.learning}"</p>
              </blockquote>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-2 space-y-6">
            <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl">
              <div className="flex items-center gap-2 mb-5">
                <BookOpen className="w-4 h-4 text-zinc-500" />
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Tools & Skills</h3>
              </div>
              <div className="space-y-2">
                {(portfolio.toolsUsed || portfolio.tech_stack)?.map((tech, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-zinc-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                    <span className="text-sm font-mono text-zinc-700">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 mb-5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Project Info</h3>
              </div>
              {portfolio.repo_url && (
                <div>
                  <div className="text-xs text-zinc-400 mb-1">Repository</div>
                  <a href={portfolio.repo_url} target="_blank" rel="noreferrer"
                    className="text-sm text-zinc-700 hover:text-zinc-900 flex items-center gap-1 break-all font-medium">
                    {portfolio.repo_url.replace('https://github.com/', '')} <ArrowUpRight className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              )}
              <div>
                <div className="text-xs text-zinc-400 mb-1">Published</div>
                <div className="text-sm text-zinc-700 font-medium">{new Date(portfolio.created_at).toLocaleDateString('en-US', { dateStyle: 'long' })}</div>
              </div>
            </div>

            <div className="p-6 bg-zinc-900 text-white rounded-2xl no-print">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">📎 Attach to Applications</div>
              <p className="text-zinc-400 text-sm mb-4 leading-relaxed">Download this case study as a PDF and attach it alongside your resume.</p>
              <button onClick={() => window.print()}
                className="w-full py-2.5 bg-white text-zinc-900 rounded-lg text-sm font-bold transition-colors hover:bg-zinc-100 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </aside>
        </div>
      </article>

      <footer className="border-t border-zinc-100 px-8 py-6 mt-12 flex justify-between items-center no-print">
        <p className="text-xs text-zinc-400">Proof of Work Portfolio</p>
        <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1">
          Built with Portfolio.ai <ArrowUpRight className="w-3 h-3" />
        </Link>
      </footer>
    </div>
  );
}
