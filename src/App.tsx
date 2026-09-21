/**
 * Kirkos / Yeka Sub-City Revenues Office
 * Camera Usage and Special Deployment Inspection Report & Dashboard
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  initialHeader,
  initialCameraUsageRecords,
  initialCameraFindingRecords,
  initialSpecialDeploymentRecords
} from './data/initialData';
import {
  ReportHeader,
  CameraUsageRecord,
  CameraFindingRecord,
  SpecialDeploymentRecord,
  ActiveTab
} from './types';
import { Navbar } from './components/Navbar';
import { HeaderInfoCard } from './components/HeaderInfoCard';
import { DataEntryHub } from './components/DataEntryHub';
import { ClearDataModal } from './components/ClearDataModal';
import { KpiMetrics } from './components/KpiMetrics';
import { VisualAnalytics } from './components/VisualAnalytics';
import { CameraUsageTable } from './components/CameraUsageTable';
import { CameraFindingsTable } from './components/CameraFindingsTable';
import { SpecialDeploymentTable } from './components/SpecialDeploymentTable';
import { AlertsView } from './components/AlertsView';
import { RowModal, ModalMode } from './components/RowModal';
import { PrintReportView } from './components/PrintReportView';
import { TelegramShareModal } from './components/TelegramShareModal';
import { exportReportToCSV } from './utils/exportCsv';
import { analyzeFindingAlert } from './utils/alertDetector';
import { launchTelegram } from './utils/telegramLauncher';
import { CheckCircle2, Info, FileSpreadsheet, ShieldCheck, Sparkles, Send, ShieldAlert, ArrowRight } from 'lucide-react';

const STORAGE_KEY_HEADER = 'eth_tax_report_header_v3';
const STORAGE_KEY_CAM_USAGE = 'eth_tax_report_cam_usage_v3';
const STORAGE_KEY_FINDINGS = 'eth_tax_report_findings_v3';
const STORAGE_KEY_SPECIAL = 'eth_tax_report_special_v3';

export default function App() {
  // 1. Local state initialized from localStorage or defaults
  const [header, setHeader] = useState<ReportHeader>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_HEADER) || localStorage.getItem('eth_tax_report_header_v1') || localStorage.getItem('eth_tax_report_header_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...initialHeader,
          ...parsed,
          reportTitle: 'የአዲስ አበባ ገቢዎች ቢሮ በካሜራ የታገዘ የመስክ ቁጥጥር ስምሪት አፈጻጸም ሪፖርት'
        };
      } catch {
        return initialHeader;
      }
    }
    return initialHeader;
  });

  const [cameraUsage, setCameraUsage] = useState<CameraUsageRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CAM_USAGE);
    return saved ? JSON.parse(saved) : initialCameraUsageRecords;
  });

  const [cameraFindings, setCameraFindings] = useState<CameraFindingRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_FINDINGS);
    return saved ? JSON.parse(saved) : initialCameraFindingRecords;
  });

  const [specialDeployments, setSpecialDeployments] = useState<SpecialDeploymentRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SPECIAL);
    return saved ? JSON.parse(saved) : initialSpecialDeploymentRecords;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [isPrintView, setIsPrintView] = useState(false);
  const [showNotesBanner, setShowNotesBanner] = useState(true);

  // Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: ModalMode;
    data: any | null;
  }>({
    isOpen: false,
    mode: 'camera_usage',
    data: null
  });

  // Clear Data Modal state
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Telegram Share Modal state
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);

  // High-Priority Alerts Count for Navbar and Supervisors
  const alertsCount = useMemo(() => {
    return cameraFindings.filter(f => analyzeFindingAlert(f) !== null).length;
  }, [cameraFindings]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HEADER, JSON.stringify(header));
  }, [header]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CAM_USAGE, JSON.stringify(cameraUsage));
  }, [cameraUsage]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FINDINGS, JSON.stringify(cameraFindings));
  }, [cameraFindings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SPECIAL, JSON.stringify(specialDeployments));
  }, [specialDeployments]);

  // Clear data handlers
  const handleClearAllData = () => {
    setCameraUsage([]);
    setCameraFindings([]);
    setSpecialDeployments([]);
  };

  const handleClearCameraUsage = () => {
    setCameraUsage([]);
  };

  const handleClearCameraFindings = () => {
    setCameraFindings([]);
  };

  const handleClearSpecialDeployments = () => {
    setSpecialDeployments([]);
  };

  // Restore sample demo data
  const handleLoadSampleData = () => {
    setHeader(initialHeader);
    setCameraUsage(initialCameraUsageRecords);
    setCameraFindings(initialCameraFindingRecords);
    setSpecialDeployments(initialSpecialDeploymentRecords);
  };

  // Export CSV
  const handleExportCSV = () => {
    exportReportToCSV(header, cameraUsage, cameraFindings, specialDeployments);
  };

  // Modal Handlers
  const handleOpenAddModal = (mode: ModalMode = 'camera_usage') => {
    setModalState({
      isOpen: true,
      mode,
      data: null
    });
  };

  const handleOpenEditModal = (mode: ModalMode, data: any) => {
    setModalState({
      isOpen: true,
      mode,
      data
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: 'camera_usage',
      data: null
    });
  };

  const handleSaveModal = (mode: ModalMode, data: any) => {
    if (mode === 'camera_usage') {
      if (modalState.data?.id) {
        // Edit existing
        setCameraUsage(prev =>
          prev.map(item => (item.id === modalState.data.id ? { ...item, ...data } : item))
        );
      } else {
        // Add new
        const newRecord: CameraUsageRecord = {
          ...data,
          id: 'cam-row-' + Date.now(),
          orderNumber: cameraUsage.length + 1
        };
        setCameraUsage(prev => [...prev, newRecord]);
      }
    } else if (mode === 'camera_findings') {
      if (modalState.data?.id) {
        setCameraFindings(prev =>
          prev.map(item => (item.id === modalState.data.id ? { ...item, ...data } : item))
        );
      } else {
        const newRecord: CameraFindingRecord = {
          ...data,
          id: 'finding-row-' + Date.now(),
          orderNumber: cameraFindings.length + 1
        };
        setCameraFindings(prev => [...prev, newRecord]);
      }
    } else if (mode === 'special_deployment') {
      if (modalState.data?.id) {
        setSpecialDeployments(prev =>
          prev.map(item => (item.id === modalState.data.id ? { ...item, ...data } : item))
        );
      } else {
        const newRecord: SpecialDeploymentRecord = {
          ...data,
          id: 'special-row-' + Date.now(),
          orderNumber: specialDeployments.length + 1
        };
        setSpecialDeployments(prev => [...prev, newRecord]);
      }
    }
  };

  // Deletion handlers
  const handleDeleteCamUsage = (id: string) => {
    if (window.confirm('ይህንን የካሜራ አጠቃቀም ረድፍ መሰረዝ ይፈልጋሉ?')) {
      setCameraUsage(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleDeleteFinding = (id: string) => {
    if (window.confirm('ይህንን የካሜራ ግኝት ረድፍ መሰረዝ ይፈልጋሉ?')) {
      setCameraFindings(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleDeleteSpecial = (id: string) => {
    if (window.confirm('ይህንን የልዩ ስምሪት ረድፍ መሰረዝ ይፈልጋሉ?')) {
      setSpecialDeployments(prev => prev.filter(r => r.id !== id));
    }
  };

  // If print view is triggered
  if (isPrintView) {
    return (
      <>
        <PrintReportView
          header={header}
          cameraUsage={cameraUsage}
          cameraFindings={cameraFindings}
          specialDeployments={specialDeployments}
          onBackToDashboard={() => setIsPrintView(false)}
          onOpenTelegram={() => setIsTelegramModalOpen(true)}
        />
        <TelegramShareModal
          isOpen={isTelegramModalOpen}
          onClose={() => setIsTelegramModalOpen(false)}
          header={header}
          cameraUsage={cameraUsage}
          cameraFindings={cameraFindings}
          specialDeployments={specialDeployments}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 pb-16">
      
      {/* Top Navbar */}
      <Navbar
        header={header}
        onUpdateHeader={setHeader}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onPrint={() => setIsPrintView(true)}
        onExportCSV={handleExportCSV}
        onReset={handleLoadSampleData}
        onClearData={() => setIsClearModalOpen(true)}
        onAddNewModal={(mode) => handleOpenAddModal(mode || (activeTab === 'camera_findings' ? 'camera_findings' : activeTab === 'special_deployment' ? 'special_deployment' : 'camera_usage'))}
        onOpenTelegram={() => setIsTelegramModalOpen(true)}
        alertsCount={alertsCount}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Official Header Card with Editable Controls */}
        <HeaderInfoCard
          header={header}
          onUpdateHeader={setHeader}
          onOpenTelegram={() => setIsTelegramModalOpen(true)}
        />

        {/* Dedicated New Data Registration Hub & Quick Entry Bar */}
        <DataEntryHub
          currentSubCity={header.subCity}
          onOpenAddModal={handleOpenAddModal}
          onOpenClearModal={() => setIsClearModalOpen(true)}
          counts={{
            cameraUsage: cameraUsage.length,
            cameraFindings: cameraFindings.length,
            specialDeployments: specialDeployments.length
          }}
        />

        {/* System Notice / Prompt Corrections Note */}
        {showNotesBanner && (
          <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl p-4 text-xs shadow-xs relative">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-950 text-sm">
                    የተደረጉ ማሻሻያዎች እና የበይነተገናኝ ዳሽቦርድ መመሪያ
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowNotesBanner(false)}
                    className="text-amber-800 hover:text-amber-950 font-semibold text-[11px]"
                  >
                    ዝጋ (Dismiss)
                  </button>
                </div>
                <ul className="mt-1.5 space-y-1 text-amber-900 text-xs list-disc list-inside">
                  <li>
                    <strong>የክፍለ ከተሞች እና ማዕከላት ሙሉ ዝርዝር፡</strong> መርካቶ ቁጥር 1፣ መርካቶ ቁጥር 2 ጨምሮ ሁሉም የአዲስ አበባ ክፍለ ከተሞች እና በስራቸው ያሉ ወረዳዎች በሙሉ ተካተው ተሟልተዋል።
                  </li>
                  <li>
                    <strong>የቃላት እርማት፡</strong> በክፍል 3 ሰንጠረዥ ውስጥ <em>"ማስታወቂያ አለመለ his መዝገብ"</em> የሚለው የጽሁፍ ግድፈት ወደ <em>"ማስታወቂያ አለመለጠፍ / መዝገብ አለመያዝ"</em> ተስተካክሏል።
                  </li>
                  <li>
                    <strong>በይነተገናኝ አሰራር፡</strong> አዲስ መረጃዎችን መመዝገብ፣ ማረም፣ በወረዳ ወይም በካሜራ መለያ (CAM-001/002) መፈለግ፣ ድምሮችን በራስ-ሰር ማስላት፣ እንዲሁም ወደ Excel/CSV መላክ እና በ A4 ይፋዊ ቅርጽ ማተም ይችላሉ።
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* High-Level Executive Overview (KPIs) */}
        <KpiMetrics
          cameraUsage={cameraUsage}
          cameraFindings={cameraFindings}
          specialDeployments={specialDeployments}
        />

        {/* High-Priority Alerts Quick Action Banner for Supervisors */}
        {alertsCount > 0 && activeTab === 'all' && (
          <div className="mb-6 bg-gradient-to-r from-rose-900 via-rose-950 to-slate-900 text-white rounded-xl p-4 shadow-md border border-rose-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-600/70 text-white border border-rose-400/40">
                <ShieldAlert className="w-5 h-5 text-rose-200 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-sm sm:text-base">
                    🚨 አስቸኳይ ክትትል የሚሹ {alertsCount} የካሜራ ግኝት ማስጠንቀቂያዎች ተገኝተዋል!
                  </span>
                  <span className="text-[10px] uppercase font-black bg-rose-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                    Action Needed
                  </span>
                </div>
                <p className="text-xs text-rose-200/90 mt-0.5">
                  በግኝቶች ዝርዝር ውስጥ ከፍተኛ ቅድሚያ የተሰጣቸው የስርቆት፣ የዲሲፕሊን ክስ፣ የሌንስ መሸፈን ወይም የጥሰት ቁልፍ ቃላት በራስ-ሰር ተለይተዋል።
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('alerts')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black bg-rose-500 hover:bg-rose-400 text-white shadow-sm transition-all whitespace-nowrap self-start sm:self-auto cursor-pointer"
            >
              <span>ወደ ማስጠንቀቂያዎች ሂድ (Go to Alerts)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* View Switch / Content Sections */}
        {activeTab === 'alerts' && (
          <AlertsView
            records={cameraFindings}
            onEditRecord={(record) => handleOpenEditModal('camera_findings', record)}
            onDeleteRecord={handleDeleteFinding}
            onOpenTelegramAlert={async (finding, match, note) => {
              const msg = `🚨 አስቸኳይ የመስክ ካሜራ ግኝት ማስጠንቀቂያ!\n📍 ክፍለ ከተማ: ${finding.subCity}\n⚠️ ደረጃ: ${match.severity === 'critical' ? 'ከፍተኛ ቅድሚያ (Critical)' : 'መካከለኛ ማስጠንቀቂያ (Warning)'}\n🔍 የተገኙ ቁልፍ ቃላት: ${match.matchedKeywords.join(', ')}\n📋 የግኝት መግለጫ: ${finding.description || '—'}\n${note ? `📝 የሱፐርቫይዘር መመሪያ: ${note}\n` : ''}📅 ቀን: ${header.dateEth}\n\n🏛️ የአዲስ አበባ ከተማ አስተዳደር ገቢዎች ቢሮ`;
              await launchTelegram({
                text: msg,
                mode: 'app',
                autoCopy: true
              });
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <VisualAnalytics
            cameraFindings={cameraFindings}
            specialDeployments={specialDeployments}
          />
        )}

        {(activeTab === 'all' || activeTab === 'analytics') && activeTab !== 'analytics' && (
          <VisualAnalytics
            cameraFindings={cameraFindings}
            specialDeployments={specialDeployments}
          />
        )}

        {(activeTab === 'all' || activeTab === 'camera_usage') && (
          <CameraUsageTable
            records={cameraUsage}
            currentSubCity={header.subCity}
            onAddRecord={() => handleOpenAddModal('camera_usage')}
            onEditRecord={(record) => handleOpenEditModal('camera_usage', record)}
            onDeleteRecord={handleDeleteCamUsage}
            onClearTable={handleClearCameraUsage}
          />
        )}

        {(activeTab === 'all' || activeTab === 'camera_findings') && (
          <CameraFindingsTable
            records={cameraFindings}
            onAddRecord={() => handleOpenAddModal('camera_findings')}
            onEditRecord={(record) => handleOpenEditModal('camera_findings', record)}
            onDeleteRecord={handleDeleteFinding}
            onClearTable={handleClearCameraFindings}
            onNavigateToAlerts={() => setActiveTab('alerts')}
          />
        )}

        {(activeTab === 'all' || activeTab === 'special_deployment') && (
          <SpecialDeploymentTable
            records={specialDeployments}
            onAddRecord={() => handleOpenAddModal('special_deployment')}
            onEditRecord={(record) => handleOpenEditModal('special_deployment', record)}
            onDeleteRecord={handleDeleteSpecial}
            onClearTable={handleClearSpecialDeployments}
          />
        )}

        {/* Bottom Official Sign-off and Status strip */}
        <div className="mt-10 bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">
                  የሪፖርት ዝግጁነት ሁኔታ፡ የተሟላና የተረጋገጠ
                </p>
                <p className="text-xs text-slate-500">
                  መረጃው በኮምፒውተርዎ ላይ በደህንነት ተቀምጧል (Auto-saved)። ወደ ይፋዊ ፒዲኤፍ ወይም ኤክሴል ማውጣት ይችላሉ።
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTelegramModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#24A1DE] hover:bg-[#1d86ba] text-white transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>በቴሌግራም ላክ (Telegram)</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>ወደ Excel ላክ (CSV)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPrintView(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>ይፋዊ ሪፖርት አትም (Print/PDF)</span>
              </button>
            </div>
          </div>
        </div>

      </main>

      {/* Row Add/Edit Modal */}
      <RowModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        initialData={modalState.data}
        currentSubCity={header.subCity}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
      />

      {/* Clear Data Confirmation and Selection Modal */}
      <ClearDataModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onClearAll={handleClearAllData}
        onClearCameraUsage={handleClearCameraUsage}
        onClearCameraFindings={handleClearCameraFindings}
        onClearSpecialDeployments={handleClearSpecialDeployments}
        onLoadSampleData={handleLoadSampleData}
        counts={{
          cameraUsage: cameraUsage.length,
          cameraFindings: cameraFindings.length,
          specialDeployments: specialDeployments.length
        }}
      />

      {/* Telegram Share Modal */}
      <TelegramShareModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
        header={header}
        cameraUsage={cameraUsage}
        cameraFindings={cameraFindings}
        specialDeployments={specialDeployments}
      />
    </div>
  );
}
