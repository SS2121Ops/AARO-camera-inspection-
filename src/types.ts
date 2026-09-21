/**
 * Types for Kirkos & Yeka Sub-City Camera Usage & Special Deployment Inspection Report
 */

export interface ReportHeader {
  subCity: string; // ቂርቆስ / የካ
  officeName: string; // የገቢዎች ቢሮ
  reportTitle: string; // የመደበኛ እና የልዩ ስምሪት ቁጥጥር ሪፖርት
  dateEth: string; // የቁጥጥር ቀን (28/12/2018 ዓ.ም)
  reportSubmissionDate?: string; // የሪፖርት ቀን (28/12/2018 ዓ.ም)
  reportReceiverName?: string; // የሪፖርት ተቀባይ ስም
  shift: string; // የጠዋት / ከሰዓት / ሙሉ ቀን
  team: string; // ቡድን 1, ቡድን 2...
  inspectionType: string; // በካሜራ የታገዘ የመስክ ቁጥጥር ወይም የልዩ ስምሪት
}

// 1. የካሜራ አጠቃቀም እና የመስክ ቁጥጥር ሪፖርት ቅጽ
export interface CameraUsageRecord {
  id: string;
  orderNumber: number; // ተ.ቁ
  inspectorName: string; // የተቆጣጣሪው ስም (ተቆጣጣሪ 1)
  inspectorName2?: string; // ተጨማሪ ተቆጣጣሪ 2
  inspectorName3?: string; // ተጨማሪ ተቆጣጣሪ 3
  badgeNumber: string; // መለያ ቁጥር
  assignedWoreda: string; // የተመደቡበት ወረዳ (ወረዳ 01, ወረዳ 02...)
  specificLocation: string; // ልዩ ቦታ
  cameraId: string; // ለስራ የወጣ ካሜራ መለያ ቁጥር (CAM-001...)
  cameraDeployTime: string; // ካሜራ ለስራ የወጣበት ሰዓት (02:30)
  startTime: string; // ቁጥጥር የጀመረበት ሰዓት (02:45)
  endTime: string; // ቁጥጥር ያበቃበት ሰዓት (10:30)
  lateOrInterruptedDuration: string; // የረፈደበት/የተቋረጠበት ሰዓት
  // የረፈደበት እና/ወይም የተቋረጠበት ምክንያት
  reasonSpecialDeployment: number; // ልዩ ስምሪት
  reasonAfternoonShift: number; // ከሰዓት ፈረቃ
  reasonComplaint: number; // ቅሬታ ለማስረዳት
  reasonCameraBreakdown: number; // የካሜራ ብልሽት
  remark?: string; // ተጨማሪ አስተያየት
}

// 2. የካሜራ ግኝት (Camera Findings)
export interface CameraFindingRecord {
  id: string;
  orderNumber: number; // ተ.ቁ
  subCity: string; // ክፍለ ከተማ
  totalFindingsCount: number; // የተገኙ ግኝቶች ብዛት
  // የተገኙ ግኝቶች አይነት
  outOfCameraView: number; // ከካሜራ እይታ ውጪ መሆን
  batteryClosedEarly: number; // ባትሪ ሳይጨርስ መዝጋት
  earlyReturn: number; // ስራ አቋርጦ መመለስ
  lensCovered: number; // ሌንስ መሸፈን
  theftOrRelated: number; // የስርቆት/ተዛማጅ ችግር
  skippedShopInspection: number; // ንግድ ቤት ዘልሎ ቁጥጥር
  description: string; // የጥፋቱ አጭር መግለጫ
  // የተወሰደ እርምጃ አይነት
  verbalWarning: number; // የቃል ማስጠንቀቂያ
  writtenWarning: number; // የጽሁፍ ማስጠንቀቂያ
  finalWarning: number; // የመጨረሻ ማስጠንቀቂያ
  disciplinaryCharge: number; // በዲሲፕሊን ክስ
}

// 3. የልዩ ስምሪት ሪፖርት ቅጽ (Special Deployment Report)
export interface SpecialDeploymentRecord {
  id: string;
  orderNumber: number; // ተ.ቁ
  subCity: string; // ክፍለ ከተማ
  deployedTeam: string; // ልዩ ስምሪት የወጣ ቡድን (ቡድን 1, ቡድን 2)
  taxpayersAssigned: number; // ለቁጥጥር የተሰጠ ግብር ከፋይ
  administrativeMeasuresCount: number; // የተወሰደ አስተዳደራዊ እርምጃ ብዛት
  // የተወሰደ አስተዳደራዊ እርምጃ / የጥሰት አይነት
  noReceiptTransaction: number; // ያለ ደረሰኝ ግብይት
  noAuditRegister: number; // ምርመራ መዝገብ አለማስቀመጥ
  noNoticeOrRegister: number; // ማስታወቂያ አለመለጠፍ / መዝገብ አለመያዝ
  unlinkedUsage: number; // መረጃ ሳያገናኙ መጠቀም
  creatingObstacle: number; // መሰናክል መፍጠር
  noTechInspection: number; // ቴክኒክ ምርመራ አለማድረግ
  manualReceiptViolation: number; // የእጅ በእጅ ደረሰኝ
  failureToReportBreakdown: number; // ብልሸት አለማሳወቅ
  causingDamage: number; // ጉዳት ማድረስ
  addressChangeWithoutNotice: number; // አድራሻ መለወጥ
  vatNotReleased: number; // ቫት አለመለቀቅ
  inspectorNames: string; // የተቆጣጣሪ ሰራተኞች ስም
}

export type ActiveTab = 'all' | 'camera_usage' | 'camera_findings' | 'special_deployment' | 'analytics' | 'alerts';

export interface SupervisorIntervention {
  findingId: string;
  status: 'pending' | 'in_progress' | 'action_taken' | 'escalated';
  supervisorNote?: string;
  intervenedBy?: string;
  updatedAt?: string;
}
