'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MetricsGrid } from '@/components/analytics/MetricsGrid';

// 🚀 Importing from Standalone, Generalized Modular Engines:
import {
  ClassificationWidget,
  TaxonomyKnowledgeBase,
  wasteTaxonomy,
} from '@/modules/classification-engine';

import {
  FleetRadarCanvas,
  FleetTelemetryBanner,
  VehicleUnitCard,
  initialFleetData,
  computeFleetAggregate,
  simulateFleetTick,
} from '@/modules/fleet-radar-engine';

import {
  ServiceBookingForm,
  IncidentReportForm,
  AdminDispatchQueue,
  FieldWorkerChecklist,
  defaultWasteSchedulingConfig,
  initialBookingsState,
  initialIncidentsState,
} from '@/modules/service-scheduling-engine';
import { ServiceBookingItem, IncidentReport } from '@/modules/service-scheduling-engine/types';

import { mockAnalytics } from '@/lib/mockData';
import { Sparkles, ArrowRight, Layers, Cpu, Navigation, CalendarCheck, ExternalLink } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>('resident');
  const [bookings, setBookings] = useState<ServiceBookingItem[]>(initialBookingsState);
  const [incidents, setIncidents] = useState<IncidentReport[]>(initialIncidentsState);
  const [fleetUnits, setFleetUnits] = useState(initialFleetData);
  const [selectedUnitId, setSelectedUnitId] = useState(initialFleetData[0].id);
  const [metrics, setMetrics] = useState(mockAnalytics);

  // Live simulation tick for fleet movement
  useEffect(() => {
    const timer = setInterval(() => {
      setFleetUnits((prev) => simulateFleetTick(prev));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const fleetTelemetry = computeFleetAggregate(fleetUnits);
  const selectedVehicle = fleetUnits.find((u) => u.id === selectedUnitId) || fleetUnits[0];

  const handleBookingCreated = (newBooking: ServiceBookingItem) => {
    setBookings((prev) => [newBooking, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      pickupsThisWeek: prev.pickupsThisWeek + 1,
      co2SavedKg: Number((prev.co2SavedKg + 1.2).toFixed(1)),
    }));
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        {/* Standalone Modules Showcase Banner */}
        <div className="mb-8 p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-emerald-200 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Layers className="w-3.5 h-3.5" /> 3 GENERALIZED STANDALONE ENGINES
              </span>
              <h3 className="text-xl font-bold text-gray-900 mt-1">Modular & Reusable Architecture</h3>
              <p className="text-xs text-gray-500">Each module is decoupled into <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-emerald-700 font-semibold">src/modules/</code> with its own types, logic, and API endpoints.</p>
            </div>
            <span className="text-xs text-gray-400 font-semibold">Sellable as standalone B2B components</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 */}
            <Link
              href="/modules/categorizer"
              className="group p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 hover:border-emerald-400 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-emerald-800 mb-2">
                  <div className="p-2 bg-emerald-600 text-white rounded-xl">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">Module 1: Classification Engine</h4>
                <p className="text-xs text-gray-600 mt-1">AI Classification-as-a-Service for waste, warehouse SKUs & returns.</p>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-700 mt-3 block">
                src/modules/classification-engine ➔
              </span>
            </Link>

            {/* Card 2 */}
            <Link
              href="/modules/fleet"
              className="group p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 hover:border-blue-400 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-blue-800 mb-2">
                  <div className="p-2 bg-blue-600 text-white rounded-xl">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">Module 2: Fleet Radar & Telematics</h4>
                <p className="text-xs text-gray-600 mt-1">GPS radar map & fuel/time saving route optimization heuristics.</p>
              </div>
              <span className="text-[11px] font-mono font-bold text-blue-700 mt-3 block">
                src/modules/fleet-radar-engine ➔
              </span>
            </Link>

            {/* Card 3 */}
            <Link
              href="/modules/scheduling"
              className="group p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-400 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-amber-800 mb-2">
                  <div className="p-2 bg-amber-600 text-white rounded-xl">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">Module 3: Service Scheduling</h4>
                <p className="text-xs text-gray-600 mt-1">Generic customer booking, incident ticketing & field worker terminal.</p>
              </div>
              <span className="text-[11px] font-mono font-bold text-amber-700 mt-3 block">
                src/modules/service-scheduling-engine ➔
              </span>
            </Link>
          </div>
        </div>

        {/* Environmental Telemetry Header */}
        <MetricsGrid metrics={metrics} />

        {/* Tab 1: Resident Portal (Default Home) */}
        {activeTab === 'resident' && (
          <div className="space-y-12 animate-fadeIn">
            {/* Hero Card */}
            <div className="bg-gradient-to-r from-green-800 via-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold border border-white/20 text-green-200">
                  <Sparkles className="w-4 h-4 text-green-300" /> Integrated Circular Solution
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Doorstep Waste Segregation, Dynamic Routing & Carbon Tracking
                </h2>
                <p className="text-green-100 text-sm sm:text-base leading-relaxed">
                  Never miss garbage collection again. Schedule doorstep pickups for recyclable streams, identify segregation bin types with AI, and track municipal sanitation trucks in real-time.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById('booking-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white text-green-900 hover:bg-green-50 font-bold px-6 py-3 rounded-2xl text-sm transition shadow-lg flex items-center gap-2"
                  >
                    Schedule Pickup <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab('fleet')}
                    className="bg-green-700/60 hover:bg-green-700 text-white border border-green-400/30 font-semibold px-5 py-3 rounded-2xl text-sm transition backdrop-blur-md"
                  >
                    Live Truck Radar
                  </button>
                </div>
              </div>
            </div>

            {/* Resident Booking & Smart Categorizer Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="booking-section">
              <ServiceBookingForm
                config={defaultWasteSchedulingConfig}
                onBookingSubmitted={handleBookingCreated}
              />
              <ClassificationWidget config={wasteTaxonomy} />
            </div>

            {/* Fleet Radar Snapshot */}
            <div className="space-y-4">
              <FleetTelemetryBanner telemetry={fleetTelemetry} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <FleetRadarCanvas
                    units={fleetUnits}
                    selectedUnitId={selectedUnitId}
                    onSelectUnit={setSelectedUnitId}
                  />
                </div>
                <div>
                  <VehicleUnitCard
                    unit={selectedVehicle}
                    onAdvanceStop={(id) => {
                      setFleetUnits((prev) =>
                        prev.map((u) =>
                          u.id === id
                            ? { ...u, currentStopsCompleted: Math.min(u.totalStops, u.currentStopsCompleted + 1) }
                            : u
                        )
                      );
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Know Your Waste Knowledge Base */}
            <div>
              <TaxonomyKnowledgeBase config={wasteTaxonomy} />
            </div>
          </div>
        )}

        {/* Tab 2: Smart Categorizer Deep Dive */}
        {activeTab === 'categorizer' && (
          <div className="space-y-8 animate-fadeIn">
            <ClassificationWidget config={wasteTaxonomy} />
            <TaxonomyKnowledgeBase config={wasteTaxonomy} />
          </div>
        )}

        {/* Tab 3: Fleet Tracking Radar */}
        {activeTab === 'fleet' && (
          <div className="space-y-8 animate-fadeIn">
            <FleetTelemetryBanner telemetry={fleetTelemetry} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FleetRadarCanvas
                  units={fleetUnits}
                  selectedUnitId={selectedUnitId}
                  onSelectUnit={setSelectedUnitId}
                />
              </div>
              <div>
                <VehicleUnitCard
                  unit={selectedVehicle}
                  onAdvanceStop={(id) => {
                    setFleetUnits((prev) =>
                      prev.map((u) =>
                        u.id === id
                          ? { ...u, currentStopsCompleted: Math.min(u.totalStops, u.currentStopsCompleted + 1) }
                          : u
                      )
                    );
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Citizen Grievance & Missed Pickup Report */}
        {activeTab === 'complaints' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
            <IncidentReportForm onIncidentLogged={(inc) => setIncidents((prev) => [inc, ...prev])} />
          </div>
        )}

        {/* Tab 5: Municipality Admin Dashboard */}
        {activeTab === 'admin' && (
          <div className="space-y-8 animate-fadeIn">
            <AdminDispatchQueue
              bookings={bookings}
              incidents={incidents}
              onStatusChanged={setBookings}
              onIncidentResolved={setIncidents}
            />
          </div>
        )}

        {/* Tab 6: Driver Mobile View */}
        {activeTab === 'driver' && (
          <div className="space-y-8 animate-fadeIn">
            <FieldWorkerChecklist bookings={bookings} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
