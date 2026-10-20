import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Check, CheckCircle2,
  ExternalLink, FileCheck2, FileImage, FileText, HeartHandshake, Info, Languages, LockKeyhole,
  RotateCcw, ShieldCheck, Sparkles, UploadCloud, UserRound, X,
  Building2, GraduationCap, IndianRupee, AlertTriangle, ClipboardCheck,
  Tractor, Landmark, Heart, Clock, Users,
} from 'lucide-react';
import {
  evaluateScheme, schemes,
  type ApplicationType, type CombinedEligibilityAnswers, type GroupId, type Language,
  type MatchStatus, type Scheme,
} from './schemes';

export type SchemeId = 'pm-usp-csss' | 'pm-kisan' | 'mahtari-vandan';

type Screen = 'welcome' | 'profile' | 'results' | 'details' | 'documents' | 'draft';
type Profile = { preferredName: string; state: string; district: string; ageBand: string; group: GroupId | '' };
type Analysis = {
  document_type: string; readable: boolean; fields_found: string[]; missing_information: string[];
  evidence_quote: string; page_number: number | null; needs_human_review: boolean; explanation: string;
};
type AnalysisResponse = { demoMode: boolean; result: Analysis };

type DraftData = {
  applicantName: string;
  state: string;
  district: string;
  subDistrict: string;
  village: string;
  // PM-USP
  applicationType: ApplicationType;
  class12Board: string;
  class12Stream: string;
  class12PassingYear: string;
  institution: string;
  course: string;
  incomeConfirmed: boolean;
  percentileConfirmed: boolean;
  bankAadhaarConfirmed: boolean;
  renewalMarksConfirmed?: boolean;
  renewalAttendanceConfirmed?: boolean;
  // PM-KISAN
  farmerFamilyConfirmed?: boolean;
  cultivableLandConfirmed?: boolean;
  nonExclusionConfirmed?: boolean;
  kisanBankConfirmed?: boolean;
  // Mahtari Vandan
  womanCategoryConfirmed?: boolean;
  chhattisgarhResidentConfirmed?: boolean;
  age21Confirmed?: boolean;
  maritalStatusConfirmed?: string;
  individualDbtBankConfirmed?: boolean;
  mahtariNonExclusionConfirmed?: boolean;
};

const initialProfile: Profile = { preferredName: '', state: '', district: '', ageBand: '', group: 'student' };

const sampleStudentProfile: Profile = { preferredName: 'Aarav Patil', state: 'Maharashtra', district: 'Pune', ageBand: '18-24', group: 'student' };
const sampleFarmerProfile: Profile = { preferredName: 'Ramesh Verma', state: 'Uttar Pradesh', district: 'Varanasi', ageBand: '45+', group: 'farmer' };
const sampleWomanProfile: Profile = { preferredName: 'Geeta Sahu', state: 'Chhattisgarh', district: 'Raipur', ageBand: '25–44', group: 'woman' };

const sampleUSPAnswers: CombinedEligibilityAnswers = {
  applicationType: 'fresh',
  class12Board: 'Maharashtra State Board (MSBSHSE)',
  class12Stream: 'science',
  class12PassingYear: '2024',
  above80thPercentile: 'yes',
  regularDegreeCourse: 'yes',
  recognizedInstitution: 'yes',
  familyIncomeRange: 'upto_450k',
  otherScholarshipReceived: 'none',
  aadhaarSeededBankAccount: 'yes',
};

const sampleKisanAnswers: CombinedEligibilityAnswers = {
  isFarmerFamily: 'yes',
  hasCultivableLandInName: 'yes',
  isInstitutionalLandholder: 'no',
  holdsConstitutionalPost: 'no',
  isGovtEmployeeNotGroupD: 'no',
  isPensioner10kNotGroupD: 'no',
  paidIncomeTaxLastYear: 'no',
  isPracticingProfessional: 'no',
  aadhaarBankAvailable: 'yes',
};

const sampleMahtariAnswers: CombinedEligibilityAnswers = {
  isChhattisgarhResident: 'yes',
  age21OrAbove: 'yes',
  maritalStatus: 'married',
  hasIndividualDbtAccount: 'yes',
  familyIncomeTaxPayee: 'no',
  familyGovtEmployee: 'no',
};

const initialDraft: DraftData = {
  applicantName: '',
  state: '',
  district: '',
  subDistrict: '',
  village: '',
  applicationType: 'fresh',
  class12Board: '',
  class12Stream: '',
  class12PassingYear: '',
  institution: '',
  course: '',
  incomeConfirmed: false,
  percentileConfirmed: false,
  bankAadhaarConfirmed: false,
  farmerFamilyConfirmed: false,
  cultivableLandConfirmed: false,
  nonExclusionConfirmed: false,
  kisanBankConfirmed: false,
  womanCategoryConfirmed: false,
  chhattisgarhResidentConfirmed: false,
  age21Confirmed: false,
  maritalStatusConfirmed: '',
  individualDbtBankConfirmed: false,
  mahtariNonExclusionConfirmed: false,
};

const copy = {
  en: {
    subtitle: 'Clear, guided path to government support',
    privacyShort: 'Details stay private in this session',
    officialBadge: 'OFFICIAL SCHEME GUIDANCE',
    sourceLabel: 'Official source:',
    checkedDateLabel: 'Source verified on:',
    welcomeEyebrow: 'Verified Government Schemes Guide',
    welcomeTitle: 'Find government schemes that may fit you.',
    welcomeBody: 'Answer a few simple questions to see possible schemes, understand eligibility, prepare documents, and continue to the official application portal.',
    findSchemesBtn: 'Find schemes',
    browseSchemesBtn: 'Browse schemes',
    disclaimerNote: 'FindMyFit helps you understand rules and prepare documents. It does not guarantee eligibility or submit applications on the government’s behalf.',
    startSample: 'Try the sample journey',
    startFresh: 'Start with my details',
    language: 'Language',
    privacyTitle: 'Your privacy is protected',
    privacyBody: 'FindMyFit does not collect or store your Aadhaar number, bank account number, passwords, or login credentials. All inputs remain in your browser session.',
    heroNote: 'Guided exploration for students, farmers, and women.',
    trustedLabel: 'Verified rules from official myScheme, NSP, and PM-KISAN portals',
    journeyHeading: 'How FindMyFit works in 3 simple steps',
    journeySubhead: 'A transparent, private, and guided way to discover welfare benefits.',
    journeyStep1Title: 'Tell us about yourself',
    journeyStep1Desc: 'Answer only basic questions needed — no Aadhaar, passwords, or login required.',
    journeyStep2Title: 'See possible matches',
    journeyStep2Desc: 'Understand why a scheme may fit based on transparent, official criteria.',
    journeyStep3Title: 'Get ready to apply',
    journeyStep3Desc: 'Review documents, prepare your details, and continue through the official portal.',
    categoryChooseTitle: 'Choose the category that best describes you:',
    catStudent: 'Student',
    catFarmer: 'Farmer',
    catWoman: 'Woman',
    catOther: 'Other',
    catOtherNotice: 'Currently, FindMyFit supports detailed guided pathways for Students, Farmers, and Women. You can browse all available schemes below or search over 3,000+ schemes on the official myScheme portal.',
    browseAllSchemesHeading: 'Supported Government Schemes',
    browseAllSchemesSubhead: 'Scan benefits, key requirements, and required documents. Select any scheme to view detailed rules or start document preparation.',
    intendedAudienceLabel: 'Intended audience:',
    benefitLabel: 'Listed benefit:',
    whyMayMatchLabel: 'Why this may match you:',
    mayMatchPill: 'May match — check requirements',
    checkRequirementsPill: 'Check these requirements',
    docsToPrepareLabel: 'Key documents to prepare:',
    viewDetailsBtn: 'View details',
    prepareDocsBtn: 'Prepare documents',
    continueOnPortalBtn: 'Continue on official portal',
    trySampleLabel: 'Or explore with a sample profile:',
    seeMatchesBtn: 'See possible matches',
    preliminaryNotice: 'Preliminary guidance aid only — official verification by the Government determines final eligibility and approval.',
    profile: 'Profile',
    explore: 'Overview',
    eligibilityCheck: 'Eligibility',
    documents: 'Documents',
    draft: 'Preparation Draft',
    back: 'Back',
    continue: 'Continue',
    reset: 'Reset session',
    required: 'Required',
    optional: 'Optional',
    why: 'Why this is needed',
    name: 'What should we call you?',
    nameWhy: 'Used in your preparation draft summary.',
    state: 'State / Union Territory',
    stateWhy: 'Used for regional board allocations and state land verification.',
    district: 'District',
    districtWhy: 'Optional; included in your application draft.',
    age: 'Age range',
    ageWhy: 'Helps evaluate age-dependent scheme criteria.',
    group: 'Current status / category',
    groupWhy: 'Determines the relevant scheme pathway (e.g. Higher Education Student or Farmer).',
    choose: 'Choose an option',
    chooseState: 'Select state or UT',
    groups: ['Student (College / University)', 'Farmer', 'Woman', 'Older adult', 'Person with a disability', 'Other'] as string[],
    states: ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'],
    ageOptions: ['Under 18','18–24','25–44','45+'] as string[],
    profileTitle: 'Your basic details',
    profileBody: 'These broad details help match eligible government schemes. No sensitive identity documents or credentials are asked.',
    sampleBadge: 'Sample profile loaded',
    profileContinue: 'Continue to scheme overview',
    profileIncomplete: 'Please select your category, age range, and state to continue.',
    resultsTitle: 'Official Scheme Overview',
    resultsBody: 'Review the official rules, benefits, and application routes sourced directly from myScheme. You can switch between supported schemes below.',
    freshPathway: 'Fresh Application',
    freshPathwayDesc: 'First-time applicant entering 1st year of regular graduation or professional degree.',
    renewalPathway: 'Renewal Application',
    renewalPathwayDesc: 'Continuing student renewing for 2nd, 3rd, 4th, or 5th year of ongoing degree study.',
    matchPossible: 'May match — check requirements',
    matchNo: 'May not match criteria',
    matchNeed: 'Check these requirements',
    benefitsHeading: 'Listed Benefits & Assistance',
    rulesHeading: 'Key Eligibility Rules',
    exclusionsHeading: 'Exclusions (Who is not eligible)',
    renewalHeading: 'Renewal Conditions',
    nspHeading: 'Application & Registration Process',
    checkEligibilityBtn: 'Check eligibility for this scheme',
    eligibilityTitle: 'Guided Eligibility Review',
    eligibilityBody: 'Answer these questions based on official criteria. Your eligibility status updates dynamically with full rationale.',
    percentileQuestion: 'Class 12 Board Percentile Standing',
    percentileExplain: 'Are you above the 80th percentile of successful candidates in your stream and board?',
    percentileWarning: 'Important: 80th percentile means your relative cut-off rank standing published by your board for your stream. It does NOT mean scoring 80% marks.',
    boardLabel: 'Class 12 Examination Board',
    streamLabel: 'Class 12 Stream',
    streams: { science: 'Science', commerce: 'Commerce', arts: 'Arts / Humanities', other: 'Other / Vocational' },
    passingYearLabel: 'Class 12 Passing Year',
    regularDegreeQuestion: 'Are you enrolled in a regular (full-time) degree course?',
    regularDegreeHelp: 'Distance, correspondence, and diploma courses are not eligible.',
    recognizedInstQuestion: 'Is your college or university recognized by UGC / AICTE / Government?',
    recognizedInstHelp: 'The institution must be officially registered on NSP for institutional verification.',
    incomeQuestion: 'Annual Parental / Family Income',
    incomeHelp: 'Gross annual family income from all sources must not exceed ₹4,50,000.',
    incomeUpto: '₹4,50,000 or below (≤ 4.5 Lakhs)',
    incomeAbove: 'Above ₹4,50,000 (> 4.5 Lakhs)',
    otherScholarshipQuestion: 'Are you receiving any other scholarship or fee waiver?',
    otherScholarshipHelp: 'Beneficiaries receiving any other government/state scholarship or fee waiver are excluded.',
    otherScholarshipNone: 'No other scholarship (Eligible)',
    otherScholarshipYes: 'Yes, receiving other scholarship / waiver (Excluded)',
    bankAadhaarQuestion: 'Do you have an active bank account in your name seeded with Aadhaar?',
    bankAadhaarHelp: 'Disbursal is direct via DBT. We do NOT ask for or store your account or Aadhaar number.',
    bankAadhaarYes: 'Yes, account is seeded with Aadhaar',
    bankAadhaarNo: 'Not yet seeded / In process',
    renewalMarksQuestion: 'Did you score at least 50% marks in your previous annual examination?',
    renewalMarksHelp: 'Renewal requires minimum 50% marks with no backlogs/supplementary.',
    renewalAttendanceQuestion: 'Did you maintain at least 75% attendance during the academic year?',
    renewalAttendanceHelp: 'Official source requires at least 75% attendance for renewal awards.',
    // PM-KISAN Specific Questions
    kisanFamilyQuestion: 'Are you a member of a landholding farmer family?',
    kisanFamilyHelp: 'Family definition on the official PM-KISAN portal is husband, wife, and minor children.',
    kisanLandQuestion: 'Is cultivable land recorded in the name of a family member in official revenue records?',
    kisanLandHelp: 'Note: Land size alone is NOT an exclusion. The myScheme page states the scheme is not limited only to small and marginal farmers.',
    kisanInstLandQuestion: 'Is the land owned by an institution or trust (Institutional Landholder)?',
    kisanInstLandHelp: 'All institutional landholders are listed as excluded on myScheme.',
    kisanConstPostQuestion: 'Does any family member hold or have held a constitutional post or specified elected office?',
    kisanConstPostHelp: 'Constitutional posts, Ministers, MPs, MLAs, MLCs, Mayors, and District Panchayat Chairs are excluded.',
    kisanGovtEmpQuestion: 'Is any family member a serving or retired government or PSU officer/employee?',
    kisanGovtEmpHelp: 'Excluded, EXCEPT Multi-Tasking Staff / Class IV / Group D employees (who are eligible).',
    kisanPensionQuestion: 'Does any retired family member receive a monthly pension of ₹10,000 or more?',
    kisanPensionHelp: 'Excluded, EXCEPT pensioners who retired from Multi-Tasking Staff / Class IV / Group D.',
    kisanIncomeTaxQuestion: 'Did any family member pay Income Tax in the last assessment year?',
    kisanIncomeTaxHelp: 'Individuals who paid income tax in the last assessment year and their families are excluded.',
    kisanProfQuestion: 'Is any family member a practicing professional (Doctor, Engineer, Lawyer, CA, or Architect)?',
    kisanProfHelp: 'Practicing professionals registered with professional bodies are excluded.',
    kisanAadhaarBankQuestion: 'Do you have an Aadhaar card and an active savings bank account?',
    kisanAadhaarBankHelp: 'Installments are disbursed directly into Aadhaar-seeded bank accounts via DBT.',
    yes: 'Yes',
    no: 'No',
    unsure: 'Unsure / Need to check official list',
    checklistTitle: 'Document Readiness Checklist',
    checklistSubtitle: 'Review the required documents before opening the official portal or visiting a facilitation centre.',
    uploadTitle: 'Document Readability Check',
    uploadHint: 'Upload a sample PDF, JPG, or PNG (up to 5 MB) to check readability and key fields.',
    uploadAction: 'Select a document file',
    uploaded: 'Selected file',
    removeFile: 'Remove file',
    analyze: 'Check document readability',
    analyzing: 'Scanning file fields…',
    analyzeHelp: 'The file is kept in temporary memory and never stored on disk. If Gemini is configured, it checks readability; otherwise a clearly labeled sample result is shown.',
    sampleMode: 'SAMPLE RESULT · File not sent to live AI',
    aiMode: 'AI Readability Aid · Human review required',
    analysisError: 'Could not complete analysis. Please verify your file format or review manually.',
    resultRead: 'Appears readable',
    resultUnread: 'Could not confirm readability',
    found: 'Information fields detected',
    missing: 'Fields not detected or unclear',
    evidence: 'Verbatim text excerpt',
    page: 'Page',
    humanReview: 'Needs human review',
    explanation: 'Analysis summary',
    analysisDisclaimer: 'This automated check is only a reading aid. It does NOT certify authenticity, legal validity, official acceptance, or scheme approval.',
    draftTitle: 'Application Preparation Draft',
    draftBody: 'Review and confirm your non-sensitive preparation details before opening the official government portal.',
    draftNotice: 'Preparation Draft: Sensitive fields (Aadhaar number, bank account number, IFSC, OTP, passwords) are deliberately left blank for your privacy. Enter them directly on the official portal.',
    draftApplicantName: 'Applicant / Beneficiary Name',
    draftBoard: 'Class 12 Board',
    draftStream: 'Stream',
    draftPassingYear: 'Passing Year',
    draftInstitution: 'College / Institution Name',
    draftCourse: 'Degree Course Name',
    draftIncome: 'Income Status',
    draftPercentile: 'Board Percentile Standing',
    draftBankStatus: 'Aadhaar Seeding Status',
    draftReady: 'Preparation draft complete and ready for official handoff',
    draftMissing: 'Some preparation fields are missing or require confirmation',
    saveDraft: 'Validate draft details',
    preview: 'Application Summary Preview',
    noSubmit: 'FindMyFit does not submit applications or store credentials. Complete final submission on the official portal.',
    handoffHeading: 'Official Portal Handoff',
    handoffExplainer: 'Follow the official steps below. FindMyFit will open the government portal in a secure new tab.',
    openOfficial: 'Continue to Official Portal',
    datesNoticeLabel: 'Application Window Notice:',
    footer: 'FindMyFit · Independent citizen assistance prototype · Sourced from official portals (myScheme, NSP, PM-KISAN). Not affiliated with any ministry.',
    missingField: 'Not provided yet',
    readyField: 'Ready',
    subDistrictLabel: 'Sub-District / Tehsil / Taluka',
    villageLabel: 'Village / Town',
    kisanDocTitle: 'PM-KISAN Indicative Document Checklist',
    kisanDocSubtitle: 'Mark each document as Available, Need to obtain, or Not applicable. No document upload is required for PM-KISAN.',
    docAvailable: 'Available',
    docNeedToObtain: 'Need to obtain',
    docNotApplicable: 'Not applicable',
    kisanDraftTitle: 'PM-KISAN Application Preparation Summary',
    kisanDraftSubtitle: 'Review and prepare your non-sensitive details before registering on the official portal or visiting a CSC.',
    kisanHandoffTitle: 'Official PM-KISAN Application Routes',
    kisanHandoffBody: 'Choose your preferred official registration route. FindMyFit does not submit applications or collect login credentials.',
    openKisanPortal: 'Open PM-KISAN Portal (Self Registration)',
    openCscLocator: 'Find Nearest Common Service Centre (CSC)',
    officialAuthorityDisclaimer: 'State Government / UT Administration and District Verification Committees verify land records and make final approval and disbursal decisions.',
    noAnalysis: 'Upload a document above to run a readability analysis.',
    kisanLandRecord: 'Cultivable Land Status',
    kisanNonExclusion: 'Exclusion Verification',
    // Mahtari Vandan Specific
    mvResidenceQuestion: 'Are you a local resident of Chhattisgarh state?',
    mvResidenceHelp: 'Source: 2024 State Guidance. Verify current residential criteria on the official portal.',
    mvAgeQuestion: 'Are you 21 years of age or older (as of January 1 of the application year)?',
    mvAgeHelp: 'Source: 2024 State Guidance specified minimum age of 21 years as of January 1.',
    mvMaritalQuestion: 'What is your marital status category?',
    mvMaritalHelp: 'Source: 2024 State Guidance lists married, widowed, divorced, and abandoned women.',
    mvBankQuestion: 'Do you have an individual savings bank account in your own name with active Aadhaar linking and DBT?',
    mvBankHelp: 'Currently confirmed by official portal: Joint accounts are strictly NOT accepted. The woman must have an individual bank account in her own name with active Aadhaar DBT.',
    mvBankYes: 'Yes, individual account in my name with active Aadhaar DBT',
    mvBankJoint: 'I have only a joint account (Rejected on portal)',
    mvBankProcess: 'In process / Need to open individual account',
    mvTaxQuestion: 'Does any member of your family pay Income Tax?',
    mvTaxHelp: 'Source: 2024 State Guidance excludes families with income tax payees. Confirm on current portal.',
    mvGovtEmpQuestion: 'Is any family member a permanent/regular government or PSU employee?',
    mvGovtEmpHelp: 'Source: 2024 State Guidance excludes regular govt employees. Honorarium/contract workers (e.g. Anganwadi, ASHA) are NOT excluded.',
    mvDocTitle: 'Mahtari Vandan Document-Readiness Checklist',
    mvDocSubtitle: 'Review items below and mark as Ready, Missing, or Needs confirmation. Uploading documents is NOT required.',
    mvDraftTitle: 'Mahtari Vandan Application Preparation Worksheet',
    mvDraftSubtitle: 'Organize your non-sensitive details before registering on the official portal or visiting a local facilitation centre.',
    checkCurrentAppInfo: 'Check current application information on the official portal',
    portalConfirmedBadge: 'Confirmed by official portal',
    datedGuidanceBadge: '2024 state guidance — verify current requirements',
    docReady: 'Ready',
    docMissing: 'Need to obtain',
    docNeedsConfirm: 'Needs confirmation',
    mvHandoffTitle: 'Official Mahtari Vandan Application Routes',
    mvHandoffBody: 'Visit the official Chhattisgarh portal to check active application cycles or submit. FindMyFit does not submit applications or ask for portal passwords.',
    openMahtariPortal: 'Open Official Mahtari Vandan Portal',
    mvNoUploadNotice: 'No document upload required: FindMyFit does not collect or store identity documents. Present originals directly to government field functionaries or during official portal submission.',
    cgAffiliationDisclaimer: 'FindMyFit is an independent citizen assistance prototype and is NOT officially affiliated with the Government of Chhattisgarh.',
    mvMaritalMarried: 'Married Woman',
    mvMaritalWidowed: 'Widow',
    mvMaritalDivorced: 'Divorced Woman',
    mvMaritalAbandoned: 'Abandoned / Deserted Woman',
    mvMaritalUnmarried: 'Unmarried Woman (Not listed in 2024 guidance)',
    mvDraftResidence: 'Chhattisgarh Residence Status',
    mvDraftAge: 'Age Eligibility (≥ 21 Years)',
    mvDraftMarital: 'Marital Status Category',
    mvDraftBank: 'Individual DBT Bank Account',
    mvDraftExclusions: 'Family Exclusions Status',
    additionalSourcesTitle: 'Official Chhattisgarh Government Releases & Notifications',
    viewOfficialRelease: 'View Official DPR Notification',
    officialSourcesHeading: 'Official Sources & Freshness',
    officialSourcesSubhead: 'Verified government portals and official publications supporting scheme eligibility, benefits, and applications.',
    supportsDetailLabel: 'Supports Detail:',
    checkedOnLabel: 'Information checked on:',
    statusVerifiedLabel: 'Verified Official Source',
    statusNeedsReviewLabel: 'Needs Portal Verification',
    statusUnconfirmedLabel: 'Unconfirmed / Dynamic — Check Portal',
    verifyOnPortalNote: 'Please verify this detail on the official portal.',
    windowBannerTitle: 'Application Window & Deadline Verification',
    windowUnconfirmedNotice: 'Application windows and deadlines cannot be permanently confirmed as they change dynamically each cycle. FindMyFit does not mark them as open or closed. Please verify current active status directly on the official portal.',
  },
  hi: {
    subtitle: 'सरकारी योजनाओं तक सरल और पारदर्शी मार्गदर्शन',
    privacyShort: 'विवरण केवल इस सत्र में निजी रहते हैं',
    officialBadge: 'आधिकारिक योजना मार्गदर्शन',
    sourceLabel: 'आधिकारिक स्रोत:',
    checkedDateLabel: 'स्रोत सत्यापन तिथि:',
    welcomeEyebrow: 'सत्यापित सरकारी योजनाएँ मार्गदर्शिका',
    welcomeTitle: 'अपनी पात्रता के अनुसार उपयुक्त सरकारी योजनाएँ खोजें।',
    welcomeBody: 'कुछ आसान सवालों के जवाब देकर संभावित योजनाएँ देखें, पात्रता समझें, दस्तावेज़ तैयार करें और आधिकारिक पोर्टल पर आवेदन जारी रखें।',
    findSchemesBtn: 'योजनाएँ खोजें',
    browseSchemesBtn: 'योजनाएँ देखें',
    disclaimerNote: 'FindMyFit आपको नियम समझने और दस्तावेज़ तैयार करने में सहायता करता है। यह पात्रता की गारंटी नहीं देता और न ही सरकार की ओर से आवेदन जमा करता है।',
    startSample: 'नमूना यात्रा देखें',
    startFresh: 'मेरे विवरण से शुरू करें',
    language: 'भाषा',
    privacyTitle: 'आपकी गोपनीयता सुरक्षित है',
    privacyBody: 'FindMyFit आपका आधार नंबर, बैंक खाता संख्या, पासवर्ड या लॉगिन विवरण एकत्र या संग्रहीत नहीं करता। सभी विवरण केवल आपके ब्राउज़र सत्र में रहते हैं।',
    heroNote: 'विद्यार्थियों, किसानों और महिलाओं के लिए मार्गदर्शिका।',
    trustedLabel: 'myScheme, NSP और PM-KISAN के आधिकारिक नियमों पर आधारित',
    journeyHeading: 'FindMyFit 3 सरल चरणों में कैसे काम करता है',
    journeySubhead: 'सरकारी कल्याणकारी योजनाएँ खोजने का पारदर्शी, सुरक्षित और मार्गदर्शित तरीका।',
    journeyStep1Title: 'अपने बारे में बताएँ',
    journeyStep1Desc: 'केवल ज़रूरी बुनियादी सवालों के जवाब दें — आधार, पासवर्ड या लॉगिन की आवश्यकता नहीं।',
    journeyStep2Title: 'संभावित योजनाएँ देखें',
    journeyStep2Desc: 'पारदर्शी और आधिकारिक मानदंडों के आधार पर समझें कि कोई योजना आपके लिए क्यों उपयुक्त हो सकती है।',
    journeyStep3Title: 'आवेदन की तैयारी करें',
    journeyStep3Desc: 'दस्तावेज़ों की समीक्षा करें, विवरण तैयार करें और आधिकारिक पोर्टल पर सुरक्षित आगे बढ़ें।',
    categoryChooseTitle: 'वह श्रेणी चुनें जो आपका सबसे अच्छा वर्णन करती है:',
    catStudent: 'विद्यार्थी',
    catFarmer: 'किसान',
    catWoman: 'महिला',
    catOther: 'अन्य',
    catOtherNotice: 'वर्तमान में FindMyFit विद्यार्थियों, किसानों और महिलाओं के लिए विस्तृत मार्गदर्शिका प्रदान करता है। आप नीचे उपलब्ध योजनाओं को देख सकते हैं या आधिकारिक myScheme पोर्टल पर 3,000+ योजनाएँ खोज सकते हैं।',
    browseAllSchemesHeading: 'समर्थित सरकारी योजनाएँ',
    browseAllSchemesSubhead: 'लाभ, प्रमुख शर्तें और आवश्यक दस्तावेज़ देखें। विस्तृत नियम देखने या दस्तावेज़ तैयारी शुरू करने के लिए कोई भी योजना चुनें।',
    intendedAudienceLabel: 'लक्षित वर्ग:',
    benefitLabel: 'निर्धारित लाभ:',
    whyMayMatchLabel: 'संभावित मिलान के कारण:',
    mayMatchPill: 'संभावित मिलान — शर्तें देखें',
    checkRequirementsPill: 'पात्रता शर्तें जाँचें',
    docsToPrepareLabel: 'तैयार रखने हेतु प्रमुख दस्तावेज़:',
    viewDetailsBtn: 'ब्योरा देखें',
    prepareDocsBtn: 'दस्तावेज़ तैयार करें',
    continueOnPortalBtn: 'आधिकारिक पोर्टल पर जाएँ',
    trySampleLabel: 'या किसी नमूना प्रोफ़ाइल के साथ देखें:',
    seeMatchesBtn: 'संभावित योजनाएँ देखें',
    preliminaryNotice: 'केवल प्रारंभिक मार्गदर्शन सहायता — अंतिम पात्रता और स्वीकृति का निर्णय संबंधित सरकारी विभाग द्वारा किया जाता है।',
    profile: 'प्रोफ़ाइल',
    explore: 'योजना विवरण',
    eligibilityCheck: 'पात्रता जाँच',
    documents: 'दस्तावेज़',
    draft: 'तैयारी ड्राफ़्ट',
    back: 'पीछे जाएँ',
    continue: 'आगे बढ़ें',
    reset: 'सत्र रीसेट करें',
    required: 'अनिवार्य',
    optional: 'वैकल्पिक',
    why: 'यह क्यों आवश्यक है',
    name: 'आपका शुभ नाम?',
    nameWhy: 'आपके ड्राफ़्ट सारांश में उपयोग किया जाता है।',
    state: 'राज्य / केंद्र शासित प्रदेश',
    stateWhy: 'बोर्ड कोटा और राज्य राजस्व सत्यापन के लिए आवश्यक।',
    district: 'ज़िला',
    districtWhy: 'वैकल्पिक; आवेदन सारांश में शामिल करने के लिए।',
    age: 'आयु वर्ग',
    ageWhy: 'योजना पात्रता की पुष्टि के लिए।',
    group: 'आपकी वर्तमान स्थिति / श्रेणी',
    groupWhy: 'संबंधित योजना मार्ग (विद्यार्थी या किसान) निर्धारित करता है।',
    choose: 'एक विकल्प चुनें',
    chooseState: 'राज्य या केंद्र शासित प्रदेश चुनें',
    groups: ['विद्यार्थी (कॉलेज / विश्वविद्यालय)', 'किसान', 'महिला', 'वरिष्ठ नागरिक', 'दिव्यांगजन', 'अन्य'] as string[],
    states: ['आंध्र प्रदेश','अरुणाचल प्रदेश','असम','बिहार','छत्तीसगढ़','गोवा','गुजरात','हरियाणा','हिमाचल प्रदेश','झारखंड','कर्नाटक','केरल','मध्य प्रदेश','महाराष्ट्र','मणिपुर','मेघालय','मिज़ोरम','नागालैंड','ओडिशा','पंजाब','राजस्थान','सिक्किम','तमिलनाडु','तेलंगाना','त्रिपुरा','उत्तर प्रदेश','उत्तराखंड','पश्चिम बंगाल','अंडमान और निकोबार द्वीप समूह','चंडीगढ़','दादरा और नगर हवेली एवं दमन और दीव','दिल्ली','जम्मू और कश्मीर','लद्दाख','लक्षद्वीप','पुदुचेरी'],
    ageOptions: ['18 वर्ष से कम','18–24','25–44','45+'] as string[],
    profileTitle: 'आपके सामान्य विवरण',
    profileBody: 'ये बुनियादी विवरण संबंधित योजना से मिलान करने में मदद करते हैं। कोई संवेदनशील पहचान दस्तावेज़ या क्रेडेंशियल नहीं माँगे जाते।',
    sampleBadge: 'नमूना प्रोफ़ाइल लोड की गई',
    profileContinue: 'योजना विवरण देखें',
    profileIncomplete: 'कृपया आगे बढ़ने के लिए अपनी श्रेणी, आयु वर्ग और राज्य चुनें।',
    resultsTitle: 'आधिकारिक योजना अवलोकन',
    resultsBody: 'myScheme से प्राप्त आधिकारिक नियमों, लाभों और आवेदन प्रक्रियाओं की समीक्षा करें। आप नीचे समर्थित योजनाओं के बीच चयन कर सकते हैं।',
    freshPathway: 'नया आवेदन (Fresh)',
    freshPathwayDesc: 'नियमित डिग्री के प्रथम वर्ष में प्रवेश लेने वाले प्रथम बार के आवेदक।',
    renewalPathway: 'नवीनीकरण (Renewal)',
    renewalPathwayDesc: 'डिग्री अध्ययन के 2रे, 3रे, 4थे या 5वें वर्ष में अध्ययन जारी रखने वाले छात्र।',
    matchPossible: 'संभावित मिलान — शर्तें देखें',
    matchNo: 'शर्तों से मेल नहीं खाता',
    matchNeed: 'पात्रता शर्तें जाँचें',
    benefitsHeading: 'निर्धारित लाभ एवं सहायता राशि',
    rulesHeading: 'मुख्य पात्रता नियम',
    exclusionsHeading: 'अपवर्जन (जो पात्र नहीं हैं)',
    renewalHeading: 'नवीनीकरण की शर्तें',
    nspHeading: 'आवेदन एवं पंजीकरण प्रक्रिया',
    checkEligibilityBtn: 'इस योजना के लिए पात्रता जाँचें',
    eligibilityTitle: 'मार्गदर्शित पात्रता समीक्षा',
    eligibilityBody: 'आधिकारिक नियमों पर आधारित इन प्रश्नों के उत्तर दें। आपकी पात्रता स्थिति पूर्ण कारणों के साथ तुरंत अपडेट होती है।',
    percentileQuestion: 'कक्षा 12वीं बोर्ड पर्सेंटाइल स्थिति',
    percentileExplain: 'क्या आप अपने बोर्ड और संकाय के सफल उम्मीदवारों की 80वीं पर्सेंटाइल से ऊपर हैं?',
    percentileWarning: 'महत्वपूर्ण: 80वीं पर्सेंटाइल का अर्थ बोर्ड द्वारा जारी सापेक्ष रैंक कट-ऑफ है। इसका अर्थ केवल 80% अंक प्राप्त करना नहीं होता।',
    boardLabel: 'कक्षा 12वीं परीक्षा बोर्ड',
    streamLabel: 'कक्षा 12वीं संकाय (स्ट्रीम)',
    streams: { science: 'विज्ञान (Science)', commerce: 'वाणिज्य (Commerce)', arts: 'कला / मानविकी (Arts)', other: 'अन्य / व्यावसायिक' },
    passingYearLabel: 'कक्षा 12वीं उत्तीर्ण वर्ष',
    regularDegreeQuestion: 'क्या आप नियमित (पूर्णकालिक) डिग्री पाठ्यक्रम में नामांकित हैं?',
    regularDegreeHelp: 'दूरस्थ शिक्षा, पत्राचार और डिप्लोमा पाठ्यक्रम पात्र नहीं हैं।',
    recognizedInstQuestion: 'क्या आपका कॉलेज या विश्वविद्यालय मान्यता प्राप्त है?',
    recognizedInstHelp: 'संस्थान का एनएसपी पर पंजीकृत होना आवश्यक है।',
    incomeQuestion: 'कुल वार्षिक पारिवारिक आय',
    incomeHelp: 'सभी स्रोतों से कुल वार्षिक पारिवारिक आय ₹4,50,000 से अधिक नहीं होनी चाहिए।',
    incomeUpto: '₹4,50,000 या उससे कम (≤ 4.5 लाख)',
    incomeAbove: '₹4,50,000 से अधिक (> 4.5 लाख)',
    otherScholarshipQuestion: 'क्या आप कोई अन्य छात्रवृत्ति या शुल्क छूट ले रहे हैं?',
    otherScholarshipHelp: 'अन्य कोई सरकारी/राज्य छात्रवृत्ति या शुल्क छूट पाने वाले विद्यार्थी बहिष्कृत हैं।',
    otherScholarshipNone: 'कोई अन्य छात्रवृत्ति नहीं (पात्र)',
    otherScholarshipYes: 'हाँ, अन्य छात्रवृत्ति प्राप्त हो रही है (बहिष्कृत)',
    bankAadhaarQuestion: 'क्या आपके नाम पर आधार से जुड़ा सक्रिय बैंक खाता है?',
    bankAadhaarHelp: 'भुगतान सीधे डीबीटी द्वारा होता है। हम आपका खाता नंबर या आधार नंबर कभी नहीं माँगते।',
    bankAadhaarYes: 'हाँ, खाता आधार से जुड़ा (सीडेड) है',
    bankAadhaarNo: 'अभी तक लिंक नहीं है / प्रक्रिया में है',
    renewalMarksQuestion: 'क्या आपने पिछली वार्षिक परीक्षा में कम से कम 50% अंक प्राप्त किए?',
    renewalMarksHelp: 'नवीनीकरण के लिए न्यूनतम 50% अंक बिना किसी पूरक परीक्षा के अनिवार्य हैं।',
    renewalAttendanceQuestion: 'क्या शैक्षणिक वर्ष के दौरान आपकी कम से कम 75% उपस्थिति रही?',
    renewalAttendanceHelp: 'आधिकारिक स्रोतों के अनुसार नवीनीकरण के लिए न्यूनतम 75% उपस्थिति अनिवार्य है।',
    // PM-KISAN Hindi Questions
    kisanFamilyQuestion: 'क्या आप भूमिधारक किसान परिवार के सदस्य हैं?',
    kisanFamilyHelp: 'आधिकारिक पीएम-किसान पोर्टल पर परिवार की परिभाषा: पति, पत्नी और नाबालिग बच्चे।',
    kisanLandQuestion: 'क्या आधिकारिक राजस्व अभिलेखों में परिवार के सदस्य के नाम खेती योग्य भूमि दर्ज है?',
    kisanLandHelp: 'नोट: जमीन का आकार अपात्रता का कारण नहीं है। myScheme के अनुसार यह केवल छोटे व सीमांत किसानों तक सीमित नहीं है।',
    kisanInstLandQuestion: 'क्या भूमि किसी संस्था या ट्रस्ट के नाम पर है (संस्थागत भूमिधारक)?',
    kisanInstLandHelp: 'myScheme के अनुसार सभी संस्थागत भूमिधारक बहिष्कृत (अपात्र) हैं।',
    kisanConstPostQuestion: 'क्या परिवार का कोई सदस्य संवैधानिक पद या निर्दिष्ट निर्वाचित जनप्रतिनिधि पद पर रहा है?',
    kisanConstPostHelp: 'संवैधानिक पदधारक, मंत्री, सांसद, विधायक, महापौर और जिला पंचायत अध्यक्ष बहिष्कृत हैं।',
    kisanGovtEmpQuestion: 'क्या परिवार का कोई सदस्य सेवारत या सेवानिवृत्त सरकारी/पीएसयू कर्मचारी है?',
    kisanGovtEmpHelp: 'बहिष्कृत, सिवाय मल्टी-टास्किंग स्टाफ / चतुर्थ श्रेणी / ग्रुप डी कर्मचारियों के (जो पात्र हैं)।',
    kisanPensionQuestion: 'क्या परिवार में किसी सेवानिवृत्त सदस्य को ₹10,000 या अधिक मासिक पेंशन मिलती है?',
    kisanPensionHelp: 'बहिष्कृत, सिवाय उन पेंशनभोगियों के जो ग्रुप डी / चतुर्थ श्रेणी / एमटीएस से सेवानिवृत्त हुए हों।',
    kisanIncomeTaxQuestion: 'क्या परिवार के किसी सदस्य ने पिछले निर्धारण वर्ष में आयकर (Income Tax) का भुगतान किया?',
    kisanIncomeTaxHelp: 'पिछले निर्धारण वर्ष में आयकर देने वाले व्यक्ति और उनके परिवार बहिष्कृत हैं।',
    kisanProfQuestion: 'क्या परिवार में कोई अभ्यास करने वाले पेशेवर (डॉक्टर, इंजीनियर, वकील, सीए, आर्किटेक्ट) हैं?',
    kisanProfHelp: 'पेशेवर निकायों में पंजीकृत और अभ्यास कर रहे पेशेवर बहिष्कृत हैं।',
    kisanAadhaarBankQuestion: 'क्या आपके पास आधार कार्ड और सक्रिय बचत बैंक खाता उपलब्ध है?',
    kisanAadhaarBankHelp: 'किस्त की राशि डीबीटी के माध्यम से सीधे आधार-सीडेड बैंक खाते में भेजी जाती है।',
    yes: 'हाँ',
    no: 'नहीं',
    unsure: 'निश्चित नहीं / आधिकारिक सूची देखना बाकी है',
    checklistTitle: 'दस्तावेज़ तत्परता सूची',
    checklistSubtitle: 'आधिकारिक पोर्टल पर जाने या सुविधा केंद्र जाने से पहले इन दस्तावेज़ों की तैयारी सुनिश्चित करें।',
    uploadTitle: 'दस्तावेज़ पठनीयता जाँच',
    uploadHint: 'पठनीयता और मुख्य फ़ील्ड्स जाँचने के लिए 5 MB तक की PDF, JPG या PNG चुनें।',
    uploadAction: 'दस्तावेज़ फ़ाइल चुनें',
    uploaded: 'चयनित फ़ाइल',
    removeFile: 'फ़ाइल हटाएँ',
    analyze: 'दस्तावेज़ पठनीयता जाँचें',
    analyzing: 'फ़ाइल फ़ील्ड्स जाँचे जा रहे हैं…',
    analyzeHelp: 'फ़ाइल अस्थायी मेमोरी में रखी जाती है और कभी डिस्क पर नहीं सहेजी जाती। यदि जेमिनी सक्षम है तो वह जाँच करता है, अन्यथा नमूना परिणाम दिखाया जाता है।',
    sampleMode: 'नमूना परिणाम · फ़ाइल लाइव एआई को नहीं भेजी गई',
    aiMode: 'एआई पठनीयता सहायता · मानव समीक्षा आवश्यक',
    analysisError: 'विश्लेषण पूरा नहीं हो सका। कृपया फ़ाइल प्रारूप जाँचें या मैन्युअल समीक्षा करें।',
    resultRead: 'पठनीय प्रतीत होता है',
    resultUnread: 'पठनीयता की पुष्टि नहीं हो सकी',
    found: 'पाए गए जानकारी फ़ील्ड्स',
    missing: 'छूटे हुए या अस्पष्ट फ़ील्ड्स',
    evidence: 'दस्तावेज़ से मूल उद्धरण',
    page: 'पृष्ठ',
    humanReview: 'मानव समीक्षा आवश्यक',
    explanation: 'विश्लेषण सारांश',
    analysisDisclaimer: 'यह स्वचालित जाँच केवल पढ़ने में सहायता के लिए है। यह आधिकारिक प्रमाणिकता या योजना स्वीकृति की गारंटी नहीं देता।',
    draftTitle: 'आवेदन तैयारी ड्राफ़्ट',
    draftBody: 'सरकारी पोर्टल पर जाने से पहले अपने गैर-संवेदनशील तैयारी विवरण की पुष्टि करें।',
    draftNotice: 'तैयारी ड्राफ़्ट: आपकी गोपनीयता के लिए संवेदनशील फ़ील्ड (आधार नंबर, बैंक खाता संख्या, आईएफएससी, ओटीपी, पासवर्ड) जानबूझकर खाली छोड़े गए हैं। इन्हें सीधे आधिकारिक पोर्टल पर दर्ज करें।',
    draftApplicantName: 'आवेदक / लाभार्थी का नाम',
    draftBoard: 'कक्षा 12वीं बोर्ड',
    draftStream: 'संकाय (स्ट्रीम)',
    draftPassingYear: 'उत्तीर्ण वर्ष',
    draftInstitution: 'कॉलेज / संस्थान का नाम',
    draftCourse: 'डिग्री पाठ्यक्रम का नाम',
    draftIncome: 'पारिवारिक आय स्थिति',
    draftPercentile: 'बोर्ड पर्सेंटाइल स्थिति',
    draftBankStatus: 'आधार सीडिंग स्थिति',
    draftReady: 'तैयारी ड्राफ़्ट पूर्ण है और आधिकारिक पोर्टल पर जाने के लिए तैयार है',
    draftMissing: 'कुछ तैयारी फ़ील्ड खाली हैं या पुष्टि की आवश्यकता है',
    saveDraft: 'ड्राफ़्ट विवरण मान्य करें',
    preview: 'आवेदन सारांश पूर्वावलोकन',
    noSubmit: 'FindMyFit आवेदन जमा नहीं करता और न ही क्रेडेंशियल सहेजता है। अंतिम आवेदन आधिकारिक पोर्टल पर पूरा करें।',
    handoffHeading: 'आधिकारिक पोर्टल हैंड-ऑफ',
    handoffExplainer: 'नीचे दिए गए आधिकारिक चरणों का पालन करें। FindMyFit सरकारी पोर्टल को सुरक्षित नए टैब में खोलेगा।',
    openOfficial: 'आधिकारिक पोर्टल पर जाएँ',
    datesNoticeLabel: 'आवेदन समय-सीमा सूचना:',
    footer: 'FindMyFit · स्वतंत्र नागरिक सहायता प्रोटोटाइप · आधिकारिक पोर्टलों (myScheme, NSP, PM-KISAN) पर आधारित। किसी मंत्रालय से संबद्ध नहीं।',
    missingField: 'अभी तक दर्ज नहीं',
    readyField: 'तैयार',
    subDistrictLabel: 'उप-ज़िला / तहसील / ब्लॉक',
    villageLabel: 'ग्राम / कस्बा',
    kisanDocTitle: 'पीएम-किसान संकेतक दस्तावेज़ सूची',
    kisanDocSubtitle: 'प्रत्येक दस्तावेज़ को "उपलब्ध", "प्राप्त करना बाकी" या "लागू नहीं" के रूप में चिह्नित करें। आपकी गोपनीयता के लिए किसी अपलोड की आवश्यकता नहीं है।',
    docAvailable: 'उपलब्ध है',
    docNeedToObtain: 'प्राप्त करना बाकी है',
    docNotApplicable: 'लागू नहीं',
    kisanDraftTitle: 'पीएम-किसान आवेदन तैयारी सारांश',
    kisanDraftSubtitle: 'आधिकारिक पोर्टल पर जाने या सीएससी जाने से पहले अपने गैर-संवेदनशील विवरण की समीक्षा करें।',
    kisanHandoffTitle: 'आधिकारिक पीएम-किसान आवेदन मार्ग',
    kisanHandoffBody: 'अपना पसंदीदा आधिकारिक पंजीकरण मार्ग चुनें। FindMyFit आवेदन जमा नहीं करता।',
    openKisanPortal: 'पीएम-किसान पोर्टल खोलें (स्व-पंजीकरण)',
    openCscLocator: 'निकटतम कॉमन सर्विस सेंटर (CSC) खोजें',
    officialAuthorityDisclaimer: 'राज्य सरकार / केंद्र शासित प्रदेश प्रशासन एवं ज़िला सत्यापन समितियाँ राजस्व अभिलेखों का सत्यापन कर अंतिम पात्रता और भुगतान तय करती हैं।',
    noAnalysis: 'पठनीयता विश्लेषण के लिए ऊपर दस्तावेज़ चुनें।',
    kisanLandRecord: 'खेती योग्य भूमि स्थिति',
    kisanNonExclusion: 'अपवर्जन सत्यापन',
    // Mahtari Vandan Specific
    mvResidenceQuestion: 'क्या आप छत्तीसगढ़ राज्य की स्थानीय निवासी हैं?',
    mvResidenceHelp: 'स्रोत: 2024 राज्य दिशानिर्देश। आधिकारिक पोर्टल पर वर्तमान निवास प्रमाण नियमों की पुष्टि करें।',
    mvAgeQuestion: 'क्या आपकी आयु (आवेदन वर्ष की 1 जनवरी को) 21 वर्ष या उससे अधिक है?',
    mvAgeHelp: 'स्रोत: 2024 राज्य दिशानिर्देश के अनुसार 1 जनवरी को न्यूनतम आयु 21 वर्ष होना आवश्यक है।',
    mvMaritalQuestion: 'आपकी वैवाहिक श्रेणी क्या है?',
    mvMaritalHelp: 'स्रोत: 2024 राज्य दिशानिर्देश में विवाहित, विधवा, तलाकशुदा और परित्यक्ता महिलाएँ शामिल हैं।',
    mvBankQuestion: 'क्या आपके स्वयं के नाम पर व्यक्तिगत बचत बैंक खाता आधार व DBT के साथ सक्रिय है?',
    mvBankHelp: 'आधिकारिक पोर्टल द्वारा वर्तमान में पुष्ट: संयुक्त खाता कतई स्वीकार नहीं है। महिला के अपने नाम पर व्यक्तिगत बचत खाता और सक्रिय आधार डीबीटी होना अनिवार्य है।',
    mvBankYes: 'हाँ, मेरे नाम पर व्यक्तिगत खाता व आधार डीबीटी सक्रिय है',
    mvBankJoint: 'मेरे पास केवल संयुक्त खाता है (पोर्टल पर अस्वीकृत)',
    mvBankProcess: 'प्रक्रिया में है / व्यक्तिगत खाता खोलना बाकी है',
    mvTaxQuestion: 'क्या आपके परिवार का कोई सदस्य आयकर (Income Tax) देता है?',
    mvTaxHelp: 'स्रोत: 2024 राज्य दिशानिर्देश में आयकर दाता परिवारों को अपात्र बताया गया है। पोर्टल पर पुष्टि करें।',
    mvGovtEmpQuestion: 'क्या परिवार का कोई सदस्य नियमित/स्थायी सरकारी या पीएसयू कर्मचारी है?',
    mvGovtEmpHelp: 'स्रोत: 2024 राज्य दिशानिर्देश अनुसार स्थायी सरकारी कर्मचारी अपात्र हैं; मानदेय कर्मी (जैसे आंगनवाड़ी/आशा कार्यकर्ता) छूट प्राप्त हैं।',
    mvDocTitle: 'मह्तारी वंदन दस्तावेज़ तत्परता सूची',
    mvDocSubtitle: 'प्रत्येक मद को "तैयार", "प्राप्त करना बाकी" या "पुष्टि आवश्यक" के रूप में चिह्नित करें। किसी दस्तावेज़ अपलोड की आवश्यकता नहीं है।',
    mvDraftTitle: 'मह्तारी वंदन आवेदन तैयारी कार्यपत्रक',
    mvDraftSubtitle: 'आधिकारिक पोर्टल पर जाने या स्थानीय सुविधा केंद्र जाने से पहले अपने गैर-संवेदनशील विवरण व्यवस्थित करें।',
    checkCurrentAppInfo: 'आधिकारिक पोर्टल पर वर्तमान आवेदन जानकारी देखें',
    portalConfirmedBadge: 'आधिकारिक पोर्टल द्वारा वर्तमान में पुष्ट',
    datedGuidanceBadge: '2024 राज्य दिशानिर्देश — वर्तमान पुष्टि आवश्यक',
    docReady: 'तैयार है',
    docMissing: 'प्राप्त करना बाकी है',
    docNeedsConfirm: 'पुष्टि आवश्यक है',
    mvHandoffTitle: 'आधिकारिक मह्तारी वंदन आवेदन मार्ग',
    mvHandoffBody: 'सक्रिय आवेदन चक्र की जाँच या आवेदन के लिए आधिकारिक छत्तीसगढ़ पोर्टल पर जाएँ। FindMyFit आवेदन जमा नहीं करता और न ही पासवर्ड माँगता है।',
    openMahtariPortal: 'आधिकारिक मह्तारी वंदन पोर्टल खोलें',
    mvNoUploadNotice: 'दस्तावेज़ अपलोड की आवश्यकता नहीं: FindMyFit पहचान दस्तावेज़ एकत्र या संग्रहीत नहीं करता। मूल दस्तावेज़ सीधे मैदानी कार्यकर्ताओं या आधिकारिक पोर्टल पर ही प्रस्तुत करें।',
    cgAffiliationDisclaimer: 'FindMyFit एक स्वतंत्र नागरिक सहायता प्रोटोटाइप है और छत्तीसगढ़ शासन से संबद्ध नहीं है।',
    mvMaritalMarried: 'विवाहित महिला',
    mvMaritalWidowed: 'विधवा',
    mvMaritalDivorced: 'तलाकशुदा महिला',
    mvMaritalAbandoned: 'परित्यक्ता महिला',
    mvMaritalUnmarried: 'अविवाहित युवती (2024 दिशानिर्देश में शामिल नहीं)',
    mvDraftResidence: 'छत्तीसगढ़ निवास स्थिति',
    mvDraftAge: 'आयु पात्रता (≥ 21 वर्ष)',
    mvDraftMarital: 'वैवाहिक श्रेणी',
    mvDraftBank: 'व्यक्तिगत DBT बैंक खाता',
    mvDraftExclusions: 'पारिवारिक अपवर्जन स्थिति',
    additionalSourcesTitle: 'छत्तीसगढ़ शासन की आधिकारिक विज्ञप्तियाँ एवं अधिसूचनाएँ',
    viewOfficialRelease: 'आधिकारिक जनसंपर्क अधिसूचना देखें',
    officialSourcesHeading: 'आधिकारिक स्रोत एवं सत्यापन स्थिति',
    officialSourcesSubhead: 'योजना की पात्रता, लाभ, दस्तावेज़ एवं आवेदन प्रक्रिया को प्रमाणित करने वाले आधिकारिक सरकारी स्रोत।',
    supportsDetailLabel: 'संबंधित विवरण:',
    checkedOnLabel: 'जानकारी जाँची गई:',
    statusVerifiedLabel: 'सत्यापित आधिकारिक स्रोत',
    statusNeedsReviewLabel: 'आधिकारिक पोर्टल पर पुष्टि आवश्यक',
    statusUnconfirmedLabel: 'पुष्टि बाकी — पोर्टल देखें',
    verifyOnPortalNote: 'कृपया आधिकारिक पोर्टल पर इस विवरण की पुष्टि करें।',
    windowBannerTitle: 'सक्रिय आवेदन समय-सीमा व पंजीकरण तिथियों की पुष्टि करें',
    windowUnconfirmedNotice: 'आवेदन समय-सीमा व पंजीकरण तिथियाँ शैक्षणिक/वित्तीय चक्र के अनुसार बदलती रहती हैं। FindMyFit इन्हें खुला या बंद घोषित नहीं करता। कृपया सक्रिय स्थिति सीधे आधिकारिक पोर्टल पर देखें।',
  },
};

type Copy = typeof copy.en;

const ages = ['Under 18', '18–24', '25–44', '45+'] as const;
const steps = ['profile', 'results', 'details', 'documents', 'draft'] as const;

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [screen, setScreen] = useState<Screen>('welcome');
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [selectedCategory, setSelectedCategory] = useState<GroupId | ''>('student');
  const [schemeId, setSchemeId] = useState<SchemeId>('pm-usp-csss');
  const [answers, setAnswers] = useState<CombinedEligibilityAnswers>({ applicationType: 'fresh' });
  const [kisanDocStatus, setKisanDocStatus] = useState<Record<string, 'available' | 'need_to_obtain' | 'not_applicable'>>({
    'aadhaar-card': 'available',
    'landholding-papers': 'available',
    'bank-passbook': 'available',
  });
  const [mahtariDocStatus, setMahtariDocStatus] = useState<Record<string, 'ready' | 'missing' | 'needs_confirm'>>({
    'individual-bank-account-mv': 'ready',
    'aadhaar-card-mv': 'ready',
    'mobile-number-mv': 'ready',
    'domicile-proof-mv': 'ready',
    'marital-status-proof-mv': 'ready',
    'age-proof-mv': 'needs_confirm',
    'ration-card-mv': 'ready',
  });
  const [isSample, setIsSample] = useState(false);
  const [draft, setDraft] = useState<DraftData>(initialDraft);
  const [draftTouched, setDraftTouched] = useState(false);

  // File upload state for PM-USP
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string>('');
  const fileInput = useRef<HTMLInputElement | null>(null);

  const t = useMemo(() => copy[lang], [lang]);
  const scheme = useMemo<Scheme>(() => schemes.find((s) => s.id === schemeId) || schemes[0], [schemeId]);

  // Compute live criteria evaluation for the active scheme
  const evaluation = useMemo(() => {
    return evaluateScheme(scheme, profile, answers, lang);
  }, [scheme, profile, answers, lang]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screen]);

  function chooseLanguage(next: Language) {
    setLang(next);
  }

  function begin(withSample: boolean, targetGroup?: GroupId) {
    setIsSample(withSample);
    const chosenGroup = targetGroup || (withSample ? 'student' : 'student');
    const targetSchemeId: SchemeId = chosenGroup === 'farmer' ? 'pm-kisan' : chosenGroup === 'woman' ? 'mahtari-vandan' : 'pm-usp-csss';
    setSchemeId(targetSchemeId);

    if (withSample) {
      if (chosenGroup === 'farmer') {
        setProfile(sampleFarmerProfile);
        setAnswers({ ...sampleKisanAnswers });
        setDraft({
          ...initialDraft,
          applicantName: sampleFarmerProfile.preferredName,
          state: sampleFarmerProfile.state,
          district: sampleFarmerProfile.district,
          subDistrict: 'Pindra',
          village: 'Ramnagar',
          farmerFamilyConfirmed: true,
          cultivableLandConfirmed: true,
          nonExclusionConfirmed: true,
          kisanBankConfirmed: true,
        });
      } else if (chosenGroup === 'woman') {
        setProfile(sampleWomanProfile);
        setAnswers({ ...sampleMahtariAnswers });
        setDraft({
          ...initialDraft,
          applicantName: sampleWomanProfile.preferredName,
          state: sampleWomanProfile.state,
          district: sampleWomanProfile.district,
          subDistrict: 'Dharsiwa',
          village: 'Saddu',
          womanCategoryConfirmed: true,
          chhattisgarhResidentConfirmed: true,
          age21Confirmed: true,
          maritalStatusConfirmed: 'married',
          individualDbtBankConfirmed: true,
          mahtariNonExclusionConfirmed: true,
        });
      } else {
        setProfile(sampleStudentProfile);
        setAnswers({ ...sampleUSPAnswers });
        setDraft({
          ...initialDraft,
          applicantName: sampleStudentProfile.preferredName,
          state: sampleStudentProfile.state,
          district: sampleStudentProfile.district,
          applicationType: 'fresh',
          class12Board: 'Maharashtra State Board (MSBSHSE)',
          class12Stream: 'Science',
          class12PassingYear: '2024',
          institution: 'College of Engineering Pune (COEP)',
          course: 'B.Tech Computer Engineering',
          incomeConfirmed: true,
          percentileConfirmed: true,
          bankAadhaarConfirmed: true,
        });
      }
    } else {
      setProfile({ ...initialProfile, group: chosenGroup });
      setAnswers(chosenGroup === 'farmer' ? {} : chosenGroup === 'woman' ? {} : { applicationType: 'fresh' });
      setDraft(initialDraft);
    }

    setFile(null);
    setAnalysis(null);
    setAnalysisError('');
    setScreen('profile');
  }

  function reset() {
    setIsSample(false);
    setProfile(initialProfile);
    setAnswers({ applicationType: 'fresh' });
    setKisanDocStatus({
      'aadhaar-card': 'available',
      'landholding-papers': 'available',
      'bank-passbook': 'available',
    });
    setMahtariDocStatus({
      'individual-bank-account-mv': 'ready',
      'aadhaar-card-mv': 'ready',
      'mobile-number-mv': 'ready',
      'domicile-proof-mv': 'ready',
      'marital-status-proof-mv': 'ready',
      'age-proof-mv': 'needs_confirm',
      'ration-card-mv': 'ready',
    });
    setDraft(initialDraft);
    setDraftTouched(false);
    setFile(null);
    setAnalysis(null);
    setAnalysisError('');
    if (fileInput.current) fileInput.current.value = '';
    setScreen('welcome');
  }

  function updateProfile(key: keyof Profile, value: string) {
    const updated = { ...profile, [key]: value };
    setProfile(updated);
    if (key === 'preferredName') {
      setDraft((curr) => ({ ...curr, applicantName: value }));
    }
    if (key === 'state') {
      setDraft((curr) => ({ ...curr, state: value }));
    }
    if (key === 'district') {
      setDraft((curr) => ({ ...curr, district: value }));
    }
    if (key === 'group') {
      if (value === 'farmer') {
        setSchemeId('pm-kisan');
      } else if (value === 'woman') {
        setSchemeId('mahtari-vandan');
      } else if (value === 'student') {
        setSchemeId('pm-usp-csss');
      }
    }
  }

  function switchScheme(targetId: SchemeId) {
    setSchemeId(targetId);
    if (targetId === 'pm-kisan') {
      setProfile((p) => ({ ...p, group: 'farmer' }));
    } else if (targetId === 'mahtari-vandan') {
      setProfile((p) => ({ ...p, group: 'woman' }));
    } else {
      setProfile((p) => ({ ...p, group: 'student' }));
    }
  }

  function updateAnswer<K extends keyof CombinedEligibilityAnswers>(key: K, value: CombinedEligibilityAnswers[K]) {
    setAnswers((curr) => {
      const next = { ...curr, [key]: value };
      // Sync with draft state
      if (key === 'familyIncomeRange') {
        setDraft((d) => ({ ...d, incomeConfirmed: value === 'upto_450k' }));
      }
      if (key === 'above80thPercentile') {
        setDraft((d) => ({ ...d, percentileConfirmed: value === 'yes' }));
      }
      if (key === 'aadhaarSeededBankAccount') {
        setDraft((d) => ({ ...d, bankAadhaarConfirmed: value === 'yes' }));
      }
      if (key === 'applicationType') {
        setDraft((d) => ({ ...d, applicationType: value as ApplicationType }));
      }
      if (key === 'class12Board') {
        setDraft((d) => ({ ...d, class12Board: String(value || '') }));
      }
      if (key === 'class12Stream') {
        setDraft((d) => ({ ...d, class12Stream: String(value || '') }));
      }
      if (key === 'class12PassingYear') {
        setDraft((d) => ({ ...d, class12PassingYear: String(value || '') }));
      }
      if (key === 'isFarmerFamily') {
        setDraft((d) => ({ ...d, farmerFamilyConfirmed: value === 'yes' }));
      }
      if (key === 'hasCultivableLandInName') {
        setDraft((d) => ({ ...d, cultivableLandConfirmed: value === 'yes' }));
      }
      if (key === 'aadhaarBankAvailable') {
        setDraft((d) => ({ ...d, kisanBankConfirmed: value === 'yes' }));
      }
      if (key === 'isChhattisgarhResident') {
        setDraft((d) => ({ ...d, chhattisgarhResidentConfirmed: value === 'yes' }));
      }
      if (key === 'age21OrAbove') {
        setDraft((d) => ({ ...d, age21Confirmed: value === 'yes' }));
      }
      if (key === 'maritalStatus') {
        setDraft((d) => ({ ...d, maritalStatusConfirmed: String(value || '') }));
      }
      if (key === 'hasIndividualDbtAccount') {
        setDraft((d) => ({ ...d, individualDbtBankConfirmed: value === 'yes' }));
      }
      if (key === 'familyIncomeTaxPayee' || key === 'familyGovtEmployee') {
        setDraft((d) => ({ ...d, mahtariNonExclusionConfirmed: value === 'no' }));
      }
      return next;
    });
  }

  function goNext() {
    const idx = steps.indexOf(screen as typeof steps[number]);
    if (idx >= 0 && idx < steps.length - 1) {
      setScreen(steps[idx + 1]);
    }
  }

  function goBack() {
    const idx = steps.indexOf(screen as typeof steps[number]);
    if (idx > 0) {
      setScreen(steps[idx - 1]);
    } else if (idx === 0) {
      setScreen('welcome');
    }
  }

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0] || null;
    setAnalysis(null);
    setAnalysisError('');
    if (!next) return;
    const ext = next.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'jpg', 'jpeg', 'png'].includes(ext || '') || next.size > 5 * 1024 * 1024) {
      setFile(null);
      setAnalysisError(lang === 'hi' ? 'कृपया 5 MB से कम PDF, JPG या PNG चुनें।' : 'Please choose a PDF, JPG, or PNG under 5 MB.');
      event.target.value = '';
      return;
    }
    setFile(next);
  }

  async function analyzeFile() {
    if (!file) return;
    setAnalyzing(true);
    setAnalysisError('');
    setAnalysis(null);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('schemeId', scheme.id);
      body.append('applicationType', answers.applicationType || 'fresh');
      body.append('language', lang);
      const response = await fetch('/api/analyze-document', { method: 'POST', body });
      const data = await response.json() as AnalysisResponse & { error?: string };
      if (!response.ok || !data.result) throw new Error(data.error || t.analysisError);
      setAnalysis(data);
    } catch {
      setAnalysisError(t.analysisError);
    } finally {
      setAnalyzing(false);
    }
  }

  function openSourceUrl() {
    window.open(scheme.sourceUrl, '_blank', 'noopener,noreferrer');
  }

  function openOfficialPortal() {
    window.open(scheme.applicationUrl, '_blank', 'noopener,noreferrer');
  }

  function openCscLocator() {
    if (scheme.cscUrl) {
      window.open(scheme.cscUrl, '_blank', 'noopener,noreferrer');
    }
  }

  // Filter checklist documents for PM-USP (Fresh vs Renewal)
  const filteredDocuments = useMemo(() => {
    if (scheme.id === 'pm-kisan' || scheme.id === 'mahtari-vandan') return scheme.documents;
    const type = answers.applicationType || 'fresh';
    return scheme.documents.filter((doc) => doc.category === 'both' || doc.category === type);
  }, [scheme, answers.applicationType]);

  const currentStepIndex = steps.indexOf(screen as typeof steps[number]);
  const activeStepNum = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;

  const isUSP = scheme.id === 'pm-usp-csss';
  const isKisan = scheme.id === 'pm-kisan';
  const isMahtari = scheme.id === 'mahtari-vandan';

  const missingDraftFields = isUSP
    ? [
        !draft.applicantName,
        !draft.institution,
        !draft.course,
        answers.applicationType === 'fresh' && !draft.class12Board,
        answers.applicationType === 'fresh' && !draft.class12Stream,
      ].filter(Boolean).length
    : isKisan
    ? [
        !draft.applicantName,
        !draft.state && !profile.state,
        !draft.district && !profile.district,
        !draft.subDistrict,
      ].filter(Boolean).length
    : [
        !draft.applicantName,
        !draft.state && !profile.state,
        !draft.district && !profile.district,
      ].filter(Boolean).length;

  return (
    <div className={`app ${lang === 'hi' ? 'hindi' : ''}`}>
      <header className="topbar">
        <button className="brand" onClick={() => setScreen('welcome')}>
          <span className="brand-mark">{isKisan ? <Tractor size={22} strokeWidth={2.4} /> : isMahtari ? <Heart size={22} strokeWidth={2.4} /> : <GraduationCap size={22} strokeWidth={2.4} />}</span>
          <span className="brand-name">Find<span>MyFit</span><small>{t.subtitle}</small></span>
        </button>
        <div className="top-actions">
          <span className="session-note"><LockKeyhole size={14} /> {t.privacyShort}</span>
          <div className="language-switch" role="group" aria-label={t.language}>
            <Languages size={16} aria-hidden="true" />
            <button className={lang === 'en' ? 'selected' : ''} onClick={() => chooseLanguage('en')} aria-pressed={lang === 'en'}>EN</button>
            <span aria-hidden="true">/</span>
            <button className={lang === 'hi' ? 'selected' : ''} onClick={() => chooseLanguage('hi')} aria-pressed={lang === 'hi'}>हि</button>
          </div>
          {screen !== 'welcome' && (
            <button className="text-button reset-top" onClick={reset} title={t.reset}>
              <RotateCcw size={15} /> {t.reset}
            </button>
          )}
        </div>
      </header>

      {screen === 'welcome' ? (
        <main className="welcome-page">
          <div className="welcome-grid">
            <section className="welcome-copy">
              <div className="eyebrow"><span className="eyebrow-dot" />{t.welcomeEyebrow}</div>
              <h1>{t.welcomeTitle}</h1>
              <p className="welcome-intro">{t.welcomeBody}</p>

              {/* Category Quick Selector */}
              <div className="hero-category-box">
                <span className="hero-category-label">{t.categoryChooseTitle}</span>
                <div className="category-chips-row" role="radiogroup" aria-label={t.categoryChooseTitle}>
                  <button
                    type="button"
                    className={`category-chip-btn ${selectedCategory === 'student' ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedCategory('student');
                      setSchemeId('pm-usp-csss');
                    }}
                    aria-pressed={selectedCategory === 'student'}
                  >
                    <GraduationCap size={16} />
                    <span>{t.catStudent}</span>
                  </button>
                  <button
                    type="button"
                    className={`category-chip-btn ${selectedCategory === 'farmer' ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedCategory('farmer');
                      setSchemeId('pm-kisan');
                    }}
                    aria-pressed={selectedCategory === 'farmer'}
                  >
                    <Tractor size={16} />
                    <span>{t.catFarmer}</span>
                  </button>
                  <button
                    type="button"
                    className={`category-chip-btn ${selectedCategory === 'woman' ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedCategory('woman');
                      setSchemeId('mahtari-vandan');
                    }}
                    aria-pressed={selectedCategory === 'woman'}
                  >
                    <Heart size={16} />
                    <span>{t.catWoman}</span>
                  </button>
                  <button
                    type="button"
                    className={`category-chip-btn ${selectedCategory === 'other' ? 'selected' : ''}`}
                    onClick={() => setSelectedCategory('other')}
                    aria-pressed={selectedCategory === 'other'}
                  >
                    <UserRound size={16} />
                    <span>{t.catOther}</span>
                  </button>
                </div>
                {selectedCategory === 'other' && (
                  <div className="category-other-notice">
                    <Info size={16} />
                    <div>
                      {t.catOtherNotice}
                      <div style={{ marginTop: '6px' }}>
                        <a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#964724', fontWeight: 700, textDecoration: 'underline' }}>
                          {lang === 'en' ? 'Open official myScheme.gov.in portal' : 'आधिकारिक myScheme.gov.in पोर्टल खोलें'} <ExternalLink size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Actions: Find schemes (Primary) & Browse schemes (Secondary) */}
              <div className="welcome-actions">
                <button
                  className="button button-primary button-large"
                  onClick={() => begin(false, selectedCategory ? (selectedCategory as GroupId) : 'student')}
                >
                  {t.findSchemesBtn} <ArrowRight size={18} />
                </button>
                <button
                  className="button button-secondary button-large"
                  onClick={() => {
                    const el = document.getElementById('schemes-showcase');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <BookOpen size={16} /> {t.browseSchemesBtn}
                </button>
              </div>

              {/* Guidance Aid & Disclaimer Banner */}
              <div className="disclaimer-banner">
                <Info size={17} />
                <div>
                  <strong>{lang === 'en' ? 'Guidance aid: ' : 'मार्गदर्शन सहायता: '}</strong>
                  {t.disclaimerNote}
                </div>
              </div>

              {/* Discreet Demo Sample Journeys for Testing */}
              <div style={{ marginTop: '16px' }}>
                <span style={{ fontSize: '11px', color: '#6e695f' }}>{t.trySampleLabel} </span>
                <button className="sample-helper-link" onClick={() => begin(true, 'student')}>
                  {lang === 'en' ? 'Student (Aarav)' : 'विद्यार्थी (आरव)'}
                </button>
                <span style={{ margin: '0 6px', color: '#ccc' }}>·</span>
                <button className="sample-helper-link" onClick={() => begin(true, 'farmer')}>
                  {lang === 'en' ? 'Farmer (Ramesh)' : 'किसान (रमेश)'}
                </button>
                <span style={{ margin: '0 6px', color: '#ccc' }}>·</span>
                <button className="sample-helper-link" onClick={() => begin(true, 'woman')}>
                  {lang === 'en' ? 'Woman (Geeta)' : 'महिला (गीता)'}
                </button>
              </div>
            </section>

            <section className="welcome-illustration" aria-label={t.heroNote}>
              <div className="illustration-sun" />
              <div className="illustration-card card-back">
                <span className="mini-check"><Check size={14} /></span>
                <span className="card-line wide" />
                <span className="card-line" />
                <span className="card-chip" />
              </div>
              <div className="illustration-card card-main">
                <div className="illu-heading">
                  <span className="illu-icon">{isKisan ? <Tractor size={20} /> : isMahtari ? <Heart size={20} /> : <GraduationCap size={20} />}</span>
                  <span>
                    <b>{scheme.shortName[lang]}</b>
                    <small>{scheme.ministry[lang]}</small>
                  </span>
                  <Sparkles size={17} />
                </div>
                <div className="illu-progress"><span /><span /><span /></div>
                <div className="illu-row"><span className="illu-tick"><Check size={12} /></span><span className="card-line wide" /></div>
                <div className="illu-row"><span className="illu-tick pale"><IndianRupee size={12} /></span><span className="card-line" /></div>
                <div className="illu-footer">
                  <span><ShieldCheck size={14} /> {isMahtari ? (lang === 'en' ? 'Sourced from mahtarivandan.cgstate.gov.in' : 'mahtarivandan.cgstate.gov.in से सत्यापित') : isKisan ? (lang === 'en' ? 'Sourced from pmkisan.gov.in' : 'pmkisan.gov.in से सत्यापित') : (lang === 'en' ? 'Sourced from myScheme.gov.in' : 'myScheme.gov.in से सत्यापित')}</span>
                  <ArrowRight size={15} />
                </div>
              </div>
              <div className="float-sticker">
                <span className="sticker-icon"><FileCheck2 size={16} /></span>
                <span>
                  <b>{isKisan ? '₹6,000 / year' : isMahtari ? '₹1,000 / month (₹12k/yr)' : 'Up to ₹20,000 / year'}</b>
                  <small>{isMahtari ? (lang === 'en' ? 'Direct individual bank DBT' : 'व्यक्तिगत बैंक खाते में डीबीटी') : (lang === 'en' ? 'Direct DBT to bank account' : 'सीधे बैंक खाते में डीबीटी')}</small>
                </span>
              </div>
              <div className="illustration-orbit orbit-one" /><div className="illustration-orbit orbit-two" />
              <span className="welcome-caption">{t.heroNote}</span>
            </section>
          </div>

          {/* 3 Simple Steps User Journey Section */}
          <section className="journey-section">
            <div className="journey-header">
              <h2>{t.journeyHeading}</h2>
              <p>{t.journeySubhead}</p>
            </div>
            <div className="three-steps-grid">
              <div className="journey-step-card">
                <span className="journey-step-number">1</span>
                <h3>{t.journeyStep1Title}</h3>
                <p>{t.journeyStep1Desc}</p>
              </div>
              <div className="journey-step-card">
                <span className="journey-step-number">2</span>
                <h3>{t.journeyStep2Title}</h3>
                <p>{t.journeyStep2Desc}</p>
              </div>
              <div className="journey-step-card">
                <span className="journey-step-number">3</span>
                <h3>{t.journeyStep3Title}</h3>
                <p>{t.journeyStep3Desc}</p>
              </div>
            </div>
          </section>

          {/* Supported Schemes Showcase with Scannable Scheme Cards */}
          <section id="schemes-showcase" className="schemes-showcase-section">
            <div className="showcase-header">
              <h2>{t.browseAllSchemesHeading}</h2>
              <p>{t.browseAllSchemesSubhead}</p>
            </div>
            <div className="scheme-card-grid">
              {schemes.map((s) => {
                const Icon = s.id === 'pm-kisan' ? Tractor : s.id === 'mahtari-vandan' ? Heart : GraduationCap;
                const catLabel =
                  s.category === 'farmer' ? t.catFarmer :
                  s.category === 'woman' ? t.catWoman : t.catStudent;

                return (
                  <article key={s.id} className="scannable-scheme-card">
                    <div>
                      <div className="scheme-card-header">
                        <div className="scheme-header-title-box">
                          <span className="scheme-card-icon"><Icon size={20} /></span>
                          <div>
                            <span className="scheme-card-cat">{catLabel}</span>
                            <h3 className="scheme-card-title">{s.shortName[lang]}</h3>
                          </div>
                        </div>
                      </div>

                      {/* Intended Audience */}
                      <div className="scheme-audience-row">
                        <Users size={15} />
                        <span><strong>{t.intendedAudienceLabel}</strong> {s.intendedAudience[lang]}</span>
                      </div>

                      {/* Benefit */}
                      <div>
                        <span className="scheme-benefit-pill">
                          <IndianRupee size={15} />
                          <span>{s.benefits.summary[lang]}</span>
                        </span>
                      </div>

                      {/* Short Eligibility Summary & Why it may match */}
                      <div className="scheme-scannable-block">
                        <div className="scheme-block-title">
                          <span>{t.whyMayMatchLabel}</span>
                          <span className="cautious-tag">{t.mayMatchPill}</span>
                        </div>
                        <ul className="scheme-rules-bullets">
                          {s.eligibilitySummary[lang].map((rule, idx) => (
                            <li key={idx}>{rule}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Documents to prepare */}
                      <div className="scheme-scannable-block" style={{ background: '#ffffff' }}>
                        <div className="scheme-block-title">
                          <span>{t.docsToPrepareLabel}</span>
                        </div>
                        <p className="scheme-docs-summary">{s.documentsSummary[lang]}</p>
                      </div>

                      {/* Official source and last-checked date */}
                      <div className="scheme-card-source-bar">
                        <ShieldCheck size={14} color="#1d5c43" />
                        <span>
                          {t.sourceLabel}{' '}
                          <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer">
                            {s.sourceName}
                          </a>
                        </span>
                        <span className="freshness-dot">·</span>
                        <Clock size={13} />
                        <span>{t.checkedDateLabel} {s.sourceCheckedDate}</span>
                      </div>
                    </div>

                    {/* Clear 3 Actions */}
                    <div className="scheme-card-actions-grid">
                      <button
                        type="button"
                        className="scheme-action-subbtn"
                        onClick={() => {
                          setSchemeId(s.id as SchemeId);
                          setScreen('results');
                        }}
                      >
                        <BookOpen size={14} /> {t.viewDetailsBtn}
                      </button>
                      <button
                        type="button"
                        className="scheme-action-subbtn"
                        onClick={() => {
                          setSchemeId(s.id as SchemeId);
                          setScreen('documents');
                        }}
                      >
                        <ClipboardCheck size={14} /> {t.prepareDocsBtn}
                      </button>
                      <button
                        type="button"
                        className="scheme-action-portal-btn portal-btn-full"
                        onClick={() => window.open(s.applicationUrl, '_blank', 'noopener,noreferrer')}
                      >
                        <span>{t.continueOnPortalBtn}</span>
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="privacy-panel">
            <span className="privacy-icon"><LockKeyhole size={19} /></span>
            <div>
              <strong>{t.privacyTitle}</strong>
              <p>{t.privacyBody}</p>
            </div>
            <span className="privacy-tag"><ShieldCheck size={14} />{lang === 'en' ? 'Private Session' : 'निजी सत्र'}</span>
          </section>

          <footer className="site-footer">
            <span>{t.footer}</span>
            <span className="footer-demo"><span />{scheme.sourceName}</span>
          </footer>
        </main>
      ) : (
        <div className="workspace">
          <aside className="side-rail" aria-label="Progress">
            <div className="rail-intro">
              <span className="rail-label">{t.officialBadge}</span>
              <p>{scheme.shortName[lang]}</p>
            </div>
            <ol className="step-list">
              {steps.map((step, index) => {
                const active = screen === step;
                const done = index < currentStepIndex;
                const label =
                  step === 'profile' ? t.profile :
                  step === 'results' ? t.explore :
                  step === 'details' ? t.eligibilityCheck :
                  step === 'documents' ? t.documents : t.draft;
                return (
                  <li className={`${active ? 'active' : ''} ${done ? 'done' : ''}`} key={step}>
                    <button
                      onClick={() => { if (done || active) setScreen(step); }}
                      disabled={!done && !active}
                      aria-current={active ? 'step' : undefined}
                    >
                      <span className="step-mark">{done ? <Check size={14} /> : index + 1}</span>
                      <span className="step-name">{label}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="rail-help">
              <div className="help-mark"><HeartHandshake size={17} /></div>
              <span>{lang === 'en' ? 'Guidance aid — official authorities make final determination.' : 'मार्गदर्शन सहायता — आधिकारिक प्राधिकरण अंतिम निर्णय करते हैं।'}</span>
            </div>
          </aside>

          <main className="main-content">
            <div className="mobile-progress">
              <span>Step {activeStepNum} of 5</span>
              <div><i style={{ width: `${(activeStepNum / 5) * 100}%` }} /></div>
            </div>

            <div className="content-wrap">
              <div className="content-topline">
                <button className="back-button" onClick={goBack}><ArrowLeft size={16} />{t.back}</button>
                {isSample && <span className="sample-profile-label"><BadgeCheck size={14} />{t.sampleBadge}</span>}
              </div>

              {/* SCREEN 1: PROFILE */}
              {screen === 'profile' && (
                <section className="flow-section" key="profile">
                  <div className="section-heading">
                    <span className="section-icon"><UserRound size={20} /></span>
                    <div>
                      <div className="eyebrow">Step 1 of 5 · {t.profile}</div>
                      <h1>{t.profileTitle}</h1>
                      <p>{t.profileBody}</p>
                    </div>
                  </div>

                  <form className="profile-form" onSubmit={(event: FormEvent) => { event.preventDefault(); goNext(); }}>
                    <div className="form-row two-cols">
                      <Field label={t.group} why={t.groupWhy} htmlFor="group">
                        <select id="group" value={profile.group} onChange={(e) => updateProfile('group', e.target.value)} required>
                          <option value="">{t.choose}</option>
                          <option value="student">{t.catStudent}</option>
                          <option value="farmer">{t.catFarmer}</option>
                          <option value="woman">{t.catWoman}</option>
                          <option value="other">{t.catOther}</option>
                        </select>
                        {profile.group === 'other' && (
                          <div className="category-other-notice" style={{ marginTop: '8px' }}>
                            <Info size={14} />
                            <div>{t.catOtherNotice}</div>
                          </div>
                        )}
                      </Field>
                      <Field label={t.age} why={t.ageWhy} htmlFor="age">
                        <select id="age" value={profile.ageBand} onChange={(e) => updateProfile('ageBand', e.target.value)} required>
                          <option value="">{t.choose}</option>
                          {ages.map((a, i) => <option value={a} key={a}>{t.ageOptions[i]}</option>)}
                        </select>
                      </Field>
                    </div>

                    <div className="form-row two-cols">
                      <Field label={t.state} why={t.stateWhy} htmlFor="state">
                        <select id="state" value={profile.state} onChange={(e) => updateProfile('state', e.target.value)} required>
                          <option value="">{t.chooseState}</option>
                          {copy.en.states.map((st, i) => (
                            <option key={st} value={st}>{lang === 'hi' ? t.states[i] : st}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label={<>{t.district}<em>{t.optional}</em></>} why={t.districtWhy} htmlFor="district">
                        <input
                          id="district"
                          value={profile.district}
                          onChange={(e) => updateProfile('district', e.target.value)}
                          placeholder={lang === 'en' ? 'e.g. Pune / Varanasi' : 'जैसे, पुणे / वाराणसी'}
                          maxLength={60}
                        />
                      </Field>
                    </div>

                    <Field label={<>{t.name}<em>{t.optional}</em></>} why={t.nameWhy} htmlFor="preferredName">
                      <input
                        id="preferredName"
                        value={profile.preferredName}
                        onChange={(e) => updateProfile('preferredName', e.target.value)}
                        placeholder={lang === 'en' ? 'e.g. Ramesh Verma' : 'जैसे, रमेश वर्मा'}
                        maxLength={80}
                      />
                    </Field>

                    <div className="privacy-inline">
                      <LockKeyhole size={15} />
                      <span>{t.privacyBody}</span>
                    </div>

                    <div className="form-actions">
                      <span className="form-meta"><span className="required-star">*</span> {t.required}</span>
                      <button type="submit" disabled={!profile.group || !profile.ageBand || !profile.state} className="button button-primary">
                        {t.seeMatchesBtn}<ArrowRight size={17} />
                      </button>
                    </div>
                  </form>
                </section>
              )}

              {/* SCREEN 2: SCHEME OVERVIEW & DETAIL */}
              {screen === 'results' && (
                <section className="flow-section" key="results">
                  <div className="section-heading">
                    <span className="section-icon">{isKisan ? <Tractor size={20} /> : isMahtari ? <Heart size={20} /> : <BookOpen size={20} />}</span>
                    <div>
                      <div className="eyebrow">Step 2 of 5 · {scheme.shortName[lang]}</div>
                      <h1>{isKisan ? (lang === 'en' ? 'PM-KISAN Samman Nidhi Scheme Overview' : 'पीएम-किसान सम्मान निधि योजना अवलोकन') : isMahtari ? (lang === 'en' ? 'Mahtari Vandan Yojana Scheme Overview' : 'मह्तारी वंदन योजना विवरण एवं नियम') : t.resultsTitle}</h1>
                      <p>{t.resultsBody}</p>
                    </div>
                  </div>

                  {/* Scheme Switcher Tabs */}
                  <div className="category-switch-strip">
                    <button
                      className={`category-tab-btn ${schemeId === 'pm-usp-csss' ? 'active' : ''}`}
                      onClick={() => switchScheme('pm-usp-csss')}
                      type="button"
                    >
                      <GraduationCap size={16} />
                      <span>{lang === 'en' ? 'Student: PM-USP Scholarship' : 'विद्यार्थी: पीएम-यूएसपी छात्रवृत्ति'}</span>
                    </button>
                    <button
                      className={`category-tab-btn ${schemeId === 'pm-kisan' ? 'active' : ''}`}
                      onClick={() => switchScheme('pm-kisan')}
                      type="button"
                    >
                      <Tractor size={16} />
                      <span>{lang === 'en' ? 'Farmer: PM-KISAN Samman Nidhi' : 'किसान: पीएम-किसान सम्मान निधि'}</span>
                    </button>
                    <button
                      className={`category-tab-btn ${schemeId === 'mahtari-vandan' ? 'active' : ''}`}
                      onClick={() => switchScheme('mahtari-vandan')}
                      type="button"
                    >
                      <Heart size={16} />
                      <span>{lang === 'en' ? 'Woman: Mahtari Vandan Yojana' : 'महिला: मह्तारी वंदन योजना'}</span>
                    </button>
                  </div>

                  {/* Official Source Link & Checked Date */}
                  <div className="source-badge-strip">
                    <span>
                      <strong>{t.sourceLabel}</strong>{' '}
                      <a href={scheme.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); openSourceUrl(); }}>
                        {scheme.sourceName} ({scheme.shortName[lang]}) <ExternalLink size={13} />
                      </a>
                    </span>
                    <span><strong>{t.checkedDateLabel}</strong> {scheme.sourceCheckedDate}</span>
                  </div>

                  {/* Main Overview Card */}
                  <article className="result-card" style={{ gridTemplateColumns: '1fr', padding: '20px 24px' }}>
                    <div className="badge-row">
                      <span className="fresh-renewal-pill"><Building2 size={13} /> {scheme.ministry[lang]}</span>
                      <StatusBadge status={evaluation.status} label={evaluation.status === 'possible' ? t.matchPossible : evaluation.status === 'no_match' ? t.matchNo : t.matchNeed} />
                    </div>

                    <h2 style={{ fontSize: '18px', margin: '12px 0 6px' }}>{scheme.title[lang]}</h2>

                    {/* Intended Audience */}
                    <div className="scheme-audience-row" style={{ margin: '4px 0 12px' }}>
                      <Users size={15} />
                      <span><strong>{t.intendedAudienceLabel}</strong> {scheme.intendedAudience[lang]}</span>
                    </div>

                    <p style={{ fontSize: '12px', lineHeight: '1.65', color: '#4a473f', margin: '0 0 16px' }}>{scheme.overview[lang]}</p>

                    {/* Benefit Tiers */}
                    <div style={{ marginTop: '10px' }}>
                      <strong style={{ fontSize: '12px', color: '#242321', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <IndianRupee size={15} color="#1d5c43" /> {t.benefitsHeading}
                      </strong>
                      <div className="benefit-grid">
                        {scheme.benefits.items.map((item, idx) => (
                          <div className="benefit-card" key={idx}>
                            <span className="benefit-amount">{item.amount}</span>
                            <span className="benefit-title">{item.title[lang]}</span>
                            <span className="benefit-desc">{item.desc[lang]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Application Window & Deadline Verification Banner */}
                    <div className="portal-action-banner">
                      <div className="portal-action-banner-text">
                        <strong>{t.windowBannerTitle}</strong>
                        <p>{scheme.datesNotice[lang]}</p>
                        <p style={{ marginTop: '5px', fontSize: '11px', color: '#744b13', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <AlertTriangle size={13} style={{ flexShrink: 0 }} />
                          <span><strong>{t.verifyOnPortalNote}</strong> {t.windowUnconfirmedNotice}</span>
                        </p>
                      </div>
                      <button className="button button-primary" onClick={openOfficialPortal} type="button">
                        {t.checkCurrentAppInfo} <ExternalLink size={15} />
                      </button>
                    </div>

                    {/* PM-USP Fresh vs Renewal Pathway Selection */}
                    {isUSP && (
                      <div style={{ marginTop: '16px' }}>
                        <strong style={{ fontSize: '13px', color: '#242321' }}>{lang === 'en' ? 'Select your application pathway:' : 'अपना आवेदन मार्ग चुनें:'}</strong>
                        <div className="path-selector">
                          <div
                            className={`path-card ${answers.applicationType === 'fresh' ? 'selected' : ''}`}
                            onClick={() => updateAnswer('applicationType', 'fresh')}
                            role="button"
                            tabIndex={0}
                          >
                            <span className="path-card-title">
                              {t.freshPathway} {answers.applicationType === 'fresh' && <CheckCircle2 size={16} color="#964724" />}
                            </span>
                            <span className="path-card-desc">{t.freshPathwayDesc}</span>
                          </div>

                          <div
                            className={`path-card ${answers.applicationType === 'renewal' ? 'selected' : ''}`}
                            onClick={() => updateAnswer('applicationType', 'renewal')}
                            role="button"
                            tabIndex={0}
                          >
                            <span className="path-card-title">
                              {t.renewalPathway} {answers.applicationType === 'renewal' && <CheckCircle2 size={16} color="#964724" />}
                            </span>
                            <span className="path-card-desc">{t.renewalPathwayDesc}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PM-KISAN Potential Eligibility & Application Routes summary */}
                    {isKisan && scheme.potentialEligibility && (
                      <div style={{ marginTop: '16px' }}>
                        <strong style={{ fontSize: '13px', color: '#242321' }}>{lang === 'en' ? 'Potential Beneficiaries & Key Rules:' : 'संभावित लाभार्थी एवं मुख्य नियम:'}</strong>
                        <ul style={{ fontSize: '12px', color: '#4a473f', lineHeight: '1.6', paddingLeft: '20px', margin: '8px 0 14px' }}>
                          {scheme.potentialEligibility[lang].map((rule, idx) => (
                            <li key={idx} style={{ marginBottom: '6px' }}>{rule}</li>
                          ))}
                        </ul>

                        <div className="callout-box" style={{ background: '#f5faf6', borderColor: '#b8deb9', color: '#164e37' }}>
                          <CheckCircle2 size={16} color="#1d5c43" />
                          <div>
                            <strong>{lang === 'en' ? 'Open to all land sizes: ' : 'सभी जोत आकारों के लिए: '}</strong>
                            {lang === 'en'
                              ? 'myScheme states the scheme is not limited only to small and marginal farmers. Landholding farmer families with cultivable land in their names are potentially eligible subject to listed exclusions.'
                              : 'myScheme के अनुसार यह योजना केवल छोटे व सीमांत किसानों तक सीमित नहीं है। परिवार के नाम पर खेती योग्य जमीन दर्ज होने पर परिवार संभावित रूप से पात्र है (बशर्ते अपवर्जन लागू न हो)।'}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mahtari Vandan Potential Eligibility */}
                    {isMahtari && scheme.potentialEligibility && (
                      <div style={{ marginTop: '16px' }}>
                        <strong style={{ fontSize: '13px', color: '#242321' }}>{lang === 'en' ? 'Eligibility Guidelines (2024 State Source & Current Portal Requirements):' : 'पात्रता दिशानिर्देश (2024 राज्य स्रोत एवं वर्तमान पोर्टल नियम):'}</strong>
                        <ul style={{ fontSize: '12px', color: '#4a473f', lineHeight: '1.6', paddingLeft: '20px', margin: '8px 0 14px' }}>
                          {scheme.potentialEligibility[lang].map((rule, idx) => (
                            <li key={idx} style={{ marginBottom: '6px' }}>
                              {rule}
                              {rule.includes('2024') && (
                                <span className="unconfirmed-detail-tag">
                                  <AlertTriangle size={11} /> {t.verifyOnPortalNote}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Exclusions Breakdown */}
                    <div style={{ marginTop: '16px' }}>
                      <strong style={{ fontSize: '13px', color: '#242321', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertTriangle size={15} color="#843226" /> {t.exclusionsHeading}
                      </strong>
                      <ul style={{ fontSize: '12px', color: '#524e46', lineHeight: '1.6', paddingLeft: '20px', margin: '8px 0 14px' }}>
                        {scheme.exclusions[lang].map((ex, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>{ex}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Dedicated Official Sources & Freshness Section for ALL schemes */}
                    <div className="official-sources-section">
                      <div className="official-sources-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ShieldCheck size={18} color="#1d5c43" />
                          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#242321' }}>
                            {t.officialSourcesHeading}
                          </h3>
                        </div>
                        <span className="source-freshness-pill">
                          <Clock size={12} /> {t.checkedOnLabel} {scheme.sourceCheckedDate}
                        </span>
                      </div>
                      <p style={{ margin: '4px 0 12px', fontSize: '11px', color: '#524e46' }}>
                        {t.officialSourcesSubhead}
                      </p>

                      <div className="official-sources-grid">
                        {scheme.sources && scheme.sources.map((src) => {
                          const isVerified = src.status === 'verified';
                          const isNeedsReview = src.status === 'needs_review';
                          const statusClass = isVerified ? 'status-verified' : isNeedsReview ? 'status-needs_review' : 'status-unconfirmed';
                          const statusLabel = isVerified ? t.statusVerifiedLabel : isNeedsReview ? t.statusNeedsReviewLabel : t.statusUnconfirmedLabel;
                          const StatusIcon = isVerified ? CheckCircle2 : isNeedsReview ? AlertTriangle : Info;

                          return (
                            <div className={`official-source-card ${statusClass}`} key={src.id}>
                              <div className="official-source-card-top">
                                <a
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="official-source-title-link"
                                >
                                  <span>{src.title[lang]}</span>
                                  <ExternalLink size={13} style={{ flexShrink: 0 }} />
                                </a>
                                <span className={`source-status-badge ${statusClass}`}>
                                  <StatusIcon size={12} /> {statusLabel}
                                </span>
                              </div>

                              <div className="official-source-meta-row">
                                <span className="source-supports-tag">
                                  <strong>{t.supportsDetailLabel}</strong> {src.supportsDetail[lang]}
                                </span>
                                <span className="source-date-tag">
                                  <Clock size={11} /> {t.checkedOnLabel} {src.checkedDate}
                                </span>
                              </div>

                              {src.statusNote && (
                                <p className="official-source-note">
                                  {src.status !== 'verified' && (
                                    <strong style={{ color: '#8a4b13' }}>{t.verifyOnPortalNote} </strong>
                                  )}
                                  {src.statusNote[lang]}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Documents to Prepare block */}
                    <div className="scheme-scannable-block" style={{ marginTop: '16px', background: '#ffffff' }}>
                      <strong style={{ fontSize: '12px', color: '#242321' }}>{t.docsToPrepareLabel}</strong>
                      <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#4a473f', lineHeight: '1.5' }}>{scheme.documentsSummary[lang]}</p>
                    </div>

                    {/* Preliminary caution note */}
                    <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fcfaf6', border: '1px solid #ebd9c5', borderRadius: '8px', fontSize: '11px', color: '#6d450f', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Info size={15} style={{ flexShrink: 0 }} />
                      <span>{t.preliminaryNotice}</span>
                    </div>

                    {/* Source attribution & guidance note */}
                    <div className="callout-box callout-notice" style={{ marginTop: '16px' }}>
                      <ShieldCheck size={16} />
                      <div>{scheme.sourceNotice[lang]}</div>
                    </div>
                  </article>

                  <div className="section-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      <button className="button button-primary" onClick={goNext}>
                        {t.checkEligibilityBtn}<ArrowRight size={17} />
                      </button>
                      <button className="button button-secondary" onClick={() => setScreen('documents')}>
                        <ClipboardCheck size={16} /> {t.prepareDocsBtn}
                      </button>
                    </div>
                    <button className="button button-secondary" onClick={openOfficialPortal}>
                      <span>{t.continueOnPortalBtn}</span> <ExternalLink size={15} />
                    </button>
                  </div>
                </section>
              )}

              {/* SCREEN 3: GUIDED ELIGIBILITY REVIEW */}
              {screen === 'details' && (
                <section className="flow-section" key="details">
                  <div className="section-heading">
                    <span className="section-icon"><ShieldCheck size={20} /></span>
                    <div>
                      <div className="eyebrow">Step 3 of 5 · {t.eligibilityCheck} ({scheme.shortName[lang]})</div>
                      <h1>{isKisan ? (lang === 'en' ? 'PM-KISAN Guided Eligibility Review' : 'पीएम-किसान मार्गदर्शित पात्रता समीक्षा') : isMahtari ? (lang === 'en' ? 'Mahtari Vandan Guided Eligibility Review' : 'मह्तारी वंदन मार्गदर्शित पात्रता समीक्षा') : t.eligibilityTitle}</h1>
                      <p>{isKisan ? (lang === 'en' ? 'Check whether your family meets the cultivable landholding rules and non-exclusion conditions defined on myScheme and pmkisan.gov.in.' : 'जाँचें कि क्या आपका परिवार myScheme और pmkisan.gov.in पर निर्धारित भूमि स्वामित्व व गैर-अपवर्जन शर्तों को पूरा करता है।') : isMahtari ? (lang === 'en' ? 'Answer only source-supported questions to check preliminary match against official guidelines. Sourced rules are labeled with source status.' : 'आधिकारिक दिशानिर्देशों के आधार पर प्रारंभिक पात्रता जाँचने के लिए केवल स्रोत-समर्थित प्रश्नों के उत्तर दें।') : t.eligibilityBody}</p>
                    </div>
                  </div>

                  <div className="detail-layout">
                    <div className="questions-card">
                      {/* --- PM-USP QUESTIONS --- */}
                      {isUSP && (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                            <span className="fresh-renewal-pill">
                              {answers.applicationType === 'renewal' ? t.renewalPathway : t.freshPathway}
                            </span>
                            <button className="inline-link" onClick={() => updateAnswer('applicationType', answers.applicationType === 'fresh' ? 'renewal' : 'fresh')}>
                              {answers.applicationType === 'fresh' ? (lang === 'en' ? 'Switch to Renewal' : 'नवीनीकरण पर बदलें') : (lang === 'en' ? 'Switch to Fresh' : 'नया आवेदन पर बदलें')}
                            </button>
                          </div>

                          {answers.applicationType === 'fresh' && (
                            <>
                              {/* 1. Board & Stream */}
                              <div className="question-card">
                                <div className="question-icon"><BookOpen size={18} /></div>
                                <div className="question-copy">
                                  <h3>{lang === 'en' ? 'Class 12 Board, Stream & Year' : 'कक्षा 12वीं बोर्ड, संकाय व वर्ष'}</h3>
                                  <small>{lang === 'en' ? 'Needed to match your percentile against board quota.' : 'बोर्ड कोटे से पर्सेंटाइल मिलान के लिए आवश्यक।'}</small>
                                  <div className="form-row two-cols" style={{ marginTop: '10px' }}>
                                    <Field label={t.boardLabel} why="" htmlFor="q_board">
                                      <input
                                        id="q_board"
                                        value={answers.class12Board || ''}
                                        onChange={(e) => updateAnswer('class12Board', e.target.value)}
                                        placeholder="e.g. CBSE / State Board"
                                      />
                                    </Field>
                                    <Field label={t.streamLabel} why="" htmlFor="q_stream">
                                      <select
                                        id="q_stream"
                                        value={answers.class12Stream || ''}
                                        onChange={(e) => updateAnswer('class12Stream', e.target.value as CombinedEligibilityAnswers['class12Stream'])}
                                      >
                                        <option value="">{t.choose}</option>
                                        <option value="science">{t.streams.science}</option>
                                        <option value="commerce">{t.streams.commerce}</option>
                                        <option value="arts">{t.streams.arts}</option>
                                        <option value="other">{t.streams.other}</option>
                                      </select>
                                    </Field>
                                  </div>
                                </div>
                              </div>

                              {/* 2. 80th Percentile Standing */}
                              <div className="question-card">
                                <div className="question-icon"><GraduationCap size={18} /></div>
                                <div className="question-copy">
                                  <h3>{t.percentileQuestion}</h3>
                                  <small>{t.percentileExplain}</small>
                                  <div className="callout-box callout-warning" style={{ margin: '8px 0 10px' }}>
                                    <AlertTriangle size={15} />
                                    <span style={{ fontSize: '11px', lineHeight: '1.5' }}>{t.percentileWarning}</span>
                                  </div>
                                  <div className="answer-options" style={{ flexWrap: 'wrap' }}>
                                    <button
                                      className={answers.above80thPercentile === 'yes' ? 'chosen' : ''}
                                      onClick={() => updateAnswer('above80thPercentile', 'yes')}
                                      aria-pressed={answers.above80thPercentile === 'yes'}
                                    >
                                      <CheckCircle2 size={15} /> {t.yes} ({lang === 'en' ? '> 80th Percentile' : '> 80वीं पर्सेंटाइल'})
                                    </button>
                                    <button
                                      className={answers.above80thPercentile === 'no' ? 'chosen' : ''}
                                      onClick={() => updateAnswer('above80thPercentile', 'no')}
                                      aria-pressed={answers.above80thPercentile === 'no'}
                                    >
                                      <X size={15} /> {t.no} ({lang === 'en' ? 'Below 80th' : '80वीं से कम'})
                                    </button>
                                    <button
                                      className={answers.above80thPercentile === 'unsure' ? 'chosen' : ''}
                                      onClick={() => updateAnswer('above80thPercentile', 'unsure')}
                                      aria-pressed={answers.above80thPercentile === 'unsure'}
                                    >
                                      <Info size={15} /> {t.unsure}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}

                          {/* 3. Regular Degree Course */}
                          <div className="question-card">
                            <div className="question-icon"><BookOpen size={18} /></div>
                            <div className="question-copy">
                              <h3>{t.regularDegreeQuestion}</h3>
                              <small>{t.regularDegreeHelp}</small>
                              <div className="answer-options">
                                <button
                                  className={answers.regularDegreeCourse === 'yes' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('regularDegreeCourse', 'yes')}
                                  aria-pressed={answers.regularDegreeCourse === 'yes'}
                                >
                                  <CheckCircle2 size={15} /> {t.yes}
                                </button>
                                <button
                                  className={answers.regularDegreeCourse === 'no' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('regularDegreeCourse', 'no')}
                                  aria-pressed={answers.regularDegreeCourse === 'no'}
                                >
                                  <X size={15} /> {t.no}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 4. Recognized Institution */}
                          <div className="question-card">
                            <div className="question-icon"><Building2 size={18} /></div>
                            <div className="question-copy">
                              <h3>{t.recognizedInstQuestion}</h3>
                              <small>{t.recognizedInstHelp}</small>
                              <div className="answer-options">
                                <button
                                  className={answers.recognizedInstitution === 'yes' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('recognizedInstitution', 'yes')}
                                  aria-pressed={answers.recognizedInstitution === 'yes'}
                                >
                                  <CheckCircle2 size={15} /> {t.yes}
                                </button>
                                <button
                                  className={answers.recognizedInstitution === 'no' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('recognizedInstitution', 'no')}
                                  aria-pressed={answers.recognizedInstitution === 'no'}
                                >
                                  <X size={15} /> {t.no}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 5. Family Income Range */}
                          <div className="question-card">
                            <div className="question-icon"><IndianRupee size={18} /></div>
                            <div className="question-copy">
                              <h3>{t.incomeQuestion}</h3>
                              <small>{t.incomeHelp}</small>
                              <div className="answer-options" style={{ flexWrap: 'wrap' }}>
                                <button
                                  className={answers.familyIncomeRange === 'upto_450k' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('familyIncomeRange', 'upto_450k')}
                                  aria-pressed={answers.familyIncomeRange === 'upto_450k'}
                                >
                                  <CheckCircle2 size={15} /> {t.incomeUpto}
                                </button>
                                <button
                                  className={answers.familyIncomeRange === 'above_450k' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('familyIncomeRange', 'above_450k')}
                                  aria-pressed={answers.familyIncomeRange === 'above_450k'}
                                >
                                  <X size={15} /> {t.incomeAbove}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 6. Other Scholarship Exclusion */}
                          <div className="question-card">
                            <div className="question-icon"><AlertTriangle size={18} /></div>
                            <div className="question-copy">
                              <h3>{t.otherScholarshipQuestion}</h3>
                              <small>{t.otherScholarshipHelp}</small>
                              <div className="answer-options" style={{ flexWrap: 'wrap' }}>
                                <button
                                  className={answers.otherScholarshipReceived === 'none' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('otherScholarshipReceived', 'none')}
                                  aria-pressed={answers.otherScholarshipReceived === 'none'}
                                >
                                  <CheckCircle2 size={15} /> {t.otherScholarshipNone}
                                </button>
                                <button
                                  className={answers.otherScholarshipReceived === 'receiving' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('otherScholarshipReceived', 'receiving')}
                                  aria-pressed={answers.otherScholarshipReceived === 'receiving'}
                                >
                                  <X size={15} /> {t.otherScholarshipYes}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 7. Aadhaar Seeded Bank Account */}
                          <div className="question-card">
                            <div className="question-icon"><LockKeyhole size={18} /></div>
                            <div className="question-copy">
                              <h3>{t.bankAadhaarQuestion}</h3>
                              <small>{t.bankAadhaarHelp}</small>
                              <div className="answer-options" style={{ flexWrap: 'wrap' }}>
                                <button
                                  className={answers.aadhaarSeededBankAccount === 'yes' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('aadhaarSeededBankAccount', 'yes')}
                                  aria-pressed={answers.aadhaarSeededBankAccount === 'yes'}
                                >
                                  <CheckCircle2 size={15} /> {t.bankAadhaarYes}
                                </button>
                                <button
                                  className={answers.aadhaarSeededBankAccount === 'no' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('aadhaarSeededBankAccount', 'no')}
                                  aria-pressed={answers.aadhaarSeededBankAccount === 'no'}
                                >
                                  <Info size={15} /> {t.bankAadhaarNo}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 8. Renewal specific questions */}
                          {answers.applicationType === 'renewal' && (
                            <>
                              <div className="question-card">
                                <div className="question-icon"><CheckCircle2 size={18} /></div>
                                <div className="question-copy">
                                  <h3>{t.renewalMarksQuestion}</h3>
                                  <small>{t.renewalMarksHelp}</small>
                                  <div className="answer-options">
                                    <button
                                      className={answers.annualExamMarks50Plus === 'yes' ? 'chosen' : ''}
                                      onClick={() => updateAnswer('annualExamMarks50Plus', 'yes')}
                                      aria-pressed={answers.annualExamMarks50Plus === 'yes'}
                                    >
                                      <CheckCircle2 size={15} /> {t.yes}
                                    </button>
                                    <button
                                      className={answers.annualExamMarks50Plus === 'no' ? 'chosen' : ''}
                                      onClick={() => updateAnswer('annualExamMarks50Plus', 'no')}
                                      aria-pressed={answers.annualExamMarks50Plus === 'no'}
                                    >
                                      <X size={15} /> {t.no}
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="question-card">
                                <div className="question-icon"><FileCheck2 size={18} /></div>
                                <div className="question-copy">
                                  <h3>{t.renewalAttendanceQuestion}</h3>
                                  <small>{t.renewalAttendanceHelp}</small>
                                  <div className="answer-options">
                                    <button
                                      className={answers.attendance75Plus === 'yes' ? 'chosen' : ''}
                                      onClick={() => updateAnswer('attendance75Plus', 'yes')}
                                      aria-pressed={answers.attendance75Plus === 'yes'}
                                    >
                                      <CheckCircle2 size={15} /> {t.yes}
                                    </button>
                                    <button
                                      className={answers.attendance75Plus === 'no' ? 'chosen' : ''}
                                      onClick={() => updateAnswer('attendance75Plus', 'no')}
                                      aria-pressed={answers.attendance75Plus === 'no'}
                                    >
                                      <X size={15} /> {t.no}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      )}

                      {/* --- PM-KISAN QUESTIONS --- */}
                      {isKisan && (
                        <>
                          {/* 1. Farmer Family */}
                          <div className="question-card">
                            <div className="question-icon"><UserRound size={18} /></div>
                            <div className="question-copy">
                              <h3>{t.kisanFamilyQuestion}</h3>
                              <small>{t.kisanFamilyHelp}</small>
                              <div className="answer-options">
                                <button
                                  className={answers.isFarmerFamily === 'yes' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('isFarmerFamily', 'yes')}
                                  aria-pressed={answers.isFarmerFamily === 'yes'}
                                >
                                  <CheckCircle2 size={15} /> {t.yes}
                                </button>
                                <button
                                  className={answers.isFarmerFamily === 'no' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('isFarmerFamily', 'no')}
                                  aria-pressed={answers.isFarmerFamily === 'no'}
                                >
                                  <X size={15} /> {t.no}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 2. Cultivable Landholding in Name */}
                          <div className="question-card">
                            <div className="question-icon"><Landmark size={18} /></div>
                            <div className="question-copy">
                              <h3>{t.kisanLandQuestion}</h3>
                              <small>{t.kisanLandHelp}</small>
                              <div className="answer-options">
                                <button
                                  className={answers.hasCultivableLandInName === 'yes' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('hasCultivableLandInName', 'yes')}
                                  aria-pressed={answers.hasCultivableLandInName === 'yes'}
                                >
                                  <CheckCircle2 size={15} /> {t.yes} ({lang === 'en' ? 'Land in family name' : 'परिवार के नाम जमीन दर्ज है'})
                                </button>
                                <button
                                  className={answers.hasCultivableLandInName === 'no' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('hasCultivableLandInName', 'no')}
                                  aria-pressed={answers.hasCultivableLandInName === 'no'}
                                >
                                  <X size={15} /> {t.no} ({lang === 'en' ? 'No land in name' : 'नाम पर जमीन नहीं है'})
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 3. Institutional Landholder Exclusion */}
                          <div className="question-card">
                            <div className="question-icon"><Building2 size={18} /></div>
                            <div className="question-copy">
                              <h3>{t.kisanInstLandQuestion}</h3>
                              <small>{t.kisanInstLandHelp}</small>
                              <div className="answer-options">
                                <button
                                  className={answers.isInstitutionalLandholder === 'no' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('isInstitutionalLandholder', 'no')}
                                  aria-pressed={answers.isInstitutionalLandholder === 'no'}
                                >
                                  <CheckCircle2 size={15} /> {t.no} ({lang === 'en' ? 'Private farmer family land' : 'निजी किसान परिवार की भूमि'})
                                </button>
                                <button
                                  className={answers.isInstitutionalLandholder === 'yes' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('isInstitutionalLandholder', 'yes')}
                                  aria-pressed={answers.isInstitutionalLandholder === 'yes'}
                                >
                                  <X size={15} /> {t.yes} ({lang === 'en' ? 'Institutional land (Excluded)' : 'संस्थागत भूमि (बहिष्कृत)'})
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 4. Constitutional Post Exclusion */}
                          <div className="question-card">
                            <div className="question-icon"><AlertTriangle size={18} /></div>
                            <div className="question-copy">
                              <h3>{t.kisanConstPostQuestion}</h3>
                              <small>{t.kisanConstPostHelp}</small>
                              <div className="answer-options">
                                <button
                                  className={answers.holdsConstitutionalPost === 'no' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('holdsConstitutionalPost', 'no')}
                                  aria-pressed={answers.holdsConstitutionalPost === 'no'}
                                >
                                  <CheckCircle2 size={15} /> {t.no} ({lang === 'en' ? 'None in family' : 'परिवार में कोई नहीं'})
                                </button>
                                <button
                                  className={answers.holdsConstitutionalPost === 'yes' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('holdsConstitutionalPost', 'yes')}
                                  aria-pressed={answers.holdsConstitutionalPost === 'yes'}
                                >
                                  <X size={15} /> {t.yes} ({lang === 'en' ? 'Yes (Excluded)' : 'हाँ (बहिष्कृत)'})
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 5. Govt / PSU Employee Exclusion */}
                          <div className="question-card">
                            <div className="question-icon"><Building2 size={18} /></div>
                            <div className="question-copy">
                              <h3>{t.kisanGovtEmpQuestion}</h3>
                              <small>{t.kisanGovtEmpHelp}</small>
                              <div className="answer-options" style={{ flexWrap: 'wrap' }}>
                                <button
                                  className={answers.isGovtEmployeeNotGroupD === 'no' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('isGovtEmployeeNotGroupD', 'no')}
                                  aria-pressed={answers.isGovtEmployeeNotGroupD === 'no'}
                                >
                                  <CheckCircle2 size={15} /> {t.no} ({lang === 'en' ? 'No (or Class IV/MTS exempted)' : 'नहीं (या चतुर्थ श्रेणी/MTS)'})
                                </button>
                                <button
                                  className={answers.isGovtEmployeeNotGroupD === 'yes' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('isGovtEmployeeNotGroupD', 'yes')}
                                  aria-pressed={answers.isGovtEmployeeNotGroupD === 'yes'}
                                >
                                  <X size={15} /> {t.yes} ({lang === 'en' ? 'Regular Officer/Emp (Excluded)' : 'नियमित कर्मचारी (बहिष्कृत)'})
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 6. Pensioner ₹10k+ Exclusion */}
                          <div className="question-card">
                            <div className="question-icon"><IndianRupee size={18} /></div>
                            <div className="question-copy">
                              <h3>{t.kisanPensionQuestion}</h3>
                              <small>{t.kisanPensionHelp}</small>
                              <div className="answer-options" style={{ flexWrap: 'wrap' }}>
                                <button
                                  className={answers.isPensioner10kNotGroupD === 'no' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('isPensioner10kNotGroupD', 'no')}
                                  aria-pressed={answers.isPensioner10kNotGroupD === 'no'}
                                >
                                  <CheckCircle2 size={15} /> {t.no} ({lang === 'en' ? 'Pension < ₹10k or MTS' : 'पेंशन < ₹10k या MTS'})
                                </button>
                                <button
                                  className={answers.isPensioner10kNotGroupD === 'yes' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('isPensioner10kNotGroupD', 'yes')}
                                  aria-pressed={answers.isPensioner10kNotGroupD === 'yes'}
                                >
                                  <X size={15} /> {t.yes} ({lang === 'en' ? 'Pension ≥ ₹10k (Excluded)' : 'पेंशन ≥ ₹10k (बहिष्कृत)'})
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 7. Income Tax Payment in Last Assessment Year */}
                          <div className="question-card">
                            <div className="question-icon"><AlertTriangle size={18} /></div>
                            <div className="question-copy">
                              <h3>{t.kisanIncomeTaxQuestion}</h3>
                              <small>{t.kisanIncomeTaxHelp}</small>
                              <div className="answer-options">
                                <button
                                  className={answers.paidIncomeTaxLastYear === 'no' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('paidIncomeTaxLastYear', 'no')}
                                  aria-pressed={answers.paidIncomeTaxLastYear === 'no'}
                                >
                                  <CheckCircle2 size={15} /> {t.no} ({lang === 'en' ? 'Did not pay income tax' : 'आयकर नहीं भरा'})
                                </button>
                                <button
                                  className={answers.paidIncomeTaxLastYear === 'yes' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('paidIncomeTaxLastYear', 'yes')}
                                  aria-pressed={answers.paidIncomeTaxLastYear === 'yes'}
                                >
                                  <X size={15} /> {t.yes} ({lang === 'en' ? 'Paid income tax (Excluded)' : 'आयकर भरा (बहिष्कृत)'})
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 8. Practicing Professional */}
                          <div className="question-card">
                            <div className="question-icon"><UserRound size={18} /></div>
                            <div className="question-copy">
                              <h3>{t.kisanProfQuestion}</h3>
                              <small>{t.kisanProfHelp}</small>
                              <div className="answer-options">
                                <button
                                  className={answers.isPracticingProfessional === 'no' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('isPracticingProfessional', 'no')}
                                  aria-pressed={answers.isPracticingProfessional === 'no'}
                                >
                                  <CheckCircle2 size={15} /> {t.no} ({lang === 'en' ? 'No practicing professionals' : 'कोई पेशेवर नहीं'})
                                </button>
                                <button
                                  className={answers.isPracticingProfessional === 'yes' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('isPracticingProfessional', 'yes')}
                                  aria-pressed={answers.isPracticingProfessional === 'yes'}
                                >
                                  <X size={15} /> {t.yes} ({lang === 'en' ? 'Doctor/Eng/Lawyer/CA (Excluded)' : 'पेशेवर हैं (बहिष्कृत)'})
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 9. Aadhaar & Bank Account Status */}
                          <div className="question-card">
                            <div className="question-icon"><LockKeyhole size={18} /></div>
                            <div className="question-copy">
                              <h3>{t.kisanAadhaarBankQuestion}</h3>
                              <small>{t.kisanAadhaarBankHelp}</small>
                              <div className="answer-options">
                                <button
                                  className={answers.aadhaarBankAvailable === 'yes' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('aadhaarBankAvailable', 'yes')}
                                  aria-pressed={answers.aadhaarBankAvailable === 'yes'}
                                >
                                  <CheckCircle2 size={15} /> {t.yes} ({lang === 'en' ? 'Aadhaar & Bank ready' : 'आधार व बैंक खाता तैयार'})
                                </button>
                                <button
                                  className={answers.aadhaarBankAvailable === 'in_process' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('aadhaarBankAvailable', 'in_process')}
                                  aria-pressed={answers.aadhaarBankAvailable === 'in_process'}
                                >
                                  <Info size={15} /> {lang === 'en' ? 'In Process / Need Linking' : 'प्रक्रिया में है / लिंक करना बाकी'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* --- MAHTARI VANDAN QUESTIONS --- */}
                      {isMahtari && (
                        <>
                          {/* 1. Chhattisgarh Residence */}
                          <div className="question-card">
                            <div className="question-icon"><Landmark size={18} /></div>
                            <div className="question-copy">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <h3>{t.mvResidenceQuestion}</h3>
                                <span className="source-tag source-tag-dated">{t.datedGuidanceBadge}</span>
                              </div>
                              <small>{t.mvResidenceHelp}</small>
                              <div className="answer-options" style={{ flexWrap: 'wrap', marginTop: '10px' }}>
                                <button
                                  className={answers.isChhattisgarhResident === 'yes' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('isChhattisgarhResident', 'yes')}
                                  aria-pressed={answers.isChhattisgarhResident === 'yes'}
                                >
                                  <CheckCircle2 size={15} /> {t.yes} ({lang === 'en' ? 'Chhattisgarh Resident' : 'छत्तीसगढ़ स्थानीय निवासी'})
                                </button>
                                <button
                                  className={answers.isChhattisgarhResident === 'no' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('isChhattisgarhResident', 'no')}
                                  aria-pressed={answers.isChhattisgarhResident === 'no'}
                                >
                                  <X size={15} /> {t.no} ({lang === 'en' ? 'Other State' : 'अन्य राज्य'})
                                </button>
                                <button
                                  className={answers.isChhattisgarhResident === 'unsure' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('isChhattisgarhResident', 'unsure')}
                                  aria-pressed={answers.isChhattisgarhResident === 'unsure'}
                                >
                                  <Info size={15} /> {t.unsure}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 2. Age Requirement (21+ Years) */}
                          <div className="question-card">
                            <div className="question-icon"><UserRound size={18} /></div>
                            <div className="question-copy">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <h3>{t.mvAgeQuestion}</h3>
                                <span className="source-tag source-tag-dated">{t.datedGuidanceBadge}</span>
                              </div>
                              <small>{t.mvAgeHelp}</small>
                              <div className="answer-options" style={{ flexWrap: 'wrap', marginTop: '10px' }}>
                                <button
                                  className={answers.age21OrAbove === 'yes' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('age21OrAbove', 'yes')}
                                  aria-pressed={answers.age21OrAbove === 'yes'}
                                >
                                  <CheckCircle2 size={15} /> {t.yes} ({lang === 'en' ? 'Age 21 or older' : '21 वर्ष या अधिक'})
                                </button>
                                <button
                                  className={answers.age21OrAbove === 'no' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('age21OrAbove', 'no')}
                                  aria-pressed={answers.age21OrAbove === 'no'}
                                >
                                  <X size={15} /> {t.no} ({lang === 'en' ? 'Under 21' : '21 वर्ष से कम'})
                                </button>
                                <button
                                  className={answers.age21OrAbove === 'unsure' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('age21OrAbove', 'unsure')}
                                  aria-pressed={answers.age21OrAbove === 'unsure'}
                                >
                                  <Info size={15} /> {t.unsure}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 3. Marital Status Category */}
                          <div className="question-card">
                            <div className="question-icon"><Heart size={18} /></div>
                            <div className="question-copy">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <h3>{t.mvMaritalQuestion}</h3>
                                <span className="source-tag source-tag-dated">{t.datedGuidanceBadge}</span>
                              </div>
                              <small>{t.mvMaritalHelp}</small>
                              <div className="answer-options" style={{ flexWrap: 'wrap', marginTop: '10px' }}>
                                <button
                                  className={answers.maritalStatus === 'married' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('maritalStatus', 'married')}
                                  aria-pressed={answers.maritalStatus === 'married'}
                                >
                                  <CheckCircle2 size={15} /> {t.mvMaritalMarried}
                                </button>
                                <button
                                  className={answers.maritalStatus === 'widowed' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('maritalStatus', 'widowed')}
                                  aria-pressed={answers.maritalStatus === 'widowed'}
                                >
                                  <CheckCircle2 size={15} /> {t.mvMaritalWidowed}
                                </button>
                                <button
                                  className={answers.maritalStatus === 'divorced' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('maritalStatus', 'divorced')}
                                  aria-pressed={answers.maritalStatus === 'divorced'}
                                >
                                  <CheckCircle2 size={15} /> {t.mvMaritalDivorced}
                                </button>
                                <button
                                  className={answers.maritalStatus === 'abandoned' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('maritalStatus', 'abandoned')}
                                  aria-pressed={answers.maritalStatus === 'abandoned'}
                                >
                                  <CheckCircle2 size={15} /> {t.mvMaritalAbandoned}
                                </button>
                                <button
                                  className={answers.maritalStatus === 'unmarried' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('maritalStatus', 'unmarried')}
                                  aria-pressed={answers.maritalStatus === 'unmarried'}
                                >
                                  <X size={15} /> {t.mvMaritalUnmarried}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 4. Individual Bank Account with Active Aadhaar DBT */}
                          <div className="question-card">
                            <div className="question-icon"><LockKeyhole size={18} /></div>
                            <div className="question-copy">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <h3>{t.mvBankQuestion}</h3>
                                <span className="source-tag source-tag-portal">{t.portalConfirmedBadge}</span>
                              </div>
                              <small>{t.mvBankHelp}</small>
                              <div className="answer-options" style={{ flexWrap: 'wrap', marginTop: '10px' }}>
                                <button
                                  className={answers.hasIndividualDbtAccount === 'yes' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('hasIndividualDbtAccount', 'yes')}
                                  aria-pressed={answers.hasIndividualDbtAccount === 'yes'}
                                >
                                  <CheckCircle2 size={15} /> {t.mvBankYes}
                                </button>
                                <button
                                  className={answers.hasIndividualDbtAccount === 'joint_only' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('hasIndividualDbtAccount', 'joint_only')}
                                  aria-pressed={answers.hasIndividualDbtAccount === 'joint_only'}
                                >
                                  <X size={15} /> {t.mvBankJoint}
                                </button>
                                <button
                                  className={answers.hasIndividualDbtAccount === 'in_process' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('hasIndividualDbtAccount', 'in_process')}
                                  aria-pressed={answers.hasIndividualDbtAccount === 'in_process'}
                                >
                                  <Info size={15} /> {t.mvBankProcess}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 5. Income Tax Payee Exclusion */}
                          <div className="question-card">
                            <div className="question-icon"><AlertTriangle size={18} /></div>
                            <div className="question-copy">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <h3>{t.mvTaxQuestion}</h3>
                                <span className="source-tag source-tag-dated">{t.datedGuidanceBadge}</span>
                              </div>
                              <small>{t.mvTaxHelp}</small>
                              <div className="answer-options" style={{ flexWrap: 'wrap', marginTop: '10px' }}>
                                <button
                                  className={answers.familyIncomeTaxPayee === 'no' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('familyIncomeTaxPayee', 'no')}
                                  aria-pressed={answers.familyIncomeTaxPayee === 'no'}
                                >
                                  <CheckCircle2 size={15} /> {t.no} ({lang === 'en' ? 'No income tax payees in family' : 'परिवार में कोई आयकर दाता नहीं'})
                                </button>
                                <button
                                  className={answers.familyIncomeTaxPayee === 'yes' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('familyIncomeTaxPayee', 'yes')}
                                  aria-pressed={answers.familyIncomeTaxPayee === 'yes'}
                                >
                                  <X size={15} /> {t.yes} ({lang === 'en' ? 'Income tax payee in family (Excluded)' : 'आयकर दाता हैं (बहिष्कृत)'})
                                </button>
                                <button
                                  className={answers.familyIncomeTaxPayee === 'unsure' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('familyIncomeTaxPayee', 'unsure')}
                                  aria-pressed={answers.familyIncomeTaxPayee === 'unsure'}
                                >
                                  <Info size={15} /> {t.unsure}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 6. Regular Government / PSU Employee Exclusion */}
                          <div className="question-card">
                            <div className="question-icon"><Building2 size={18} /></div>
                            <div className="question-copy">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <h3>{t.mvGovtEmpQuestion}</h3>
                                <span className="source-tag source-tag-dated">{t.datedGuidanceBadge}</span>
                              </div>
                              <small>{t.mvGovtEmpHelp}</small>
                              <div className="answer-options" style={{ flexWrap: 'wrap', marginTop: '10px' }}>
                                <button
                                  className={answers.familyGovtEmployee === 'no' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('familyGovtEmployee', 'no')}
                                  aria-pressed={answers.familyGovtEmployee === 'no'}
                                >
                                  <CheckCircle2 size={15} /> {t.no} ({lang === 'en' ? 'No regular govt employee (honorarium exempt)' : 'कोई नियमित सरकारी कर्मचारी नहीं'})
                                </button>
                                <button
                                  className={answers.familyGovtEmployee === 'yes' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('familyGovtEmployee', 'yes')}
                                  aria-pressed={answers.familyGovtEmployee === 'yes'}
                                >
                                  <X size={15} /> {t.yes} ({lang === 'en' ? 'Regular govt/PSU employee (Excluded)' : 'नियमित कर्मचारी हैं (बहिष्कृत)'})
                                </button>
                                <button
                                  className={answers.familyGovtEmployee === 'unsure' ? 'chosen' : ''}
                                  onClick={() => updateAnswer('familyGovtEmployee', 'unsure')}
                                  aria-pressed={answers.familyGovtEmployee === 'unsure'}
                                >
                                  <Info size={15} /> {t.unsure}
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Side panel: Live Criteria Checklist */}
                    <aside className="detail-aside">
                      <h3><ClipboardCheck size={16} /> {lang === 'en' ? 'Criteria Evaluation' : 'पात्रता नियम मूल्यांकन'}</h3>
                      <div className="criteria-list">
                        {evaluation.checks.map((chk) => (
                          <div className="criteria-item" key={chk.id}>
                            <div className="criteria-item-icon">
                              {chk.status === 'pass' ? <CheckCircle2 size={15} color="#1d5c43" /> : chk.status === 'fail' ? <X size={15} color="#843226" /> : <Info size={15} color="#744b13" />}
                            </div>
                            <div className="criteria-item-content">
                              <div className="criteria-item-header">
                                <span className="criteria-item-title">{chk.label[lang]}</span>
                                <span style={{
                                  fontSize: '9px',
                                  fontWeight: 700,
                                  color: chk.status === 'pass' ? '#164e37' : chk.status === 'fail' ? '#843226' : '#744b13',
                                }}>
                                  {chk.status === 'pass' ? 'PASS' : chk.status === 'fail' ? 'FAIL' : 'CHECK'}
                                </span>
                              </div>
                              <span className="criteria-item-desc">{chk.detail[lang]}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="source-block" style={{ marginTop: '12px' }}>
                        <div className="source-block-head">
                          <ShieldCheck size={16} /> <b>{t.sourceLabel}</b>
                        </div>
                        <p style={{ margin: '4px 0 8px' }}>{scheme.sourceNotice[lang]}</p>
                        <p style={{ margin: '0 0 8px', fontSize: '11px', color: '#6d450f' }}>{t.officialAuthorityDisclaimer}</p>
                        <button className="inline-link" onClick={openSourceUrl}>
                          {scheme.sourceName} <ExternalLink size={12} />
                        </button>
                      </div>
                    </aside>
                  </div>

                  <div className="flow-bottom">
                    <StatusBadge
                      status={evaluation.status}
                      label={evaluation.status === 'possible' ? t.matchPossible : evaluation.status === 'no_match' ? t.matchNo : t.matchNeed}
                    />
                    <button className="button button-primary" onClick={goNext}>
                      {t.continue} ({t.documents})<ArrowRight size={17} />
                    </button>
                  </div>
                </section>
              )}

              {/* SCREEN 4: DOCUMENT READINESS */}
              {screen === 'documents' && (
                <section className="flow-section" key="documents">
                  <div className="section-heading">
                    <span className="section-icon"><FileCheck2 size={20} /></span>
                    <div>
                      <div className="eyebrow">Step 4 of 5 · {t.documents} ({scheme.shortName[lang]})</div>
                      <h1>{isKisan ? t.kisanDocTitle : isMahtari ? t.mvDocTitle : t.checklistTitle}</h1>
                      <p>{isKisan ? t.kisanDocSubtitle : isMahtari ? t.mvDocSubtitle : t.checklistSubtitle}</p>
                    </div>
                  </div>

                  {/* PM-KISAN NO-UPLOAD INTERACTIVE AVAILABILITY CHECKLIST */}
                  {isKisan ? (
                    <div className="kisan-doc-checklist">
                      {scheme.documents.map((doc) => {
                        const currentStatus = kisanDocStatus[doc.id] || 'available';
                        return (
                          <div className="kisan-doc-row" key={doc.id}>
                            <div className="kisan-doc-header">
                              <div className="kisan-doc-info">
                                <span className="kisan-doc-info-icon"><FileText size={18} /></span>
                                <div>
                                  <h3 className="kisan-doc-title">{doc.label[lang]}</h3>
                                  <p className="kisan-doc-desc">{doc.note?.[lang]}</p>
                                  <span className="kisan-doc-fields">
                                    <strong>{lang === 'en' ? 'Fields required on official portal: ' : 'पोर्टल पर आवश्यक विवरण: '}</strong>
                                    {doc.fields.join(' · ')}
                                  </span>
                                </div>
                              </div>
                              <div className="doc-status-pills" role="group" aria-label={doc.label[lang]}>
                                <button
                                  type="button"
                                  className={`doc-pill-btn status-available ${currentStatus === 'available' ? 'active' : ''}`}
                                  onClick={() => setKisanDocStatus((s) => ({ ...s, [doc.id]: 'available' }))}
                                  aria-pressed={currentStatus === 'available'}
                                >
                                  <CheckCircle2 size={13} /> {t.docAvailable}
                                </button>
                                <button
                                  type="button"
                                  className={`doc-pill-btn status-need_to_obtain ${currentStatus === 'need_to_obtain' ? 'active' : ''}`}
                                  onClick={() => setKisanDocStatus((s) => ({ ...s, [doc.id]: 'need_to_obtain' }))}
                                  aria-pressed={currentStatus === 'need_to_obtain'}
                                >
                                  <Info size={13} /> {t.docNeedToObtain}
                                </button>
                                <button
                                  type="button"
                                  className={`doc-pill-btn status-not_applicable ${currentStatus === 'not_applicable' ? 'active' : ''}`}
                                  onClick={() => setKisanDocStatus((s) => ({ ...s, [doc.id]: 'not_applicable' }))}
                                  aria-pressed={currentStatus === 'not_applicable'}
                                >
                                  <X size={13} /> {t.docNotApplicable}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="callout-box callout-notice" style={{ marginTop: '10px' }}>
                        <LockKeyhole size={16} />
                        <div>
                          <strong>{lang === 'en' ? 'No document upload required: ' : 'दस्तावेज़ अपलोड की आवश्यकता नहीं: '}</strong>
                          {lang === 'en'
                            ? 'To protect sensitive farmer revenue records and Aadhaar details, FindMyFit relies on your voluntary confirmation. You will submit original documents directly to the State revenue officials or during CSC biometric e-KYC.'
                            : 'संवेदनशील भूलेख और आधार विवरणों की सुरक्षा के लिए FindMyFit केवल आपकी स्व-पुष्टि पर निर्भर करता है। मूल दस्तावेज़ सीधे राज्य राजस्व अधिकारियों या सीएससी बायोमेट्रिक ई-केवाईसी के समय ही प्रस्तुत करने होते हैं।'}
                        </div>
                      </div>
                    </div>
                  ) : isMahtari ? (
                    /* MAHTARI VANDAN NO-UPLOAD READINESS CHECKLIST (Distinguishes Confirmed from Dated Guidance) */
                    <div className="kisan-doc-checklist">
                      {scheme.documents.map((doc) => {
                        const currentStatus = mahtariDocStatus[doc.id] || 'ready';
                        const isPortalConfirmed = doc.sourceType === 'current_portal';
                        return (
                          <div className="kisan-doc-row" key={doc.id}>
                            <div className="kisan-doc-header">
                              <div className="kisan-doc-info">
                                <span className="kisan-doc-info-icon"><FileText size={18} /></span>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <h3 className="kisan-doc-title">{doc.label[lang]}</h3>
                                    {isPortalConfirmed ? (
                                      <span className="source-tag source-tag-portal">
                                        <CheckCircle2 size={12} /> {t.portalConfirmedBadge}
                                      </span>
                                    ) : (
                                      <span className="source-tag source-tag-dated">
                                        <AlertTriangle size={12} /> {t.datedGuidanceBadge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="kisan-doc-desc">{doc.note?.[lang]}</p>
                                  <span className="kisan-doc-fields">
                                    <strong>{lang === 'en' ? 'Fields / Verification points: ' : 'सत्यापन विवरण: '}</strong>
                                    {doc.fields.join(' · ')}
                                  </span>
                                </div>
                              </div>
                              <div className="doc-status-pills" role="group" aria-label={doc.label[lang]}>
                                <button
                                  type="button"
                                  className={`doc-pill-btn status-available ${currentStatus === 'ready' ? 'active' : ''}`}
                                  onClick={() => setMahtariDocStatus((s) => ({ ...s, [doc.id]: 'ready' }))}
                                  aria-pressed={currentStatus === 'ready'}
                                >
                                  <CheckCircle2 size={13} /> {t.docReady}
                                </button>
                                <button
                                  type="button"
                                  className={`doc-pill-btn status-need_to_obtain ${currentStatus === 'missing' ? 'active' : ''}`}
                                  onClick={() => setMahtariDocStatus((s) => ({ ...s, [doc.id]: 'missing' }))}
                                  aria-pressed={currentStatus === 'missing'}
                                >
                                  <Info size={13} /> {t.docMissing}
                                </button>
                                <button
                                  type="button"
                                  className={`doc-pill-btn status-needs_confirm ${currentStatus === 'needs_confirm' ? 'active' : ''}`}
                                  onClick={() => setMahtariDocStatus((s) => ({ ...s, [doc.id]: 'needs_confirm' }))}
                                  aria-pressed={currentStatus === 'needs_confirm'}
                                >
                                  <AlertTriangle size={13} /> {t.docNeedsConfirm}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="callout-box callout-notice" style={{ marginTop: '10px' }}>
                        <LockKeyhole size={16} />
                        <div>
                          <strong>{lang === 'en' ? 'No document upload required: ' : 'दस्तावेज़ अपलोड की आवश्यकता नहीं: '}</strong>
                          {t.mvNoUploadNotice}
                        </div>
                      </div>

                      <div className="callout-box" style={{ background: '#fdf9f4', borderColor: '#d4a77b', color: '#5c2c10', marginTop: '10px' }}>
                        <AlertTriangle size={16} />
                        <div>
                          <strong>{lang === 'en' ? 'Indicative Guidance Notice: ' : 'संकेतक मार्गदर्शन सूचना: '}</strong>
                          {lang === 'en'
                            ? 'This checklist organizes your documents based on published official sources and does not guarantee official approval or money disbursal. Always verify active requirements on the official portal.'
                            : 'यह सूची आधिकारिक स्रोतों के आधार पर तैयारी में सहायता करती है; यह स्वीकृति या भुगतान की गारंटी नहीं देती। आधिकारिक पोर्टल पर वर्तमान स्थिति की पुष्टि अवश्य करें।'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* PM-USP DOCUMENT READINESS WITH IN-MEMORY GEMINI SCANNER */
                    <div className="document-layout">
                      <div className="checklist-card">
                        <div className="card-heading">
                          <span className="checklist-icon"><ClipboardCheck size={18} /></span>
                          <div>
                            <h2>{answers.applicationType === 'renewal' ? (lang === 'en' ? 'Renewal Document Checklist' : 'नवीनीकरण दस्तावेज़ सूची') : (lang === 'en' ? 'Fresh Application Document Checklist' : 'नया आवेदन दस्तावेज़ सूची')}</h2>
                            <p>{lang === 'en' ? 'Sourced from official myScheme guidelines' : 'आधिकारिक myScheme दिशानिर्देशों से प्राप्त'}</p>
                          </div>
                        </div>

                        {filteredDocuments.map((doc) => (
                          <div className="document-item" key={doc.id}>
                            <div className="document-item-icon"><FileText size={17} /></div>
                            <div>
                              <strong>{doc.label[lang]}</strong>
                              {doc.note && <p style={{ color: '#524e46', margin: '3px 0' }}>{doc.note[lang]}</p>}
                              <p style={{ color: '#4a473f', fontSize: '9px' }}>
                                <strong>{lang === 'en' ? 'Key fields:' : 'मुख्य फ़ील्ड्स:'}</strong> {doc.fields.join(' · ')}
                              </p>
                            </div>
                            <span className="document-required" style={{ background: doc.isMandatory ? '#fbf0e8' : '#edf5ee', color: doc.isMandatory ? '#7d371a' : '#164e37' }}>
                              {doc.isMandatory ? t.required : t.optional}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="upload-card">
                        <span className="upload-icon"><UploadCloud size={20} /></span>
                        <h2>{t.uploadTitle}</h2>
                        <p>{t.uploadHint}</p>
                        <input
                          className="sr-only"
                          ref={fileInput}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                          onChange={onFileSelected}
                          aria-label={t.uploadAction}
                        />

                        {!file ? (
                          <button className="button button-secondary choose-file" onClick={() => fileInput.current?.click()}>
                            <UploadCloud size={17} />{t.uploadAction}
                          </button>
                        ) : (
                          <div className="selected-file">
                            <span className="selected-file-icon">
                              {file.type === 'application/pdf' ? <FileText size={18} /> : <FileImage size={18} />}
                            </span>
                            <span className="selected-file-name">
                              <b>{t.uploaded}</b>
                              <small>{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</small>
                            </span>
                            <button
                              className="icon-button"
                              title={t.removeFile}
                              aria-label={t.removeFile}
                              onClick={() => { setFile(null); setAnalysis(null); if (fileInput.current) fileInput.current.value = ''; }}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}

                        {file && (
                          <button disabled={analyzing} className="button button-primary analyze-button" onClick={analyzeFile}>
                            {analyzing ? <><span className="spinner" />{t.analyzing}</> : <><Sparkles size={16} />{t.analyze}</>}
                          </button>
                        )}

                        <p className="upload-privacy"><LockKeyhole size={14} />{t.analyzeHelp}</p>
                        <p className="upload-retention">{lang === 'en' ? 'Held in memory only for this session; not written to disk.' : 'केवल इस सत्र के दौरान मेमोरी में रखा जाता है, डिस्क पर सहेजा नहीं जाता।'}</p>
                      </div>
                    </div>
                  )}

                  {isUSP && analysisError && <div className="error-message" role="alert"><Info size={16} />{analysisError}</div>}
                  {isUSP && analysis && <AnalysisCard analysis={analysis} lang={lang} t={t} />}
                  {isUSP && !analysis && !analysisError && <div className="empty-analysis"><Info size={17} />{t.noAnalysis}</div>}

                  <div className="form-actions doc-actions">
                    <button className="button button-primary" onClick={goNext}>
                      {t.continue} ({t.draft})<ArrowRight size={17} />
                    </button>
                  </div>
                </section>
              )}

              {/* SCREEN 5: PREPARATION DRAFT & OFFICIAL HANDOFF */}
              {screen === 'draft' && (
                <section className="flow-section" key="draft">
                  <div className="section-heading">
                    <span className="section-icon"><FileText size={20} /></span>
                    <div>
                      <div className="eyebrow">Step 5 of 5 · {t.draft} ({scheme.shortName[lang]})</div>
                      <h1>{isKisan ? t.kisanDraftTitle : isMahtari ? t.mvDraftTitle : t.draftTitle}</h1>
                      <p>{isKisan ? t.kisanDraftSubtitle : isMahtari ? t.mvDraftSubtitle : t.draftBody}</p>
                    </div>
                  </div>

                  <div className="draft-notice">
                    <ShieldCheck size={18} />
                    <span>{t.draftNotice}</span>
                  </div>

                  <div className="draft-layout">
                    {/* Editable Preparation Draft Form */}
                    <div className="draft-form-card">
                      <div className="draft-card-heading">
                        <span className="draft-heading-icon">{isKisan ? <Tractor size={17} /> : isMahtari ? <Heart size={17} /> : <UserRound size={17} />}</span>
                        <div>
                          <h2>{isKisan ? t.kisanDraftTitle : isMahtari ? t.mvDraftTitle : t.draftTitle}</h2>
                          <p>{scheme.shortName[lang]} {isUSP ? `(${draft.applicationType === 'renewal' ? t.renewalPathway : t.freshPathway})` : ''}</p>
                        </div>
                      </div>

                      <DraftField
                        label={t.draftApplicantName}
                        value={draft.applicantName}
                        missing={!draft.applicantName}
                        touched={draftTouched}
                        t={t}
                        onChange={(v) => setDraft((c) => ({ ...c, applicantName: v }))}
                      />

                      <div className="form-row two-cols">
                        <DraftField
                          label={t.state}
                          value={draft.state || profile.state}
                          missing={!draft.state && !profile.state}
                          touched={draftTouched}
                          t={t}
                          onChange={(v) => setDraft((c) => ({ ...c, state: v }))}
                        />
                        <DraftField
                          label={t.district}
                          value={draft.district || profile.district}
                          missing={!draft.district && !profile.district}
                          touched={draftTouched}
                          t={t}
                          onChange={(v) => setDraft((c) => ({ ...c, district: v }))}
                        />
                      </div>

                      {/* Extra Location Fields for PM-KISAN & Mahtari Vandan */}
                      {(isKisan || isMahtari) && (
                        <div className="form-row two-cols">
                          <DraftField
                            label={t.subDistrictLabel}
                            value={draft.subDistrict}
                            missing={!draft.subDistrict}
                            touched={draftTouched}
                            t={t}
                            onChange={(v) => setDraft((c) => ({ ...c, subDistrict: v }))}
                          />
                          <DraftField
                            label={t.villageLabel}
                            value={draft.village}
                            missing={false}
                            touched={draftTouched}
                            t={t}
                            onChange={(v) => setDraft((c) => ({ ...c, village: v }))}
                          />
                        </div>
                      )}

                      {/* PM-USP Specific Academic Fields */}
                      {isUSP && (
                        <>
                          {draft.applicationType === 'fresh' && (
                            <>
                              <div className="form-row two-cols">
                                <DraftField
                                  label={t.draftBoard}
                                  value={draft.class12Board}
                                  missing={!draft.class12Board}
                                  touched={draftTouched}
                                  t={t}
                                  onChange={(v) => setDraft((c) => ({ ...c, class12Board: v }))}
                                />
                                <DraftField
                                  label={t.draftStream}
                                  value={draft.class12Stream}
                                  missing={!draft.class12Stream}
                                  touched={draftTouched}
                                  t={t}
                                  onChange={(v) => setDraft((c) => ({ ...c, class12Stream: v }))}
                                />
                              </div>

                              <DraftField
                                label={t.draftPassingYear}
                                value={draft.class12PassingYear}
                                missing={!draft.class12PassingYear}
                                touched={draftTouched}
                                t={t}
                                onChange={(v) => setDraft((c) => ({ ...c, class12PassingYear: v }))}
                              />
                            </>
                          )}

                          <DraftField
                            label={t.draftInstitution}
                            value={draft.institution}
                            missing={!draft.institution}
                            touched={draftTouched}
                            t={t}
                            onChange={(v) => setDraft((c) => ({ ...c, institution: v }))}
                          />

                          <DraftField
                            label={t.draftCourse}
                            value={draft.course}
                            missing={!draft.course}
                            touched={draftTouched}
                            t={t}
                            onChange={(v) => setDraft((c) => ({ ...c, course: v }))}
                          />

                          <div className="draft-static">
                            <span>{t.draftIncome}</span>
                            <strong>{draft.incomeConfirmed ? (lang === 'en' ? '≤ ₹4,50,000 (Confirmed)' : '≤ ₹4.5 लाख (पुष्टि की गई)') : (lang === 'en' ? 'Pending check' : 'जाँच बाकी')}</strong>
                          </div>

                          {draft.applicationType === 'fresh' && (
                            <div className="draft-static">
                              <span>{t.draftPercentile}</span>
                              <strong>{draft.percentileConfirmed ? (lang === 'en' ? '> 80th Percentile (Confirmed)' : '> 80वीं पर्सेंटाइल (पुष्टि की गई)') : (lang === 'en' ? 'Check board list' : 'बोर्ड सूची देखें')}</strong>
                            </div>
                          )}
                        </>
                      )}

                      {/* PM-KISAN Confirmed Rule Check Statuses */}
                      {isKisan && (
                        <>
                          <div className="draft-static">
                            <span>{t.kisanLandRecord}</span>
                            <strong>{draft.cultivableLandConfirmed ? (lang === 'en' ? 'Cultivable land in family name (Confirmed)' : 'परिवार के नाम खेती योग्य जमीन (पुष्टि की गई)') : (lang === 'en' ? 'Pending check' : 'पुष्टि बाकी')}</strong>
                          </div>
                          <div className="draft-static">
                            <span>{t.kisanNonExclusion}</span>
                            <strong>{draft.nonExclusionConfirmed ? (lang === 'en' ? 'Non-excluded family (Confirmed)' : 'गैर-बहिष्कृत परिवार (पुष्टि की गई)') : (lang === 'en' ? 'Non-exclusion checked' : 'अपवर्जन जाँचा गया')}</strong>
                          </div>
                        </>
                      )}

                      {/* Mahtari Vandan Confirmed Criteria Check Statuses */}
                      {isMahtari && (
                        <>
                          <div className="draft-static">
                            <span>{t.mvDraftResidence}</span>
                            <strong>
                              {answers.isChhattisgarhResident === 'yes'
                                ? (lang === 'en' ? 'Chhattisgarh Resident (Confirmed in check)' : 'छत्तीसगढ़ स्थानीय निवासी (पुष्टि की गई)')
                                : (lang === 'en' ? 'Needs confirmation on portal' : 'पोर्टल पर पुष्टि आवश्यक')}
                            </strong>
                          </div>
                          <div className="draft-static">
                            <span>{t.mvDraftAge}</span>
                            <strong>
                              {answers.age21OrAbove === 'yes'
                                ? (lang === 'en' ? 'Age 21 or older (Self-confirmed)' : '21 वर्ष या अधिक (पुष्टि की गई)')
                                : (lang === 'en' ? 'Needs age verification' : 'आयु सत्यापन आवश्यक')}
                            </strong>
                          </div>
                          <div className="draft-static">
                            <span>{t.mvDraftMarital}</span>
                            <strong>
                              {answers.maritalStatus === 'married'
                                ? t.mvMaritalMarried
                                : answers.maritalStatus === 'widowed'
                                ? t.mvMaritalWidowed
                                : answers.maritalStatus === 'divorced'
                                ? t.mvMaritalDivorced
                                : answers.maritalStatus === 'abandoned'
                                ? t.mvMaritalAbandoned
                                : (lang === 'en' ? 'Needs confirmation' : 'पुष्टि आवश्यक')}
                            </strong>
                          </div>
                          <div className="draft-static">
                            <span>{t.mvDraftBank}</span>
                            <strong>
                              {answers.hasIndividualDbtAccount === 'yes'
                                ? (lang === 'en' ? 'Individual Account with Active DBT (Confirmed)' : 'सक्रिय डीबीटी के साथ व्यक्तिगत खाता (पुष्टि की गई)')
                                : (lang === 'en' ? 'Individual account required (No joint)' : 'व्यक्तिगत खाता अनिवार्य (संयुक्त मान्य नहीं)')}
                            </strong>
                          </div>
                          <div className="draft-static">
                            <span>{t.mvDraftExclusions}</span>
                            <strong>
                              {answers.familyIncomeTaxPayee === 'no' && answers.familyGovtEmployee === 'no'
                                ? (lang === 'en' ? 'Non-excluded family (Confirmed in check)' : 'गैर-बहिष्कृत परिवार (पुष्टि की गई)')
                                : (lang === 'en' ? 'Subject to exclusion review' : 'अपवर्जन नियमों के अधीन')}
                            </strong>
                          </div>
                        </>
                      )}

                      {/* Sensitive Blank Fields for Privacy (Aadhaar & Bank) */}
                      <div className="sensitive-blank-box">
                        <span className="sensitive-blank-title">{lang === 'en' ? 'Aadhaar Number' : 'आधार संख्या'}</span>
                        <span className="sensitive-blank-note">
                          <LockKeyhole size={12} />
                          {lang === 'en' ? '[ Kept blank for privacy — enter directly on official portal ]' : '[ गोपनीयता हेतु खाली — सीधे सरकारी पोर्टल पर भरें ]'}
                        </span>
                      </div>

                      <div className="sensitive-blank-box">
                        <span className="sensitive-blank-title">{lang === 'en' ? 'Savings Bank Account No. & IFSC' : 'बचत बैंक खाता संख्या व IFSC'}</span>
                        <span className="sensitive-blank-note">
                          <LockKeyhole size={12} />
                          {lang === 'en' ? '[ Kept blank for privacy — enter directly on official portal ]' : '[ गोपनीयता हेतु खाली — सीधे सरकारी पोर्टल पर भरें ]'}
                        </span>
                      </div>

                      <button className="button button-secondary save-draft" onClick={() => setDraftTouched(true)}>
                        <Check size={16} />{t.saveDraft}
                      </button>
                    </div>

                    {/* Preview Column */}
                    <aside className="draft-preview-card">
                      <div className="preview-top">
                        <span className="preview-icon"><FileText size={17} /></span>
                        <span>{t.preview}</span>
                        <span className="preview-status"><i />{isKisan ? (lang === 'en' ? 'Farmer Registration Draft' : 'किसान पंजीकरण ड्राफ़्ट') : isMahtari ? (lang === 'en' ? 'Beneficiary Draft' : 'लाभार्थी आवेदन ड्राफ़्ट') : (draft.applicationType === 'renewal' ? t.renewalPathway : t.freshPathway)}</span>
                      </div>

                      <h2>{scheme.shortName[lang]}</h2>
                      <div className="preview-rule" />

                      <PreviewRow label={t.draftApplicantName} value={draft.applicantName} missing={!draft.applicantName} t={t} />
                      <PreviewRow label={t.state} value={draft.state || profile.state} missing={!draft.state && !profile.state} t={t} />
                      {(draft.district || profile.district) && <PreviewRow label={t.district} value={draft.district || profile.district} missing={false} t={t} />}
                      {(isKisan || isMahtari) && draft.subDistrict && <PreviewRow label={t.subDistrictLabel} value={draft.subDistrict} missing={false} t={t} />}
                      {(isKisan || isMahtari) && draft.village && <PreviewRow label={t.villageLabel} value={draft.village} missing={false} t={t} />}

                      {isUSP && (
                        <>
                          {draft.applicationType === 'fresh' && draft.class12Board && (
                            <PreviewRow label={t.draftBoard} value={`${draft.class12Board} (${draft.class12Stream})`} missing={false} t={t} />
                          )}
                          <PreviewRow label={t.draftInstitution} value={draft.institution} missing={!draft.institution} t={t} />
                          <PreviewRow label={t.draftCourse} value={draft.course} missing={!draft.course} t={t} />
                        </>
                      )}

                      {isMahtari && answers.maritalStatus && (
                        <PreviewRow
                          label={t.mvDraftMarital}
                          value={
                            answers.maritalStatus === 'married'
                              ? t.mvMaritalMarried
                              : answers.maritalStatus === 'widowed'
                              ? t.mvMaritalWidowed
                              : answers.maritalStatus === 'divorced'
                              ? t.mvMaritalDivorced
                              : answers.maritalStatus === 'abandoned'
                              ? t.mvMaritalAbandoned
                              : t.mvMaritalUnmarried
                          }
                          missing={false}
                          t={t}
                        />
                      )}
                      {isMahtari && (
                        <PreviewRow
                          label={t.mvDraftBank}
                          value={answers.hasIndividualDbtAccount === 'yes' ? (lang === 'en' ? 'Individual DBT Account (Active)' : 'व्यक्तिगत डीबीटी खाता (सक्रिय)') : (lang === 'en' ? 'Individual Account Needed' : 'व्यक्तिगत खाता आवश्यक')}
                          missing={answers.hasIndividualDbtAccount !== 'yes'}
                          t={t}
                        />
                      )}

                      <div className={`draft-summary ${missingDraftFields ? 'summary-incomplete' : 'summary-complete'}`}>
                        {missingDraftFields ? (
                          <><Info size={15} />{t.draftMissing}</>
                        ) : (
                          <><CheckCircle2 size={15} />{t.draftReady}</>
                        )}
                      </div>

                      <div className="preview-no-submit">
                        <LockKeyhole size={14} />{t.noSubmit}
                      </div>
                    </aside>
                  </div>

                  {/* OFFICIAL HANDOFF CARD */}
                  <div className="official-card" style={{ display: 'block', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                      <span className="official-icon"><ShieldCheck size={22} /></span>
                      <div>
                        <span className="eyebrow">{scheme.applicationPortalName}</span>
                        <h2 style={{ margin: '4px 0', fontSize: '16px' }}>{isKisan ? t.kisanHandoffTitle : isMahtari ? t.mvHandoffTitle : t.handoffHeading}</h2>
                        <p style={{ margin: 0, fontSize: '11px', color: '#4a473f' }}>{isKisan ? t.kisanHandoffBody : isMahtari ? t.mvHandoffBody : t.handoffExplainer}</p>
                      </div>
                    </div>

                    {/* Non-affiliation Disclaimer for Mahtari Vandan */}
                    {isMahtari && (
                      <div style={{ padding: '10px 14px', background: '#fdf8f4', border: '1px solid #e8c8b4', borderRadius: '8px', marginBottom: '14px', fontSize: '11px', color: '#7a3819', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Info size={16} style={{ flexShrink: 0 }} />
                        <span>{t.cgAffiliationDisclaimer}</span>
                      </div>
                    )}

                    {/* PM-USP Steps */}
                    {isUSP && scheme.nspProcessSteps && (
                      <div className="nsp-steps">
                        {scheme.nspProcessSteps[lang].map((stepText, idx) => (
                          <div className="nsp-step-row" key={idx}>
                            <span className="nsp-step-num">{idx + 1}</span>
                            <span>{stepText}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* PM-KISAN Dual Route (Portal vs CSC) */}
                    {isKisan && (
                      <div className="dual-route-grid">
                        <div className="dual-route-card">
                          <div>
                            <h3><Landmark size={18} color="#964724" /> {scheme.applicationRoutes?.online.name[lang]}</h3>
                            <p>{scheme.applicationRoutes?.online.desc[lang]}</p>
                            <p style={{ marginTop: '8px', fontSize: '10px', color: '#6d450f' }}>
                              <strong>{lang === 'en' ? 'Steps: ' : 'चरण: '}</strong>
                              {lang === 'en'
                                ? 'Go to Farmers Corner -> Click "New Farmer Registration" -> Enter Aadhaar & Mobile OTP -> Enter State, District, Sub-District & Land Survey/Khata/Khasra details.'
                                : 'फार्मर्स कॉर्नर पर जाएँ -> "न्यू फार्मर रजिस्ट्रेशन" पर क्लिक करें -> आधार व मोबाइल ओटीपी दर्ज करें -> राज्य, ज़िला, तहसील व खसरा/खाता विवरण भरें।'}
                            </p>
                          </div>
                          <button className="button button-primary" onClick={openOfficialPortal}>
                            {t.openKisanPortal} <ExternalLink size={15} />
                          </button>
                        </div>

                        <div className="dual-route-card">
                          <div>
                            <h3><Building2 size={18} color="#1d5c43" /> {scheme.applicationRoutes?.csc.name[lang]}</h3>
                            <p>{scheme.applicationRoutes?.csc.desc[lang]}</p>
                            <p style={{ marginTop: '8px', fontSize: '10px', color: '#4a473f' }}>
                              {lang === 'en'
                                ? 'Ideal if you prefer in-person registration or need biometric Aadhaar e-KYC assisted by a Village Level Entrepreneur (VLE).'
                                : 'यदि आप व्यक्तिगत रूप से सहायता प्राप्त कर पंजीकरण या बायोमेट्रिक आधार ई-केवाईसी कराना चाहते हैं तो अपने नजदीकी सीएससी केंद्र पर जाएँ।'}
                            </p>
                          </div>
                          <button className="button button-secondary" onClick={openCscLocator}>
                            {t.openCscLocator} <ExternalLink size={15} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Mahtari Vandan Dual Route (Online Citizen Portal vs Anganwadi / Facilitation Center) */}
                    {isMahtari && (
                      <div className="dual-route-grid">
                        <div className="dual-route-card">
                          <div>
                            <h3><Landmark size={18} color="#964724" /> {scheme.applicationRoutes?.online.name[lang]}</h3>
                            <p>{scheme.applicationRoutes?.online.desc[lang]}</p>
                            <p style={{ marginTop: '8px', fontSize: '10px', color: '#6d450f' }}>
                              <strong>{lang === 'en' ? 'Instructions: ' : 'निर्देश: '}</strong>
                              {lang === 'en'
                                ? 'Check current portal announcement to verify if a new registration window or supplementary cycle is active. You can also view published beneficiary lists, DBT payment status, and helpline numbers.'
                                : 'वर्तमान पोर्टल अधिसूचना देखें कि क्या नया पंजीकरण चक्र या पूरक सूची सक्रिय है। आप प्रकाशित लाभार्थी सूची, डीबीटी भुगतान स्थिति और हेल्पलाइन नंबर भी देख सकते हैं।'}
                            </p>
                          </div>
                          <button className="button button-primary" onClick={openOfficialPortal}>
                            {t.checkCurrentAppInfo} <ExternalLink size={15} />
                          </button>
                        </div>

                        <div className="dual-route-card">
                          <div>
                            <h3><Building2 size={18} color="#1d5c43" /> {scheme.applicationRoutes?.csc.name[lang]}</h3>
                            <p>{scheme.applicationRoutes?.csc.desc[lang]}</p>
                            <p style={{ marginTop: '8px', fontSize: '10px', color: '#4a473f' }}>
                              <strong>{lang === 'en' ? 'In-person help: ' : 'व्यक्तिगत सहायता: '}</strong>
                              {lang === 'en'
                                ? 'During state intake periods, Anganwadi workers, Gram Panchayat secretaries, and Urban Ward facilitation desks assist eligible women with physical verification and form entry without charging any fee.'
                                : 'शासन के पंजीकरण अभियानों के दौरान आंगनवाड़ी कार्यकर्ता, ग्राम पंचायत सचिव तथा नगरीय वार्ड डेस्क बिना किसी शुल्क के सत्यापन व प्रविष्टि में सहायता प्रदान करते हैं।'}
                            </p>
                          </div>
                          <button className="button button-secondary" onClick={openOfficialPortal}>
                            {lang === 'en' ? 'View Facilitation Details on Portal' : 'पोर्टल पर सुविधा केंद्र विवरण देखें'} <ExternalLink size={15} />
                          </button>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #e8e3db' }}>
                      <span style={{ fontSize: '11px', color: '#4a473f', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <LockKeyhole size={14} color="#1d5c43" />
                        {lang === 'en' ? 'Opens in a secure new tab. FindMyFit will not access your login or OTP.' : 'सुरक्षित नई टैब में खुलेगा। FindMyFit आपके लॉगिन या ओटीपी तक नहीं पहुँचेगा।'}
                      </span>
                      {isUSP && (
                        <button className="button button-primary" onClick={openOfficialPortal}>
                          {t.openOfficial} <ExternalLink size={16} />
                        </button>
                      )}
                      {isMahtari && (
                        <button className="button button-primary" onClick={openOfficialPortal}>
                          {t.openMahtariPortal} <ExternalLink size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="end-actions">
                    <button className="text-button" onClick={reset}><RotateCcw size={15} />{lang === 'en' ? 'Start over' : 'शुरू से शुरू करें'}</button>
                    <button className="button button-secondary" onClick={openSourceUrl}>
                      {isMahtari
                        ? (lang === 'en' ? 'View official portal source' : 'आधिकारिक पोर्टल स्रोत देखें')
                        : isKisan
                        ? (lang === 'en' ? 'View source on myScheme / PM-KISAN' : 'myScheme / पीएम-किसान पर स्रोत देखें')
                        : (lang === 'en' ? 'View source on myScheme' : 'myScheme पर स्रोत देखें')} <ExternalLink size={14} />
                    </button>
                  </div>
                </section>
              )}

              <footer className="workspace-footer">
                <span>{t.footer}</span>
                <span><span className="tiny-lock"><LockKeyhole size={12} /></span>{t.privacyShort}</span>
              </footer>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

function Field({ label, why, htmlFor, children }: { label: React.ReactNode; why: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {why ? <small><Info size={12} />{why}</small> : null}
    </div>
  );
}

function StatusBadge({ status, label }: { status: MatchStatus; label: string }) {
  const Icon = status === 'possible' ? CheckCircle2 : status === 'no_match' ? X : Info;
  return (
    <span className={`status-badge status-${status}`}>
      <Icon size={14} />{label}
    </span>
  );
}

function AnalysisCard({ analysis, lang, t }: { analysis: AnalysisResponse; lang: Language; t: Copy }) {
  const result = analysis.result;
  const needsReview = result.needs_human_review || !result.readable;
  return (
    <section className={`analysis-card ${needsReview ? 'analysis-review' : ''}`} aria-live="polite">
      <div className="analysis-head">
        <span className={`analysis-icon ${needsReview ? 'review-icon' : ''}`}>
          {needsReview ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
        </span>
        <div>
          <div className="analysis-title-row">
            <h2>{needsReview ? t.humanReview : t.resultRead}</h2>
            <span className={analysis.demoMode ? 'sample-result-badge' : 'ai-result-badge'}>
              {analysis.demoMode ? t.sampleMode : t.aiMode}
            </span>
          </div>
          <p>{result.document_type}</p>
        </div>
      </div>

      <div className="analysis-meta">
        <span>{result.readable ? <><CheckCircle2 size={14} />{t.resultRead}</> : <><Info size={14} />{t.resultUnread}</>}</span>
        {result.page_number && <span><FileText size={14} />{t.page} {result.page_number}</span>}
      </div>

      <div className="analysis-columns">
        <div>
          <h3><CheckCircle2 size={15} />{t.found}</h3>
          {result.fields_found.length ? (
            <ul>{result.fields_found.map((field) => <li key={field}><Check size={13} />{field}</li>)}</ul>
          ) : (
            <p>{lang === 'en' ? 'No target fields confirmed in this file.' : 'इस फ़ाइल में कोई लक्षित फ़ील्ड नहीं मिला।'}</p>
          )}
        </div>
        <div>
          <h3><Info size={15} />{t.missing}</h3>
          {result.missing_information.length ? (
            <ul>{result.missing_information.map((field) => <li key={field}><span className="missing-bullet" />{field}</li>)}</ul>
          ) : (
            <p>{lang === 'en' ? 'No checklist item flagged as missing.' : 'कोई फ़ील्ड छूटा हुआ नहीं मिला।'}</p>
          )}
        </div>
      </div>

      {result.evidence_quote && (
        <div className="evidence-quote">
          <span>“{result.evidence_quote}”</span>
          {result.page_number && <small>{t.page} {result.page_number}</small>}
        </div>
      )}

      <p className="analysis-explanation"><Info size={14} />{result.explanation}</p>
      {needsReview && (
        <p className="human-review-note">
          <AlertTriangle size={14} />
          {lang === 'en'
            ? 'The automated tool could not safely verify all fields. Please have a human reviewer examine the original physical document.'
            : 'स्वचालित टूल सभी फ़ील्ड्स को सुरक्षित रूप से सत्यापित नहीं कर सका। कृपया मूल दस्तावेज़ की मानव समीक्षा करवाएँ।'}
        </p>
      )}
      <div className="analysis-disclaimer"><ShieldCheck size={14} />{t.analysisDisclaimer}</div>
    </section>
  );
}

function DraftField({
  label, value, missing, touched, t, onChange,
}: {
  label: string; value: string; missing: boolean; touched: boolean; t: Copy; onChange: (value: string) => void;
}) {
  return (
    <label className={`draft-field ${missing ? 'draft-field-missing' : ''}`}>
      <span>{label}{missing && <em>{t.required}</em>}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={120}
        placeholder={missing ? t.missingField : ''}
        aria-invalid={missing && touched}
      />
      <small className={missing ? 'missing-help' : 'filled-help'}>
        {missing ? <><Info size={12} />{t.missingField}</> : <><CheckCircle2 size={12} />{t.readyField}</>}
      </small>
    </label>
  );
}

function PreviewRow({ label, value, missing, t }: { label: string; value: string; missing: boolean; t: Copy }) {
  return (
    <div className={`preview-row ${missing ? 'preview-missing' : ''}`}>
      <span>{label}</span>
      <strong>{value || t.missingField}</strong>
      {missing && <Info size={13} />}
    </div>
  );
}
