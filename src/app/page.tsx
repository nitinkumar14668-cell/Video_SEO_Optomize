'use client';

import { useState, useEffect } from "react";
import { Youtube, Sparkles, CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { analyzeSeo } from "../seo";
import { fixSeo } from "../actions/gemini";
import { ScoreGauge } from "../components/ScoreGauge";

export default function Page() {
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
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-extrabold text-2xl tracking-tighter text-slate-800">vid<span className="text-blue-600">IQ</span><span className="text-sm text-slate-400 font-normal tracking-normal ml-1">Optimizer</span></span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-full cursor-pointer hover:bg-slate-200 transition-colors">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <Youtube className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-slate-700">My Channel</span>
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-16 md:w-64 bg-white border-r border-slate-200 flex flex-col pt-6 flex-shrink-0">
          <nav className="flex-1 px-3 space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-medium group">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="hidden md:block">SEO Optimizer</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium group transition-colors">
              <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              <span className="hidden md:block">Competitors</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium group transition-colors">
              <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              <span className="hidden md:block">Trend Alerts</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg font-medium group transition-colors">
              <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              <span className="hidden md:block">Keyword Inspector</span>
            </a>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 overflow-y-auto bg-slate-50">
        
        {/* Left Column: Live Score & Fix Action */}
        <section className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
          {/* Score Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col items-center text-center">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight mb-4">vidIQ Actionable SEO Score</h3>
            
            <ScoreGauge score={score} />
            
            <div className="mt-4">
              {score >= 80 ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold shadow-sm rounded-full">Great!</span>
              ) : score >= 50 ? (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-bold shadow-sm rounded-full">Needs work</span>
              ) : (
                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-bold shadow-sm rounded-full">Action required</span>
              )}
            </div>
            
            {error && (
               <div className="mt-4 text-xs text-red-600 w-full p-3 bg-red-50 rounded border border-red-100">
                 {error}
               </div>
            )}
          </div>

          {/* Quick Fix Magic Button */}
          <button
            onClick={handleFixSeo}
            disabled={isFixing || score === 100 || (title.length === 0 && description.length === 0)}
            className="w-full bg-[#1db8eb] hover:bg-[#159acc] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1db8eb] disabled:shadow-none text-white py-4 rounded-xl shadow-lg shadow-sky-200 transition-all flex items-center justify-center gap-3 active:scale-95 font-bold text-lg group"
          >
            {isFixing ? (
               <>
                 <RefreshCw className="w-6 h-6 animate-spin" />
                 <span>Optimizing with AI...</span>
               </>
            ) : (
               <>
                 <Sparkles className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
                 Boost SEO with AI
               </>
            )}
          </button>
        </section>

        {/* Right Column: Inputs & Issue List */}
        <section className="flex-1 flex flex-col gap-8 min-w-0">
          
          {/* Metadata Inputs */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
             <h2 className="font-extrabold text-xl tracking-tight text-slate-900 border-b border-slate-100 pb-3">Video Details</h2>
             
             <div>
               <label className="block text-sm font-bold text-slate-800 mb-2">Video Title</label>
               <input
                 type="text"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 placeholder="E.g., How to Grow on YouTube in 2026..."
                 className="w-full bg-white border-2 border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1db8eb] focus:ring-0 transition-colors text-lg font-medium"
               />
               <div className="flex justify-between mt-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                 <span>{title.length} / 100</span>
                 <span className={title.length > 70 ? "text-red-500" : title.length > 40 && title.length < 70 ? "text-green-500" : "text-yellow-500"}>40-70 recommend</span>
               </div>
             </div>

             <div>
               <label className="block text-sm font-bold text-slate-800 mb-2">Video Description</label>
               <textarea
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 placeholder="Write a clear, keyword-rich description..."
                 rows={6}
                 className="w-full bg-white border-2 border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1db8eb] focus:ring-0 transition-colors resize-y leading-relaxed"
               />
               <div className="flex justify-between mt-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                 <span>{description.length} / 5000</span>
                 <span className={description.length >= 250 ? "text-green-500" : "text-slate-500"}>250+ recommended</span>
               </div>
             </div>

             <div>
               <label className="block text-sm font-bold text-slate-800 mb-2">Video Tags</label>
               <input
                 type="text"
                 value={tagsInput}
                 onChange={(e) => setTagsInput(e.target.value)}
                 placeholder="gaming, review, setup tour..."
                 className="w-full bg-white border-2 border-slate-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1db8eb] focus:ring-0 transition-colors"
               />
               <div className="flex justify-between mt-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                 <span>{tagsInput.split(',').filter(t => t.trim()).length} tags</span>
                 <span className={tagsInput.split(',').filter(t => t.trim()).length >= 5 ? "text-green-500" : "text-slate-500"}>5-15 recommended</span>
               </div>
             </div>
          </div>

          {/* Issue Management */}
          <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[300px]">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-white rounded-t-xl">
              <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                Action Items
                {problems.length > 0 && (
                  <span className="flex items-center justify-center bg-red-100 text-red-600 text-xs w-6 h-6 rounded-full font-bold">{problems.length}</span>
                )}
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              <AnimatePresence>
                {problems.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="p-6 rounded-lg border border-green-200 bg-green-50 flex flex-col items-center justify-center text-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-base font-extrabold text-green-800">Your video is fully optimized!</p>
                      <p className="text-sm text-green-600 font-medium">You've hit all the sweet spots for the YouTube algorithm.</p>
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
                      <div className="p-4 rounded-lg border border-red-200 bg-white shadow-sm flex items-start gap-4">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-red-50 flex items-center justify-center text-red-500 border border-red-100">
                           <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="pt-1 w-full">
                           <div className="flex justify-between items-center">
                             <p className="text-sm font-bold text-slate-900">SEO Issue</p>
                           </div>
                           <p className="text-sm text-slate-600 mt-1 leading-relaxed font-medium">{prob}</p>
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
    </div>
  );
}
