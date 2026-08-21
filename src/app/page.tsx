'use client';

import React, { useState } from 'react';
import { Sparkles, Cpu, CheckCircle2, Zap } from 'lucide-react';
import {
  ClassificationWidget,
  TaxonomyKnowledgeBase,
  wasteTaxonomy,
  warehouseInventoryTaxonomy,
} from '@/modules/classification-engine';

export default function HomePage() {
  const [selectedDomain, setSelectedDomain] = useState<'waste' | 'warehouse'>('waste');
  const activeTaxonomy = selectedDomain === 'waste' ? wasteTaxonomy : warehouseInventoryTaxonomy;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Standalone Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-md backdrop-blur-md bg-opacity-95 border-b border-emerald-700/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-white/15 p-2 sm:p-2.5 rounded-2xl backdrop-blur-sm border border-white/20">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  AI Classification<span className="text-emerald-300">Engine</span>
                </h1>
                <p className="text-[11px] text-emerald-200/90 font-medium hidden sm:block">
                  Universal Multi-Domain Item Classifier & Segregation Engine
                </p>
              </div>
            </div>

            {/* Taxonomy Switcher */}
            <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/15 text-xs font-semibold backdrop-blur-sm">
              <span className="px-2 text-emerald-200/80 hidden sm:inline">Active Taxonomy:</span>
              <button
                onClick={() => setSelectedDomain('waste')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  selectedDomain === 'waste'
                    ? 'bg-emerald-500 text-white shadow-md font-bold'
                    : 'text-emerald-100 hover:bg-white/10'
                }`}
              >
                🌱 Municipal Waste
              </button>
              <button
                onClick={() => setSelectedDomain('warehouse')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  selectedDomain === 'warehouse'
                    ? 'bg-emerald-500 text-white shadow-md font-bold'
                    : 'text-emerald-100 hover:bg-white/10'
                }`}
              >
                📦 Warehouse SKUs
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 w-full flex-1 space-y-8">
        {/* Module Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-green-900 to-teal-950 text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-mono text-emerald-200 border border-white/20">
            <Cpu className="w-3.5 h-3.5 text-emerald-300" /> MODULE: AI CLASSIFICATION-AS-A-SERVICE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Universal Item Classification & Routing Engine
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-3xl leading-relaxed">
            Real-time deterministic item identification with token matching, confidence estimation, segregation handling protocols, and automated carbon offset calculations.
          </p>
        </div>

        {/* Live Interactive Classification Engine & Key Capabilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ClassificationWidget config={activeTaxonomy} />
          </div>

          {/* Capabilities Card */}
          <div className="bg-white/90 rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-md space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Engine Capabilities
              </h3>
              <ul className="space-y-3 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Multi-Domain Ready:</strong> Hot-swappable taxonomies for municipal waste, return logistics, and inventory routing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Sub-Millisecond Tokenizer:</strong> Instant keyword token matching with fallback categorization.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Actionable Instructions:</strong> Returns exact destination stream and safety protocols.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Environmental Telemetry:</strong> Live CO₂ and resource conservation multipliers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Headless REST API:</strong> Standalone endpoint accessible at <code className="bg-gray-100 px-1 py-0.5 rounded text-emerald-800 font-mono">/api/modules/classify</code>.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-medium">
              <Zap className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Pluggable micro-engine ready for independent integration.</span>
            </div>
          </div>
        </div>

        {/* Taxonomy Knowledge Hub */}
        <div>
          <TaxonomyKnowledgeBase config={activeTaxonomy} />
        </div>
      </main>

      {/* Standalone Module Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-emerald-950 text-gray-400 py-8 border-t border-emerald-900/40 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">CleanCarbonTracks Classification Engine</span>
            <span className="text-gray-500">• Standalone Module Release</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span className="font-mono">API: GET/POST /api/modules/classify</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
