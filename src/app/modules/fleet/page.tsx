'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Navigation, Code2, Copy, Check, Radio } from 'lucide-react';
import {
  FleetRadarCanvas,
  FleetTelemetryBanner,
  VehicleUnitCard,
  initialFleetData,
  computeFleetAggregate,
  simulateFleetTick,
} from '@/modules/fleet-radar-engine';

export default function FleetModulePage() {
  const [fleetUnits, setFleetUnits] = useState(initialFleetData);
  const [selectedUnitId, setSelectedUnitId] = useState(initialFleetData[0].id);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFleetUnits((prev) => simulateFleetTick(prev));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const telemetry = computeFleetAggregate(fleetUnits);
  const selectedUnit = fleetUnits.find((u) => u.id === selectedUnitId) || fleetUnits[0];

  const codeSnippet = `import { FleetRadarCanvas, FleetTelemetryBanner } from '@/modules/fleet-radar-engine';

export function LogisticsCenterView() {
  return (
    <>
      <FleetTelemetryBanner telemetry={telemetryData} />
      <FleetRadarCanvas units={fleetUnits} onSelectUnit={(id) => ...} />
    </>
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
          <span className="flex items-center gap-2 text-xs font-mono font-semibold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" /> LIVE TELEMETRY ENGINE
          </span>
        </div>

        {/* Product Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-green-900 to-teal-950 text-white p-8 rounded-3xl shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-mono text-emerald-200 border border-white/20">
            <Navigation className="w-3.5 h-3.5" /> MODULE 2: FLEET RADAR & ROUTE OPTIMIZATION
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Universal Fleet Radar & Fuel Telematics Engine
          </h1>
          <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
            Scalable telemetry and radar visualization for moving asset fleets (sanitation trucks, courier dispatch, field tech patrols) with dynamic waypoint and fuel tracking.
          </p>
        </div>

        {/* Aggregate Banner */}
        <FleetTelemetryBanner telemetry={telemetry} />

        {/* Radar & Unit View */}
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

        {/* Developer Integration Section */}
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
