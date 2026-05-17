"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Zap, ExternalLink, FileText, TrendingUp, Star, Terminal } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

const TYPEWRITER_STRINGS = [
  "GitHub or project link...",
  "project description...",
  "PDF reports...",
  "your impact metrics...",
];

const FLOAT_CARDS = [
  { top: "18%", left: "3%", rotate: "-3deg", delay: 0, label: "Problem Detected", value: "5hrs/day wasted on manual entry", color: "border-red-500/20 bg-red-950/20" },
  { top: "50%", right: "2%", rotate: "2deg", delay: 1.5, label: "Impact Quantified", value: "+40% efficiency • 10min processing", color: "border-green-500/20 bg-green-950/20" },
  { top: "30%", right: "3%", rotate: "-1.5deg", delay: 0.8, label: "Tech Identified", value: "Python · FastAPI · PostgreSQL", color: "border-indigo-500/20 bg-indigo-950/20" },
];

const BEFORE_AFTER = [
  {
    label: "Resume Claim",
    bad: true,
    text: '"I managed marketing campaigns and drove growth."',
    subtext: "Generic • Unverified • Forgettable",
  },
  {
    label: "Portfolio.ai Case Study",
    bad: false,
    text: '"Leveraged Google Ads & Facebook to scale campaigns for 12,000+ new leads/month, reducing CAC by 40% — a 150% ROI jump."',
    subtext: "Specific • Quantified • Memorable",
  },
];

function TypewriterEffect() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = TYPEWRITER_STRINGS[index];
    if (!deleting && displayed.length < current.length) {
      const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === current.length) {
      const t = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % TYPEWRITER_STRINGS.length);
    }
  }, [displayed, deleting, index]);

  return (
    <span className="text-indigo-400">
      {displayed}<span className="animate-pulse">|</span>
    </span>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden relative">

      {/* Interactive Cursor Glow */}
      <motion.div 
        className="pointer-events-none fixed inset-0 z-0 opacity-50"
        animate={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 80%)`
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
      />

      {/* Terminal grid bg */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Animated Ambient blobs */}
      <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[140px] pointer-events-none z-0" />
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="fixed top-[40%] right-[-15%] w-[500px] h-[500px] rounded-full bg-fuchsia-600/10 blur-[140px] pointer-events-none z-0" />
      <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.3, 0.2] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="fixed bottom-0 left-[20%] w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none z-0" />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900/60 bg-[#080808]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Portfolio<span className="text-indigo-400">.ai</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#templates" className="hover:text-white transition-colors">Templates</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">Log in</Link>
            <Link href="/onboarding" className="px-5 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
              Start Free →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="relative pt-44 pb-32 text-center">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/25 bg-indigo-500/5 text-indigo-300 text-xs font-semibold mb-10 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Free for students · No credit card needed
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.0] mb-6">
            Your projects<br />
            <span style={{ background: "linear-gradient(135deg,#818cf8,#c084fc,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              deserve proof.
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-3 leading-relaxed font-light">
            Paste a link. Our AI reads your
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl font-semibold mb-10 h-8">
            <TypewriterEffect />
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/onboarding"
              className="group px-9 py-4 bg-white text-black rounded-full font-bold text-lg transition-all hover:bg-zinc-100 flex items-center gap-2 shadow-2xl shadow-white/10">
              Build My Portfolio — Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#how-it-works" className="px-8 py-4 border border-zinc-800 rounded-full font-semibold text-lg hover:bg-zinc-900 transition-all text-zinc-300">
              See examples
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-24">
            {[["2,400+","Portfolios published"],["8.7×","More recruiter replies"],["340+","Colleges"],["₹0","To get started"]].map(([val,lab],i)=>(
              <div key={i} className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 text-center">
                <div className="text-2xl font-black text-white mb-1">{val}</div>
                <div className="text-xs text-zinc-500 font-medium">{lab}</div>
              </div>
            ))}
          </motion.div>

          {/* Terminal demo card */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl shadow-black/60 text-left">
              {/* Terminal header */}
              <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="mx-auto text-xs text-zinc-500 font-mono flex items-center gap-2">
                  <Terminal className="w-3 h-3" /> portfolio.ai — case-study generator
                </div>
              </div>
              {/* Terminal body */}
              <div className="bg-zinc-950 p-6 font-mono text-sm space-y-3">
                <div><span className="text-green-400">$</span> <span className="text-zinc-300">portfolio generate</span> <span className="text-indigo-400">https://project-link.com</span></div>
                <div className="text-zinc-500">  Fetching project data...</div>
                <div className="text-zinc-500">  Analyzing structure...</div>
                <div className="text-zinc-500">  Extracting impact metrics...</div>
                <div className="text-green-400">  ✓ Case study generated in 6.2s</div>
                <div className="mt-4 p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                  <div><span className="text-indigo-400">hook:</span> <span className="text-white">"Automated 2000+ daily invoice records with 97% efficiency gain"</span></div>
                  <div><span className="text-purple-400">win:</span> <span className="text-green-300">"Processing time: 5 hours → 8 minutes"</span></div>
                  <div><span className="text-amber-400">stack:</span> <span className="text-zinc-300">["Python", "FastAPI", "PostgreSQL", "Redis"]</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating cards */}
        {FLOAT_CARDS.map((c, i) => (
          <motion.div key={i} drag dragConstraints={heroRef} whileHover={{ scale: 1.05, cursor: "grab" }} whileDrag={{ scale: 1.1, cursor: "grabbing" }}
            className={`absolute hidden xl:block glass-card rounded-xl p-4 text-left w-56 border ${c.color} shadow-2xl backdrop-blur-xl`}
            style={{ top: c.top, left: c.left, right: c.right, rotate: c.rotate, animation: `float ${7 + i}s ease-in-out ${c.delay}s infinite` }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-1 opacity-70">{c.label}</div>
            <div className="text-sm font-medium leading-snug">{c.value}</div>
          </motion.div>
        ))}
      </section>

      {/* BEFORE / AFTER */}
      <section className="py-24 border-t border-zinc-900 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">The transformation</p>
            <h2 className="text-4xl md:text-5xl font-black">From "I know Python" to proof.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {BEFORE_AFTER.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`p-8 rounded-2xl border ${item.bad ? "border-red-900/50 bg-red-950/10" : "border-green-800/50 bg-green-950/10"}`}>
                <div className={`text-xs font-bold uppercase tracking-widest mb-4 ${item.bad ? "text-red-400" : "text-green-400"}`}>
                  {item.bad ? "❌" : "✅"} {item.label}
                </div>
                <p className={`text-lg leading-relaxed mb-4 font-medium ${item.bad ? "text-zinc-400" : "text-white"}`}>
                  {item.text}
                </p>
                <p className={`text-sm ${item.bad ? "text-red-400/60" : "text-green-400/80"}`}>{item.subtext}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 border-t border-zinc-900 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-black">30 seconds. Zero writing.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n:"01", icon:<ExternalLink className="w-6 h-6"/>, title:"Paste Link or Text", desc:"Drop a GitHub / Project URL or paste your project description. Works for code, PDFs, and plain text reports.", color:"text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
              { n:"02", icon:<Zap className="w-6 h-6"/>, title:"AI Extracts Impact", desc:"Gemini reads your project info, finds the problem, solution, tech stack, and quantifies your business impact automatically.", color:"text-purple-400 bg-purple-500/10 border-purple-500/20" },
              { n:"03", icon:<Star className="w-6 h-6"/>, title:"Publish & Share", desc:"Choose a template, pick your username, and get a live link. Share on LinkedIn, attach the PDF to applications.", color:"text-pink-400 bg-pink-500/10 border-pink-500/20" },
            ].map((s,i)=>(
              <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.15}}
                className="relative p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-6 ${s.color}`}>{s.icon}</div>
                <div className="text-xs font-mono text-zinc-600 mb-2">{s.n}</div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEMPLATES */}
      <section id="templates" className="py-24 border-t border-zinc-900 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Templates</p>
            <h2 className="text-4xl md:text-5xl font-black">Three aesthetics. One truth.</h2>
            <p className="text-zinc-400 mt-4 max-w-xl mx-auto">Same AI-generated content. Different visual personalities. Pick what fits your brand.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name:"Bold Dark", tag:"Dev Favorite", desc:"Terminal vibes. High contrast. Code-first aesthetic.", bg:"bg-zinc-950", border:"border-indigo-500/40", preview:[{w:"w-2/3",c:"bg-zinc-400"},{w:"w-1/2",c:"bg-zinc-700"},{w:"w-full",c:"bg-zinc-800"}] },
              { name:"Minimal Light", tag:"Clean & Modern", desc:"Apple-inspired whitespace. Lets your work breathe.", bg:"bg-zinc-100", border:"border-zinc-300", preview:[{w:"w-2/3",c:"bg-zinc-800"},{w:"w-1/2",c:"bg-zinc-400"},{w:"w-full",c:"bg-zinc-200"}] },
              { name:"Creative", tag:"For Designers", desc:"Gradient-rich. Bold colours. Made to stand out.", bg:"bg-violet-950", border:"border-pink-500/40", preview:[{w:"w-2/3",c:"bg-gradient-to-r from-violet-400 to-pink-400"},{w:"w-1/2",c:"bg-violet-700"},{w:"w-full",c:"bg-violet-800"}] },
            ].map((t,i)=>(
              <motion.div key={i} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                className={`rounded-2xl border ${t.border} overflow-hidden hover:scale-[1.02] transition-transform`}>
                <div className={`${t.bg} p-8 h-48 flex flex-col justify-end gap-2.5 relative`}>
                  <div className={`absolute top-4 right-4 text-[10px] px-2 py-1 rounded-full bg-black/30 text-white/70 font-semibold`}>{t.tag}</div>
                  {t.preview.map((l,j)=><div key={j} className={`${l.w} h-2 ${l.c} rounded-full`}/>)}
                </div>
                <div className="p-6 bg-zinc-950 border-t border-zinc-800">
                  <h3 className="font-bold text-white mb-1">{t.name}</h3>
                  <p className="text-zinc-500 text-sm">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 border-t border-zinc-900 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-black">Start free. Upgrade when you<br/>land the interview.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800">
              <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-3">Free Forever</div>
              <div className="text-5xl font-black mb-1">₹0</div>
              <div className="text-zinc-600 text-sm mb-8">No card required</div>
              <ul className="space-y-3 mb-8">
                {["1 Published Portfolio","yourname.portfolio.ai domain","Bold Dark Template","AI Case Study (GitHub + PDF)","Public shareable link"].map((f,i)=>(
                  <li key={i} className="flex items-center gap-2 text-sm text-zinc-300"><span className="text-green-400">✓</span>{f}</li>
                ))}
              </ul>
              <Link href="/onboarding" className="block text-center py-3 bg-zinc-900 border border-zinc-700 rounded-full font-semibold hover:bg-zinc-800 transition-colors text-sm">
                Get Started Free
              </Link>
            </div>
            <div className="p-8 rounded-2xl border border-indigo-500/50 bg-indigo-950/20 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">MOST POPULAR</div>
              <div className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">Career Jumpstart</div>
              <div className="text-5xl font-black mb-1">₹299</div>
              <div className="text-zinc-500 text-sm mb-8">One-time · yours forever</div>
              <ul className="space-y-3 mb-8">
                {["Unlimited Portfolios","Custom Domain support","All 3 Templates","Analytics Dashboard","Export to PDF","Custom SEO tags","LinkedIn share card"].map((f,i)=>(
                  <li key={i} className="flex items-center gap-2 text-sm text-zinc-300"><span className="text-indigo-400">✓</span>{f}</li>
                ))}
              </ul>
              <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold transition-colors text-sm">
                Upgrade — ₹299
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-10 relative z-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-zinc-400">Portfolio.ai</span>
          </div>
          <p className="text-zinc-600 text-sm">© 2026 Portfolio AI. Made for students who ship.</p>
          <div className="flex gap-6 text-sm text-zinc-600">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
