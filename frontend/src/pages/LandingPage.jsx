import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Scan, Bot, ShoppingBag, ArrowRight, ShieldCheck, Cpu, Database, Award } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-6">
            <Cpu className="w-4 h-4 text-emerald-400" /> Deep Learning & RAG Smart Farming Solution
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            AI-Driven Smart Farming <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Marketplace & Advisory Platform</span>
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Empowering farmers with instant <strong className="text-white">MobileNetV2 crop disease diagnosis</strong>, grounded <strong className="text-white">RAG + Groq AI advisory</strong>, and a direct <strong className="text-white">farmer-to-buyer produce marketplace</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-900/50 transition-all hover:scale-105"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl backdrop-blur-sm transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Main Core Pillar Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl transition-all">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
              <Scan className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">MobileNetV2 Disease Classifier</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Transfer learning model trained on PlantVillage dataset and evaluated on independent FieldPlant real-world images for accurate disease identification.
            </p>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Image Input → Disease + Confidence Score</span>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl transition-all">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6">
              <Bot className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">RAG + Groq AI Advisory</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Retrieval-Augmented Generation system matching query embeddings against Chroma Cloud knowledge database (`agricultural_knowledge`) for grounded treatment advice.
            </p>
            <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">No Hallucinations → Grounded Sources</span>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl transition-all">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Direct Farmer-to-Buyer Marketplace</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Zero-middleman marketplace allowing farmers to list produce, accept buyer purchase requests, and mark orders ready for direct pickup.
            </p>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Direct Pickup → Zero Commission</span>
          </div>
        </div>
      </div>

      {/* Tech Stack Specs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Full-Stack System Architecture</h2>
          <p className="text-slate-600 mt-2 text-sm max-w-2xl mx-auto">
            Cleanly decoupled, enterprise-grade architecture connecting React, Spring Boot, PostgreSQL, FastAPI, MobileNetV2, Chroma Cloud, and Groq.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Deep Learning</span>
            <h4 className="text-lg font-bold text-slate-900 mt-1">MobileNetV2</h4>
            <p className="text-xs text-slate-500 mt-1">TensorFlow / Keras Transfer Learning</p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Vector Store</span>
            <h4 className="text-lg font-bold text-slate-900 mt-1">Chroma Cloud</h4>
            <p className="text-xs text-slate-500 mt-1">all-MiniLM-L6-v2 Embeddings</p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Main Backend</span>
            <h4 className="text-lg font-bold text-slate-900 mt-1">Spring Boot 3</h4>
            <p className="text-xs text-slate-500 mt-1">Spring Security + JWT + JPA</p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Database</span>
            <h4 className="text-lg font-bold text-slate-900 mt-1">PostgreSQL</h4>
            <p className="text-xs text-slate-500 mt-1">Neon Cloud Transactional Store</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
