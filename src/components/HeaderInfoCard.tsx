import React, { useState } from 'react';
import { Calendar, Clock, Users, FileCheck2, MapPin, Edit3, Check, Layers, UserCheck, CalendarDays, FileText, Send } from 'lucide-react';
import { ReportHeader } from '../types';
import { ALL_SUB_CITIES, getSubCityInfo, getWoredasForSubCity } from '../data/subCitiesAndWoredas';

interface HeaderInfoCardProps {
  header: ReportHeader;
  onUpdateHeader: (header: ReportHeader) => void;
  onOpenTelegram?: () => void;
}

export const HeaderInfoCard: React.FC<HeaderInfoCardProps> = ({ header, onUpdateHeader, onOpenTelegram }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ReportHeader>(header);

  const currentSubCityInfo = getSubCityInfo(header.subCity);
  const currentWoredas = getWoredasForSubCity(header.subCity);

  const handleSave = () => {
    onUpdateHeader(formData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4 sm:p-5 mb-6 transition-all">
      {/* Official Header with Dual Left and Right Logos */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-4">
        {/* Left: Official Revenues Bureau Logo */}
        <div className="flex items-center gap-3.5 self-start sm:self-center">
          <div className="relative group">
            <img
              src="/revenues_bureau_logo.jpg"
              alt="የአዲስ አበባ ከተማ አስተዳደር ገቢዎች ቢሮ አርማ Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full shadow-md border-2 border-amber-400 bg-white p-0.5 shrink-0 transition-transform group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold" title="ይፋዊ አርማ">
              ✓
            </span>
          </div>
          <div className="hidden xs:block sm:hidden md:block">
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              ይፋዊ አርማ
            </span>
          </div>
        </div>

        {/* Center: Main Report Title & Meta Badges */}
        <div className="text-center sm:text-left flex-1 px-1 sm:px-3">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 flex-wrap">
            <span className="text-[11px] font-bold text-amber-900 bg-amber-100/80 border border-amber-300/70 px-2.5 py-0.5 rounded-full">
              የአዲስ አበባ ከተማ አስተዳደር ገቢዎች ቢሮ
            </span>
            <span className="text-xs font-semibold text-slate-500">
              • የቁጥጥር ቀን፡ {header.dateEth}
            </span>
            {header.reportSubmissionDate && header.reportSubmissionDate !== header.dateEth && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                የሪፖርት ቀን፡ {header.reportSubmissionDate}
              </span>
            )}
            {header.reportReceiverName && (
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-emerald-600" />
                ተቀባይ፡ {header.reportReceiverName}
              </span>
            )}
          </div>

          <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-slate-950 tracking-tight leading-snug">
            {header.reportTitle || 'የአዲስ አበባ ገቢዎች ቢሮ በካሜራ የታገዘ የመስክ ቁጥጥር ስምሪት አፈጻጸም ሪፖርት'}
          </h2>

          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap mt-1.5">
            <span className="text-xs font-bold text-slate-900 bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-md">
              {header.subCity} {currentSubCityInfo?.type === 'special_branch' ? '(ልዩ የግብር ቅርንጫፍ)' : 'ክፍለ ከተማ ገቢዎች ቢሮ'}
            </span>
            <span className="text-xs text-slate-600 font-medium bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded">
              {header.inspectionType}
            </span>
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
              {currentWoredas.length} ወረዳዎች
            </span>
          </div>
        </div>

        {/* Right: Inspection Body-Worn Camera Logo & Quick Actions */}
        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex flex-col items-end text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">የመስክ ካሜራ ስምሪት</span>
              <span className="text-xs font-bold text-slate-800">Body Camera Unit</span>
            </div>
            <div className="relative group">
              <img
                src="/body_camera_logo.jpg"
                alt="የመስክ ቁጥጥር ካሜራ አርማ Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl shadow-md border-2 border-slate-700 bg-slate-950 p-0.5 shrink-0 transition-transform group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white animate-pulse" title="ካሜራ ነቅቷል (Active)" />
            </div>
          </div>

          {onOpenTelegram && !isEditing && (
            <button
              type="button"
              onClick={onOpenTelegram}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-[#24A1DE] hover:bg-[#1d86ba] text-white shadow-xs transition-all"
              title="ይህንን ሪፖርት በቴሌግራም ለተቀባይ ላክ"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">በቴሌግራም ላክ</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (isEditing) handleSave();
              else {
                setFormData(header);
                setIsEditing(true);
              }
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              isEditing
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>አጽድቅ (Save)</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>መረጃውን አርም (Edit)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-600" />
              የሪፖርት ሜታዳታ መረጃዎች ማረሚያ (Header Metadata Editor)
            </h4>
            <span className="text-[11px] text-slate-500">
              ለውጦቹን ለማስቀመጥ "አጽድቅ (Save)" አዝራርን ይጫኑ
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">ክፍለ ከተማ / ማዕከል</label>
              <select
                value={formData.subCity}
                onChange={(e) => setFormData({ ...formData, subCity: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium cursor-pointer"
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
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">የቁጥጥር ቀን (ዓ.ም)</label>
              <input
                type="text"
                value={formData.dateEth}
                onChange={(e) => setFormData({ ...formData, dateEth: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="28/12/2018 ዓ.ም"
              />
            </div>

            {/* New Feature: የሪፖርት ቀን */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
                <span>የሪፖርት ቀን (የቀረበበት)</span>
              </label>
              <input
                type="text"
                value={formData.reportSubmissionDate || ''}
                onChange={(e) => setFormData({ ...formData, reportSubmissionDate: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                placeholder="28/12/2018 ዓ.ም"
              />
            </div>

            {/* New Feature: የሪፖርት ተቀባይ ስም */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>የሪፖርት ተቀባይ ስም</span>
              </label>
              <input
                type="text"
                value={formData.reportReceiverName || ''}
                onChange={(e) => setFormData({ ...formData, reportReceiverName: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                placeholder="ለምሳሌ፡ አቶ ግርማ ወ/ማርያም (የስራ ሂደት አስተባባሪ)"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ፈረቃ</label>
              <input
                type="text"
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="የጠዋት ፈረቃ / ከሰዓት ፈረቃ"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">የተመደበ ቡድን</label>
              <input
                type="text"
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="ቡድን 1 እና ቡድን 2"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">የቁጥጥር አይነት</label>
              <input
                type="text"
                value={formData.inspectionType}
                onChange={(e) => setFormData({ ...formData, inspectionType: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="በካሜራ የታገዘ የመስክ ቁጥጥር ወይም የልዩ ስምሪት"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="flex items-start gap-2.5 bg-slate-50/70 p-2 rounded-lg border border-slate-100">
              <Calendar className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <span className="text-slate-400 block font-medium text-[10px]">የቁጥጥር ቀን</span>
                <span className="font-bold text-slate-800 text-xs truncate block">{header.dateEth}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-slate-50/70 p-2 rounded-lg border border-slate-100">
              <CalendarDays className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <span className="text-slate-400 block font-medium text-[10px]">የሪፖርት ቀን</span>
                <span className="font-bold text-slate-800 text-xs truncate block">
                  {header.reportSubmissionDate || header.dateEth}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-slate-50/70 p-2 rounded-lg border border-slate-100">
              <UserCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <span className="text-slate-400 block font-medium text-[10px]">የሪፖርት ተቀባይ ስም</span>
                <span className="font-semibold text-slate-800 text-xs truncate block" title={header.reportReceiverName || 'ያልተገለጸ'}>
                  {header.reportReceiverName || 'ያልተገለጸ'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-slate-50/70 p-2 rounded-lg border border-slate-100">
              <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <span className="text-slate-400 block font-medium text-[10px]">ፈረቃ</span>
                <span className="font-semibold text-slate-800 text-xs truncate block">{header.shift || 'ያልተገለጸ'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-slate-50/70 p-2 rounded-lg border border-slate-100">
              <Users className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <span className="text-slate-400 block font-medium text-[10px]">የተመደበ ቡድን</span>
                <span className="font-semibold text-slate-800 text-xs truncate block">{header.team || 'ቡድን 1 እና 2'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-slate-50/70 p-2 rounded-lg border border-slate-100">
              <MapPin className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <span className="text-slate-400 block font-medium text-[10px]">የቁጥጥር አይነት</span>
                <span className="font-semibold text-slate-800 text-xs truncate block" title={header.inspectionType}>
                  {header.inspectionType}
                </span>
              </div>
            </div>
          </div>

          {/* Under-the-hood: Woredas coverage details */}
          <div className="pt-2.5 mt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] bg-slate-50/70 p-2 rounded-lg">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                በ{header.subCity} ስር ያሉ ወረዳዎች ({currentWoredas.length}):
              </span>
              <div className="flex flex-wrap gap-1">
                {currentWoredas.map(w => (
                  <span key={w} className="bg-white text-slate-700 font-medium px-1.5 py-0.5 rounded border border-slate-200">
                    {w}
                  </span>
                ))}
              </div>
            </div>

            {currentSubCityInfo?.majorLocations && currentSubCityInfo.majorLocations.length > 0 && (
              <div className="text-slate-500 sm:text-right shrink-0">
                <span className="font-semibold text-slate-600">ዋና ዋና ቀጠናዎች: </span>
                <span>{currentSubCityInfo.majorLocations.slice(0, 4).join(', ')}...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
