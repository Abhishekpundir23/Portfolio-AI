"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, LogOut, Plus, ExternalLinkIcon, CheckCircle2, XCircle, Loader2, Pencil, Trash2, X, Save, Eye } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type Portfolio = {
  id: string;
  username: string;
  hook: string;
  problem: string;
  solution: string;
  tech_stack: string[];
  win: string;
  learning: string;
  template: string;
  created_at: string;
  views?: number;
};

export default function Dashboard() {
  const [pendingData, setPendingData] = useState<any>(null);
  const [savedPortfolios, setSavedPortfolios] = useState<Portfolio[]>([]);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "taken" | "available">("idle");
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);
      const emailPrefix = user.email?.split('@')[0] || user.user_metadata?.user_name || 'user';
      setUsername(emailPrefix.toLowerCase().replace(/[^a-z0-9]/g, ''));
      const { data: portfolios } = await supabase
        .from('portfolios').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (portfolios) setSavedPortfolios(portfolios);
      const pending = localStorage.getItem("portfolio");
      if (pending) setPendingData(JSON.parse(pending));
      setIsLoading(false);
    };
    init();
  }, [router]);

  // Debounced username availability check
  useEffect(() => {
    if (!username || username.length < 3) { setUsernameStatus("idle"); return; }
    setUsernameStatus("checking");
    const timer = setTimeout(async () => {
      const { data } = await supabase.from('portfolios').select('username').eq('username', username).maybeSingle();
      setUsernameStatus(data ? "taken" : "available");
    }, 600);
    return () => clearTimeout(timer);
  }, [username]);

  const handleSaveToDB = async () => {
    if (!user || !pendingData || !username || usernameStatus !== "available") return;
    setIsSaving(true);
    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '');

    const { data, error } = await supabase.from('portfolios').insert([{
      user_id: user.id,
      username: cleanUsername,
      hook: pendingData.hook,
      problem: pendingData.problem,
      solution: pendingData.solution,
      tech_stack: pendingData.toolsUsed || pendingData.techStack,
      win: pendingData.win,
      learning: pendingData.learning,
      template: pendingData.template || "bold",
      repo_url: pendingData.repoUrl || null,
    }]).select().single();

    if (error) {
      console.error(error);
      if (error.code === '23505') {
        alert("That username is already taken! Please choose a different one.");
        setUsernameStatus("taken");
      } else {
        alert(`Error saving portfolio: ${error.message}`);
      }
      setIsSaving(false);
    } else {
      localStorage.removeItem("portfolio");
      setPendingData(null);
      setSavedPortfolios(prev => [data as Portfolio, ...prev]);
      setIsSaving(false);
      showToast("🎉 Portfolio published! Your public URL is live.");
    }
  };

  // --- EDIT ---
  const handleEdit = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setEditForm({
      hook: portfolio.hook,
      problem: portfolio.problem,
      solution: portfolio.solution,
      tech_stack: portfolio.tech_stack,
      win: portfolio.win,
      learning: portfolio.learning,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingPortfolio || !editForm) return;
    setIsUpdating(true);

    const { error } = await supabase
      .from('portfolios')
      .update({
        hook: editForm.hook,
        problem: editForm.problem,
        solution: editForm.solution,
        tech_stack: editForm.tech_stack,
        win: editForm.win,
        learning: editForm.learning,
      })
      .eq('id', editingPortfolio.id);

    if (error) {
      alert(`Error updating: ${error.message}`);
    } else {
      setSavedPortfolios(prev =>
        prev.map(p => p.id === editingPortfolio.id ? { ...p, ...editForm } : p)
      );
      setEditingPortfolio(null);
      setEditForm(null);
      showToast("✅ Portfolio updated successfully!");
    }
    setIsUpdating(false);
  };

  // --- DELETE ---
  const handleDelete = async (id: string, uname: string) => {
    if (!confirm(`Delete portfolio "${uname}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('portfolios').delete().eq('id', id);
    if (error) {
      alert(`Error deleting: ${error.message}`);
    } else {
      setSavedPortfolios(prev => prev.filter(p => p.id !== id));
      showToast("🗑️ Portfolio deleted.");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (isLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  const usernameIndicator = () => {
    if (username.length < 3) return null;
    if (usernameStatus === "checking") return <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />;
    if (usernameStatus === "taken") return <XCircle className="w-4 h-4 text-red-400" />;
    if (usernameStatus === "available") return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-zinc-900 border border-zinc-700 rounded-full text-sm text-white shadow-2xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingPortfolio && editForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={() => { setEditingPortfolio(null); setEditForm(null); }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">Edit Portfolio</h2>
                  <p className="text-zinc-500 text-sm">portfolio.ai/{editingPortfolio.username}</p>
                </div>
                <button onClick={() => { setEditingPortfolio(null); setEditForm(null); }}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Hook / Title</label>
                  <textarea className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                    rows={2} value={editForm.hook} onChange={(e) => setEditForm({ ...editForm, hook: e.target.value })} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Problem</label>
                    <textarea className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                      rows={4} value={editForm.problem} onChange={(e) => setEditForm({ ...editForm, problem: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Solution</label>
                    <textarea className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                      rows={4} value={editForm.solution} onChange={(e) => setEditForm({ ...editForm, solution: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-green-500 uppercase tracking-widest mb-2">Impact / Win</label>
                  <textarea className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-green-500 resize-none text-green-100"
                    rows={2} value={editForm.win} onChange={(e) => setEditForm({ ...editForm, win: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Key Takeaway</label>
                  <textarea className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                    rows={2} value={editForm.learning} onChange={(e) => setEditForm({ ...editForm, learning: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Tools & Skills (comma-separated)</label>
                  <input className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500"
                    value={editForm.tech_stack?.join(", ") || ""}
                    onChange={(e) => setEditForm({ ...editForm, tech_stack: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })} />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800">
                <button onClick={() => { setEditingPortfolio(null); setEditForm(null); }}
                  className="px-5 py-2.5 text-zinc-400 hover:text-white transition-colors text-sm">Cancel</button>
                <button onClick={handleSaveEdit} disabled={isUpdating}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 flex items-center gap-2">
                  <Save className="w-4 h-4" /> {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation */}
      <div className="w-full border-b border-zinc-900 py-4 px-6 flex justify-between items-center text-sm bg-black">
        <div className="font-bold text-lg flex items-center gap-2">
          Portfolio.ai <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded">Dashboard</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-zinc-500 text-xs hidden md:block">{user?.email}</span>
          <Link href="/onboarding" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-full flex items-center gap-2 transition-colors">
            <Plus className="w-3.5 h-3.5" /> New Portfolio
          </Link>
          <button onClick={handleSignOut} className="text-zinc-500 hover:text-white transition-colors" title="Sign out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <main className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Pending draft banner */}
        {pendingData && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl mb-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-amber-400 font-bold uppercase tracking-widest mb-1">Draft — Unpublished</div>
                <h2 className="font-bold text-white">{pendingData.hook}</h2>
                <p className="text-zinc-400 text-sm mt-1">Choose a unique username to claim your public URL.</p>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-56">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">portfolio.ai/</span>
                  <input type="text" value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                    className={`w-full bg-black border rounded-lg py-2.5 pl-24 pr-9 text-sm focus:outline-none transition-colors ${
                      usernameStatus === "taken" ? "border-red-500/50 focus:border-red-500" :
                      usernameStatus === "available" ? "border-green-500/50 focus:border-green-500" :
                      "border-zinc-700 focus:border-indigo-500"
                    }`} />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">{usernameIndicator()}</div>
                </div>
                <button onClick={handleSaveToDB} disabled={isSaving || !username || usernameStatus !== "available"}
                  className="px-5 py-2.5 bg-white text-black rounded-lg font-semibold text-sm hover:bg-zinc-200 transition-colors disabled:opacity-40 whitespace-nowrap">
                  {isSaving ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>
            <button onClick={() => { localStorage.removeItem("portfolio"); setPendingData(null); }}
              className="text-xs text-zinc-600 hover:text-red-400 transition-colors mt-3">Discard draft</button>
            {usernameStatus === "taken" && <p className="text-red-400 text-xs mt-2">❌ Username taken. Try a different one.</p>}
          </div>
        )}

        {/* Published portfolios */}
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Your Published Portfolios</h2>

        {savedPortfolios.length === 0 && !pendingData ? (
          <div className="text-center py-24 border border-zinc-900 border-dashed rounded-2xl">
            <p className="text-zinc-500 mb-2 text-lg font-semibold">No portfolios yet</p>
            <p className="text-zinc-600 mb-6 text-sm">Generate your first AI case study to get started.</p>
            <Link href="/onboarding" className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors inline-block">
              Create Case Study
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {savedPortfolios.map((p) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">
                    portfolio.ai/{p.username}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-600 capitalize">{p.template || "bold"}</span>
                    <a href={`/${p.username}`} target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-white transition-colors">
                      <ExternalLinkIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <h3 className="font-bold text-white mb-2 line-clamp-2 leading-snug">{p.hook}</h3>
                <p className="text-zinc-500 text-sm mb-4 line-clamp-2">{p.problem}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tech_stack?.slice(0, 3).map((tech, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-400">{tech}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-zinc-900">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-600">{new Date(p.created_at).toLocaleDateString()}</span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1" title="Profile Views">
                      <Eye className="w-3 h-3" /> {p.views || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleEdit(p)}
                      className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors flex items-center gap-1">
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => handleDelete(p.id, p.username)}
                      className="text-xs text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                    <a href={`/${p.username}`} target="_blank" rel="noreferrer"
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                      View Live <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
