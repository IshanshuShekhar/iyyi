import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { StepHeader } from '../../components/StepHeader';
import { PaymentModal } from '../../components/PaymentModal';
import { AgentTracePanel } from '../../components/AgentTracePanel';
import { useAuth } from '../../context/AuthContext';
import { useJourney } from '../../context/JourneyContext';
import { ShieldCheck, Calendar, ArrowRight, UserCheck, CheckCircle2, Sparkles, PhoneCall , Compass, ExternalLink, Bot, Send} from 'lucide-react';

export const NextStepsPage: React.FC = () => {
  const { user } = useAuth();
  const { entitlements, refreshJourney } = useJourney();
  const navigate = useNavigate();

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isConsultantBooked, setIsConsultantBooked] = useState(false);
  const [isTraceOpen, setIsTraceOpen] = useState(false);

  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: 'Welcome to Premium! I can help you book your Frankfurt advisor call, track your APS fast-track status, or recommend which German learning modules to tackle first. How can I assist you today?' }
  ]);

  const handleChatSubmit = async (e: any) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userText = chatInput;
    const newMessages = [...chatMessages, { role: 'user', text: userText }];
    setChatMessages(newMessages as any);
    setChatInput('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/consultant/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          message: userText,
          history: chatMessages // Send previous messages for context
        })
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const errMsg = (errBody as any).message || res.statusText;
        throw new Error(errMsg);
      }
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'ai', text: (data as any).text }] as any);
    } catch (err: any) {
      const msg = err?.message === 'Unauthorized'
        ? 'Your session has expired. Please refresh the page and log in again.'
        : 'Connection failed. Please try again shortly.';
      setChatMessages(prev => [...prev, { role: 'ai', text: msg }] as any);
      console.error('[Chat] Error:', err);
    } finally {
      setIsTyping(false);
    }
  };


  const isPriorityUnlocked =
    entitlements.includes('EDUCARO_PREMIUM') ||
    entitlements.includes('PRIORITY_APS_CONSULTANT_REVIEW') ||
    entitlements.includes('CONSULTANT_REVIEW');

  return (
    <div className="min-h-screen bg-educaro-secondary flex flex-col text-gray-900">
      <Navbar onToggleTracePanel={() => setIsTraceOpen(!isTraceOpen)} isTraceOpen={isTraceOpen} />

      <StepHeader
        currentStepIndex={9}
        totalSteps={9}
        stepTitle="Premium & Advisor Handoff"
        stepSubtitle="Unlock priority fast-tracking or book a 1-on-1 strategy call with an expert."
        backRoute="/journey/payment"
        nextRoute="/"
        continueLabel="Return Home"
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Congratulations Banner */}
        <div className="bg-white rounded-[24px] border border-border p-10 shadow-elevated-rest text-center max-w-3xl mx-auto animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-brand flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            You have entered Premium
          </h2>
        </div>

        {/* Action Pathways Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 animate-fade-in-up-1">
          
          {/* Card 1: 1-on-1 Consultant Referral */}
          <div className="premium-card p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Educaro Senior Advisor Consultation</h3>
                  <p className="text-[11px] text-gray-600">Free 1-on-1 strategy video call</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Our Frankfurt & Bangalore advisors will review your qualification report, confirm tuition-free university shortlist, and outline visa timelines.
              </p>
              <div className="space-y-1.5 text-xs text-gray-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-brand font-bold">✓</span>
                  <span>Pre-digested AI summary shared with advisor</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-brand font-bold">✓</span>
                  <span>Zero repetition of entered information</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              {isConsultantBooked ? (
                <div className="p-3 badge-soft rounded-xl text-xs font-semibold text-center">
                  ✓ Advisory Call Requested! An advisor will reach out to {user?.email}.
                </div>
              ) : (
                <button
                  onClick={() => navigate('/consultant')}
                  className="btn-brand text-white w-full py-3 px-4 text-xs font-semibold flex justify-center items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Book Advisor Call →</span>
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Priority APS Fast-Track */}
          <div className="premium-card p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900">Priority APS Verification</h3>
                    <span className="badge-soft text-[10px]">
                      ₹1100
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600">Expedited German Academic Evaluation</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Fast-track your mandatory APS India certificate verification with dedicated document notarization checks and verified tracking.
              </p>
              <div className="space-y-1.5 text-xs text-gray-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-brand font-bold">✓</span>
                  <span>Persistent entitlement tied to account</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-brand font-bold">✓</span>
                  <span>Direct Indian UPI & Dynamic QR payment</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              {isPriorityUnlocked ? (
                <div className="p-3 badge-soft rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Educaro Premium Active (90 Days)</span>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-brand text-white w-full py-3.5 px-4 text-xs sm:text-sm font-bold"
                >
                  Unlock Educaro Premium via UPI / QR →
                </button>
              )}
            </div>
          </div>

          {/* Card 3: German Learning Path */}
          <div className="premium-card p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">German Learning Path</h3>
                  <p className="text-[11px] text-gray-600">Guided language readiness</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Access curated, free official German courses (like DW's Nicos Weg) and track your CEFR readiness based on your target pathway.
              </p>
              <div className="space-y-1.5 text-xs text-gray-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-brand font-bold">✓</span>
                  <span>Direct links to A1-B2 Goethe content</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-brand font-bold">✓</span>
                  <span>AI-estimated completion timeline</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/journey/german-learning-path')}
                  className="btn-brand text-white w-full py-2.5 px-4 text-xs font-bold flex justify-center items-center gap-2 mb-1"
                >
                  <Compass className="w-4 h-4" />
                  <span>View Your Learning Path</span>
                </button>
                <a
                  href="https://learngerman.dw.com/en/nicos-weg/c-36519789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-brand text-xs w-full py-2.5 px-4 flex justify-center items-center gap-2"
                >
                  <span>Launch Nicos Weg (DW)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.testdaf.de/de/teilnehmende/vorbereitung/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-brand text-xs w-full py-2.5 px-4 flex justify-center items-center gap-2"
                >
                  <span>TestDaF Preparation</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        
        {/* Premium Agent Chat Widget */}
        <div className="md:col-span-3 lg:col-span-3 premium-card flex flex-col h-[650px] overflow-hidden mt-6 mb-6 animate-fade-in-up-2">
          {/* Chat Header */}
          <div className="p-4 bg-gray-50 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  AI Consultant
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h3>
                <p className="text-[11px] text-gray-600">Online • Ask about advisor booking or next steps</p>
              </div>
            </div>
          </div>
          
          {/* Chat Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-brand text-white' : 'bg-emerald-100 text-brand'}`}>
                  {msg.role === 'user' ? <span className="text-white text-[10px]">U</span> : <Bot className="w-3 h-3 text-emerald-800" />}
                </div>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed border ${
                  msg.role === 'user' 
                    ? 'rounded-br-none bg-brand text-white border-brand' 
                    : 'rounded-bl-none bg-white text-gray-900 border-border shadow-xs'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-end gap-2 max-w-[85%]">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-brand flex items-center justify-center shrink-0">
                  <Bot className="w-3 h-3 text-emerald-800" />
                </div>
                <div className="p-3 rounded-2xl rounded-bl-none bg-white border border-border shadow-xs flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-gray-50 border-t border-border">
            <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about your premium benefits..."
                className="flex-1 px-4 py-2.5 rounded-full border border-border bg-white text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isTyping}
                className="btn-brand text-white p-2.5 rounded-full disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        </div>

        {/* View Full Consolidated Profile Link */}
        <div className="bg-white rounded-2xl border border-border p-6 flex items-center justify-between shadow-xs">
          <div>
            <h4 className="text-sm font-bold text-gray-900">Consolidated Candidate Details & Audit</h4>
            <p className="text-xs text-gray-600">
              Audit all profile fields with provenance tags, inline editing, and consultant lead scoring.
            </p>
          </div>
          <button
            onClick={() => navigate('/candidate-details')}
            className="btn-brand text-white text-xs inline-flex items-center gap-1.5"
          >
            <span>Open Candidate Details</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

      </main>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => {
          setIsPaymentOpen(false);
          refreshJourney();
        }}
      />

      <AgentTracePanel isOpen={isTraceOpen} onClose={() => setIsTraceOpen(false)} />
    </div>
  );
};
