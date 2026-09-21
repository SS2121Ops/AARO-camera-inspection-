import React, { useState, useEffect } from 'react';
import {
  Send,
  Copy,
  Check,
  X,
  MessageSquare,
  Sparkles,
  Bot,
  User,
  Settings,
  ExternalLink,
  ChevronDown,
  AlertCircle,
  Smartphone,
  Globe,
  Radio,
  Bookmark,
  Share2,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { ReportHeader, CameraUsageRecord, CameraFindingRecord, SpecialDeploymentRecord } from '../types';
import { generateTelegramReportText } from '../utils/telegramFormatter';
import {
  launchTelegram,
  copyTextToClipboard,
  sendTelegramBotMessage,
  testTelegramBotConnection,
  DEFAULT_TELEGRAM_CONTACTS,
  TelegramSavedContact
} from '../utils/telegramLauncher';

interface TelegramShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  header: ReportHeader;
  cameraUsage: CameraUsageRecord[];
  cameraFindings: CameraFindingRecord[];
  specialDeployments: SpecialDeploymentRecord[];
  initialCustomNote?: string;
}

const STORAGE_SAVED_CONTACTS = 'tg_saved_contacts_v2';

export const TelegramShareModal: React.FC<TelegramShareModalProps> = ({
  isOpen,
  onClose,
  header,
  cameraUsage,
  cameraFindings,
  specialDeployments,
  initialCustomNote
}) => {
  // Method selection: 'app' (direct app deep link / web) vs 'bot' (direct API send)
  const [activeMethod, setActiveMethod] = useState<'app' | 'bot'>('app');

  const [recipientHandle, setRecipientHandle] = useState<string>(() => {
    return localStorage.getItem('tg_recipient_handle') || '';
  });
  const [summaryOnly, setSummaryOnly] = useState<boolean>(false);
  const [includeInspectors, setIncludeInspectors] = useState<boolean>(true);
  const [customNote, setCustomNote] = useState<string>(initialCustomNote || '');
  const [copied, setCopied] = useState<boolean>(false);
  const [appLaunched, setAppLaunched] = useState<boolean>(false);

  // Saved contacts
  const [contacts, setContacts] = useState<TelegramSavedContact[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SAVED_CONTACTS);
      return saved ? JSON.parse(saved) : DEFAULT_TELEGRAM_CONTACTS;
    } catch {
      return DEFAULT_TELEGRAM_CONTACTS;
    }
  });

  // Bot API state
  const [botToken, setBotToken] = useState<string>(() => localStorage.getItem('tg_bot_token') || '');
  const [botChatId, setBotChatId] = useState<string>(() => localStorage.getItem('tg_bot_chat_id') || '');
  const [isSendingBot, setIsSendingBot] = useState<boolean>(false);
  const [isTestingBot, setIsTestingBot] = useState<boolean>(false);
  const [botTestResult, setBotTestResult] = useState<string | null>(null);
  const [botStatus, setBotStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  useEffect(() => {
    if (recipientHandle) {
      localStorage.setItem('tg_recipient_handle', recipientHandle);
    }
  }, [recipientHandle]);

  useEffect(() => {
    localStorage.setItem(STORAGE_SAVED_CONTACTS, JSON.stringify(contacts));
  }, [contacts]);

  // Generate the formatted message
  const messageText = generateTelegramReportText(header, cameraUsage, cameraFindings, specialDeployments, {
    summaryOnly,
    includeInspectorList: includeInspectors,
    customNote: customNote.trim() ? customNote.trim() : undefined
  });

  if (!isOpen) return null;

  const handleCopy = async () => {
    const success = await copyTextToClipboard(messageText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Launch directly in Telegram Application (Desktop or Mobile)
  const handleLaunchTelegramApp = async () => {
    setAppLaunched(true);
    const result = await launchTelegram({
      text: messageText,
      username: recipientHandle,
      mode: 'app',
      autoCopy: true
    });

    if (result.copied) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }

    setTimeout(() => setAppLaunched(false), 4000);
  };

  // Launch in Telegram Web (Browser)
  const handleLaunchTelegramWeb = async () => {
    await launchTelegram({
      text: messageText,
      username: recipientHandle,
      mode: 'web',
      autoCopy: true
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Test Bot Connection
  const handleTestBot = async () => {
    setIsTestingBot(true);
    setBotTestResult(null);
    setBotStatus({ type: 'idle', message: '' });

    const result = await testTelegramBotConnection(botToken);
    setIsTestingBot(false);

    if (result.ok) {
      setBotTestResult(`✅ ግንኙነቱ ተሳክቷል! ቦት ስም፡ ${result.botName} (@${result.username})`);
    } else {
      setBotTestResult(`❌ ግንኙነት አልተሳካም፦ ${result.error}`);
    }
  };

  // Send directly via Telegram Bot API
  const handleSendViaBot = async () => {
    if (!botToken.trim() || !botChatId.trim()) {
      setBotStatus({
        type: 'error',
        message: 'እባክዎ የቴሌግራም ቦት ቶከን (Bot Token) እና የቻት/ግሩፕ አይዲ (Chat ID) ያስገቡ።'
      });
      return;
    }

    // Persist credentials
    localStorage.setItem('tg_bot_token', botToken.trim());
    localStorage.setItem('tg_bot_chat_id', botChatId.trim());

    setIsSendingBot(true);
    setBotStatus({ type: 'idle', message: '' });

    const result = await sendTelegramBotMessage(botToken, botChatId, messageText);
    setIsSendingBot(false);

    if (result.ok) {
      setBotStatus({
        type: 'success',
        message: result.message
      });
    } else {
      setBotStatus({
        type: 'error',
        message: result.message
      });
    }
  };

  const handleSaveCurrentContact = () => {
    if (!recipientHandle.trim()) return;
    const clean = recipientHandle.replace(/^@+/, '').trim();
    if (!contacts.some(c => c.handle.toLowerCase() === clean.toLowerCase())) {
      setContacts(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          label: clean,
          handle: clean,
          role: 'Custom'
        }
      ]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#24A1DE] via-[#1d86ba] to-[#176b94] p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight">
                  የቴሌግራም ሪፖርት መላኪያ ማዕከል
                </h3>
                <span className="text-[10px] bg-white/20 font-semibold px-2 py-0.5 rounded-full">
                  Direct Telegram Dispatch
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                {header.subCity} • {header.dateEth} • ተቀባይ፡ {header.reportReceiverName || 'ያልተገለጸ'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Method Switcher Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2.5 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveMethod('app')}
            className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeMethod === 'app'
                ? 'border-[#24A1DE] text-[#24A1DE]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>በቴሌግራም መተግበሪያ (Telegram App)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMethod('bot')}
            className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
              activeMethod === 'bot'
                ? 'border-[#24A1DE] text-[#24A1DE]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bot className="w-4 h-4 text-amber-600" />
            <span>በቴሌግራም ቦት በቀጥታ መላኪያ (Bot API Dispatch)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Method 1: Direct Telegram Application Launch */}
          {activeMethod === 'app' && (
            <div className="space-y-4">
              {/* Direct App Launch Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-[#24A1DE] text-white shrink-0 mt-0.5 sm:mt-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      ቀጥታ የቴሌግራም መተግበሪያ ግንኙነት (Telegram Native Deep Link)
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      "በቴሌግራም መተግበሪያ ክፈት" ሲጫኑ በኮምፒውተርዎ ወይም በስልክዎ ላይ የተጫነው የቴሌግራም መተግበሪያ ወዲያውኑ ተከፍቶ ሪፖርቱን በቅድመ-ዝግጅት ያቀርብልዎታል።
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={handleLaunchTelegramApp}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-[#24A1DE] hover:bg-[#1d86ba] text-white shadow-sm transition-all"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>በቴሌግራም አፕ ክፈት</span>
                  </button>
                </div>
              </div>

              {/* Recipient & Format Controls */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Telegram Username or Group */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#24A1DE]" />
                        <span>የተቀባይ የቴሌግራም ዩዘርኔም (አማራጭ)</span>
                      </label>
                      {recipientHandle && (
                        <button
                          type="button"
                          onClick={handleSaveCurrentContact}
                          className="text-[10px] text-blue-600 hover:underline font-semibold flex items-center gap-0.5"
                        >
                          <Bookmark className="w-2.5 h-2.5" />
                          <span>አስቀምጥ</span>
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                        @
                      </span>
                      <input
                        type="text"
                        value={recipientHandle.replace('@', '')}
                        onChange={(e) => setRecipientHandle(e.target.value.replace(/\s+/g, ''))}
                        placeholder="ለምሳሌ: girma_revenue ወይም ባዶ ይተዉ"
                        className="w-full pl-6 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#24A1DE] text-xs font-medium"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      ዩዘርኔም ካስገቡ የዚያ ሰው ቻት በቀጥታ ይከፈታል፤ ባዶ ከተዉ ቴሌግራም ሲከፈት ከተፈለገው ሰው ወይም ግሩፕ መምረጥ ይችላሉ።
                    </p>
                  </div>

                  {/* Format selection */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                      <span>የሪፖርት ቅርጸት (Format)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSummaryOnly(false)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                          !summaryOnly
                            ? 'bg-[#24A1DE] text-white border-[#24A1DE] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        ሙሉ ይፋዊ ሪፖርት
                      </button>
                      <button
                        type="button"
                        onClick={() => setSummaryOnly(true)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                          summaryOnly
                            ? 'bg-[#24A1DE] text-white border-[#24A1DE] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        አጭር ማጠቃለያ
                      </button>
                    </div>
                  </div>
                </div>

                {/* Checkboxes & Quick note */}
                <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  {!summaryOnly && (
                    <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={includeInspectors}
                        onChange={(e) => setIncludeInspectors(e.target.checked)}
                        className="rounded text-[#24A1DE] focus:ring-[#24A1DE]"
                      />
                      <span>የተቆጣጣሪዎችና ካሜራዎች ዝርዝር ይካተት</span>
                    </label>
                  )}

                  {/* Quick recipient shortcut buttons */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[10px] text-slate-500">ፈጣን ማስታወሻ:</span>
                    {['የስራ ሂደት አስተባባሪ', 'የክፍለ ከተማው ኃላፊ', 'ኦፕሬሽን ግሩፕ'].map(item => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          if (item === 'የስራ ሂደት አስተባባሪ' && header.reportReceiverName) {
                            setCustomNote(`ለክቡር ${header.reportReceiverName} የቀረበ ይፋዊ ሪፖርት።`);
                          } else {
                            setCustomNote(`ለ${item} የቀረበ የመስክ ቁጥጥር አፈጻጸም ሪፖርት።`);
                          }
                        }}
                        className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-1.5 py-0.5 rounded transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Note input */}
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">
                    ተጨማሪ ማስታወሻ / አስተያየት (አማራጭ)
                  </label>
                  <input
                    type="text"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="ለምሳሌ፡ ሪፖርቱን ተመልክተው እንዲያጸድቁ በአክብሮት ተልኳል..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#24A1DE] text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Method 2: Direct Telegram Bot API Dispatch */}
          {activeMethod === 'bot' && (
            <div className="space-y-3">
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-3">
                <div className="flex items-start gap-2">
                  <Bot className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      ቀጥታ የቦት መላኪያ (Telegram Bot API Direct Send)
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      የቢሮውን ወይም የቡድኑን የቴሌግራም ቦት በመጠቀም፣ ማንኛውንም መተግበሪያ መክፈት ሳያስፈልግ ሪፖርቱን በአንድ ክሊክ በቀጥታ ወደ ግሩፕ ወይም ቻናል መላክ ይቻላል።
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">የቦት ቶከን (Bot Token)</label>
                    <input
                      type="password"
                      value={botToken}
                      onChange={(e) => setBotToken(e.target.value)}
                      placeholder="123456789:ABCdefGhI..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">የቻት / ግሩፕ አይዲ (Chat ID)</label>
                    <input
                      type="text"
                      value={botChatId}
                      onChange={(e) => setBotChatId(e.target.value)}
                      placeholder="@channel_name ወይም -10012345678"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Test Connection Button & Result */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleTestBot}
                    disabled={isTestingBot || !botToken.trim()}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isTestingBot ? 'animate-spin' : ''}`} />
                    <span>{isTestingBot ? 'በመሞከር ላይ...' : 'ግንኙነት ፈትሽ (Test Connection)'}</span>
                  </button>
                  {botTestResult && (
                    <span className="text-[11px] font-semibold text-slate-700">
                      {botTestResult}
                    </span>
                  )}
                </div>

                {botStatus.message && (
                  <div
                    className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                      botStatus.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                        : 'bg-rose-50 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {botStatus.type === 'success' ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{botStatus.message}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Telegram Preview Screen */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                በቴሌግራም የሚላከው መልዕክት ቅድመ-እይታ (Message Preview)
              </span>
              <span className="text-[10px] text-slate-400">
                {messageText.length} ፊደላት
              </span>
            </div>

            <div className="bg-[#5682a3]/10 p-3.5 rounded-xl border border-[#24A1DE]/30 font-mono text-[11px] leading-relaxed max-h-52 overflow-y-auto whitespace-pre-wrap select-all text-slate-800 shadow-inner">
              {messageText}
            </div>
          </div>
        </div>

        {/* Modal Footer with Direct Actions */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>መልዕክቱ ተቀድቷል (Copied!)</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>መልዕክቱን ቅዳ (Copy Text)</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              ዝጋ (Cancel)
            </button>

            {activeMethod === 'app' ? (
              <>
                {/* Secondary Web Link */}
                <button
                  type="button"
                  onClick={handleLaunchTelegramWeb}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all"
                  title="በብራውዘር በኩል በቴሌግራም ዌብ ክፈት"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>በቴሌግራም ዌብ (Web)</span>
                </button>

                {/* Primary Direct Telegram App Launch Button */}
                <button
                  type="button"
                  onClick={handleLaunchTelegramApp}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-[#24A1DE] hover:bg-[#1d86ba] text-white shadow-md hover:shadow-lg transition-all"
                  title="የተጫነውን የቴሌግራም መተግበሪያ በቀጥታ ይከፍታል"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>በቴሌግራም መተግበሪያ ክፈት (Open App)</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleSendViaBot}
                disabled={isSendingBot}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Bot className="w-4 h-4" />
                <span>{isSendingBot ? 'በመላክ ላይ...' : 'በቦት በቀጥታ ላክ (Send via Bot)'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
