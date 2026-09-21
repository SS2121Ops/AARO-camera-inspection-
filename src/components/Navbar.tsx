import React, { useState, useRef, useEffect } from 'react';
import { Video, ShieldCheck, Printer, Download, RotateCcw, Building2, Calendar, PlusCircle, MapPin, Trash2, ChevronDown, AlertOctagon, ShieldAlert, Send } from 'lucide-react';
import { ActiveTab, ReportHeader } from '../types';
import { ALL_SUB_CITIES, getSubCityInfo } from '../data/subCitiesAndWoredas';
import { ModalMode } from './RowModal';

interface NavbarProps {
  header: ReportHeader;
  onUpdateHeader: (header: ReportHeader) => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onPrint: () => void;
  onExportCSV: () => void;
  onReset: () => void;
  onClearData: () => void;
  onAddNewModal: (mode?: ModalMode) => void;
  onOpenTelegram?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  header,
  onUpdateHeader,
  activeTab,
  onSelectTab,
  onPrint,
  onExportCSV,
  onReset,
  onClearData,
  onAddNewModal,
  onOpenTelegram
}) => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setIsAddMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <header className="no-print bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top tier brand & sub-city selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-3 gap-3">
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <img
                src="/body_camera_logo.jpg"
                alt="የመስክ ካሜራ አርማ Logo"
                className="w-10 h-10 rounded-xl object-cover bg-slate-950 border-2 border-amber-400 shadow-md shrink-0 p-0.5"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    የአዲስ አበባ ከተማ አስተዳደር ገቢዎች ቢሮ
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    {header.dateEth}
                  </span>
                </div>
                <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-2 mt-0.5">
                  <span>የአዲስ አበባ ገቢዎች ቢሮ በካሜራ የታገዘ የመስክ ቁጥጥር ስምሪት አፈጻጸም ሪፖርት</span>
                  <span className="text-amber-400 text-xs font-semibold bg-slate-800 px-2 py-0.5 rounded border border-slate-700 hidden lg:inline">
                    ({header.subCity} ክፍለ ከተማ)
                  </span>
                </h1>
              </div>
            </div>

            {/* Sub-City & Branch Selector */}
            <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-lg border border-slate-700 text-xs">
              <div className="flex items-center gap-1 px-1.5 text-amber-400 font-semibold hidden md:flex">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px] text-slate-300">ክፍለ ከተማ/ማዕከል:</span>
              </div>
              <select
                id="navbar-subcity-select"
                value={header.subCity}
                onChange={(e) => onUpdateHeader({ ...header, subCity: e.target.value })}
                className="bg-slate-900 text-amber-300 font-bold border border-slate-600 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <optgroup label="★ ልዩ የገቢዎች ቅርንጫፎች / ማዕከላት">
                  {ALL_SUB_CITIES.filter(sc => sc.type === 'special_branch').map(sc => (
                    <option key={sc.id} value={sc.name}>
                      {sc.name} ({sc.woredas.length} ወረዳዎች)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="የአዲስ አበባ ክፍለ ከተሞች">
                  {ALL_SUB_CITIES.filter(sc => sc.type === 'sub_city').map(sc => (
                    <option key={sc.id} value={sc.name}>
                      {sc.name} ({sc.woredas.length} ወረዳዎች)
                    </option>
                  ))}
                </optgroup>
              </select>

              {/* Quick Jump for most common hubs */}
              <div className="hidden xl:flex items-center gap-1 border-l border-slate-700 pl-1.5">
                {['መርካቶ ቁጥር 1', 'መርካቶ ቁጥር 2', 'ቂርቆስ', 'የካ', 'ቦሌ'].map(cityName => (
                  <button
                    key={cityName}
                    type="button"
                    onClick={() => onUpdateHeader({ ...header, subCity: cityName })}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                      header.subCity === cityName
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {cityName.replace(' ቁጥር ', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {/* New Record Registration Dropdown */}
            <div className="relative" ref={addMenuRef}>
              <button
                type="button"
                onClick={() => setIsAddMenuOpen(prev => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm"
                title="አዲስ መረጃ መዝግብ"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ አዲስ መረጃ መዝግብ</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAddMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isAddMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 text-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-700/80 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    የመመዝገቢያ ክፍል ይምረጡ
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddMenuOpen(false);
                      onAddNewModal('camera_usage');
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-700 flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors"
                  >
                    <span className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px]">1</span>
                    <div>
                      <div className="font-semibold text-white">ክፍል 1፡ የካሜራ አጠቃቀም</div>
                      <div className="text-[10px] text-slate-400">ተቆጣጣሪ፣ ባጅ፣ ሰዓትና ካሜራ</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAddMenuOpen(false);
                      onAddNewModal('camera_findings');
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-700 flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors"
                  >
                    <span className="w-5 h-5 rounded bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[11px]">2</span>
                    <div>
                      <div className="font-semibold text-white">ክፍል 2፡ የካሜራ ግኝት</div>
                      <div className="text-[10px] text-slate-400">የጥሰት አይነትና የዲሲፕሊን እርምጃ</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAddMenuOpen(false);
                      onAddNewModal('special_deployment');
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-700 flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors"
                  >
                    <span className="w-5 h-5 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[11px]">3</span>
                    <div>
                      <div className="font-semibold text-white">ክፍል 3፡ የልዩ ስምሪት ቁጥጥር</div>
                      <div className="text-[10px] text-slate-400">ግብር ከፋዮችና አስተዳደራዊ እርምጃዎች</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Clear Data Button */}
            <button
              type="button"
              onClick={onClearData}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800/60 transition-colors"
              title="ነባር መረጃዎችን ማጥፋት / አዲስ ባዶ ሪፖርት መጀመር"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>መረጃ አጥፋ</span>
            </button>

            {/* Telegram Share Button */}
            {onOpenTelegram && (
              <button
                type="button"
                onClick={onOpenTelegram}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#24A1DE] hover:bg-[#1d86ba] text-white shadow-sm transition-all"
                title="ሪፖርቱን በቴሌግራም ለተቀባይ ላክ"
              >
                <Send className="w-3.5 h-3.5" />
                <span>በቴሌግራም ላክ</span>
              </button>
            )}

            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="ይፋዊ ሪፖርት አትም / PDF"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">ይፋዊ ሰነድ አትም</span>
            </button>

            <button
              type="button"
              onClick={onExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="ወደ Excel/CSV ላክ"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">ወደ Excel</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="የሙከራ (ናሙና) መረጃዎችን መልስ"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab navigation navigation bar */}
        <div className="flex items-center overflow-x-auto py-2 gap-1 border-t border-slate-800/80 text-xs font-medium no-scrollbar">
          <button
            type="button"
            onClick={() => onSelectTab('all')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            አጠቃላይ ማጠቃለያ (Dashboard)
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('camera_usage')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'camera_usage'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            1. የካሜራ አጠቃቀምና የመስክ ቁጥጥር
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('camera_findings')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'camera_findings'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            2. የካሜራ ግኝት (Findings)
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('special_deployment')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'special_deployment'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            3. የልዩ ስምሪት ሪፖርት
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('analytics')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'analytics'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            የስታቲስቲክስ ገበታዎች (Charts)
          </button>
        </div>
      </div>
    </header>
  );
};
