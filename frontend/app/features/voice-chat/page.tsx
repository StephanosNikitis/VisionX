"use client";
import { useState } from "react";
import axios from "axios";

export default function AudioUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [responseData, setResponseData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadAudio = async () => {
    if (!file) {
      alert("Please select an audio file");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post("https://fastapi-backend-4-ue78.onrender.com/api/voicebot", formData);
      setResponseData(response.data);
    } catch (error: any) {
      console.error(error.message);
      alert("Error processing audio. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI Voice Assistant</h1>
        <p className="text-slate-500">Upload your query to get an instant AI response.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="relative group">
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <span className="text-3xl mb-2">🎙️</span>
                <p className="text-sm text-slate-600 font-medium">
                  {file ? file.name : "Choose audio file"}
                </p>
                <p className="text-xs text-slate-400 mt-1">MP3, WAV up to 10MB</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="audio/*" 
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
              />
            </label>
          </div>

          <button 
            disabled={!file || isUploading}
            onClick={uploadAudio}
            className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
              ${!file || isUploading 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"}`}
          >
            {isUploading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Processing...
              </>
            ) : (
              "Upload & Analyze"
            )}
          </button>
        </div>

        <div className="lg:col-span-2">
          {!responseData && !isUploading && (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dotted border-slate-200 rounded-3xl text-slate-400 italic">
              Results will appear here...
            </div>
          )}

          {isUploading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-12 bg-slate-100 rounded-xl w-3/4"></div>
              <div className="h-32 bg-slate-100 rounded-xl w-full"></div>
            </div>
          )}

         {responseData && (
  <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-500 ease-out">
    
    <div className="flex items-center justify-between bg-slate-800 p-3 rounded-t-2xl border-x border-t border-slate-700">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-xs font-mono text-slate-400 ml-2">api_response.json</span>
      </div>
      <button 
        onClick={() => navigator.clipboard.writeText(JSON.stringify(responseData, null, 2))}
        className="text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors"
      >
        Copy Raw Data
      </button>
    </div>

    
    <div className="relative group">
      <div className="
        bg-slate-900 
        border-x border-b border-slate-700 
        rounded-b-2xl 
        shadow-2xl 
        transition-all 
        duration-700 
        ease-in-out
        max-h-[80vh] 
        overflow-y-auto 
        custom-scrollbar
      ">
        <div className="p-6 font-mono text-sm sm:text-base leading-relaxed">
        
          {responseData.transcription && (
            <div className="mb-6 pb-6 border-b border-slate-800">
              <span className="text-blue-400 font-bold block mb-2 text-xs uppercase underline-offset-4 underline">Transcription:</span>
              <p className="text-slate-100 text-lg font-sans italic">
                {responseData.transcription}
              </p>
            </div>
          )}

          <span className="text-green-500/50 font-bold block mb-2 text-xs uppercase">Full JSON:</span>
          <pre className="text-green-400 whitespace-pre-wrap break-all">
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900 to-transparent rounded-b-2xl pointer-events-none opacity-60"></div>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
}