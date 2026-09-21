import { ReportHeader, CameraUsageRecord, CameraFindingRecord, SpecialDeploymentRecord } from '../types';

export interface TelegramFormatOptions {
  summaryOnly?: boolean;
  includeInspectorList?: boolean;
  customNote?: string;
}

export function generateTelegramReportText(
  header: ReportHeader,
  cameraUsage: CameraUsageRecord[],
  cameraFindings: CameraFindingRecord[],
  specialDeployments: SpecialDeploymentRecord[],
  options: TelegramFormatOptions = {}
): string {
  // Aggregate stats
  const totalInspectors = cameraUsage.length;
  
  const findingsTotals = cameraFindings.reduce(
    (acc, r) => ({
      total: acc.total + (Number(r.totalFindingsCount) || 0),
      outOfView: acc.outOfView + (Number(r.outOfCameraView) || 0),
      battery: acc.battery + (Number(r.batteryClosedEarly) || 0),
      early: acc.early + (Number(r.earlyReturn) || 0),
      lens: acc.lens + (Number(r.lensCovered) || 0),
      theft: acc.theft + (Number(r.theftOrRelated) || 0),
      skipped: acc.skipped + (Number(r.skippedShopInspection) || 0),
      verbal: acc.verbal + (Number(r.verbalWarning) || 0),
      written: acc.written + (Number(r.writtenWarning) || 0),
      final: acc.final + (Number(r.finalWarning) || 0),
      charge: acc.charge + (Number(r.disciplinaryCharge) || 0)
    }),
    { total: 0, outOfView: 0, battery: 0, early: 0, lens: 0, theft: 0, skipped: 0, verbal: 0, written: 0, final: 0, charge: 0 }
  );

  const specialTotals = specialDeployments.reduce(
    (acc, r) => ({
      taxpayers: acc.taxpayers + (Number(r.taxpayersAssigned) || 0),
      measures: acc.measures + (Number(r.administrativeMeasuresCount) || 0),
      noReceipt: acc.noReceipt + (Number(r.noReceiptTransaction) || 0),
      noAuditRegister: acc.noAuditRegister + (Number(r.noAuditRegister) || 0),
      noNotice: acc.noNotice + (Number(r.noNoticeOrRegister) || 0),
      unlinked: acc.unlinked + (Number(r.unlinkedUsage) || 0),
      manualReceipt: acc.manualReceipt + (Number(r.manualReceiptViolation) || 0),
      breakdown: acc.breakdown + (Number(r.failureToReportBreakdown) || 0)
    }),
    { taxpayers: 0, measures: 0, noReceipt: 0, noAuditRegister: 0, noNotice: 0, unlinked: 0, manualReceipt: 0, breakdown: 0 }
  );

  const lines: string[] = [];

  // 1. Header
  lines.push(`🏛️ የአዲስ አበባ ከተማ አስተዳደር ገቢዎች ቢሮ`);
  lines.push(`📋 ${header.reportTitle || 'በካሜራ የታገዘ የመስክ ቁጥጥር ስምሪት አፈጻጸም ሪፖርት'}`);
  lines.push(`────────────────────────────`);
  lines.push(`📍 ክፍለ ከተማ / ማዕከል: ${header.subCity}`);
  lines.push(`📅 የቁጥጥር ቀን: ${header.dateEth}`);
  lines.push(`🗓️ የሪፖርት ቀን: ${header.reportSubmissionDate || header.dateEth}`);
  lines.push(`👤 የሪፖርት ተቀባይ ስም: ${header.reportReceiverName || 'ያልተገለጸ'}`);
  lines.push(`⏰ ፈረቃ: ${header.shift}`);
  lines.push(`👥 የተመደበ ቡድን: ${header.team}`);
  lines.push(`🎯 የቁጥጥር አይነት: ${header.inspectionType}`);
  lines.push(``);

  // 2. High-level Summary
  lines.push(`📊 ዋና ዋና አፈጻጸም ማጠቃለያ (Key Figures):`);
  lines.push(`• 📹 የተሰማሩ የመስክ ተቆጣጣሪዎች/ካሜራዎች: ${totalInspectors} ተመዝግበዋል`);
  lines.push(`• 🔍 የተገኙ የካሜራ ግኝቶች ድምር: ${findingsTotals.total}`);
  lines.push(`• 🏬 የተጎበኙ ግብር ከፋዮች (ልዩ ስምሪት): ${specialTotals.taxpayers}`);
  lines.push(`• ⚖️ የተወሰዱ አስተዳደራዊ እርምጃዎች ድምር: ${specialTotals.measures}`);
  lines.push(``);

  if (options.summaryOnly) {
    if (options.customNote) {
      lines.push(`📝 ማስታወሻ / አስተያየት:`);
      lines.push(`${options.customNote}`);
      lines.push(``);
    }
    lines.push(`────────────────────────────`);
    lines.push(`ይህ አጭር የስራ አስፈፃሚ ሪፖርት የተላከው በቀጥታ ከገቢዎች ቢሮ የመስክ ካሜራ ቁጥጥር ሲስተም ነው።`);
    return lines.join('\n');
  }

  // 3. Section 1 Highlights: Camera Usage
  lines.push(`1️⃣ የካሜራ አጠቃቀምና የመስክ ስምሪት:`);
  if (cameraUsage.length === 0) {
    lines.push(`  (ምንም የተመዘገበ የካሜራ መረጃ የለም)`);
  } else {
    lines.push(`• ጠቅላላ ተቆጣጣሪዎች: ${cameraUsage.length}`);
    const activeWoredas = Array.from(new Set(cameraUsage.map(c => c.assignedWoreda).filter(Boolean)));
    lines.push(`• የተሸፈኑ ወረዳዎች: ${activeWoredas.join(', ') || 'ያልተገለጸ'}`);
    
    if (options.includeInspectorList) {
      lines.push(`\n📋 የተቆጣጣሪዎችና ካሜራዎች ዝርዝር:`);
      cameraUsage.slice(0, 15).forEach((c, i) => {
        const names = [c.inspectorName, c.inspectorName2, c.inspectorName3].filter(Boolean).join(', ');
        lines.push(`  ${i + 1}. ${names} (${c.assignedWoreda || 'ወረዳ'}) | ካሜራ: ${c.cameraId} | ሰዓት: ${c.startTime}-${c.endTime}`);
      });
      if (cameraUsage.length > 15) {
        lines.push(`  ... እና ተጨማሪ ${cameraUsage.length - 15} ተቆጣጣሪዎች`);
      }
    }
  }
  lines.push(``);

  // 4. Section 2 Highlights: Camera Findings
  lines.push(`2️⃣ የካሜራ ግኝቶች (Camera Findings):`);
  lines.push(`• ጠቅላላ ግኝቶች: ${findingsTotals.total}`);
  lines.push(`• ከካሜራ እይታ ውጪ መሆን: ${findingsTotals.outOfView}`);
  lines.push(`• ባትሪ ሳይጨርስ መዝጋት: ${findingsTotals.battery}`);
  lines.push(`• ስራ አቋርጦ መመለስ: ${findingsTotals.early}`);
  lines.push(`• ሌንስ መሸፈን: ${findingsTotals.lens}`);
  lines.push(`• ንግድ ቤት ዘልሎ ቁጥጥር: ${findingsTotals.skipped}`);
  lines.push(`• የተወሰዱ እርምጃዎች፡ የቃል ማስጠንቀቂያ (${findingsTotals.verbal})፣ የጽሁፍ (${findingsTotals.written})፣ የመጨረሻ (${findingsTotals.final})፣ በዲሲፕሊን ክስ (${findingsTotals.charge})`);
  lines.push(``);

  // 5. Section 3 Highlights: Special Deployment
  lines.push(`3️⃣ ልዩ ስምሪትና አስተዳደራዊ እርምጃዎች:`);
  lines.push(`• የተቆጣጠሩ ግብር ከፋዮች: ${specialTotals.taxpayers}`);
  lines.push(`• የተወሰደ አስተዳደራዊ እርምጃ: ${specialTotals.measures}`);
  lines.push(`• ደረሰኝ ያለመስጠት ጥሰት: ${specialTotals.noReceipt}`);
  lines.push(`• የሽያጭ መመዝገቢያ መረጃ አለመያዝ: ${specialTotals.noAuditRegister}`);
  lines.push(`• ማስጠንቀቂያ/ማስታወቂያ አለመለጠፍ: ${specialTotals.noNotice}`);
  lines.push(`• ያልተሳሰረ የሽያጭ መመዝገቢያ አጠቃቀም: ${specialTotals.unlinked}`);
  lines.push(`• በእጅ ደረሰኝ አጠቃቀም ጥሰት: ${specialTotals.manualReceipt}`);
  lines.push(``);

  if (options.customNote) {
    lines.push(`📝 ማስታወሻ / ተጨማሪ መመሪያ:`);
    lines.push(`${options.customNote}`);
    lines.push(``);
  }

  lines.push(`────────────────────────────`);
  lines.push(`✅ ሪፖርቱን ያዘጋጀው ባለሙያ: የተረጋገጠ`);
  lines.push(`✅ ያጸደቀው የስራ ሂደት አስተባባሪ: ${header.reportReceiverName || 'ለማረጋገጥ የቀረበ'}`);
  lines.push(`🌐 የተላከው ከይፋዊ የገቢዎች ቢሮ የመስክ ካሜራ ቁጥጥር ሲስተም`);

  return lines.join('\n');
}
