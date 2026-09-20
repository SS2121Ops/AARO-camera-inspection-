import React, { useState } from 'react';
import { Trash2, AlertTriangle, X, Check, RotateCcw, Sparkles } from 'lucide-react';

interface ClearDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAll: () => void;
  onClearCameraUsage: () => void;
  onClearCameraFindings: () => void;
  onClearSpecialDeployments: () => void;
  onLoadSampleData: () => void;
  counts: {
    cameraUsage: number;
    cameraFindings: number;
    specialDeployments: number;
  };
}

export const ClearDataModal: React.FC<ClearDataModalProps> = ({
  isOpen,
  onClose,
  onClearAll,
  onClearCameraUsage,
  onClearCameraFindings,
  onClearSpecialDeployments,
  onLoadSampleData,
  counts
}) => {
  const [selectedAction, setSelectedAction] = useState<'all' | 'custom' | 'sample'>('all');

  if (!isOpen) return null;

  const totalRecords = counts.cameraUsage + counts.cameraFindings + counts.specialDeployments;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="bg-rose-50 border-b border-rose-100 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                የተመዘገቡ ነባር መረጃዎችን ማጥፋት
              </h3>
              <p className="text-xs text-rose-700 font-medium">
                በአሁኑ ሰዓት በድምሩ {totalRecords} የተመዘገቡ መረጃዎች አሉ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-2.5 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              ነባር መረጃዎችን ካጠፉ በኋላ አዲስ መረጃዎችን ከባዶ መመዝገብ ይችላሉ። ይህ እርምጃ የተመዘገቡትን ሰንጠረዦች ባዶ ያደርጋቸዋል።
            </p>
          </div>

          {/* Action Choice: All vs Selective */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-800">የሚፈልጉትን የማጥፋት አይነት ይምረጡ፦</label>

            {/* Option 1: Clear All */}
            <div
              onClick={() => setSelectedAction('all')}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedAction === 'all'
                  ? 'border-rose-500 bg-rose-50/50 shadow-xs ring-1 ring-rose-500'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  ሁሉንም ነባር መረጃዎች በአንድ ጊዜ አጥፋ (ባዶ ሪፖርት ጀምር)
                </span>
                <span className="text-[11px] text-slate-500">
                  የካሜራ አጠቃቀም ({counts.cameraUsage})፣ የካሜራ ግኝት ({counts.cameraFindings}) እና ልዩ ስምሪት ({counts.specialDeployments}) ሰንጠረዦችን ባዶ ያደርጋል።
                </span>
              </div>
              <input
                type="radio"
                name="clear_choice"
                checked={selectedAction === 'all'}
                onChange={() => setSelectedAction('all')}
                className="text-rose-600 focus:ring-rose-500 h-4 w-4"
              />
            </div>

            {/* Option 2: Selective Clean */}
            <div
              onClick={() => setSelectedAction('custom')}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                selectedAction === 'custom'
                  ? 'border-rose-500 bg-rose-50/50 shadow-xs ring-1 ring-rose-500'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    የተወሰኑ ክፍሎችን ብቻ ለይተህ አጥፋ
                  </span>
                  <span className="text-[11px] text-slate-500">
                    የሚፈልጉትን የተወሰነ ክፍል ሰንጠረዥ ብቻ መምረጥ
                  </span>
                </div>
                <input
                  type="radio"
                  name="clear_choice"
                  checked={selectedAction === 'custom'}
                  onChange={() => setSelectedAction('custom')}
                  className="text-rose-600 focus:ring-rose-500 h-4 w-4"
                />
              </div>

              {selectedAction === 'custom' && (
                <div className="pt-2 border-t border-rose-200/60 grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearCameraUsage();
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 flex items-center justify-between"
                  >
                    <span>ክፍል 1 (ካሜራ)</span>
                    <span className="bg-rose-200/80 px-1.5 py-0.2 rounded text-[10px]">{counts.cameraUsage}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearCameraFindings();
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 flex items-center justify-between"
                  >
                    <span>ክፍል 2 (ግኝት)</span>
                    <span className="bg-rose-200/80 px-1.5 py-0.2 rounded text-[10px]">{counts.cameraFindings}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearSpecialDeployments();
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 flex items-center justify-between"
                  >
                    <span>ክፍል 3 (ልዩ ስምሪት)</span>
                    <span className="bg-rose-200/80 px-1.5 py-0.2 rounded text-[10px]">{counts.specialDeployments}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Option 3: Restore Demo Data */}
            <div
              onClick={() => setSelectedAction('sample')}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedAction === 'sample'
                  ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-1 ring-amber-500'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  የሙከራ (ናሙና) መረጃዎችን እንደገና ጫን
                </span>
                <span className="text-[11px] text-slate-500">
                  ለማሳያነት የተዘጋጁትን ነባሪ ምሳሌዎች ለመመለስ ይጠቅማል።
                </span>
              </div>
              <input
                type="radio"
                name="clear_choice"
                checked={selectedAction === 'sample'}
                onChange={() => setSelectedAction('sample')}
                className="text-amber-600 focus:ring-amber-500 h-4 w-4"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            ተመለስ
          </button>

          {selectedAction === 'all' && (
            <button
              type="button"
              onClick={() => {
                onClearAll();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>አዎ፣ ሁሉንም መረጃዎች አጥፋ</span>
            </button>
          )}

          {selectedAction === 'sample' && (
            <button
              type="button"
              onClick={() => {
                onLoadSampleData();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>የሙከራ መረጃዎችን መልስ</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
