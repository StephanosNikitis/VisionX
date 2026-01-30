"use client";
import { useState } from 'react';
import axios from 'axios';

export default function ImageTranslator() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState({
    classification: "",
    visual_findings: [],
    rationale: "",
    confidence_score: 0,
    disclaimer: ""
  });
  const [loading, setLoading] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post('/api/users/imageanalysis', formData);
      const text = response.data.reply?.[0]?.candidates?.[0]?.content?.parts?.[0]?.text;
      const res = JSON.parse(text);
      
      setResult({
        classification: res.classification,
        visual_findings: res.visual_findings,
        rationale: res.rationale,
        confidence_score: res.confidence_score,
        disclaimer: res.disclaimer
      });
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <span className="bg-blue-600 text-white p-2 rounded-lg text-xl">✙</span>
              SCAN-MD ANALYZER
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Computer Vision Diagnostic Support System</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client v2.0</span>
            <span className="px-3 py-1 bg-green-100 border border-green-200 rounded-full text-[10px] font-bold text-green-700 uppercase tracking-widest">System Ready</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Image Lightbox */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center min-h-[400px] border-[12px] border-slate-900 relative overflow-hidden group">
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-[350px] object-contain rounded-lg group-hover:opacity-90 transition-opacity" />
              ) : (
                <div className="text-center text-slate-500 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center text-2xl mb-4">↑</div>
                  <p className="font-bold text-xs uppercase tracking-widest">Waiting for Scan Upload</p>
                </div>
              )}
              <input 
                type="file" 
                onChange={onFileChange} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
            </div>

            <button 
              onClick={handleUpload}
              disabled={loading || !file}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-sm"
            >
              {loading ? "Analyzing Matrix..." : "Begin Neural Scan"}
            </button>
          </div>

         
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden h-full flex flex-col">
              
              <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Analysis Report</span>
                {result.confidence_score > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Confidence</span>
                    <span className="text-sm font-black text-blue-600">{(result.confidence_score * 100).toFixed(1)}%</span>
                  </div>
                )}
              </div>

              <div className="p-8 flex-1 overflow-y-auto space-y-8">
                {loading ? (
                  <div className="space-y-6 animate-pulse">
                    <div className="h-8 bg-slate-100 rounded w-1/3" />
                    <div className="h-24 bg-slate-50 rounded w-full" />
                    <div className="h-24 bg-slate-50 rounded w-full" />
                  </div>
                ) : !result.classification ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                    <span className="text-6xl mb-4">🔬</span>
                    <p className="text-sm font-bold uppercase tracking-widest">No Data Processed</p>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <section className="mb-8">
                      <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-2">Classification</h3>
                      <p className="text-2xl font-black text-slate-900 leading-tight">{result.classification}</p>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-2">Visual Findings</h3>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {Array.isArray(result.visual_findings) ? result.visual_findings.map((finding, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold border border-slate-200 italic">
                            • {finding}
                          </span>
                        )) : <p className="text-sm italic text-slate-600">{result.visual_findings}</p>}
                      </div>
                    </section>

                    <section className="mb-8">
                      <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-2">Diagnostic Rationale</h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">{result.rationale}</p>
                    </section>

                    <section className="mt-12 p-4 bg-red-50 border border-red-100 rounded-xl">
                       <h3 className="text-[10px] font-black uppercase text-red-600 tracking-widest mb-1">Medical Disclaimer</h3>
                       <p className="text-[10px] text-red-700 leading-relaxed font-bold italic">{result.disclaimer}</p>
                    </section>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}