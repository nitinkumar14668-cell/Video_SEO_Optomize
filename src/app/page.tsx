'use client';

import { useState, useEffect } from "react";
import { Youtube, Sparkles, CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { analyzeSeo } from "../seo";
import { fixSeo } from "../actions/gemini";
import { ScoreGauge } from "../components/ScoreGauge";

export default function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  
  const [score, setScore] = useState(0);
  const [problems, setProblems] = useState<string[]>([]);
  
  const [isFixing, setIsFixing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recalculate SEO score whenever inputs change, using a small debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
      const analysis = analyzeSeo(title, description, tags);
      setScore(analysis.score);
      setProblems(analysis.problems);
    }, 500);

    return () => clearTimeout(handler);
  }, [title, description, tagsInput]);

  const handleFixSeo = async () => {
    setIsFixing(true);
    setError(null);
    try {
      const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
      const result = await fixSeo(title, description, tags, problems);
      setTitle(result.title || title);
      setDescription(result.description || description);
      setTagsInput(result.tags ? result.tags.join(", ") : tagsInput);
    } catch (err: any) {
      setError(err?.message || "Failed to fix SEO. Make sure your API key is correct.");
      console.error(err);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-hidden">
      {/* Header Navigation */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
          </div>
          <span className="font-bold text-xl tracking-tight uppercase">Vidio<span className="text-indigo-600">Optima</span></span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-4">
            <span className="text-sm font-medium text-slate-500 hover:text-indigo-600 cursor-pointer hidden md:block">Dashboard</span>
            <span className="text-sm font-medium text-indigo-600">SEO Analyzer</span>
            <span className="text-sm font-medium text-slate-500 hover:text-indigo-600 cursor-pointer hidden md:block">Rankings</span>
          </div>
          <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
            <span className="text-sm font-semibold hidden sm:inline">Creator</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 overflow-y-auto">
        
        {/* Left Column: Live Score & Fix Action */}
        <section className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
          {/* Score Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col items-center text-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Live SEO Score</h3>
            
            <ScoreGauge score={score} />
            
            <div className="mt-6">
              {score >= 80 ? (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Excellent</span>
              ) : score >= 50 ? (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Needs Improvement</span>
              ) : (
                <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">Critical Issues</span>
              )}
            </div>
            
            {error && (
               <div className="mt-4 text-xs text-rose-600 w-full p-3 bg-rose-50 rounded border border-rose-100">
                 {error}
               </div>
            )}
          </div>

          {/* Quick Fix Magic Button */}
          <button
            onClick={handleFixSeo}
            disabled={isFixing || score === 100 || (title.length === 0 && description.length === 0)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 disabled:shadow-none text-white py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-95 font-bold group"
          >
            {isFixing ? (
               <>
                 <RefreshCw className="w-5 h-5 animate-spin" />
                 <span>Optimizing...</span>
               </>
            ) : (
               <>
                 <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
                 One-Click Fix All
               </>
            )}
          </button>
        </section>

        {/* Right Column: Inputs & Issue List */}
        <section className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* Metadata Inputs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-5">
             <h2 className="font-bold text-lg leading-tight text-slate-800">Video Metadata</h2>
             
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Video Title</label>
               <input
                 type="text"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 placeholder="Enter an engaging title..."
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
               />
               <div className="flex justify-between mt-2 text-xs font-semibold text-slate-400">
                 <span>Target: 40-70 chars</span>
                 <span className={title.length > 70 ? "text-rose-500" : ""}>{title.length} / 100</span>
               </div>
             </div>

             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
               <textarea
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 placeholder="Write a detailed description including main keywords in the first lines..."
                 rows={6}
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-y"
               />
               <div className="flex justify-between mt-2 text-xs font-semibold text-slate-400">
                 <span>Target: 250+ chars</span>
                 <span>{description.length} / 5000</span>
               </div>
             </div>

             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Tags (Comma Separated)</label>
               <input
                 type="text"
                 value={tagsInput}
                 onChange={(e) => setTagsInput(e.target.value)}
                 placeholder="gaming, review, unboxing, 2026..."
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
               />
               <div className="flex justify-between mt-2 text-xs font-semibold text-slate-400">
                 <span>Target: 5-15 tags</span>
                 <span>{tagsInput.split(',').filter(t => t.trim()).length} tags</span>
               </div>
             </div>
          </div>

          {/* Issue Management */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[300px]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
              <h3 className="font-bold text-slate-800">Optimization Checklist 
                <span className="text-sm font-normal text-slate-400 ml-2">({problems.length} issues found)</span>
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {problems.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 flex items-center justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">Everything looks great!</p>
                        <p className="text-xs text-slate-500">Your video metadata is fully optimized.</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  problems.map((prob) => (
                    <motion.div
                      key={prob}
                      initial={{ opacity: 0, x: 20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/30 flex items-start gap-4">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                           <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="pt-1">
                           <p className="text-sm font-bold text-slate-800">SEO Issue</p>
                           <p className="text-xs text-slate-500 mt-0.5">{prob}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
          
        </section>
      </main>
    </div>
  );
}
