import React, { useState } from 'react';
import {
  Video,
  Shield,
  Languages,
  CheckCircle2,
  Sparkles,
  ArrowRight,
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
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import './Presentation.css';

export default function Presentation() {
  const navigate = useNavigate();
  // Navigation active tab
  const [activeTab, setActiveTab] = useState('home');

  // Modals
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

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
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
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
      pillBg: '#fef3c7',
      pillColor: '#92400e',
      icon: Wrench,
      email: 'tech.suresh@dealership.com',
      password: '••••••••••••',
      loginType: 'Workshop Mobile PIN / SSO',
      summary: 'Technicians record vehicle walkarounds directly on their smartphones or CitNow app under the car lift. QualityLens provides instant feedback so videos are never rejected for dark footage or missing safety checks.',
      highlights: [
        'Instant mobile scorecard within 60s of upload',
        'Camera stability & lighting coaching (flags dark underbody shots)',
        'Speak naturally in Hindi, Tamil, Telugu, or Marathi — AI translates to customer English',
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
      pillBg: '#eff6ff',
      pillColor: '#1d4ed8',
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
      pillBg: '#ecfdf5',
      pillColor: '#065f46',
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
      pillBg: '#f5f3ff',
      pillColor: '#6d28d9',
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
      mockHeader: 'Super Admin Network Matrix • 14 Dealerships Connected',
      mockMetrics: [
        { label: 'Network Video Volume', value: '2,480 / mo', sub: '100% Cloud Analyzed' },
        { label: 'Network Avg Score', value: '9.42 / 10', sub: 'Top: Landmark Mumbai' }
      ],
      mockCardTitle: 'Multi-Dealer Benchmarking Feed',
      mockCardNotes: [
        '🟢 Landmark Mumbai: 9.6/10 (520 videos • 98.2% Protocol Compliance)',
        '🟢 Landmark Bangalore: 9.4/10 (480 videos • 95.8% Protocol Compliance)',
        '🟡 Landmark Delhi: 9.1/10 (410 videos • 89.4% Protocol Compliance)'
      ]
    }
  };

  // Login Modal State
  const [loginRoleKey, setLoginRoleKey] = useState('dealerAdmin');
  const [loginEmail, setLoginEmail] = useState('gm@landmarkmotors.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');

  const handleSelectDemoLogin = (roleKey) => {
    setLoginRoleKey(roleKey);
    const prof = roleProfiles[roleKey];
    if (prof) {
      setLoginEmail(prof.email);
      setLoginPassword(prof.password);
    }
  };

  // ROI Calculator State
  const [dealerCount, setDealerCount] = useState(8);
  const [videosPerDay, setVideosPerDay] = useState(45);

  const totalVideosMonthly = dealerCount * videosPerDay * 26;
  const hoursSavedMonthly = Math.round((totalVideosMonthly * 8) / 60);
  const additionalApprovalLakhs = (dealerCount * 1.85).toFixed(1);

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState(0);

  const faqs = [
    {
      q: 'How does the Video Rating system calculate scores?',
      a: 'QualityLens evaluates every video using a weighted multi-modal algorithm: 35% for Visual Quality (camera stability, lighting under lift, resolution), 15% for Video Length & Pacing (optimal 90s - 3.5m window), 25% for Audio Clarity & English Translation, and 25% for 5-Point Manufacturer Protocol Compliance.'
    },
    {
      q: 'What credentials do technicians, advisors, and GMs use to login?',
      a: 'QualityLens supports Single Sign-On (SSO) and role-tailored authentication: Technicians use a quick mobile PIN or badge login on workshop tablets; Service Advisors login through desk portals with WhatsApp customer links; General Managers and Super Admins access enterprise dashboards with multi-branch analytics.'
    },
    {
      q: 'How does the AI handle regional Indian languages and garage background noise?',
      a: 'QualityLens uses specialized zero-shot speech models combined with background motor hum suppression. It filters out pneumatic tools, compressor hum, and shop floor echoes while accurately translating Hindi, Tamil, Telugu, Marathi, and other regional speech into crisp, customer-friendly English.'
    },
    {
      q: 'What is the 5-point QA Protocol compliance score?',
      a: 'The protocol verifies whether mandatory customer touchpoints were performed: 1) Professional advisor greeting, 2) Registration & VIN match, 3) Tyre & brake wear measurement shown on camera, 4) Underbody sweep with adequate lighting, and 5) Transparent closing explanation.'
    },
    {
      q: 'Can group general managers compare performance across multiple dealerships?',
      a: 'Yes! The QualityLens Super Admin console includes a centralized network matrix where executives can benchmark compliance scores, video turnaround times, and top technician leaderboards across all branches.'
    }
  ];

  return (
    <div>
      {/* 1. Top Enterprise Notification Banner */}
      <div className="top-banner">
        <div className="container top-banner-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="enterprise-pill">Enterprise v3.0</span>
            <span>QualityLens Automotive Video QA System — Engineered for Leading Dealer Networks</span>
          </div>
          <div className="top-contacts">
            <a href="tel:+919840012345" className="contact-item">
              <Phone size={13} /> +91 98400 12345
            </a>
            <a href="mailto:support@qualitylens.ai" className="contact-item">
              <Mail size={13} /> support@qualitylens.ai
            </a>
            <div className="live-sync-indicator">
              <div className="pulse-dot"></div>
              <span>AI Engine Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary Navigation Bar */}
      <header className="navbar">
        <div className="container navbar-inner">
          <a href="#home" className="brand-wrapper">
            <img
              src="/qualitylens-logo.png"
              alt="QualityLens - Precision. Clarity. Innovation."
              className="navbar-logo-img"
            />
            <span className="brand-badge">Enterprise AI</span>
          </a>

          <ul className="nav-links">
            <li>
              <a
                href="#rating-works"
                className={`nav-link ${activeTab === 'rating-works' ? 'active' : ''}`}
                onClick={() => setActiveTab('rating-works')}
              >
                Rating Formula
              </a>
            </li>
            <li>
              <a
                href="#role-solutions"
                className={`nav-link ${activeTab === 'role-solutions' ? 'active' : ''}`}
                onClick={() => setActiveTab('role-solutions')}
              >
                Role Portals
              </a>
            </li>
            <li>
              <a
                href="#simulator"
                className={`nav-link ${activeTab === 'simulator' ? 'active' : ''}`}
                onClick={() => setActiveTab('simulator')}
              >
                Live Demo
              </a>
            </li>
            <li>
              <a
                href="#features"
                className={`nav-link ${activeTab === 'features' ? 'active' : ''}`}
                onClick={() => setActiveTab('features')}
              >
                AI Modules
              </a>
            </li>
            <li>
              <a
                href="#calculator"
                className={`nav-link ${activeTab === 'calculator' ? 'active' : ''}`}
                onClick={() => setActiveTab('calculator')}
              >
                ROI Model
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className={`nav-link ${activeTab === 'faq' ? 'active' : ''}`}
                onClick={() => setActiveTab('faq')}
              >
                FAQ
              </a>
            </li>
          </ul>

          <div className="nav-actions">
            <button className="btn-demo" onClick={() => setDemoModalOpen(true)}>
              Book Live Demo
            </button>
            <button className="btn-portal" onClick={() => setLoginModalOpen(true)}>
              <Lock size={15} /> Portal Login
            </button>
          </div>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section id="home" className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Left Content Column */}
            <div>
              <div className="hero-pill">
                <Sparkles size={14} />
                <span>All-in-One Automotive Video QA Platform</span>
              </div>

              <h1 className="hero-title">
                Complete &amp; Intelligent <br />
                <span className="hero-title-highlight">Workshop Video QA</span> Software
              </h1>

              <p className="hero-subtitle">
                Designed specifically for automotive dealership networks to automatically audit technician CitNow videos, translate vernacular speech into clear English, evaluate camera stability, and score protocol compliance in one seamless platform.
              </p>

              <div className="hero-cta-group">
                <a href="#rating-works" className="btn-primary-hero">
                  How Rating Works <ArrowRight size={18} />
                </a>
                <a href="#simulator" className="btn-secondary-hero">
                  <Play size={17} style={{ fill: '#1e3a8a', color: '#1e3a8a' }} /> Launch Live Preview
                </a>
              </div>

              <div className="hero-trust-list">
                <div className="trust-item">
                  <CheckCircle2 size={18} className="trust-check-icon" />
                  <span>CitNow Direct Video Link Sync</span>
                </div>
                <div className="trust-item">
                  <CheckCircle2 size={18} className="trust-check-icon" />
                  <span>Zero-Shot Vernacular Speech Translation</span>
                </div>
                <div className="trust-item">
                  <CheckCircle2 size={18} className="trust-check-icon" />
                  <span>5-Point Manufacturer QA Compliance</span>
                </div>
                <div className="trust-item">
                  <CheckCircle2 size={18} className="trust-check-icon" />
                  <span>Multi-Dealership Network Benchmarks</span>
                </div>
              </div>
            </div>

            {/* Right Preview Card Column */}
            <div className="hero-preview-wrapper">
              <div className="console-mockup-card">
                {/* Console Window Header */}
                <div className="console-header">
                  <div className="mac-dots">
                    <span className="mac-dot red"></span>
                    <span className="mac-dot yellow"></span>
                    <span className="mac-dot green"></span>
                  </div>
                  <div className="console-title-text">
                    <img src="/qualitylens-logo-mark.png" alt="" className="console-logo-mark" />
                    <span>QualityLens • Dealership Inspector Console</span>
                  </div>
                  <div className="console-sync-badge">
                    <Activity size={12} /> Live Sync
                  </div>
                </div>

                {/* Console Body */}
                <div className="console-body">
                  {/* Top KPI Cards */}
                  <div className="kpi-row">
                    <div className="kpi-card">
                      <div className="kpi-card-header">
                        <span className="kpi-card-label">Videos Analyzed</span>
                        <div className="kpi-icon-badge">
                          <Car size={16} />
                        </div>
                      </div>
                      <div className="kpi-card-value">2,480</div>
                      <div className="kpi-card-subtext">
                        <TrendingUp size={12} /> 100% QA Audited
                      </div>
                    </div>

                    <div className="kpi-card">
                      <div className="kpi-card-header">
                        <span className="kpi-card-label">Average QA Score</span>
                        <div className="kpi-icon-badge" style={{ color: '#059669' }}>
                          <Award size={16} />
                        </div>
                      </div>
                      <div className="kpi-card-value">9.4<span style={{ fontSize: '1rem', color: '#64748b' }}>/10</span></div>
                      <div className="kpi-card-subtext" style={{ color: '#2563eb' }}>
                        14 Dealerships Active
                      </div>
                    </div>
                  </div>

                  {/* Real-time Operation Feed */}
                  <div className="feed-header">
                    <span className="feed-title">Real-Time Inspection Feed</span>
                    <span className="feed-counter">Live Queue Active</span>
                  </div>

                  <div className="feed-list">
                    <div className="feed-item">
                      <div className="feed-item-left">
                        <div className="feed-item-avatar avatar-blue">BMW</div>
                        <div className="feed-item-info">
                          <span className="feed-item-title">BMW 320d: Brake &amp; Disc Walkaround</span>
                          <span className="feed-item-sub">Tech: Suresh Kumar • Duration: 2m 16s • Hindi → English</span>
                        </div>
                      </div>
                      <span className="feed-item-badge badge-green">9.4 / 10</span>
                    </div>

                    <div className="feed-item">
                      <div className="feed-item-left">
                        <div className="feed-item-avatar avatar-orange">AUDI</div>
                        <div className="feed-item-info">
                          <span className="feed-item-title">Audi Q5: Suspension &amp; Exhaust Check</span>
                          <span className="feed-item-sub">Tech: Rajesh V. • Pure Visual Walkaround • 1080p 60fps</span>
                        </div>
                      </div>
                      <span className="feed-item-badge badge-green">9.8 / 10</span>
                    </div>

                    <div className="feed-item">
                      <div className="feed-item-left">
                        <div className="feed-item-avatar avatar-purple">MB</div>
                        <div className="feed-item-info">
                          <span className="feed-item-title">Mercedes C200: Tyre Tread Depth</span>
                          <span className="feed-item-sub">Tech: David P. • Audio Clarity: 9.6/10 • QA Passed</span>
                        </div>
                      </div>
                      <span className="feed-item-badge badge-blue">9.2 / 10</span>
                    </div>
                  </div>

                  {/* Launch Button */}
                  <button
                    className="console-btn-bottom"
                    onClick={() => {
                      document.getElementById('rating-works')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    View Exact AI Rating Formula <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Floating Trust Badge */}
              <div className="floating-trust-badge">
                <div className="floating-icon-box">
                  <Shield size={20} />
                </div>
                <div>
                  <div className="floating-title">100% Automated QA Coverage</div>
                  <div className="floating-sub">Audited CitNow Protocol Sequences</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NEW: HOW VIDEO RATING WORKS (Scoring Rubric & Mathematical Weights) */}
      <section id="rating-works" className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div className="section-pill">
              <Gauge size={14} />
              <span>Scientific Evaluation</span>
            </div>
            <h2 className="section-title">How Video Rating Works</h2>
            <p className="section-subtitle">
              Every workshop walkaround video is automatically evaluated against 4 weighted pillars using computer vision, acoustic filtering, and natural language processing.
            </p>
          </div>

          {/* Mathematical Formula Bar */}
          <div className="rating-formula-bar">
            <div>
              <span className="formula-label">The QualityLens Composite Scoring Formula</span>
              <p style={{ color: '#cbd5e1', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                Normalized on a strict 0.0 to 10.0 scale for OEM brand governance.
              </p>
            </div>
            <div className="formula-code">
              Overall Score = (0.35 × Visuals) + (0.15 × Duration) + (0.25 × Audio/Translation) + (0.25 × Protocol)
            </div>
          </div>

          {/* 4 Pillars Grid */}
          <div className="rating-pillars-grid">
            {/* Pillar 1 */}
            <div className="pillar-card">
              <span className="pillar-weight-badge" style={{ background: '#eff6ff', color: '#1e40af' }}>
                35% Weight
              </span>
              <div className="pillar-icon-box" style={{ background: '#dbeafe', color: '#2563eb' }}>
                <Camera size={22} />
              </div>
              <h3 className="pillar-title">1. Video Visuals &amp; Stability</h3>
              <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                Assesses optical clarity, resolution, camera shake, and underbody illumination under the car lift.
              </p>
              <ul className="pillar-metric-list">
                <li className="pillar-metric-item">
                  <Check size={14} style={{ color: '#10b981' }} />
                  <span>Full HD (1080p/720p) resolution</span>
                </li>
                <li className="pillar-metric-item">
                  <Check size={14} style={{ color: '#10b981' }} />
                  <span>Camera stability &amp; pan speed</span>
                </li>
                <li className="pillar-metric-item">
                  <Check size={14} style={{ color: '#10b981' }} />
                  <span>Underbody lift exposure &amp; lighting</span>
                </li>
                <li className="pillar-metric-item">
                  <Check size={14} style={{ color: '#10b981' }} />
                  <span>Sharp focus on tyre &amp; brake wear</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="pillar-card">
              <span className="pillar-weight-badge" style={{ background: '#fef3c7', color: '#92400e' }}>
                15% Weight
              </span>
              <div className="pillar-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
                <Clock size={22} />
              </div>
              <h3 className="pillar-title">2. Video Duration &amp; Pacing</h3>
              <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                Extracts exact video length (e.g. 2m 16s) to ensure walkarounds respect customer attention spans.
              </p>
              <ul className="pillar-metric-list">
                <li className="pillar-metric-item">
                  <Check size={14} style={{ color: '#10b981' }} />
                  <span><strong>Optimal Zone:</strong> 90s to 3.5 minutes</span>
                </li>
                <li className="pillar-metric-item">
                  <Check size={14} style={{ color: '#10b981' }} />
                  <span>Rushed video flag: (&lt;60s penalty)</span>
                </li>
                <li className="pillar-metric-item">
                  <Check size={14} style={{ color: '#10b981' }} />
                  <span>Excessive dragging flag: (&gt;5m penalty)</span>
                </li>
                <li className="pillar-metric-item">
                  <Check size={14} style={{ color: '#10b981' }} />
                  <span>Component pacing: 15s per wheel/axle</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="pillar-card">
              <span className="pillar-weight-badge" style={{ background: '#ecfdf5', color: '#065f46' }}>
                25% Weight
              </span>
              <div className="pillar-icon-box" style={{ background: '#d1fae5', color: '#059669' }}>
                <Languages size={22} />
              </div>
              <h3 className="pillar-title">3. Audio &amp; Real Translation</h3>
              <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                Filters out air-compressor hum and auto-translates regional technician dialects into English.
              </p>
              <ul className="pillar-metric-list">
                <li className="pillar-metric-item">
                  <Check size={14} style={{ color: '#10b981' }} />
                  <span>Garage motor hum suppression</span>
                </li>
                <li className="pillar-metric-item">
                  <Check size={14} style={{ color: '#10b981' }} />
                  <span>Zero-shot Hindi/Tamil to English</span>
                </li>
                <li className="pillar-metric-item">
                  <Check size={14} style={{ color: '#10b981' }} />
                  <span>Identifies silent walkarounds</span>
                </li>
                <li className="pillar-metric-item">
                  <Check size={14} style={{ color: '#10b981' }} />
                  <span>Advisor vocal clarity &amp; tone check</span>
                </li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="pillar-card">
              <span className="pillar-weight-badge" style={{ background: '#f5f3ff', color: '#6d28d9' }}>
                25% Weight
              </span>
              <div className="pillar-icon-box" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                <FileCheck size={22} />
              </div>
              <h3 className="pillar-title">4. 5-Point QA Protocol</h3>
              <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                Strict checklist validation of mandatory manufacturer and dealership touchpoints.
              </p>
              <ul className="pillar-metric-list">
                <li className="pillar-metric-item">
                  <Check size={14} style={{ color: '#10b981' }} />
                  <span>1. Professional greeting &amp; advisor intro</span>
                </li>
                <li className="pillar-metric-item">
                  <Check size={14} style={{ color: '#10b981' }} />
                  <span>2. Vehicle registration &amp; VIN match</span>
                </li>
                <li className="pillar-metric-item">
                  <Check size={14} style={{ color: '#10b981' }} />
                  <span>3. Brake pad &amp; tyre gauge evidence</span>
                </li>
                <li className="pillar-metric-item">
                  <Check size={14} style={{ color: '#10b981' }} />
                  <span>4. Underbody &amp; suspension inspection</span>
                </li>
                <li className="pillar-metric-item">
                  <Check size={14} style={{ color: '#10b981' }} />
                  <span>5. Transparent repair recommendation</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Score Bands Container */}
          <div className="score-bands-container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  What the Final Video Score Means
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
                  Automated routing rules dictate whether a video is immediately dispatched to customers or flagged for review.
                </p>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '0.3rem 0.75rem', borderRadius: '6px' }}>
                Automated Workflow Rules
              </span>
            </div>

            <div className="score-bands-grid">
              <div className="score-band-item band-excellent">
                <span style={{ fontSize: '1.25rem', fontWeight: 850, color: '#065f46' }}>9.0 – 10.0</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#047857' }}>Grade: Excellent</span>
                <p style={{ fontSize: '0.78rem', color: '#065f46', lineHeight: 1.45 }}>
                  Instantly approved for customer delivery via WhatsApp &amp; SMS. 100% protocol verified.
                </p>
              </div>

              <div className="score-band-item band-good">
                <span style={{ fontSize: '1.25rem', fontWeight: 850, color: '#1e40af' }}>7.0 – 8.9</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1d4ed8' }}>Grade: Good</span>
                <p style={{ fontSize: '0.78rem', color: '#1e40af', lineHeight: 1.45 }}>
                  Customer approved with minor technician coaching advice (e.g. hold camera steadier on tyre tread).
                </p>
              </div>

              <div className="score-band-item band-fair">
                <span style={{ fontSize: '1.25rem', fontWeight: 850, color: '#92400e' }}>5.0 – 6.9</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#b45309' }}>Grade: Fair</span>
                <p style={{ fontSize: '0.78rem', color: '#92400e', lineHeight: 1.45 }}>
                  Flagged for Service Advisor review. May have rushed pacing or dark underbody lighting.
                </p>
              </div>

              <div className="score-band-item band-poor">
                <span style={{ fontSize: '1.25rem', fontWeight: 850, color: '#9f1239' }}>&lt; 5.0</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#be123c' }}>Needs Re-Shoot</span>
                <p style={{ fontSize: '0.78rem', color: '#9f1239', lineHeight: 1.45 }}>
                  Automatic block. Inaudible audio, pitch dark footage, or &lt;30s duration. Technician alerted to re-take.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW: ROLE-BASED SOLUTIONS & HOW EACH USER LOGS IN */}
      <section id="role-solutions" className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-pill">
              <Users size={14} />
              <span>Role-Tailored Portals</span>
            </div>
            <h2 className="section-title">How Different Team Members Use QualityLens</h2>
            <p className="section-subtitle">
              From technicians under the lift to group general managers across 30 dealerships — each team member has a dedicated, secure interface tailored to their exact workflow.
            </p>
          </div>

          {/* Interactive Role Switcher Tabs */}
          <div className="roles-nav-tabs">
            <button
              className={`role-nav-btn ${activeRole === 'technician' ? 'active' : ''}`}
              onClick={() => setActiveRole('technician')}
            >
              <Wrench size={18} /> Technician (Workshop Floor)
            </button>
            <button
              className={`role-nav-btn ${activeRole === 'advisor' ? 'active' : ''}`}
              onClick={() => setActiveRole('advisor')}
            >
              <Users size={18} /> Service Advisor (Customer Front)
            </button>
            <button
              className={`role-nav-btn ${activeRole === 'dealerAdmin' ? 'active' : ''}`}
              onClick={() => setActiveRole('dealerAdmin')}
            >
              <Shield size={18} /> Dealership GM &amp; QA Head
            </button>
            <button
              className={`role-nav-btn ${activeRole === 'superAdmin' ? 'active' : ''}`}
              onClick={() => setActiveRole('superAdmin')}
            >
              <Activity size={18} /> OEM &amp; Group Super Admin
            </button>
          </div>

          {/* Active Role Content Card */}
          {(() => {
            const role = roleProfiles[activeRole];
            const Icon = role.icon;
            return (
              <div className="role-detail-layout">
                {/* Left Side: Role Info & Login Method */}
                <div className="role-info-side">
                  <div>
                    <span className="role-header-pill" style={{ background: role.pillBg, color: role.pillColor }}>
                      {role.pill}
                    </span>
                    <h3 className="role-name-title">{role.title}</h3>
                    <p className="role-summary-text">{role.summary}</p>

                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Key Role Capabilities:
                    </h4>
                    <ul className="role-features-list">
                      {role.highlights.map((item, idx) => (
                        <li key={idx} className="role-feature-item">
                          <CheckCircle2 size={16} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Lock size={16} style={{ color: '#1e3a8a' }} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>Login Access Method</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                        {role.loginType}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
                      <span>Demo Account: <strong>{role.email}</strong></span>
                      <button
                        onClick={() => {
                          handleSelectDemoLogin(role.id);
                          setLoginModalOpen(true);
                        }}
                        style={{ color: '#2563eb', fontWeight: 800, textDecoration: 'underline' }}
                      >
                        Try Logging In →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side: Simulated Mock Dashboard for this Role */}
                <div className="role-mock-screen">
                  <div className="mock-screen-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Icon size={18} style={{ color: '#60a5fa' }} />
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#ffffff' }}>{role.mockHeader}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '0.2rem 0.6rem', borderRadius: '100px', fontWeight: 700 }}>
                      ● Active Session
                    </span>
                  </div>

                  <div className="mock-screen-body">
                    {/* Role KPI Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {role.mockMetrics.map((m, idx) => (
                        <div key={idx} className="mock-card-dark">
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>{m.label}</span>
                          <span style={{ fontSize: '1.5rem', fontWeight: 850, color: '#ffffff' }}>{m.value}</span>
                          <span style={{ fontSize: '0.72rem', color: '#38bdf8', display: 'block', marginTop: '0.25rem' }}>{m.sub}</span>
                        </div>
                      ))}
                    </div>

                    {/* Role Specific Feed Card */}
                    <div className="mock-card-dark" style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#e2e8f0', display: 'block', marginBottom: '0.85rem' }}>
                        {role.mockCardTitle}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {role.mockCardNotes.map((note, idx) => (
                          <div key={idx} style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, background: '#0f172a', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155' }}>
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                    <span>Role Permissions: Role-Based Access Control (RBAC)</span>
                    <span style={{ color: '#34d399', fontWeight: 700 }}>256-Bit Encrypted</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 6. Live Interactive Simulator */}
      <section id="simulator" className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div className="section-pill">
              <Play size={14} />
              <span>Interactive Demonstration</span>
            </div>
            <h2 className="section-title">Experience QualityLens in Action</h2>
            <p className="section-subtitle">
              Test real CitNow inspection samples or paste your own link to see how QualityLens processes video duration, spoken translation, and protocol compliance.
            </p>
          </div>

          <div className="simulator-box">
            {/* Simulator Top Bar */}
            <div className="simulator-top-bar">
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>CitNow Video Analysis Simulator</h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Simulate single-link inspection and witness multi-modal evaluation in real time.
                </p>
              </div>

              <div className="sim-input-row">
                <input
                  type="text"
                  className="sim-input"
                  value={simUrl}
                  onChange={(e) => setSimUrl(e.target.value)}
                  placeholder="https://southasia.citnow.com/vpl/..."
                />
                <button
                  className="sim-btn-analyze"
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="pulse-dot" style={{ background: '#ffffff' }}></div> Analyzing {simProgress}%...
                    </>
                  ) : (
                    <>
                      <Play size={16} /> Run AI Analysis
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Simulator Content */}
            <div className="simulator-content">
              {/* Presets */}
              <div style={{ marginBottom: '1.2rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>
                  Choose a sample video inspection scenario:
                </span>
                <div className="preset-pills">
                  {samplePresets.map((preset) => (
                    <button
                      key={preset.id}
                      className={`preset-pill ${selectedPreset.id === preset.id ? 'active' : ''}`}
                      onClick={() => handleSelectPreset(preset)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress bar if analyzing */}
              {isAnalyzing && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: '#1e3a8a' }}>
                    <span>Processing video frames &amp; transcribing dialect...</span>
                    <span>{simProgress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${simProgress}%`, height: '100%', background: '#2563eb', transition: 'width 0.3s ease' }}></div>
                  </div>
                </div>
              )}

              {/* Result Grid */}
              <div className="sim-results-grid">
                {/* Metric 1: Video Length & Metrics */}
                <div className="sim-metric-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={18} style={{ color: '#d97706' }} />
                      <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>⏱️ Video Length &amp; Visual QA</span>
                    </div>
                    <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                      {simResults.duration}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
                    <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Video Quality Score</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 850, color: '#0f172a' }}>{simResults.videoScore}</span>
                    </div>
                    <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Audio Clarity Score</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 850, color: '#0f172a' }}>{simResults.audioScore}</span>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>
                      5-Point Protocol Compliance Check:
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {simResults.qaProtocol.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                          <CheckCircle2 size={15} style={{ color: '#10b981', flexShrink: 0 }} />
                          <span style={{ color: '#334155' }}>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Metric 2: Authentic Speech Translation */}
                <div className="sim-metric-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Languages size={18} style={{ color: '#2563eb' }} />
                      <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>🌐 Spoken Speech &amp; English Translation</span>
                    </div>
                    <span style={{ background: '#eff6ff', color: '#1e40af', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                      {simResults.lang}
                    </span>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Original Spoken Transcript:
                    </span>
                    <p style={{ fontSize: '0.85rem', color: '#1e293b', fontStyle: 'italic', background: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '0.3rem' }}>
                      "{simResults.transcript}"
                    </p>
                  </div>

                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      English Translation for Customer &amp; QA:
                    </span>
                    <p style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 600, background: '#f0fdf4', padding: '0.85rem', borderRadius: '8px', border: '1px solid #bbf7d0', marginTop: '0.3rem', lineHeight: 1.5 }}>
                      "{simResults.translation}"
                    </p>
                  </div>

                  <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Overall Assessment Quality</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                      Grade: Excellent ({simResults.overallScore})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Comprehensive AI Feature Modules */}
      <section id="features" className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-pill">
              <Sliders size={14} />
              <span>Full Capabilities</span>
            </div>
            <h2 className="section-title">Engineered Specifically for Dealerships</h2>
            <p className="section-subtitle">
              Six dedicated intelligence modules that solve audio, video, translation, and governance challenges simultaneously.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon-wrapper" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <Eye size={24} />
              </div>
              <h3 className="feature-title">Camera Stability &amp; Lighting</h3>
              <p className="feature-desc">
                Detects rapid camera pans, dark underbody shots, blurry tire wear inspections, and poor lens angles to ensure pristine video clarity.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper" style={{ background: '#fef3c7', color: '#d97706' }}>
                <Clock size={24} />
              </div>
              <h3 className="feature-title">Video Length &amp; Pacing</h3>
              <p className="feature-desc">
                Automatically calculates total video duration and flags walkarounds that are rushed (&lt;60s) or overly long (&gt;5m) to maintain optimal customer engagement.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper" style={{ background: '#ecfdf5', color: '#059669' }}>
                <Languages size={24} />
              </div>
              <h3 className="feature-title">Dialect-to-English Translation</h3>
              <p className="feature-desc">
                Zero-shot speech recognition translates Hindi, Marathi, Tamil, Telugu, and Gujarati technician explanations directly into customer-friendly English.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                <Shield size={24} />
              </div>
              <h3 className="feature-title">5-Point Protocol Compliance</h3>
              <p className="feature-desc">
                Verifies mandatory checklist touchpoints: advisor greeting, registration match, brake thickness, suspension check, and repair recommendations.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper" style={{ background: '#fff1f2', color: '#e11d48' }}>
                <BarChart3 size={24} />
              </div>
              <h3 className="feature-title">Multi-Dealer Group Benchmarking</h3>
              <p className="feature-desc">
                Super admin dashboards allow dealer principals to compare compliance scores, technician turnaround, and customer feedback across 20+ branches.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper" style={{ background: '#f0fdfa', color: '#0d9488' }}>
                <Wrench size={24} />
              </div>
              <h3 className="feature-title">Technician Coaching Insights</h3>
              <p className="feature-desc">
                Generates personalized coaching recommendations for service advisors to elevate speaking confidence, presentation skills, and vehicle demonstration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Dealership Savings & ROI Calculator */}
      <section id="calculator" className="section section-alt">
        <div className="container">
          <div className="calc-card">
            <div>
              <div className="section-pill" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <TrendingUp size={14} />
                <span>Dealership Group ROI Model</span>
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 850, color: '#ffffff', marginBottom: '1rem', lineHeight: 1.15 }}>
                Calculate Your Annual QA Savings
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                Adjust your dealership network size to see how much manual QA auditing time and labor costs QualityLens saves every single month.
              </p>

              <div className="calc-slider-group">
                <div className="calc-slider-label">
                  <span>Number of Dealership Branches</span>
                  <span className="calc-slider-value">{dealerCount} Dealerships</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={dealerCount}
                  onChange={(e) => setDealerCount(Number(e.target.value))}
                  className="calc-slider"
                />
              </div>

              <div className="calc-slider-group">
                <div className="calc-slider-label">
                  <span>Average Videos per Day per Dealer</span>
                  <span className="calc-slider-value">{videosPerDay} Videos / Day</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={videosPerDay}
                  onChange={(e) => setVideosPerDay(Number(e.target.value))}
                  className="calc-slider"
                />
              </div>
            </div>

            {/* Results Output */}
            <div className="calc-result-box">
              <div className="calc-stat-item">
                <span className="calc-stat-label">Monthly Inspection Videos</span>
                <span className="calc-stat-num">{totalVideosMonthly.toLocaleString()}</span>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>100% automated AI coverage</span>
              </div>

              <div className="calc-stat-item">
                <span className="calc-stat-label">Manager Hours Saved / Month</span>
                <span className="calc-stat-num" style={{ color: '#34d399' }}>{hoursSavedMonthly.toLocaleString()} hrs</span>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Replaces manual video spot-checking</span>
              </div>

              <div className="calc-stat-item">
                <span className="calc-stat-label">Est. Additional Repair Approvals</span>
                <span className="calc-stat-num" style={{ color: '#facc15' }}>+₹{additionalApprovalLakhs} L</span>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Through higher customer trust &amp; clarity</span>
              </div>

              <button
                className="btn-primary-hero"
                style={{ width: '100%', justifyContent: 'center', background: '#38bdf8', color: '#090e1a' }}
                onClick={() => setDemoModalOpen(true)}
              >
                Schedule Executive Demo <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Frequently Asked Questions (FAQ) */}
      <section id="faq" className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-pill">
              <HelpCircle size={14} />
              <span>Answers &amp; Clarity</span>
            </div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Everything you need to know about implementing QualityLens across your dealership network.
            </p>
          </div>

          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="faq-item"
                onClick={() => setExpandedFaq(expandedFaq === index ? -1 : index)}
              >
                <div className="faq-question-row">
                  <span className="faq-q">{faq.q}</span>
                  {expandedFaq === index ? (
                    <ChevronUp size={20} style={{ color: '#2563eb', flexShrink: 0 }} />
                  ) : (
                    <ChevronDown size={20} style={{ color: '#64748b', flexShrink: 0 }} />
                  )}
                </div>
                {expandedFaq === index && <p className="faq-a">{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <a href="#home" style={{ display: 'inline-block' }}>
                <img
                  src="/qualitylens-logo-white.png"
                  alt="QualityLens - Precision. Clarity. Innovation."
                  className="footer-logo-img"
                />
              </a>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.6, maxWidth: '340px' }}>
                The definitive AI video inspection, dialect translation, and protocol compliance platform for luxury and volume automotive dealerships.
              </p>
            </div>

            <div>
              <h4 className="footer-col-title">Platform</h4>
              <ul className="footer-links">
                <li><a href="#rating-works">Rating Formula (35/15/25/25)</a></li>
                <li><a href="#role-solutions">Role Solutions &amp; Login</a></li>
                <li><a href="#features">AI Video Quality</a></li>
                <li><a href="#features">Audio &amp; Motor Hum Removal</a></li>
                <li><a href="#simulator">Live CitNow Simulator</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Solutions</h4>
              <ul className="footer-links">
                <li><a href="#role-solutions">Technician Floor App</a></li>
                <li><a href="#role-solutions">Service Advisor Portal</a></li>
                <li><a href="#role-solutions">Dealership GM QA Head</a></li>
                <li><a href="#role-solutions">OEM Super Admin</a></li>
                <li><a href="#calculator">Enterprise ROI Model</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Contact &amp; Support</h4>
              <ul className="footer-links">
                <li><a href="tel:+919840012345">+91 98400 12345</a></li>
                <li><a href="mailto:support@qualitylens.ai">support@qualitylens.ai</a></li>
                <li><a href="#home">Focus Engineering Hub</a></li>
                <li><a href="#home">Chennai • Bengaluru • Mumbai</a></li>
                <li><a href="#home">SOC2 &amp; ISO 27001 Certified</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} QualityLens Inc. &amp; Focus Engineering. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#security">Security &amp; Data Protection</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 11. Modal: Book Live Demo */}
      {demoModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            padding: '2.5rem',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <button
              onClick={() => setDemoModalOpen(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#64748b' }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <img src="/qualitylens-logo.png" alt="QualityLens" className="modal-logo-img" />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 850, color: '#0f172a' }}>Book an Executive Demo</h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
                See QualityLens analyze 10 of your actual workshop videos and generate an executive compliance audit report.
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you! Our automotive solutions specialist will contact you within 2 hours.');
              setDemoModalOpen(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>Your Name</label>
                <input required placeholder="e.g. Ramesh Sundaram" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>Dealership / Group Name</label>
                <input required placeholder="e.g. Landmark Motor Group" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>Work Email</label>
                  <input required type="email" placeholder="ramesh@dealership.com" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>Phone Number</label>
                  <input required type="tel" placeholder="+91 98400..." style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }} />
                </div>
              </div>

              <button type="submit" className="btn-primary-hero" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
                Confirm Demo Request <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 12. Modal: Portal Login (With Demo Profile Switcher) */}
      {loginModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '480px',
            width: '100%',
            padding: '2.5rem',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <button
              onClick={() => setLoginModalOpen(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#64748b' }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <img src="/qualitylens-logo.png" alt="QualityLens" className="modal-logo-img" />
              <h3 style={{ fontSize: '1.35rem', fontWeight: 850, color: '#0f172a' }}>QualityLens Portal Access</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                Select a role profile below to preview their dedicated login &amp; workspace:
              </p>
            </div>

            {/* Quick Demo Role Switcher */}
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Quick Test Profile:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="demo-role-quick-btn"
                  style={loginRoleKey === 'technician' ? { background: '#eff6ff', borderColor: '#3b82f6', color: '#1d4ed8' } : {}}
                  onClick={() => handleSelectDemoLogin('technician')}
                >
                  <Wrench size={13} /> 🔧 Technician
                </button>
                <button
                  type="button"
                  className="demo-role-quick-btn"
                  style={loginRoleKey === 'advisor' ? { background: '#eff6ff', borderColor: '#3b82f6', color: '#1d4ed8' } : {}}
                  onClick={() => handleSelectDemoLogin('advisor')}
                >
                  <Users size={13} /> 👔 Service Advisor
                </button>
                <button
                  type="button"
                  className="demo-role-quick-btn"
                  style={loginRoleKey === 'dealerAdmin' ? { background: '#eff6ff', borderColor: '#3b82f6', color: '#1d4ed8' } : {}}
                  onClick={() => handleSelectDemoLogin('dealerAdmin')}
                >
                  <Shield size={13} /> 🏢 Dealership GM
                </button>
                <button
                  type="button"
                  className="demo-role-quick-btn"
                  style={loginRoleKey === 'superAdmin' ? { background: '#eff6ff', borderColor: '#3b82f6', color: '#1d4ed8' } : {}}
                  onClick={() => handleSelectDemoLogin('superAdmin')}
                >
                  <Activity size={13} /> 🌐 Super Admin
                </button>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setLoginModalOpen(false);
              navigate(`/login?username=${encodeURIComponent(loginEmail)}`);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  {roleProfiles[loginRoleKey]?.title} Username / Email
                </label>
                <input
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>Password / PIN</label>
                <input
                  required
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#475569' }}>
                  <input type="checkbox" defaultChecked /> Remember station
                </label>
                <a href="#forgot" style={{ color: '#2563eb', fontWeight: 600 }}>Forgot password?</a>
              </div>

              <button type="submit" className="btn-primary-hero" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
                Launch {roleProfiles[loginRoleKey]?.title.split('/')[0]} Workspace <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
