import React from 'react';
import { Plus, Video, AlertOctagon, ShieldAlert, Trash2, Sparkles, Building2 } from 'lucide-react';
import { ModalMode } from './RowModal';

interface DataEntryHubProps {
  currentSubCity: string;
  onOpenAddModal: (mode: ModalMode) => void;
  onOpenClearModal: () => void;
  counts: {
    cameraUsage: number;
    cameraFindings: number;
    specialDeployments: number;
  };
}

export const DataEntryHub: React.FC<DataEntryHubProps> = ({
  currentSubCity,
  onOpenAddModal,
  onOpenClearModal,
  counts
}) => {
  const isMerkato = currentSubCity.includes('መርካቶ');

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-lg border border-slate-700/80 mb-6">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-sm">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white tracking-tight">
                አዲስ መረጃ መመዝገቢያ (Data Entry)
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Building2 className="w-3 h-3" />
                {currentSubCity} {isMerkato ? 'ልዩ ቅርንጫፍ' : 'ክፍለ ከተማ'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              በዕለቱ የተከናወነውን የካሜራ አጠቃቀም፣ ግኝቶች እና የልዩ ስምሪት መረጃዎች ከታች ካሉት አዝራሮች በመምረጥ ይመዝግቡ
            </p>
          </div>
        </div>

        {/* Quick Clear Button */}
        <button
          type="button"
          onClick={onOpenClearModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/40 transition-colors self-start sm:self-auto"
          title="የተመዘገቡ ነባር መረጃዎችን ለማጥፋት"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>ነባር መረጃዎችን አጥፋ / አጽዳ</span>
        </button>
      </div>

      {/* 3 Registration Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4">
        {/* Card 1: Camera Usage */}
        <div className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/60 rounded-xl p-4 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/40">
                  1
                </span>
                <span className="text-xs font-bold text-slate-200">ክፍል 1</span>
              </div>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                የተመዘገቡ፡ {counts.cameraUsage}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors mb-1 flex items-center gap-1.5">
              <Video className="w-4 h-4 text-amber-400" />
              የካሜራ አጠቃቀም መዝግብ
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              የተቆጣጣሪ ስም፣ ባጅ ቁጥር፣ የተመደቡበት ወረዳ፣ ልዩ ቦታ፣ የወጣ ካሜራ መለያ እና የስራ ሰዓት መመዝገቢያ።
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenAddModal('camera_usage')}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ አዲስ የካሜራ አጠቃቀም መዝግብ</span>
          </button>
        </div>

        {/* Card 2: Camera Findings */}
        <div className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/60 rounded-xl p-4 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs border border-rose-500/40">
                  2
                </span>
                <span className="text-xs font-bold text-slate-200">ክፍል 2</span>
              </div>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                የተመዘገቡ፡ {counts.cameraFindings}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors mb-1 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              የካሜራ ግኝትና እርምጃ መዝግብ
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              ከካሜራ እይታ ውጪ፣ ባትሪ ቀድሞ መዝጋት፣ ሌንስ መሸፈን፣ የንግድ ቤት ዘልሎ ቁጥጥር እና የተወሰዱ የዲሲፕሊን እርምጃዎች።
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenAddModal('camera_findings')}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-700 hover:bg-amber-500 text-slate-100 hover:text-slate-950 transition-colors shadow-sm border border-slate-600 hover:border-amber-500"
          >
            <Plus className="w-4 h-4" />
            <span>+ አዲስ የካሜራ ግኝት መዝግብ</span>
          </button>
        </div>

        {/* Card 3: Special Deployment */}
        <div className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/60 rounded-xl p-4 transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/40">
                  3
                </span>
                <span className="text-xs font-bold text-slate-200">ክፍል 3</span>
              </div>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                የተመዘገቡ፡ {counts.specialDeployments}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-blue-400" />
              የልዩ ስምሪት ቁጥጥር መዝግብ
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              የወጣ ቡድን፣ የተመረመሩ ግብር ከፋዮች፣ ደረሰኝ አለመቁረጥ፣ ማስታወቂያ አለመለጠፍ/መዝገብ እና አስተዳደራዊ እርምጃዎች።
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenAddModal('special_deployment')}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-700 hover:bg-amber-500 text-slate-100 hover:text-slate-950 transition-colors shadow-sm border border-slate-600 hover:border-amber-500"
          >
            <Plus className="w-4 h-4" />
            <span>+ አዲስ የልዩ ስምሪት መዝግብ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
