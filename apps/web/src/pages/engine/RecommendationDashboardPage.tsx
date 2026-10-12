import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/Navbar';
import {
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  ExternalLink,
  FileText,
  Filter,
  HelpCircle,
  Lock,
  MessageSquare,
  RefreshCw,
  Sliders,
  Sparkles,
  Star,
  Trash2,
  AlertCircle,
  AlertTriangle,
  Building2,
  Euro,
  Languages,
  Send,
  Shield,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  UniversityMatchResult,
  ScholarshipMatchResult,
  RecommendationEngineResponse,
  UniversityMatchStatus,
  ScholarshipEligibilityStatus,
  RoadmapStep,
  SavedShortlistItem,
} from '@educaro/shared';

export const RecommendationDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab: 'universities' | 'scholarships' | 'roadmap' | 'shortlist' | 'assistant' | 'privacy'
  const initialTab = searchParams.get('tab') || 'universities';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<RecommendationEngineResponse | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  const [shortlists, setShortlists] = useState<SavedShortlistItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterLanguage, setFilterLanguage] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterTuition, setFilterTuition] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Configurable Weights Modal
  const [showWeightsModal, setShowWeightsModal] = useState<boolean>(false);
  const [weights, setWeights] = useState({
    academic: 30,
    subject: 25,
    language: 20,
    budget: 15,
    preferences: 10,
  });

  // AI Assistant Chat State
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; text: string; sources?: string[] }[]
  >([
    {
      role: 'assistant',
      text: 'Hello! I am your German University & Scholarship Advisory Assistant. Ask me anything about your admission eligibility, Bavarian formula conversions, APS India procedures, or matching scholarship funds.',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Privacy Actions
  const [privacyMessage, setPrivacyMessage] = useState<string | null>(null);

  // Expanded score breakdowns
  const [expandedBreakdown, setExpandedBreakdown] = useState<Record<string, boolean>>({});

  const toggleBreakdown = (id: string) => {
    setExpandedBreakdown((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const syncTabParam = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Fetch initial dashboard recommendations
  const fetchDashboardData = async (activeWeights?: typeof weights) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please sign in to access recommendations.');
      }

      // Fetch recommendations
      const recUrl = activeWeights ? '/api/engine/recommendations' : '/api/engine/recommendations';
      const recMethod = activeWeights ? 'POST' : 'GET';
      const recBody = activeWeights ? JSON.stringify({ weights: activeWeights }) : undefined;

      const res = await fetch(recUrl, {
        method: recMethod,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: recBody,
      });

      if (res.status === 404) {
        // No profile created yet
        navigate('/engine/wizard');
        return;
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Failed to fetch recommendations (HTTP ${res.status})`);
      }

      const recJson = await res.json();
      setData(recJson.data);

      // Fetch roadmap
      const roadRes = await fetch('/api/engine/roadmap', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (roadRes.ok) {
        const roadJson = await roadRes.json();
        setRoadmap(roadJson.data || []);
      }

      // Fetch shortlists
      const shortRes = await fetch('/api/engine/shortlists', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (shortRes.ok) {
        const shortJson = await shortRes.json();
        setShortlists(shortJson.data || []);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading recommendation dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Shortlist toggle
  const handleToggleShortlist = async (
    itemType: 'PROGRAMME' | 'SCHOLARSHIP',
    itemId: string,
    isCurrentlySaved?: boolean,
  ) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      if (isCurrentlySaved) {
        await fetch(`/api/engine/shortlists/${itemType}/${itemId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await fetch('/api/engine/shortlists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ itemType, itemId }),
        });
      }

      // Refresh shortlists & current list
      fetchDashboardData(weights);
    } catch (err) {
      console.error('Failed to toggle shortlist', err);
    }
  };

  // Toggle roadmap step completion
  const handleToggleRoadmapStep = async (stepId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`/api/engine/roadmap/${stepId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !currentStatus }),
      });

      if (res.ok) {
        const json = await res.json();
        setRoadmap((prev) => prev.map((s) => (s.id === stepId ? json.data : s)));
      }
    } catch (err) {
      console.error('Failed to toggle roadmap step', err);
    }
  };

  // Regenerate fresh roadmap
  const handleRefreshRoadmap = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/engine/roadmap/refresh', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setRoadmap(json.data || []);
      }
    } catch (err) {
      console.error('Failed to refresh roadmap', err);
    }
  };

  // AI Assistant Chat Send
  const handleSendChat = async (overridePrompt?: string) => {
    const query = overridePrompt || chatInput;
    if (!query.trim() || chatLoading) return;

    const userMessage = { role: 'user' as const, text: query };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/engine/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      if (res.ok) {
        const json = await res.json();
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: json.data.answer,
            sources: json.data.groundedSources,
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'Unable to process query at this time. Please review the verified university and scholarship cards directly on this dashboard.',
          },
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Network issue contacting advisory service. Falling back to grounded criteria.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Privacy Actions
  const handleWithdrawConsent = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/engine/profile/withdraw-consent', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setPrivacyMessage(json.data.message);
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSensitiveData = async () => {
    if (!window.confirm('Are you sure you want to permanently delete all sensitive scholarship attributes?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/engine/profile/sensitive-data', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setPrivacyMessage(json.data.message);
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered University Matches
  const filteredUniversities = (data?.universityMatches || []).filter((m) => {
    if (filterLanguage !== 'ALL' && m.programme.teachingLanguage !== filterLanguage) return false;
    if (filterStatus !== 'ALL' && m.admissionStatus !== filterStatus) return false;
    if (filterTuition === 'FREE' && m.programme.tuitionFeeEUR > 0) return false;
    if (filterTuition === 'PAID' && m.programme.tuitionFeeEUR === 0) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.programme.programmeName.toLowerCase().includes(q);
      const matchUni = (m.programme.universityName || '').toLowerCase().includes(q);
      const matchCity = (m.programme.city || '').toLowerCase().includes(q);
      if (!matchName && !matchUni && !matchCity) return false;
    }
    return true;
  });

  // Filtered Scholarship Matches
  const filteredScholarships = (data?.scholarshipMatches || []).filter((s) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.scholarship.scholarshipName.toLowerCase().includes(q);
      const matchProv = s.scholarship.providerName.toLowerCase().includes(q);
      if (!matchName && !matchProv) return false;
    }
    return true;
  });

  // Admission Status Badge Helper
  const renderAdmissionStatusBadge = (status: UniversityMatchStatus) => {
    switch (status) {
      case UniversityMatchStatus.SATISFIED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Requirements Satisfied
          </span>
        );
      case UniversityMatchStatus.POTENTIAL_MATCH:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-700" /> Potential Match — Verification Required
          </span>
        );
      case UniversityMatchStatus.UNMET_REQUIREMENTS:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            <AlertCircle className="w-3.5 h-3.5 text-rose-700" /> Requirements Not Satisfied
          </span>
        );
      case UniversityMatchStatus.UNSUITABLE:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300">
            Currently Unsuitable
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            More Information Required
          </span>
        );
    }
  };

  // Scholarship Eligibility Status Badge Helper
  const renderScholarshipStatusBadge = (status: ScholarshipEligibilityStatus) => {
    switch (status) {
      case ScholarshipEligibilityStatus.LIKELY_ELIGIBLE:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Likely Eligible
          </span>
        );
      case ScholarshipEligibilityStatus.POTENTIALLY_ELIGIBLE:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
            <Clock className="w-3.5 h-3.5 text-blue-700" /> Potentially Eligible
          </span>
        );
      case ScholarshipEligibilityStatus.DEADLINE_PASSED:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300">
            <AlertTriangle className="w-3.5 h-3.5 text-slate-600" /> Deadline Passed
          </span>
        );
      case ScholarshipEligibilityStatus.MISSING_INFO:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" /> Missing Information
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            Not Currently Eligible
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
          <h2 className="text-base font-bold text-slate-800">
            Evaluating German University Admissions & Scholarships...
          </h2>
          <p className="text-xs text-slate-500">
            Applying Bavarian Formula, ECTS credit validation, and verified scholarship rules.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Applicant Summary Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Verified Germany Higher Education Matching
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Admissions & Scholarship Recommendations
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Candidate: <strong className="text-slate-900">{data?.applicantSummary.fullName || 'Indian Applicant'}</strong> • Intended Degree: <strong className="text-slate-900">{data?.applicantSummary.intendedDegree} in {data?.applicantSummary.intendedSubject}</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">German Grade</span>
                <span className="text-base font-black text-emerald-700">
                  {data?.applicantSummary.convertedGermanGrade ? data.applicantSummary.convertedGermanGrade.toFixed(2) : '2.00'}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">German Level</span>
                <span className="text-base font-bold text-slate-800">
                  {data?.applicantSummary.germanLevel || 'B1'}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">English Test</span>
                <span className="text-base font-bold text-slate-800">
                  {data?.applicantSummary.englishScore || 'IELTS 7.5'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowWeightsModal(true)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  title="Configure matching weights"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-600" />
                  Weights
                </button>
                <Link
                  to="/engine/wizard"
                  className="px-4 py-2.5 rounded-xl btn-brand text-white text-xs font-bold shadow-xs hover:brightness-105 flex items-center gap-1.5"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 mb-8 overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-6 min-w-max">
            {[
              { id: 'universities', label: 'University Recommendations', count: data?.universityMatches.length, icon: Building2 },
              { id: 'scholarships', label: 'Scholarships & Grants', count: data?.scholarshipMatches.length, icon: Award },
              { id: 'roadmap', label: 'Application Roadmap', count: roadmap.length, icon: Compass },
              { id: 'shortlist', label: 'Saved Shortlist', count: shortlists.length, icon: Star },
              { id: 'assistant', label: 'AI Advisory Assistant', icon: MessageSquare },
              { id: 'privacy', label: 'Privacy & Consent', icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => syncTabParam(tab.id)}
                  className={`pb-4 px-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                    isActive
                      ? 'border-emerald-600 text-emerald-800'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: UNIVERSITIES */}
        {activeTab === 'universities' && (
          <div className="space-y-6">
            {/* Filter controls */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                  <Filter className="w-3.5 h-3.5" /> Filter by:
                </div>

                <select
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs font-medium"
                >
                  <option value="ALL">All Languages</option>
                  <option value="ENGLISH">English Only</option>
                  <option value="GERMAN">German Taught</option>
                  <option value="BILINGUAL">Bilingual</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs font-medium"
                >
                  <option value="ALL">All Match Statuses</option>
                  <option value={UniversityMatchStatus.SATISFIED}>Requirements Satisfied</option>
                  <option value={UniversityMatchStatus.POTENTIAL_MATCH}>Potential Match</option>
                  <option value={UniversityMatchStatus.UNMET_REQUIREMENTS}>Requirements Unmet</option>
                </select>

                <select
                  value={filterTuition}
                  onChange={(e) => setFilterTuition(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs font-medium"
                >
                  <option value="ALL">All Tuition Types</option>
                  <option value="FREE">€0 Tuition (Public)</option>
                  <option value="PAID">Non-EU Tuition / Specialized</option>
                </select>
              </div>

              <div className="w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search university or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>
            </div>

            {/* University Cards List */}
            {filteredUniversities.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                <p className="text-sm text-slate-600 font-medium">No university matches found for active filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUniversities.map((item) => {
                  const p = item.programme;
                  const isSaved = item.isSaved;
                  const isBreakdownOpen = expandedBreakdown[p.id];

                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {renderAdmissionStatusBadge(item.admissionStatus)}
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
                              {p.teachingLanguage === 'ENGLISH' ? '🇬🇧 English' : p.teachingLanguage === 'GERMAN' ? '🇩🇪 German' : '🌐 Bilingual'}
                            </span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
                              {p.institutionType || 'TU9 / University'}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 pt-1">
                            {p.programmeName}
                          </h3>
                          <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                            <span className="font-semibold text-slate-800">{p.universityName}</span>
                            <span>•</span>
                            <span>{p.city}, {p.federalState}</span>
                            <span>•</span>
                            <span>Intake: {p.intake}</span>
                            <span>•</span>
                            <span>Winter Deadline: <strong className="text-slate-800">{p.applicationDeadlineWinter}</strong></span>
                          </div>
                        </div>

                        {/* Right Match Score and Shortlist button */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-500 uppercase font-bold block">Compatibility</span>
                            <span className="text-xl font-black text-emerald-700">{item.matchScore}%</span>
                          </div>

                          <button
                            onClick={() => handleToggleShortlist('PROGRAMME', p.id, isSaved)}
                            className={`p-2.5 rounded-xl border transition-all ${
                              isSaved
                                ? 'bg-amber-50 border-amber-300 text-amber-700'
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-600 hover:bg-white'
                            }`}
                            title={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
                          >
                            <Star className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Criteria matched and missing */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {item.matchedCriteria.length > 0 && (
                          <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-xl p-3 text-xs space-y-1.5">
                            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Criteria Met
                            </div>
                            <ul className="space-y-1 text-emerald-900 list-disc list-inside">
                              {item.matchedCriteria.map((c, idx) => (
                                <li key={idx}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {item.missingRequirements.length > 0 && (
                          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 text-xs space-y-1.5">
                            <div className="font-bold text-rose-950 flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-700" /> Missing Requirements (Action Required)
                            </div>
                            <ul className="space-y-1 text-rose-900 list-disc list-inside">
                              {item.missingRequirements.map((m, idx) => (
                                <li key={idx}>{m}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Next Action Pill */}
                      <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <span className="font-bold text-slate-700">Recommended Action: </span>
                          <span className="text-slate-900">{item.recommendedNextAction}</span>
                        </div>
                        <button
                          onClick={() => toggleBreakdown(p.id)}
                          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                        >
                          {isBreakdownOpen ? 'Hide Score Breakdown' : 'View Score Breakdown'}
                          {isBreakdownOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Expandable Score Breakdown */}
                      {isBreakdownOpen && (
                        <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                          <div>
                            <span className="text-slate-500 block text-[11px]">Academic (30%)</span>
                            <span className="font-bold text-slate-900">{item.scoreBreakdown.academicCompatibility} / 30</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[11px]">Subject (25%)</span>
                            <span className="font-bold text-slate-900">{item.scoreBreakdown.subjectRelevance} / 25</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[11px]">Language (20%)</span>
                            <span className="font-bold text-slate-900">{item.scoreBreakdown.languageReadiness} / 20</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[11px]">Budget (15%)</span>
                            <span className="font-bold text-slate-900">{item.scoreBreakdown.budgetCompatibility} / 15</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[11px]">Preferences (10%)</span>
                            <span className="font-bold text-slate-900">{item.scoreBreakdown.locationAndPreferences} / 10</span>
                          </div>
                        </div>
                      )}

                      {/* Estimated Costs Banner (Clearly labelled as estimates) */}
                      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                        <div className="flex flex-wrap items-center gap-4 text-slate-600">
                          <div>
                            Tuition: <strong className="text-slate-900">{p.tuitionFeeEUR === 0 ? '€0 (Free)' : `€${p.tuitionFeeEUR}/sem`}</strong>
                          </div>
                          <div>
                            Semester Ticket: <strong className="text-slate-900">€{item.estimatedCosts.semesterContributionEUR}</strong>
                          </div>
                          <div>
                            Living Estimate: <strong className="text-slate-900">~€{item.estimatedCosts.monthlyLivingEstimateEUR}/mo</strong>
                          </div>
                          <div>
                            Annual Total: <strong className="text-slate-900">~€{item.estimatedCosts.annualTotalEstimateEUR.toLocaleString()}</strong>
                          </div>
                          <span className="text-[10px] text-slate-600 italic">(Verified baseline estimates)</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <a
                            href={p.officialAdmissionRequirementsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                          >
                            Requirements Portal <ExternalLink className="w-3 h-3" />
                          </a>
                          <a
                            href={p.officialProgrammeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                          >
                            Apply Official Portal <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SCHOLARSHIPS */}
        {activeTab === 'scholarships' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="text-xs text-slate-600">
                Displaying <strong>{filteredScholarships.length}</strong> verified funding schemes for Indian students.
              </div>
              <div className="w-64">
                <input
                  type="text"
                  placeholder="Search scholarships..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredScholarships.map((item) => {
                const s = item.scholarship;
                const isSaved = item.isSaved;

                return (
                  <div
                    key={s.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {renderScholarshipStatusBadge(item.eligibilityStatus)}
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                            {s.providerType}
                          </span>
                          {s.tuitionCoverage && (
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                              Tuition Covered
                            </span>
                          )}
                          {s.livingCostCoverage && (
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
                              Living Stipend
                            </span>
                          )}
                          {s.travelAllowance && (
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-medium">
                              Travel Allowance
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 pt-1">
                          {s.scholarshipName}
                        </h3>
                        <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                          <span className="font-semibold text-slate-800">{s.providerName}</span>
                          <span>•</span>
                          <span>Funding: <strong className="text-emerald-700 font-bold">€{s.fundingAmount.toLocaleString()} ({s.paymentFrequency.toLowerCase()})</strong></span>
                          <span>•</span>
                          <span>Duration: {s.durationMonths} Months</span>
                          <span>•</span>
                          <span>Deadline: <strong className="text-slate-800">{s.applicationDeadline}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 uppercase font-bold block">Eligibility Match</span>
                          <span className="text-xl font-black text-emerald-700">{item.matchScore}%</span>
                        </div>

                        <button
                          onClick={() => handleToggleShortlist('SCHOLARSHIP', s.id, isSaved)}
                          className={`p-2.5 rounded-xl border transition-all ${
                            isSaved
                              ? 'bg-amber-50 border-amber-300 text-amber-700'
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-600 hover:bg-white'
                          }`}
                          title={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
                        >
                          <Star className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Grounded "Why am I seeing this?" Section */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Why am I seeing this recommendation?
                      </div>
                      <p className="text-slate-700 leading-relaxed">{item.whyAmISeeingThis}</p>
                    </div>

                    {/* Conditions Met & Evidence Needed */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {item.conditionsMet.length > 0 && (
                        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                          <span className="font-bold text-emerald-950 block">Conditions Met:</span>
                          <ul className="text-emerald-900 list-disc list-inside space-y-0.5">
                            {item.conditionsMet.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.evidenceNeeded.length > 0 && (
                        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                          <span className="font-bold text-amber-950 block">Required Proof / Certificates:</span>
                          <ul className="text-amber-900 list-disc list-inside space-y-0.5">
                            {item.evidenceNeeded.map((e, i) => (
                              <li key={i}>{e}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Official Portal Links */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <a
                        href={s.officialEligibilityUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                      >
                        Official Criteria Guidelines <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={s.officialApplicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                      >
                        Official Application Portal <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: APPLICATION ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Personalised Application Roadmap</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Tailored sequence of verified milestones for Indian students pursuing German higher education.
                </p>
              </div>
              <button
                onClick={handleRefreshRoadmap}
                className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-sync Milestones
              </button>
            </div>

            <div className="space-y-3">
              {roadmap.map((step) => (
                <div
                  key={step.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    step.isCompleted
                      ? 'bg-emerald-50/50 border-emerald-300'
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggleRoadmapStep(step.id, step.isCompleted)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        step.isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-slate-300 hover:border-emerald-600 text-transparent'
                      }`}
                    >
                      ✓
                    </button>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          Step {step.stepNumber} • {step.category.replace('_', ' ')}
                        </span>
                        {step.isMandatory && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                            Mandatory
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-sm font-bold ${
                          step.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-600">{step.description}</p>
                      {step.conditionalReason && (
                        <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-1">
                          <strong>Note:</strong> {step.conditionalReason}
                        </p>
                      )}
                    </div>

                    {step.actionUrl && (
                      <a
                        href={step.actionUrl}
                        target={step.actionUrl.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 flex-shrink-0"
                      >
                        Action <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SAVED SHORTLIST */}
        {activeTab === 'shortlist' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900">Your Saved Shortlist</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Quick access to degree programmes and scholarships you have shortlisted for upcoming intake deadlines.
              </p>
            </div>

            {shortlists.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                <Star className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700">No items shortlisted yet.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Click the star icon on any university programme or scholarship card to pin it here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shortlists.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {item.itemType}
                        </span>
                        <button
                          onClick={() => handleToggleShortlist(item.itemType, item.itemId, true)}
                          className="text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-2">{item.itemTitle}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{item.subtitle}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Deadline: {item.deadline || 'Consult portal'}</span>
                      <span className="text-[10px]">Saved {new Date(item.savedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: AI ADVISORY ASSISTANT */}
        {activeTab === 'assistant' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Grounded Admissions Intelligence
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                AI Advisory Assistant
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Answers grounded strictly in verified German university database records and your personal evaluation results. No fabricated cutoffs or invented URLs.
              </p>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                'Why did I match this top scholarship?',
                'How was my German grade calculated?',
                'What are the mandatory APS India requirements?',
                'Which programs allow English instruction?',
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(prompt)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Messages Log */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 min-h-[300px] max-h-[460px] overflow-y-auto space-y-4">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'btn-brand text-white'
                        : 'bg-white border border-slate-200 text-slate-900 shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                        <strong>Grounded Citations:</strong> {msg.sources.join('; ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-500 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    Querying verified database knowledge...
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about your eligibility, deadlines, or requirements..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-900"
              />
              <button
                onClick={() => handleSendChat()}
                disabled={chatLoading || !chatInput.trim()}
                className="px-5 py-2.5 rounded-xl btn-brand text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: PRIVACY & CONSENT */}
        {activeTab === 'privacy' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                <Shield className="w-4 h-4 text-emerald-600" />
                Data Protection & Privacy Safeguards
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Sensitive Profile Data & Consent Management
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                We adhere to strict data privacy principles. Sensitive scholarship attributes are stored with dedicated consent timestamps and never impact academic scoring.
              </p>
            </div>

            {privacyMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs">
                {privacyMessage}
              </div>
            )}

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900">What data is stored?</h4>
              <p className="text-slate-600">
                Your basic academic profile (CGPA, degree, language score) is stored to calculate university match compatibility. Any sensitive data submitted in Step 6 (e.g. disability accommodations, household income bracket, women in STEM eligibility) is tracked with consent and accessible only to you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-slate-200">
              <button
                onClick={handleWithdrawConsent}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Withdraw Sensitive Data Consent
              </button>
              <button
                onClick={handleDeleteSensitiveData}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-300 text-xs font-bold text-rose-800 hover:bg-rose-100 transition-colors"
              >
                Permanently Delete Sensitive Attributes
              </button>
            </div>
          </div>
        )}

        {/* WEIGHTS CONFIGURATION MODAL */}
        {showWeightsModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-lg space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Configure Compatibility Weights</h3>
                <button
                  onClick={() => setShowWeightsModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  ×
                </button>
              </div>
              <p className="text-xs text-slate-600">
                Adjust how much each factor influences your 0–100 compatibility ranking score.
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">Academic Compatibility</span>
                    <span className="font-bold text-slate-900">{weights.academic}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={weights.academic}
                    onChange={(e) => setWeights({ ...weights, academic: parseInt(e.target.value, 10) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">Subject Relevance</span>
                    <span className="font-bold text-slate-900">{weights.subject}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    value={weights.subject}
                    onChange={(e) => setWeights({ ...weights, subject: parseInt(e.target.value, 10) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">Language Readiness</span>
                    <span className="font-bold text-slate-900">{weights.language}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="30"
                    value={weights.language}
                    onChange={(e) => setWeights({ ...weights, language: parseInt(e.target.value, 10) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">Budget Compatibility</span>
                    <span className="font-bold text-slate-900">{weights.budget}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    value={weights.budget}
                    onChange={(e) => setWeights({ ...weights, budget: parseInt(e.target.value, 10) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">Location & Preferences</span>
                    <span className="font-bold text-slate-900">{weights.preferences}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={weights.preferences}
                    onChange={(e) => setWeights({ ...weights, preferences: parseInt(e.target.value, 10) })}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  onClick={() => setShowWeightsModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowWeightsModal(false);
                    fetchDashboardData(weights);
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-lg btn-brand text-white"
                >
                  Apply & Re-rank
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
