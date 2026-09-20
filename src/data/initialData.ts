import { CameraUsageRecord, CameraFindingRecord, SpecialDeploymentRecord, ReportHeader } from '../types';

export const initialHeader: ReportHeader = {
  subCity: 'ቂርቆስ',
  officeName: 'የአዲስ አበባ ገቢዎች ቢሮ',
  reportTitle: 'የአዲስ አበባ ገቢዎች ቢሮ በካሜራ የታገዘ የመስክ ቁጥጥር ስምሪት አፈጻጸም ሪፖርት',
  dateEth: '28/12/2018 ዓ.ም',
  reportSubmissionDate: '28/12/2018 ዓ.ም',
  reportReceiverName: 'አቶ ግርማ ወ/ማርያም (የስራ ሂደት አስተባባሪ)',
  shift: 'የጠዋት ፈረቃ (02:30 - 10:30)',
  team: 'ቡድን 1 እና ቡድን 2',
  inspectionType: 'በካሜራ የታገዘ የመስክ ቁጥጥር ወይም የልዩ ስምሪት'
};

export const initialCameraUsageRecords: CameraUsageRecord[] = [
  {
    id: 'cam-row-1',
    orderNumber: 1,
    inspectorName: 'አበበ ተፈራ እና ስለሺ ከበደ',
    badgeNumber: 'REV-0492',
    assignedWoreda: 'ወረዳ 01',
    specificLocation: 'ካዛንቺስ - ቶታል አካባቢ',
    cameraId: 'CAM-001',
    cameraDeployTime: '02:30',
    startTime: '02:45',
    endTime: '10:30',
    lateOrInterruptedDuration: '0',
    reasonSpecialDeployment: 0,
    reasonAfternoonShift: 0,
    reasonComplaint: 0,
    reasonCameraBreakdown: 0,
    remark: 'መደበኛ የመስክ ቁጥጥር ተከናውኗል'
  },
  {
    id: 'cam-row-2',
    orderNumber: 2,
    inspectorName: 'ሰለሞን ታደሰ እና አልማዝ በቀለ',
    badgeNumber: 'REV-0588',
    assignedWoreda: 'ወረዳ 02',
    specificLocation: 'ጎተራ - ቴሌ ፊትለፊት',
    cameraId: 'CAM-002',
    cameraDeployTime: '02:30',
    startTime: '02:50',
    endTime: '10:30',
    lateOrInterruptedDuration: '0',
    reasonSpecialDeployment: 0,
    reasonAfternoonShift: 0,
    reasonComplaint: 0,
    reasonCameraBreakdown: 0,
    remark: 'ሙሉ ሰዓት ቁጥጥር ተጠናቋል'
  },
  {
    id: 'cam-row-3',
    orderNumber: 3,
    inspectorName: 'ዳዊት ግርማ እና ቤተልሔም አለሙ',
    badgeNumber: 'REV-0612',
    assignedWoreda: 'ወረዳ 03',
    specificLocation: 'ሜክሲኮ - ኬኬር ህንፃ አካባቢ',
    cameraId: 'CAM-003',
    cameraDeployTime: '02:30',
    startTime: '03:10',
    endTime: '10:30',
    lateOrInterruptedDuration: '00:40',
    reasonSpecialDeployment: 1,
    reasonAfternoonShift: 0,
    reasonComplaint: 0,
    reasonCameraBreakdown: 0,
    remark: 'በልዩ ስምሪት ምክንያት ለ40 ደቂቃ የመስክ ስራው ዘግይቷል'
  }
];

export const initialCameraFindingRecords: CameraFindingRecord[] = [
  {
    id: 'finding-row-1',
    orderNumber: 1,
    subCity: 'ቂርቆስ',
    totalFindingsCount: 2,
    outOfCameraView: 1,
    batteryClosedEarly: 0,
    earlyReturn: 0,
    lensCovered: 1,
    theftOrRelated: 0,
    skippedShopInspection: 0,
    description: 'በካሜራ እይታ ውጪ ለ15 ደቂቃ መሆን እና ሌንስ በስህተት ተሸፍኖ መቆየቱ ተረጋግጧል',
    verbalWarning: 1,
    writtenWarning: 1,
    finalWarning: 0,
    disciplinaryCharge: 0
  },
  {
    id: 'finding-row-2',
    orderNumber: 2,
    subCity: 'የካ',
    totalFindingsCount: 1,
    outOfCameraView: 0,
    batteryClosedEarly: 1,
    earlyReturn: 0,
    lensCovered: 0,
    theftOrRelated: 0,
    skippedShopInspection: 0,
    description: 'ባትሪ 40% እያለ ካሜራ ቀድሞ መጥፋቱ በቴክኒክ ክፍል ተረጋግጧል',
    verbalWarning: 1,
    writtenWarning: 0,
    finalWarning: 0,
    disciplinaryCharge: 0
  }
];

export const initialSpecialDeploymentRecords: SpecialDeploymentRecord[] = [
  {
    id: 'special-row-1',
    orderNumber: 1,
    subCity: 'ቂርቆስ',
    deployedTeam: 'ቡድን 1',
    taxpayersAssigned: 18,
    administrativeMeasuresCount: 4,
    noReceiptTransaction: 2,
    noAuditRegister: 1,
    noNoticeOrRegister: 1,
    unlinkedUsage: 0,
    creatingObstacle: 0,
    noTechInspection: 0,
    manualReceiptViolation: 0,
    failureToReportBreakdown: 0,
    causingDamage: 0,
    addressChangeWithoutNotice: 0,
    vatNotReleased: 0,
    inspectorNames: 'ተስፋዬ መንግስቱ፣ ብሩክ ገብሬ፣ የሺእመቤት ዳባ'
  },
  {
    id: 'special-row-2',
    orderNumber: 2,
    subCity: 'የካ',
    deployedTeam: 'ቡድን 2',
    taxpayersAssigned: 22,
    administrativeMeasuresCount: 5,
    noReceiptTransaction: 3,
    noAuditRegister: 0,
    noNoticeOrRegister: 0,
    unlinkedUsage: 1,
    creatingObstacle: 0,
    noTechInspection: 0,
    manualReceiptViolation: 1,
    failureToReportBreakdown: 0,
    causingDamage: 0,
    addressChangeWithoutNotice: 0,
    vatNotReleased: 0,
    inspectorNames: 'ዮናስ ሀይሌ፣ ሳራ አሰፋ፣ ሀብታሙ ጌታቸው'
  }
];
