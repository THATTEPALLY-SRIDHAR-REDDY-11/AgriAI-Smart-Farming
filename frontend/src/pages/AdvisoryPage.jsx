import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { advisoryService } from '../services/advisoryService';
import { ErrorAlert } from '../components/ErrorAlert';
import { Bot, Send, Sparkles, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, FileText, CheckCircle2 } from 'lucide-react';

export const AdvisoryPage = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [question, setQuestion] = useState('');
  const [crop, setCrop] = useState(location.state?.crop || '');
  const [disease, setDisease] = useState(location.state?.disease || '');
  const [confidence, setConfidence] = useState(location.state?.confidence || null);
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch initial advisory automatically if navigated from Disease Detection page
  useEffect(() => {
    if (location.state?.disease) {
      handleFetchAdvisory({
        crop: location.state.crop,
        disease: location.state.disease,
        confidence: location.state.confidence,
        question: `How should I manage ${location.state.disease}?`
      });
    }
  }, [location.state]);

  const handleFetchAdvisory = async (payload) => {
    setLoading(true);
    setError('');

    try {
      const res = await advisoryService.getAdvisory(user.profileId, payload);
      setAdvisory(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate AI advisory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() && !disease) return;

    handleFetchAdvisory({
      question: question.trim(),
      crop: crop.trim() || undefined,
      disease: disease.trim() || undefined,
      confidence: confidence || undefined
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">AI Agricultural Advisor</h1>
          <p className="text-slate-500 text-sm mt-1">
            Instant grounded advisories retrieved from agricultural research databases using RAG & Groq LLM.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-emerald-600" /> Powered by RAG + Groq
        </div>
      </div>

      <ErrorAlert message={error} />

      {/* Question / Advisory Form */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Ask Agricultural Question or Specify Crop Condition
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. How often should I irrigate tomato plants in summer? or How to treat early blight?"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-200 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? 'Consulting RAG...' : <><Send className="w-4 h-4" /> Ask AI</>}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Rendered Structured Advisory Output */}
      {advisory && (
        <div className="space-y-6">
          {/* Main Summary Banner */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-8 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-700/60 pb-4 mb-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-300">Target Crop</span>
                <h2 className="text-2xl font-extrabold">{advisory.crop} — {advisory.disease}</h2>
              </div>
              {advisory.confidence && (
                <div className="px-4 py-2 bg-emerald-700/80 rounded-2xl border border-emerald-500/40 text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-200 block">Model Confidence</span>
                  <span className="text-lg font-extrabold text-white">{(advisory.confidence * 100).toFixed(1)}%</span>
                </div>
              )}
            </div>
            <p className="text-emerald-100 text-sm leading-relaxed">{advisory.whatItMeans}</p>
          </div>

          {/* Section Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Symptoms Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3>Symptoms to Identify</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                {advisory.symptoms?.map((sym, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Management Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
                <h3>Management & Treatment</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                {advisory.management?.map((mgmt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{mgmt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prevention Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-base">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                <h3>Preventive Practices</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                {advisory.prevention?.map((prev, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                    <span>{prev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Precautions Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-red-800 font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3>Precautions & Warning</h3>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed bg-red-50/50 p-3 rounded-xl border border-red-100">
                {advisory.precautions}
              </p>
            </div>
          </div>

          {/* Full AI Answer Explanation */}
          {advisory.answer && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3>Detailed Grounded Recommendation</h3>
              </div>
              <div className="prose prose-slate max-w-none text-sm text-slate-700 whitespace-pre-line bg-slate-50 p-4 rounded-xl">
                {advisory.answer}
              </div>
            </div>
          )}

          {/* Knowledge Sources Citation */}
          <div className="bg-slate-100 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span className="font-bold text-slate-800">Verified Knowledge Sources:</span>
              <span>{advisory.sources?.join(' • ')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvisoryPage;
