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
  AlertCircle
} from 'lucide-react';
import { ReportHeader, CameraUsageRecord, CameraFindingRecord, SpecialDeploymentRecord } from '../types';
import { generateTelegramReportText } from '../utils/telegramFormatter';

interface TelegramShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  header: ReportHeader;
  cameraUsage: CameraUsageRecord[];
  cameraFindings: CameraFindingRecord[];
  specialDeployments: SpecialDeploymentRecord[];
}

export const TelegramShareModal: React.FC<TelegramShareModalProps> = ({
  isOpen,
  onClose,
  header,
  cameraUsage,
  cameraFindings,
  specialDeployments
}) => {
  const [recipientHandle, setRecipientHandle] = useState<string>(() => {
    return localStorage.getItem('tg_recipient_handle') || '';
  });
  const [summaryOnly, setSummaryOnly] = useState<boolean>(false);
  const [includeInspectors, setIncludeInspectors] = useState<boolean>(true);
  const [customNote, setCustomNote] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Optional Bot API state
  const [showBotSettings, setShowBotSettings] = useState<boolean>(false);
  const [botToken, setBotToken] = useState<string>(() => localStorage.getItem('tg_bot_token') || '');
  const [botChatId, setBotChatId] = useState<string>(() => localStorage.getItem('tg_bot_chat_id') || '');
  const [isSendingBot, setIsSendingBot] = useState<boolean>(false);
  const [botStatus, setBotStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  useEffect(() => {
    if (recipientHandle) {
      localStorage.setItem('tg_recipient_handle', recipientHandle);
    }
  }, [recipientHandle]);

  // Generate the formatted message
  const messageText = generateTelegramReportText(header, cameraUsage, cameraFindings, specialDeployments, {
    summaryOnly,
    includeInspectorList: includeInspectors,
    customNote: customNote.trim() ? customNote.trim() : undefined
  });

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = messageText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendViaTelegram = () => {
    const encodedText = encodeURIComponent(messageText);
    const cleanUsername = recipientHandle.replace('@', '').trim();

    // If a clean username is provided, use Telegram direct message link or fallback to share URL
    let telegramUrl = '';
    if (cleanUsername) {
      telegramUrl = `https://t.me/${cleanUsername}?text=${encodedText}`;
    } else {
      telegramUrl = `https://t.me/share/url?text=${encodedText}`;
    }

    // Try window.open
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSendViaBot = async () => {
    if (!botToken.trim() || !botChatId.trim()) {
      setBotStatus({
        type: 'error',
        message: 'እባክዎ የቴሌግራም ቦት ቶከን (Bot Token) እና የቻት አይዲ (Chat ID) ያስገቡ።'
      });
      return;
    }

    // Persist credentials
    localStorage.setItem('tg_bot_token', botToken.trim());
    localStorage.setItem('tg_bot_chat_id', botChatId.trim());

    setIsSendingBot(true);
    setBotStatus({ type: 'idle', message: '' });

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken.trim()}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: botChatId.trim(),
          text: messageText
        })
      });

      const result = await response.json();

      if (result.ok) {
        setBotStatus({
          type: 'success',
          message: 'ሪፖርቱ በቴሌግራም ቦት አማካኝነት በተሳካ ሁኔታ ተልኳል!'
        });
      } else {
        setBotStatus({
          type: 'error',
          message: `መላክ አልተቻለም: ${result.description || 'የቦት መረጃዎችን ያረጋግጡ'}`
        });
      }
    } catch (err: any) {
      setBotStatus({
        type: 'error',
        message: `የግንኙነት ስህተት: ${err.message || 'አውታረመረብ ችግር'}`
      });
    } finally {
      setIsSendingBot(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#24A1DE] to-[#1d86ba] p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight">
                  ሪፖርት በቴሌግራም መላኪያ
                </h3>
                <span className="text-[10px] bg-white/20 font-semibold px-2 py-0.5 rounded-full">
                  Telegram Dispatch
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

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Recipient & Format Controls */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Telegram Username or Group */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#24A1DE]" />
                  <span>የተቀባይ የቴሌግራም ዩዘርኔም (አማራጭ)</span>
                </label>
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
                  ባዶ ከተዉ ቴሌግራም ሲከፈት ከተፈለገው ሰው ወይም ግሩፕ መምረጥ ይችላሉ።
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
                <span className="text-[10px] text-slate-500">ፈጣን ምርጫ:</span>
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

            <div className="bg-[#5682a3]/10 p-3.5 rounded-xl border border-[#24A1DE]/30 font-mono text-[11px] leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap select-all text-slate-800 shadow-inner">
              {messageText}
            </div>
          </div>

          {/* Optional Bot Direct Dispatch Settings */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowBotSettings(prev => !prev)}
              className="w-full px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 flex items-center justify-between text-slate-700 font-semibold text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#24A1DE]" />
                <span>የቴሌግራም ቦት ቀጥታ መላኪያ (Telegram Bot API - አማራጭ)</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showBotSettings ? 'rotate-180' : ''}`} />
            </button>

            {showBotSettings && (
              <div className="p-3.5 bg-slate-50 space-y-3 text-xs border-t border-slate-200">
                <p className="text-[11px] text-slate-500">
                  የቢሮውን ወይም የቡድኑን የቴሌግራም ቦት ቶከን (Bot Token) እና ቻት አይዲ (Chat ID) በማስገባት አንድ ጊዜ ክሊክ በማድረግ ብቻ ሪፖርቱን በቀጥታ ወደ ግሩፕ ወይም ቻናል መላክ ይቻላል።
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">የቦት ቶከን (Bot Token)</label>
                    <input
                      type="password"
                      value={botToken}
                      onChange={(e) => setBotToken(e.target.value)}
                      placeholder="123456789:ABCdefGhI..."
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">የቻት / ግሩፕ አይዲ (Chat ID)</label>
                    <input
                      type="text"
                      value={botChatId}
                      onChange={(e) => setBotChatId(e.target.value)}
                      placeholder="@channel_name ወይም -10012345678"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>

                {botStatus.message && (
                  <div
                    className={`p-2 rounded text-xs flex items-center gap-2 ${
                      botStatus.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
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

                <button
                  type="button"
                  onClick={handleSendViaBot}
                  disabled={isSendingBot}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors disabled:opacity-50"
                >
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isSendingBot ? 'በመላክ ላይ...' : 'በቦት አማካኝነት ላክ (Send via Bot)'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer with Primary Action Buttons */}
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

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              ዝጋ (Cancel)
            </button>

            <button
              type="button"
              onClick={handleSendViaTelegram}
              className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-[#24A1DE] hover:bg-[#1d86ba] text-white shadow-md hover:shadow-lg transition-all"
            >
              <Send className="w-4 h-4" />
              <span>በቴሌግራም ላክ (Send to Telegram)</span>
              <ExternalLink className="w-3 h-3 text-white/80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
