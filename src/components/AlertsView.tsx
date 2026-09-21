import React, { useState, useMemo, useEffect } from 'react';
import { CameraFindingRecord, SupervisorIntervention } from '../types';
import {
  analyzeFindingAlert,
  highlightKeywordsInText,
  DEFAULT_CRITICAL_KEYWORDS,
  DEFAULT_WARNING_KEYWORDS,
  AlertMatch
} from '../utils/alertDetector';
import {
  AlertTriangle,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Edit2,
  Trash2,
  Plus,
  X,
  Sparkles,
  ArrowUpRight,
  BookmarkCheck,
  FileSpreadsheet
} from 'lucide-react';

interface AlertsViewProps {
  records: CameraFindingRecord[];
  onEditRecord: (record: CameraFindingRecord) => void;
  onDeleteRecord: (id: string) => void;
  onOpenTelegramAlert?: (finding: CameraFindingRecord, match: AlertMatch, note: string) => void;
}

const STORAGE_KEY_INTERVENTIONS = 'supervisor_interventions_v1';
const STORAGE_KEY_CUSTOM_KEYWORDS = 'supervisor_custom_keywords_v1';

export const AlertsView: React.FC<AlertsViewProps> = ({
  records,
  onEditRecord,
  onDeleteRecord,
  onOpenTelegramAlert
}) => {
  // Custom keywords managed by supervisor
  const [customKeywords, setCustomKeywords] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_KEYWORDS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [showKeywordManager, setShowKeywordManager] = useState(false);

  // Supervisor interventions state
  const [interventions, setInterventions] = useState<Record<string, SupervisorIntervention>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INTERVENTIONS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Active notes being edited
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

  // Filter state
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'action_taken' | 'escalated'>('all');
  const [selectedSubCity, setSelectedSubCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist interventions
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_INTERVENTIONS, JSON.stringify(interventions));
  }, [interventions]);

  // Persist custom keywords
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CUSTOM_KEYWORDS, JSON.stringify(customKeywords));
  }, [customKeywords]);

  // Analyze all records for alerts
  const analyzedMatches = useMemo(() => {
    const matches: AlertMatch[] = [];
    records.forEach(record => {
      const match = analyzeFindingAlert(record, customKeywords);
      if (match) {
        matches.push(match);
      }
    });
    return matches;
  }, [records, customKeywords]);

  // Unique sub-cities present in alerts
  const availableSubCities = useMemo(() => {
    const set = new Set<string>();
    analyzedMatches.forEach(m => {
      if (m.record.subCity) set.add(m.record.subCity);
    });
    return Array.from(set);
  }, [analyzedMatches]);

  // Metrics
  const stats = useMemo(() => {
    let criticalCount = 0;
    let warningCount = 0;
    let resolvedCount = 0;
    let pendingCount = 0;

    analyzedMatches.forEach(m => {
      if (m.severity === 'critical') criticalCount++;
      if (m.severity === 'warning') warningCount++;

      const status = interventions[m.record.id]?.status || 'pending';
      if (status === 'action_taken' || status === 'escalated') {
        resolvedCount++;
      } else {
        pendingCount++;
      }
    });

    return {
      totalAlerts: analyzedMatches.length,
      criticalCount,
      warningCount,
      resolvedCount,
      pendingCount
    };
  }, [analyzedMatches, interventions]);

  // Filtered matches
  const filteredMatches = useMemo(() => {
    return analyzedMatches.filter(m => {
      // Severity filter
      if (severityFilter !== 'all' && m.severity !== severityFilter) {
        return false;
      }

      // Status filter
      const currentStatus = interventions[m.record.id]?.status || 'pending';
      if (statusFilter !== 'all' && currentStatus !== statusFilter) {
        return false;
      }

      // Sub-city filter
      if (selectedSubCity !== 'all' && m.record.subCity !== selectedSubCity) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const desc = (m.record.description || '').toLowerCase();
        const sub = (m.record.subCity || '').toLowerCase();
        const kwMatch = m.matchedKeywords.some(k => k.toLowerCase().includes(q));
        const noteMatch = (interventions[m.record.id]?.supervisorNote || '').toLowerCase().includes(q);

        if (!desc.includes(q) && !sub.includes(q) && !kwMatch && !noteMatch) {
          return false;
        }
      }

      return true;
    });
  }, [analyzedMatches, severityFilter, statusFilter, selectedSubCity, searchQuery, interventions]);

  // Handle adding custom keyword
  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newKeywordInput.trim();
    if (!clean) return;
    if (!customKeywords.includes(clean)) {
      setCustomKeywords(prev => [...prev, clean]);
    }
    setNewKeywordInput('');
  };

  const handleRemoveCustomKeyword = (kw: string) => {
    setCustomKeywords(prev => prev.filter(k => k !== kw));
  };

  // Status updates
  const handleUpdateStatus = (
    findingId: string,
    status: SupervisorIntervention['status']
  ) => {
    setInterventions(prev => ({
      ...prev,
      [findingId]: {
        findingId,
        status,
        supervisorNote: prev[findingId]?.supervisorNote || '',
        updatedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
    }));
  };

  // Note updates
  const handleSaveNote = (findingId: string) => {
    const noteText = editingNotes[findingId] ?? (interventions[findingId]?.supervisorNote || '');
    setInterventions(prev => ({
      ...prev,
      [findingId]: {
        findingId,
        status: prev[findingId]?.status || 'in_progress',
        supervisorNote: noteText,
        updatedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
    }));
    // clear temporary editing
    setEditingNotes(prev => {
      const next = { ...prev };
      delete next[findingId];
      return next;
    });
  };

  return (
    <div className="space-y-6 mb-10">
      {/* Top Header Card */}
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                የአስቸኳይ ግኝት ክትትል ስርዓት
              </span>
              <span className="text-xs text-slate-400">
                Supervisor Early Warning System
              </span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-tight">
              የካሜራ ግኝት ማስጠንቀቂያዎችና ፈጣን የቁጥጥር ጣልቃ-ገብነት (Alerts)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              ከፍተኛ ቅድሚያ የተሰጣቸው የዲሲፕሊን፣ የስርቆት፣ የሌንስ መሸፈን እና የጥሰት ቁልፍ ቃላት በራስ-ሰር ተለይተው ለሱፐርቫይዘሮች አፋጣኝ ውሳኔ የሚቀርቡበት ማዕከል
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setShowKeywordManager(prev => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>የቁልፍ ቃላት ዝርዝር ({DEFAULT_CRITICAL_KEYWORDS.length + customKeywords.length})</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/90">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>ጠቅላላ ማስጠንቀቂያዎች</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {stats.totalAlerts}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              የተገኙ አጠቃላይ ጥሰቶች
            </div>
          </div>

          <div className="bg-rose-950/40 border border-rose-800/50 rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between text-xs text-rose-300 mb-1">
              <span>🚨 ከፍተኛ ቅድሚያ (Critical)</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-400">
              {stats.criticalCount}
            </div>
            <div className="text-[11px] text-rose-300/80 mt-0.5">
              ስርቆት፣ ክስ ወይም ሌንስ መሸፈን
            </div>
          </div>

          <div className="bg-amber-950/40 border border-amber-800/50 rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between text-xs text-amber-300 mb-1">
              <span>⚠️ መካከለኛ ማስጠንቀቂያ</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-400">
              {stats.warningCount}
            </div>
            <div className="text-[11px] text-amber-300/80 mt-0.5">
              ባትሪ፣ እይታ ውጪና መቋረጥ
            </div>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between text-xs text-emerald-300 mb-1">
              <span>✅ እርምጃ የተወሰደባቸው</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">
              {stats.resolvedCount}
            </div>
            <div className="text-[11px] text-emerald-300/80 mt-0.5">
              የቀሩ ያልታዩ፡ <span className="font-bold text-amber-300">{stats.pendingCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Keyword Manager */}
      {showKeywordManager && (
        <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-800">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  የክትትልና የማስጠንቀቂያ ቁልፍ ቃላት አስተዳደር (Alert Watchwords)
                </h4>
                <p className="text-xs text-slate-500">
                  በግኝቶች መግለጫ ውስጥ እነዚህ ቃላት ሲገኙ ስርዓቱ በራስ-ሰር ሪፖርቱን ቀይ አብርቶ ያሳውቃል
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowKeywordManager(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Add custom keyword form */}
          <form onSubmit={handleAddKeyword} className="flex gap-2 mb-3">
            <input
              type="text"
              value={newKeywordInput}
              onChange={(e) => setNewKeywordInput(e.target.value)}
              placeholder="አዲስ የክትትል ቃል ጨምር (ለምሳሌ፡ ማጭበርበር፣ ተደብድቧል...)"
              className="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>አክል</span>
            </button>
          </form>

          {/* Active keywords chips */}
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            <span className="text-[11px] font-bold text-slate-400 self-center mr-1">ከፍተኛ (Critical):</span>
            {DEFAULT_CRITICAL_KEYWORDS.slice(0, 15).map(kw => (
              <span
                key={kw}
                className="inline-flex items-center text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-md"
              >
                {kw}
              </span>
            ))}
            {customKeywords.map(kw => (
              <span
                key={kw}
                className="inline-flex items-center gap-1 text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-300 px-2 py-0.5 rounded-md"
              >
                <span>⭐ {kw}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCustomKeyword(kw)}
                  className="hover:text-purple-950"
                  title="አስወግድ"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Severity Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSeverityFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              severityFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ሁሉም ({analyzedMatches.length})
          </button>
          <button
            type="button"
            onClick={() => setSeverityFilter('critical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              severityFilter === 'critical'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>ከፍተኛ ቅድሚያ ({stats.criticalCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setSeverityFilter('warning')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              severityFilter === 'warning'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>መካከለኛ ማስጠንቀቂያ ({stats.warningCount})</span>
          </button>
        </div>

        {/* Search and Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">ሁሉም የክትትል ሁኔታ</option>
            <option value="pending">🔴 ያልታዩ (Pending)</option>
            <option value="in_progress">🟡 በክትትል/ምርመራ ላይ</option>
            <option value="action_taken">🟢 እርምጃ ተወስዷል</option>
            <option value="escalated">🔵 ለከፍተኛ ኃላፊ የተመራ</option>
          </select>

          {/* Sub-City Filter */}
          {availableSubCities.length > 1 && (
            <select
              value={selectedSubCity}
              onChange={(e) => setSelectedSubCity(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">ሁሉም ክፍለ ከተሞች</option>
              {availableSubCities.map(sc => (
                <option key={sc} value={sc}>{sc}</option>
              ))}
            </select>
          )}

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="በቃል ወይም መግለጫ ፈልግ..."
              className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 w-44 sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              ምንም አስቸኳይ ማስጠንቀቂያ አልተገኘም
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              በተመረጠው መስፈርት መሰረት ከፍተኛ ቅድሚያ የሚሰጠው የጥሰት ቁልፍ ቃል የተገኘበት መረጃ የለም ወይም ሁሉም እርምጃ ተወስዶባቸዋል።
            </p>
          </div>
        ) : (
          filteredMatches.map(({ record, severity, matchedKeywords, reasons }) => {
            const intervention = interventions[record.id] || { status: 'pending', supervisorNote: '' };
            const currentNote = editingNotes[record.id] ?? (intervention.supervisorNote || '');
            const isCritical = severity === 'critical';

            // Highlight words in description
            const { segments } = highlightKeywordsInText(
              record.description || 'ምንም ዝርዝር መግለጫ አልተሰጠም',
              [...DEFAULT_CRITICAL_KEYWORDS, ...DEFAULT_WARNING_KEYWORDS, ...customKeywords]
            );

            return (
              <div
                key={record.id}
                className={`bg-white rounded-xl border transition-all shadow-xs overflow-hidden ${
                  isCritical
                    ? 'border-rose-300 ring-1 ring-rose-200/70 hover:border-rose-400'
                    : 'border-amber-300 ring-1 ring-amber-200/50 hover:border-amber-400'
                }`}
              >
                {/* Top Banner with Alert Badges */}
                <div
                  className={`px-4 py-2.5 flex items-center justify-between border-b ${
                    isCritical
                      ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                      : 'bg-amber-50/80 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        isCritical
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-amber-500 text-slate-950 font-bold'
                      }`}
                    >
                      {isCritical ? '🚨 ከፍተኛ ቅድሚያ ማስጠንቀቂያ' : '⚠️ መካከለኛ ማስጠንቀቂያ'}
                    </span>

                    <span className="text-xs font-bold text-slate-800 bg-white/80 px-2 py-0.5 rounded border border-slate-200/80">
                      ክፍለ ከተማ፡ {record.subCity}
                    </span>

                    <span className="text-xs text-slate-600 font-mono">
                      ተ.ቁ: #{record.orderNumber}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5">
                    {intervention.status === 'pending' && (
                      <span className="text-[11px] font-bold text-rose-700 bg-rose-100/90 border border-rose-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                        አዲስ ያልታየ (Action Needed)
                      </span>
                    )}
                    {intervention.status === 'in_progress' && (
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        በክትትል ላይ
                      </span>
                    )}
                    {intervention.status === 'action_taken' && (
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        እርምጃ ተወስዷል
                      </span>
                    )}
                    {intervention.status === 'escalated' && (
                      <span className="text-[11px] font-bold text-blue-800 bg-blue-100/90 border border-blue-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3 text-blue-600" />
                        ለከፍተኛ ኃላፊ የተመራ
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-5">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Left: Findings narrative and detected keywords (8 cols) */}
                    <div className="lg:col-span-7 space-y-3">
                      {/* Detected keywords pills */}
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          የተገኙ ከፍተኛ ቁልፍ ቃላት (Matched High-Priority Keywords):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {matchedKeywords.map((kw, i) => (
                            <span
                              key={i}
                              className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-md ${
                                isCritical
                                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                  : 'bg-amber-100 text-amber-950 border border-amber-300'
                              }`}
                            >
                              <span>🔍 {kw}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Highlighted Findings Narrative */}
                      <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3.5">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                          የግኝቱ ሙሉ መግለጫ (Finding Description):
                        </span>
                        <p className="text-sm font-medium text-slate-800 leading-relaxed">
                          {segments.map((seg, idx) =>
                            seg.isMatch ? (
                              <mark
                                key={idx}
                                className={`px-1.5 py-0.5 rounded font-extrabold mx-0.5 ${
                                  isCritical
                                    ? 'bg-rose-200 text-rose-950 border border-rose-400'
                                    : 'bg-amber-200 text-amber-950 border border-amber-400'
                                }`}
                              >
                                {seg.text}
                              </mark>
                            ) : (
                              <span key={idx}>{seg.text}</span>
                            )
                          )}
                        </p>
                      </div>

                      {/* Specific violation breakdown pills */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        <div className="bg-slate-100 p-2 rounded border border-slate-200">
                          <span className="text-slate-500 text-[10px] block">የተገኙ ግኝቶች</span>
                          <span className="font-bold text-slate-900">{record.totalFindingsCount}</span>
                        </div>
                        <div className="bg-slate-100 p-2 rounded border border-slate-200">
                          <span className="text-slate-500 text-[10px] block">ስርቆት/ተዛማጅ</span>
                          <span className={`font-bold ${record.theftOrRelated > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                            {record.theftOrRelated}
                          </span>
                        </div>
                        <div className="bg-slate-100 p-2 rounded border border-slate-200">
                          <span className="text-slate-500 text-[10px] block">ሌንስ መሸፈን</span>
                          <span className={`font-bold ${record.lensCovered > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                            {record.lensCovered}
                          </span>
                        </div>
                        <div className="bg-slate-100 p-2 rounded border border-slate-200">
                          <span className="text-slate-500 text-[10px] block">ዲሲፕሊን ክስ</span>
                          <span className={`font-bold ${record.disciplinaryCharge > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                            {record.disciplinaryCharge}
                          </span>
                        </div>
                        <div className="bg-slate-100 p-2 rounded border border-slate-200">
                          <span className="text-slate-500 text-[10px] block">ጽሁፍ/የመጨረሻ</span>
                          <span className="font-bold text-slate-900">
                            {record.writtenWarning + record.finalWarning}
                          </span>
                        </div>
                        <div className="bg-slate-100 p-2 rounded border border-slate-200">
                          <span className="text-slate-500 text-[10px] block">ባትሪ/እይታ ውጪ</span>
                          <span className="font-bold text-slate-900">
                            {record.batteryClosedEarly + record.outOfCameraView}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Supervisor Intervention Panel (5 cols) */}
                    <div className="lg:col-span-5 bg-amber-50/40 border border-amber-200/80 rounded-xl p-3.5 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <BookmarkCheck className="w-4 h-4 text-amber-700" />
                            <span>የሱፐርቫይዘር ጣልቃ-ገብነት (Intervention)</span>
                          </span>
                          {intervention.updatedAt && (
                            <span className="text-[10px] text-slate-500">
                              የተሻሻለው፡ {intervention.updatedAt}
                            </span>
                          )}
                        </div>

                        {/* Status Change Selector */}
                        <div className="mb-2.5">
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            የእርምጃ ሁኔታ ይወስኑ፡
                          </label>
                          <div className="grid grid-cols-2 gap-1.5 text-xs">
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(record.id, 'pending')}
                              className={`py-1.5 px-2 rounded font-semibold border text-center transition-all ${
                                intervention.status === 'pending'
                                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              🔴 ያልታየ
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(record.id, 'in_progress')}
                              className={`py-1.5 px-2 rounded font-semibold border text-center transition-all ${
                                intervention.status === 'in_progress'
                                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              🟡 በክትትል ላይ
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(record.id, 'action_taken')}
                              className={`py-1.5 px-2 rounded font-semibold border text-center transition-all ${
                                intervention.status === 'action_taken'
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              🟢 እርምጃ ተወሰደ
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(record.id, 'escalated')}
                              className={`py-1.5 px-2 rounded font-semibold border text-center transition-all ${
                                intervention.status === 'escalated'
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              🔵 ለኃላፊ ተመራ
                            </button>
                          </div>
                        </div>

                        {/* Supervisor Note Input */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            የሱፐርቫይዘር መመሪያ / የተወሰደ እርምጃ ማስታወሻ፡
                          </label>
                          <textarea
                            rows={2}
                            value={currentNote}
                            onChange={(e) => setEditingNotes({ ...editingNotes, [record.id]: e.target.value })}
                            placeholder="ለምሳሌ፡ ተቆጣጣሪው ቀርቦ እንዲያስረዳ ለወረዳው ኃላፊ መመሪያ ተሰጥቷል..."
                            className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
                          />
                          <div className="flex justify-end mt-1">
                            <button
                              type="button"
                              onClick={() => handleSaveNote(record.id)}
                              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-colors"
                            >
                              ማስታወሻ መዝግብ
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quick Action Footer */}
                      <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEditRecord(record)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                            <span>አርም</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteRecord(record.id)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                            title="ግኝቱን ሰርዝ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {onOpenTelegramAlert && (
                          <button
                            type="button"
                            onClick={() => onOpenTelegramAlert(record, { record, severity, matchedKeywords, reasons }, currentNote)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#24A1DE] hover:bg-[#1d86ba] text-white shadow-xs transition-colors"
                            title="ይህንን አስቸኳይ ግኝት በቴሌግራም ለአዛዥ ላክ"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>ለአዛዥ ላክ</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
