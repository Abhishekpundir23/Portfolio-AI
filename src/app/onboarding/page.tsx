"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, GitBranch, FileText, Code, Palette, Database, Download, Upload, X, BarChart3, Megaphone, PenTool, Briefcase, GraduationCap, Cpu, Stethoscope, Building2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Step = 1 | 2 | 3 | 4 | 5;
type Template = "bold" | "minimal" | "creative";

const roles = [
  { id: "frontend", name: "Frontend Dev", icon: <Palette className="w-6 h-6" /> },
  { id: "backend", name: "Backend Dev", icon: <Database className="w-6 h-6" /> },
  { id: "fullstack", name: "Full Stack Dev", icon: <Code className="w-6 h-6" /> },
  { id: "data", name: "Data / ML Engineer", icon: <BarChart3 className="w-6 h-6" /> },
  { id: "designer", name: "UI/UX Designer", icon: <PenTool className="w-6 h-6" /> },
  { id: "marketing", name: "Marketing / Growth", icon: <Megaphone className="w-6 h-6" /> },
  { id: "product", name: "Product Manager", icon: <Briefcase className="w-6 h-6" /> },
  { id: "content", name: "Content / Writer", icon: <FileText className="w-6 h-6" /> },
  { id: "research", name: "Research / Academic", icon: <GraduationCap className="w-6 h-6" /> },
  { id: "hardware", name: "IoT / Hardware", icon: <Cpu className="w-6 h-6" /> },
  { id: "health", name: "Healthcare / Biotech", icon: <Stethoscope className="w-6 h-6" /> },
  { id: "business", name: "MBA / Finance", icon: <Building2 className="w-6 h-6" /> },
];

const templates: { id: Template; name: string; desc: string; bg: string; textColor: string }[] = [
  { id: "bold", name: "Bold Dark", desc: "Developer aesthetic. High contrast, terminal vibes.", bg: "bg-zinc-950", textColor: "text-white" },
  { id: "minimal", name: "Minimal Light", desc: "Clean, editorial. Apple-inspired white space.", bg: "bg-white", textColor: "text-zinc-900" },
  { id: "creative", name: "Creative Gradient", desc: "Vibrant, bold. For designers and creative devs.", bg: "bg-violet-950", textColor: "text-white" },
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [pdfText, setPdfText] = useState("");
  const [template, setTemplate] = useState<Template>("bold");
  const [isGenerating, setIsGenerating] = useState(false);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [editedData, setEditedData] = useState<any>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePdfUpload = (file: File) => {
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("PDF must be under 10MB.");
      return;
    }
    setPdfFile(file);
  };

  // Convert a File to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:application/pdf;base64, prefix
        resolve(result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStep(3);
    try {
      const body: any = {
        role,
        repoUrl: githubUrl,
        inputData: pdfText || (githubUrl ? `GitHub repo: ${githubUrl}` : ""),
      };

      // If a PDF file was uploaded, convert to base64 and send to Gemini
      if (pdfFile) {
        body.pdfBase64 = await fileToBase64(pdfFile);
        body.pdfName = pdfFile.name;
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setPortfolioData(data.data);
        setEditedData(data.data);
        setStep(4);
      } else {
        alert(data.error || "Failed to generate. Please try again.");
        setStep(2);
      }
    } catch (error: any) {
      alert(error?.message || "Error generating portfolio.");
      setStep(2);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveAndContinue = () => {
    localStorage.setItem("portfolio", JSON.stringify({ ...editedData, template, repoUrl: githubUrl }));
    setStep(5);
  };

  const publish = async () => {
    // Re-save with the FINAL template choice from step 5
    const existing = localStorage.getItem("portfolio");
    if (existing) {
      const data = JSON.parse(existing);
      localStorage.setItem("portfolio", JSON.stringify({ ...data, template }));
    }
    
    // Check if user is already logged in — skip login if so
    const { createClient } = await import("@/utils/supabase/client");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  const stepLabels = ["Role", "Project", "AI Magic", "Review", "Publish"];

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="absolute top-[-10%] right-[10%] w-[30%] h-[40%] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 py-12 max-w-3xl relative z-10">
        <div className="flex items-center gap-2 mb-12">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Sparkles className="text-indigo-400 h-6 w-6" />
            <span className="font-bold text-xl">Portfolio.ai</span>
          </Link>
        </div>

        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-zinc-900 -z-10">
              <motion.div
                className="h-full bg-indigo-600 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${((step - 1) / 4) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                  step > s ? "bg-indigo-600 border-indigo-600 text-white" :
                  step === s ? "bg-black border-indigo-500 text-indigo-400" :
                  "bg-black border-zinc-800 text-zinc-600"
                }`}>
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                <span className={`text-[10px] font-medium hidden md:block ${step >= s ? "text-zinc-400" : "text-zinc-700"}`}>
                  {stepLabels[s - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Role */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">What's your primary role?</h1>
                <p className="text-zinc-400">Helps our AI tailor language and metrics for your industry.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {roles.map((r) => (
                  <button key={r.id} onClick={() => setRole(r.name)}
                    className={`p-4 rounded-xl border text-left transition-all ${role === r.name ? "border-indigo-500 bg-indigo-500/10" : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"}`}>
                    <div className={`${role === r.name ? "text-indigo-400" : "text-zinc-500"} mb-3`}>{r.icon}</div>
                    <div className="font-semibold text-sm">{r.name}</div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-6 border-t border-zinc-900">
                <button onClick={() => setStep(2)} disabled={!role}
                  className="px-6 py-3 bg-white text-black font-semibold rounded-full disabled:opacity-40 flex items-center gap-2 hover:bg-zinc-100 transition-colors">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Project Input */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Connect your best project</h1>
                <p className="text-zinc-400">Paste a GitHub link or paste your project description / report text below.</p>
              </div>
              <div className="space-y-6 p-6 glass-card rounded-2xl">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">GitHub Repository URL</label>
                  <div className="relative">
                    <GitBranch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username/project"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-4 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-zinc-600">
                  <div className="h-px bg-zinc-800 flex-1" /><span>OR</span><div className="h-px bg-zinc-800 flex-1" />
                </div>

                {/* PDF Upload */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Upload PDF Report</label>
                  {pdfFile ? (
                    <div className="flex items-center justify-between p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-indigo-400" />
                        <div>
                          <p className="text-sm font-medium text-white truncate max-w-[250px]">{pdfFile.name}</p>
                          <p className="text-xs text-indigo-400">Ready for AI analysis ✓</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setPdfFile(null); setPdfText(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        className="p-1.5 hover:bg-zinc-800 rounded-full transition-colors"
                        title="Remove file"
                      >
                        <X className="w-4 h-4 text-zinc-400" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="pdf-upload"
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={(e) => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.files?.[0]) handlePdfUpload(e.dataTransfer.files[0]); }}
                      className={`block w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all ${
                        isExtractingPdf ? "border-indigo-600 bg-indigo-900/20" : "border-zinc-700 hover:border-indigo-500 hover:bg-zinc-900/50"
                      }`}
                    >
                      {isExtractingPdf ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                          <span className="text-indigo-400 text-sm font-medium">Extracting text from PDF…</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-zinc-400">
                          <Upload className="w-6 h-6" />
                          <p className="font-medium text-sm">Drag & drop PDF or click to browse</p>
                          <p className="text-xs text-zinc-600">Supports .pdf files up to 10MB</p>
                        </div>
                      )}
                      <input
                        id="pdf-upload"
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        ref={fileInputRef}
                        disabled={isExtractingPdf}
                        onChange={(e) => { if (e.target.files?.[0]) handlePdfUpload(e.target.files[0]); }}
                      />
                    </label>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-zinc-600">
                  <div className="h-px bg-zinc-800 flex-1" /><span>OR</span><div className="h-px bg-zinc-800 flex-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Paste Project Description / Report</label>
                  <textarea value={pdfText} onChange={(e) => setPdfText(e.target.value)} rows={5}
                    placeholder="Paste your project report, README, or description here... The more detail, the better the AI output."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 px-4 focus:outline-none focus:border-indigo-500 transition-colors resize-none text-sm" />
                </div>
              </div>
              <div className="flex justify-between pt-6 border-t border-zinc-900">
                <button onClick={() => setStep(1)} className="px-6 py-3 text-zinc-400 hover:text-white transition-colors">Back</button>
                <button onClick={handleGenerate} disabled={!githubUrl && !pdfText && !pdfFile}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full disabled:opacity-40 flex items-center gap-2 hover:bg-indigo-500 transition-colors animate-glow">
                  Generate Case Study <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Loading */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="py-24 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-zinc-800 border-t-indigo-500 rounded-full animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 text-indigo-400 animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2 text-gradient">AI is reading your project...</h2>
                <p className="text-zinc-500">Fetching README → Extracting impact → Writing your story</p>
              </div>
              <div className="w-64 bg-zinc-900 rounded-full h-1 overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2.5, repeat: Infinity }} />
              </div>
            </motion.div>
          )}

          {/* Step 4: Review & Edit */}
          {step === 4 && editedData && (
            <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Review & Customize</h1>
                <p className="text-zinc-400">Your AI-generated Case Study. Edit any section to make it perfect.</p>
              </div>
              <div className="space-y-4">
                <div className="glass-card rounded-xl overflow-hidden">
                  <div className="bg-zinc-900/50 px-5 py-2.5 border-b border-zinc-800">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">The Hook</span>
                  </div>
                  <textarea className="w-full bg-transparent p-5 focus:outline-none text-lg font-semibold resize-none"
                    value={editedData.hook} onChange={(e) => setEditedData({ ...editedData, hook: e.target.value })} rows={2} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="glass-card rounded-xl overflow-hidden">
                    <div className="bg-zinc-900/50 px-5 py-2.5 border-b border-zinc-800">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">The Problem</span>
                    </div>
                    <textarea className="w-full bg-transparent p-5 focus:outline-none text-sm resize-none h-28"
                      value={editedData.problem} onChange={(e) => setEditedData({ ...editedData, problem: e.target.value })} />
                  </div>
                  <div className="glass-card rounded-xl overflow-hidden">
                    <div className="bg-zinc-900/50 px-5 py-2.5 border-b border-zinc-800">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">The Solution</span>
                    </div>
                    <textarea className="w-full bg-transparent p-5 focus:outline-none text-sm resize-none h-28"
                      value={editedData.solution} onChange={(e) => setEditedData({ ...editedData, solution: e.target.value })} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="glass-card rounded-xl overflow-hidden">
                    <div className="bg-zinc-900/50 px-5 py-2.5 border-b border-zinc-800">
                      <span className="text-xs font-bold text-green-500 uppercase tracking-widest">The Win (Impact)</span>
                    </div>
                    <textarea className="w-full bg-transparent p-5 focus:outline-none text-sm resize-none h-24 text-green-100"
                      value={editedData.win} onChange={(e) => setEditedData({ ...editedData, win: e.target.value })} />
                  </div>
                  <div className="glass-card rounded-xl overflow-hidden">
                    <div className="bg-zinc-900/50 px-5 py-2.5 border-b border-zinc-800">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tools & Skills</span>
                    </div>
                    <div className="p-5 flex flex-wrap gap-2">
                      {(editedData.toolsUsed || editedData.techStack)?.map((tech: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-6 border-t border-zinc-900">
                <button onClick={() => setStep(2)} className="px-6 py-3 text-zinc-400 hover:text-white transition-colors">← Regenerate</button>
                <button onClick={saveAndContinue}
                  className="px-6 py-3 bg-white text-black font-semibold rounded-full flex items-center gap-2 hover:bg-zinc-100 transition-colors">
                  Choose Template <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Template Picker */}
          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Choose Your Template</h1>
                <p className="text-zinc-400">Pick the aesthetic that matches your personal brand.</p>
              </div>
              <div className="grid gap-4">
                {templates.map((t) => (
                  <button key={t.id} onClick={() => setTemplate(t.id)}
                    className={`flex items-center gap-6 p-5 rounded-2xl border text-left transition-all ${
                      template === t.id ? "border-indigo-500 bg-indigo-500/10" : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                    }`}>
                    {/* Mini preview */}
                    <div className={`${t.bg} w-20 h-14 rounded-lg flex-shrink-0 overflow-hidden flex flex-col justify-center gap-1.5 px-3`}>
                      <div className={`w-3/4 h-2 rounded-full ${t.textColor === "text-white" ? (t.id === "creative" ? "bg-gradient-to-r from-violet-400 to-pink-400" : "bg-zinc-400") : "bg-zinc-700"}`} />
                      <div className={`w-1/2 h-1.5 rounded-full ${t.textColor === "text-white" ? "bg-zinc-700" : "bg-zinc-300"}`} />
                      <div className={`w-full h-1 rounded-full ${t.textColor === "text-white" ? "bg-zinc-800" : "bg-zinc-200"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-white">{t.name}</span>
                        {template === t.id && <span className="text-xs px-2 py-0.5 bg-indigo-600 text-white rounded-full font-semibold">Selected</span>}
                      </div>
                      <p className="text-zinc-500 text-sm">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between pt-6 border-t border-zinc-900">
                <button onClick={() => setStep(4)} className="px-6 py-3 text-zinc-400 hover:text-white transition-colors">Back</button>
                <button onClick={publish}
                  className="px-8 py-3 bg-white text-black font-bold rounded-full flex items-center gap-2 hover:bg-zinc-100 transition-colors">
                  Publish Portfolio 🚀
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
