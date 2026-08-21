'use client';

import React, { useState } from 'react';
import {
  CalendarCheck,
  ShieldCheck,
  User,
  Truck,
  AlertTriangle,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react';
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

export default function HomePage() {
  const [activeRoleTab, setActiveRoleTab] = useState<'booking' | 'dispatch' | 'worker' | 'incidents'>('booking');
  const [bookings, setBookings] = useState<ServiceBookingItem[]>(initialBookingsState);
  const [incidents, setIncidents] = useState<IncidentReport[]>(initialIncidentsState);

  const handleBookingCreated = (newBooking: ServiceBookingItem) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleIncidentLogged = (newIncident: IncidentReport) => {
    setIncidents((prev) => [newIncident, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Standalone Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900 text-white shadow-md backdrop-blur-md bg-opacity-95 border-b border-emerald-700/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-white/15 p-2 sm:p-2.5 rounded-2xl backdrop-blur-sm border border-white/20">
                <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  Service Scheduling<span className="text-emerald-300">Engine</span>
                </h1>
                <p className="text-[11px] text-emerald-200/90 font-medium hidden sm:block">
                  Universal Multi-Role On-Demand Booking & Dispatch Infrastructure
                </p>
              </div>
            </div>

            {/* Role Navigation Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 bg-black/20 p-1.5 rounded-2xl border border-white/15 text-xs font-semibold backdrop-blur-sm">
              <button
                onClick={() => setActiveRoleTab('booking')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeRoleTab === 'booking'
                    ? 'bg-emerald-500 text-white shadow-md font-bold'
                    : 'text-emerald-100 hover:bg-white/10'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Customer</span> Booking
              </button>
              <button
                onClick={() => setActiveRoleTab('dispatch')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeRoleTab === 'dispatch'
                    ? 'bg-emerald-500 text-white shadow-md font-bold'
                    : 'text-emerald-100 hover:bg-white/10'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Operations</span> Dispatch
              </button>
              <button
                onClick={() => setActiveRoleTab('worker')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeRoleTab === 'worker'
                    ? 'bg-emerald-500 text-white shadow-md font-bold'
                    : 'text-emerald-100 hover:bg-white/10'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Field</span> Terminal
              </button>
              <button
                onClick={() => setActiveRoleTab('incidents')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeRoleTab === 'incidents'
                    ? 'bg-emerald-500 text-white shadow-md font-bold'
                    : 'text-emerald-100 hover:bg-white/10'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Incidents
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
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-300" /> MODULE: SERVICE SCHEDULING & INCIDENT MANAGEMENT
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Multi-Role On-Demand Booking & Dispatch Infrastructure
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-3xl leading-relaxed">
            End-to-end appointment lifecycle management: customer booking portal, incident ticketing desk, operations dispatch queue with status state machine, and mobile field worker checklist.
          </p>
        </div>

        {/* Active Role Console View */}
        <div className="animate-fadeIn">
          {activeRoleTab === 'booking' && (
            <div className="max-w-2xl mx-auto">
              <ServiceBookingForm
                config={defaultWasteSchedulingConfig}
                onBookingSubmitted={handleBookingCreated}
              />
            </div>
          )}

          {activeRoleTab === 'dispatch' && (
            <AdminDispatchQueue
              bookings={bookings}
              incidents={incidents}
              onStatusChanged={setBookings}
              onIncidentResolved={setIncidents}
            />
          )}

          {activeRoleTab === 'worker' && (
            <FieldWorkerChecklist bookings={bookings} />
          )}

          {activeRoleTab === 'incidents' && (
            <div className="max-w-2xl mx-auto">
              <IncidentReportForm onIncidentLogged={handleIncidentLogged} />
            </div>
          )}
        </div>
      </main>

      {/* Standalone Module Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-emerald-950 text-gray-400 py-8 border-t border-emerald-900/40 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <CalendarCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">CleanCarbonTracks Scheduling Engine</span>
            <span className="text-gray-500">• Standalone Module Release</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400 font-mono">
            <span>API: /api/modules/scheduling</span>
            <span>•</span>
            <span>API: /api/modules/incidents</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
