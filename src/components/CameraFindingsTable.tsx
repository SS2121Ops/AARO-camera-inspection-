import React, { useMemo } from 'react';
import { CameraFindingRecord } from '../types';
import { Plus, Trash2, Edit2, AlertOctagon } from 'lucide-react';

interface CameraFindingsTableProps {
  records: CameraFindingRecord[];
  onAddRecord: () => void;
  onEditRecord: (record: CameraFindingRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearTable?: () => void;
}

export const CameraFindingsTable: React.FC<CameraFindingsTableProps> = ({
  records,
  onAddRecord,
  onEditRecord,
  onDeleteRecord,
  onClearTable
}) => {
  // Totals calculation
  const totals = useMemo(() => {
    return records.reduce(
      (acc, r) => ({
        totalFindings: acc.totalFindings + (Number(r.totalFindingsCount) || 0),
        outOfCameraView: acc.outOfCameraView + (Number(r.outOfCameraView) || 0),
        batteryClosedEarly: acc.batteryClosedEarly + (Number(r.batteryClosedEarly) || 0),
        earlyReturn: acc.earlyReturn + (Number(r.earlyReturn) || 0),
        lensCovered: acc.lensCovered + (Number(r.lensCovered) || 0),
        theftOrRelated: acc.theftOrRelated + (Number(r.theftOrRelated) || 0),
        skippedShopInspection: acc.skippedShopInspection + (Number(r.skippedShopInspection) || 0),
        verbalWarning: acc.verbalWarning + (Number(r.verbalWarning) || 0),
        writtenWarning: acc.writtenWarning + (Number(r.writtenWarning) || 0),
        finalWarning: acc.finalWarning + (Number(r.finalWarning) || 0),
        disciplinaryCharge: acc.disciplinaryCharge + (Number(r.disciplinaryCharge) || 0)
      }),
      {
        totalFindings: 0,
        outOfCameraView: 0,
        batteryClosedEarly: 0,
        earlyReturn: 0,
        lensCovered: 0,
        theftOrRelated: 0,
        skippedShopInspection: 0,
        verbalWarning: 0,
        writtenWarning: 0,
        finalWarning: 0,
        disciplinaryCharge: 0
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
              2
            </span>
            <h2 className="text-base font-bold text-slate-900">
              የካሜራ ግኝት (Camera Findings)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            የካሜራ አጠቃቀም ጥሰቶች፣ የጥፋቱ ማብራሪያ እና የተወሰደ የዲሲፕሊን እርምጃ
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {onClearTable && records.length > 0 && (
            <button
              type="button"
              onClick={onClearTable}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              title="የዚህን ሰንጠረዥ ግኝቶች ብቻ አጥፋ"
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
            <span>+ አዲስ ግኝት መዝግብ</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[1100px]">
          <thead>
            {/* Top Multi-Header Row */}
            <tr className="bg-slate-100/90 text-slate-700 font-semibold border-b border-slate-200">
              <th rowSpan={2} className="py-2.5 px-2 text-center border-r border-slate-200 w-10">ተ.ቁ</th>
              <th rowSpan={2} className="py-2.5 px-2.5 border-r border-slate-200 w-24">ክፍለ ከተማ</th>
              <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-200 w-20 text-center bg-amber-50 font-bold text-amber-900">
                የተገኙ ግኝቶች ብዛት
              </th>

              {/* Grouped: የተገኙ ግኝቶች አይነት */}
              <th colSpan={6} className="py-1.5 px-2 border-r border-slate-200 text-center bg-orange-50/70 font-bold text-orange-950">
                የተገኙ ግኝቶች አይነት
              </th>

              <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200 min-w-[170px]">
                የጥፋቱ አጭር መግለጫ
              </th>

              {/* Grouped: የተወሰደ እርምጃ አይነት */}
              <th colSpan={4} className="py-1.5 px-2 border-r border-slate-200 text-center bg-rose-50/70 font-bold text-rose-950">
                የተወሰደ እርምጃ አይነት
              </th>

              <th rowSpan={2} className="py-2.5 px-2 text-center w-16 no-print">ድርጊቶች</th>
            </tr>

            {/* Sub-Header Row */}
            <tr className="bg-slate-50 text-slate-600 font-medium text-[11px] border-b border-slate-200">
              {/* Under የተገኙ ግኝቶች አይነት */}
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-orange-50/30">ከካሜራ እይታ ውጪ</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-orange-50/30">ባትሪ ሳይጨርስ መዝጋት</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-orange-50/30">ስራ አቋርጦ መመለስ</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-orange-50/30">ሌንስ መሸፈን</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-orange-50/30">የስርቆት/ተዛማጅ</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-orange-50/30">ንግድ ቤት ዘልሎ</th>

              {/* Under የተወሰደ እርምጃ አይነት */}
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-rose-50/30">የቃል ማስጠንቀቂያ</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-rose-50/30">የጽሁፍ ማስጠንቀቂያ</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-rose-50/30">የመጨረሻ ማስጠንቀቂያ</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-rose-50/30 font-bold text-rose-700">በዲሲፕሊን ክስ</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={15} className="py-10 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2.5 border border-rose-200">
                      <AlertOctagon className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">
                      እስካሁን የተመዘገበ የካሜራ ግኝት የለም
                    </h4>
                    <p className="text-xs text-slate-500 mb-4 max-w-xs">
                      የካሜራ አጠቃቀም ጥሰቶች፣ የጥፋት መግለጫዎች እና የተወሰዱ የዲሲፕሊን እርምጃዎችን እዚህ ይመዝግቡ።
                    </p>
                    <button
                      type="button"
                      onClick={onAddRecord}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ አዲስ የካሜራ ግኝት መዝግብ</span>
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
                  <td className="py-2.5 px-2 text-center font-bold text-amber-700 bg-amber-50/30 border-r border-slate-100">
                    {r.totalFindingsCount}
                  </td>

                  {/* Findings breakdown */}
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-medium">
                    {r.outOfCameraView}
                  </td>
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-medium">
                    {r.batteryClosedEarly}
                  </td>
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-medium">
                    {r.earlyReturn}
                  </td>
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-medium">
                    {r.lensCovered}
                  </td>
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-medium">
                    {r.theftOrRelated}
                  </td>
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-medium">
                    {r.skippedShopInspection}
                  </td>

                  {/* Description */}
                  <td className="py-2.5 px-3 text-slate-700 border-r border-slate-100 text-xs">
                    {r.description || '—'}
                  </td>

                  {/* Action Taken */}
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-semibold text-slate-700">
                    {r.verbalWarning}
                  </td>
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-semibold text-slate-700">
                    {r.writtenWarning}
                  </td>
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-semibold text-rose-600">
                    {r.finalWarning}
                  </td>
                  <td className="py-2.5 px-1.5 text-center border-r border-slate-100 font-bold text-rose-700">
                    {r.disciplinaryCharge}
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
              <td colSpan={2} className="py-2.5 px-3 text-right border-r border-slate-200">
                ድምር (Total)
              </td>
              <td className="py-2.5 px-2 text-center border-r border-slate-200 text-amber-800 bg-amber-100/60 font-black">
                {totals.totalFindings}
              </td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200">{totals.outOfCameraView}</td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200">{totals.batteryClosedEarly}</td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200">{totals.earlyReturn}</td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200">{totals.lensCovered}</td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200">{totals.theftOrRelated}</td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200">{totals.skippedShopInspection}</td>
              <td className="py-2.5 px-3 text-center border-r border-slate-200 text-slate-500">—</td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200 text-slate-700">{totals.verbalWarning}</td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200 text-slate-700">{totals.writtenWarning}</td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200 text-rose-700">{totals.finalWarning}</td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200 text-rose-800 font-black">{totals.disciplinaryCharge}</td>
              <td className="py-2.5 px-2 text-center no-print"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
