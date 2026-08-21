'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarCheck, Code2, Copy, Check, ShieldCheck, User, Truck } from 'lucide-react';
import {
  ServiceBookingForm,
  IncidentReportForm,
  AdminDispatchQueue,
  FieldWorkerChecklist,
  initialBookingsState,
  initialIncidentsState,
  defaultWasteSchedulingConfig,
} from '@/modules/service-scheduling-engine';
import { ServiceBookingItem, IncidentReport } from '@/modules/service-scheduling-engine/types';

export default function SchedulingModulePage() {
  const [activeSubTab, setActiveSubTab] = useState<'booking' | 'dispatch' | 'worker' | 'incidents'>('booking');
  const [bookings, setBookings] = useState<ServiceBookingItem[]>(initialBookingsState);
  const [incidents, setIncidents] = useState<IncidentReport[]>(initialIncidentsState);
  const [copied, setCopied] = useState(false);

  const codeSnippet = `import { ServiceBookingForm, AdminDispatchQueue } from '@/modules/service-scheduling-engine';

// Use as generic customer portal or dispatch desk
export function BookingView() {
  return (
    <ServiceBookingForm
      config={customServiceConfig}
      onBookingSubmitted={(b) => console.log('Booking created:', b)}
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
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 bg-white/80 px-4 py-2 rounded-xl shadow-sm border border-emerald-100 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Main Hub
          </Link>
          <span className="text-xs font-mono font-semibold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200">
            SERVICE-SCHEDULING-ENGINE v1.0
          </span>
        </div>

        {/* Product Banner */}
        <div className="bg-gradient-to-r from-green-800 via-emerald-800 to-teal-900 text-white p-8 rounded-3xl shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-mono text-emerald-200 border border-white/20">
            <CalendarCheck className="w-3.5 h-3.5" /> MODULE 3: SERVICE SCHEDULING & INCIDENT INFRASTRUCTURE
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Multi-Role On-Demand Booking & Dispatch Engine
          </h1>
          <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
            Universal appointment booking, grievance escalation, admin dispatch queue, and mobile field worker checklist architecture.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex flex-wrap items-center gap-2 bg-white/90 p-2 rounded-2xl border border-gray-200 shadow-sm text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('booking')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeSubTab === 'booking' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Customer Booking Form
          </button>
          <button
            onClick={() => setActiveSubTab('dispatch')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeSubTab === 'dispatch' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Operations Dispatch Queue
          </button>
          <button
            onClick={() => setActiveSubTab('worker')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeSubTab === 'worker' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Truck className="w-3.5 h-3.5" /> Field Worker Terminal
          </button>
          <button
            onClick={() => setActiveSubTab('incidents')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeSubTab === 'incidents' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🚨 Incident Report Form
          </button>
        </div>

        {/* Active Component View */}
        <div className="animate-fadeIn">
          {activeSubTab === 'booking' && (
            <div className="max-w-2xl mx-auto">
              <ServiceBookingForm
                config={defaultWasteSchedulingConfig}
                onBookingSubmitted={(b) => setBookings((prev) => [b, ...prev])}
              />
            </div>
          )}

          {activeSubTab === 'dispatch' && (
            <AdminDispatchQueue
              bookings={bookings}
              incidents={incidents}
              onStatusChanged={setBookings}
              onIncidentResolved={setIncidents}
            />
          )}

          {activeSubTab === 'worker' && (
            <FieldWorkerChecklist bookings={bookings} />
          )}

          {activeSubTab === 'incidents' && (
            <div className="max-w-2xl mx-auto">
              <IncidentReportForm onIncidentLogged={(inc) => setIncidents((prev) => [inc, ...prev])} />
            </div>
          )}
        </div>

        {/* Developer Integration Snippet */}
        <div className="bg-slate-900 text-slate-200 p-6 rounded-3xl shadow-xl border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
            <span className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" /> Standalone Integration Code
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
      </div>
    </div>
  );
}
