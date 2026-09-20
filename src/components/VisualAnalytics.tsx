import React, { useState } from 'react';
import { PieChart, BarChart3, AlertCircle, ShieldAlert, CheckCircle } from 'lucide-react';
import { CameraFindingRecord, SpecialDeploymentRecord } from '../types';

interface VisualAnalyticsProps {
  cameraFindings: CameraFindingRecord[];
  specialDeployments: SpecialDeploymentRecord[];
}

export const VisualAnalytics: React.FC<VisualAnalyticsProps> = ({
  cameraFindings,
  specialDeployments
}) => {
  const [hoveredFinding, setHoveredFinding] = useState<string | null>(null);

  // 1. Calculate aggregated Camera Findings by type
  const findingsData = [
    {
      id: 'outOfCameraView',
      label: 'ከካሜራ እይታ ውጪ መሆን',
      count: cameraFindings.reduce((s, r) => s + (Number(r.outOfCameraView) || 0), 0),
      color: '#f59e0b' // amber-500
    },
    {
      id: 'batteryClosedEarly',
      label: 'ባትሪ ሳይጨርስ መዝጋት',
      count: cameraFindings.reduce((s, r) => s + (Number(r.batteryClosedEarly) || 0), 0),
      color: '#ef4444' // rose-500
    },
    {
      id: 'earlyReturn',
      label: 'ስራ አቋርጦ መመለስ',
      count: cameraFindings.reduce((s, r) => s + (Number(r.earlyReturn) || 0), 0),
      color: '#8b5cf6' // purple-500
    },
    {
      id: 'lensCovered',
      label: 'ሌንስ መሸፈን',
      count: cameraFindings.reduce((s, r) => s + (Number(r.lensCovered) || 0), 0),
      color: '#3b82f6' // blue-500
    },
    {
      id: 'theftOrRelated',
      label: 'የስርቆት/ተዛማጅ ችግር',
      count: cameraFindings.reduce((s, r) => s + (Number(r.theftOrRelated) || 0), 0),
      color: '#ec4899' // pink-500
    },
    {
      id: 'skippedShopInspection',
      label: 'ንግድ ቤት ዘልሎ ቁጥጥር',
      count: cameraFindings.reduce((s, r) => s + (Number(r.skippedShopInspection) || 0), 0),
      color: '#10b981' // emerald-500
    }
  ];

  const totalFindings = findingsData.reduce((s, d) => s + d.count, 0);

  // 2. Disciplinary Actions Breakdown
  const disciplinaryData = [
    { label: 'የቃል ማስጠንቀቂያ', count: cameraFindings.reduce((s, r) => s + (Number(r.verbalWarning) || 0), 0), color: '#fbbf24' },
    { label: 'የጽሁፍ ማስጠንቀቂያ', count: cameraFindings.reduce((s, r) => s + (Number(r.writtenWarning) || 0), 0), color: '#f97316' },
    { label: 'የመጨረሻ ማስጠንቀቂያ', count: cameraFindings.reduce((s, r) => s + (Number(r.finalWarning) || 0), 0), color: '#ef4444' },
    { label: 'በዲሲፕሊን ክስ', count: cameraFindings.reduce((s, r) => s + (Number(r.disciplinaryCharge) || 0), 0), color: '#b91c1c' }
  ];

  // 3. Administrative Violations in Special Deployments
  const violationsData = [
    { label: 'ያለ ደረሰኝ ግብይት', count: specialDeployments.reduce((s, r) => s + (Number(r.noReceiptTransaction) || 0), 0) },
    { label: 'ምርመራ መዝገብ አለማስቀመጥ', count: specialDeployments.reduce((s, r) => s + (Number(r.noAuditRegister) || 0), 0) },
    { label: 'ማስታወቂያ አለመለጠፍ', count: specialDeployments.reduce((s, r) => s + (Number(r.noNoticeOrRegister) || 0), 0) },
    { label: 'መረጃ ሳያገናኙ መጠቀም', count: specialDeployments.reduce((s, r) => s + (Number(r.unlinkedUsage) || 0), 0) },
    { label: 'መሰናክል መፍጠር', count: specialDeployments.reduce((s, r) => s + (Number(r.creatingObstacle) || 0), 0) },
    { label: 'ቴክኒክ ምርመራ አለማድረግ', count: specialDeployments.reduce((s, r) => s + (Number(r.noTechInspection) || 0), 0) },
    { label: 'የእጅ በእጅ ደረሰኝ ጥሰት', count: specialDeployments.reduce((s, r) => s + (Number(r.manualReceiptViolation) || 0), 0) },
    { label: 'ብልሸት አለማሳወቅ', count: specialDeployments.reduce((s, r) => s + (Number(r.failureToReportBreakdown) || 0), 0) },
    { label: 'ጉዳት ማድረስ', count: specialDeployments.reduce((s, r) => s + (Number(r.causingDamage) || 0), 0) },
    { label: 'አድራሻ መለወጥ', count: specialDeployments.reduce((s, r) => s + (Number(r.addressChangeWithoutNotice) || 0), 0) },
    { label: 'ቫት አለመለቀቅ', count: specialDeployments.reduce((s, r) => s + (Number(r.vatNotReleased) || 0), 0) }
  ].sort((a, b) => b.count - a.count);

  const maxViolationCount = Math.max(...violationsData.map(v => v.count), 1);

  // Calculate SVG Pie/Doughnut angles
  let accumulatedAngle = 0;
  const radius = 70;
  const strokeWidth = 32;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* 1. Camera Findings Visual Doughnut Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">የካሜራ ግኝቶች ስርጭት ገበታ (Camera Findings)</h3>
              <p className="text-[11px] text-slate-500">የካሜራ እይታ፣ ባትሪ፣ ሌንስና የቁጥጥር ስነ-ስርዓት ክፍተቶች</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-700 px-2 py-0.5 bg-slate-100 rounded-md">
            ድምር: {totalFindings}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
          
          {/* SVG Doughnut */}
          <div className="relative w-44 h-44 flex items-center justify-center flex-shrink-0">
            {totalFindings === 0 ? (
              <div className="text-center p-4">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                <p className="text-xs text-slate-600 font-medium">ምንም አይነት የካሜራ ግኝት አልተመዘገበም</p>
              </div>
            ) : (
              <>
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth={strokeWidth}
                  />
                  {findingsData.map((item) => {
                    if (item.count === 0) return null;
                    const strokeDasharray = `${(item.count / totalFindings) * circumference} ${circumference}`;
                    const strokeDashoffset = -accumulatedAngle;
                    accumulatedAngle += (item.count / totalFindings) * circumference;

                    const isHovered = hoveredFinding === item.id;

                    return (
                      <circle
                        key={item.id}
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-200 cursor-pointer"
                        onMouseEnter={() => setHoveredFinding(item.id)}
                        onMouseLeave={() => setHoveredFinding(null)}
                      />
                    );
                  })}
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-slate-800">{totalFindings}</span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">ግኝቶች</span>
                </div>
              </>
            )}
          </div>

          {/* Legend Items */}
          <div className="space-y-1.5 w-full sm:w-auto text-xs">
            {findingsData.map((item) => {
              const pct = totalFindings > 0 ? Math.round((item.count / totalFindings) * 100) : 0;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredFinding(item.id)}
                  onMouseLeave={() => setHoveredFinding(null)}
                  className={`flex items-center justify-between gap-3 px-2 py-1 rounded transition-colors ${
                    hoveredFinding === item.id ? 'bg-slate-100 font-medium' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700 truncate max-w-[170px] text-xs">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <span className="font-bold text-slate-900">{item.count}</span>
                    <span className="text-[10px] text-slate-400 w-8">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Disciplinary Summary Pills */}
        <div className="mt-5 pt-3 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 block mb-2">የተወሰዱ የዲሲፕሊን እርምጃዎች ሁኔታ፡</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {disciplinaryData.map((d, i) => (
              <div key={i} className="bg-slate-50 rounded p-2 border border-slate-200/70 text-center">
                <span className="text-[10px] text-slate-500 block truncate">{d.label}</span>
                <span className="text-sm font-bold text-slate-800">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Special Deployment Administrative Violations Bar Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">የልዩ ስምሪት ጥሰቶች እና እርምጃዎች (Violations)</h3>
              <p className="text-[11px] text-slate-500">በግብር ከፋዮች ላይ የተመዘገቡ የህግ ጥሰቶች ዝርዝር</p>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-600 px-2 py-0.5 bg-rose-50 rounded-md">
            ድምር: {violationsData.reduce((s, v) => s + v.count, 0)}
          </span>
        </div>

        <div className="space-y-2.5">
          {violationsData.slice(0, 6).map((item, idx) => {
            const widthPct = Math.max(8, Math.round((item.count / maxViolationCount) * 100));
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-medium">{item.label}</span>
                  <span className="font-bold text-slate-900">{item.count} ጉዳይ</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.count === 0 ? 0 : widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Other lower violations summary note */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>ተጨማሪ የተመዘገቡ ጥሰቶች (Manual receipts, damage, vat)</span>
          <span className="font-semibold text-slate-700">
            {violationsData.slice(6).reduce((s, v) => s + v.count, 0)} ተመዝግቧል
          </span>
        </div>
      </div>

    </div>
  );
};
