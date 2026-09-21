import React, { useState, useMemo } from 'react';
import { CameraUsageRecord } from '../types';
import { Search, Plus, Trash2, Edit2, Camera, Clock, Check, X } from 'lucide-react';
import { getWoredasForSubCity } from '../data/subCitiesAndWoredas';

interface CameraUsageTableProps {
  records: CameraUsageRecord[];
  currentSubCity?: string;
  onAddRecord: () => void;
  onEditRecord: (record: CameraUsageRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearTable?: () => void;
}

export const CameraUsageTable: React.FC<CameraUsageTableProps> = ({
  records,
  currentSubCity,
  onAddRecord,
  onEditRecord,
  onDeleteRecord,
  onClearTable
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [woredaFilter, setWoredaFilter] = useState('all');

  // Filter options: Combine current sub-city woredas + record woredas
  const woredas = useMemo(() => {
    const set = new Set<string>();
    if (currentSubCity) {
      getWoredasForSubCity(currentSubCity).forEach(w => set.add(w));
    }
    records.forEach(r => {
      if (r.assignedWoreda && r.assignedWoreda !== '—') {
        set.add(r.assignedWoreda);
      }
    });
    return Array.from(set).sort();
  }, [records, currentSubCity]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchSearch =
        !searchQuery ||
        r.cameraId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.assignedWoreda.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.inspectorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.specificLocation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchWoreda = woredaFilter === 'all' || r.assignedWoreda === woredaFilter;

      return matchSearch && matchWoreda;
    });
  }, [records, searchQuery, woredaFilter]);

  // Totals calculations
  const totals = useMemo(() => {
    return records.reduce(
      (acc, curr) => ({
        specialDeployment: acc.specialDeployment + (Number(curr.reasonSpecialDeployment) || 0),
        afternoonShift: acc.afternoonShift + (Number(curr.reasonAfternoonShift) || 0),
        complaint: acc.complaint + (Number(curr.reasonComplaint) || 0),
        cameraBreakdown: acc.cameraBreakdown + (Number(curr.reasonCameraBreakdown) || 0)
      }),
      { specialDeployment: 0, afternoonShift: 0, complaint: 0, cameraBreakdown: 0 }
    );
  }, [records]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden mb-8">
      {/* Table Header & Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h2 className="text-base font-bold text-slate-900">
              የካሜራ አጠቃቀም እና የመስክ ቁጥጥር ሪፖርት ቅጽ
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            የተቆጣጣሪዎች ስም፣ የወረዳ ምደባ፣ የካሜራ ሰዓት እና መዘግየት/መቋረጥ ምክንያቶች
          </p>
        </div>

        {/* Search & Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="በካሜራ (CAM-001)፣ ወረዳ ወይም ስም ፈልግ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 w-52 sm:w-64"
            />
          </div>

          <select
            value={woredaFilter}
            onChange={(e) => setWoredaFilter(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-700"
          >
            <option value="all">ሁሉም ወረዳዎች</option>
            {woredas.map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>

          {onClearTable && records.length > 0 && (
            <button
              type="button"
              onClick={onClearTable}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              title="የዚህን ሰንጠረዥ መረጃዎች ብቻ አጥፋ"
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
            <span>+ አዲስ ረድፍ ጨምር</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
          <thead>
            {/* Top Multi-Header Row */}
            <tr className="bg-slate-100/90 text-slate-700 font-semibold border-b border-slate-200">
              <th rowSpan={2} className="py-2.5 px-2 text-center border-r border-slate-200 w-10">ተ.ቁ</th>
              <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200 min-w-[130px]">የተቆጣጣሪው ስም</th>
              <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-200 w-24">መለያ ቁጥር</th>
              <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-200 w-24">የተመደቡበት ወረዳ</th>
              <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-200 min-w-[110px]">ልዩ ቦታ</th>
              <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-200 w-28 text-center bg-amber-50/50">
                ለስራ የወጣ ካሜራ መለያ
              </th>
              <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-200 w-20 text-center">
                ካሜራ የወጣበት ሰዓት
              </th>
              
              {/* Grouped Header: የመስክ ቁጥጥር የሰዓት መረጃ */}
              <th colSpan={3} className="py-1.5 px-2 border-r border-slate-200 text-center bg-blue-50/60 font-bold text-blue-950">
                የመስክ ቁጥጥር የሰዓት መረጃ
              </th>

              {/* Grouped Header: የረፈደበት እና/ወይም የተቋረጠበት ምክንያት */}
              <th colSpan={4} className="py-1.5 px-2 border-r border-slate-200 text-center bg-rose-50/60 font-bold text-rose-950">
                የረፈደበት እና/ወይም የተቋረጠበት ምክንያት
              </th>

              <th rowSpan={2} className="py-2.5 px-2 text-center w-16 no-print">ድርጊቶች</th>
            </tr>

            {/* Sub-Header Row */}
            <tr className="bg-slate-50 text-slate-600 font-medium text-[11px] border-b border-slate-200">
              {/* Under የመስክ ቁጥጥር የሰዓት መረጃ */}
              <th className="py-1.5 px-2 text-center border-r border-slate-200 bg-blue-50/30">ጀመረበት ሰዓት</th>
              <th className="py-1.5 px-2 text-center border-r border-slate-200 bg-blue-50/30">ያበቃበት ሰዓት</th>
              <th className="py-1.5 px-2 text-center border-r border-slate-200 bg-blue-50/30 text-rose-700">የረፈደበት/የተቋረጠበት ሰዓት</th>

              {/* Under የረፈደበት እና/ወይም የተቋረጠበት ምክንያት */}
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-rose-50/30">ልዩ ስምሪት</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-rose-50/30">ከሰዓት ፈረቃ</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-rose-50/30">ቅሬታ ለማስረዳት</th>
              <th className="py-1.5 px-1.5 text-center border-r border-slate-200 bg-rose-50/30">የካሜራ ብልሽት</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={15} className="py-10 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5 border border-amber-200">
                      <Camera className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">
                      {records.length === 0 ? 'እስካሁን የተመዘገበ የካሜራ አጠቃቀም መረጃ የለም' : 'በተመረጠው ፍለጋ ምንም መረጃ አልተገኘም'}
                    </h4>
                    <p className="text-xs text-slate-500 mb-4 max-w-xs">
                      {records.length === 0
                        ? 'የዕለቱ የመስክ ተቆጣጣሪዎች የካሜራ ስምሪት እና የሰዓት መረጃዎችን እዚህ ይመዝግቡ።'
                        : 'እባክዎ የፍለጋ ቃሉን ወይም የተመረጠውን ወረዳ አስተካክለው እንደገና ይሞክሩ።'}
                    </p>
                    <button
                      type="button"
                      onClick={onAddRecord}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ አዲስ የካሜራ አጠቃቀም መዝግብ</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRecords.map((r, index) => (
                <tr key={r.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-2 px-2 text-center font-medium text-slate-500 border-r border-slate-100">
                    {index + 1}
                  </td>
                  <td className="py-2 px-3 font-semibold text-slate-800 border-r border-slate-100">
                    <div>{r.inspectorName || '—'}</div>
                    {(r.inspectorName2 || r.inspectorName3) && (
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5 space-y-0.5">
                        {r.inspectorName2 && <div className="text-slate-600">2. {r.inspectorName2}</div>}
                        {r.inspectorName3 && <div className="text-slate-600">3. {r.inspectorName3}</div>}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-2 text-slate-600 font-mono text-[11px] border-r border-slate-100">
                    {r.badgeNumber || '—'}
                  </td>
                  <td className="py-2 px-2 text-slate-800 font-medium border-r border-slate-100">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                      {r.assignedWoreda || '—'}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-slate-600 border-r border-slate-100">
                    {r.specificLocation || '—'}
                  </td>
                  <td className="py-2 px-2 text-center font-mono font-bold text-amber-700 bg-amber-50/30 border-r border-slate-100">
                    {r.cameraId || '—'}
                  </td>
                  <td className="py-2 px-2 text-center text-slate-700 font-mono border-r border-slate-100">
                    {r.cameraDeployTime || '—'}
                  </td>

                  {/* Field Time Info */}
                  <td className="py-2 px-2 text-center text-slate-700 font-mono border-r border-slate-100">
                    {r.startTime || '—'}
                  </td>
                  <td className="py-2 px-2 text-center text-slate-700 font-mono border-r border-slate-100">
                    {r.endTime || '—'}
                  </td>
                  <td className="py-2 px-2 text-center font-mono border-r border-slate-100 text-rose-600 font-medium">
                    {r.lateOrInterruptedDuration || '—'}
                  </td>

                  {/* Delay Reasons */}
                  <td className="py-2 px-1.5 text-center font-bold border-r border-slate-100 text-slate-700">
                    {r.reasonSpecialDeployment}
                  </td>
                  <td className="py-2 px-1.5 text-center font-bold border-r border-slate-100 text-slate-700">
                    {r.reasonAfternoonShift}
                  </td>
                  <td className="py-2 px-1.5 text-center font-bold border-r border-slate-100 text-slate-700">
                    {r.reasonComplaint}
                  </td>
                  <td className="py-2 px-1.5 text-center font-bold border-r border-slate-100 text-slate-700">
                    {r.reasonCameraBreakdown}
                  </td>

                  {/* Actions */}
                  <td className="py-2 px-2 text-center no-print">
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
              <td colSpan={7} className="py-2.5 px-3 text-right border-r border-slate-200">
                ድምር (Total)
              </td>
              <td colSpan={3} className="py-2.5 px-2 text-center border-r border-slate-200 text-slate-600">
                —
              </td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200 text-amber-700">
                {totals.specialDeployment}
              </td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200 text-amber-700">
                {totals.afternoonShift}
              </td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200 text-amber-700">
                {totals.complaint}
              </td>
              <td className="py-2.5 px-1.5 text-center border-r border-slate-200 text-amber-700">
                {totals.cameraBreakdown}
              </td>
              <td className="py-2.5 px-2 text-center no-print"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
