import React from 'react';
import { Video, AlertTriangle, FileText, CheckCircle2, ShieldAlert, Users, Layers } from 'lucide-react';
import { CameraUsageRecord, CameraFindingRecord, SpecialDeploymentRecord } from '../types';

interface KpiMetricsProps {
  cameraUsage: CameraUsageRecord[];
  cameraFindings: CameraFindingRecord[];
  specialDeployments: SpecialDeploymentRecord[];
}

export const KpiMetrics: React.FC<KpiMetricsProps> = ({
  cameraUsage,
  cameraFindings,
  specialDeployments
}) => {
  // Calculations
  const activeCamerasCount = cameraUsage.filter(c => Boolean(c.cameraId && c.cameraId !== '—')).length;
  
  // Unique woredas
  const uniqueWoredas = new Set(
    cameraUsage
      .map(c => c.assignedWoreda.trim())
      .filter(w => w && w !== '—')
  ).size;

  // Total findings from section 2
  const totalFindingsCount = cameraFindings.reduce((acc, curr) => acc + (Number(curr.totalFindingsCount) || 0), 0);

  // Total taxpayers assigned
  const totalTaxpayersAssigned = specialDeployments.reduce((acc, curr) => acc + (Number(curr.taxpayersAssigned) || 0), 0);

  // Total administrative measures taken in section 3
  const totalAdminMeasures = specialDeployments.reduce((acc, curr) => acc + (Number(curr.administrativeMeasuresCount) || 0), 0);

  // Total disciplinary actions taken in section 2
  const totalDisciplinary = cameraFindings.reduce(
    (acc, curr) => acc + (Number(curr.verbalWarning) || 0) + (Number(curr.writtenWarning) || 0) + (Number(curr.finalWarning) || 0) + (Number(curr.disciplinaryCharge) || 0),
    0
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      
      {/* 1. Deployed Cameras */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1.5">
          <span className="text-xs font-medium">የወጡ ካሜራዎች</span>
          <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
            <Video className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-slate-900">{activeCamerasCount}</span>
          <span className="text-[11px] text-slate-500">ካሜራ</span>
        </div>
        <p className="text-[10px] text-emerald-600 mt-1 font-medium">በስራ ላይ ያሉ</p>
      </div>

      {/* 2. Covered Woredas */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1.5">
          <span className="text-xs font-medium">የተሸፈኑ ወረዳዎች</span>
          <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-slate-900">{uniqueWoredas}</span>
          <span className="text-[11px] text-slate-500">ወረዳ</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">የመስክ ሽፋን</p>
      </div>

      {/* 3. Taxpayers Checked */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1.5">
          <span className="text-xs font-medium">የተመረመሩ ግብር ከፋዮች</span>
          <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-slate-900">{totalTaxpayersAssigned}</span>
          <span className="text-[11px] text-slate-500">ነጋዴ</span>
        </div>
        <p className="text-[10px] text-purple-600 mt-1 font-medium">ልዩ ስምሪት</p>
      </div>

      {/* 4. Administrative Measures */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1.5">
          <span className="text-xs font-medium">አስተዳደራዊ እርምጃዎች</span>
          <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-rose-600">{totalAdminMeasures}</span>
          <span className="text-[11px] text-slate-500">ቅጣት/እርምጃ</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">የግብር ጥሰት</p>
      </div>

      {/* 5. Camera Findings Infractions */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1.5">
          <span className="text-xs font-medium">የካሜራ ግኝቶች</span>
          <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-amber-600">{totalFindingsCount}</span>
          <span className="text-[11px] text-slate-500">ግኝት</span>
        </div>
        <p className="text-[10px] text-amber-700 mt-1 font-medium">የተመዘገቡ ክፍተቶች</p>
      </div>

      {/* 6. Disciplinary warnings */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-1.5">
          <span className="text-xs font-medium">የተወሰደ የዲሲፕሊን እርምጃ</span>
          <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-slate-800">{totalDisciplinary}</span>
          <span className="text-[11px] text-slate-500">ማስጠንቀቂያ</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">በተቆጣጣሪዎች ላይ</p>
      </div>

    </div>
  );
};
