export interface SubCityInfo {
  id: string;
  name: string;
  code: string;
  type: 'sub_city' | 'special_branch';
  woredas: string[];
  majorLocations: string[];
  description?: string;
}

export const ALL_SUB_CITIES: SubCityInfo[] = [
  {
    id: 'mercato-1',
    name: 'መርካቶ ቁጥር 1',
    code: 'MERC-1',
    type: 'special_branch',
    description: 'የአዲስ አበባ ገቢዎች ቢሮ የመርካቶ ቁጥር 1 ልዩ የግብር ማዕከል / ቅርንጫፍ',
    woredas: [
      'ወረዳ 01',
      'ወረዳ 02',
      'ወረዳ 03',
      'ወረዳ 04',
      'ወረዳ 05',
      'ወረዳ 06',
      'ወረዳ 07'
    ],
    majorLocations: [
      'አሜሪካን ግቢ',
      'አውቶቡስ ተራ',
      'ተክለሃይማኖት',
      'ሸማ ተራ',
      'በርበሬ ተራ',
      'ቅቤ ተራ',
      'ሚሊተሪ ተራ',
      'ጎጃም በረንዳ',
      'ዱባይ ተራ',
      'ጣና ገበያ',
      'ቦምብ ተራ',
      'አባኮራን',
      'መሳለሚያ'
    ]
  },
  {
    id: 'mercato-2',
    name: 'መርካቶ ቁጥር 2',
    code: 'MERC-2',
    type: 'special_branch',
    description: 'የአዲስ አበባ ገቢዎች ቢሮ የመርካቶ ቁጥር 2 ልዩ የግብር ማዕከል / ቅርንጫፍ',
    woredas: [
      'ወረዳ 08',
      'ወረዳ 09',
      'ወረዳ 10',
      'ወረዳ 11',
      'ወረዳ 12',
      'ወረዳ 13',
      'ወረዳ 14'
    ],
    majorLocations: [
      'ራስ ደስታ',
      'ሰባተኛ',
      'ሸገር አዲስ ከተማ',
      'ጊዮርጊስ ኬላ',
      'ኮልፌ መገንጠያ',
      'አምስተኛ',
      'ሾማ',
      'ሸጎሌ መግቢያ',
      'ፓውሎስ ሆስፒታል',
      'አባነፍሶ',
      'ሸዋ በር',
      'አዲሱ ገበያ መስመር'
    ]
  },
  {
    id: 'kirkos',
    name: 'ቂርቆስ',
    code: 'KRK',
    type: 'sub_city',
    description: 'ቂርቆስ ክፍለ ከተማ',
    woredas: [
      'ወረዳ 01',
      'ወረዳ 02',
      'ወረዳ 03',
      'ወረዳ 04',
      'ወረዳ 05',
      'ወረዳ 06',
      'ወረዳ 07',
      'ወረዳ 08',
      'ወረዳ 09',
      'ወረዳ 10',
      'ወረዳ 11'
    ],
    majorLocations: [
      'ካዛንቺስ',
      'ጎተራ',
      'ሜክሲኮ',
      'ቄራ',
      'መስቀል አደባባይ',
      'ወሎ ሰፈር',
      'ኦሊምፒያ',
      'ቤተመንግስት አካባቢ'
    ]
  },
  {
    id: 'yeka',
    name: 'የካ',
    code: 'YEK',
    type: 'sub_city',
    description: 'የካ ክፍለ ከተማ',
    woredas: [
      'ወረዳ 01',
      'ወረዳ 02',
      'ወረዳ 03',
      'ወረዳ 04',
      'ወረዳ 05',
      'ወረዳ 06',
      'ወረዳ 07',
      'ወረዳ 08',
      'ወረዳ 09',
      'ወረዳ 10',
      'ወረዳ 11',
      'ወረዳ 12',
      'ወረዳ 13',
      'ወረዳ 14'
    ],
    majorLocations: [
      'መገናኛ',
      'ካረቴ',
      'ኮተቤ',
      'ፈረንሳይ ለጋሲዮን',
      'የካ ሚካኤል',
      'ሲ ኤም ሲ',
      'አያት መግቢያ'
    ]
  },
  {
    id: 'bole',
    name: 'ቦሌ',
    code: 'BOL',
    type: 'sub_city',
    description: 'ቦሌ ክፍለ ከተማ',
    woredas: [
      'ወረዳ 01',
      'ወረዳ 02',
      'ወረዳ 03',
      'ወረዳ 04',
      'ወረዳ 05',
      'ወረዳ 06',
      'ወረዳ 07',
      'ወረዳ 08',
      'ወረዳ 09',
      'ወረዳ 10',
      'ወረዳ 11',
      'ወረዳ 12',
      'ወረዳ 13',
      'ወረዳ 14',
      'ወረዳ 15'
    ],
    majorLocations: [
      'ቦሌ መድኃኒዓለም',
      'ቦሌ ሚካኤል',
      'ሩዋንዳ',
      'ገርጂ',
      'ጃፓን',
      'አትላስ',
      'ሃያ ሁለት',
      'ቡልቡላ'
    ]
  },
  {
    id: 'addis-ketema',
    name: 'አዲስ ከተማ',
    code: 'ADK',
    type: 'sub_city',
    description: 'አዲስ ከተማ ክፍለ ከተማ',
    woredas: [
      'ወረዳ 01',
      'ወረዳ 02',
      'ወረዳ 03',
      'ወረዳ 04',
      'ወረዳ 05',
      'ወረዳ 06',
      'ወረዳ 07',
      'ወረዳ 08',
      'ወረዳ 09',
      'ወረዳ 10',
      'ወረዳ 11',
      'ወረዳ 12',
      'ወረዳ 13',
      'ወረዳ 14'
    ],
    majorLocations: [
      'መርካቶ',
      'አውቶቡስ ተራ',
      'አባኮራን',
      'ሰባተኛ',
      'ራስ ደስታ',
      'አሜሪካን ግቢ'
    ]
  },
  {
    id: 'arada',
    name: 'አራዳ',
    code: 'ARD',
    type: 'sub_city',
    description: 'አራዳ ክፍለ ከተማ',
    woredas: [
      'ወረዳ 01',
      'ወረዳ 02',
      'ወረዳ 03',
      'ወረዳ 04',
      'ወረዳ 05',
      'ወረዳ 06',
      'ወረዳ 07',
      'ወረዳ 08',
      'ወረዳ 09',
      'ወረዳ 10'
    ],
    majorLocations: [
      'ፒያሳ',
      'ቸርችል ጎዳና',
      'አራት ኪሎ',
      'ስድስት ኪሎ',
      'ኤሪትሪያ ኤምባሲ አካባቢ',
      'ሰባራ ባቡር'
    ]
  },
  {
    id: 'lideta',
    name: 'ልደታ',
    code: 'LID',
    type: 'sub_city',
    description: 'ልደታ ክፍለ ከተማ',
    woredas: [
      'ወረዳ 01',
      'ወረዳ 02',
      'ወረዳ 03',
      'ወረዳ 04',
      'ወረዳ 05',
      'ወረዳ 06',
      'ወረዳ 07',
      'ወረዳ 08',
      'ወረዳ 09',
      'ወረዳ 10'
    ],
    majorLocations: [
      'ልደታ ቤተክርስቲያን አካባቢ',
      'ባልቻ አደባባይ',
      'ዳርማር',
      'አብነት',
      'ኮካ',
      'ጦር ኃይሎች'
    ]
  },
  {
    id: 'gulele',
    name: 'ጉለሌ',
    code: 'GUL',
    type: 'sub_city',
    description: 'ጉለሌ ክፍለ ከተማ',
    woredas: [
      'ወረዳ 01',
      'ወረዳ 02',
      'ወረዳ 03',
      'ወረዳ 04',
      'ወረዳ 05',
      'ወረዳ 06',
      'ወረዳ 07',
      'ወረዳ 08',
      'ወረዳ 09',
      'ወረዳ 10',
      'ወረዳ 11'
    ],
    majorLocations: [
      'ሽሮ ሜዳ',
      'አዲሱ ገበያ',
      'ሩፋኤል',
      'ሸጎሌ',
      'እንጦጦ',
      'ፒኮክ/ጉለሌ'
    ]
  },
  {
    id: 'nifas-silk-lafto',
    name: 'ንፋስ ስልክ ላፍቶ',
    code: 'NSL',
    type: 'sub_city',
    description: 'ንፋስ ስልክ ላፍቶ ክፍለ ከተማ',
    woredas: [
      'ወረዳ 01',
      'ወረዳ 02',
      'ወረዳ 03',
      'ወረዳ 04',
      'ወረዳ 05',
      'ወረዳ 06',
      'ወረዳ 07',
      'ወረዳ 08',
      'ወረዳ 09',
      'ወረዳ 10',
      'ወረዳ 11',
      'ወረዳ 12',
      'ወረዳ 13',
      'ወረዳ 14',
      'ወረዳ 15'
    ],
    majorLocations: [
      'ሳሪስ',
      'ጎፋ',
      'ጀሞ',
      'ላፍቶ',
      'መካኒሳ',
      'ለቡ',
      'ሀና ማሪያም'
    ]
  },
  {
    id: 'kolfe-keranio',
    name: 'ኮልፌ ቀራኒዮ',
    code: 'KLF',
    type: 'sub_city',
    description: 'ኮልፌ ቀራኒዮ ክፍለ ከተማ',
    woredas: [
      'ወረዳ 01',
      'ወረዳ 02',
      'ወረዳ 03',
      'ወረዳ 04',
      'ወረዳ 05',
      'ወረዳ 06',
      'ወረዳ 07',
      'ወረዳ 08',
      'ወረዳ 09',
      'ወረዳ 10',
      'ወረዳ 11',
      'ወረዳ 12',
      'ወረዳ 13',
      'ወረዳ 14',
      'ወረዳ 15'
    ],
    majorLocations: [
      'ቶታል',
      'አየር ጤና',
      'ጦር ኃይሎች',
      'አስኮ',
      'ቀራኒዮ',
      'ዘነበወርቅ',
      'ሉቃስ'
    ]
  },
  {
    id: 'akaki-kality',
    name: 'አቃቂ ቃሊቲ',
    code: 'AKK',
    type: 'sub_city',
    description: 'አቃቂ ቃሊቲ ክፍለ ከተማ',
    woredas: [
      'ወረዳ 01',
      'ወረዳ 02',
      'ወረዳ 03',
      'ወረዳ 04',
      'ወረዳ 05',
      'ወረዳ 06',
      'ወረዳ 07',
      'ወረዳ 08',
      'ወረዳ 09',
      'ወረዳ 10',
      'ወረዳ 11',
      'ወረዳ 12',
      'ወረዳ 13'
    ],
    majorLocations: [
      'ቃሊቲ',
      'አቃቂ',
      'ቱሉ ዲምቱ',
      'ኮዬ ፈጬ',
      'ገላን',
      'ጉምሩክ አካባቢ'
    ]
  },
  {
    id: 'lemi-kura',
    name: 'ለሚ ኩራ',
    code: 'LMK',
    type: 'sub_city',
    description: 'ለሚ ኩራ ክፍለ ከተማ',
    woredas: [
      'ወረዳ 01',
      'ወረዳ 02',
      'ወረዳ 03',
      'ወረዳ 04',
      'ወረዳ 05',
      'ወረዳ 06',
      'ወረዳ 07',
      'ወረዳ 08',
      'ወረዳ 09',
      'ወረዳ 10',
      'ወረዳ 11',
      'ወረዳ 12',
      'ወረዳ 13',
      'ወረዳ 14'
    ],
    majorLocations: [
      'ሲ ኤም ሲ',
      'አያት',
      'ጎሮ',
      'ሰሚት',
      'ቦሌ አረብሳ',
      'ታይዋን ገበያ'
    ]
  }
];

export const SUB_CITY_NAMES: string[] = ALL_SUB_CITIES.map(sc => sc.name);

export function getSubCityInfo(nameOrId: string): SubCityInfo | undefined {
  return ALL_SUB_CITIES.find(
    sc => sc.name === nameOrId || sc.id === nameOrId || sc.code === nameOrId
  );
}

export function getWoredasForSubCity(subCityName: string): string[] {
  const found = getSubCityInfo(subCityName);
  if (found) {
    return found.woredas;
  }
  // Default fallback if a custom name is entered
  return Array.from({ length: 15 }, (_, i) => `ወረዳ ${String(i + 1).padStart(2, '0')}`);
}

export function getLocationsForSubCity(subCityName: string): string[] {
  const found = getSubCityInfo(subCityName);
  return found?.majorLocations || [];
}
