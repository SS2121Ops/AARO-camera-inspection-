import React, { useMemo } from 'react';
import { SpecialDeploymentRecord } from '../types';
import { Plus, Trash2, Edit2, ShieldAlert } from 'lucide-react';

interface SpecialDeploymentTableProps {
  records: SpecialDeploymentRecord[];
  onAddRecord: () => void;
  onEditRecord: (record: SpecialDeploymentRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearTable?: () => void;
}

export const SpecialDeploymentTable: React.FC<SpecialDeploymentTableProps> = ({
  records,
  onAddRecord,
  onEditRecord,
  onDeleteRecord,
  onClearTable
}) => {
  // Totals
  const totals = useMemo(() => {
    return records.reduce(
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
        taxpayers: 0,
        adminMeasures: 0,
        noReceipt: 0,
        noAuditRegister: 0,
        noNoticeOrRegister: 0,
        unlinkedUsage: 0,
        creatingObstacle: 0,
        noTechInspection: 0,
        manualReceipt: 0,
        failureToReportBreakdown: 0,
        causingDamage: 0,
        addressChange: 0,
        vatNotReleased: 0
      }
    );
  }, [records]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden mb-8">
      {/* Table Header & Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h2 className="text-base font-bold text-slate-900">
              የልዩ ስምሪት ሪፖርት ቅጽ (Special Deployment Report)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            የልዩ ስምሪት ቡድኖች፣ የተመረመሩ ግብር ከፋዮች እና የተወሰዱ አስተዳደራዊ እርምጃዎች / የጥሰት አይነቶች
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {onClearTable && records.length > 0 && (
            <button
              type="button"
              onClick={onClearTable}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              title="የዚህን ሰንጠረዥ የልዩ ስምሪት መረጃዎች ብቻ አጥፋ"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">አጽዳ</span>
            </button>
          )}

          <button
            type="button"
            onClick={onAddRecord}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ አዲስ የልዩ ስምሪት መዝግብ</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[1300px]">
          <thead>
            {/* Top Multi-Header Row */}
            <tr className="bg-slate-100/90 text-slate-700 font-semibold border-b border-slate-200">
              <th rowSpan={2} className="py-2.5 px-2 text-center border-r border-slate-200 w-10">ተ.ቁ</th>
              <th rowSpan={2} className="py-2.5 px-2.5 border-r border-slate-200 w-24">ክፍለ ከተማ</th>
              <th rowSpan={2} className="py-2.5 px-2.5 border-r border-slate-200 w-28">ልዩ ስምሪት የወጣ ቡድን</th>
              <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-200 w-24 text-center bg-purple-50/70 font-bold text-purple-950">
                ለቁጥጥር የተሰጠ ግብር ከፋይ
              </th>
              <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-200 w-24 text-center bg-rose-50/70 font-bold text-rose-950">
                የተወሰደ አስተዳደራዊ እርምጃ ብዛት
              </th>

              {/* Grouped: የተወሰደ አስተዳደራዊ እርምጃ / የጥሰት አይነት */}
              <th colSpan={11} className="py-1.5 px-2 border-r border-slate-200 text-center bg-amber-50/70 font-bold text-amber-950">
                የተወሰደ አስተዳደራዊ እርምጃ / የጥሰት አይነት
              </th>

              <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200 min-w-[150px]">
                የተቆጣጣሪ ሰራተኞች ስም
              </th>

              <th rowSpan={2} className="py-2.5 px-2 text-center w-16 no-print">ድርጊቶች</th>
            </tr>

            {/* Sub-Header Row */}
            <tr className="bg-slate-50 text-slate-600 font-medium text-[11px] border-b border-slate-200">
              {/* 11 Violation categories */}
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-amber-50/30">ያለ ደረሰኝ գብይት</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-amber-50/30">ምርመራ መዝገብ አለማስቀመጥ</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-amber-50/30 min-w-[100px]">
                ማስታወቂያ አለመለጠፍ / መዝገብ
              </th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-amber-50/30">መረጃ ሳያገናኙ መጠቀም</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-amber-50/30">መሰናክል መፍጠር</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-amber-50/30">ቴክኒክ ምርመራ አለማድረግ</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-amber-50/30">የእጅ በእጅ ደረሰኝ</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-amber-50/30">ብልሸት አለማሳወቅ</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-amber-50/30">ጉዳት ማድረስ</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-amber-50/30">አድራሻ መለወጥ</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-amber-50/30">ቫት አለመለቀቅ</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={18} className="py-10 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5 border border-blue-200">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">
                      እስካሁን የተመዘገበ የልዩ ስምሪት መረጃ የለም
                    </h4>
                    <p className="text-xs text-slate-500 mb-4 max-w-xs">
                      የልዩ ስምሪት ቡድኖች፣ የተመረመሩ ግብር ከፋዮች እና የተወሰዱ አስተዳደራዊ እርምጃዎችን እዚህ ይመዝግቡ።
                    </p>
                    <button
                      type="button"
                      onClick={onAddRecord}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ አዲስ የልዩ ስምሪት መዝግብ</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((r, index) => (
                <tr key={r.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-2.5 px-2 text-center font-medium text-slate-500 border-r border-slate-100">
                    {index + 1}
                  </td>
                  <td className="py-2.5 px-2.5 font-semibold text-slate-800 border-r border-slate-100">
                    {r.subCity || '—'}
                  </td>
                  <td className="py-2.5 px-2.5 font-medium text-slate-900 border-r border-slate-100">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-[11px]">
                      {r.deployedTeam || '—'}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center font-bold text-purple-800 bg-purple-50/40 border-r border-slate-100">
                    {r.taxpayersAssigned}
                  </td>
                  <td className="py-2.5 px-2 text-center font-bold text-rose-700 bg-rose-50/40 border-r border-slate-100">
                    {r.administrativeMeasuresCount}
                  </td>

                  {/* 11 Violation breakdown counts */}
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-medium">
                    {r.noReceiptTransaction}
                  </td>
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-medium">
                    {r.noAuditRegister}
                  </td>
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-medium">
                    {r.noNoticeOrRegister}
                  </td>
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-medium">
                    {r.unlinkedUsage}
                  </td>
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-medium">
                    {r.creatingObstacle}
                  </td>
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-medium">
                    {r.noTechInspection}
                  </td>
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-medium">
                    {r.manualReceiptViolation}
                  </td>
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-medium">
                    {r.failureToReportBreakdown}
                  </td>
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-medium">
                    {r.causingDamage}
                  </td>
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-medium">
                    {r.addressChangeWithoutNotice}
                  </td>
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-medium">
                    {r.vatNotReleased}
                  </td>

                  {/* Inspector Names */}
                  <td className="py-2.5 px-3 text-slate-800 border-r border-slate-100 text-xs">
                    {r.inspectorNames || '—'}
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-2 text-center no-print">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEditRecord(r)}
                        className="p-1 rounded text-slate-400 hover:text-amber-600 hover:bg-slate-100"
                        title="አርም"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteRecord(r.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                        title="ሰርዝ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {/* Table Footer: Totals Row (ድምር) */}
          <tfoot>
            <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
              <td colSpan={3} className="py-2.5 px-3 text-right border-r border-slate-200">
                ድምር (Total)
              </td>
              <td className="py-2.5 px-2 text-center border-r border-slate-200 text-purple-900 bg-purple-100/60 font-black">
                {totals.taxpayers}
              </td>
              <td className="py-2.5 px-2 text-center border-r border-slate-200 text-rose-800 bg-rose-100/60 font-black">
                {totals.adminMeasures}
              </td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200">{totals.noReceipt}</td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200">{totals.noAuditRegister}</td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200">{totals.noNoticeOrRegister}</td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200">{totals.unlinkedUsage}</td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200">{totals.creatingObstacle}</td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200">{totals.noTechInspection}</td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200">{totals.manualReceipt}</td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200">{totals.failureToReportBreakdown}</td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200">{totals.causingDamage}</td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200">{totals.addressChange}</td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200">{totals.vatNotReleased}</td>
              <td className="py-2.5 px-3 text-center border-r border-slate-200 text-slate-500">—</td>
              <td className="py-2.5 px-2 text-center no-print"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
