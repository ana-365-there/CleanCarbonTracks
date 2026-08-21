'use client';

import React, { useState, useEffect } from 'react';
import {
  Navigation,
  Radio,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  Truck,
  Activity,
} from 'lucide-react';
import {
  FleetRadarCanvas,
  FleetTelemetryBanner,
  VehicleUnitCard,
  initialFleetData,
  computeFleetAggregate,
  simulateFleetTick,
} from '@/modules/fleet-radar-engine';

export default function HomePage() {
  const [fleetUnits, setFleetUnits] = useState(initialFleetData);
  const [selectedUnitId, setSelectedUnitId] = useState(initialFleetData[0].id);

  // Live simulation tick every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setFleetUnits((prev) => simulateFleetTick(prev));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const telemetry = computeFleetAggregate(fleetUnits);
  const selectedUnit = fleetUnits.find((u) => u.id === selectedUnitId) || fleetUnits[0];

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Standalone Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-emerald-900 via-green-900 to-teal-950 text-white shadow-md backdrop-blur-md bg-opacity-95 border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-white/15 p-2 sm:p-2.5 rounded-2xl backdrop-blur-sm border border-white/20">
                <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  Fleet Radar<span className="text-emerald-300">Engine</span>
                </h1>
                <p className="text-[11px] text-emerald-200/90 font-medium hidden sm:block">
                  Universal Real-Time Telematics & Dynamic Route Optimization
                </p>
              </div>
            </div>

            {/* Live GPS Lock Indicator */}
            <div className="flex items-center gap-2 bg-black/20 px-3.5 py-1.5 rounded-2xl border border-white/15 text-xs font-mono font-semibold backdrop-blur-sm text-emerald-200">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>LIVE TELEMETRY ENGINE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 w-full flex-1 space-y-8">
        {/* Module Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-green-900 to-teal-950 text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-mono text-emerald-200 border border-white/20">
            <Navigation className="w-3.5 h-3.5 text-emerald-300" /> MODULE: FLEET RADAR & ROUTE OPTIMIZATION
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Universal Fleet Radar & Route Optimization Engine
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-3xl leading-relaxed">
            Scalable telemetry and radar visualization for moving vehicle fleets with dynamic waypoint tracking, battery monitoring, and fuel optimization telemetry.
          </p>
        </div>

        {/* Aggregate Telemetry Banner */}
        <FleetTelemetryBanner telemetry={telemetry} />

        {/* Radar Simulation Canvas & Selected Unit Inspector */}
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
              unit={selectedUnit}
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

        {/* Key Capabilities Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white/90 p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2.5">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-2xl w-fit">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">Fuel Reduction Telemetry</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Demonstrates real-time 15%+ fuel efficiency gains via dynamic waypoint reordering and congestion bypass algorithms.
            </p>
          </div>

          <div className="bg-white/90 p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2.5">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">Turnaround Acceleration</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Cuts route completion delays by over 20% through synchronized arrival schedules and live waypoint progress tracking.
            </p>
          </div>

          <div className="bg-white/90 p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2.5">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl w-fit">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">Pluggable IoT Telematics</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Decoupled simulation and radar interface ready for integration with GPS hardware, driver mobile terminals, and IoT collars.
            </p>
          </div>
        </div>
      </main>

      {/* Standalone Module Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-emerald-950 text-gray-400 py-8 border-t border-emerald-900/40 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">CleanCarbonTracks Fleet Radar Engine</span>
            <span className="text-gray-500">• Standalone Module Release</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span className="font-mono">API: GET /api/modules/fleet</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
