import { CameraUsageRecord, CameraFindingRecord, SpecialDeploymentRecord, ReportHeader } from '../types';

export function exportReportToCSV(
  header: ReportHeader,
  cameraUsage: CameraUsageRecord[],
  cameraFindings: CameraFindingRecord[],
  specialDeployments: SpecialDeploymentRecord[]
) {
  let csvContent = '\uFEFF'; // UTF-8 BOM for Excel Amharic support

  // Header
  csvContent += `"የአዲስ አበባ ገቢዎች ቢሮ በካሜራ የታገዘ የመስክ ቁጥጥር ስምሪት አፈጻጸም ሪፖርት - ${header.subCity} ክፍለ ከተማ"\n`;
  csvContent += `"የቁጥጥር ቀን:","${header.dateEth}","የሪፖርት ቀን:","${header.reportSubmissionDate || header.dateEth}","የሪፖርት ተቀባይ ስም:","${header.reportReceiverName || 'ያልተገለጸ'}","ፈረቃ:","${header.shift}","ቡድን:","${header.team}","የቁጥጥር አይነት:","${header.inspectionType}"\n\n`;

  // SECTION 1: Camera Usage
  csvContent += `"1. የካሜራ አጠቃቀም እና የመስክ ቁጥጥር ሪፖርት ቅጽ"\n`;
  csvContent += `"ተ.ቁ","የተቆጣጣሪው ስም","መለያ ቁጥር","የተመደቡበት ወረዳ","ልዩ ቦታ","ለስራ የወጣ ካሜራ መለያ ቁጥር","ካሜራ የወጣበት ሰዓት","ቁጥጥር የጀመረበት ሰዓት","ቁጥጥር ያበቃበት ሰዓት","የረፈደበት/የተቋረጠበት ሰዓት","ልዩ ስምሪት","ከሰዓት ፈረቃ","ቅሬታ ለማስረዳት","የካሜራ ብልሽት"\n`;

  cameraUsage.forEach((r, idx) => {
    csvContent += `"${idx + 1}","${r.inspectorName}","${r.badgeNumber}","${r.assignedWoreda}","${r.specificLocation}","${r.cameraId}","${r.cameraDeployTime}","${r.startTime}","${r.endTime}","${r.lateOrInterruptedDuration}","${r.reasonSpecialDeployment}","${r.reasonAfternoonShift}","${r.reasonComplaint}","${r.reasonCameraBreakdown}"\n`;
  });

  const uTotals = cameraUsage.reduce(
    (acc, c) => ({
      special: acc.special + (Number(c.reasonSpecialDeployment) || 0),
      afternoon: acc.afternoon + (Number(c.reasonAfternoonShift) || 0),
      complaint: acc.complaint + (Number(c.reasonComplaint) || 0),
      breakdown: acc.breakdown + (Number(c.reasonCameraBreakdown) || 0)
    }),
    { special: 0, afternoon: 0, complaint: 0, breakdown: 0 }
  );
  csvContent += `"ድምር","","","","","","","","","","${uTotals.special}","${uTotals.afternoon}","${uTotals.complaint}","${uTotals.breakdown}"\n\n`;

  // SECTION 2: Camera Findings
  csvContent += `"2. የካሜራ ግኝት (Camera Findings)"\n`;
  csvContent += `"ተ.ቁ","ክፍለ ከተማ","የተገኙ ግኝቶች ብዛት","ከካሜራ እይታ ውጪ መሆን","ባትሪ ሳይጨርስ መዝጋት","ስራ አቋርጦ መመለስ","ሌንስ መሸፈን","የስርቆት/ተዛማጅ ችግር","ንግድ ቤት ዘልሎ ቁጥጥር","የጥፋቱ አጭር መግለጫ","የቃል ማስጠንቀቂያ","የጽሁፍ ማስጠንቀቂያ","የመጨረሻ ማስጠንቀቂያ","በዲሲፕሊን ክስ"\n`;

  cameraFindings.forEach((r, idx) => {
    csvContent += `"${idx + 1}","${r.subCity}","${r.totalFindingsCount}","${r.outOfCameraView}","${r.batteryClosedEarly}","${r.earlyReturn}","${r.lensCovered}","${r.theftOrRelated}","${r.skippedShopInspection}","${r.description.replace(/"/g, '""')}","${r.verbalWarning}","${r.writtenWarning}","${r.finalWarning}","${r.disciplinaryCharge}"\n`;
  });

  const fTotals = cameraFindings.reduce(
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
    {
      total: 0, outOfView: 0, battery: 0, early: 0, lens: 0, theft: 0, skipped: 0,
      verbal: 0, written: 0, final: 0, charge: 0
    }
  );
  csvContent += `"ድምር","","${fTotals.total}","${fTotals.outOfView}","${fTotals.battery}","${fTotals.early}","${fTotals.lens}","${fTotals.theft}","${fTotals.skipped}","","${fTotals.verbal}","${fTotals.written}","${fTotals.final}","${fTotals.charge}"\n\n`;

  // SECTION 3: Special Deployment
  csvContent += `"3. የልዩ ስምሪት ሪፖርት ቅጽ"\n`;
  csvContent += `"ተ.ቁ","ክፍለ ከተማ","ልዩ ስምሪት የወጣ ቡድን","ለቁጥጥር የተሰጠ ግብር ከፋይ","የተወሰደ አስተዳደራዊ እርምጃ ብዛት","ያለ ደረሰኝ ግብይት","ምርመራ መዝገብ አለማስቀመጥ","ማስታወቂያ አለመለጠፍ / መዝገብ አለመያዝ","መረጃ ሳያገናኙ መጠቀም","መሰናክል መፍጠር","ቴክኒክ ምርመራ አለማድረግ","የእጅ በእጅ ደረሰኝ","ብልሸት አለማሳወቅ","ጉዳት ማድረስ","አድራሻ መለወጥ","ቫት አለመለቀቅ","የተቆጣጣሪ ሰራተኞች ስም"\n`;

  specialDeployments.forEach((r, idx) => {
    csvContent += `"${idx + 1}","${r.subCity}","${r.deployedTeam}","${r.taxpayersAssigned}","${r.administrativeMeasuresCount}","${r.noReceiptTransaction}","${r.noAuditRegister}","${r.noNoticeOrRegister}","${r.unlinkedUsage}","${r.creatingObstacle}","${r.noTechInspection}","${r.manualReceiptViolation}","${r.failureToReportBreakdown}","${r.causingDamage}","${r.addressChangeWithoutNotice}","${r.vatNotReleased}","${r.inspectorNames.replace(/"/g, '""')}"\n`;
  });

  const sTotals = specialDeployments.reduce(
    (acc, r) => ({
      taxpayers: acc.taxpayers + (Number(r.taxpayersAssigned) || 0),
      adminMeasures: acc.adminMeasures + (Number(r.administrativeMeasuresCount) || 0),
      noReceipt: acc.noReceipt + (Number(r.noReceiptTransaction) || 0),
      noAuditRegister: acc.noAuditRegister + (Number(r.noAuditRegister) || 0),
      noNoticeOrRegister: acc.noNoticeOrRegister + (Number(r.noNoticeOrRegister) || 0),
      unlinkedUsage: acc.unlinkedUsage + (Number(r.unlinkedUsage) || 0),
      creatingObstacle: acc.creatingObstacle + (Number(r.creatingObstacle) || 0),
      noTechInspection: acc.noTechInspection + (Number(r.noTechInspection) || 0),
      manualReceipt: acc.manualReceipt + (Number(r.manualReceiptViolation) || 0),
      failureToReportBreakdown: acc.failureToReportBreakdown + (Number(r.failureToReportBreakdown) || 0),
      causingDamage: acc.causingDamage + (Number(r.causingDamage) || 0),
      addressChange: acc.addressChange + (Number(r.addressChangeWithoutNotice) || 0),
      vatNotReleased: acc.vatNotReleased + (Number(r.vatNotReleased) || 0)
    }),
    {
      taxpayers: 0, adminMeasures: 0, noReceipt: 0, noAuditRegister: 0, noNoticeOrRegister: 0,
      unlinkedUsage: 0, creatingObstacle: 0, noTechInspection: 0, manualReceipt: 0,
      failureToReportBreakdown: 0, causingDamage: 0, addressChange: 0, vatNotReleased: 0
    }
  );

  csvContent += `"ድምር","","","${sTotals.taxpayers}","${sTotals.adminMeasures}","${sTotals.noReceipt}","${sTotals.noAuditRegister}","${sTotals.noNoticeOrRegister}","${sTotals.unlinkedUsage}","${sTotals.creatingObstacle}","${sTotals.noTechInspection}","${sTotals.manualReceipt}","${sTotals.failureToReportBreakdown}","${sTotals.causingDamage}","${sTotals.addressChange}","${sTotals.vatNotReleased}",""\n`;

  // Download Trigger
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `የአዲስ_አበባ_ገቢዎች_ቢሮ_በካሜራ_የታገዘ_የመስክ_ቁጥጥር_ስምሪት_አፈጻጸም_ሪፖርት_${header.subCity}_${header.dateEth.replace(/[^0-9]/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
