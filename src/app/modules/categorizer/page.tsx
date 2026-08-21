'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Code2, Layers, Cpu, Copy, Check } from 'lucide-react';
import {
  ClassificationWidget,
  TaxonomyKnowledgeBase,
  wasteTaxonomy,
  warehouseInventoryTaxonomy,
} from '@/modules/classification-engine';

export default function CategorizerModulePage() {
  const [selectedDomain, setSelectedDomain] = useState<'waste' | 'warehouse'>('waste');
  const [copied, setCopied] = useState(false);

  const activeTaxonomy = selectedDomain === 'waste' ? wasteTaxonomy : warehouseInventoryTaxonomy;

  const codeSnippet = `import { ClassificationWidget, wasteTaxonomy } from '@/modules/classification-engine';

// Use as an embeddable React component
export function MyCustomView() {
  return (
    <ClassificationWidget
      config={wasteTaxonomy}
      onClassified={(match) => console.log('Identified stream:', match)}
    />
  );
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-slate-50 to-white text-gray-800 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 bg-white/80 px-4 py-2 rounded-xl shadow-sm border border-emerald-100 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Main Hub
          </Link>

          <div className="flex items-center gap-2 bg-white/90 p-1.5 rounded-2xl border border-gray-200 shadow-sm text-xs font-semibold">
            <span className="px-2 text-gray-500">Taxonomy Preset:</span>
            <button
              onClick={() => setSelectedDomain('waste')}
              className={`px-3 py-1.5 rounded-xl transition ${
                selectedDomain === 'waste'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🌱 Municipal Waste
            </button>
            <button
              onClick={() => setSelectedDomain('warehouse')}
              className={`px-3 py-1.5 rounded-xl transition ${
                selectedDomain === 'warehouse'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📦 Warehouse SKUs
            </button>
          </div>
        </div>

        {/* Product Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-8 rounded-3xl shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-mono text-emerald-200 border border-white/20">
            <Cpu className="w-3.5 h-3.5" /> MODULE 1: AI CLASSIFICATION-AS-A-SERVICE
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Universal Domain Item Classification Engine
          </h1>
          <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
            Fully generic, plug-and-play classification engine with token matching, confidence estimation, customizable taxonomy JSONs, and impact metrics.
          </p>
        </div>

        {/* Live Embed Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ClassificationWidget config={activeTaxonomy} />
          <div className="space-y-6">
            {/* Developer Code Box */}
            <div className="bg-slate-900 text-slate-200 p-6 rounded-3xl shadow-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" /> Integration Code
                </span>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition text-slate-300"
                >
                  {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="overflow-x-auto text-emerald-300 leading-relaxed">{codeSnippet}</pre>
            </div>

            {/* REST API Callout */}
            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-md space-y-2 text-xs">
              <span className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">Direct REST API Endpoint</span>
              <p className="font-mono bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-emerald-800 truncate">
                GET /api/modules/classify?q=plastic+bottle&domain=waste
              </p>
            </div>
          </div>
        </div>

        {/* Knowledge Hub */}
        <TaxonomyKnowledgeBase config={activeTaxonomy} />
      </div>
    </div>
  );
}
