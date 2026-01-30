"use client"
import React from "react";
import axios from "axios";

export default function PyChat() {
  const [setin, setInput] = React.useState({ data: "" });
  const [reply, setReply] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const Chat = async () => {
    if (!setin.data.trim()) return;
    try {
      setIsLoading(true);
      setError("");
      const response = await axios.post("https://fastapi-backend-4-ue78.onrender.com/api/chatbot", { data: setin.data })
      setReply(response.data.reply)
    } catch (error: any) {
      setError("COMMUNICATION_ERROR: Failed to retrieve clinical data.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 font-sans p-4 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-200">
       
        <div className="lg:col-span-5 p-8 md:p-12 bg-slate-50 border-r border-slate-100 flex flex-col">
          <div className="mb-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-200">
              <span className="text-xl font-bold">+</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">MED-ASSIST AI</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Diagnostic Support Module</p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-500 ml-1">Symptom Description / Query</label>
              <textarea 
                value={setin.data}
                onChange={(e) => setInput({...setin, data: e.target.value})}
                placeholder="Example: Describe your symptoms or ask about medication side effects..."
                className="w-full h-48 p-5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none shadow-sm placeholder:text-slate-300"
              />
            </div>

            <button 
              disabled={isLoading}
              onClick={Chat}
              className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-3
                ${isLoading 
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                  : "bg-slate-900 text-white hover:bg-teal-700 active:scale-[0.98] shadow-xl shadow-slate-200"}`}
            >
              {isLoading ? (
                <div className="flex gap-1.5">
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                   <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                </div>
              ) : "Analyze Query"}
            </button>
          </div>

          <div className="mt-8 p-4 bg-teal-50 rounded-2xl border border-teal-100">
            <p className="text-[10px] text-teal-800 leading-relaxed font-medium">
              <strong className="uppercase">Disclaimer:</strong> This AI provides informational support and is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>

        
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col bg-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
             <span className="text-8xl font-black italic"> WELCOME </span>
          </div>

          <div className="mb-8 border-b border-slate-100 pb-6 flex justify-between items-center">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Analysis Report</h2>
            {reply && <span className="text-[10px] font-mono text-slate-300">REF_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>}
          </div>

          <div className="flex-1 overflow-y-auto">
            {!reply && !isLoading && !error && (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                <div className="w-12 h-12 border-2 border-slate-100 rounded-full flex items-center justify-center text-xl font-serif">?</div>
                <p className="text-sm italic font-medium">Waiting for input analysis...</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-mono">
                {error}
              </div>
            )}

            {reply && !isLoading && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-6 bg-teal-500 rounded-full" />
                  <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">AI Clinical Insights</h3>
                </div>
                <div className="text-slate-700 leading-relaxed text-lg font-serif italic border-l-4 border-slate-50 pl-6 py-2">
                  {reply}
                </div>
                
                <div className="mt-12 space-y-4">
                   <div className="h-[1px] bg-slate-100 w-full" />
                   <p className="text-[10px] font-mono text-slate-400 flex justify-between uppercase">
                    
                     <span>Reliability: High</span>
                   </p>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="space-y-6">
                <div className="h-8 bg-slate-50 rounded-lg w-1/4 animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 bg-slate-50 rounded-lg w-full animate-pulse" />
                  <div className="h-4 bg-slate-50 rounded-lg w-5/6 animate-pulse" />
                  <div className="h-4 bg-slate-50 rounded-lg w-4/6 animate-pulse" />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}