import React, { useState, useEffect } from 'react';
import { X, Check, Camera, AlertTriangle, ShieldCheck, MapPin, Building2, Sparkles } from 'lucide-react';
import { CameraUsageRecord, CameraFindingRecord, SpecialDeploymentRecord } from '../types';
import { ALL_SUB_CITIES, getWoredasForSubCity, getLocationsForSubCity, getSubCityInfo } from '../data/subCitiesAndWoredas';

export type ModalMode = 'camera_usage' | 'camera_findings' | 'special_deployment';

interface RowModalProps {
  isOpen: boolean;
  mode: ModalMode;
  initialData?: any;
  currentSubCity?: string;
  onClose: () => void;
  onSave: (mode: ModalMode, data: any) => void;
}

export const RowModal: React.FC<RowModalProps> = ({
  isOpen,
  mode,
  initialData,
  currentSubCity = 'ቂርቆስ',
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const [activeMode, setActiveMode] = useState<ModalMode>(mode);
  const [camSubCity, setCamSubCity] = useState<string>(currentSubCity);
  const [isCustomWoreda, setIsCustomWoreda] = useState<boolean>(false);

  // Available woredas and suggested locations for selected sub-city
  const availableWoredas = getWoredasForSubCity(camSubCity);
  const suggestedLocations = getLocationsForSubCity(camSubCity);

  // Form 1 State
  const [camUsage, setCamUsage] = useState<Partial<CameraUsageRecord>>({
    inspectorName: '',
    inspectorName2: '',
    inspectorName3: '',
    badgeNumber: '',
    assignedWoreda: availableWoredas[0] || 'ወረዳ 01',
    specificLocation: '',
    cameraId: 'CAM-00' + Math.floor(Math.random() * 90 + 10),
    cameraDeployTime: '02:30',
    startTime: '02:45',
    endTime: '10:30',
    lateOrInterruptedDuration: '0',
    reasonSpecialDeployment: 0,
    reasonAfternoonShift: 0,
    reasonComplaint: 0,
    reasonCameraBreakdown: 0,
    remark: '',
    ...(mode === 'camera_usage' && initialData ? initialData : {})
  });

  // When sub-city changes in Form 1, default woreda if not custom
  useEffect(() => {
    if (!initialData && availableWoredas.length > 0 && !isCustomWoreda) {
      if (!availableWoredas.includes(camUsage.assignedWoreda || '')) {
        setCamUsage(prev => ({ ...prev, assignedWoreda: availableWoredas[0] }));
      }
    }
  }, [camSubCity]);

  // Form 2 State
  const [finding, setFinding] = useState<Partial<CameraFindingRecord>>({
    subCity: currentSubCity,
    totalFindingsCount: 1,
    outOfCameraView: 0,
    batteryClosedEarly: 0,
    earlyReturn: 0,
    lensCovered: 0,
    theftOrRelated: 0,
    skippedShopInspection: 0,
    description: '',
    verbalWarning: 1,
    writtenWarning: 0,
    finalWarning: 0,
    disciplinaryCharge: 0,
    ...(mode === 'camera_findings' && initialData ? initialData : {})
  });

  // Form 3 State
  const [special, setSpecial] = useState<Partial<SpecialDeploymentRecord>>({
    subCity: currentSubCity,
    deployedTeam: 'ቡድን 1',
    taxpayersAssigned: 15,
    administrativeMeasuresCount: 2,
    noReceiptTransaction: 1,
    noAuditRegister: 0,
    noNoticeOrRegister: 1,
    unlinkedUsage: 0,
    creatingObstacle: 0,
    noTechInspection: 0,
    manualReceiptViolation: 0,
    failureToReportBreakdown: 0,
    causingDamage: 0,
    addressChangeWithoutNotice: 0,
    vatNotReleased: 0,
    inspectorNames: '',
    ...(mode === 'special_deployment' && initialData ? initialData : {})
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeMode === 'camera_usage') {
      onSave('camera_usage', camUsage);
    } else if (activeMode === 'camera_findings') {
      onSave('camera_findings', finding);
    } else if (activeMode === 'special_deployment') {
      onSave('special_deployment', special);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {activeMode === 'camera_usage' && <Camera className="w-4 h-4 text-amber-600" />}
              {activeMode === 'camera_findings' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
              {activeMode === 'special_deployment' && <ShieldCheck className="w-4 h-4 text-purple-600" />}
              <span>
                {initialData ? 'መረጃ አርም' : 'አዲስ የሪፖርት ረድፍ መዝግብ'}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              {activeMode === 'camera_usage' && 'የካሜራ አጠቃቀም እና የመስክ ቁጥጥር ቅጽ'}
              {activeMode === 'camera_findings' && 'የካሜራ ግኝት (Findings) ቅጽ'}
              {activeMode === 'special_deployment' && 'የልዩ ስምሪት ቁጥጥር ቅጽ'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector (only when creating new) */}
        {!initialData && (
          <div className="flex border-b border-slate-200 bg-slate-100/60 p-2 gap-1.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveMode('camera_usage')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-colors text-center ${
                activeMode === 'camera_usage' ? 'bg-white shadow-xs text-amber-900 border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. የካሜራ አጠቃቀም
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('camera_findings')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-colors text-center ${
                activeMode === 'camera_findings' ? 'bg-white shadow-xs text-rose-900 border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. የካሜራ ግኝት
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('special_deployment')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-colors text-center ${
                activeMode === 'special_deployment' ? 'bg-white shadow-xs text-purple-900 border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. የልዩ ስምሪት
            </button>
          </div>
        )}

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* ================= MODE 1: Camera Usage ================= */}
          {activeMode === 'camera_usage' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 bg-slate-50/70 p-3 rounded-lg border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-800">
                      የተቆጣጣሪዎች ስም ዝርዝር (እስከ 3 ተቆጣጣሪዎች)
                    </label>
                    <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      የቡድን ስምሪት
                    </span>
                  </div>

                  {/* 1st Inspector (Required) */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      1. የተቆጣጣሪው ስም (ዋና) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={camUsage.inspectorName}
                      onChange={(e) => setCamUsage({ ...camUsage, inspectorName: e.target.value })}
                      placeholder="ለምሳሌ፡ አበበ ተፈራ"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  {/* Additional 2 Inspector inputs requested by user */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        2. ተጨማሪ ተቆጣጣሪ ስም (አማራጭ)
                      </label>
                      <input
                        type="text"
                        value={camUsage.inspectorName2 || ''}
                        onChange={(e) => setCamUsage({ ...camUsage, inspectorName2: e.target.value })}
                        placeholder="ለምሳሌ፡ ስለሺ ከበደ"
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                        3. ተጨማሪ ተቆጣጣሪ ስም (አማራጭ)
                      </label>
                      <input
                        type="text"
                        value={camUsage.inspectorName3 || ''}
                        onChange={(e) => setCamUsage({ ...camUsage, inspectorName3: e.target.value })}
                        placeholder="ለምሳሌ፡ አልማዝ ታደሰ"
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">መለያ ቁጥር (Badge ID)</label>
                  <input
                    type="text"
                    value={camUsage.badgeNumber}
                    onChange={(e) => setCamUsage({ ...camUsage, badgeNumber: e.target.value })}
                    placeholder="REV-0492"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>ክፍለ ከተማ / ማዕከል</span>
                    <span className="text-[10px] text-amber-700 font-normal">ወረዳዎችን ለመወሰን</span>
                  </label>
                  <select
                    value={camSubCity}
                    onChange={(e) => {
                      setCamSubCity(e.target.value);
                      setIsCustomWoreda(false);
                    }}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium bg-white cursor-pointer"
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">የተመደቡበት ወረዳ</label>
                    <button
                      type="button"
                      onClick={() => setIsCustomWoreda(!isCustomWoreda)}
                      className="text-[10px] text-amber-700 hover:underline"
                    >
                      {isCustomWoreda ? 'ከዝርዝር ምረጥ' : 'በእጅ ጻፍ'}
                    </button>
                  </div>
                  {isCustomWoreda ? (
                    <input
                      type="text"
                      required
                      value={camUsage.assignedWoreda}
                      onChange={(e) => setCamUsage({ ...camUsage, assignedWoreda: e.target.value })}
                      placeholder="ወረዳ..."
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  ) : (
                    <select
                      required
                      value={camUsage.assignedWoreda}
                      onChange={(e) => setCamUsage({ ...camUsage, assignedWoreda: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white font-medium cursor-pointer"
                    >
                      {availableWoredas.map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ልዩ ቦታ (ንግድ ቀጠና/ህንጻ)</label>
                  <input
                    type="text"
                    list="cam-suggested-locations"
                    value={camUsage.specificLocation}
                    onChange={(e) => setCamUsage({ ...camUsage, specificLocation: e.target.value })}
                    placeholder="ለምሳሌ፡ አሜሪካን ግቢ፣ ካዛንቺስ፣ ጎጃም በረንዳ..."
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <datalist id="cam-suggested-locations">
                    {suggestedLocations.map(loc => (
                      <option key={loc} value={loc} />
                    ))}
                  </datalist>
                  {suggestedLocations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {suggestedLocations.slice(0, 4).map(loc => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setCamUsage({ ...camUsage, specificLocation: loc })}
                          className="text-[10px] bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 px-1.5 py-0.5 rounded transition-colors"
                        >
                          + {loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ለስራ የወጣ ካሜራ መለያ ቁጥር</label>
                  <input
                    type="text"
                    required
                    value={camUsage.cameraId}
                    onChange={(e) => setCamUsage({ ...camUsage, cameraId: e.target.value })}
                    placeholder="CAM-001"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ካሜራ ለስራ የወጣበት ሰዓት</label>
                  <input
                    type="text"
                    value={camUsage.cameraDeployTime}
                    onChange={(e) => setCamUsage({ ...camUsage, cameraDeployTime: e.target.value })}
                    placeholder="02:30"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Time Details */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block mb-2">የመስክ ቁጥጥር የሰዓት መረጃ</span>
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">ቁጥጥር የጀመረበት</label>
                    <input
                      type="text"
                      value={camUsage.startTime}
                      onChange={(e) => setCamUsage({ ...camUsage, startTime: e.target.value })}
                      placeholder="02:45"
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">ቁጥጥር ያበቃበት</label>
                    <input
                      type="text"
                      value={camUsage.endTime}
                      onChange={(e) => setCamUsage({ ...camUsage, endTime: e.target.value })}
                      placeholder="10:30"
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">የረፈደበት/የተቋረጠበት</label>
                    <input
                      type="text"
                      value={camUsage.lateOrInterruptedDuration}
                      onChange={(e) => setCamUsage({ ...camUsage, lateOrInterruptedDuration: e.target.value })}
                      placeholder="0"
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Delay Reason Counts */}
              <div className="bg-rose-50/50 p-3 rounded-lg border border-rose-200/60">
                <span className="font-bold text-slate-800 block mb-2">የረፈደበት እና/ወይም የተቋረጠበት ምክንያት</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">ልዩ ስምሪት</label>
                    <input
                      type="number"
                      min="0"
                      value={camUsage.reasonSpecialDeployment}
                      onChange={(e) => setCamUsage({ ...camUsage, reasonSpecialDeployment: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">ከሰዓት ፈረቃ</label>
                    <input
                      type="number"
                      min="0"
                      value={camUsage.reasonAfternoonShift}
                      onChange={(e) => setCamUsage({ ...camUsage, reasonAfternoonShift: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">ቅሬታ ለማስረዳት</label>
                    <input
                      type="number"
                      min="0"
                      value={camUsage.reasonComplaint}
                      onChange={(e) => setCamUsage({ ...camUsage, reasonComplaint: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">የካሜራ ብልሽት</label>
                    <input
                      type="number"
                      min="0"
                      value={camUsage.reasonCameraBreakdown}
                      onChange={(e) => setCamUsage({ ...camUsage, reasonCameraBreakdown: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= MODE 2: Camera Findings ================= */}
          {activeMode === 'camera_findings' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ክፍለ ከተማ / ማዕከል</label>
                  <select
                    value={finding.subCity}
                    onChange={(e) => setFinding({ ...finding, subCity: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 bg-white font-medium cursor-pointer"
                  >
                    <optgroup label="★ ልዩ የገቢዎች ቅርንጫፎች / ማዕከላት">
                      {ALL_SUB_CITIES.filter(sc => sc.type === 'special_branch').map(sc => (
                        <option key={sc.id} value={sc.name}>{sc.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="የአዲስ አበባ ክፍለ ከተሞች">
                      {ALL_SUB_CITIES.filter(sc => sc.type === 'sub_city').map(sc => (
                        <option key={sc.id} value={sc.name}>{sc.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">የተገኙ ግኝቶች ብዛት</label>
                  <input
                    type="number"
                    min="0"
                    value={finding.totalFindingsCount}
                    onChange={(e) => setFinding({ ...finding, totalFindingsCount: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-bold text-amber-700"
                  />
                </div>
              </div>

              {/* Finding Types */}
              <div className="bg-amber-50/40 p-3 rounded-lg border border-amber-200/60">
                <span className="font-bold text-slate-800 block mb-2">የተገኙ ግኝቶች አይነት</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-1">ከካሜራ እይታ ውጪ</label>
                    <input
                      type="number"
                      min="0"
                      value={finding.outOfCameraView}
                      onChange={(e) => setFinding({ ...finding, outOfCameraView: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-1">ባትሪ ሳይጨርስ መዝጋት</label>
                    <input
                      type="number"
                      min="0"
                      value={finding.batteryClosedEarly}
                      onChange={(e) => setFinding({ ...finding, batteryClosedEarly: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-1">ስራ አቋርጦ መመለስ</label>
                    <input
                      type="number"
                      min="0"
                      value={finding.earlyReturn}
                      onChange={(e) => setFinding({ ...finding, earlyReturn: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-1">ሌንስ መሸፈን</label>
                    <input
                      type="number"
                      min="0"
                      value={finding.lensCovered}
                      onChange={(e) => setFinding({ ...finding, lensCovered: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-1">የስርቆት/ተዛማጅ ችግር</label>
                    <input
                      type="number"
                      min="0"
                      value={finding.theftOrRelated}
                      onChange={(e) => setFinding({ ...finding, theftOrRelated: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-1">ንግድ ቤት ዘልሎ</label>
                    <input
                      type="number"
                      min="0"
                      value={finding.skippedShopInspection}
                      onChange={(e) => setFinding({ ...finding, skippedShopInspection: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">የጥፋቱ አጭር መግለጫ</label>
                <textarea
                  rows={2}
                  value={finding.description}
                  onChange={(e) => setFinding({ ...finding, description: e.target.value })}
                  placeholder="የተፈጠረው ክፍተት ዝርዝር ማብራሪያ..."
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                />
              </div>

              {/* Actions Taken */}
              <div className="bg-rose-50/50 p-3 rounded-lg border border-rose-200/60">
                <span className="font-bold text-slate-800 block mb-2">የተወሰደ እርምጃ አይነት</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-1">የቃል ማስጠንቀቂያ</label>
                    <input
                      type="number"
                      min="0"
                      value={finding.verbalWarning}
                      onChange={(e) => setFinding({ ...finding, verbalWarning: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-1">የጽሁፍ ማስጠንቀቂያ</label>
                    <input
                      type="number"
                      min="0"
                      value={finding.writtenWarning}
                      onChange={(e) => setFinding({ ...finding, writtenWarning: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-1">የመጨረሻ ማስጠንቀቂያ</label>
                    <input
                      type="number"
                      min="0"
                      value={finding.finalWarning}
                      onChange={(e) => setFinding({ ...finding, finalWarning: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-1">በዲሲፕሊን ክስ</label>
                    <input
                      type="number"
                      min="0"
                      value={finding.disciplinaryCharge}
                      onChange={(e) => setFinding({ ...finding, disciplinaryCharge: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center font-bold text-rose-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= MODE 3: Special Deployment ================= */}
          {activeMode === 'special_deployment' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ክፍለ ከተማ / ማዕከል</label>
                  <select
                    value={special.subCity}
                    onChange={(e) => setSpecial({ ...special, subCity: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 text-slate-800 bg-white font-medium cursor-pointer"
                  >
                    <optgroup label="★ ልዩ የገቢዎች ቅርንጫፎች / ማዕከላት">
                      {ALL_SUB_CITIES.filter(sc => sc.type === 'special_branch').map(sc => (
                        <option key={sc.id} value={sc.name}>{sc.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="የአዲስ አበባ ክፍለ ከተሞች">
                      {ALL_SUB_CITIES.filter(sc => sc.type === 'sub_city').map(sc => (
                        <option key={sc.id} value={sc.name}>{sc.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">የወጣ ቡድን</label>
                  <input
                    type="text"
                    required
                    value={special.deployedTeam}
                    onChange={(e) => setSpecial({ ...special, deployedTeam: e.target.value })}
                    placeholder="ቡድን 1"
                    className="w-full border border-slate-300 rounded px-2 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ለቁጥጥር የተሰጠ ግብር ከፋይ</label>
                  <input
                    type="number"
                    min="0"
                    value={special.taxpayersAssigned}
                    onChange={(e) => setSpecial({ ...special, taxpayersAssigned: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 font-bold text-purple-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">የተወሰደ እርምጃ ብዛት</label>
                  <input
                    type="number"
                    min="0"
                    value={special.administrativeMeasuresCount}
                    onChange={(e) => setSpecial({ ...special, administrativeMeasuresCount: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 font-bold text-rose-700"
                  />
                </div>
              </div>

              {/* 11 Violation fields */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block mb-2">የተወሰደ አስተዳደራዊ እርምጃ / የጥሰት አይነት</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">ያለ ደረሰኝ ግብይት</label>
                    <input
                      type="number"
                      min="0"
                      value={special.noReceiptTransaction}
                      onChange={(e) => setSpecial({ ...special, noReceiptTransaction: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">ምርመራ መዝገብ አለማስቀመጥ</label>
                    <input
                      type="number"
                      min="0"
                      value={special.noAuditRegister}
                      onChange={(e) => setSpecial({ ...special, noAuditRegister: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">ማስታወቂያ አለመለጠፍ</label>
                    <input
                      type="number"
                      min="0"
                      value={special.noNoticeOrRegister}
                      onChange={(e) => setSpecial({ ...special, noNoticeOrRegister: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">መረጃ ሳያገናኙ መጠቀም</label>
                    <input
                      type="number"
                      min="0"
                      value={special.unlinkedUsage}
                      onChange={(e) => setSpecial({ ...special, unlinkedUsage: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">መሰናክል መፍጠር</label>
                    <input
                      type="number"
                      min="0"
                      value={special.creatingObstacle}
                      onChange={(e) => setSpecial({ ...special, creatingObstacle: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">ቴክኒክ ምርመራ አለማድረግ</label>
                    <input
                      type="number"
                      min="0"
                      value={special.noTechInspection}
                      onChange={(e) => setSpecial({ ...special, noTechInspection: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">የእጅ በእጅ ደረሰኝ</label>
                    <input
                      type="number"
                      min="0"
                      value={special.manualReceiptViolation}
                      onChange={(e) => setSpecial({ ...special, manualReceiptViolation: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">ብልሸት አለማሳወቅ</label>
                    <input
                      type="number"
                      min="0"
                      value={special.failureToReportBreakdown}
                      onChange={(e) => setSpecial({ ...special, failureToReportBreakdown: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">ጉዳት ማድረስ</label>
                    <input
                      type="number"
                      min="0"
                      value={special.causingDamage}
                      onChange={(e) => setSpecial({ ...special, causingDamage: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">አድራሻ መለወጥ</label>
                    <input
                      type="number"
                      min="0"
                      value={special.addressChangeWithoutNotice}
                      onChange={(e) => setSpecial({ ...special, addressChangeWithoutNotice: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">ቫት አለመለቀቅ</label>
                    <input
                      type="number"
                      min="0"
                      value={special.vatNotReleased}
                      onChange={(e) => setSpecial({ ...special, vatNotReleased: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-center"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">የተቆጣጣሪ ሰራተኞች ስም</label>
                <input
                  type="text"
                  value={special.inspectorNames}
                  onChange={(e) => setSpecial({ ...special, inspectorNames: e.target.value })}
                  placeholder="ተስፋዬ መንግስቱ፣ ብሩክ ገብሬ..."
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium transition-colors"
            >
              ተመለስ (Cancel)
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>መዝግብ (Save)</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
