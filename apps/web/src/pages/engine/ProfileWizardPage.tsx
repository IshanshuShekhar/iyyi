import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/Navbar';
import {
  GraduationCap,
  Award,
  Languages,
  Briefcase,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Info,
  AlertTriangle,
  Plus,
  Trash2,
  Save,
  Lock,
} from 'lucide-react';
import {
  DegreeLevel,
  TeachingLanguage,
  Step1PersonalData,
  Step2AcademicData,
  Step3LanguageData,
  Step4ProjectsData,
  Step5BudgetData,
  Step6SensitiveScholarshipData,
  FullApplicantProfile,
} from '@educaro/shared';

const GERMAN_STATES = [
  'Bavaria',
  'Baden-Württemberg',
  'North Rhine-Westphalia',
  'Berlin',
  'Hesse',
  'Lower Saxony',
  'Saxony',
  'Hamburg',
  'Rhineland-Palatinate',
  'Schleswig-Holstein',
  'Brandenburg',
  'Thuringia',
];

const POPULAR_SUBJECTS = [
  'Computer Science',
  'AI / Data Science',
  'Mechanical Engineering',
  'Electrical & Computer Engineering',
  'Automotive & Autonomous Systems',
  'Biotechnology & Life Sciences',
  'Renewable Energy & Sustainability',
  'Industrial Engineering & Management',
];

export const ProfileWizardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Personal & Study
  const [step1, setStep1] = useState<Step1PersonalData>({
    fullName: '',
    email: user?.email || '',
    nationality: 'Indian',
    residenceCountry: 'India',
    currentEducationLevel: 'Bachelor Degree',
    currentUniversity: 'Anna University / VTU / Pune University',
    currentDegree: 'B.Tech in Computer Science & Engineering',
    graduationYear: 2024,
    intendedIntake: 'Winter Semester 2026/27',
    intendedStudyLevel: 'MASTER',
    intendedSubject: 'Computer Science',
    preferredStudyLanguage: 'ENGLISH',
  });

  // Step 2: Academic Profile
  const [step2, setStep2] = useState<Step2AcademicData>({
    cgpaOrPercentage: 8.5,
    gradingScale: '10_POINT',
    maxGradeOnScale: 10,
    minPassingGradeOnScale: 4,
    estimatedGermanGrade: 1.75,
    previousQualifications: '12th Standard CBSE / State Board (Science Stream: Math, Physics, Chem)',
    degreeSubjectSpecialisation: 'Computer Science & Engineering',
    relevantSubjectsCompleted: [
      'Data Structures & Algorithms',
      'Discrete Mathematics',
      'Linear Algebra',
      'Database Management Systems',
      'Operating Systems',
    ],
    mathProgrammingBackground: {
      hasHigherMath: true,
      mathCreditsECTS: 24,
      hasProgramming: true,
      programmingLanguages: ['Python', 'Java', 'C++', 'SQL'],
      csCreditsECTS: 48,
    },
    totalCreditsECTS: 180,
    backlogsCount: 0,
    researchExperience: 'Final year thesis in automated computer vision for defect detection.',
    academicAwards: ['Dean Merit List 2023', 'Top 5% Departmental Ranking'],
  });

  // Step 3: Language Qualifications
  const [step3, setStep3] = useState<Step3LanguageData>({
    germanProficiency: 'B1',
    germanExamProvider: 'GOETHE',
    goetheResult: 'Goethe-Zertifikat B1 (Gut / 82%)',
    englishProficiency: 'ADVANCED',
    englishExamProvider: 'IELTS',
    englishScore: 7.5,
    englishSectionScores: {
      reading: 7.5,
      listening: 8.0,
      writing: 7.0,
      speaking: 7.5,
    },
    testDate: '2025-09-15',
    validUntil: '2027-09-15',
  });

  // Step 4: Projects & Achievements
  const [step4, setStep4] = useState<Step4ProjectsData>({
    projects: [
      {
        id: 'proj_1',
        title: 'Deep Learning Real-time Semantic Segmentation',
        category: 'AI_ML',
        description: 'Engineered a lightweight segmentation neural network achieving 82% mIoU on Cityscapes benchmark.',
        technologies: ['PyTorch', 'Python', 'OpenCV', 'TensorRT'],
        githubUrl: 'https://github.com',
      },
    ],
    internships: [
      {
        id: 'intern_1',
        role: 'Software Development Intern',
        organization: 'Tech Mahindra / Infosys Digital Labs',
        durationMonths: 6,
        description: 'Contributed to microservices refactoring and distributed messaging queue optimisation.',
      },
    ],
    publications: [],
    competitions: [
      {
        id: 'comp_1',
        name: 'Smart India Hackathon 2023',
        achievement: '1st Runner Up (National Finalist)',
        year: 2023,
      },
    ],
    sports: [
      {
        sportName: 'Badminton',
        competitionLevel: 'RECREATIONAL',
        achievements: 'University Inter-Department Badminton Tournament Quarter-finalist',
        isOfficialCompetitor: false,
      },
    ],
    volunteering: [
      {
        organization: 'Rotaract Youth Club',
        role: 'Lead Student Coordinator',
        durationMonths: 12,
        description: 'Organised STEM education outreach workshops for high school students.',
      },
    ],
    leadershipRoles: ['Student Representative - CSE Department Council'],
  });

  // Step 5: Budget & Preferences
  const [step5, setStep5] = useState<Step5BudgetData>({
    annualBudgetEUR: 12500,
    needsFullFunding: false,
    partialScholarshipAcceptable: true,
    maxAffordableMonthlyLivingEUR: 950,
    preferredStates: ['Bavaria', 'Baden-Württemberg', 'North Rhine-Westphalia'],
    preferredCities: ['Munich', 'Aachen', 'Karlsruhe', 'Stuttgart'],
    publicOrPrivatePreference: 'PUBLIC_ONLY',
    maxTuitionBudgetEUR: 1500,
    willingnessToStudyInGerman: true,
    targetTimelineMonths: 10,
  });

  // Step 6: Optional Sensitive Data & Scholarships
  const [step6, setStep6] = useState<Step6SensitiveScholarshipData>({
    exploreAcademicMerit: true,
    exploreFinancialNeed: false,
    financialNeedBracket: 'NOT_SPECIFIED',
    hasIncomeCertificate: false,
    exploreSportsScholarships: false,
    exploreWomenInStem: false,
    isEligibleForWomenInStem: false,
    exploreDisabilitySupport: false,
    disabilitySupportNeeds: {
      needsAccessibilityAccommodation: false,
      needsAdditionalExpenseAssistance: false,
      exploringSpecificFunding: false,
    },
    exploreRefugeeHumanitarian: false,
    exploreFirstGeneration: false,
    isFirstGenerationStudent: false,
    exploreSocialCommunity: true,
    exploreResearchInnovation: true,
    consentGivenAt: new Date().toISOString(),
  });

  const [consentAcknowledged, setConsentAcknowledged] = useState<boolean>(true);
  const [newSubjectInput, setNewSubjectInput] = useState<string>('');

  // Calculate live German Grade using Bavarian Formula
  const computeLiveGermanGrade = (score: number, scale: string, maxG = 10, minP = 4) => {
    if (scale === 'GERMAN_SCALE') return score;
    let nMax = maxG;
    let nMin = minP;
    if (scale === '10_POINT') {
      nMax = 10;
      nMin = 4;
    } else if (scale === 'PERCENTAGE') {
      nMax = 100;
      nMin = 40;
    } else if (scale === '4_POINT') {
      nMax = 4;
      nMin = 2;
    }
    if (nMax <= nMin) return 2.5;
    const clamped = Math.min(Math.max(score, nMin), nMax);
    const converted = 1 + 3 * ((nMax - clamped) / (nMax - nMin));
    return Number(Math.min(Math.max(converted, 1.0), 4.0).toFixed(2));
  };

  // Load existing profile if available
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('/api/engine/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            const p: FullApplicantProfile = json.data;
            if (p.step1) setStep1(p.step1);
            if (p.step2) setStep2(p.step2);
            if (p.step3) setStep3(p.step3);
            if (p.step4) setStep4(p.step4);
            if (p.step5) setStep5(p.step5);
            if (p.step6) {
              setStep6(p.step6);
              setConsentAcknowledged(true);
            }
          }
        }
      } catch (err) {
        console.warn('Could not fetch existing profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Update German grade live when academic values change
  useEffect(() => {
    const est = computeLiveGermanGrade(
      step2.cgpaOrPercentage,
      step2.gradingScale,
      step2.maxGradeOnScale,
      step2.minPassingGradeOnScale,
    );
    setStep2((prev) => ({ ...prev, estimatedGermanGrade: est }));
  }, [step2.cgpaOrPercentage, step2.gradingScale, step2.maxGradeOnScale, step2.minPassingGradeOnScale]);

  const handleSaveAndGenerate = async () => {
    setSaving(true);
    setError(null);
    setSaveSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please sign in to save your applicant profile and calculate recommendations.');
      }

      const payload = {
        step1,
        step2,
        step3,
        step4,
        step5,
        step6: consentAcknowledged
          ? {
              ...step6,
              consentGivenAt: step6.consentGivenAt || new Date().toISOString(),
            }
          : undefined,
      };

      const res = await fetch('/api/engine/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Failed to save profile (HTTP ${res.status})`);
      }

      setSaveSuccess('Profile successfully updated! Generating verified recommendations...');
      setTimeout(() => {
        navigate('/engine/dashboard');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving profile.');
    } finally {
      setSaving(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Personal & Study', icon: GraduationCap },
    { num: 2, title: 'Academic Profile', icon: Award },
    { num: 3, title: 'Languages', icon: Languages },
    { num: 4, title: 'Achievements', icon: Briefcase },
    { num: 5, title: 'Budget & Goals', icon: Wallet },
    { num: 6, title: 'Scholarships & Circumstances', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header Breadcrumb */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              EduRoute AI Recommendation Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Applicant Profile Wizard
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Complete your profile for deterministic admission matching, Bavarian formula grade conversion, and verified German scholarship pairing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/engine/dashboard')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
            >
              Skip to Recommendations
            </button>
            <button
              onClick={handleSaveAndGenerate}
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold rounded-lg btn-brand text-white flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save & Calculate'}
            </button>
          </div>
        </div>

        {/* Wizard Step Navigation Pills */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 sm:p-3 mb-8 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {stepsList.map((s) => {
              const Icon = s.icon;
              const isActive = activeStep === s.num;
              const isPast = activeStep > s.num;
              return (
                <button
                  key={s.num}
                  onClick={() => setActiveStep(s.num)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold shadow-xs'
                      : isPast
                      ? 'text-slate-800 hover:bg-slate-100'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : isPast
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isPast ? '✓' : s.num}
                  </div>
                  <span className="truncate">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        {saveSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 text-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP CONTENT CONTAINER */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {/* STEP 1: PERSONAL AND STUDY INFO */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  Step 1: Personal & Study Information
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Specify your academic destination, desired intake, and study language preference in Germany.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Legal Name</label>
                  <input
                    type="text"
                    value={step1.fullName}
                    onChange={(e) => setStep1({ ...step1, fullName: e.target.value })}
                    placeholder="e.g. Ishan Sharma"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={step1.email}
                    onChange={(e) => setStep1({ ...step1, email: e.target.value })}
                    placeholder="ishan.sharma@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nationality</label>
                  <input
                    type="text"
                    value={step1.nationality}
                    onChange={(e) => setStep1({ ...step1, nationality: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Country of Residence</label>
                  <input
                    type="text"
                    value={step1.residenceCountry}
                    onChange={(e) => setStep1({ ...step1, residenceCountry: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Education Level</label>
                  <select
                    value={step1.currentEducationLevel}
                    onChange={(e) => setStep1({ ...step1, currentEducationLevel: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                  >
                    <option value="Bachelor Degree">Bachelor Degree (4 Years B.Tech / B.E. / BS)</option>
                    <option value="Bachelor Degree 3 Years">Bachelor Degree (3 Years B.Sc / BCA)</option>
                    <option value="High School 12th">Senior Secondary / 12th Standard</option>
                    <option value="Master Degree">Master Degree</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Graduation Year</label>
                  <input
                    type="number"
                    value={step1.graduationYear}
                    onChange={(e) => setStep1({ ...step1, graduationYear: parseInt(e.target.value, 10) || 2024 })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current University & Degree</label>
                  <input
                    type="text"
                    value={step1.currentUniversity}
                    onChange={(e) => setStep1({ ...step1, currentUniversity: e.target.value })}
                    placeholder="e.g. Anna University (B.Tech Computer Science)"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Intended Intake Cycle</label>
                  <select
                    value={step1.intendedIntake}
                    onChange={(e) => setStep1({ ...step1, intendedIntake: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                  >
                    <option value="Winter Semester 2026/27">Winter Semester 2026/27 (Starts Oct 2026)</option>
                    <option value="Summer Semester 2027">Summer Semester 2027 (Starts Apr 2027)</option>
                    <option value="Winter Semester 2027/28">Winter Semester 2027/28 (Starts Oct 2027)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Intended Study Level in Germany</label>
                  <select
                    value={step1.intendedStudyLevel}
                    onChange={(e) => setStep1({ ...step1, intendedStudyLevel: e.target.value as DegreeLevel })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                  >
                    <option value="MASTER">Master Degree (M.Sc. / M.Eng.)</option>
                    <option value="BACHELOR">Bachelor Degree (B.Sc. / B.Eng.)</option>
                    <option value="PHD">PhD / Doctorate Research</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Intended Subject Discipline</label>
                  <select
                    value={step1.intendedSubject}
                    onChange={(e) => setStep1({ ...step1, intendedSubject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                  >
                    {POPULAR_SUBJECTS.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Preferred Teaching Language</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'ENGLISH', label: 'English Only', sub: 'Programs taught 100% in English' },
                      { id: 'GERMAN', label: 'German Taught', sub: 'Requires verified C1 level' },
                      { id: 'BILINGUAL', label: 'Both / Bilingual', sub: 'English & German hybrid' },
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setStep1({ ...step1, preferredStudyLanguage: opt.id as TeachingLanguage })}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          step1.preferredStudyLanguage === opt.id
                            ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/30'
                            : 'border-slate-200 bg-slate-50 hover:bg-white'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ACADEMIC PROFILE */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Step 2: Academic Profile & Grade Conversion
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Input your exact grades. The Bavarian Formula calculates your German equivalent grade.
                </p>
              </div>

              {/* Bavarian Formula Calculation Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-slate-900">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2.5 py-0.5 rounded-full">
                      Bavarian Formula Converter
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      Estimated German Equivalent Grade: <span className="text-emerald-700 text-xl font-extrabold">{step2.estimatedGermanGrade?.toFixed(2)}</span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Formula: <span className="font-mono text-slate-800">1 + 3 × ((Nmax - N) / (Nmax - Nmin))</span>. German grading system runs from <strong>1.0 (Sehr Gut / Best)</strong> to <strong>4.0 (Ausreichend / Minimum Pass)</strong>.
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs text-slate-500 block">Assessment Status:</span>
                    <span className="inline-block mt-0.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white">
                      {step2.estimatedGermanGrade && step2.estimatedGermanGrade <= 2.0
                        ? 'Sehr Gut (Highly Competitive)'
                        : step2.estimatedGermanGrade && step2.estimatedGermanGrade <= 2.5
                        ? 'Gut (Standard Direct Admission)'
                        : 'Befriedigend (Aptitude Verification Needed)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Grading Scale</label>
                  <select
                    value={step2.gradingScale}
                    onChange={(e) => setStep2({ ...step2, gradingScale: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                  >
                    <option value="10_POINT">10-Point CGPA (Standard Indian Universities)</option>
                    <option value="PERCENTAGE">Percentage (%) Scale</option>
                    <option value="4_POINT">4-Point GPA Scale</option>
                    <option value="GERMAN_SCALE">German Scale (1.0 to 4.0 direct)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Your Score / CGPA / %</label>
                  <input
                    type="number"
                    step="0.01"
                    value={step2.cgpaOrPercentage}
                    onChange={(e) => setStep2({ ...step2, cgpaOrPercentage: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Active Backlogs Count</label>
                  <input
                    type="number"
                    value={step2.backlogsCount}
                    onChange={(e) => setStep2({ ...step2, backlogsCount: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                  />
                </div>
              </div>

              {/* Subject Breakdown & Credits */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Mathematics & Computing Prerequisites (ECTS Alignment)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3 bg-white p-3.5 rounded-lg border border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={step2.mathProgrammingBackground.hasHigherMath}
                        onChange={(e) =>
                          setStep2({
                            ...step2,
                            mathProgrammingBackground: {
                              ...step2.mathProgrammingBackground,
                              hasHigherMath: e.target.checked,
                            },
                          })
                        }
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span className="text-xs font-semibold text-slate-800">
                        Higher Mathematics Completed (Linear Algebra, Calculus)
                      </span>
                    </label>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">Estimated Math ECTS Credits:</span>
                      <input
                        type="number"
                        value={step2.mathProgrammingBackground.mathCreditsECTS || 20}
                        onChange={(e) =>
                          setStep2({
                            ...step2,
                            mathProgrammingBackground: {
                              ...step2.mathProgrammingBackground,
                              mathCreditsECTS: parseInt(e.target.value, 10) || 0,
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 bg-white p-3.5 rounded-lg border border-slate-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={step2.mathProgrammingBackground.hasProgramming}
                        onChange={(e) =>
                          setStep2({
                            ...step2,
                            mathProgrammingBackground: {
                              ...step2.mathProgrammingBackground,
                              hasProgramming: e.target.checked,
                            },
                          })
                        }
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span className="text-xs font-semibold text-slate-800">
                        Computer Science & Programming Core Completed
                      </span>
                    </label>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">Estimated Computer Science ECTS Credits:</span>
                      <input
                        type="number"
                        value={step2.mathProgrammingBackground.csCreditsECTS || 40}
                        onChange={(e) =>
                          setStep2({
                            ...step2,
                            mathProgrammingBackground: {
                              ...step2.mathProgrammingBackground,
                              csCreditsECTS: parseInt(e.target.value, 10) || 0,
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Relevant Subjects Completed */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Completed University Modules (Transcripts matching)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {step2.relevantSubjectsCompleted.map((subj, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300"
                      >
                        {subj}
                        <button
                          type="button"
                          onClick={() =>
                            setStep2({
                              ...step2,
                              relevantSubjectsCompleted: step2.relevantSubjectsCompleted.filter((_, i) => i !== idx),
                            })
                          }
                          className="hover:text-red-700 text-emerald-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add module (e.g. Computer Networks, Software Engineering)"
                      value={newSubjectInput}
                      onChange={(e) => setNewSubjectInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newSubjectInput.trim()) {
                          e.preventDefault();
                          setStep2({
                            ...step2,
                            relevantSubjectsCompleted: [...step2.relevantSubjectsCompleted, newSubjectInput.trim()],
                          });
                          setNewSubjectInput('');
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newSubjectInput.trim()) {
                          setStep2({
                            ...step2,
                            relevantSubjectsCompleted: [...step2.relevantSubjectsCompleted, newSubjectInput.trim()],
                          });
                          setNewSubjectInput('');
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 text-xs font-semibold hover:bg-slate-300"
                    >
                      Add Module
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LANGUAGE QUALIFICATIONS */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Languages className="w-5 h-5 text-emerald-600" />
                  Step 3: Language Qualifications (German & English)
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Accurate language certificates prevent rejection by Uni-Assist and university admissions boards.
                </p>
              </div>

              {/* German Language Section */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    German Language Proficiency (CEFR)
                  </h3>
                  <span className="text-[11px] text-slate-500">Required for German or Bilingual degrees</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">CEFR Level Achieved</label>
                    <select
                      value={step3.germanProficiency}
                      onChange={(e) => setStep3({ ...step3, germanProficiency: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-semibold"
                    >
                      <option value="NONE">None / Beginner (A0)</option>
                      <option value="A1">A1 (Elementary)</option>
                      <option value="A2">A2 (Pre-Intermediate)</option>
                      <option value="B1">B1 (Intermediate)</option>
                      <option value="B2">B2 (Upper-Intermediate)</option>
                      <option value="C1">C1 (Advanced - University Entry Level)</option>
                      <option value="C2">C2 (Near Native Mastery)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Exam Provider</label>
                    <select
                      value={step3.germanExamProvider || 'NONE'}
                      onChange={(e) => setStep3({ ...step3, germanExamProvider: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                    >
                      <option value="GOETHE">Goethe-Institut (Goethe-Zertifikat)</option>
                      <option value="TESTDAF">TestDaF</option>
                      <option value="DSH">DSH (Deutsche Sprachprüfung für den Hochschulzugang)</option>
                      <option value="TELC">telc Deutsch C1 Hochschule</option>
                      <option value="IN_PROGRESS">Currently In Progress / Course Enrolled</option>
                      <option value="NONE">No Official Certificate Yet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Certificate Result / Score</label>
                    <input
                      type="text"
                      value={step3.goetheResult || ''}
                      onChange={(e) => setStep3({ ...step3, goetheResult: e.target.value })}
                      placeholder="e.g. Goethe B1 passed with 84 Punkte"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* English Language Section */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    English Language Proficiency
                  </h3>
                  <span className="text-[11px] text-slate-500">Mandatory for English-taught Master/Bachelor</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Test Provider</label>
                    <select
                      value={step3.englishExamProvider || 'IELTS'}
                      onChange={(e) => setStep3({ ...step3, englishExamProvider: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                    >
                      <option value="IELTS">IELTS Academic</option>
                      <option value="TOEFL">TOEFL iBT</option>
                      <option value="PTE">PTE Academic</option>
                      <option value="DUOLINGO">Duolingo English Test (DET)</option>
                      <option value="MOI_LETTER">Medium of Instruction (MOI) Certificate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Overall Band / Score</label>
                    <input
                      type="number"
                      step="0.5"
                      value={step3.englishScore || 7.5}
                      onChange={(e) => setStep3({ ...step3, englishScore: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Test Date / Validity</label>
                    <input
                      type="date"
                      value={step3.testDate || ''}
                      onChange={(e) => setStep3({ ...step3, testDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PROJECTS AND ACHIEVEMENTS */}
          {activeStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  Step 4: Projects, Internships & Achievements
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Relevant technical projects, sports achievements, and competitions unlock specialized merit grants and foundation fellowships.
                </p>
              </div>

              {/* Technical Projects */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Technical & Software Projects
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setStep4({
                        ...step4,
                        projects: [
                          ...step4.projects,
                          {
                            id: `proj_${Date.now()}`,
                            title: 'New Technical Project',
                            category: 'SOFTWARE',
                            description: 'Description of key architectural contributions.',
                            technologies: ['Python', 'SQL'],
                          },
                        ],
                      })
                    }
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </button>
                </div>

                {step4.projects.map((proj, pIdx) => (
                  <div key={proj.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...step4.projects];
                          updated[pIdx].title = e.target.value;
                          setStep4({ ...step4, projects: updated });
                        }}
                        placeholder="Project Title"
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setStep4({
                            ...step4,
                            projects: step4.projects.filter((_, i) => i !== pIdx),
                          });
                        }}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...step4.projects];
                        updated[pIdx].description = e.target.value;
                        setStep4({ ...step4, projects: updated });
                      }}
                      placeholder="Project description, outcomes, and metrics"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                    />
                  </div>
                ))}
              </div>

              {/* Sports Achievements (Crucial for TEST 3) */}
              <div className="p-4 rounded-xl border border-slate-200 bg-amber-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Sports Achievements & Athletic Background
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Elite German sports scholarships (e.g. adh Partnerhochschule des Spitzensports) require verified State, National, or International federation squad ranking. Recreational play does not qualify for elite athlete stipends.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setStep4({
                        ...step4,
                        sports: [
                          ...step4.sports,
                          {
                            sportName: 'Badminton / Athletics',
                            competitionLevel: 'NATIONAL',
                            achievements: 'National Squad Finalist / Medalist',
                            isOfficialCompetitor: true,
                          },
                        ],
                      })
                    }
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-900"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Sport
                  </button>
                </div>

                {step4.sports.map((sport, sIdx) => (
                  <div key={sIdx} className="p-3.5 rounded-lg border border-amber-200 bg-white grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">Sport Discipline</span>
                      <input
                        type="text"
                        value={sport.sportName}
                        onChange={(e) => {
                          const updated = [...step4.sports];
                          updated[sIdx].sportName = e.target.value;
                          setStep4({ ...step4, sports: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">Competition Level</span>
                      <select
                        value={sport.competitionLevel}
                        onChange={(e) => {
                          const updated = [...step4.sports];
                          updated[sIdx].competitionLevel = e.target.value as any;
                          setStep4({ ...step4, sports: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs font-semibold"
                      >
                        <option value="RECREATIONAL">Recreational / Hobby (No squad ranking)</option>
                        <option value="COLLEGE">College / University Inter-Collegiate</option>
                        <option value="STATE">State Level Federation Ranked</option>
                        <option value="NATIONAL">National Championship Squad</option>
                        <option value="INTERNATIONAL">International / Junior Team</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">Official Competitor Status</span>
                      <label className="flex items-center gap-2 cursor-pointer mt-1">
                        <input
                          type="checkbox"
                          checked={sport.isOfficialCompetitor}
                          onChange={(e) => {
                            const updated = [...step4.sports];
                            updated[sIdx].isOfficialCompetitor = e.target.checked;
                            setStep4({ ...step4, sports: updated });
                          }}
                          className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                        />
                        <span className="text-xs text-slate-700">Federation Certified</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <span className="text-[11px] text-slate-500 block mb-1">Achievements / Medals</span>
                        <input
                          type="text"
                          value={sport.achievements}
                          onChange={(e) => {
                            const updated = [...step4.sports];
                            updated[sIdx].achievements = e.target.value;
                            setStep4({ ...step4, sports: updated });
                          }}
                          placeholder="Tournament / Ranking"
                          className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setStep4({
                            ...step4,
                            sports: step4.sports.filter((_, i) => i !== sIdx),
                          });
                        }}
                        className="text-slate-400 hover:text-red-600 mt-4"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: BUDGET AND PREFERENCES */}
          {activeStep === 5 && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-600" />
                  Step 5: Budget, Cost Reality & Preferences
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Transparent cost breakdown of German higher education with tuition fee safeguards.
                </p>
              </div>

              {/* Statutory Cost Transparency Card */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 text-slate-800 text-xs space-y-2">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-600" />
                  Cost of Studying in Germany: Verified Baseline Facts
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <span className="font-bold text-slate-900 block">Tuition Fees: €0</span>
                    <span className="text-[11px] text-slate-600">
                      Most public universities charge €0 tuition (except Baden-Württemberg & selected TUM non-EU fees).
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <span className="font-bold text-slate-900 block">Semester Ticket: ~€150–€350</span>
                    <span className="text-[11px] text-slate-600">
                      Paid twice yearly; includes student services and regional public transportation ticket.
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <span className="font-bold text-slate-900 block">Blocked Account: €11,904/yr</span>
                    <span className="text-[11px] text-slate-600">
                      Statutory living allowance requirement (€992/month) for the German National Visa.
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Annual Available Study Budget (€ EUR)
                  </label>
                  <input
                    type="number"
                    value={step5.annualBudgetEUR}
                    onChange={(e) => setStep5({ ...step5, annualBudgetEUR: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Max Affordable Monthly Living Cost (€ EUR)
                  </label>
                  <input
                    type="number"
                    value={step5.maxAffordableMonthlyLivingEUR}
                    onChange={(e) =>
                      setStep5({
                        ...step5,
                        maxAffordableMonthlyLivingEUR: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Institution Preference
                  </label>
                  <select
                    value={step5.publicOrPrivatePreference}
                    onChange={(e) => setStep5({ ...step5, publicOrPrivatePreference: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                  >
                    <option value="PUBLIC_ONLY">Public Universities Only (Tuition-free / TU9 / Universities of Applied Sciences)</option>
                    <option value="PRIVATE_ACCEPTABLE">Private Universities Acceptable (Tuition €5k - €15k/yr)</option>
                    <option value="NO_PREFERENCE">No Preference</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Maximum Acceptable Tuition (€ EUR / Semester)
                  </label>
                  <input
                    type="number"
                    value={step5.maxTuitionBudgetEUR}
                    onChange={(e) => setStep5({ ...step5, maxTuitionBudgetEUR: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Preferred German Federal States
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {GERMAN_STATES.map((state) => {
                      const isSelected = step5.preferredStates.includes(state);
                      return (
                        <button
                          type="button"
                          key={state}
                          onClick={() => {
                            if (isSelected) {
                              setStep5({
                                ...step5,
                                preferredStates: step5.preferredStates.filter((s) => s !== state),
                              });
                            } else {
                              setStep5({
                                ...step5,
                                preferredStates: [...step5.preferredStates, state],
                              });
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {state} {isSelected ? '✓' : '+'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: OPTIONAL SCHOLARSHIP ELIGIBILITY & SENSITIVE DATA */}
          {activeStep === 6 && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Optional Scholarship Circumstances
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  Find Scholarships that Match Your Circumstances
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Explore specialized funding schemes. All fields in this section are completely optional and kept strictly confidential.
                </p>
              </div>

              {/* Explicit Privacy Banner */}
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-slate-900">
                  <Lock className="w-4 h-4 text-slate-700" />
                  Privacy & Fair Evaluation Guarantee
                </div>
                <p className="text-slate-600">
                  These questions are optional and used <strong>only</strong> to check eligibility for specific scholarship programmes (e.g. Studierendenwerk disability grants, Women in STEM fellowships, or need-based aid).
                  Your answers here are stored separately and <strong>never used to down-rank or penalize your academic university matches</strong>. You can withdraw consent or delete this data at any time.
                </p>
              </div>

              {/* Consent Toggle */}
              <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAcknowledged}
                    onChange={(e) => setConsentAcknowledged(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block">
                      I consent to processing these optional attributes solely for scholarship eligibility evaluation
                    </span>
                    <span className="text-[11px] text-emerald-800">
                      I understand I can withdraw consent or request deletion from the Privacy tab in the Recommendation Dashboard.
                    </span>
                  </div>
                </label>
              </div>

              {consentAcknowledged && (
                <div className="space-y-4 pt-2">
                  {/* Category 1: Academic Merit */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={step6.exploreAcademicMerit}
                      onChange={(e) => setStep6({ ...step6, exploreAcademicMerit: e.target.checked })}
                      className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Academic Merit Scholarships</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Evaluates eligibility for Deutschlandstipendium (€300/mo) and TUM/RWTH Merit Awards based on your converted Bavarian GPA.
                      </p>
                    </div>
                  </div>

                  {/* Category 2: Financial Need (TEST 6) */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={step6.exploreFinancialNeed}
                        onChange={(e) => setStep6({ ...step6, exploreFinancialNeed: e.target.checked })}
                        className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Financial Need & Household Income Schemes</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Unlocks foundations prioritizing applicants from economically disadvantaged backgrounds (e.g. Friedrich Ebert Foundation international stipend).
                        </p>
                      </div>
                    </div>

                    {step6.exploreFinancialNeed && (
                      <div className="ml-7 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            Self-Reported Income Bracket
                          </label>
                          <select
                            value={step6.financialNeedBracket || 'NOT_SPECIFIED'}
                            onChange={(e) => setStep6({ ...step6, financialNeedBracket: e.target.value as any })}
                            className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs bg-white text-slate-900"
                          >
                            <option value="NOT_SPECIFIED">Prefer Not To Disclose</option>
                            <option value="LOW_INCOME">Low Household Income (Need-Based Eligible)</option>
                            <option value="LOWER_MIDDLE">Lower-Middle Income Bracket</option>
                            <option value="MIDDLE">Middle / Upper Income</option>
                          </select>
                        </div>
                        <div>
                          <label className="flex items-center gap-2 cursor-pointer mt-5">
                            <input
                              type="checkbox"
                              checked={step6.hasIncomeCertificate ?? false}
                              onChange={(e) => setStep6({ ...step6, hasIncomeCertificate: e.target.checked })}
                              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                            />
                            <span className="text-xs text-slate-700">Official parent/tax income certificate available</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category 3: Women in STEM (TEST 5) */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={step6.exploreWomenInStem}
                        onChange={(e) => setStep6({ ...step6, exploreWomenInStem: e.target.checked })}
                        className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Women in STEM Schemes</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Unlocks specialized grants targeting female engineers, computer scientists, and researchers (e.g. DAAD Women in STEM, KIT Women in Engineering Fellowship).
                        </p>
                      </div>
                    </div>

                    {step6.exploreWomenInStem && (
                      <div className="ml-7 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={step6.isEligibleForWomenInStem ?? false}
                            onChange={(e) => setStep6({ ...step6, isEligibleForWomenInStem: e.target.checked })}
                            className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                          />
                          <span className="text-xs font-semibold text-slate-800">
                            I identify as female pursuing a STEM degree and wish to be considered
                          </span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Category 4: Disability & Chronic Illness Support (TEST 4) */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={step6.exploreDisabilitySupport}
                        onChange={(e) => setStep6({ ...step6, exploreDisabilitySupport: e.target.checked })}
                        className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          Disability, Chronic Health or Mobility Accommodation Support
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          We do NOT ask for medical diagnoses. We match German university disability subsidies (Deutsches Studierendenwerk additional living assistance) designed to cover extra living/mobility expenses.
                        </p>
                      </div>
                    </div>

                    {step6.exploreDisabilitySupport && (
                      <div className="ml-7 pt-1 space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={step6.disabilitySupportNeeds?.needsAdditionalExpenseAssistance ?? false}
                            onChange={(e) =>
                              setStep6({
                                ...step6,
                                disabilitySupportNeeds: {
                                  needsAccessibilityAccommodation: step6.disabilitySupportNeeds?.needsAccessibilityAccommodation ?? false,
                                  exploringSpecificFunding: true,
                                  needsAdditionalExpenseAssistance: e.target.checked,
                                },
                              })
                            }
                            className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                          />
                          <span className="text-xs font-semibold text-slate-800">
                            I anticipate additional study/living expenses related to a disability, chronic illness, or mobility accommodation
                          </span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Category 5: Social Engagement & First Generation */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={step6.exploreFirstGeneration}
                      onChange={(e) =>
                        setStep6({
                          ...step6,
                          exploreFirstGeneration: e.target.checked,
                          isFirstGenerationStudent: e.target.checked,
                        })
                      }
                      className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">First-Generation University Student Schemes</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Matches ArbeiterKind.de and foundation initiatives supporting students who are the first in their immediate family to attend university.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Wizard Action Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              disabled={activeStep === 1}
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <div className="text-xs text-slate-500 font-medium">
              Step {activeStep} of 6
            </div>

            {activeStep < 6 ? (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => Math.min(6, prev + 1))}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAndGenerate}
                disabled={saving}
                className="px-6 py-2.5 rounded-lg btn-brand text-white text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {saving ? 'Calculating Matches...' : 'Save & Calculate Recommendations'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
