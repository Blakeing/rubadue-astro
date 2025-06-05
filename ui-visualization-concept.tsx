// Litz Wire Calculator UI - Engineering-Focused Design
import React from 'react';
import { AlertTriangle, CheckCircle, Info, Zap } from 'lucide-react';

interface EngineeringResultsProps {
  results: {
    construction: { type: string; operations: number; isValid: boolean };
    electrical: { totalCMA: number; equivalentAWG: string; dcResistance: number };
    skinDepth: { mils: number; n1Max: number };
    warnings: string[];
  };
}

export function EngineeringResults({ results }: EngineeringResultsProps) {
  return (
    <div className="space-y-6">
      
      {/* Critical Alerts - Always Visible */}
      <AlertPanel warnings={results.warnings} />
      
      {/* Key Results Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total CMA"
          value={results.electrical.totalCMA}
          unit="CMA"
          status={results.construction.isValid ? "valid" : "warning"}
          helpText="Circular Mil Area - total conductor cross-section"
        />
        
        <MetricCard
          title="Equivalent AWG"
          value={results.electrical.equivalentAWG}
          unit="AWG"
          status="info"
          helpText="Solid wire equivalent using lower bound algorithm"
        />
        
        <MetricCard
          title="Construction"
          value={`${results.construction.type} (${results.construction.operations} ops)`}
          status={results.construction.isValid ? "valid" : "error"}
          helpText="Litz construction type and operation count"
        />
      </div>

      {/* Technical Analysis Tabs */}
      <TechnicalTabs>
        <TabPanel title="Skin Effect Analysis" icon={<Zap />}>
          <SkinEffectAnalysis 
            skinDepthMils={results.skinDepth.mils}
            n1Max={results.skinDepth.n1Max}
            frequency={1200}
          />
        </TabPanel>
        
        <TabPanel title="Construction Details" icon={<Info />}>
          <ConstructionDetails 
            type={results.construction.type}
            operations={results.construction.operations}
            packingFactor={1.236}
            takeUpFactor={1.03}
          />
        </TabPanel>
        
        <TabPanel title="Insulation Options" icon={<CheckCircle />}>
          <InsulationMatrix awgSize={40} />
        </TabPanel>
      </TechnicalTabs>

      {/* Excel-Style Calculation Preview */}
      <CalculationPreview />
    </div>
  );
}

function AlertPanel({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) return null;
  
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
        <div>
          <h3 className="text-sm font-medium text-yellow-800">Engineering Considerations</h3>
          <ul className="mt-1 text-sm text-yellow-700">
            {warnings.map((warning, i) => (
              <li key={i}>• {warning}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, unit, status, helpText }: {
  title: string;
  value: string | number;
  unit?: string;
  status: "valid" | "warning" | "error" | "info";
  helpText: string;
}) {
  const statusColors = {
    valid: "border-green-200 bg-green-50",
    warning: "border-yellow-200 bg-yellow-50", 
    error: "border-red-200 bg-red-50",
    info: "border-blue-200 bg-blue-50"
  };
  
  return (
    <div className={`p-4 rounded-lg border-2 ${statusColors[status]}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {value} {unit && <span className="text-lg text-gray-600">{unit}</span>}
          </p>
        </div>
        <Info className="h-4 w-4 text-gray-400" data-tooltip={helpText} />
      </div>
    </div>
  );
}

function SkinEffectAnalysis({ skinDepthMils, n1Max, frequency }: {
  skinDepthMils: number;
  n1Max: number; 
  frequency: number;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Skin Depth Analysis</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Skin Depth:</span>
            <span className="font-mono ml-2">{skinDepthMils.toFixed(2)} mils</span>
          </div>
          <div>
            <span className="text-blue-700">N1 Max:</span>
            <span className="font-mono ml-2">{n1Max} strands</span>
          </div>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          @ {frequency}Hz using Excel Q6 temperature correction
        </p>
      </div>
      
      {/* Frequency Impact Chart would go here */}
      <FrequencyImpactChart currentFreq={frequency} skinDepth={skinDepthMils} />
    </div>
  );
}

function ConstructionDetails({ type, operations, packingFactor, takeUpFactor }: {
  type: string;
  operations: number;
  packingFactor: number;
  takeUpFactor: number;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Construction Factors</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-700">Packing Factor:</span>
            <span className="font-mono ml-2">{packingFactor}</span>
            <span className="text-xs text-gray-500 block">For diameter calculations</span>
          </div>
          <div>
            <span className="text-gray-700">Take Up Factor:</span>
            <span className="font-mono ml-2">{takeUpFactor}</span>
            <span className="text-xs text-gray-500 block">For resistance calculations</span>
          </div>
        </div>
      </div>
      
      {/* Construction flow visualization */}
      <ConstructionFlow operations={operations} type={type} />
    </div>
  );
}

function InsulationMatrix({ awgSize }: { awgSize: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-right">Min (in)</th>
            <th className="px-4 py-2 text-right">Nom (in)</th>
            <th className="px-4 py-2 text-right">Max (in)</th>
            <th className="px-4 py-2 text-left">UL Rating</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td className="px-4 py-2 font-medium">Single</td>
            <td className="px-4 py-2 text-right font-mono">0.0032</td>
            <td className="px-4 py-2 text-right font-mono">0.0035</td>
            <td className="px-4 py-2 text-right font-mono">0.0037</td>
            <td className="px-4 py-2 text-green-600">✓ Compliant</td>
          </tr>
          {/* More rows... */}
        </tbody>
      </table>
    </div>
  );
}

// Placeholder components for additional visualizations
function TechnicalTabs({ children }: { children: React.ReactNode }) {
  return <div className="border rounded-lg">{children}</div>;
}

function TabPanel({ title, icon, children }: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
}) {
  return <div className="p-4">{children}</div>;
}

function CalculationPreview() {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-900 mb-2">Excel Formula Reference</h4>
      <div className="text-xs font-mono text-gray-600 space-y-1">
        <div>Q6: =E4*(1+N6*(P6-O6)) → Temperature correction</div>
        <div>E17: =ROUNDDOWN(4*(E8²/(E16²)),0) → N1 Max calculation</div>
        <div>D7: Type-specific packing factor lookup</div>
      </div>
    </div>
  );
}

function FrequencyImpactChart({ currentFreq, skinDepth }: { 
  currentFreq: number; 
  skinDepth: number; 
}) {
  // Would implement actual chart here
  return (
    <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-gray-500">
      Frequency vs Skin Depth Chart (Current: {currentFreq}Hz)
    </div>
  );
}

function ConstructionFlow({ operations, type }: { 
  operations: number; 
  type: string; 
}) {
  return (
    <div className="text-sm text-gray-600">
      <span className="font-medium">{type}</span> construction with {operations} operations
      {/* Could add visual flow diagram here */}
    </div>
  );
} 