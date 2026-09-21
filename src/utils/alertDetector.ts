import { CameraFindingRecord } from '../types';

export interface AlertMatch {
  record: CameraFindingRecord;
  severity: 'critical' | 'warning';
  matchedKeywords: string[];
  reasons: string[];
}

export const DEFAULT_CRITICAL_KEYWORDS = [
  'ስርቆት',
  'ሙስና',
  'ጉቦ',
  'ክስ',
  'ዲሲፕሊን',
  'ሌንስ መሸፈን',
  'መሸፈን',
  'ተሸፍኖ',
  'ማጭበርበር',
  'መሰናክል',
  'ያለ ደረሰኝ',
  'ጉዳት',
  'አስቸኳይ',
  'ተደብድቧል',
  'ማጭበርበሪያ',
  'theft',
  'corruption',
  'bribe',
  'disciplinary',
  'charge',
  'fraud',
  'covered',
  'obstacle',
  'damage',
  'critical',
  'urgent'
];

export const DEFAULT_WARNING_KEYWORDS = [
  'ባትሪ',
  'ዘልሎ',
  'አቋርጦ',
  'ማቋረጥ',
  'እይታ ውጪ',
  'ከእይታ ውጪ',
  'ማስጠንቀቂያ',
  'ጥፋት',
  'ተቋርጦ',
  'ዘግይቶ',
  'battery',
  'skipped',
  'early',
  'out of view',
  'warning',
  'violation'
];

export function analyzeFindingAlert(
  record: CameraFindingRecord,
  customKeywords: string[] = []
): AlertMatch | null {
  const text = (record.description || '').toLowerCase();
  const matchedKeywords: string[] = [];
  const reasons: string[] = [];
  let isCritical = false;
  let isWarning = false;

  // 1. Metric-based Critical triggers
  if (record.theftOrRelated > 0) {
    isCritical = true;
    matchedKeywords.push('የስርቆት ጥሰት');
    reasons.push(`የስርቆት/ተዛማጅ ጥሰት ተመዝግቧል (${record.theftOrRelated})`);
  }
  if (record.disciplinaryCharge > 0) {
    isCritical = true;
    matchedKeywords.push('በዲሲፕሊን ክስ');
    reasons.push(`በዲሲፕሊን ክስ የተመሰረተበት (${record.disciplinaryCharge})`);
  }
  if (record.finalWarning > 0) {
    isCritical = true;
    matchedKeywords.push('የመጨረሻ ማስጠንቀቂያ');
    reasons.push(`የመጨረሻ ማስጠንቀቂያ የተሰጠበት (${record.finalWarning})`);
  }

  // 2. Metric-based Warning triggers
  if (record.lensCovered > 0) {
    isCritical = true; // Lens covering is critical intervention
    matchedKeywords.push('ሌንስ መሸፈን');
    reasons.push(`ካሜራ ሌንስ መሸፈን (${record.lensCovered})`);
  }
  if (record.batteryClosedEarly > 0) {
    isWarning = true;
    matchedKeywords.push('ባትሪ ሳይጨርስ መዝጋት');
    reasons.push(`ባትሪ ሳይጨርስ ካሜራ መዝጋት (${record.batteryClosedEarly})`);
  }
  if (record.earlyReturn > 0) {
    isWarning = true;
    matchedKeywords.push('ስራ አቋርጦ መመለስ');
    reasons.push(`ስራ አቋርጦ መመለስ (${record.earlyReturn})`);
  }
  if (record.outOfCameraView > 0) {
    isWarning = true;
    matchedKeywords.push('ከካሜራ እይታ ውጪ');
    reasons.push(`ከካሜራ እይታ ውጪ መሆን (${record.outOfCameraView})`);
  }
  if (record.skippedShopInspection > 0) {
    isWarning = true;
    matchedKeywords.push('ንግድ ቤት ዘልሎ');
    reasons.push(`ንግድ ቤት ዘልሎ ቁጥጥር ማከናወን (${record.skippedShopInspection})`);
  }

  // 3. Keyword matching in 'description' (findings narrative)
  const allCriticalWords = [...DEFAULT_CRITICAL_KEYWORDS, ...customKeywords];
  allCriticalWords.forEach(kw => {
    if (kw.trim() && text.includes(kw.toLowerCase().trim())) {
      isCritical = true;
      if (!matchedKeywords.includes(kw)) {
        matchedKeywords.push(kw);
      }
      reasons.push(`በግኝቱ መግለጫ ውስጥ ከፍተኛ ቁልፍ ቃል ተገኝቷል፦ "${kw}"`);
    }
  });

  const allWarningWords = DEFAULT_WARNING_KEYWORDS;
  allWarningWords.forEach(kw => {
    if (kw.trim() && text.includes(kw.toLowerCase().trim())) {
      isWarning = true;
      if (!matchedKeywords.includes(kw)) {
        matchedKeywords.push(kw);
      }
      reasons.push(`በግኝቱ መግለጫ ውስጥ የማስጠንቀቂያ ቃል ተገኝቷል፦ "${kw}"`);
    }
  });

  if (!isCritical && !isWarning) {
    return null;
  }

  return {
    record,
    severity: isCritical ? 'critical' : 'warning',
    matchedKeywords: Array.from(new Set(matchedKeywords)),
    reasons: Array.from(new Set(reasons))
  };
}

export function highlightKeywordsInText(
  text: string,
  keywords: string[]
): { highlighted: boolean; segments: { text: string; isMatch: boolean }[] } {
  if (!text || keywords.length === 0) {
    return { highlighted: false, segments: [{ text, isMatch: false }] };
  }

  const validKeywords = keywords
    .map(k => k.trim())
    .filter(k => k.length > 0)
    .sort((a, b) => b.length - a.length);

  if (validKeywords.length === 0) {
    return { highlighted: false, segments: [{ text, isMatch: false }] };
  }

  // Build regex safely escaping special characters
  const escaped = validKeywords
    .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  try {
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    const segments = parts.map(part => ({
      text: part,
      isMatch: validKeywords.some(k => k.toLowerCase() === part.toLowerCase())
    }));

    return {
      highlighted: segments.some(s => s.isMatch),
      segments
    };
  } catch {
    return { highlighted: false, segments: [{ text, isMatch: false }] };
  }
}
