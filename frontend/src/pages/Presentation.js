import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Video,
  Shield,
  Languages,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lock,
  Phone,
  Mail,
  Activity,
  Play,
  TrendingUp,
  Award,
  Zap,
  BarChart3,
  Sliders,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  X,
  FileCheck,
  Eye,
  Camera,
  Layers,
  Wrench,
  Clock,
  Car,
  Users,
  Check,
  AlertTriangle,
  FileSpreadsheet,
  Gauge,
  UserCheck,
  Briefcase,
  Smartphone,
  Info,
  RefreshCw,
  Compass,
  Cpu,
  Database,
  CheckCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import './Presentation.css';

export default function Presentation() {
  const navigate = useNavigate();
  const viewportRef = useRef(null);

  // Slide state (0 to 6)
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 'overview', title: 'Executive Overview', label: '01 Overview' },
    { id: 'rating', title: '4-Pillar Rating Formula', label: '02 Rating Formula' },
    { id: 'roles', title: 'Role-Based Portals', label: '03 Role Portals' },
    { id: 'demo', title: 'Live AI Simulator', label: '04 Live Demo' },
    { id: 'ai', title: 'AI Core Architecture', label: '05 AI Pipeline' },
    { id: 'roi', title: 'Dealership ROI Model', label: '06 ROI Model' },
    { id: 'faq', title: 'Launch & FAQ', label: '07 Launch & FAQ' },
  ];

  // Modals
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Navigate to slide
  const goToSlide = useCallback((index) => {
    if (index < 0 || index >= slides.length) return;
    setCurrentSlide(index);
    const targetElement = document.getElementById(slides[index].id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [slides]);

  const goToNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    }
  }, [currentSlide, goToSlide, slides.length]);

  const goToPrev = useCallback(() => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }, [currentSlide, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // Scroll listener to sync current slide indicator
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.55
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = slides.findIndex((s) => s.id === entry.target.id);
          if (index !== -1) {
            setCurrentSlide(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    slides.forEach((slide) => {
      const el = document.getElementById(slide.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [slides]);

  // Simulator State
  const samplePresets = [
    {
      id: 'bmw',
      label: '🚗 BMW 320d (Hindi Speech)',
      url: 'https://southasia.citnow.com/vpl/vpDDc-5CWy7',
      duration: '2m 16s (135.7s)',
      videoScore: '9.2 / 10',
      audioScore: '8.8 / 10',
      overallScore: '9.4 / 10',
      lang: 'Hindi (Devanagari)',
      transcript: 'नमस्ते सर, यह आपकी बीएमडब्ल्यू 320d का सर्विस वॉकअराउंड है। ब्रेक पैड की मोटाई 6mm बची है और टायर की स्थिति सामान्य है।',
      translation: 'Hello sir, this is the service walkaround for your BMW 320d. The brake pad thickness remaining is 6mm and tyre condition is within normal limits.',
      qaProtocol: [
        { name: 'Advisor & Vehicle Greeting', passed: true },
        { name: 'Registration & VIN Verification', passed: true },
        { name: 'Brake Disc & Pad Measurement', passed: true },
        { name: 'Underbody & Suspension Sweep', passed: true },
        { name: 'Recommended Work Summary', passed: true }
      ]
    },
    {
      id: 'audi',
      label: '🏎️ Audi A6 (Silent Walkaround)',
      url: 'https://southasia.citnow.com/vpl/vpX9q-2KL81',
      duration: '1m 48s (108.2s)',
      videoScore: '9.5 / 10',
      audioScore: '10.0 / 10 (Ambient)',
      overallScore: '9.1 / 10',
      lang: 'None (Silent Inspection)',
      transcript: 'No spoken dialogue detected (Pure visual walkaround).',
      translation: 'Since this is a visual inspection walkaround without spoken audio, translation is not required.',
      qaProtocol: [
        { name: 'Clean Lighting & Lens Stability', passed: true },
        { name: 'Tyre Tread Depth Visible', passed: true },
        { name: 'Front & Rear Bumper Inspection', passed: true },
        { name: 'Exhaust & Heat Shield Check', passed: true },
        { name: 'Full 360-Degree Coverage', passed: true }
      ]
    },
    {
      id: 'mercedes',
      label: '🚙 Mercedes C200 (English Technical)',
      url: 'https://southasia.citnow.com/vpl/vpMB3-7TY90',
      duration: '3m 04s (184.0s)',
      videoScore: '9.6 / 10',
      audioScore: '9.4 / 10',
      overallScore: '9.7 / 10',
      lang: 'English (UK / Indian Technical)',
      transcript: 'Good morning Mr. Patel, technician David here. Inspecting your C-Class front brake rotors. We noticed 15% wear on the offside tyre shoulder.',
      translation: 'Good morning Mr. Patel, technician David here. Inspecting your C-Class front brake rotors. We noticed 15% wear on the offside tyre shoulder.',
      qaProtocol: [
        { name: 'Professional Advisor Intro', passed: true },
        { name: 'Digital Tyre Gauge Evidence', passed: true },
        { name: 'Brake Fluid Moisture Test', passed: true },
        { name: 'Underbody Fluid Leak Check', passed: true },
        { name: 'Clear Customer Recommendations', passed: true }
      ]
    }
  ];

  const [selectedPreset, setSelectedPreset] = useState(samplePresets[0]);
  const [simUrl, setSimUrl] = useState(samplePresets[0].url);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [simProgress, setSimProgress] = useState(100);
  const [simResults, setSimResults] = useState(samplePresets[0]);

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setSimProgress(15);
    const interval = setInterval(() => {
      setSimProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setSimResults(selectedPreset);
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
          return 100;
        }
        return prev + 25;
      });
    }, 280);
  };

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setSimUrl(preset.url);
    setSimResults(preset);
  };

  // Roles State
  const [activeRole, setActiveRole] = useState('technician');

  const roleProfiles = {
    technician: {
      id: 'technician',
      title: 'Technician / Workshop Floor',
      pill: 'Workshop Bay Operations',
      pillBg: 'rgba(245, 158, 11, 0.15)',
      pillColor: '#f59e0b',
      icon: Wrench,
      email: 'tech.suresh@dealership.com',
      password: '••••••••••••',
      loginType: 'Workshop Mobile PIN / SSO',
      summary: 'Technicians record vehicle walkarounds directly on their smartphones or CitNow app. QualityLens provides instant feedback so videos are never rejected for dark footage or missing safety checks.',
      highlights: [
        'Instant mobile scorecard within 60s of upload',
        'Camera stability & lighting coaching (flags dark underbody shots)',
        'Speak naturally in Hindi, Tamil, Telugu, or Marathi — AI translates to clear English',
        'Personal monthly quality score & technician bonus leaderboard'
      ],
      mockHeader: 'Technician Station • Suresh Kumar (Bay 04)',
      mockMetrics: [
        { label: 'Videos Recorded Today', value: '6 / 6', sub: '100% QA Passed' },
        { label: 'Avg Quality Score', value: '9.3 / 10', sub: 'Top 5% in Workshop' }
      ],
      mockCardTitle: 'Latest Walkaround: BMW 3-Series (MH-02-CD-4512)',
      mockCardNotes: [
        '✔ Lighting: High (Underbody LED engaged)',
        '✔ Duration: 2m 16s (Optimal 90s - 3.5m window)',
        '💡 AI Coach: Great sweep across brake calipers! Hold camera steady for 3s on tyre tread for optimal customer clarity.'
      ]
    },
    advisor: {
      id: 'advisor',
      title: 'Service Advisor / Customer Front',
      pill: 'Customer Interaction & Approvals',
      pillBg: 'rgba(37, 99, 235, 0.15)',
      pillColor: '#60a5fa',
      icon: Users,
      email: 'advisor.rajesh@dealership.com',
      password: '••••••••••••',
      loginType: 'Service Desk Portal',
      summary: 'Service advisors review translated walkarounds in under 30 seconds, generate one-click WhatsApp customer summaries, and track customer repair approvals with zero language friction.',
      highlights: [
        'Real-time English translation of technician vernacular audio',
        'One-click WhatsApp summary card with verified repair recommendations',
        'Proven repair approval uplift: customers approve +28% more recommended work',
        'Direct link to original CitNow recording with timestamped checkpoints'
      ],
      mockHeader: 'Advisor Console • Rajesh Verma (Desk 02)',
      mockMetrics: [
        { label: 'Customer Videos Sent', value: '18 Today', sub: 'Avg view rate: 94%' },
        { label: 'Repair Approval Rate', value: '84.6%', sub: '+28% vs. manual audio' }
      ],
      mockCardTitle: 'Customer Ready: Audi A6 (DL-01-AX-9901) — Mr. Rohit Bansal',
      mockCardNotes: [
        '🌐 Translated Speech: "Rear brake pads at 15% life (3mm). Replacement strongly advised."',
        '📋 Protocol QA: 5/5 Checks Passed (Greeting & VIN matched)',
        '📲 Action: WhatsApp Summary Dispatched • Customer View Confirmed at 11:42 AM'
      ]
    },
    dealerAdmin: {
      id: 'dealerAdmin',
      title: 'Dealership GM & QA Manager',
      pill: 'Branch Quality Governance',
      pillBg: 'rgba(16, 185, 129, 0.15)',
      pillColor: '#34d399',
      icon: Shield,
      email: 'gm@landmarkmotors.com',
      password: '••••••••••••',
      loginType: 'Executive Dashboard SSO',
      summary: 'General Managers and QA heads achieve 100% automated video auditing across all service bays. Eliminates manual video spot-checking while catching protocol violations before customers see them.',
      highlights: [
        '100% video inspection coverage (replaces 5% manual spot-checking)',
        'Automated red-flag alerts for rushed (<60s) or dark underbody videos',
        'Technician quality leaderboards and monthly bonus grading',
        'Warranty & OEM protocol compliance audit exports in one click'
      ],
      mockHeader: 'Branch QA Dashboard • Landmark BMW Mumbai West',
      mockMetrics: [
        { label: 'Branch Compliance', value: '95.4%', sub: 'Target: 90% (Passed)' },
        { label: 'Flagged for Review', value: '2 of 48', sub: '1 dark footage, 1 rushed' }
      ],
      mockCardTitle: 'Dealership Video Stream (Live 48 Vehicles Today)',
      mockCardNotes: [
        'Top Technician: Suresh Kumar (Score: 9.6/10 across 14 videos)',
        'Flagged: Bay 07 (Underbody illumination below 40% threshold — alerted advisor)',
        'Export: Monthly Brand QA Audit Report Ready (PDF / Excel)'
      ]
    },
    superAdmin: {
      id: 'superAdmin',
      title: 'OEM / Group Super Admin',
      pill: 'Multi-Dealer Network Governance',
      pillBg: 'rgba(139, 92, 246, 0.15)',
      pillColor: '#a78bfa',
      icon: Activity,
      email: 'admin@focusengineeringapp.com',
      password: '••••••••••••',
      loginType: 'Master Enterprise Cloud',
      summary: 'Super Admins and dealer group principals oversee network-wide consistency across 10 to 50+ dealerships. Real-time multi-dealer benchmarks, automated sync engines, and system-wide AI configuration.',
      highlights: [
        'Cross-dealership benchmark matrix and compliance ranking',
        'Automated background CitNow API synchronization pipelines',
        'Configurable scoring thresholds tailored to OEM brand standards',
        'Multi-tenant dealer onboarding and technician access controls'
      ],
      mockHeader: 'Enterprise Command • 14 Dealer Outlets Across India & UK',
      mockMetrics: [
        { label: 'Total Walkarounds', value: '2,480 This Mo', sub: '+18% Month-on-Month' },
        { label: 'Network Avg QA', value: '9.4 / 10', sub: 'Target: 9.0 (Exceeded)' }
      ],
      mockCardTitle: 'OEM Brand Consistency Audit (October 2026)',
      mockCardNotes: [
        'Top Performing Outlet: Landmark Worli (Score: 9.7/10)',
        'Auto-Sync Engine: 24 background jobs active across 14 dealer portals',
        'System Status: All ML inference nodes operational (p99 latency: 42s)'
      ]
    }
  };

  // ROI Calculator State
  const [videoVolume, setVideoVolume] = useState(800);
  const [avgRoValue, setAvgRoValue] = useState(450);

  const calculateRoi = () => {
    const additionalApprovals = Math.round(videoVolume * 0.184);
    const annualRevenue = Math.round(additionalApprovals * avgRoValue * 12);
    const hoursSaved = Math.round((videoVolume * 10) / 60);
    return { additionalApprovals, annualRevenue, hoursSaved };
  };

  const roiStats = calculateRoi();

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How does QualityLens integrate with CitNow?',
      a: 'QualityLens integrates with CitNow through secure automated background webhooks and daily synchronization pipelines. As soon as a technician completes a video walkaround, the video URL is automatically received, analyzed by AI within 60 seconds, and displayed with scorecards and translations on your dealership console.'
    },
    {
      q: 'Which vernacular languages are supported for translation?',
      a: 'QualityLens supports zero-shot translation for Indian and regional vernacular languages including Hindi, Tamil, Telugu, Kannada, Gujarati, Marathi, Punjabi, Bengali, and Malayalam, translating spoken technical commentary into polished, professional English for customers and management.'
    },
    {
      q: 'Can dealerships customize the 4-pillar scoring formula?',
      a: 'Yes. While the standard 35% Visual / 15% Duration / 25% Audio / 25% Protocol formula is scientifically benchmarked across leading luxury brands (BMW, Audi, Mercedes), Super Admins and Dealer Group GMs can configure custom category weights, minimum acceptable thresholds, and manufacturer-specific compliance items.'
    },
    {
      q: 'How long does deployment take for a dealership network?',
      a: 'Because QualityLens is cloud-hosted and requires no hardware installation in workshop bays, single dealerships go live within 24 hours. Multi-outlet dealer groups with 10–50 locations typically onboard within 3 to 5 business days, including technician orientation.'
    }
  ];

  return (
    <div className="presentation-screen">
      {/* 1. TOP PROGRESS BAR */}
      <div
        className="presentation-progress-bar"
        style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
      />

      {/* 2. SLIM GLASS PRESENTATION HEADER */}
      <header className="presentation-header">
        <div className="header-left">
          <div className="brand-badge-box" onClick={() => goToSlide(0)}>
            <img src="/qualitylens-logo.png" alt="QualityLens" className="brand-logo" />
            <span className="brand-edition-tag">ENTERPRISE KEYNOTE</span>
          </div>
          <div className="partner-divider" />
          <div className="citnow-badge">
            <span className="citnow-dot"></span>
            <span>CitNow Certified QA Engine</span>
          </div>
        </div>

        {/* Center Current Slide Pill */}
        <div className="header-center">
          <div className="slide-counter-chip">
            <span className="slide-number">SLIDE 0{currentSlide + 1} / 0{slides.length}</span>
            <span className="slide-separator">•</span>
            <span className="slide-current-title">{slides[currentSlide].title}</span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="header-right">
          <button className="btn-demo-glow" onClick={() => setDemoModalOpen(true)}>
            <Sparkles size={14} /> Book Demo
          </button>
          <button className="btn-portal-pill" onClick={() => navigate('/login')}>
            <Lock size={13} /> Portal Login
          </button>
        </div>
      </header>

      {/* 3. MAIN PRESENTATION VIEWPORT (Scroll-Snap Container) */}
      <main className="slides-viewport" ref={viewportRef}>
        {/* ============================================================== */}
        {/* SLIDE 1: EXECUTIVE OVERVIEW & VISION */}
        {/* ============================================================== */}
        <section id="overview" className="keynote-slide slide-hero">
          <div className="slide-bg-glow glow-blue" />
          <div className="slide-content">
            <div className="hero-split-grid">
              {/* Left Column: Vision & Value Props */}
              <div className="hero-text-col">
                <div className="hero-pill-badge">
                  <Sparkles size={14} className="sparkle-icon" />
                  <span>ALL-IN-ONE AUTOMOTIVE VIDEO QA PLATFORM</span>
                </div>

                <h1 className="hero-main-heading">
                  Complete &amp; Intelligent <br />
                  <span className="gradient-text">Workshop Video QA</span> Software
                </h1>

                <p className="hero-description">
                  Designed specifically for premium automotive dealership networks to automatically
                  audit technician CitNow videos, translate vernacular speech into clear English, evaluate
                  camera stability, and score protocol compliance in one seamless platform.
                </p>

                {/* 4 Feature Badges */}
                <div className="hero-feature-chips">
                  <div className="feature-chip">
                    <CheckCircle2 size={16} className="chip-check" />
                    <span>CitNow Direct Video Link Sync</span>
                  </div>
                  <div className="feature-chip">
                    <CheckCircle2 size={16} className="chip-check" />
                    <span>Zero-Shot Vernacular Translation</span>
                  </div>
                  <div className="feature-chip">
                    <CheckCircle2 size={16} className="chip-check" />
                    <span>5-Point Manufacturer QA Compliance</span>
                  </div>
                  <div className="feature-chip">
                    <CheckCircle2 size={16} className="chip-check" />
                    <span>Multi-Dealership Network Benchmarks</span>
                  </div>
                </div>

                {/* Hero CTAs */}
                <div className="hero-cta-group">
                  <button className="btn-primary-glow" onClick={goToNext}>
                    How Rating Works <ArrowRight size={16} />
                  </button>
                  <button className="btn-secondary-glass" onClick={() => goToSlide(3)}>
                    <Play size={15} fill="currentColor" /> Launch Live Preview
                  </button>
                </div>
              </div>

              {/* Right Column: 3D Angled Glass Console Mockup */}
              <div className="hero-graphic-col">
                <div className="glass-console-window">
                  {/* Console Title Bar */}
                  <div className="console-window-bar">
                    <div className="window-dots">
                      <span className="dot red" />
                      <span className="dot yellow" />
                      <span className="dot green" />
                    </div>
                    <div className="window-title">QualityLens • Dealership Inspector Console</div>
                    <div className="window-status">
                      <span className="pulse-dot" /> Live Sync
                    </div>
                  </div>

                  {/* Console Body */}
                  <div className="console-body">
                    {/* Top KPI Metrics */}
                    <div className="console-kpi-row">
                      <div className="console-kpi-card">
                        <span className="kpi-label">Videos Analyzed</span>
                        <div className="kpi-number">2,480</div>
                        <span className="kpi-tag positive">
                          <TrendingUp size={12} /> 100% QA Audited
                        </span>
                      </div>
                      <div className="console-kpi-card">
                        <span className="kpi-label">Average QA Score</span>
                        <div className="kpi-number">
                          9.4<span className="kpi-sub">/10</span>
                        </div>
                        <span className="kpi-tag blue">
                          <Award size={12} /> 14 Dealerships Active
                        </span>
                      </div>
                    </div>

                    {/* Live Stream List */}
                    <div className="console-feed-title">
                      <span>Real-Time Inspection Feed</span>
                      <span className="feed-counter">Live Queue Active</span>
                    </div>

                    <div className="console-feed-cards">
                      <div className="feed-row-item">
                        <div className="feed-brand-badge bmw">BMW</div>
                        <div className="feed-info">
                          <div className="feed-title">BMW 320d: Brake &amp; Disc Walkaround</div>
                          <div className="feed-meta">Tech: Suresh Kumar • 2m 16s • Hindi → English</div>
                        </div>
                        <div className="feed-score-badge high">9.4 / 10</div>
                      </div>

                      <div className="feed-row-item">
                        <div className="feed-brand-badge audi">AUDI</div>
                        <div className="feed-info">
                          <div className="feed-title">Audi Q5: Suspension &amp; Exhaust Check</div>
                          <div className="feed-meta">Tech: Rajesh V. • Pure Visual • 1080p 60fps</div>
                        </div>
                        <div className="feed-score-badge high">9.8 / 10</div>
                      </div>

                      <div className="feed-row-item">
                        <div className="feed-brand-badge mb">MB</div>
                        <div className="feed-info">
                          <div className="feed-title">Mercedes C200: Tyre Tread Depth</div>
                          <div className="feed-meta">Tech: David P. • Audio: 9.6/10 • QA Passed</div>
                        </div>
                        <div className="feed-score-badge high">9.2 / 10</div>
                      </div>
                    </div>

                    {/* Console Action Prompt */}
                    <button className="console-footer-cta" onClick={goToNext}>
                      View Exact AI Rating Formula <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Floating Floating Trust Chip */}
                <div className="floating-stat-card">
                  <div className="stat-icon-wrap">
                    <Shield size={18} />
                  </div>
                  <div>
                    <div className="stat-title">100% Automated QA Coverage</div>
                    <div className="stat-desc">Audited CitNow Protocol Sequences</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Next Trigger */}
            <div className="slide-next-prompt" onClick={goToNext}>
              <span>Next: Scientific Video Rating Formula</span>
              <ChevronDown size={16} className="bounce-arrow" />
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SLIDE 2: HOW VIDEO RATING WORKS (4-PILLAR FORMULA) */}
        {/* ============================================================== */}
        <section id="rating" className="keynote-slide slide-rating">
          <div className="slide-bg-glow glow-cyan" />
          <div className="slide-content">
            <div className="slide-header-box">
              <div className="slide-pill">
                <Gauge size={14} />
                <span>SCIENTIFIC EVALUATION</span>
              </div>
              <h2 className="slide-heading">How Video Rating Works</h2>
              <p className="slide-subheading">
                Every workshop walkaround video is automatically evaluated against 4 weighted pillars using
                computer vision, acoustic filtering, and natural language processing.
              </p>
            </div>

            {/* Composite Mathematical Formula Banner */}
            <div className="formula-banner-card">
              <div className="formula-title">THE QUALITYLENS COMPOSITE SCORING FORMULA</div>
              <div className="formula-math">
                <span className="formula-highlight">Overall Score</span> =
                (<span className="formula-term visuals">0.35 × Visuals</span>) +
                (<span className="formula-term duration">0.15 × Duration</span>) +
                (<span className="formula-term audio">0.25 × Audio/Translation</span>) +
                (<span className="formula-term protocol">0.25 × Protocol</span>)
              </div>
              <div className="formula-caption">Normalized on a strict 0.0 to 10.0 scale for OEM brand governance.</div>
            </div>

            {/* 4 Graphic Pillar Cards Grid */}
            <div className="four-pillars-grid">
              {/* Pillar 1 */}
              <div className="pillar-card border-visuals">
                <div className="pillar-header">
                  <div className="pillar-icon-box bg-visuals">
                    <Camera size={20} />
                  </div>
                  <div className="pillar-weight-badge badge-visuals">35% Weight</div>
                </div>
                <h3 className="pillar-title">1. Visual Quality &amp; Evidence</h3>
                <p className="pillar-desc">
                  Computer vision verifies camera stability, lighting adequacy, 1080p resolution, and clear inspection of brake discs, tyre tread, and underbody components.
                </p>
                <div className="pillar-checklist">
                  <div className="check-row"><Check size={14} className="text-emerald" /> Motion Blur &amp; Shake Detection</div>
                  <div className="check-row"><Check size={14} className="text-emerald" /> Underbody Dark Footage Detection</div>
                  <div className="check-row"><Check size={14} className="text-emerald" /> Critical Component Frame Verification</div>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="pillar-card border-duration">
                <div className="pillar-header">
                  <div className="pillar-icon-box bg-duration">
                    <Clock size={20} />
                  </div>
                  <div className="pillar-weight-badge badge-duration">15% Weight</div>
                </div>
                <h3 className="pillar-title">2. Pacing &amp; Video Duration</h3>
                <p className="pillar-desc">
                  Evaluates total walkaround length against OEM optimums (target: 90s to 180s). Penalizes rushed under-60s sweeps and excessively long videos that cause customer drop-off.
                </p>
                <div className="pillar-checklist">
                  <div className="check-row"><Check size={14} className="text-emerald" /> Optimal 90s–180s Benchmark</div>
                  <div className="check-row"><Check size={14} className="text-emerald" /> Rushed Video Red Flag Alert</div>
                  <div className="check-row"><Check size={14} className="text-emerald" /> Pacing Consistency Scoring</div>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="pillar-card border-audio">
                <div className="pillar-header">
                  <div className="pillar-icon-box bg-audio">
                    <Languages size={20} />
                  </div>
                  <div className="pillar-weight-badge badge-audio">25% Weight</div>
                </div>
                <h3 className="pillar-title">3. Audio &amp; Vernacular Translation</h3>
                <p className="pillar-desc">
                  Acoustic filtering separates workshop pneumatic noise from technician voice. Zero-shot Whisper AI translates vernacular speech (Hindi, Tamil, Gujarati) into clean English.
                </p>
                <div className="pillar-checklist">
                  <div className="check-row"><Check size={14} className="text-emerald" /> Background Noise &amp; Clatter Filter</div>
                  <div className="check-row"><Check size={14} className="text-emerald" /> Zero-Shot Regional Translation</div>
                  <div className="check-row"><Check size={14} className="text-emerald" /> Professional Tone &amp; Clarity Audit</div>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="pillar-card border-protocol">
                <div className="pillar-header">
                  <div className="pillar-icon-box bg-protocol">
                    <FileCheck size={20} />
                  </div>
                  <div className="pillar-weight-badge badge-protocol">25% Weight</div>
                </div>
                <h3 className="pillar-title">4. Manufacturer QA Compliance</h3>
                <p className="pillar-desc">
                  Scores adherence to OEM brand protocol: Advisor intro, vehicle registration &amp; VIN check, clear safety tyre wear callouts, and structured recommendations.
                </p>
                <div className="pillar-checklist">
                  <div className="check-row"><Check size={14} className="text-emerald" /> Customer Greeting &amp; VIN Match</div>
                  <div className="check-row"><Check size={14} className="text-emerald" /> Red / Amber / Green Wear Callouts</div>
                  <div className="check-row"><Check size={14} className="text-emerald" /> Structured Next-Steps Conclusion</div>
                </div>
              </div>
            </div>

            {/* Bottom Next Trigger */}
            <div className="slide-next-prompt" onClick={goToNext}>
              <span>Next: Role-Based Workshop Portals</span>
              <ChevronDown size={16} className="bounce-arrow" />
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SLIDE 3: ROLE-BASED PORTALS (HOW IT WORKS FOR EACH ROLE) */}
        {/* ============================================================== */}
        <section id="roles" className="keynote-slide slide-roles">
          <div className="slide-bg-glow glow-purple" />
          <div className="slide-content">
            <div className="slide-header-box">
              <div className="slide-pill">
                <Users size={14} />
                <span>ROLE-BASED WORKSPACES</span>
              </div>
              <h2 className="slide-heading">Dedicated Portals for Every Stakeholder</h2>
              <p className="slide-subheading">
                QualityLens delivers tailored, role-specific experiences from workshop floor technicians up to dealership General Managers and Group Super Admins.
              </p>
            </div>

            {/* Role Selector Tabs */}
            <div className="role-nav-pills">
              <button
                className={`role-tab-btn ${activeRole === 'technician' ? 'active' : ''}`}
                onClick={() => setActiveRole('technician')}
              >
                <Wrench size={16} /> Technician / Floor
              </button>
              <button
                className={`role-tab-btn ${activeRole === 'advisor' ? 'active' : ''}`}
                onClick={() => setActiveRole('advisor')}
              >
                <Users size={16} /> Service Advisor
              </button>
              <button
                className={`role-tab-btn ${activeRole === 'dealerAdmin' ? 'active' : ''}`}
                onClick={() => setActiveRole('dealerAdmin')}
              >
                <Shield size={16} /> Dealership GM &amp; QA
              </button>
              <button
                className={`role-tab-btn ${activeRole === 'superAdmin' ? 'active' : ''}`}
                onClick={() => setActiveRole('superAdmin')}
              >
                <Activity size={16} /> Group Super Admin
              </button>
            </div>

            {/* Active Role Showcase Card */}
            <div className="role-display-grid">
              {/* Left Column: Role Details & Value */}
              <div className="role-details-panel">
                <div
                  className="role-badge-pill"
                  style={{
                    background: roleProfiles[activeRole].pillBg,
                    color: roleProfiles[activeRole].pillColor
                  }}
                >
                  {roleProfiles[activeRole].pill}
                </div>

                <h3 className="role-main-title">{roleProfiles[activeRole].title}</h3>
                <p className="role-summary-text">{roleProfiles[activeRole].summary}</p>

                <div className="role-features-list">
                  {roleProfiles[activeRole].highlights.map((highlight, idx) => (
                    <div key={idx} className="role-highlight-item">
                      <CheckCircle2 size={16} className="text-emerald flex-shrink" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Login Spec Pill */}
                <div className="role-login-hint">
                  <Lock size={14} />
                  <span>Access Mode: <strong>{roleProfiles[activeRole].loginType}</strong></span>
                </div>
              </div>

              {/* Right Column: Simulated Live UI Card for that role */}
              <div className="role-mockup-panel">
                <div className="mockup-window-frame">
                  <div className="mockup-header-bar">
                    <div className="window-dots">
                      <span className="dot red" />
                      <span className="dot yellow" />
                      <span className="dot green" />
                    </div>
                    <span className="mockup-title">{roleProfiles[activeRole].mockHeader}</span>
                    <span className="mockup-status-live">● Live</span>
                  </div>

                  <div className="mockup-content">
                    {/* Simulated KPI Metrics */}
                    <div className="mockup-metrics-row">
                      {roleProfiles[activeRole].mockMetrics.map((metric, i) => (
                        <div key={i} className="mockup-metric-card">
                          <span className="mockup-metric-label">{metric.label}</span>
                          <span className="mockup-metric-val">{metric.value}</span>
                          <span className="mockup-metric-sub">{metric.sub}</span>
                        </div>
                      ))}
                    </div>

                    {/* Simulated Activity Stream */}
                    <div className="mockup-card-body">
                      <div className="mockup-card-title">{roleProfiles[activeRole].mockCardTitle}</div>
                      <div className="mockup-notes-list">
                        {roleProfiles[activeRole].mockCardNotes.map((note, idx) => (
                          <div key={idx} className="mockup-note-row">
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mockup Action Button */}
                    <button className="mockup-action-btn" onClick={() => navigate('/login')}>
                      Enter {roleProfiles[activeRole].title} Portal <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Next Trigger */}
            <div className="slide-next-prompt" onClick={goToNext}>
              <span>Next: Live Interactive Video QA Simulator</span>
              <ChevronDown size={16} className="bounce-arrow" />
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SLIDE 4: LIVE INTERACTIVE VIDEO QA SIMULATOR */}
        {/* ============================================================== */}
        <section id="demo" className="keynote-slide slide-demo">
          <div className="slide-bg-glow glow-blue" />
          <div className="slide-content">
            <div className="slide-header-box">
              <div className="slide-pill">
                <Sparkles size={14} />
                <span>INTERACTIVE TESTBENCH</span>
              </div>
              <h2 className="slide-heading">Experience Live AI Video QA</h2>
              <p className="slide-subheading">
                Test how QualityLens analyzes sample CitNow workshop walkarounds with vernacular speech translation, video quality scoring, and compliance checking.
              </p>
            </div>

            {/* Vehicle Preset Selector */}
            <div className="preset-selector-row">
              {samplePresets.map((preset) => (
                <button
                  key={preset.id}
                  className={`preset-btn ${selectedPreset.id === preset.id ? 'active' : ''}`}
                  onClick={() => handleSelectPreset(preset)}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Interactive Simulator Card */}
            <div className="simulator-grid-card">
              {/* Left Column: Simulated Video Player & Audio Wave */}
              <div className="sim-player-col">
                <div className="sim-player-window">
                  <div className="sim-player-header">
                    <span className="player-brand-tag">{selectedPreset.label}</span>
                    <span className="player-res-tag">1080p 60fps</span>
                  </div>

                  {/* Player Preview Canvas */}
                  <div className="sim-video-canvas">
                    <div className="sim-center-play">
                      <Play size={36} fill="#ffffff" />
                    </div>
                    <div className="sim-citnow-watermark">
                      <img src="/citnow-logo.png" alt="CitNow" />
                    </div>
                    {/* Simulated Waveform Bar */}
                    <div className="audio-wave-anim">
                      <span className="wave-bar bar-1"></span>
                      <span className="wave-bar bar-2"></span>
                      <span className="wave-bar bar-3"></span>
                      <span className="wave-bar bar-4"></span>
                      <span className="wave-bar bar-5"></span>
                      <span className="wave-bar bar-6"></span>
                      <span className="wave-bar bar-7"></span>
                    </div>
                  </div>

                  {/* Player Meta Info */}
                  <div className="sim-player-meta">
                    <div className="meta-item">
                      <Clock size={14} />
                      <span>Duration: {selectedPreset.duration}</span>
                    </div>
                    <div className="meta-item">
                      <Languages size={14} />
                      <span>Detected: {selectedPreset.lang}</span>
                    </div>
                  </div>

                  {/* Run Analysis Trigger Button */}
                  <button
                    className="btn-run-sim"
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" /> Processing AI Video &amp; Audio ({simProgress}%)...
                      </>
                    ) : (
                      <>
                        <Zap size={16} /> Re-Analyze This Walkaround
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: AI Live Results & Translation */}
              <div className="sim-results-col">
                {/* Top Scores Strip */}
                <div className="sim-scores-strip">
                  <div className="sim-score-card">
                    <span className="sim-score-title">Overall QA Score</span>
                    <span className="sim-score-val emerald">{simResults.overallScore}</span>
                    <span className="sim-score-status">PASS (Target: 8.5)</span>
                  </div>
                  <div className="sim-score-card">
                    <span className="sim-score-title">Visual Evidence</span>
                    <span className="sim-score-val cyan">{simResults.videoScore}</span>
                    <span className="sim-score-status">High Clarity</span>
                  </div>
                  <div className="sim-score-card">
                    <span className="sim-score-title">Acoustic Clarity</span>
                    <span className="sim-score-val blue">{simResults.audioScore}</span>
                    <span className="sim-score-status">Clean Voice</span>
                  </div>
                </div>

                {/* Translation & Transcript Box */}
                <div className="sim-translation-box">
                  <div className="box-tab-header">
                    <span className="box-title">
                      <Languages size={14} /> Zero-Shot Vernacular Speech Translation
                    </span>
                    <span className="lang-tag">{simResults.lang}</span>
                  </div>

                  <div className="transcription-pane">
                    <div className="transcript-label">Technician Spoken Audio:</div>
                    <div className="transcript-content">"{simResults.transcript}"</div>
                  </div>

                  <div className="translation-pane">
                    <div className="transcript-label">Instant English Translation:</div>
                    <div className="translation-content">"{simResults.translation}"</div>
                  </div>
                </div>

                {/* Protocol Checklist */}
                <div className="sim-protocol-box">
                  <div className="protocol-title">
                    <FileCheck size={14} /> 5-Point Manufacturer Protocol Compliance
                  </div>
                  <div className="protocol-checklist-grid">
                    {simResults.qaProtocol.map((item, index) => (
                      <div key={index} className="protocol-item-row">
                        <CheckCircle2 size={15} className="text-emerald" />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Next Trigger */}
            <div className="slide-next-prompt" onClick={goToNext}>
              <span>Next: Enterprise AI Core Architecture</span>
              <ChevronDown size={16} className="bounce-arrow" />
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SLIDE 5: ENTERPRISE AI CORE ARCHITECTURE */}
        {/* ============================================================== */}
        <section id="ai" className="keynote-slide slide-ai">
          <div className="slide-bg-glow glow-cyan" />
          <div className="slide-content">
            <div className="slide-header-box">
              <div className="slide-pill">
                <Cpu size={14} />
                <span>DEEP LEARNING PIPELINE</span>
              </div>
              <h2 className="slide-heading">Enterprise AI Core Architecture</h2>
              <p className="slide-subheading">
                Scalable, multi-tenant computer vision and acoustic speech processing pipeline engineered for high-throughput automotive dealership networks.
              </p>
            </div>

            {/* 5-Step Connected Flowchart */}
            <div className="pipeline-flow-wrapper">
              <div className="pipeline-steps-grid">
                {/* Step 1 */}
                <div className="pipeline-step-card">
                  <div className="step-number-badge">01</div>
                  <div className="step-icon-box">
                    <Video size={22} />
                  </div>
                  <h4 className="step-title">CitNow Webhook Ingestion</h4>
                  <p className="step-desc">
                    Auto-receives technician walkaround video URLs via secure webhooks without modifying technician habits.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="pipeline-step-card">
                  <div className="step-number-badge">02</div>
                  <div className="step-icon-box">
                    <Languages size={22} />
                  </div>
                  <h4 className="step-title">Whisper Speech AI</h4>
                  <p className="step-desc">
                    Deep acoustic filtering strips workshop bay clatter and translates vernacular Hindi, Tamil, and Gujarati into English.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="pipeline-step-card">
                  <div className="step-number-badge">03</div>
                  <div className="step-icon-box">
                    <Camera size={22} />
                  </div>
                  <h4 className="step-title">Computer Vision QA</h4>
                  <p className="step-desc">
                    Analyzes frame clarity, optical flow motion blur, brake caliper exposure, and dark underbody illumination.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="pipeline-step-card">
                  <div className="step-number-badge">04</div>
                  <div className="step-icon-box">
                    <Shield size={22} />
                  </div>
                  <h4 className="step-title">Protocol Engine</h4>
                  <p className="step-desc">
                    Checks advisor greeting, VIN match, Red/Amber/Green tyre wear callouts, and safety component verification.
                  </p>
                </div>

                {/* Step 5 */}
                <div className="pipeline-step-card">
                  <div className="step-number-badge">05</div>
                  <div className="step-icon-box">
                    <BarChart3 size={22} />
                  </div>
                  <h4 className="step-title">Executive Delivery</h4>
                  <p className="step-desc">
                    Real-time scorecards, WhatsApp customer summaries, and dealership group executive analytics dashboards.
                  </p>
                </div>
              </div>
            </div>

            {/* Architecture Highlights Strip */}
            <div className="architecture-specs-strip">
              <div className="spec-card">
                <span className="spec-val">&lt; 60s</span>
                <span className="spec-label">P99 Video Analysis Latency</span>
              </div>
              <div className="spec-card">
                <span className="spec-val">100%</span>
                <span className="spec-label">Automated Video QA Coverage</span>
              </div>
              <div className="spec-card">
                <span className="spec-val">Zero-Shot</span>
                <span className="spec-label">Regional Dialect Translation</span>
              </div>
              <div className="spec-card">
                <span className="spec-val">99.9%</span>
                <span className="spec-label">Enterprise Cloud Availability</span>
              </div>
            </div>

            {/* Bottom Next Trigger */}
            <div className="slide-next-prompt" onClick={goToNext}>
              <span>Next: Dealership ROI &amp; Financial Impact Model</span>
              <ChevronDown size={16} className="bounce-arrow" />
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SLIDE 6: DEALERSHIP ROI & FINANCIAL MODEL */}
        {/* ============================================================== */}
        <section id="roi" className="keynote-slide slide-roi">
          <div className="slide-bg-glow glow-emerald" />
          <div className="slide-content">
            <div className="slide-header-box">
              <div className="slide-pill">
                <TrendingUp size={14} />
                <span>BUSINESS IMPACT</span>
              </div>
              <h2 className="slide-heading">Dealership ROI &amp; Revenue Recovered</h2>
              <p className="slide-subheading">
                Calculate the measurable financial return of 100% video inspection coverage and vernacular speech translation for your dealership.
              </p>
            </div>

            {/* Interactive Calculator Panel */}
            <div className="roi-calculator-grid">
              {/* Left Column: Sliders */}
              <div className="roi-inputs-col">
                <h3 className="inputs-heading">Interactive Dealership Inputs</h3>

                {/* Slider 1: Monthly Walkaround Videos */}
                <div className="slider-group">
                  <div className="slider-label-row">
                    <span className="slider-label">Monthly Walkaround Videos:</span>
                    <span className="slider-val-badge">{videoVolume.toLocaleString()} Videos</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="50"
                    value={videoVolume}
                    onChange={(e) => setVideoVolume(Number(e.target.value))}
                    className="range-slider"
                  />
                  <div className="slider-ticks">
                    <span>100</span>
                    <span>1,500</span>
                    <span>3,000</span>
                    <span>5,000</span>
                  </div>
                </div>

                {/* Slider 2: Average RO Value */}
                <div className="slider-group">
                  <div className="slider-label-row">
                    <span className="slider-label">Average Repair Order (RO) Value:</span>
                    <span className="slider-val-badge">£{avgRoValue} / RO</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="1500"
                    step="25"
                    value={avgRoValue}
                    onChange={(e) => setAvgRoValue(Number(e.target.value))}
                    className="range-slider"
                  />
                  <div className="slider-ticks">
                    <span>£150</span>
                    <span>£500</span>
                    <span>£1,000</span>
                    <span>£1,500</span>
                  </div>
                </div>

                {/* Re-calculate Button with Confetti */}
                <button
                  className="btn-roi-confetti"
                  onClick={() => confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } })}
                >
                  <Sparkles size={16} /> Recalculate Dealership ROI 🎉
                </button>
              </div>

              {/* Right Column: Output KPI Cards */}
              <div className="roi-outputs-col">
                <div className="roi-result-card featured">
                  <span className="result-card-subtitle">Estimated Annual Revenue Recovered</span>
                  <div className="result-card-bigval">£{roiStats.annualRevenue.toLocaleString()}</div>
                  <span className="result-card-note">
                    From +18.4% higher customer video approval rates on recommended brake &amp; tyre work.
                  </span>
                </div>

                <div className="roi-sub-results-row">
                  <div className="roi-sub-card">
                    <span className="sub-card-label">Extra Repair Approvals</span>
                    <span className="sub-card-val">+{roiStats.additionalApprovals} / mo</span>
                    <span className="sub-card-sub">Verified customer conversions</span>
                  </div>
                  <div className="roi-sub-card">
                    <span className="sub-card-label">Workshop Hours Saved</span>
                    <span className="sub-card-val">{roiStats.hoursSaved} hrs / mo</span>
                    <span className="sub-card-sub">Zero manual spot-checks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Next Trigger */}
            <div className="slide-next-prompt" onClick={goToNext}>
              <span>Next: Enterprise FAQ &amp; Launch Console</span>
              <ChevronDown size={16} className="bounce-arrow" />
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SLIDE 7: ENTERPRISE FAQ & LAUNCH CONSOLE */}
        {/* ============================================================== */}
        <section id="faq" className="keynote-slide slide-faq">
          <div className="slide-bg-glow glow-blue" />
          <div className="slide-content">
            <div className="slide-header-box">
              <div className="slide-pill">
                <HelpCircle size={14} />
                <span>ENTERPRISE ONBOARDING</span>
              </div>
              <h2 className="slide-heading">Frequently Asked Questions &amp; Launch</h2>
              <p className="slide-subheading">
                Everything you need to know about deploying QualityLens across your dealership bays today.
              </p>
            </div>

            {/* 2-Column FAQ & Launch Card */}
            <div className="faq-launch-grid">
              {/* Left Column: Interactive Accordion FAQs */}
              <div className="faq-accordion-col">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className={`faq-item-card ${openFaq === i ? 'open' : ''}`}
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  >
                    <div className="faq-question-row">
                      <span className="faq-question-text">{faq.q}</span>
                      <div className="faq-chevron">
                        {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                    {openFaq === i && (
                      <div className="faq-answer-row">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Column: Launch QualityLens Card */}
              <div className="launch-action-col">
                <div className="launch-card-glass">
                  <div className="launch-logo-wrap">
                    <img src="/qualitylens-logo.png" alt="QualityLens" className="launch-logo" />
                  </div>

                  <h3 className="launch-title">Ready to Elevate Workshop Video Quality?</h3>
                  <p className="launch-desc">
                    Schedule a personalized 15-minute walkthrough of the QualityLens Dealership Inspector Console or access your existing portal.
                  </p>

                  <div className="launch-btn-group">
                    <button className="btn-launch-demo" onClick={() => setDemoModalOpen(true)}>
                      <Sparkles size={16} /> Book Live Dealership Demo
                    </button>
                    <button className="btn-launch-portal" onClick={() => navigate('/login')}>
                      <Lock size={15} /> Launch QualityLens Portal
                    </button>
                  </div>

                  {/* Direct Contact Links */}
                  <div className="launch-contact-strip">
                    <a href="tel:+919840012345" className="contact-link">
                      <Phone size={14} /> +91 98400 12345
                    </a>
                    <span className="contact-sep">•</span>
                    <a href="mailto:support@qualitylens.ai" className="contact-link">
                      <Mail size={14} /> support@qualitylens.ai
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Back to Top */}
            <div className="slide-back-prompt" onClick={() => goToSlide(0)}>
              <ChevronUp size={16} className="bounce-arrow-up" />
              <span>Back to First Slide (Overview)</span>
            </div>
          </div>
        </section>
      </main>

      {/* 4. FLOATING GRAPHIC PRESENTATION CONTROLLER (BOTTOM DOCK) */}
      <div className="presentation-dock">
        <button
          className="dock-nav-btn prev"
          onClick={goToPrev}
          disabled={currentSlide === 0}
          title="Previous Slide (Arrow Up / Left)"
        >
          <ChevronLeft size={18} /> Prev
        </button>

        {/* Slide Indicator Pills */}
        <div className="dock-pills-list">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              className={`dock-pill-item ${currentSlide === idx ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
              title={s.title}
            >
              <span className="dock-dot" />
              <span className="dock-label">{s.label}</span>
            </button>
          ))}
        </div>

        <button
          className="dock-nav-btn next"
          onClick={goToNext}
          disabled={currentSlide === slides.length - 1}
          title="Next Slide (Arrow Down / Right / Space)"
        >
          Next <ChevronRight size={18} />
        </button>
      </div>

      {/* 5. BOOK DEMO MODAL */}
      {demoModalOpen && (
        <div className="modal-backdrop" onClick={() => setDemoModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <Sparkles size={18} className="text-blue" />
                <h3>Book Dealership VIP Demo</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setDemoModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-intro">
                Schedule a 15-minute live screen walkthrough with an automotive AI specialist. We will benchmark 10 of your actual CitNow videos.
              </p>
              <div className="modal-form">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" placeholder="e.g. Vikram Mehta" />

                <label className="form-label">Dealership Name &amp; Brand</label>
                <input type="text" className="form-input" placeholder="e.g. Landmark BMW / Audi West" />

                <label className="form-label">Official Email</label>
                <input type="email" className="form-input" placeholder="name@dealership.com" />

                <label className="form-label">Mobile Number</label>
                <input type="tel" className="form-input" placeholder="+91 98400 00000" />

                <button
                  className="btn-submit-demo"
                  onClick={() => {
                    alert('Thank you! Our Dealership Solutions Team will contact you within 2 hours.');
                    setDemoModalOpen(false);
                  }}
                >
                  Confirm Live Demo Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
