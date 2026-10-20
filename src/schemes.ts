export type GroupId = 'farmer' | 'student' | 'woman' | 'olderAdult' | 'disability' | 'other';
export type Language = 'en' | 'hi';
export type MatchStatus = 'possible' | 'no_match' | 'need_info';
export type ApplicationType = 'fresh' | 'renewal';

export type SchemeDocument = {
  id: string;
  label: Record<Language, string>;
  category: 'fresh' | 'renewal' | 'both';
  fields: string[];
  isMandatory: boolean;
  sourceType?: 'current_portal' | 'dated_guidance';
  note?: Record<Language, string>;
};

export type BenefitItem = {
  amount: string;
  title: Record<Language, string>;
  desc: Record<Language, string>;
};

export type AdditionalSource = {
  title: Record<Language, string>;
  url: string;
  note: Record<Language, string>;
};

export type VerificationStatus = 'verified' | 'needs_review' | 'unconfirmed';

export type SchemeSourceRecord = {
  id: string;
  title: Record<Language, string>;
  url: string;
  supportsDetail: Record<Language, string>;
  checkedDate: string;
  status: VerificationStatus;
  statusNote?: Record<Language, string>;
};

export type Scheme = {
  id: string;
  category: GroupId;
  title: Record<Language, string>;
  shortName: Record<Language, string>;
  status: 'official_source';
  ministry: Record<Language, string>;
  sourceName: string;
  sourceUrl: string;
  applicationPortalName: string;
  applicationUrl: string;
  cscUrl?: string;
  sourceCheckedDate: string;
  sourceNotice: Record<Language, string>;
  datesNotice: Record<Language, string>;
  overview: Record<Language, string>;
  benefits: {
    summary: Record<Language, string>;
    items: BenefitItem[];
    // Backward-compatible fields for PM-USP
    graduationRate?: Record<Language, string>;
    postgraduateRate?: Record<Language, string>;
    professionalRate?: Record<Language, string>;
    technicalRate?: Record<Language, string>;
  };
  potentialEligibility?: Record<Language, string[]>;
  keyRules: Record<Language, string[]>;
  exclusions: Record<Language, string[]>;
  renewalConditions?: Record<Language, string[]>;
  documents: SchemeDocument[];
  applicationRoutes?: {
    online: {
      name: Record<Language, string>;
      url: string;
      desc: Record<Language, string>;
    };
    csc: {
      name: Record<Language, string>;
      url?: string;
      desc: Record<Language, string>;
    };
  };
  nspProcessSteps?: Record<Language, string[]>;
  additionalSources?: AdditionalSource[];
  sources: SchemeSourceRecord[];
};

export type PMUSPEligibilityAnswers = {
  applicationType?: ApplicationType;
  class12Board?: string;
  class12Stream?: 'science' | 'commerce' | 'arts' | 'other' | '';
  class12PassingYear?: string;
  above80thPercentile?: 'yes' | 'no' | 'unsure';
  regularDegreeCourse?: 'yes' | 'no';
  recognizedInstitution?: 'yes' | 'no';
  familyIncomeRange?: 'upto_450k' | 'above_450k';
  otherScholarshipReceived?: 'none' | 'receiving';
  aadhaarSeededBankAccount?: 'yes' | 'no' | 'in_process';
  annualExamMarks50Plus?: 'yes' | 'no';
  attendance75Plus?: 'yes' | 'no';
};

export type PMKisanEligibilityAnswers = {
  isFarmerFamily?: 'yes' | 'no';
  hasCultivableLandInName?: 'yes' | 'no';
  isInstitutionalLandholder?: 'yes' | 'no';
  holdsConstitutionalPost?: 'yes' | 'no';
  isGovtEmployeeNotGroupD?: 'yes' | 'no';
  isPensioner10kNotGroupD?: 'yes' | 'no';
  paidIncomeTaxLastYear?: 'yes' | 'no';
  isPracticingProfessional?: 'yes' | 'no';
  aadhaarBankAvailable?: 'yes' | 'no' | 'in_process';
};

export type MahtariVandanEligibilityAnswers = {
  isChhattisgarhResident?: 'yes' | 'no' | 'unsure';
  age21OrAbove?: 'yes' | 'no' | 'unsure';
  maritalStatus?: 'married' | 'widowed' | 'divorced' | 'abandoned' | 'unmarried' | '';
  hasIndividualDbtAccount?: 'yes' | 'no' | 'joint_only' | 'in_process';
  familyIncomeTaxPayee?: 'yes' | 'no' | 'unsure';
  familyGovtEmployee?: 'yes' | 'no' | 'unsure';
};

export type CombinedEligibilityAnswers = PMUSPEligibilityAnswers &
  PMKisanEligibilityAnswers &
  MahtariVandanEligibilityAnswers;

export const schemes: Scheme[] = [
  // 1. PM-USP CENTRAL SECTOR SCHOLARSHIP (STUDENT)
  {
    id: 'pm-usp-csss',
    category: 'student',
    title: {
      en: 'Pradhan Mantri Uchchatar Shiksha Protsahan (PM-USP) Central Sector Scheme of Scholarship for College and University Students',
      hi: 'प्रधानमंत्री उच्चतर शिक्षा प्रोत्साहन (PM-USP) कॉलेज और विश्वविद्यालय के विद्यार्थियों के लिए केंद्रीय क्षेत्र छात्रवृत्ति योजना',
    },
    shortName: {
      en: 'PM-USP Central Sector Scholarship',
      hi: 'पीएम-यूएसपी केंद्रीय क्षेत्र छात्रवृत्ति',
    },
    status: 'official_source',
    ministry: {
      en: 'Ministry of Education — Department of Higher Education',
      hi: 'शिक्षा मंत्रालय — उच्च शिक्षा विभाग',
    },
    sourceName: 'myScheme (Official Government Portal)',
    sourceUrl: 'https://www.myscheme.gov.in/schemes/csss-cus',
    applicationPortalName: 'National Scholarship Portal (NSP)',
    applicationUrl: 'https://scholarships.gov.in/',
    sourceCheckedDate: 'October 20, 2026',
    sourceNotice: {
      en: 'Source facts checked against myScheme on October 20, 2026. This reflects guidance checked on this date; official portals make the final determination.',
      hi: 'योजना के तथ्य 20 अक्टूबर 2026 को myScheme से जाँचे गए। यह उस तारीख की आधिकारिक जानकारी पर आधारित मार्गदर्शन है; अंतिम निर्णय आधिकारिक पोर्टल का होगा।',
    },
    datesNotice: {
      en: 'Application opening and closing dates are determined each academic year by the National Scholarship Portal. Please verify current dates directly on scholarships.gov.in.',
      hi: 'आवेदन शुरू और समाप्त होने की तिथियाँ राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) द्वारा हर शैक्षणिक वर्ष तय की जाती हैं। कृपया वर्तमान तिथियाँ सीधे scholarships.gov.in पर देखें।',
    },
    overview: {
      en: 'The PM-USP Central Sector Scheme of Scholarship provides financial assistance to meritorious students from low-income families to meet day-to-day expenses while pursuing regular higher education in recognized colleges and universities across India.',
      hi: 'पीएम-यूएसपी केंद्रीय क्षेत्र छात्रवृत्ति योजना कम आय वाले परिवारों के मेधावी विद्यार्थियों को भारत भर के मान्यता प्राप्त कॉलेजों और विश्वविद्यालयों में नियमित उच्च शिक्षा प्राप्त करने के दौरान दैनिक खर्चों को पूरा करने के लिए वित्तीय सहायता प्रदान करती है।',
    },
    benefits: {
      summary: {
        en: 'Annual scholarship assistance disbursed directly to student bank accounts via Direct Benefit Transfer (DBT).',
        hi: 'प्रत्यक्ष लाभ अंतरण (DBT) के माध्यम से सीधे विद्यार्थी के बैंक खाते में वार्षिक छात्रवृत्ति सहायता।',
      },
      items: [
        {
          amount: '₹12,000 / yr',
          title: { en: 'Graduation (1st to 3rd Year)', hi: 'स्नातक (प्रथम से तृतीय वर्ष)' },
          desc: { en: '₹12,000 per annum for the first three years of general regular degree courses.', hi: 'सामान्य नियमित डिग्री पाठ्यक्रमों के पहले तीन वर्षों के लिए ₹12,000 प्रति वर्ष।' },
        },
        {
          amount: '₹20,000 / yr',
          title: { en: 'Postgraduate Level', hi: 'स्नातकोत्तर (पीजी) स्तर' },
          desc: { en: '₹20,000 per annum (1st and 2nd year of post-graduation).', hi: '₹20,000 प्रति वर्ष (पीजी का प्रथम और द्वितीय वर्ष)।' },
        },
        {
          amount: '₹20,000 / yr',
          title: { en: 'Professional & B.Tech 4th/5th Yr', hi: 'व्यावसायिक व बी.टेक चतुर्थ/पंचम वर्ष' },
          desc: { en: '₹20,000 per annum in the 4th and 5th years of 5-year integrated/professional courses and 4th year of technical courses (B.Tech).', hi: '5-वर्षीय एकीकृत पाठ्यक्रमों के 4वें व 5वें वर्ष और तकनीकी पाठ्यक्रमों (बी.टेक) के चौथे वर्ष के लिए ₹20,000 प्रति वर्ष।' },
        },
      ],
      graduationRate: {
        en: 'Graduation level: ₹12,000 per annum for the first three years of general regular degree courses.',
        hi: 'स्नातक स्तर: सामान्य नियमित डिग्री पाठ्यक्रमों के पहले तीन वर्षों के लिए ₹12,000 प्रति वर्ष।',
      },
      postgraduateRate: {
        en: 'Postgraduate level: ₹20,000 per annum (1st and 2nd year of post-graduation).',
        hi: 'स्नातकोत्तर स्तर: ₹20,000 प्रति वर्ष (पीजी का प्रथम और द्वितीय वर्ष)।',
      },
      professionalRate: {
        en: '5-Year Integrated/Professional courses: ₹12,000 per annum for the first three years, and ₹20,000 per annum for the 4th and 5th years.',
        hi: '5-वर्षीय एकीकृत/व्यावसायिक पाठ्यक्रम: पहले 3 वर्षों के लिए ₹12,000 प्रति वर्ष, और चौथे व 5वें वर्ष के लिए ₹20,000 प्रति वर्ष।',
      },
      technicalRate: {
        en: 'Technical degree courses (e.g. B.Tech / B.E.): ₹12,000 per annum for the first three years, and ₹20,000 per annum for the 4th year as stated on myScheme.',
        hi: 'तकनीकी डिग्री पाठ्यक्रम (जैसे B.Tech/B.E.): myScheme के अनुसार पहले 3 वर्षों के लिए ₹12,000 प्रति वर्ष और चौथे वर्ष के लिए ₹20,000 प्रति वर्ष।',
      },
    },
    keyRules: {
      en: [
        'Must be above the 80th percentile of successful candidates in the relevant stream and board in Class 12 examination (percentile standing, not simply 80% marks).',
        'Must be enrolled in a regular (full-time) degree course in a recognized college, institution, or university.',
        'Gross annual parental/family income must not exceed ₹4,50,000.',
        'Must have an active bank account in the student’s own name seeded with Aadhaar for Direct Benefit Transfer (DBT).',
        'Diploma, correspondence, and distance education courses are not eligible.',
      ],
      hi: [
        'कक्षा 12वीं की परीक्षा में संबंधित बोर्ड और संकाय (स्ट्रीम) के सफल उम्मीदवारों की 80वीं पर्सेंटाइल से ऊपर होना अनिवार्य है (यह बोर्ड पर्सेंटाइल/रैंक कट-ऑफ है, केवल 80% अंक नहीं)।',
        'मान्यता प्राप्त कॉलेज, संस्थान या विश्वविद्यालय में नियमित (पूर्णकालिक) डिग्री पाठ्यक्रम में नामांकित होना चाहिए।',
        'अभिभावक/परिवार की कुल वार्षिक आय ₹4,50,000 से अधिक नहीं होनी चाहिए।',
        'डीबीटी द्वारा सीधे भुगतान के लिए छात्र के अपने नाम पर आधार से जुड़ा सक्रिय बैंक खाता होना आवश्यक है।',
        'डिप्लोमा, पत्राचार और दूरस्थ शिक्षा (डिस्टेंस) पाठ्यक्रम इसके पात्र नहीं हैं।',
      ],
    },
    exclusions: {
      en: [
        'Students already receiving any other scholarship scheme or fee waiver (including state government scholarships) are excluded.',
        'Students pursuing distance, part-time, or correspondence education.',
        'Students with annual family income exceeding ₹4,50,000.',
      ],
      hi: [
        'अन्य कोई छात्रवृत्ति या शुल्क छूट (राज्य सरकार की छात्रवृत्ति सहित) प्राप्त कर रहे विद्यार्थी अपात्र हैं।',
        'दूरस्थ, अंशकालिक या पत्राचार शिक्षा प्राप्त करने वाले विद्यार्थी।',
        '₹4,50,000 से अधिक वार्षिक पारिवारिक आय वाले परिवार के विद्यार्थी।',
      ],
    },
    renewalConditions: {
      en: [
        'At least 50% marks in the previous annual examination / semester examination.',
        'At least 75% attendance in the academic year.',
        'Maintenance of good discipline and conduct with no supplementary/backlog.',
      ],
      hi: [
        'पिछली वार्षिक परीक्षा/सत्र परीक्षा में कम से कम 50% अंक।',
        'शैक्षणिक वर्ष में कम से कम 75% उपस्थिति।',
        'अच्छा अनुशासन और बिना किसी बैकलॉग/पूरक परीक्षा के निरंतर अध्ययन।',
      ],
    },
    documents: [
      {
        id: 'marksheet-12',
        category: 'fresh',
        label: { en: 'Class 12 Marksheet', hi: 'कक्षा 12वीं की अंकतालिका (मार्कशीट)' },
        fields: ['Candidate name', 'Class 12 roll number', 'Class 12 board name', 'Passing year', 'Marks or percentile'],
        isMandatory: true,
        note: {
          en: 'Verifies board, stream, passing year, and marks.',
          hi: 'बोर्ड, संकाय, उत्तीर्ण वर्ष और अंकों की पुष्टि करता है।',
        },
      },
      {
        id: 'income-certificate',
        category: 'both',
        label: { en: 'Family Income Certificate', hi: 'पारिवारिक आय प्रमाण पत्र' },
        fields: ['Parent or guardian name', 'Annual family income', 'Issuing authority', 'Issue date'],
        isMandatory: true,
        note: {
          en: 'Issued by competent revenue/tehsil authority confirming gross annual income ≤ ₹4,50,000.',
          hi: 'सक्षम राजस्व/तहसील प्राधिकरण द्वारा जारी, जो कुल वार्षिक आय ₹4,50,000 से कम प्रमाणित करता हो।',
        },
      },
      {
        id: 'category-certificate',
        category: 'fresh',
        label: { en: 'Caste / Category Certificate', hi: 'जाति / श्रेणी प्रमाण पत्र' },
        fields: ['Candidate name', 'Category or caste'],
        isMandatory: false,
        note: {
          en: 'Required only for SC, ST, and OBC category applicants.',
          hi: 'केवल अजा, अजजा और अन्य पिछड़ा वर्ग (SC/ST/OBC) के आवेदकों के लिए आवश्यक।',
        },
      },
      {
        id: 'disability-certificate',
        category: 'fresh',
        label: { en: 'Disability Certificate', hi: 'दिव्यांगता प्रमाण पत्र' },
        fields: ['Candidate name', 'Disability percentage'],
        isMandatory: false,
        note: {
          en: 'Required only for Persons with Disabilities (PwD) applicants.',
          hi: 'केवल दिव्यांग (PwD) आवेदकों के लिए आवश्यक।',
        },
      },
      {
        id: 'enrolment-proof',
        category: 'fresh',
        label: { en: 'College Admission / Bonafide Proof', hi: 'कॉलेज प्रवेश / बोनाफाइड प्रमाण पत्र' },
        fields: ['Candidate name', 'Institution name', 'Degree course name', 'Current academic year'],
        isMandatory: true,
        note: {
          en: 'Confirms admission to a regular degree course at a recognized college or university.',
          hi: 'मान्यता प्राप्त कॉलेज या विश्वविद्यालय में नियमित डिग्री पाठ्यक्रम में प्रवेश की पुष्टि करता है।',
        },
      },
      {
        id: 'previous-marksheet',
        category: 'renewal',
        label: { en: 'Previous Year Marksheet', hi: 'पिछले वर्ष की अंकतालिका (मार्कशीट)' },
        fields: ['Candidate name', 'Institution name', 'Annual examination marks', 'Academic year'],
        isMandatory: true,
        note: {
          en: 'Verifies scoring at least 50% marks in the annual examination.',
          hi: 'वार्षिक परीक्षा में कम से कम 50% अंक प्राप्त करने की पुष्टि करता है।',
        },
      },
      {
        id: 'attendance-certificate',
        category: 'renewal',
        label: { en: 'Attendance & Bonafide Certificate', hi: 'उपस्थिति एवं बोनाफाइड प्रमाण पत्र' },
        fields: ['Candidate name', 'Institution name', 'Attendance percentage', 'Academic year'],
        isMandatory: true,
        note: {
          en: 'Issued by college verifying minimum 75% attendance and regular progression.',
          hi: 'कॉलेज द्वारा जारी जो न्यूनतम 75% उपस्थिति और नियमित अध्ययन प्रमाणित करता हो।',
        },
      },
    ],
    nspProcessSteps: {
      en: [
        'Step 1 — One Time Registration (OTR): Visit https://scholarships.gov.in/ and register using mobile number.',
        'Step 2 — Aadhaar e-KYC: Complete identity verification via NSP mobile app (Face Auth) or biometric/OTP.',
        'Step 3 — Form Filling: Log in with OTR credentials, select Department of Higher Education -> PM-USP Central Sector Scheme of Scholarship.',
        'Step 4 — Document Upload: Upload the required Class 12 marksheet, income certificate, and institutional proofs.',
        'Step 5 — Institutional Verification: The application is verified online by the College/Institute Nodal Officer (INO) and state nodal authority.',
      ],
      hi: [
        'चरण 1 — वन टाइम रजिस्ट्रेशन (OTR): https://scholarships.gov.in/ पर जाएँ और मोबाइल नंबर से पंजीकरण करें।',
        'चरण 2 — आधार ई-केवाईसी: एनएसपी मोबाइल ऐप (फ़ेस ऑथ) या बायोमेट्रिक/ओटीपी द्वारा पहचान सत्यापन पूरा करें।',
        'चरण 3 — फ़ॉर्म भरना: OTR विवरण से लॉग इन करें, उच्च शिक्षा विभाग -> पीएम-यूएसपी छात्रवृत्ति योजना चुनें।',
        'चरण 4 — दस्तावेज़ अपलोड: 12वीं की मार्कशीट, आय प्रमाण पत्र और संस्थान संबंधी दस्तावेज़ अपलोड करें।',
        'चरण 5 — संस्थान सत्यापन: कॉलेज के नोडल अधिकारी (INO) और राज्य प्राधिकरण द्वारा ऑनलाइन सत्यापन किया जाता है।',
      ],
    },
    sources: [
      {
        id: 'pm-usp-myscheme-eligibility',
        title: {
          en: 'myScheme: PM-USP Central Sector Scholarship Details',
          hi: 'myScheme: पीएम-यूएसपी छात्रवृत्ति योजना विवरण',
        },
        url: 'https://www.myscheme.gov.in/schemes/csss-cus',
        supportsDetail: {
          en: 'Eligibility criteria (> 80th percentile in Class 12, regular degree course, family income ≤ ₹4,50,000)',
          hi: 'पात्रता मानदंड (12वीं में > 80वीं पर्सेंटाइल, नियमित डिग्री पाठ्यक्रम, पारिवारिक आय ≤ ₹4,50,000)',
        },
        checkedDate: 'October 20, 2026',
        status: 'verified',
        statusNote: {
          en: 'Verified against official myScheme portal guidance.',
          hi: 'myScheme आधिकारिक पोर्टल से प्राथमिक मानक के रूप में सत्यापित।',
        },
      },
      {
        id: 'pm-usp-myscheme-benefits',
        title: {
          en: 'myScheme: Scholarship Rates & Disbursal Schedule',
          hi: 'myScheme: छात्रवृत्ति दरें एवं वितरण अनुसूची',
        },
        url: 'https://www.myscheme.gov.in/schemes/csss-cus',
        supportsDetail: {
          en: 'Benefits amount (₹12,000/yr for graduation 1st–3rd year; ₹20,000/yr for PG and 4th/5th yr professional/technical courses via DBT)',
          hi: 'वित्तीय लाभ राशि (स्नातक ₹12,000/वर्ष; स्नातकोत्तर व 4थे/5वें वर्ष व्यावसायिक ₹20,000/वर्ष सीधे डीबीटी द्वारा)',
        },
        checkedDate: 'October 20, 2026',
        status: 'verified',
        statusNote: {
          en: 'Official rates credited directly to beneficiary bank account via DBT.',
          hi: 'डीबीटी द्वारा सीधे लाभार्थी के बैंक खाते में अंतरित होने वाली आधिकारिक दरें।',
        },
      },
      {
        id: 'pm-usp-nsp-portal',
        title: {
          en: 'National Scholarship Portal (NSP) — Official Application Portal',
          hi: 'राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) — आधिकारिक आवेदन पोर्टल',
        },
        url: 'https://scholarships.gov.in/',
        supportsDetail: {
          en: 'Application window, OTR registration, and institutional verification',
          hi: 'आवेदन समय-सीमा, OTR पंजीकरण और संस्थान स्तर पर सत्यापन',
        },
        checkedDate: 'October 20, 2026',
        status: 'needs_review',
        statusNote: {
          en: 'Application opening and closing dates vary each academic year. Please verify active dates on scholarships.gov.in.',
          hi: 'आवेदन शुरू और बंद होने की तिथियाँ हर शैक्षणिक वर्ष बदलती हैं। कृपया वर्तमान तिथियों की पुष्टि scholarships.gov.in पर करें।',
        },
      },
      {
        id: 'pm-usp-dhe-guidelines',
        title: {
          en: 'Department of Higher Education (MoE) — Operational Guidelines',
          hi: 'उच्च शिक्षा विभाग (शिक्षा मंत्रालय) — परिचालन दिशानिर्देश',
        },
        url: 'https://www.education.gov.in/',
        supportsDetail: {
          en: 'Document checklist and renewal rules (50% marks & 75% attendance)',
          hi: 'दस्तावेज़ सूची एवं नवीनीकरण नियम (कम से कम 50% अंक व 75% उपस्थिति)',
        },
        checkedDate: 'October 20, 2026',
        status: 'verified',
        statusNote: {
          en: 'Standard regulatory guidelines for fresh and renewal allocations.',
          hi: 'नए व नवीनीकरण आवेदनों के लिए मानक नियामक दिशानिर्देश।',
        },
      },
    ],
  },

  // 2. PM-KISAN SAMMAN NIDHI (FARMER)
  {
    id: 'pm-kisan',
    category: 'farmer',
    title: {
      en: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      hi: 'प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान)',
    },
    shortName: {
      en: 'PM-KISAN Samman Nidhi',
      hi: 'पीएम-किसान सम्मान निधि',
    },
    status: 'official_source',
    ministry: {
      en: 'Ministry of Agriculture and Farmers Welfare — Department of Agriculture and Farmers Welfare',
      hi: 'कृषि एवं किसान कल्याण मंत्रालय — कृषि एवं किसान कल्याण विभाग',
    },
    sourceName: 'myScheme (Official Government Portal)',
    sourceUrl: 'https://www.myscheme.gov.in/hi/schemes/pm-kisan',
    applicationPortalName: 'Official PM-KISAN Portal & Common Service Centres (CSC)',
    applicationUrl: 'https://pmkisan.gov.in/',
    cscUrl: 'https://locator.csccloud.in/',
    sourceCheckedDate: 'October 20, 2026',
    sourceNotice: {
      en: 'Source facts checked against myScheme and pmkisan.gov.in on October 20, 2026. Official State/UT authorities and District administration verify and make the final eligibility and payment determinations.',
      hi: 'योजना के तथ्य 20 अक्टूबर 2026 को myScheme और pmkisan.gov.in से जाँचे गए। राज्य/केंद्र शासित प्रदेश प्रशासन एवं जिला सत्यापन प्राधिकरण अंतिम पात्रता और भुगतान का निर्धारण करते हैं।',
    },
    datesNotice: {
      en: 'Installment release schedules (every four months) and ongoing registration periods are announced officially by the Ministry on pmkisan.gov.in. Dates are not fixed to static deadlines.',
      hi: 'किस्त जारी होने की तिथियाँ (हर चार माह में) और पंजीकरण अवधि की आधिकारिक घोषणा मंत्रालय द्वारा pmkisan.gov.in पर की जाती है।',
    },
    overview: {
      en: 'PM-KISAN provides income support of ₹6,000 per year to eligible landholding farmer families across the country in three equal installments of ₹2,000 each, normally every four months, credited directly into Aadhaar-seeded bank accounts.',
      hi: 'पीएम-किसान योजना देश भर के पात्र भूमिधारक किसान परिवारों को ₹6,000 प्रति वर्ष की आय सहायता प्रदान करती है, जो सामान्यतः हर चार माह में ₹2,000 की तीन समान किस्तों में सीधे आधार-सीडेड बैंक खाते में भेजी जाती है।',
    },
    benefits: {
      summary: {
        en: '₹6,000 per year per eligible farmer family in three 4-monthly installments of ₹2,000 each via Direct Benefit Transfer (DBT).',
        hi: 'पात्र किसान परिवार को ₹6,000 प्रति वर्ष, प्रत्यक्ष लाभ अंतरण (DBT) के माध्यम से हर 4 माह में ₹2,000 की 3 समान किस्तों में।',
      },
      items: [
        {
          amount: '₹6,000 / yr',
          title: { en: 'Annual Financial Assistance', hi: 'वार्षिक वित्तीय सहायता' },
          desc: { en: 'Supplement agricultural inputs and domestic household expenses.', hi: 'कृषि निवेश और घरेलू जरूरतों के खर्चों में सहायता के लिए।' },
        },
        {
          amount: '₹2,000 / installment',
          title: { en: 'Three Installments Annually', hi: 'वर्ष में तीन समान किस्तें' },
          desc: { en: 'Normally released every 4 months (Period 1: Apr–Jul, Period 2: Aug–Nov, Period 3: Dec–Mar).', hi: 'सामान्यतः हर 4 माह के अंतराल पर जारी (अप्रैल-जुलाई, अगस्त-नवंबर, दिसंबर-मार्च)।' },
        },
        {
          amount: 'Direct DBT',
          title: { en: 'Aadhaar-Seeded Bank Disbursal', hi: 'आधार-सीडेड बैंक खाते में भुगतान' },
          desc: { en: 'Transferred directly to the verified savings account of the eligible farmer beneficiary.', hi: 'पात्र किसान लाभार्थी के सत्यापित बचत खाते में सीधे अंतरित।' },
        },
      ],
    },
    potentialEligibility: {
      en: [
        'Potentially eligible beneficiaries are landholding farmer families with cultivable landholding in their names.',
        'Land size alone is not an exclusion: the myScheme page states the scheme is not limited only to small and marginal farmers.',
        'Family definition on the official PM-KISAN portal is husband, wife, and minor children.',
        'Subject to scheme exclusions and verification by State Government / UT administrations.',
      ],
      hi: [
        'संभावित पात्र लाभार्थी वे भूमिधारक किसान परिवार हैं जिनके नाम पर खेती योग्य (कृषियोग्य) भूमि दर्ज है।',
        'केवल जोत का आकार (जमीन का आकार) अपात्रता का कारण नहीं है; myScheme के अनुसार यह योजना केवल छोटे व सीमांत किसानों तक सीमित नहीं है।',
        'आधिकारिक पीएम-किसान पोर्टल पर परिवार की परिभाषा: पति, पत्नी और नाबालिग बच्चे।',
        'पात्रता योजना के बहिष्करण नियमों और राज्य सरकार / केंद्र शासित प्रदेश प्रशासन के सत्यापन के अधीन है।',
      ],
    },
    keyRules: {
      en: [
        'The applicant must be a member of a landholding farmer family (husband, wife, and minor children).',
        'Cultivable landholding must be recorded in the name of a family member in official revenue records.',
        'The scheme is open to all landholding farmer families regardless of land size (not restricted only to small/marginal farmers).',
        'The beneficiary must have an active savings bank account seeded with Aadhaar for DBT disbursal.',
        'Mandatory e-KYC (Aadhaar OTP or biometric authentication) is required for disbursal.',
      ],
      hi: [
        'आवेदक भूमिधारक किसान परिवार (पति, पत्नी और नाबालिग बच्चे) का सदस्य होना चाहिए।',
        'आधिकारिक राजस्व अभिलेखों में परिवार के सदस्य के नाम पर खेती योग्य भूमि दर्ज होनी चाहिए।',
        'यह योजना भूमि के आकार पर निर्भर नहीं है (केवल छोटे/सीमांत किसानों तक सीमित नहीं है)।',
        'डीबीटी अंतरण के लिए आधार से जुड़ा सक्रिय बचत बैंक खाता होना आवश्यक है।',
        'किस्त भुगतान के लिए अनिवार्य ई-केवाईसी (आधार ओटीपी या बायोमेट्रिक) आवश्यक है।',
      ],
    },
    exclusions: {
      en: [
        'All Institutional Landholders.',
        'Former and present holders of constitutional posts.',
        'Former and present Ministers / State Ministers, former/present Members of Lok Sabha, Rajya Sabha, State Legislative Assemblies, State Legislative Councils, former and present Mayors of Municipal Corporations, and former and present Chairpersons of District Panchayats.',
        'All serving or retired officers and employees of Central/State Government Ministries/Offices/Departments and their field units, Central or State PSEs and Attached offices/Autonomous Institutions under Government as well as regular employees of Local Bodies (EXCLUDING Multi-Tasking Staff / Class IV / Group D employees).',
        'All superannuated/retired pensioners whose monthly pension is ₹10,000/- or more (EXCLUDING Multi-Tasking Staff / Class IV / Group D employees).',
        'All persons who paid Income Tax in the last assessment year.',
        'Professionals like Doctors, Engineers, Lawyers, Chartered Accountants, and Architects registered with professional bodies and carrying out practice.',
      ],
      hi: [
        'सभी संस्थागत भूमिधारक (Institutional Landholders)।',
        'संवैधानिक पदों के पूर्व और वर्तमान धारक।',
        'पूर्व और वर्तमान मंत्री/राज्य मंत्री, लोकसभा/राज्यसभा/विधानसभा/विधान परिषद के पूर्व या वर्तमान सदस्य, नगर निगमों के पूर्व और वर्तमान महापौर, जिला पंचायतों के पूर्व और वर्तमान अध्यक्ष।',
        'केंद्र/राज्य सरकार के मंत्रालयों/विभागों, केंद्रीय/राज्य सार्वजनिक उपक्रमों, स्वायत्त संस्थानों के सभी सेवारत या सेवानिवृत्त अधिकारी व कर्मचारी, तथा स्थानीय निकायों के नियमित कर्मचारी (मल्टी-टास्किंग स्टाफ / चतुर्थ श्रेणी / ग्रुप डी कर्मचारियों को छोड़कर)।',
        'ऐसे सभी सेवानिवृत्त पेंशनभोगी जिनकी मासिक पेंशन ₹10,000 या उससे अधिक है (मल्टी-टास्किंग स्टाफ / चतुर्थ श्रेणी / ग्रुप डी कर्मचारियों को छोड़कर)।',
        'वे सभी व्यक्ति जिन्होंने पिछले निर्धारण वर्ष में आयकर (Income Tax) का भुगतान किया हो।',
        'पेशेवर जैसे डॉक्टर, इंजीनियर, वकील, चार्टर्ड अकाउंटेंट (CA) और वास्तुकार (आर्किटेक्ट) जो पेशेवर निकायों में पंजीकृत हैं और निजी या पेशेवर अभ्यास कर रहे हैं।',
      ],
    },
    documents: [
      {
        id: 'aadhaar-card',
        category: 'both',
        label: { en: 'Aadhaar Card', hi: 'आधार कार्ड' },
        fields: ['Full Name', 'Aadhaar Number (for OTP e-KYC on official portal)', 'Date of Birth', 'Address'],
        isMandatory: true,
        note: {
          en: 'Required for identity verification and mandatory e-KYC on the official PM-KISAN portal.',
          hi: 'पहचान सत्यापन और आधिकारिक पीएम-किसान पोर्टल पर अनिवार्य ई-केवाईसी के लिए आवश्यक।',
        },
      },
      {
        id: 'landholding-papers',
        category: 'both',
        label: { en: 'Landholding Papers / Land Records', hi: 'भूमि स्वामित्व अभिलेख (खसरा / खतौनी / जमाबंदी)' },
        fields: ['Owner Name', 'Khata / Survey Number', 'Khasra Number', 'Area in Hectares', 'Tehsil / Village Name'],
        isMandatory: true,
        note: {
          en: 'Official state revenue records (e.g. Bhulekh, ROR, Jamabandi, or Mutation register) proving cultivable land in family member’s name.',
          hi: 'आधिकारिक राज्य राजस्व अभिलेख (भूलेख, खतौनी, जमाबंदी या दाखिल-खारिज) जो परिवार के नाम खेती योग्य भूमि प्रमाणित करते हों।',
        },
      },
      {
        id: 'bank-passbook',
        category: 'both',
        label: { en: 'Savings Bank Account (Aadhaar Seeded)', hi: 'बचत बैंक खाता (आधार से जुड़ा हुआ)' },
        fields: ['Account Holder Name', 'Bank Name', 'IFSC Code', 'Aadhaar Seeding / DBT Status'],
        isMandatory: true,
        note: {
          en: 'Active savings account in the farmer’s name linked with Aadhaar via NPCI for direct DBT credit of ₹2,000 installments.',
          hi: 'किसान के नाम पर सक्रिय बचत खाता जो ₹2,000 की किस्तों के सीधे डीबीटी भुगतान के लिए एनपीसीआई/आधार से जुड़ा हो।',
        },
      },
    ],
    applicationRoutes: {
      online: {
        name: { en: 'New Farmer Registration (PM-KISAN Official Portal)', hi: 'नया किसान पंजीकरण (पीएम-किसान आधिकारिक पोर्टल)' },
        url: 'https://pmkisan.gov.in/',
        desc: {
          en: 'Self-registration online using Aadhaar number and Aadhaar-linked mobile OTP on pmkisan.gov.in under "Farmers Corner".',
          hi: 'pmkisan.gov.in पर "फार्मर्स कॉर्नर" के तहत आधार नंबर और आधार-लिंक्ड मोबाइल ओटीपी का उपयोग करके ऑनलाइन स्व-पंजीकरण।',
        },
      },
      csc: {
        name: { en: 'Common Service Centre (CSC) Registration', hi: 'कॉमन सर्विस सेंटर (CSC) द्वारा पंजीकरण' },
        url: 'https://locator.csccloud.in/',
        desc: {
          en: 'As described by myScheme, farmers can visit their nearest village CSC where Village Level Entrepreneurs (VLEs) assist with online entry and biometric e-KYC.',
          hi: 'myScheme के अनुसार, किसान अपने नजदीकी ग्राम सीएससी केंद्र पर जाकर ग्राम स्तरीय उद्यमियों (VLE) की सहायता से बायोमेट्रिक ई-केवाईसी व पंजीकरण करा सकते हैं।',
        },
      },
    },
    sources: [
      {
        id: 'pm-kisan-myscheme',
        title: {
          en: 'myScheme: PM-KISAN Scheme Page',
          hi: 'myScheme: पीएम-किसान योजना पृष्ठ',
        },
        url: 'https://www.myscheme.gov.in/hi/schemes/pm-kisan',
        supportsDetail: {
          en: 'Eligibility: Landholding farmer families with cultivable land in their names (open to all land sizes)',
          hi: 'पात्रता: परिवार के नाम खेती योग्य जमीन वाले किसान परिवार (सभी जोत आकारों के लिए खुला)',
        },
        checkedDate: 'October 20, 2026',
        status: 'verified',
        statusNote: {
          en: 'Confirmed on official myScheme portal.',
          hi: 'आधिकारिक myScheme पोर्टल पर पुष्ट।',
        },
      },
      {
        id: 'pm-kisan-portal-benefits',
        title: {
          en: 'Official PM-KISAN Portal (pmkisan.gov.in)',
          hi: 'आधिकारिक पीएम-किसान पोर्टल (pmkisan.gov.in)',
        },
        url: 'https://pmkisan.gov.in/',
        supportsDetail: {
          en: 'Benefits: ₹6,000 per year paid in three 4-monthly installments of ₹2,000 via DBT',
          hi: 'लाभ: ₹6,000 प्रति वर्ष, तीन 4-मासिक किस्तों (₹2,000) में सीधे डीबीटी द्वारा',
        },
        checkedDate: 'October 20, 2026',
        status: 'verified',
        statusNote: {
          en: 'Confirmed on official PM-KISAN home portal.',
          hi: 'आधिकारिक पीएम-किसान मुख्य पोर्टल पर पुष्ट।',
        },
      },
      {
        id: 'pm-kisan-portal-exclusions',
        title: {
          en: 'PM-KISAN Operational Guidelines & FAQs',
          hi: 'पीएम-किसान परिचालन दिशानिर्देश एवं अक्सर पूछे जाने वाले प्रश्न',
        },
        url: 'https://pmkisan.gov.in/',
        supportsDetail: {
          en: 'Exclusion criteria (Institutional landholders, income tax payees, govt employees, professionals)',
          hi: 'अपवर्जन मानदंड (संस्थागत भूधारक, आयकर दाता, सरकारी कर्मचारी, डॉक्टर/इंजीनियर/वकील/सीए)',
        },
        checkedDate: 'October 20, 2026',
        status: 'verified',
        statusNote: {
          en: 'Standard statutory exclusions for higher-income categories.',
          hi: 'उच्च आय वर्ग के लिए मानक वैधानिक अपवर्जन नियम।',
        },
      },
      {
        id: 'pm-kisan-portal-window',
        title: {
          en: 'PM-KISAN Farmers Corner & Disbursal Tracker',
          hi: 'पीएम-किसान फार्मर्स कॉर्नर एवं किस्त ट्रैकर',
        },
        url: 'https://pmkisan.gov.in/',
        supportsDetail: {
          en: 'Current installment cycle, e-KYC deadlines, and state verification status',
          hi: 'वर्तमान किस्त चक्र, ई-केवाईसी समय-सीमा और राज्य सत्यापन स्थिति',
        },
        checkedDate: 'October 20, 2026',
        status: 'needs_review',
        statusNote: {
          en: 'Installment release dates and active e-KYC/correction periods change periodically. Please verify on pmkisan.gov.in.',
          hi: 'किस्त वितरण की तिथियाँ और सक्रिय ई-केवाईसी/सुधार की समय-सीमा बदलती रहती हैं। कृपया pmkisan.gov.in पर देखें।',
        },
      },
      {
        id: 'pm-kisan-csc',
        title: {
          en: 'Common Service Centre (CSC) Network Locator',
          hi: 'कॉमन सर्विस सेंटर (CSC) केंद्र लोकेटर',
        },
        url: 'https://locator.csccloud.in/',
        supportsDetail: {
          en: 'Assisted in-person registration and biometric e-KYC pathway',
          hi: 'सहायता-प्राप्त व्यक्तिगत पंजीकरण एवं बायोमेट्रिक ई-केवाईसी मार्ग',
        },
        checkedDate: 'October 20, 2026',
        status: 'verified',
        statusNote: {
          en: 'Alternative in-person route operated through VLEs.',
          hi: 'ग्रामीण स्तरीय उद्यमियों (VLE) द्वारा संचालित वैकल्पिक व्यक्तिगत मार्ग।',
        },
      },
    ],
  },

  // 3. MAHTARI VANDAN YOJANA (WOMAN)
  {
    id: 'mahtari-vandan',
    category: 'woman',
    title: {
      en: 'Mahtari Vandan Yojana (Chhattisgarh Women Empowerment Scheme)',
      hi: 'मह्तारी वंदन योजना (छत्तीसगढ़ महिला सशक्तिकरण योजना)',
    },
    shortName: {
      en: 'Mahtari Vandan Yojana',
      hi: 'मह्तारी वंदन योजना',
    },
    status: 'official_source',
    ministry: {
      en: 'Department of Women & Child Development — Government of Chhattisgarh',
      hi: 'महिला एवं बाल विकास विभाग — छत्तीसगढ़ शासन',
    },
    sourceName: 'Official Mahtari Vandan Portal & DPR Chhattisgarh',
    sourceUrl: 'https://mahtarivandan.cgstate.gov.in/',
    applicationPortalName: 'Official Mahtari Vandan Portal (Chhattisgarh)',
    applicationUrl: 'https://mahtarivandan.cgstate.gov.in/',
    sourceCheckedDate: 'October 20, 2026',
    sourceNotice: {
      en: 'Primary facts checked against official portal mahtarivandan.cgstate.gov.in on October 20, 2026. Detailed eligibility criteria (residence, age 21+, marital categories) are sourced from official DPR Chhattisgarh guidance published in 2024 and should be verified on the portal for the current cycle. FindMyFit is an independent guide and is not affiliated with the Government of Chhattisgarh.',
      hi: 'प्राथमिक तथ्य आधिकारिक पोर्टल mahtarivandan.cgstate.gov.in से 20 अक्टूबर 2026 को जाँचे गए। विस्तृत पात्रता नियम (निवास, 21+ आयु, वैवाहिक श्रेणियाँ) 2024 में प्रकाशित आधिकारिक जनसंपर्क छत्तीसगढ़ दिशानिर्देशों से लिए गए हैं, जिनकी वर्तमान चक्र में पोर्टल से पुष्टि आवश्यक है। FindMyFit एक स्वतंत्र मार्गदर्शक है और छत्तीसगढ़ शासन से संबद्ध नहीं है।',
    },
    datesNotice: {
      en: 'Current application intake periods and installment dates are announced officially by the Chhattisgarh Women & Child Development Department. Do not rely on dated 2024 deadlines; please check current active status directly on the official portal.',
      hi: 'आवेदन प्राप्त करने की वर्तमान तिथियाँ और किस्त वितरण की जानकारी महिला एवं बाल विकास विभाग द्वारा आधिकारिक रूप से घोषित की जाती है। 2024 की पुरानी समय-सीमा पर निर्भर न रहें; वर्तमान स्थिति सीधे आधिकारिक पोर्टल पर देखें।',
    },
    overview: {
      en: 'Mahtari Vandan Yojana provides monthly financial assistance of ₹1,000 (₹12,000 annually) directly into the Aadhaar-linked individual bank account of eligible women in Chhattisgarh to support financial independence, nutrition, and family health.',
      hi: 'मह्तारी वंदन योजना छत्तीसगढ़ की पात्र महिलाओं के आधार से जुड़े व्यक्तिगत बैंक खाते में डीबीटी के माध्यम से ₹1,000 प्रति माह (₹12,000 प्रति वर्ष) की वित्तीय सहायता प्रदान करती है, ताकि महिलाओं के आर्थिक स्वावलंबन, स्वास्थ्य एवं पोषण स्तर में सुधार हो सके।',
    },
    benefits: {
      summary: {
        en: 'Financial assistance of ₹1,000 per month (₹12,000 per annum) credited directly via DBT into the beneficiary’s individual bank account.',
        hi: 'प्रत्यक्ष लाभ अंतरण (DBT) द्वारा सीधे महिला के व्यक्तिगत बैंक खाते में ₹1,000 प्रति माह (₹12,000 प्रति वर्ष) की आर्थिक सहायता।',
      },
      items: [
        {
          amount: '₹1,000 / month',
          title: { en: 'Monthly Assistance', hi: 'मासिक आर्थिक सहायता' },
          desc: { en: 'Credited directly each month via DBT to the eligible woman’s individual bank account.', hi: 'पात्र महिला के व्यक्तिगत बैंक खाते में प्रतिमाह डीबीटी द्वारा अंतरित।' },
        },
        {
          amount: '₹12,000 / year',
          title: { en: 'Annual Support', hi: 'वार्षिक कुल सहायता' },
          desc: { en: 'Provides steady financial independence and nutritional support throughout the year.', hi: 'वर्ष भर निरंतर आर्थिक स्वावलंबन एवं पोषण सुरक्षा प्रदान करने के लिए।' },
        },
        {
          amount: 'Individual DBT',
          title: { en: 'Mandatory Individual Account', hi: 'अनिवार्य व्यक्तिगत बैंक खाता' },
          desc: { en: 'Current official portal requires an individual bank account in the woman’s own name (joint accounts not accepted).', hi: 'आधिकारिक पोर्टल के अनुसार महिला के अपने नाम पर व्यक्तिगत बैंक खाता होना अनिवार्य है (संयुक्त खाता मान्य नहीं)।' },
        },
      ],
    },
    potentialEligibility: {
      en: [
        'Resident of Chhattisgarh (Source: 2024 State Guidance — verify current rules on portal).',
        'Age must be 21 years or older as of January 1 of the application year (Source: 2024 State Guidance).',
        'Marital status: Married women, including widows, divorced women, and abandoned/deserted women (Source: 2024 State Guidance).',
        'Must have an active individual bank account (not a joint account) seeded with Aadhaar and DBT-enabled (Current Portal Requirement).',
        'Exclusions in 2024 guidance: Family members who are income tax payees, permanent/regular government or PSU employees (contract/honorarium workers exempted per state rules), and former/present constitutional post holders or MPs/MLAs.',
      ],
      hi: [
        'छत्तीसगढ़ की स्थानीय निवासी महिला (स्रोत: 2024 राज्य दिशानिर्देश — पोर्टल पर वर्तमान स्थिति जाँचे)।',
        'आवेदन वर्ष की 1 जनवरी को आयु न्यूनतम 21 वर्ष या उससे अधिक होनी चाहिए (स्रोत: 2024 राज्य दिशानिर्देश)।',
        'वैवाहिक स्थिति: विवाहित महिला, जिसमें विधवा, तलाकशुदा और परित्यक्ता महिलाएँ भी शामिल हैं (स्रोत: 2024 राज्य दिशानिर्देश)।',
        'महिला के अपने नाम पर सक्रिय व्यक्तिगत बैंक खाता होना अनिवार्य है (संयुक्त खाता मान्य नहीं) जो आधार व डीबीटी से जुड़ा हो (वर्तमान पोर्टल आवश्यकता)।',
        '2024 दिशानिर्देश में अपवर्जन: परिवार में आयकर दाता, स्थायी सरकारी/पीएसयू कर्मचारी (मानदेय/संविदा कर्मचारी जैसे आंगनवाड़ी/आशा कार्यकर्ता छूट प्राप्त), तथा सांसद/विधायक/संवैधानिक पदधारक।',
      ],
    },
    keyRules: {
      en: [
        'Beneficiary must be a resident of Chhattisgarh state.',
        'Age must be at least 21 years as per official guidance.',
        'Applicable to married, widowed, divorced, or abandoned women.',
        'Bank account must be strictly individual (joint accounts are rejected on the portal) with active Aadhaar linking and DBT.',
        'Mobile number linked to Aadhaar is required for registration and OTP authentication.',
      ],
      hi: [
        'आवेदक महिला का छत्तीसगढ़ का स्थानीय निवासी होना आवश्यक है।',
        'आधिकारिक दिशानिर्देश के अनुसार आयु कम से कम 21 वर्ष होनी चाहिए।',
        'विवाहित, विधवा, तलाकशुदा या परित्यक्ता महिलाओं के लिए लागू।',
        'बैंक खाता व्यक्तिगत होना अनिवार्य है (पोर्टल पर संयुक्त खाता स्वीकार नहीं किया जाता) जो आधार व डीबीटी से जुड़ा हो।',
        'पंजीकरण और ओटीपी सत्यापन के लिए आधार से जुड़ा सक्रिय मोबाइल नंबर आवश्यक है।',
      ],
    },
    exclusions: {
      en: [
        'Women whose families have an active Income Tax payer (Source: 2024 Guidance — verify current rules).',
        'Families with regular / permanent employees in Central/State Government, PSUs, or local bodies (contractual/honorarium workers such as Anganwadi workers are not excluded as per state guidance).',
        'Families of former or present MPs, MLAs, and holders of constitutional posts.',
        'Applicants having only joint bank accounts without an individual DBT account.',
      ],
      hi: [
        'जिनके परिवार का कोई सदस्य आयकर दाता हो (स्रोत: 2024 दिशानिर्देश — वर्तमान पोर्टल से पुष्टि करें)।',
        'जिनके परिवार का कोई सदस्य केंद्र/राज्य सरकार, पीएसयू या स्थानीय निकाय में नियमित/स्थायी अधिकारी-कर्मचारी हो (संविदा/मानदेय कर्मी जैसे आंगनवाड़ी कार्यकर्ता अपात्र नहीं हैं)।',
        'पूर्व व वर्तमान सांसद, विधायक तथा संवैधानिक पदधारकों के परिवार।',
        'जिनके पास व्यक्तिगत खाता न होकर केवल संयुक्त बैंक खाता है।',
      ],
    },
    documents: [
      {
        id: 'individual-bank-account-mv',
        category: 'both',
        sourceType: 'current_portal',
        label: { en: 'Individual Bank Account (Aadhaar & DBT Enabled)', hi: 'व्यक्तिगत बैंक खाता (आधार एवं DBT सक्रिय)' },
        fields: ['Account Holder Name (Woman herself)', 'Bank Name & Branch', 'Aadhaar Linkage Status', 'DBT Active Status'],
        isMandatory: true,
        note: {
          en: 'Currently confirmed by official portal: Must be an individual savings account in the woman’s own name. Joint accounts are explicitly not accepted.',
          hi: 'आधिकारिक पोर्टल द्वारा वर्तमान में पुष्ट: महिला के अपने नाम पर व्यक्तिगत बचत खाता होना चाहिए। संयुक्त खाता स्वीकार नहीं किया जाता।',
        },
      },
      {
        id: 'aadhaar-card-mv',
        category: 'both',
        sourceType: 'current_portal',
        label: { en: 'Aadhaar Card of Applicant', hi: 'आवेदक महिला का आधार कार्ड' },
        fields: ['Full Name', 'Aadhaar Number (for official portal e-KYC)', 'Date of Birth', 'Address'],
        isMandatory: true,
        note: {
          en: 'Currently confirmed by official portal: Required for identity verification and e-KYC authentication.',
          hi: 'आधिकारिक पोर्टल द्वारा वर्तमान में पुष्ट: पहचान सत्यापन एवं ई-केवाईसी के लिए अनिवार्य।',
        },
      },
      {
        id: 'mobile-number-mv',
        category: 'both',
        sourceType: 'current_portal',
        label: { en: 'Aadhaar-Linked Active Mobile Number', hi: 'आधार से जुड़ा सक्रिय मोबाइल नंबर' },
        fields: ['Mobile Number', 'OTP Reception Capability'],
        isMandatory: true,
        note: {
          en: 'Currently confirmed by official portal: Used for OTP verification during online application submission and payment alerts.',
          hi: 'आधिकारिक पोर्टल द्वारा वर्तमान में पुष्ट: ऑनलाइन आवेदन के समय ओटीपी सत्यापन और भुगतान संदेशों के लिए आवश्यक।',
        },
      },
      {
        id: 'domicile-proof-mv',
        category: 'both',
        sourceType: 'dated_guidance',
        label: { en: 'Chhattisgarh Residence / Domicile Certificate', hi: 'छत्तीसगढ़ निवास प्रमाण पत्र / स्थानीय निवास प्रमाण' },
        fields: ['Applicant Name', 'Resident Address in Chhattisgarh', 'Issuing Authority / Panchayat / Ward'],
        isMandatory: false,
        note: {
          en: 'Listed in 2024 State Guidance: Domicile certificate, Ration card, or Voter ID showing residence in Chhattisgarh (Verify current requirements on portal).',
          hi: '2024 राज्य दिशानिर्देश में दर्ज: निवास प्रमाण पत्र, राशन कार्ड या मतदाता परिचय पत्र (पोर्टल पर वर्तमान आवश्यकता की पुष्टि करें)।',
        },
      },
      {
        id: 'marital-status-proof-mv',
        category: 'both',
        sourceType: 'dated_guidance',
        label: { en: 'Marital Status Proof', hi: 'विवाह / वैवाहिक स्थिति प्रमाण' },
        fields: ['Marriage Certificate or Self-Declaration / Ward Certificate', 'Death Certificate of husband (for widows)', 'Court decree (for divorce)'],
        isMandatory: false,
        note: {
          en: 'Listed in 2024 State Guidance: Marriage certificate, local self-declaration / panchayat proof. For widows: husband’s death certificate. For divorced: decree. (Verify on portal).',
          hi: '2024 राज्य दिशानिर्देश में दर्ज: विवाह प्रमाण पत्र या स्थानीय स्व-घोषणा। विधवाओं के लिए पति का मृत्यु प्रमाण पत्र; तलाकशुदा के लिए न्यायालय आदेश (पोर्टल पर पुष्टि करें)।',
        },
      },
      {
        id: 'age-proof-mv',
        category: 'both',
        sourceType: 'dated_guidance',
        label: { en: 'Age Verification Document (21+ Years)', hi: 'आयु सत्यापन दस्तावेज़ (21 वर्ष या अधिक)' },
        fields: ['Date of Birth / Age', 'Class 10 Marksheet, School Certificate, Birth Certificate, or Voter ID'],
        isMandatory: false,
        note: {
          en: 'Listed in 2024 State Guidance: Document confirming age 21 or older as of January 1 (Verify on portal).',
          hi: '2024 राज्य दिशानिर्देश में दर्ज: 1 जनवरी को 21 वर्ष या अधिक आयु प्रमाणित करने वाला दस्तावेज़ (पोर्टल पर पुष्टि करें)।',
        },
      },
      {
        id: 'ration-card-mv',
        category: 'both',
        sourceType: 'dated_guidance',
        label: { en: 'Family Ration Card', hi: 'पारिवारिक राशन कार्ड' },
        fields: ['Ration Card Number', 'Family Member Names'],
        isMandatory: false,
        note: {
          en: 'Listed in 2024 State Guidance: Family ration card listing the applicant’s name (Verify on portal).',
          hi: '2024 राज्य दिशानिर्देश में दर्ज: परिवार का राशन कार्ड जिसमें आवेदक का नाम दर्ज हो (पोर्टल पर पुष्टि करें)।',
        },
      },
    ],
    applicationRoutes: {
      online: {
        name: { en: 'Official Mahtari Vandan Portal (Self / Citizen Login)', hi: 'आधिकारिक मह्तारी वंदन पोर्टल (नागरिक लॉगिन / स्व-आवेदन)' },
        url: 'https://mahtarivandan.cgstate.gov.in/',
        desc: {
          en: 'Official web portal to check application status, beneficiary list, and active notification guidelines.',
          hi: 'आवेदन की स्थिति, अनंतिम/अंतिम सूची और सक्रिय दिशा-निर्देश देखने के लिए आधिकारिक वेब पोर्टल।',
        },
      },
      csc: {
        name: { en: 'Anganwadi Centre / Gram Panchayat / Ward Office', hi: 'आंगनबाड़ी केंद्र / ग्राम पंचायत / वार्ड कार्यालय' },
        url: 'https://mahtarivandan.cgstate.gov.in/',
        desc: {
          en: 'Offline facilitation centres designated by the state where field functionaries accept physical forms and verify documents during active application cycles.',
          hi: 'सक्रिय आवेदन चक्र के दौरान राज्य द्वारा निर्धारित केंद्र जहाँ मैदानी कार्यकर्ता फ़ॉर्म प्राप्त कर सत्यापन करते हैं।',
        },
      },
    },
    additionalSources: [
      {
        title: { en: 'Official DPR Chhattisgarh Press Release (Jan 2024)', hi: 'आधिकारिक जनसंपर्क छत्तीसगढ़ प्रेस विज्ञप्ति (जनवरी 2024)' },
        url: 'https://jansampark.cg.gov.in/dprnewsportal/NewsDetails.aspx?param=dvzOSw7DUJM%3D&type=TQwAi5bC7eg%3D',
        note: { en: 'Official state announcement outlining initial scheme framework and criteria.', hi: 'प्रारंभिक योजना रूपरेखा और पात्रता मानदंड घोषित करने वाली राज्य प्रेस विज्ञप्ति।' },
      },
      {
        title: { en: 'DPR Chhattisgarh Cabinet Decision Notification (2024)', hi: 'जनसंपर्क छत्तीसगढ़ कैबिनेट निर्णय अधिसूचना (2024)' },
        url: 'https://jansampark.cg.gov.in/dprnewsportal/NewsPopup.aspx?param=hPUV317g4Q4%3D&type=TQwAi5bC7eg%3D',
        note: { en: 'Details cabinet approval of Mahtari Vandan Yojana guidelines.', hi: 'मह्तारी वंदन योजना के कैबिनेट अनुमोदन संबंधी विवरण।' },
      },
    ],
    sources: [
      {
        id: 'mahtari-portal-benefits-bank',
        title: {
          en: 'Official Mahtari Vandan Portal (Chhattisgarh)',
          hi: 'आधिकारिक मह्तारी वंदन पोर्टल (छत्तीसगढ़ शासन)',
        },
        url: 'https://mahtarivandan.cgstate.gov.in/',
        supportsDetail: {
          en: 'Benefits: ₹1,000/month DBT; Individual bank account mandate (joint accounts strictly rejected); active Aadhaar linking & DBT',
          hi: 'लाभ: ₹1,000/माह डीबीटी; अनिवार्य व्यक्तिगत बैंक खाता (संयुक्त खाता कतई मान्य नहीं); सक्रिय आधार डीबीटी',
        },
        checkedDate: 'October 20, 2026',
        status: 'verified',
        statusNote: {
          en: 'Confirmed on current official portal guidelines.',
          hi: 'वर्तमान आधिकारिक पोर्टल दिशा-निर्देशों पर पुष्ट।',
        },
      },
      {
        id: 'mahtari-dpr-press-eligibility',
        title: {
          en: 'Chhattisgarh DPR Press Release (News Details #dvzOSw7DUJM)',
          hi: 'छत्तीसगढ़ जनसंपर्क समाचार पोर्टल (विज्ञप्ति #dvzOSw7DUJM)',
        },
        url: 'https://jansampark.cg.gov.in/dprnewsportal/NewsDetails.aspx?param=dvzOSw7DUJM%3D&type=TQwAi5bC7eg%3D',
        supportsDetail: {
          en: 'Eligibility criteria (Chhattisgarh domicile, minimum age 21 as of Jan 1, married/widowed/divorced/abandoned women)',
          hi: 'पात्रता मानदंड (छत्तीसगढ़ स्थानीय निवासी, 1 जनवरी को न्यूनतम आयु 21 वर्ष, विवाहित/विधवा/तलाकशुदा/परित्यक्ता महिला)',
        },
        checkedDate: 'October 20, 2026',
        status: 'needs_review',
        statusNote: {
          en: 'Published in 2024 state guidance. Please verify current cycle rules on the official portal.',
          hi: '2024 राज्य दिशानिर्देश में प्रकाशित। कृपया वर्तमान चक्र के नियमों की पुष्टि आधिकारिक पोर्टल पर करें।',
        },
      },
      {
        id: 'mahtari-dpr-press-exclusions',
        title: {
          en: 'Chhattisgarh DPR Cabinet Notification Brief (#hPUV317g4Q4)',
          hi: 'छत्तीसगढ़ जनसंपर्क कैबिनेट अधिसूचना सारांश (#hPUV317g4Q4)',
        },
        url: 'https://jansampark.cg.gov.in/dprnewsportal/NewsPopup.aspx?param=hPUV317g4Q4%3D&type=TQwAi5bC7eg%3D',
        supportsDetail: {
          en: 'Exclusions: Income tax payee families and regular govt employees; exemption for Anganwadi/ASHA honorarium workers',
          hi: 'अपवर्जन: आयकर दाता परिवार एवं नियमित सरकारी कर्मचारी; आंगनवाड़ी/आशा मानदेय कर्मियों को छूट',
        },
        checkedDate: 'October 20, 2026',
        status: 'needs_review',
        statusNote: {
          en: 'Sourced from 2024 cabinet decision guidance — confirm current exclusion checks on portal.',
          hi: '2024 कैबिनेट निर्णय दिशानिर्देश से प्राप्त — पोर्टल पर वर्तमान अपवर्जन नियमों की पुष्टि करें।',
        },
      },
      {
        id: 'mahtari-portal-active-window',
        title: {
          en: 'Department of Women & Child Development — Application Intake Circulars',
          hi: 'महिला एवं बाल विकास विभाग — आवेदन प्राप्ति परिपत्र',
        },
        url: 'https://mahtarivandan.cgstate.gov.in/',
        supportsDetail: {
          en: 'Current application window, supplementary cycles, and local verification dates',
          hi: 'वर्तमान आवेदन समय-सीमा, पूरक चक्र और स्थानीय सत्यापन तिथियाँ',
        },
        checkedDate: 'October 20, 2026',
        status: 'unconfirmed',
        statusNote: {
          en: 'Application cycles are announced periodically by the state government. Do not rely on old 2024 deadlines; please check current status on the official portal.',
          hi: 'आवेदन चक्र राज्य शासन द्वारा समय-समय पर घोषित किए जाते हैं। 2024 की पुरानी तारीखों पर निर्भर न रहें; वर्तमान स्थिति सीधे आधिकारिक पोर्टल पर देखें।',
        },
      },
      {
        id: 'mahtari-local-facilitation',
        title: {
          en: 'Anganwadi & Urban Ward Facilitation Center Network',
          hi: 'आंगनबाड़ी एवं नगरीय वार्ड सुविधा केंद्र नेटवर्क',
        },
        url: 'https://mahtarivandan.cgstate.gov.in/',
        supportsDetail: {
          en: 'Offline physical form submission and document verification desks',
          hi: 'ऑफ़लाइन भौतिक फ़ॉर्म जमा करने और दस्तावेज़ सत्यापन केंद्र',
        },
        checkedDate: 'October 20, 2026',
        status: 'verified',
        statusNote: {
          en: 'Assisted in-person facilitation during active government drives.',
          hi: 'सक्रिय सरकारी अभियानों के दौरान सहायता-प्राप्त व्यक्तिगत सुविधा।',
        },
      },
    ],
  },
];

export type EvaluationCriteriaCheck = {
  id: string;
  label: Record<Language, string>;
  status: 'pass' | 'fail' | 'need_info';
  detail: Record<Language, string>;
};

export type EvaluationResult = {
  status: MatchStatus;
  reasons: string[];
  checks: EvaluationCriteriaCheck[];
};

export function evaluateScheme(
  scheme: Scheme,
  profile: Record<string, unknown>,
  answers: CombinedEligibilityAnswers,
  lang: Language = 'en'
): EvaluationResult {
  if (scheme.id === 'pm-kisan') {
    return evaluatePMKisan(scheme, profile, answers, lang);
  }
  if (scheme.id === 'mahtari-vandan') {
    return evaluateMahtariVandan(scheme, profile, answers, lang);
  }
  return evaluatePMUSP(scheme, profile, answers, lang);
}

function evaluatePMUSP(
  _scheme: Scheme,
  profile: Record<string, unknown>,
  answers: CombinedEligibilityAnswers,
  lang: Language = 'en'
): EvaluationResult {
  const reasons: string[] = [];
  const checks: EvaluationCriteriaCheck[] = [];

  // 1. Group Check (Must be student)
  const group = profile.group as string | undefined;
  if (!group) {
    checks.push({
      id: 'group',
      label: { en: 'Applicant Category', hi: 'आवेदक श्रेणी' },
      status: 'need_info',
      detail: { en: 'Select your applicant group in your profile.', hi: 'अपनी प्रोफ़ाइल में आवेदक समूह चुनें।' },
    });
  } else if (group === 'student') {
    checks.push({
      id: 'group',
      label: { en: 'Student Status', hi: 'विद्यार्थी स्थिति' },
      status: 'pass',
      detail: { en: 'Matches PM-USP scheme category (Higher Education Student).', hi: 'पीएम-यूएसपी योजना श्रेणी (उच्च शिक्षा विद्यार्थी) से मेल खाता है।' },
    });
    reasons.push(lang === 'hi' ? 'उच्च शिक्षा विद्यार्थी श्रेणी से मेल खाता है।' : 'Matches the Higher Education Student category.');
  } else {
    checks.push({
      id: 'group',
      label: { en: 'Student Status', hi: 'विद्यार्थी स्थिति' },
      status: 'fail',
      detail: { en: 'This scheme is specifically for regular college and university students.', hi: 'यह योजना केवल नियमित कॉलेज और विश्वविद्यालय के विद्यार्थियों के लिए है।' },
    });
    reasons.push(lang === 'hi' ? 'यह योजना केवल कॉलेज/विश्वविद्यालय के नियमित विद्यार्थियों के लिए है।' : 'This scheme is only for regular college/university students.');
  }

  // 2. Application Type (Fresh vs Renewal)
  const appType = answers.applicationType;
  if (!appType) {
    checks.push({
      id: 'app_type',
      label: { en: 'Application Pathway', hi: 'आवेदन मार्ग' },
      status: 'need_info',
      detail: { en: 'Select whether you are applying fresh (1st year) or renewing (subsequent years).', hi: 'चुनें कि आप नया आवेदन (प्रथम वर्ष) कर रहे हैं या नवीनीकरण (आगामी वर्ष)।' },
    });
    reasons.push(lang === 'hi' ? 'नया आवेदन या नवीनीकरण चुनना बाकी है।' : 'Select fresh or renewal application to continue.');
  } else {
    checks.push({
      id: 'app_type',
      label: { en: 'Application Pathway', hi: 'आवेदन मार्ग' },
      status: 'pass',
      detail: {
        en: appType === 'fresh' ? 'Fresh application (Class 12 / 1st Year Degree entry).' : 'Renewal application (Continuing degree study).',
        hi: appType === 'fresh' ? 'नया आवेदन (12वीं उत्तीर्ण / डिग्री प्रथम वर्ष प्रवेश)।' : 'नवीनीकरण आवेदन (डिग्री अध्ययन जारी)।',
      },
    });
  }

  // 3. Class 12 Board, Stream & 80th Percentile (for Fresh applications)
  if (appType === 'fresh') {
    if (!answers.class12Board || !answers.class12Stream) {
      checks.push({
        id: 'board_stream',
        label: { en: 'Class 12 Board & Stream', hi: 'कक्षा 12वीं बोर्ड व संकाय' },
        status: 'need_info',
        detail: { en: 'Enter your Class 12 board, stream, and passing year to match against board quota.', hi: 'बोर्ड कोटे से मिलान के लिए 12वीं बोर्ड, संकाय और उत्तीर्ण वर्ष दर्ज करें।' },
      });
      reasons.push(lang === 'hi' ? '12वीं बोर्ड और संकाय (स्ट्रीम) की जानकारी आवश्यक है।' : 'Class 12 board and stream details are required.');
    } else {
      checks.push({
        id: 'board_stream',
        label: { en: 'Class 12 Board & Stream', hi: 'कक्षा 12वीं बोर्ड व संकाय' },
        status: 'pass',
        detail: {
          en: `Board: ${answers.class12Board} (${answers.class12Stream.toUpperCase()}, Year: ${answers.class12PassingYear || 'Recent'}).`,
          hi: `बोर्ड: ${answers.class12Board} (${answers.class12Stream}, वर्ष: ${answers.class12PassingYear || 'हाल ही में'})।`,
        },
      });
    }

    if (answers.above80thPercentile === 'yes') {
      checks.push({
        id: 'percentile',
        label: { en: 'Class 12 Board 80th Percentile Standing', hi: '12वीं बोर्ड 80वीं पर्सेंटाइल स्थिति' },
        status: 'pass',
        detail: {
          en: 'You confirmed standing above the 80th percentile of successful candidates in your stream and board.',
          hi: 'आपने अपने संकाय और बोर्ड के सफल उम्मीदवारों में 80वीं पर्सेंटाइल से ऊपर होने की पुष्टि की है।',
        },
      });
      reasons.push(lang === 'hi' ? '12वीं बोर्ड की 80वीं पर्सेंटाइल कट-ऑफ की शर्त पूरी होती है।' : 'Meets the Class 12 board 80th percentile cut-off condition.');
    } else if (answers.above80thPercentile === 'no') {
      checks.push({
        id: 'percentile',
        label: { en: 'Class 12 Board 80th Percentile Standing', hi: '12वीं बोर्ड 80वीं पर्सेंटाइल स्थिति' },
        status: 'fail',
        detail: {
          en: 'The scheme strictly requires candidates to be above the 80th percentile in the relevant stream and board.',
          hi: 'योजना के नियम अनुसार संबंधित संकाय और बोर्ड में 80वीं पर्सेंटाइल से ऊपर होना अनिवार्य है।',
        },
      });
      reasons.push(lang === 'hi' ? '80वीं पर्सेंटाइल से नीचे होने पर यह योजना लागू नहीं होती।' : 'Does not appear to meet the 80th percentile standing requirement.');
    } else {
      checks.push({
        id: 'percentile',
        label: { en: 'Class 12 Board 80th Percentile Standing', hi: '12वीं बोर्ड 80वीं पर्सेंटाइल स्थिति' },
        status: 'need_info',
        detail: {
          en: 'Percentile standing is relative rank cut-off for your specific board & stream. It cannot be inferred from marks percentage alone (e.g. 80% marks does not automatically mean 80th percentile). Check your board cut-off list.',
          hi: 'पर्सेंटाइल का अर्थ बोर्ड व संकाय की सापेक्ष रैंक कट-ऑफ है। इसे केवल अंकों के प्रतिशत से नहीं आँका जा सकता (जैसे 80% अंक का अर्थ स्वतः 80वीं पर्सेंटाइल नहीं होता)। अपने बोर्ड की कट-ऑफ सूची देखें।',
        },
      });
      reasons.push(lang === 'hi' ? '80वीं पर्सेंटाइल की पुष्टि बोर्ड कट-ऑफ सूची से होना बाकी है।' : 'Board 80th percentile cut-off standing requires confirmation.');
    }
  }

  // 4. Regular Degree Course
  if (answers.regularDegreeCourse === 'yes') {
    checks.push({
      id: 'regular_course',
      label: { en: 'Regular Degree Course', hi: 'नियमित डिग्री पाठ्यक्रम' },
      status: 'pass',
      detail: { en: 'Enrolled in a regular (full-time) degree course.', hi: 'नियमित (पूर्णकालिक) डिग्री पाठ्यक्रम में नामांकित।' },
    });
    reasons.push(lang === 'hi' ? 'नियमित (पूर्णकालिक) डिग्री पाठ्यक्रम में नामांकित हैं।' : 'Enrolled in a regular full-time degree course.');
  } else if (answers.regularDegreeCourse === 'no') {
    checks.push({
      id: 'regular_course',
      label: { en: 'Regular Degree Course', hi: 'नियमित डिग्री पाठ्यक्रम' },
      status: 'fail',
      detail: { en: 'Diploma, correspondence, and distance education courses are excluded.', hi: 'डिप्लोमा, पत्राचार और दूरस्थ शिक्षा पाठ्यक्रम योजना के तहत अपात्र हैं।' },
    });
    reasons.push(lang === 'hi' ? 'पत्राचार या डिप्लोमा पाठ्यक्रम इस योजना में पात्र नहीं हैं।' : 'Distance, correspondence, and diploma courses are excluded.');
  } else {
    checks.push({
      id: 'regular_course',
      label: { en: 'Regular Degree Course', hi: 'नियमित डिग्री पाठ्यक्रम' },
      status: 'need_info',
      detail: { en: 'Confirm whether your course is regular (full-time) degree study.', hi: 'पुष्टि करें कि क्या आपका पाठ्यक्रम नियमित (पूर्णकालिक) डिग्री है।' },
    });
  }

  // 5. Recognized Institution
  if (answers.recognizedInstitution === 'yes') {
    checks.push({
      id: 'institution',
      label: { en: 'Recognized Institution', hi: 'मान्यता प्राप्त संस्थान' },
      status: 'pass',
      detail: { en: 'College or university is recognized by UGC/AICTE or relevant regulatory bodies.', hi: 'कॉलेज/विश्वविद्यालय यूजीसी/एआईसीटीई या संबंधित नियामक संस्था से मान्यता प्राप्त है।' },
    });
    reasons.push(lang === 'hi' ? 'मान्यता प्राप्त संस्थान में अध्ययनरत हैं।' : 'Studying in a recognized higher educational institution.');
  } else if (answers.recognizedInstitution === 'no') {
    checks.push({
      id: 'institution',
      label: { en: 'Recognized Institution', hi: 'मान्यता प्राप्त संस्थान' },
      status: 'fail',
      detail: { en: 'The institution must be officially recognized for NSP verification.', hi: 'एनएसपी सत्यापन के लिए संस्थान का आधिकारिक मान्यता प्राप्त होना आवश्यक है।' },
    });
    reasons.push(lang === 'hi' ? 'संस्थान आधिकारिक रूप से मान्यता प्राप्त होना चाहिए।' : 'Institution must be recognized for scholarship awards.');
  } else {
    checks.push({
      id: 'institution',
      label: { en: 'Recognized Institution', hi: 'मान्यता प्राप्त संस्थान' },
      status: 'need_info',
      detail: { en: 'Confirm whether your college/university is officially recognized.', hi: 'पुष्टि करें कि आपका संस्थान आधिकारिक रूप से मान्यता प्राप्त है।' },
    });
  }

  // 6. Annual Family Income Ceiling (₹4,50,000)
  if (answers.familyIncomeRange === 'upto_450k') {
    checks.push({
      id: 'income',
      label: { en: 'Family Income Ceiling (≤ ₹4,50,000)', hi: 'पारिवारिक आय सीमा (≤ ₹4,50,000)' },
      status: 'pass',
      detail: { en: 'Gross annual family income is within the ₹4,50,000 ceiling.', hi: 'कुल वार्षिक पारिवारिक आय ₹4,50,000 की सीमा के भीतर है।' },
    });
    reasons.push(lang === 'hi' ? 'पारिवारिक वार्षिक आय ₹4.5 लाख की निर्धारित सीमा के भीतर है।' : 'Family income is within the ₹4,50,000 ceiling.');
  } else if (answers.familyIncomeRange === 'above_450k') {
    checks.push({
      id: 'income',
      label: { en: 'Family Income Ceiling (≤ ₹4,50,000)', hi: 'पारिवारिक आय सीमा (≤ ₹4,50,000)' },
      status: 'fail',
      detail: { en: 'Gross annual family income exceeds the ₹4,50,000 ceiling listed on myScheme.', hi: 'कुल वार्षिक पारिवारिक आय myScheme पर दर्ज ₹4,50,000 की सीमा से अधिक है।' },
    });
    reasons.push(lang === 'hi' ? 'पारिवारिक आय ₹4.5 लाख से अधिक होने के कारण नियम मेल नहीं खाता।' : 'Gross annual family income exceeds the ₹4,50,000 ceiling.');
  } else {
    checks.push({
      id: 'income',
      label: { en: 'Family Income Ceiling (≤ ₹4,50,000)', hi: 'पारिवारिक आय सीमा (≤ ₹4,50,000)' },
      status: 'need_info',
      detail: { en: 'Confirm whether annual family income is at or below ₹4,50,000.', hi: 'पुष्टि करें कि क्या वार्षिक पारिवारिक आय ₹4,50,000 या उससे कम है।' },
    });
  }

  // 7. Other Scholarship Exclusion
  if (answers.otherScholarshipReceived === 'none') {
    checks.push({
      id: 'other_scholarship',
      label: { en: 'No Other Scholarship Exclusion', hi: 'अन्य छात्रवृत्ति अपवर्जन नियम' },
      status: 'pass',
      detail: { en: 'Not receiving any other scholarship or state fee waiver.', hi: 'अन्य कोई छात्रवृत्ति या राज्य शुल्क छूट प्राप्त नहीं कर रहे हैं।' },
    });
    reasons.push(lang === 'hi' ? 'अन्य कोई छात्रवृत्ति या शुल्क छूट नहीं ले रहे हैं (बहिष्कृत नहीं हैं)।' : 'Not receiving any other scholarship (not excluded).');
  } else if (answers.otherScholarshipReceived === 'receiving') {
    checks.push({
      id: 'other_scholarship',
      label: { en: 'No Other Scholarship Exclusion', hi: 'अन्य छात्रवृत्ति अपवर्जन नियम' },
      status: 'fail',
      detail: { en: 'Students receiving other scholarship benefits or state fee waivers are listed as excluded.', hi: 'अन्य छात्रवृत्ति या राज्य शुल्क छूट का लाभ ले रहे विद्यार्थी बहिष्कृत सूची में हैं।' },
    });
    reasons.push(lang === 'hi' ? 'अन्य छात्रवृत्ति/शुल्क छूट लेने वाले विद्यार्थी योजना से बाहर हैं।' : 'Receiving another scholarship or state waiver is an exclusion.');
  } else {
    checks.push({
      id: 'other_scholarship',
      label: { en: 'No Other Scholarship Exclusion', hi: 'अन्य छात्रवृत्ति अपवर्जन नियम' },
      status: 'need_info',
      detail: { en: 'Confirm whether you receive any other scholarship or fee waiver.', hi: 'पुष्टि करें कि क्या आपको कोई अन्य छात्रवृत्ति या शुल्क छूट मिल रही है।' },
    });
  }

  // 8. Aadhaar Seeded Bank Account
  if (answers.aadhaarSeededBankAccount === 'yes') {
    checks.push({
      id: 'bank_aadhaar',
      label: { en: 'Aadhaar-Seeded Bank Account (DBT)', hi: 'आधार से जुड़ा बैंक खाता (DBT)' },
      status: 'pass',
      detail: { en: 'Active bank account in student’s name seeded with Aadhaar.', hi: 'छात्र के नाम पर सक्रिय बैंक खाता आधार से जुड़ा हुआ है।' },
    });
    reasons.push(lang === 'hi' ? 'डीबीटी के लिए आधार-सीडेड बैंक खाता तैयार है।' : 'Active Aadhaar-seeded bank account confirmed for disbursal.');
  } else if (answers.aadhaarSeededBankAccount === 'no' || answers.aadhaarSeededBankAccount === 'in_process') {
    checks.push({
      id: 'bank_aadhaar',
      label: { en: 'Aadhaar-Seeded Bank Account (DBT)', hi: 'आधार से जुड़ा बैंक खाता (DBT)' },
      status: 'need_info',
      detail: {
        en: 'Disbursal requires an active personal bank account seeded with Aadhaar. You can seed it at your bank branch or via NPCI before final NSP disbursal.',
        hi: 'छात्रवृत्ति राशि पाने के लिए छात्र के नाम का बैंक खाता आधार से जुड़ा होना अनिवार्य है। एनएसपी आवेदन से पहले बैंक शाखा में जाकर इसे लिंक करवाएँ।',
      },
    });
    reasons.push(lang === 'hi' ? 'बैंक खाते को आधार से लिंक (सीड) कराना आवश्यक है।' : 'Bank account must be seeded with Aadhaar for disbursal.');
  } else {
    checks.push({
      id: 'bank_aadhaar',
      label: { en: 'Aadhaar-Seeded Bank Account (DBT)', hi: 'आधार से जुड़ा बैंक खाता (DBT)' },
      status: 'need_info',
      detail: { en: 'Confirm whether you have an active bank account in your name seeded with Aadhaar.', hi: 'पुष्टि करें कि क्या आपका अपना बैंक खाता आधार से जुड़ा है।' },
    });
  }

  // 9. Renewal Conditions (if renewal selected)
  if (appType === 'renewal') {
    if (answers.annualExamMarks50Plus === 'yes') {
      checks.push({
        id: 'renewal_marks',
        label: { en: 'Annual Exam Marks (≥ 50%)', hi: 'वार्षिक परीक्षा अंक (≥ 50%)' },
        status: 'pass',
        detail: { en: 'Scored at least 50% marks in the annual examination.', hi: 'वार्षिक परीक्षा में न्यूनतम 50% अंक प्राप्त किए।' },
      });
      reasons.push(lang === 'hi' ? 'नवीनीकरण के लिए वार्षिक परीक्षा में न्यूनतम 50% अंक पूरे हैं।' : 'Met the 50% marks renewal requirement.');
    } else if (answers.annualExamMarks50Plus === 'no') {
      checks.push({
        id: 'renewal_marks',
        label: { en: 'Annual Exam Marks (≥ 50%)', hi: 'वार्षिक परीक्षा अंक (≥ 50%)' },
        status: 'fail',
        detail: { en: 'Renewal requires at least 50% marks in the annual examination as per myScheme.', hi: 'myScheme के अनुसार नवीनीकरण के लिए वार्षिक परीक्षा में कम से कम 50% अंक आवश्यक हैं।' },
      });
      reasons.push(lang === 'hi' ? 'नवीनीकरण के लिए 50% अंकों की न्यूनतम शर्त पूरी नहीं होती।' : 'Does not meet the 50% marks requirement for renewal.');
    } else {
      checks.push({
        id: 'renewal_marks',
        label: { en: 'Annual Exam Marks (≥ 50%)', hi: 'वार्षिक परीक्षा अंक (≥ 50%)' },
        status: 'need_info',
        detail: { en: 'Confirm whether you scored at least 50% marks in the previous annual examination.', hi: 'पुष्टि करें कि क्या आपने पिछली वार्षिक परीक्षा में कम से कम 50% अंक प्राप्त किए।' },
      });
    }

    if (answers.attendance75Plus === 'yes') {
      checks.push({
        id: 'renewal_attendance',
        label: { en: 'Attendance in Academic Year (≥ 75%)', hi: 'शैक्षणिक वर्ष में उपस्थिति (≥ 75%)' },
        status: 'pass',
        detail: { en: 'Maintained at least 75% attendance in the academic year.', hi: 'शैक्षणिक वर्ष में कम से कम 75% उपस्थिति दर्ज की गई।' },
      });
      reasons.push(lang === 'hi' ? 'नवीनीकरण के लिए न्यूनतम 75% उपस्थिति की शर्त पूरी है।' : 'Met the 75% attendance renewal condition.');
    } else if (answers.attendance75Plus === 'no') {
      checks.push({
        id: 'renewal_attendance',
        label: { en: 'Attendance in Academic Year (≥ 75%)', hi: 'शैक्षणिक वर्ष में उपस्थिति (≥ 75%)' },
        status: 'fail',
        detail: { en: 'Renewal requires at least 75% attendance in the academic year as per myScheme.', hi: 'myScheme के अनुसार नवीनीकरण के लिए शैक्षणिक वर्ष में कम से कम 75% उपस्थिति आवश्यक है।' },
      });
      reasons.push(lang === 'hi' ? 'नवीनीकरण के लिए 75% उपस्थिति की न्यूनतम शर्त पूरी नहीं होती।' : 'Does not meet the 75% attendance requirement for renewal.');
    } else {
      checks.push({
        id: 'renewal_attendance',
        label: { en: 'Attendance in Academic Year (≥ 75%)', hi: 'शैक्षणिक वर्ष में उपस्थिति (≥ 75%)' },
        status: 'need_info',
        detail: { en: 'Confirm whether you maintained at least 75% attendance.', hi: 'पुष्टि करें कि क्या आपकी उपस्थिति कम से कम 75% रही।' },
      });
    }
  }

  // Status resolution
  const hasFail = checks.some((c) => c.status === 'fail');
  const hasNeedInfo = checks.some((c) => c.status === 'need_info');

  let status: MatchStatus = 'possible';
  if (hasFail) {
    status = 'no_match';
  } else if (hasNeedInfo) {
    status = 'need_info';
  }

  return { status, reasons, checks };
}

function evaluatePMKisan(
  _scheme: Scheme,
  profile: Record<string, unknown>,
  answers: CombinedEligibilityAnswers,
  lang: Language = 'en'
): EvaluationResult {
  const reasons: string[] = [];
  const checks: EvaluationCriteriaCheck[] = [];

  // 1. Group / Farmer Category
  const group = profile.group as string | undefined;
  if (!group) {
    checks.push({
      id: 'kisan_group',
      label: { en: 'Applicant Group', hi: 'आवेदक श्रेणी' },
      status: 'need_info',
      detail: { en: 'Select your applicant group (Farmer) in your profile.', hi: 'अपनी प्रोफ़ाइल में आवेदक समूह (किसान) चुनें।' },
    });
  } else if (group === 'farmer') {
    checks.push({
      id: 'kisan_group',
      label: { en: 'Farmer Category', hi: 'किसान श्रेणी' },
      status: 'pass',
      detail: { en: 'Applicant profile matches Farmer category for PM-KISAN.', hi: 'आवेदक प्रोफ़ाइल पीएम-किसान योजना श्रेणी (किसान) से मेल खाती है।' },
    });
    reasons.push(lang === 'hi' ? 'किसान श्रेणी से मेल खाता है।' : 'Matches the Farmer category.');
  } else {
    checks.push({
      id: 'kisan_group',
      label: { en: 'Farmer Category', hi: 'किसान श्रेणी' },
      status: 'pass',
      detail: { en: 'PM-KISAN is specifically meant for landholding farmer families.', hi: 'पीएम-किसान विशेष रूप से भूमिधारक किसान परिवारों के लिए है।' },
    });
  }

  // 2. Farmer Family Status (husband, wife, minor children)
  if (answers.isFarmerFamily === 'yes') {
    checks.push({
      id: 'kisan_family',
      label: { en: 'Farmer Family Definition', hi: 'किसान परिवार की परिभाषा' },
      status: 'pass',
      detail: {
        en: 'Applicant is part of a farmer family (defined on PM-KISAN portal as husband, wife, and minor children).',
        hi: 'आवेदक किसान परिवार (पीएम-किसान पोर्टल के अनुसार पति, पत्नी और नाबालिग बच्चे) का हिस्सा है।',
      },
    });
    reasons.push(lang === 'hi' ? 'किसान परिवार (पति, पत्नी और नाबालिग बच्चे) की शर्त पूरी है।' : 'Applicant qualifies as a farmer family.');
  } else if (answers.isFarmerFamily === 'no') {
    checks.push({
      id: 'kisan_family',
      label: { en: 'Farmer Family Definition', hi: 'किसान परिवार की परिभाषा' },
      status: 'fail',
      detail: {
        en: 'PM-KISAN is strictly restricted to landholding farmer families.',
        hi: 'पीएम-किसान केवल भूमिधारक किसान परिवारों के लिए निर्धारित है।',
      },
    });
    reasons.push(lang === 'hi' ? 'यह योजना केवल किसान परिवारों के लिए है।' : 'Scheme is exclusively for farmer families.');
  } else {
    checks.push({
      id: 'kisan_family',
      label: { en: 'Farmer Family Definition', hi: 'किसान परिवार की परिभाषा' },
      status: 'need_info',
      detail: {
        en: 'Confirm whether applicant is part of a farmer family (husband, wife, and minor children).',
        hi: 'पुष्टि करें कि क्या आप किसान परिवार (पति, पत्नी और नाबालिग बच्चे) से हैं।',
      },
    });
  }

  // 3. Cultivable Landholding in Name (Land size alone is not an exclusion)
  if (answers.hasCultivableLandInName === 'yes') {
    checks.push({
      id: 'kisan_land',
      label: { en: 'Cultivable Landholding in Family Name', hi: 'परिवार के नाम पर खेती योग्य भूमि' },
      status: 'pass',
      detail: {
        en: 'Cultivable land is registered in family member’s name. Note: Scheme is open to all landholding sizes (not limited only to small and marginal farmers).',
        hi: 'परिवार के सदस्य के नाम पर खेती योग्य जमीन दर्ज है। नोट: योजना सभी जोत आकारों के लिए खुली है (केवल छोटे व सीमांत किसानों तक सीमित नहीं)।',
      },
    });
    reasons.push(lang === 'hi' ? 'खेती योग्य भूमि का स्वामित्व प्रमाणित है (भूमि के आकार की कोई बाधा नहीं)।' : 'Cultivable landholding is recorded in family name (open to all land sizes).');
  } else if (answers.hasCultivableLandInName === 'no') {
    checks.push({
      id: 'kisan_land',
      label: { en: 'Cultivable Landholding in Family Name', hi: 'परिवार के नाम पर खेती योग्य भूमि' },
      status: 'fail',
      detail: {
        en: 'Beneficiary must possess cultivable landholding in their name in official land records.',
        hi: 'राजस्व अभिलेखों में परिवार के नाम पर खेती योग्य भूमि का दर्ज होना अनिवार्य है।',
      },
    });
    reasons.push(lang === 'hi' ? 'परिवार के नाम खेती योग्य भूमि दर्ज न होने से यह नियम मेल नहीं खाता।' : 'Does not appear to meet the cultivable landholding criterion.');
  } else {
    checks.push({
      id: 'kisan_land',
      label: { en: 'Cultivable Landholding in Family Name', hi: 'परिवार के नाम पर खेती योग्य भूमि' },
      status: 'need_info',
      detail: {
        en: 'Confirm whether cultivable land is officially recorded in the name of a family member in revenue records.',
        hi: 'पुष्टि करें कि क्या राजस्व अभिलेखों में परिवार के सदस्य के नाम खेती योग्य जमीन दर्ज है।',
      },
    });
  }

  // 4. Institutional Landholder Exclusion
  if (answers.isInstitutionalLandholder === 'no') {
    checks.push({
      id: 'kisan_inst_land',
      label: { en: 'Non-Institutional Landholder', hi: 'गैर-संस्थागत भूमिधारक' },
      status: 'pass',
      detail: { en: 'Not an institutional landholder (meets the non-exclusion rule).', hi: 'संस्थागत भूमिधारक नहीं हैं (अपवर्जन नियम का पालन)।' },
    });
  } else if (answers.isInstitutionalLandholder === 'yes') {
    checks.push({
      id: 'kisan_inst_land',
      label: { en: 'Non-Institutional Landholder', hi: 'गैर-संस्थागत भूमिधारक' },
      status: 'fail',
      detail: { en: 'All Institutional Landholders are explicitly excluded on myScheme.', hi: 'myScheme के अनुसार सभी संस्थागत भूमिधारक बहिष्कृत (अपात्र) हैं।' },
    });
    reasons.push(lang === 'hi' ? 'संस्थागत भूमिधारक योजना से बहिष्कृत हैं।' : 'Institutional landholders are excluded.');
  } else {
    checks.push({
      id: 'kisan_inst_land',
      label: { en: 'Non-Institutional Landholder', hi: 'गैर-संस्थागत भूमिधारक' },
      status: 'need_info',
      detail: { en: 'Confirm whether the land is owned by a private farmer family rather than an institution/trust.', hi: 'पुष्टि करें कि जमीन किसी संस्था या ट्रस्ट की बजाय किसान परिवार के नाम है।' },
    });
  }

  // 5. Constitutional / Political Office Exclusion
  if (answers.holdsConstitutionalPost === 'no') {
    checks.push({
      id: 'kisan_const_post',
      label: { en: 'No Constitutional / Political Office', hi: 'संवैधानिक या राजनीतिक पद न होना' },
      status: 'pass',
      detail: { en: 'No family member holds/held a constitutional post, Minister, MP, MLA, MLC, Mayor, or District Panchayat Chair.', hi: 'परिवार में कोई संवैधानिक पद, मंत्री, सांसद, विधायक, महापौर या जिला पंचायत अध्यक्ष पद पर नहीं है।' },
    });
  } else if (answers.holdsConstitutionalPost === 'yes') {
    checks.push({
      id: 'kisan_const_post',
      label: { en: 'No Constitutional / Political Office', hi: 'संवैधानिक या राजनीतिक पद न होना' },
      status: 'fail',
      detail: { en: 'Holders of constitutional posts, former/present Ministers, MPs, MLAs, MLCs, Mayors, and District Panchayat Chairs are excluded.', hi: 'संवैधानिक पदधारक, मंत्री, सांसद, विधायक, महापौर और जिला पंचायत अध्यक्ष बहिष्कृत हैं।' },
    });
    reasons.push(lang === 'hi' ? 'संवैधानिक/राजनीतिक पदधारक परिवार योजना से बहिष्कृत हैं।' : 'Constitutional / specified elected post holders are excluded.');
  } else {
    checks.push({
      id: 'kisan_const_post',
      label: { en: 'No Constitutional / Political Office', hi: 'संवैधानिक या राजनीतिक पद न होना' },
      status: 'need_info',
      detail: { en: 'Confirm whether any family member holds or has held constitutional or specified elected office.', hi: 'पुष्टि करें कि क्या परिवार का कोई सदस्य संवैधानिक या निर्दिष्ट जनप्रतिनिधि पद पर रहा है।' },
    });
  }

  // 6. Government / PSU Employee Exclusion (with Group D / MTS exception)
  if (answers.isGovtEmployeeNotGroupD === 'no') {
    checks.push({
      id: 'kisan_govt_emp',
      label: { en: 'Government / PSU Employee Rule (Class IV / MTS Exempted)', hi: 'सरकारी/पीएसयू कर्मचारी नियम (चतुर्थ श्रेणी/MTS छूट)' },
      status: 'pass',
      detail: {
        en: 'No serving/retired govt or PSU officer/employee (or applicant belongs to exempted Multi-Tasking Staff / Class IV / Group D).',
        hi: 'कोई सेवारत/सेवानिवृत्त सरकारी या पीएसयू कर्मचारी नहीं है (या छूट प्राप्त एमटीएस/चतुर्थ श्रेणी/ग्रुप डी से हैं)।',
      },
    });
  } else if (answers.isGovtEmployeeNotGroupD === 'yes') {
    checks.push({
      id: 'kisan_govt_emp',
      label: { en: 'Government / PSU Employee Rule (Class IV / MTS Exempted)', hi: 'सरकारी/पीएसयू कर्मचारी नियम (चतुर्थ श्रेणी/MTS छूट)' },
      status: 'fail',
      detail: {
        en: 'Serving or retired officers and employees of Government/PSEs/local bodies (other than Class IV / Group D / MTS) are excluded.',
        hi: 'सरकार/पीएसयू/स्थानीय निकायों के नियमित अधिकारी व कर्मचारी (ग्रुप डी/चतुर्थ श्रेणी/एमटीएस को छोड़कर) बहिष्कृत हैं।',
      },
    });
    reasons.push(lang === 'hi' ? 'सरकारी/पीएसयू कर्मचारी (ग्रुप डी के अतिरिक्त) योजना से बहिष्कृत हैं।' : 'Government/PSU employees (other than Class IV / MTS) are excluded.');
  } else {
    checks.push({
      id: 'kisan_govt_emp',
      label: { en: 'Government / PSU Employee Rule (Class IV / MTS Exempted)', hi: 'सरकारी/पीएसयू कर्मचारी नियम (चतुर्थ श्रेणी/MTS छूट)' },
      status: 'need_info',
      detail: {
        en: 'Confirm whether any family member is a regular government/PSU employee (excluding Group D / Class IV / MTS).',
        hi: 'पुष्टि करें कि क्या परिवार का कोई सदस्य नियमित सरकारी/पीएसयू कर्मचारी है (ग्रुप डी/एमटीएस को छोड़कर)।',
      },
    });
  }

  // 7. Pensioner ₹10,000+ Exclusion (with Group D / MTS exception)
  if (answers.isPensioner10kNotGroupD === 'no') {
    checks.push({
      id: 'kisan_pension',
      label: { en: 'Monthly Pension < ₹10,000 (Class IV / MTS Exempted)', hi: 'मासिक पेंशन < ₹10,000 (चतुर्थ श्रेणी/MTS छूट)' },
      status: 'pass',
      detail: {
        en: 'No family member receives monthly pension of ₹10,000 or more (or pensioner retired from Class IV / Group D / MTS).',
        hi: 'परिवार में कोई ₹10,000 या अधिक मासिक पेंशनभोगी नहीं है (या चतुर्थ श्रेणी/ग्रुप डी से सेवानिवृत्त हैं)।',
      },
    });
  } else if (answers.isPensioner10kNotGroupD === 'yes') {
    checks.push({
      id: 'kisan_pension',
      label: { en: 'Monthly Pension < ₹10,000 (Class IV / MTS Exempted)', hi: 'मासिक पेंशन < ₹10,000 (चतुर्थ श्रेणी/MTS छूट)' },
      status: 'fail',
      detail: {
        en: 'Retired pensioners whose monthly pension is ₹10,000 or more are excluded (except Class IV / Multi-Tasking Staff / Group D).',
        hi: '₹10,000 या अधिक मासिक पेंशन पाने वाले सेवानिवृत्त पेंशनभोगी (ग्रुप डी/एमटीएस को छोड़कर) बहिष्कृत हैं।',
      },
    });
    reasons.push(lang === 'hi' ? '₹10,000 से अधिक मासिक पेंशनभोगी (ग्रुप डी के अतिरिक्त) योजना से बाहर हैं।' : 'Pensioners receiving ₹10,000+ monthly (except Class IV / MTS) are excluded.');
  } else {
    checks.push({
      id: 'kisan_pension',
      label: { en: 'Monthly Pension < ₹10,000 (Class IV / MTS Exempted)', hi: 'मासिक पेंशन < ₹10,000 (चतुर्थ श्रेणी/MTS छूट)' },
      status: 'need_info',
      detail: {
        en: 'Confirm whether any retired family member receives monthly pension of ₹10,000 or more (excluding Group D / MTS).',
        hi: 'पुष्टि करें कि क्या परिवार में कोई ₹10,000 या अधिक मासिक पेंशन लेता है (ग्रुप डी/एमटीएस को छोड़कर)।',
      },
    });
  }

  // 8. Income Tax in Last Assessment Year Exclusion
  if (answers.paidIncomeTaxLastYear === 'no') {
    checks.push({
      id: 'kisan_income_tax',
      label: { en: 'No Income Tax in Last Assessment Year', hi: 'पिछले निर्धारण वर्ष में आयकर न भरा हो' },
      status: 'pass',
      detail: { en: 'No family member paid Income Tax in the last assessment year.', hi: 'परिवार के किसी सदस्य ने पिछले निर्धारण वर्ष में आयकर का भुगतान नहीं किया।' },
    });
  } else if (answers.paidIncomeTaxLastYear === 'yes') {
    checks.push({
      id: 'kisan_income_tax',
      label: { en: 'No Income Tax in Last Assessment Year', hi: 'पिछले निर्धारण वर्ष में आयकर न भरा हो' },
      status: 'fail',
      detail: { en: 'Persons who paid Income Tax in the last assessment year and their families are excluded on myScheme.', hi: 'पिछले निर्धारण वर्ष में आयकर भरने वाले व्यक्ति और उनके परिवार myScheme के अनुसार बहिष्कृत हैं।' },
    });
    reasons.push(lang === 'hi' ? 'आयकर दाता परिवार योजना से बहिष्कृत हैं।' : 'Persons who paid income tax in last assessment year are excluded.');
  } else {
    checks.push({
      id: 'kisan_income_tax',
      label: { en: 'No Income Tax in Last Assessment Year', hi: 'पिछले निर्धारण वर्ष में आयकर न भरा हो' },
      status: 'need_info',
      detail: { en: 'Confirm whether any family member paid income tax in the last assessment year.', hi: 'पुष्टि करें कि क्या परिवार के किसी सदस्य ने पिछले निर्धारण वर्ष में आयकर का भुगतान किया है।' },
    });
  }

  // 9. Practicing Professional Exclusion
  if (answers.isPracticingProfessional === 'no') {
    checks.push({
      id: 'kisan_professionals',
      label: { en: 'Not a Practicing Professional', hi: 'अभ्यास करने वाले पेशेवर न होना' },
      status: 'pass',
      detail: { en: 'No family member is a practicing Doctor, Engineer, Lawyer, Chartered Accountant, or Architect.', hi: 'परिवार में कोई डॉक्टर, इंजीनियर, वकील, सीए या आर्किटेक्ट के रूप में पेशेवर अभ्यास नहीं कर रहा है।' },
    });
  } else if (answers.isPracticingProfessional === 'yes') {
    checks.push({
      id: 'kisan_professionals',
      label: { en: 'Not a Practicing Professional', hi: 'अभ्यास करने वाले पेशेवर न होना' },
      status: 'fail',
      detail: { en: 'Practicing doctors, engineers, lawyers, CAs, and architects are explicitly excluded.', hi: 'पंजीकृत और अभ्यास कर रहे डॉक्टर, इंजीनियर, वकील, सीए और आर्किटेक्ट बहिष्कृत हैं।' },
    });
    reasons.push(lang === 'hi' ? 'अभ्यास कर रहे पेशेवर (डॉक्टर/इंजीनियर/वकील/सीए/आर्किटेक्ट) बहिष्कृत हैं।' : 'Practicing professionals are excluded.');
  } else {
    checks.push({
      id: 'kisan_professionals',
      label: { en: 'Not a Practicing Professional', hi: 'अभ्यास करने वाले पेशेवर न होना' },
      status: 'need_info',
      detail: { en: 'Confirm whether any family member is a practicing doctor, engineer, lawyer, CA, or architect.', hi: 'पुष्टि करें कि क्या कोई सदस्य पेशेवर (डॉक्टर, इंजीनियर, वकील, सीए, आर्किटेक्ट) है।' },
    });
  }

  // 10. Aadhaar & Bank Account Status
  if (answers.aadhaarBankAvailable === 'yes') {
    checks.push({
      id: 'kisan_aadhaar_bank',
      label: { en: 'Aadhaar & Bank Account Availability', hi: 'आधार और बैंक खाते की उपलब्धता' },
      status: 'pass',
      detail: { en: 'Aadhaar card and active bank account available for DBT disbursal and official portal e-KYC.', hi: 'डीबीटी भुगतान और आधिकारिक पोर्टल ई-केवाईसी के लिए आधार व बैंक खाता तैयार है।' },
    });
    reasons.push(lang === 'hi' ? 'आधार और सक्रिय बैंक खाता उपलब्ध है।' : 'Aadhaar card and active savings account are confirmed available.');
  } else if (answers.aadhaarBankAvailable === 'in_process' || answers.aadhaarBankAvailable === 'no') {
    checks.push({
      id: 'kisan_aadhaar_bank',
      label: { en: 'Aadhaar & Bank Account Availability', hi: 'आधार और बैंक खाते की उपलब्धता' },
      status: 'need_info',
      detail: {
        en: 'Aadhaar card and active bank account are required to receive ₹2,000 installment credits via DBT.',
        hi: 'डीबीटी के माध्यम से ₹2,000 की किस्त पाने के लिए आधार और सक्रिय बैंक खाता आवश्यक है।',
      },
    });
    reasons.push(lang === 'hi' ? 'डीबीटी के लिए आधार और बैंक खाते को सक्रिय करना आवश्यक है।' : 'Aadhaar and bank account are required for disbursal.');
  } else {
    checks.push({
      id: 'kisan_aadhaar_bank',
      label: { en: 'Aadhaar & Bank Account Availability', hi: 'आधार और बैंक खाते की उपलब्धता' },
      status: 'need_info',
      detail: { en: 'Confirm whether you have an Aadhaar card and an active savings bank account.', hi: 'पुष्टि करें कि क्या आपके पास आधार कार्ड और सक्रिय बचत बैंक खाता है।' },
    });
  }

  // Status resolution
  const hasFail = checks.some((c) => c.status === 'fail');
  const hasNeedInfo = checks.some((c) => c.status === 'need_info');

  let status: MatchStatus = 'possible';
  if (hasFail) {
    status = 'no_match';
  } else if (hasNeedInfo) {
    status = 'need_info';
  }

  return { status, reasons, checks };
}

function evaluateMahtariVandan(
  _scheme: Scheme,
  profile: Record<string, unknown>,
  answers: CombinedEligibilityAnswers,
  lang: Language = 'en'
): EvaluationResult {
  const reasons: string[] = [];
  const checks: EvaluationCriteriaCheck[] = [];

  // 1. Applicant Group (Woman)
  const group = profile.group as string | undefined;
  if (!group) {
    checks.push({
      id: 'mv_group',
      label: { en: 'Applicant Category', hi: 'आवेदक श्रेणी' },
      status: 'need_info',
      detail: { en: 'Select your applicant category (Woman) in profile.', hi: 'अपनी प्रोफ़ाइल में आवेदक श्रेणी (महिला) चुनें।' },
    });
  } else if (group === 'woman') {
    checks.push({
      id: 'mv_group',
      label: { en: 'Woman Category Status', hi: 'महिला श्रेणी स्थिति' },
      status: 'pass',
      detail: { en: 'Matches the target beneficiary category (Women) for Mahtari Vandan Yojana.', hi: 'मह्तारी वंदन योजना के लिए लक्षित श्रेणी (महिला) से मेल खाता है।' },
    });
    reasons.push(lang === 'hi' ? 'महिला लाभार्थी श्रेणी से मेल खाता है।' : 'Matches the Woman beneficiary category.');
  } else {
    checks.push({
      id: 'mv_group',
      label: { en: 'Woman Category Status', hi: 'महिला श्रेणी स्थिति' },
      status: 'fail',
      detail: { en: 'Mahtari Vandan Yojana is exclusively for women.', hi: 'मह्तारी वंदन योजना केवल महिलाओं के लिए है।' },
    });
    reasons.push(lang === 'hi' ? 'यह योजना केवल महिलाओं के लिए निर्धारित है।' : 'This scheme is specifically for women.');
  }

  // 2. Chhattisgarh Residence (Source: 2024 State Guidance — Needs portal confirmation)
  if (answers.isChhattisgarhResident === 'yes') {
    checks.push({
      id: 'mv_residence',
      label: { en: 'Chhattisgarh Residence (2024 Guidance)', hi: 'छत्तीसगढ़ निवास (2024 दिशानिर्देश)' },
      status: 'pass',
      detail: {
        en: 'Applicant reports being a local resident of Chhattisgarh. (Source: 2024 State Guidance; verify current cycle rules on official portal).',
        hi: 'आवेदक ने छत्तीसगढ़ का स्थानीय निवासी होने की पुष्टि की। (स्रोत: 2024 राज्य दिशानिर्देश; वर्तमान चक्र के नियमों की पोर्टल पर पुष्टि करें)।',
      },
    });
    reasons.push(lang === 'hi' ? 'छत्तीसगढ़ के स्थानीय निवासी होने की शर्त (2024 दिशानिर्देशानुसार) पूरी है।' : 'Meets Chhattisgarh residence condition from 2024 guidance.');
  } else if (answers.isChhattisgarhResident === 'no') {
    checks.push({
      id: 'mv_residence',
      label: { en: 'Chhattisgarh Residence (2024 Guidance)', hi: 'छत्तीसगढ़ निवास (2024 दिशानिर्देश)' },
      status: 'fail',
      detail: {
        en: 'The scheme is restricted to residents of Chhattisgarh state as per state guidelines.',
        hi: 'राज्य के दिशानिर्देशों के अनुसार यह योजना छत्तीसगढ़ राज्य के निवासियों के लिए सीमित है।',
      },
    });
    reasons.push(lang === 'hi' ? 'छत्तीसगढ़ का निवासी न होने पर यह राज्य योजना लागू नहीं होती।' : 'Does not appear to meet the Chhattisgarh residence requirement.');
  } else {
    checks.push({
      id: 'mv_residence',
      label: { en: 'Chhattisgarh Residence (2024 Guidance)', hi: 'छत्तीसगढ़ निवास (2024 दिशानिर्देश)' },
      status: 'need_info',
      detail: {
        en: 'Confirmation needed: Sourced from 2024 state guidance; confirm if you reside in Chhattisgarh.',
        hi: 'पुष्टि आवश्यक: 2024 राज्य दिशानिर्देश अनुसार; पुष्टि करें कि क्या आप छत्तीसगढ़ में निवास करते हैं।',
      },
    });
  }

  // 3. Age Requirement (21+ Years) (Source: 2024 State Guidance)
  if (answers.age21OrAbove === 'yes') {
    checks.push({
      id: 'mv_age',
      label: { en: 'Age Requirement (≥ 21 Years - 2024 Guidance)', hi: 'आयु मानदंड (≥ 21 वर्ष - 2024 दिशानिर्देश)' },
      status: 'pass',
      detail: {
        en: 'Applicant is 21 years of age or older as of January 1 (Sourced from 2024 State Guidance; subject to current portal verification).',
        hi: 'आवेदक 1 जनवरी को 21 वर्ष या अधिक आयु की हैं (स्रोत: 2024 राज्य दिशानिर्देश; वर्तमान पोर्टल पर सत्यापन के अधीन)।',
      },
    });
    reasons.push(lang === 'hi' ? 'न्यूनतम 21 वर्ष की आयु सीमा (2024 दिशानिर्देश) पूरी होती है।' : 'Meets minimum age condition of 21 years from 2024 guidance.');
  } else if (answers.age21OrAbove === 'no') {
    checks.push({
      id: 'mv_age',
      label: { en: 'Age Requirement (≥ 21 Years - 2024 Guidance)', hi: 'आयु मानदंड (≥ 21 वर्ष - 2024 दिशानिर्देश)' },
      status: 'fail',
      detail: {
        en: '2024 state guidance specifies a minimum age of 21 years as of January 1.',
        hi: '2024 राज्य दिशानिर्देश के अनुसार 1 जनवरी को न्यूनतम आयु 21 वर्ष होना अनिवार्य है।',
      },
    });
    reasons.push(lang === 'hi' ? '21 वर्ष से कम आयु होने पर 2024 दिशानिर्देश के तहत नियम मेल नहीं खाता।' : 'Does not appear to meet the 21-year age threshold.');
  } else {
    checks.push({
      id: 'mv_age',
      label: { en: 'Age Requirement (≥ 21 Years - 2024 Guidance)', hi: 'आयु मानदंड (≥ 21 वर्ष - 2024 दिशानिर्देश)' },
      status: 'need_info',
      detail: {
        en: 'Confirm whether applicant is at least 21 years of age as per 2024 state guidance.',
        hi: 'पुष्टि करें कि क्या आवेदक की आयु 2024 राज्य दिशानिर्देश अनुसार कम से कम 21 वर्ष है।',
      },
    });
  }

  // 4. Marital Status Category (Source: 2024 State Guidance)
  const marital = answers.maritalStatus;
  if (marital === 'married' || marital === 'widowed' || marital === 'divorced' || marital === 'abandoned') {
    const labels: Record<string, { en: string; hi: string }> = {
      married: { en: 'Married Woman', hi: 'विवाहित महिला' },
      widowed: { en: 'Widow', hi: 'विधवा' },
      divorced: { en: 'Divorced Woman', hi: 'तलाकशुदा महिला' },
      abandoned: { en: 'Abandoned / Deserted Woman', hi: 'परित्यक्ता महिला' },
    };
    checks.push({
      id: 'mv_marital',
      label: { en: 'Marital Category (2024 Guidance)', hi: 'वैवाहिक श्रेणी (2024 दिशानिर्देश)' },
      status: 'pass',
      detail: {
        en: `Status: ${labels[marital].en}. Sourced from 2024 State Guidance which covers married, widowed, divorced, and abandoned women.`,
        hi: `स्थिति: ${labels[marital].hi}। 2024 राज्य दिशानिर्देश अनुसार विवाहित, विधवा, तलाकशुदा एवं परित्यक्ता महिलाएँ शामिल हैं।`,
      },
    });
    reasons.push(lang === 'hi' ? `वैवाहिक श्रेणी (${labels[marital].hi}) 2024 दिशानिर्देश से मेल खाती है।` : `Matches eligible marital category (${labels[marital].en}) from 2024 guidance.`);
  } else if (marital === 'unmarried') {
    checks.push({
      id: 'mv_marital',
      label: { en: 'Marital Category (2024 Guidance)', hi: 'वैवाहिक श्रेणी (2024 दिशानिर्देश)' },
      status: 'fail',
      detail: {
        en: '2024 state guidance specifies benefits for married women (including widows, divorced, and abandoned women). Unmarried women were not listed.',
        hi: '2024 राज्य दिशानिर्देश में विवाहित महिलाओं (विधवा, तलाकशुदा, परित्यक्ता सहित) को शामिल किया गया है; अविवाहित युवतियों को शामिल नहीं किया गया था।',
      },
    });
    reasons.push(lang === 'hi' ? 'अविवाहित श्रेणी 2024 दिशानिर्देश में पात्र सूचीबद्ध नहीं थी।' : 'Unmarried status was not listed as eligible in 2024 guidance.');
  } else {
    checks.push({
      id: 'mv_marital',
      label: { en: 'Marital Category (2024 Guidance)', hi: 'वैवाहिक श्रेणी (2024 दिशानिर्देश)' },
      status: 'need_info',
      detail: {
        en: 'Select your marital status category (married, widow, divorced, abandoned) as specified in official guidance.',
        hi: 'आधिकारिक दिशानिर्देश में निर्दिष्ट अनुसार अपनी वैवाहिक श्रेणी (विवाहित, विधवा, तलाकशुदा, परित्यक्ता) चुनें।',
      },
    });
  }

  // 5. Individual Bank Account with Aadhaar & DBT (Confirmed Current Official Portal Rule)
  if (answers.hasIndividualDbtAccount === 'yes') {
    checks.push({
      id: 'mv_bank_dbt',
      label: { en: 'Individual DBT Bank Account (Portal Rule)', hi: 'व्यक्तिगत DBT बैंक खाता (आधिकारिक पोर्टल नियम)' },
      status: 'pass',
      detail: {
        en: 'Confirmed: Applicant has an individual bank account in her own name with active Aadhaar linking and DBT (current official portal requirement).',
        hi: 'पुष्ट: आवेदक के अपने नाम पर व्यक्तिगत बैंक खाता है जो आधार एवं डीबीटी से जुड़ा है (वर्तमान आधिकारिक पोर्टल नियम)।',
      },
    });
    reasons.push(lang === 'hi' ? 'डीबीटी के लिए व्यक्तिगत बैंक खाता तैयार है (पोर्टल की अनिवार्य शर्त)।' : 'Individual Aadhaar-DBT bank account confirmed (official portal rule).');
  } else if (answers.hasIndividualDbtAccount === 'joint_only') {
    checks.push({
      id: 'mv_bank_dbt',
      label: { en: 'Individual DBT Bank Account (Portal Rule)', hi: 'व्यक्तिगत DBT बैंक खाता (आधिकारिक पोर्टल नियम)' },
      status: 'fail',
      detail: {
        en: 'Current official portal explicitly states that joint accounts are not accepted. The applicant must have an individual bank account in her own name.',
        hi: 'आधिकारिक पोर्टल पर स्पष्ट उल्लेख है कि संयुक्त खाता मान्य नहीं है। महिला का स्वयं का व्यक्तिगत बैंक खाता होना अनिवार्य है।',
      },
    });
    reasons.push(lang === 'hi' ? 'संयुक्त खाता मान्य नहीं है; महिला के नाम व्यक्तिगत खाता होना अनिवार्य है।' : 'Joint accounts are explicitly rejected on the official portal.');
  } else if (answers.hasIndividualDbtAccount === 'in_process' || answers.hasIndividualDbtAccount === 'no') {
    checks.push({
      id: 'mv_bank_dbt',
      label: { en: 'Individual DBT Bank Account (Portal Rule)', hi: 'व्यक्तिगत DBT बैंक खाता (आधिकारिक पोर्टल नियम)' },
      status: 'need_info',
      detail: {
        en: 'An individual savings account in the woman’s own name must be opened and seeded with Aadhaar and DBT before disbursal.',
        hi: 'राशि अंतरण से पूर्व महिला के नाम पर व्यक्तिगत बचत खाता खोलकर आधार व डीबीटी से लिंक कराना होगा।',
      },
    });
    reasons.push(lang === 'hi' ? 'व्यक्तिगत आधार-सीडेड बैंक खाता तैयार करना बाकी है।' : 'Individual Aadhaar-DBT bank account is needed before disbursal.');
  } else {
    checks.push({
      id: 'mv_bank_dbt',
      label: { en: 'Individual DBT Bank Account (Portal Rule)', hi: 'व्यक्तिगत DBT बैंक खाता (आधिकारिक पोर्टल नियम)' },
      status: 'need_info',
      detail: {
        en: 'Confirm whether applicant has an individual bank account in her own name (not joint) with active Aadhaar DBT.',
        hi: 'पुष्टि करें कि क्या आवेदक के पास अपने नाम का व्यक्तिगत बैंक खाता (संयुक्त नहीं) आधार डीबीटी के साथ सक्रिय है।',
      },
    });
  }

  // 6. Income Tax Payee Exclusion (Source: 2024 State Guidance)
  if (answers.familyIncomeTaxPayee === 'no') {
    checks.push({
      id: 'mv_tax_exclusion',
      label: { en: 'No Income Tax Payee in Family (2024 Guidance)', hi: 'परिवार में आयकर दाता न होना (2024 दिशानिर्देश)' },
      status: 'pass',
      detail: { en: 'No family member is an Income Tax payee as per 2024 state guidance.', hi: '2024 राज्य दिशानिर्देश अनुसार परिवार में कोई आयकर दाता नहीं है।' },
    });
  } else if (answers.familyIncomeTaxPayee === 'yes') {
    checks.push({
      id: 'mv_tax_exclusion',
      label: { en: 'No Income Tax Payee in Family (2024 Guidance)', hi: 'परिवार में आयकर दाता न होना (2024 दिशानिर्देश)' },
      status: 'fail',
      detail: { en: '2024 state guidance lists families with income tax payees as excluded (verify on current portal).', hi: '2024 राज्य दिशानिर्देश में आयकर दाता परिवारों को अपात्र सूचीबद्ध किया गया है (पोर्टल पर पुष्टि करें)।' },
    });
    reasons.push(lang === 'hi' ? 'परिवार में आयकर दाता होने पर 2024 दिशानिर्देश के तहत अपवर्जन नियम लागू होता है।' : 'Families with income tax payees were listed as excluded in 2024 guidance.');
  } else {
    checks.push({
      id: 'mv_tax_exclusion',
      label: { en: 'No Income Tax Payee in Family (2024 Guidance)', hi: 'परिवार में आयकर दाता न होना (2024 दिशानिर्देश)' },
      status: 'need_info',
      detail: { en: 'Confirm whether any family member pays Income Tax (dated 2024 guidance).', hi: 'पुष्टि करें कि क्या परिवार में कोई आयकर दाता है (2024 दिशानिर्देश)।' },
    });
  }

  // 7. Regular Govt / PSU Employee Exclusion (Source: 2024 State Guidance)
  if (answers.familyGovtEmployee === 'no') {
    checks.push({
      id: 'mv_govt_emp',
      label: { en: 'No Regular Govt/PSU Employee in Family (2024 Guidance)', hi: 'परिवार में नियमित सरकारी कर्मचारी न होना (2024 दिशानिर्देश)' },
      status: 'pass',
      detail: { en: 'No regular/permanent govt employee in family (contractual/honorarium workers like Anganwadi/Asha workers are not excluded per state guidance).', hi: 'परिवार में कोई नियमित/स्थायी सरकारी कर्मचारी नहीं है (आंगनवाड़ी/आशा कार्यकर्ता मानदेय कर्मी छूट प्राप्त हैं)।' },
    });
  } else if (answers.familyGovtEmployee === 'yes') {
    checks.push({
      id: 'mv_govt_emp',
      label: { en: 'No Regular Govt/PSU Employee in Family (2024 Guidance)', hi: 'परिवार में नियमित सरकारी कर्मचारी न होना (2024 दिशानिर्देश)' },
      status: 'fail',
      detail: { en: 'Families with permanent/regular government or PSU employees were listed as excluded in 2024 guidance.', hi: '2024 राज्य दिशानिर्देश अनुसार स्थायी सरकारी/पीएसयू कर्मचारियों के परिवार अपात्र सूचीबद्ध हैं।' },
    });
    reasons.push(lang === 'hi' ? 'स्थायी सरकारी कर्मचारी परिवार 2024 दिशानिर्देश के तहत बहिष्कृत हैं।' : 'Families with regular government employees were excluded in 2024 guidance.');
  } else {
    checks.push({
      id: 'mv_govt_emp',
      label: { en: 'No Regular Govt/PSU Employee in Family (2024 Guidance)', hi: 'परिवार में नियमित सरकारी कर्मचारी न होना (2024 दिशानिर्देश)' },
      status: 'need_info',
      detail: { en: 'Confirm whether any family member is a permanent/regular government employee.', hi: 'पुष्टि करें कि क्या परिवार में कोई स्थायी सरकारी कर्मचारी है।' },
    });
  }

  // Status resolution
  const hasFail = checks.some((c) => c.status === 'fail');
  const hasNeedInfo = checks.some((c) => c.status === 'need_info');

  let status: MatchStatus = 'possible';
  if (hasFail) {
    status = 'no_match';
  } else if (hasNeedInfo) {
    status = 'need_info';
  }

  return { status, reasons, checks };
}
