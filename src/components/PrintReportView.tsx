import React from 'react';
import { CameraUsageRecord, CameraFindingRecord, SpecialDeploymentRecord, ReportHeader } from '../types';
import { Shield, Printer, ArrowLeft, Send } from 'lucide-react';

interface PrintReportViewProps {
  header: ReportHeader;
  cameraUsage: CameraUsageRecord[];
  cameraFindings: CameraFindingRecord[];
  specialDeployments: SpecialDeploymentRecord[];
  onBackToDashboard: () => void;
  onOpenTelegram?: () => void;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  header,
  cameraUsage,
  cameraFindings,
  specialDeployments,
  onBackToDashboard,
  onOpenTelegram
}) => {
  // Table 1 Totals
  const camUsageTotals = cameraUsage.reduce(
    (acc, c) => ({
      special: acc.special + (Number(c.reasonSpecialDeployment) || 0),
      afternoon: acc.afternoon + (Number(c.reasonAfternoonShift) || 0),
      complaint: acc.complaint + (Number(c.reasonComplaint) || 0),
      breakdown: acc.breakdown + (Number(c.reasonCameraBreakdown) || 0)
    }),
    { special: 0, afternoon: 0, complaint: 0, breakdown: 0 }
  );

  // Table 2 Totals
  const findingsTotals = cameraFindings.reduce(
    (acc, r) => ({
      total: acc.total + (Number(r.totalFindingsCount) || 0),
      outOfView: acc.outOfView + (Number(r.outOfCameraView) || 0),
      battery: acc.battery + (Number(r.batteryClosedEarly) || 0),
      early: acc.early + (Number(r.earlyReturn) || 0),
      lens: acc.lens + (Number(r.lensCovered) || 0),
      theft: acc.theft + (Number(r.theftOrRelated) || 0),
      skipped: acc.skipped + (Number(r.skippedShopInspection) || 0),
      verbal: acc.verbal + (Number(r.verbalWarning) || 0),
      written: acc.written + (Number(r.writtenWarning) || 0),
      final: acc.final + (Number(r.finalWarning) || 0),
      charge: acc.charge + (Number(r.disciplinaryCharge) || 0)
    }),
    {
      total: 0, outOfView: 0, battery: 0, early: 0, lens: 0, theft: 0, skipped: 0,
      verbal: 0, written: 0, final: 0, charge: 0
    }
  );

  // Table 3 Totals
  const specialTotals = specialDeployments.reduce(
    (acc, r) => ({
      taxpayers: acc.taxpayers + (Number(r.taxpayersAssigned) || 0),
      adminMeasures: acc.adminMeasures + (Number(r.administrativeMeasuresCount) || 0),
      noReceipt: acc.noReceipt + (Number(r.noReceiptTransaction) || 0),
      noAuditRegister: acc.noAuditRegister + (Number(r.noAuditRegister) || 0),
      noNoticeOrRegister: acc.noNoticeOrRegister + (Number(r.noNoticeOrRegister) || 0),
      unlinkedUsage: acc.unlinkedUsage + (Number(r.unlinkedUsage) || 0),
      creatingObstacle: acc.creatingObstacle + (Number(r.creatingObstacle) || 0),
      noTechInspection: acc.noTechInspection + (Number(r.noTechInspection) || 0),
      manualReceipt: acc.manualReceipt + (Number(r.manualReceiptViolation) || 0),
      failureToReportBreakdown: acc.failureToReportBreakdown + (Number(r.failureToReportBreakdown) || 0),
      causingDamage: acc.causingDamage + (Number(r.causingDamage) || 0),
      addressChange: acc.addressChange + (Number(r.addressChangeWithoutNotice) || 0),
      vatNotReleased: acc.vatNotReleased + (Number(r.vatNotReleased) || 0)
    }),
    {
      taxpayers: 0, adminMeasures: 0, noReceipt: 0, noAuditRegister: 0, noNoticeOrRegister: 0,
      unlinkedUsage: 0, creatingObstacle: 0, noTechInspection: 0, manualReceipt: 0,
      failureToReportBreakdown: 0, causingDamage: 0, addressChange: 0, vatNotReleased: 0
    }
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white min-h-screen text-black">
      {/* Floating Web Bar for Action */}
      <div className="no-print bg-slate-900 text-white p-3 sticky top-0 z-40 border-b border-slate-700 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ወደ ዳሽቦርድ ተመለስ</span>
          </button>

          <div className="text-xs text-slate-300 hidden sm:block">
            የሰነድ ማተሚያ እይታ (Official Print View) — በ A4 ቅርጽ የተዘጋጀ
          </div>

          <div className="flex items-center gap-2">
            {onOpenTelegram && (
              <button
                type="button"
                onClick={onOpenTelegram}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#24A1DE] hover:bg-[#1d86ba] text-white shadow-sm transition-all"
                title="ይህንን ሪፖርት በቴሌግራም ለተቀባይ ላክ"
              >
                <Send className="w-3.5 h-3.5" />
                <span>በቴሌግራም ላክ</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>አትም (Print / Save as PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official A4 Document Container */}
      <div className="max-w-5xl mx-auto p-6 sm:p-10 font-sans text-xs print:p-0 print:max-w-none">
        
        {/* Official Letterhead Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left Official Logo */}
            <div className="shrink-0">
              <img
                src="/revenues_bureau_logo.jpg"
                alt="የአዲስ አበባ ከተማ አስተዳደር ገቢዎች ቢሮ አርማ"
                className="w-18 h-18 sm:w-20 sm:h-20 object-contain rounded-full border border-slate-300 p-0.5 bg-white shadow-xs"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Center Official Titles */}
            <div className="text-center flex-1">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-800 mb-0.5">
                የአዲስ አበባ ከተማ አስተዳደር ገቢዎች ቢሮ — {header.subCity.includes('መርካቶ') ? `${header.subCity} ልዩ ቅርንጫፍ` : `${header.subCity} ክፍለ ከተማ`}
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-950 uppercase tracking-tight">
                የአዲስ አበባ ገቢዎች ቢሮ በካሜራ የታገዘ የመስክ ቁጥጥር ስምሪት አፈጻጸም ሪፖርት
              </h1>
              <h2 className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                {header.subCity.includes('መርካቶ') ? `${header.subCity} ቅርንጫፍ` : `${header.subCity} ክፍለ ከተማ`} — {header.inspectionType}
              </h2>
            </div>

            {/* Right Body Camera Device Logo */}
            <div className="shrink-0">
              <img
                src="/body_camera_logo.jpg"
                alt="የመስክ ቁጥጥር ካሜራ አርማ"
                className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-300 p-0.5 bg-slate-950 shadow-xs"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          
          {/* Official Letterhead Metadata Grid */}
          <div className="print-header-metadata mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-left bg-slate-50 border border-slate-300 p-2.5 rounded text-[11px]">
            <div className="print-meta-item">
              <span className="print-meta-lbl font-semibold text-slate-600">የቁጥጥር ቀን፡ </span>
              <span className="print-meta-val font-bold text-slate-900">{header.dateEth}</span>
            </div>
            <div className="print-meta-item print-meta-highlight print-meta-date bg-amber-50/80 border border-amber-300/80 p-1 rounded">
              <span className="print-meta-lbl font-bold text-amber-900">የሪፖርት ቀን፡ </span>
              <span className="print-meta-val font-extrabold text-slate-950 block sm:inline">{header.reportSubmissionDate || header.dateEth}</span>
            </div>
            <div className="print-meta-item print-meta-highlight print-meta-receiver bg-blue-50/80 border border-blue-300/80 p-1 rounded">
              <span className="print-meta-lbl font-bold text-blue-900">የሪፖርት ተቀባይ፡ </span>
              <span className="print-meta-val font-extrabold text-slate-950 block sm:inline">{header.reportReceiverName || 'ያልተገለጸ'}</span>
            </div>
            <div className="print-meta-item">
              <span className="print-meta-lbl font-semibold text-slate-600">ፈረቃ፡ </span>
              <span className="print-meta-val font-bold text-slate-900">{header.shift}</span>
            </div>
            <div className="print-meta-item">
              <span className="print-meta-lbl font-semibold text-slate-600">ቡድን፡ </span>
              <span className="print-meta-val font-bold text-slate-900">{header.team}</span>
            </div>
            <div className="print-meta-item">
              <span className="print-meta-lbl font-semibold text-slate-600">የቁጥጥር አይነት፡ </span>
              <span className="print-meta-val font-bold text-slate-900">{header.inspectionType}</span>
            </div>
          </div>
        </div>

        {/* SECTION 1 */}
        <div className="mb-6 print-break-inside-avoid">
          <div className="flex items-center gap-1.5 font-bold text-xs uppercase mb-1.5 text-slate-900 bg-slate-100 p-1.5 border-l-4 border-slate-900">
            <span>1. የካሜራ አጠቃቀም እና የመስክ ቁጥጥር ሪፖርት ቅጽ</span>
          </div>

          <table className="w-full text-[10.5px] border border-slate-400 text-left">
            <thead>
              <tr className="bg-slate-200 font-bold text-slate-900 border-b border-slate-400">
                <th rowSpan={2} className="p-1 text-center border border-slate-400 w-6">ተ.ቁ</th>
                <th rowSpan={2} className="p-1 border border-slate-400">የተቆጣጣሪው ስም</th>
                <th rowSpan={2} className="p-1 border border-slate-400">መለያ ቁጥር</th>
                <th rowSpan={2} className="p-1 border border-slate-400">የተመደቡበት ወረዳ</th>
                <th rowSpan={2} className="p-1 border border-slate-400">ልዩ ቦታ</th>
                <th rowSpan={2} className="p-1 border border-slate-400 text-center">ለስራ የወጣ ካሜራ</th>
                <th rowSpan={2} className="p-1 border border-slate-400 text-center">ካሜራ የወጣበት</th>
                <th colSpan={3} className="p-1 border border-slate-400 text-center bg-slate-300/80">የመስክ ቁጥጥር የሰዓት መረጃ</th>
                <th colSpan={4} className="p-1 border border-slate-400 text-center bg-slate-300/80">የረፈደበት/የተቋረጠበት ምክንያት</th>
              </tr>
              <tr className="bg-slate-100 font-semibold text-[9.5px]">
                <th className="p-1 border border-slate-400 text-center">ጀመረበት</th>
                <th className="p-1 border border-slate-400 text-center">ያበቃበት</th>
                <th className="p-1 border border-slate-400 text-center">የረፈደበት</th>
                <th className="p-0.5 border border-slate-400 text-center">ልዩ ስምሪት</th>
                <th className="p-0.5 border border-slate-400 text-center">ከሰዓት</th>
                <th className="p-0.5 border border-slate-400 text-center">ቅሬታ</th>
                <th className="p-0.5 border border-slate-400 text-center">ብልሽት</th>
              </tr>
            </thead>
            <tbody>
              {cameraUsage.map((r, idx) => (
                <tr key={r.id} className="border-b border-slate-300">
                  <td className="p-1 text-center border border-slate-300">{idx + 1}</td>
                  <td className="p-1 font-semibold border border-slate-300">{r.inspectorName || '—'}</td>
                  <td className="p-1 border border-slate-300">{r.badgeNumber || '—'}</td>
                  <td className="p-1 border border-slate-300">{r.assignedWoreda || '—'}</td>
                  <td className="p-1 border border-slate-300">{r.specificLocation || '—'}</td>
                  <td className="p-1 text-center font-mono font-bold border border-slate-300">{r.cameraId || '—'}</td>
                  <td className="p-1 text-center border border-slate-300">{r.cameraDeployTime || '—'}</td>
                  <td className="p-1 text-center border border-slate-300">{r.startTime || '—'}</td>
                  <td className="p-1 text-center border border-slate-300">{r.endTime || '—'}</td>
                  <td className="p-1 text-center border border-slate-300">{r.lateOrInterruptedDuration || '—'}</td>
                  <td className="p-1 text-center border border-slate-300 font-bold">{r.reasonSpecialDeployment}</td>
                  <td className="p-1 text-center border border-slate-300 font-bold">{r.reasonAfternoonShift}</td>
                  <td className="p-1 text-center border border-slate-300 font-bold">{r.reasonComplaint}</td>
                  <td className="p-1 text-center border border-slate-300 font-bold">{r.reasonCameraBreakdown}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-200 font-bold border-t-2 border-slate-400">
                <td colSpan={7} className="p-1 text-right border border-slate-400">ድምር</td>
                <td colSpan={3} className="p-1 text-center border border-slate-400">—</td>
                <td className="p-1 text-center border border-slate-400">{camUsageTotals.special}</td>
                <td className="p-1 text-center border border-slate-400">{camUsageTotals.afternoon}</td>
                <td className="p-1 text-center border border-slate-400">{camUsageTotals.complaint}</td>
                <td className="p-1 text-center border border-slate-400">{camUsageTotals.breakdown}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* SECTION 2 */}
        <div className="mb-6 print-break-inside-avoid">
          <div className="flex items-center gap-1.5 font-bold text-xs uppercase mb-1.5 text-slate-900 bg-slate-100 p-1.5 border-l-4 border-slate-900">
            <span>2. የካሜራ ግኝት (Camera Findings)</span>
          </div>

          <table className="w-full text-[10.5px] border border-slate-400 text-left">
            <thead>
              <tr className="bg-slate-200 font-bold text-slate-900 border-b border-slate-400">
                <th rowSpan={2} className="p-1 text-center border border-slate-400 w-6">ተ.ቁ</th>
                <th rowSpan={2} className="p-1 border border-slate-400">ክፍለ ከተማ</th>
                <th rowSpan={2} className="p-1 border border-slate-400 text-center">ግኝቶች ብዛት</th>
                <th colSpan={6} className="p-1 border border-slate-400 text-center bg-slate-300/80">የተገኙ ግኝቶች አይነት</th>
                <th rowSpan={2} className="p-1 border border-slate-400">የጥፋቱ አጭር መግለጫ</th>
                <th colSpan={4} className="p-1 border border-slate-400 text-center bg-slate-300/80">የተወሰደ እርምጃ አይነት</th>
              </tr>
              <tr className="bg-slate-100 font-semibold text-[9.5px]">
                <th className="p-0.5 border border-slate-400 text-center">ከእይታ ውጪ</th>
                <th className="p-0.5 border border-slate-400 text-center">ባትሪ ሳይጨርስ</th>
                <th className="p-0.5 border border-slate-400 text-center">አቋርጦ</th>
                <th className="p-0.5 border border-slate-400 text-center">ሌንስ መሸፈን</th>
                <th className="p-0.5 border border-slate-400 text-center">ስርቆት/ተዛማጅ</th>
                <th className="p-0.5 border border-slate-400 text-center">ዘልሎ</th>
                <th className="p-0.5 border border-slate-400 text-center">ቃል ማስጠንቀቂያ</th>
                <th className="p-0.5 border border-slate-400 text-center">ጽሁፍ</th>
                <th className="p-0.5 border border-slate-400 text-center">መጨረሻ</th>
                <th className="p-0.5 border border-slate-400 text-center">ክስ</th>
              </tr>
            </thead>
            <tbody>
              {cameraFindings.map((r, idx) => (
                <tr key={r.id} className="border-b border-slate-300">
                  <td className="p-1 text-center border border-slate-300">{idx + 1}</td>
                  <td className="p-1 font-semibold border border-slate-300">{r.subCity || '—'}</td>
                  <td className="p-1 text-center font-bold border border-slate-300">{r.totalFindingsCount}</td>
                  <td className="p-1 text-center border border-slate-300">{r.outOfCameraView}</td>
                  <td className="p-1 text-center border border-slate-300">{r.batteryClosedEarly}</td>
                  <td className="p-1 text-center border border-slate-300">{r.earlyReturn}</td>
                  <td className="p-1 text-center border border-slate-300">{r.lensCovered}</td>
                  <td className="p-1 text-center border border-slate-300">{r.theftOrRelated}</td>
                  <td className="p-1 text-center border border-slate-300">{r.skippedShopInspection}</td>
                  <td className="p-1 border border-slate-300 text-[9.5px]">{r.description || '—'}</td>
                  <td className="p-1 text-center border border-slate-300">{r.verbalWarning}</td>
                  <td className="p-1 text-center border border-slate-300">{r.writtenWarning}</td>
                  <td className="p-1 text-center border border-slate-300">{r.finalWarning}</td>
                  <td className="p-1 text-center border border-slate-300 font-bold">{r.disciplinaryCharge}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-200 font-bold border-t-2 border-slate-400">
                <td colSpan={2} className="p-1 text-right border border-slate-400">ድምር</td>
                <td className="p-1 text-center border border-slate-400 font-black">{findingsTotals.total}</td>
                <td className="p-1 text-center border border-slate-400">{findingsTotals.outOfView}</td>
                <td className="p-1 text-center border border-slate-400">{findingsTotals.battery}</td>
                <td className="p-1 text-center border border-slate-400">{findingsTotals.early}</td>
                <td className="p-1 text-center border border-slate-400">{findingsTotals.lens}</td>
                <td className="p-1 text-center border border-slate-400">{findingsTotals.theft}</td>
                <td className="p-1 text-center border border-slate-400">{findingsTotals.skipped}</td>
                <td className="p-1 text-center border border-slate-400">—</td>
                <td className="p-1 text-center border border-slate-400">{findingsTotals.verbal}</td>
                <td className="p-1 text-center border border-slate-400">{findingsTotals.written}</td>
                <td className="p-1 text-center border border-slate-400">{findingsTotals.final}</td>
                <td className="p-1 text-center border border-slate-400 font-black">{findingsTotals.charge}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* SECTION 3 */}
        <div className="mb-6 print-break-inside-avoid">
          <div className="flex items-center gap-1.5 font-bold text-xs uppercase mb-1.5 text-slate-900 bg-slate-100 p-1.5 border-l-4 border-slate-900">
            <span>3. የልዩ ስምሪት ሪፖርት ቅጽ (Special Deployment)</span>
          </div>

          <table className="w-full text-[10px] border border-slate-400 text-left">
            <thead>
              <tr className="bg-slate-200 font-bold text-slate-900 border-b border-slate-400">
                <th rowSpan={2} className="p-1 text-center border border-slate-400 w-6">ተ.ቁ</th>
                <th rowSpan={2} className="p-1 border border-slate-400">ክፍለ ከተማ</th>
                <th rowSpan={2} className="p-1 border border-slate-400">ልዩ ስምሪት ቡድን</th>
                <th rowSpan={2} className="p-1 border border-slate-400 text-center">ለቁጥጥር የተሰጠ ግብር ከፋይ</th>
                <th rowSpan={2} className="p-1 border border-slate-400 text-center">እርምጃ ብዛት</th>
                <th colSpan={11} className="p-1 border border-slate-400 text-center bg-slate-300/80">የተወሰደ አስተዳደራዊ እርምጃ / የጥሰት አይነት</th>
                <th rowSpan={2} className="p-1 border border-slate-400">የተቆጣጣሪዎች ስም</th>
              </tr>
              <tr className="bg-slate-100 font-semibold text-[8.5px]">
                <th className="p-0.5 border border-slate-400 text-center">ያለ ደረሰኝ</th>
                <th className="p-0.5 border border-slate-400 text-center">ምርመራ መዝገብ</th>
                <th className="p-0.5 border border-slate-400 text-center">ማስታወቂያ/መዝገብ</th>
                <th className="p-0.5 border border-slate-400 text-center">ሳያገናኙ</th>
                <th className="p-0.5 border border-slate-400 text-center">መሰናክል</th>
                <th className="p-0.5 border border-slate-400 text-center">ቴክኒክ</th>
                <th className="p-0.5 border border-slate-400 text-center">እጅ በእጅ</th>
                <th className="p-0.5 border border-slate-400 text-center">ብልሸት</th>
                <th className="p-0.5 border border-slate-400 text-center">ጉዳት</th>
                <th className="p-0.5 border border-slate-400 text-center">አድራሻ</th>
                <th className="p-0.5 border border-slate-400 text-center">ቫት</th>
              </tr>
            </thead>
            <tbody>
              {specialDeployments.map((r, idx) => (
                <tr key={r.id} className="border-b border-slate-300">
                  <td className="p-1 text-center border border-slate-300">{idx + 1}</td>
                  <td className="p-1 font-semibold border border-slate-300">{r.subCity || '—'}</td>
                  <td className="p-1 border border-slate-300">{r.deployedTeam || '—'}</td>
                  <td className="p-1 text-center font-bold border border-slate-300">{r.taxpayersAssigned}</td>
                  <td className="p-1 text-center font-bold border border-slate-300">{r.administrativeMeasuresCount}</td>
                  <td className="p-0.5 text-center border border-slate-300">{r.noReceiptTransaction}</td>
                  <td className="p-0.5 text-center border border-slate-300">{r.noAuditRegister}</td>
                  <td className="p-0.5 text-center border border-slate-300">{r.noNoticeOrRegister}</td>
                  <td className="p-0.5 text-center border border-slate-300">{r.unlinkedUsage}</td>
                  <td className="p-0.5 text-center border border-slate-300">{r.creatingObstacle}</td>
                  <td className="p-0.5 text-center border border-slate-300">{r.noTechInspection}</td>
                  <td className="p-0.5 text-center border border-slate-300">{r.manualReceiptViolation}</td>
                  <td className="p-0.5 text-center border border-slate-300">{r.failureToReportBreakdown}</td>
                  <td className="p-0.5 text-center border border-slate-300">{r.causingDamage}</td>
                  <td className="p-0.5 text-center border border-slate-300">{r.addressChangeWithoutNotice}</td>
                  <td className="p-0.5 text-center border border-slate-300">{r.vatNotReleased}</td>
                  <td className="p-1 border border-slate-300 text-[9px]">{r.inspectorNames || '—'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-200 font-bold border-t-2 border-slate-400">
                <td colSpan={3} className="p-1 text-right border border-slate-400">ድምር</td>
                <td className="p-1 text-center border border-slate-400 font-black">{specialTotals.taxpayers}</td>
                <td className="p-1 text-center border border-slate-400 font-black">{specialTotals.adminMeasures}</td>
                <td className="p-0.5 text-center border border-slate-400">{specialTotals.noReceipt}</td>
                <td className="p-0.5 text-center border border-slate-400">{specialTotals.noAuditRegister}</td>
                <td className="p-0.5 text-center border border-slate-400">{specialTotals.noNoticeOrRegister}</td>
                <td className="p-0.5 text-center border border-slate-400">{specialTotals.unlinkedUsage}</td>
                <td className="p-0.5 text-center border border-slate-400">{specialTotals.creatingObstacle}</td>
                <td className="p-0.5 text-center border border-slate-400">{specialTotals.noTechInspection}</td>
                <td className="p-0.5 text-center border border-slate-400">{specialTotals.manualReceipt}</td>
                <td className="p-0.5 text-center border border-slate-400">{specialTotals.failureToReportBreakdown}</td>
                <td className="p-0.5 text-center border border-slate-400">{specialTotals.causingDamage}</td>
                <td className="p-0.5 text-center border border-slate-400">{specialTotals.addressChange}</td>
                <td className="p-0.5 text-center border border-slate-400">{specialTotals.vatNotReleased}</td>
                <td className="p-1 text-center border border-slate-400">—</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Official Signatures & Seal Section */}
        <div className="mt-8 pt-6 border-t-2 border-slate-900 print-break-inside-avoid">
          <div className="grid grid-cols-3 gap-6 text-[11px]">
            
            <div className="border border-slate-300 p-3 rounded">
              <span className="font-bold text-slate-800 block mb-3 border-b border-slate-200 pb-1">
                1. ሪፖርቱን ያዘጋጀው ባለሙያ
              </span>
              <p className="mb-2">ስም፡ ___________________________</p>
              <p className="mb-2">ፊርማ፡ __________________________</p>
              <p>ቀን፡ ___________________________</p>
            </div>

            <div className="border border-slate-300 p-3 rounded">
              <span className="font-bold text-slate-800 block mb-3 border-b border-slate-200 pb-1">
                2. ያረጋገጠው የቡድን መሪ
              </span>
              <p className="mb-2">ስም፡ ___________________________</p>
              <p className="mb-2">ፊርማ፡ __________________________</p>
              <p>ቀን፡ ___________________________</p>
            </div>

            <div className="border border-slate-300 p-3 rounded relative">
              <span className="font-bold text-slate-800 block mb-3 border-b border-slate-200 pb-1">
                3. ያጸደቀው የስራ ሂደት አስተባባሪ / ሪፖርት ተቀባይ
              </span>
              <p className="mb-2">
                <span className="text-slate-600">ስም፡ </span>
                <span className="font-semibold text-slate-900">{header.reportReceiverName || '___________________________'}</span>
              </p>
              <p className="mb-2">ፊርማ፡ __________________________</p>
              <p className="mb-2">
                <span className="text-slate-600">ቀን፡ </span>
                <span className="font-semibold text-slate-900">{header.reportSubmissionDate || header.dateEth || '___________________________'}</span>
              </p>
              <div className="mt-2 text-right">
                <span className="inline-block border border-dashed border-slate-400 px-3 py-1.5 text-[10px] text-slate-500 rounded">
                  ይፋዊ ማህተም (Office Seal)
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
