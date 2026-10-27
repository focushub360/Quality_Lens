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
  CheckCircle,
  Download,
  FileText,
  Target,
  Star,
  ExternalLink,
  Maximize,
  Minimize
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import './Presentation.css';

export default function Presentation() {
  const navigate = useNavigate();
  const viewportRef = useRef(null);

  // 7 High-Impact Presentation Slides: Objectives, Analysis, Live Link, Portal Experience, Portal Operations, Competitive Advantage, AI Architecture & Simulator
  const slides = [
    { id: 'slide-1', title: 'Objectives & Problem Solved', label: '01 Objectives' },
    { id: 'slide-2', title: 'How We Analyse Every Video', label: '02 Analysis Flow' },
    { id: 'slide-3', title: 'Live Link & Business Impact', label: '03 Live Link & Impact' },
    { id: 'slide-4', title: 'Live Portal: Executive Dashboard & Video Inspector', label: '04 Portal Experience' },
    { id: 'slide-5', title: 'Live Portal: Batch Ingestion & Coaching Leaderboard', label: '05 Bulk & Coaching' },
    { id: 'slide-6', title: 'Competitive Advantage & 6-Platform Benchmark', label: '06 Benchmark & Wins' },
    { id: 'slide-7', title: 'AI Architecture, Formula & Live Simulator', label: '07 Tech & Simulator' }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Toggle true browser full-view presentation mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

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

  // Sync current slide on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = slides.findIndex((s) => s.id === entry.target.id);
            if (index !== -1) setCurrentSlide(index);
          }
        });
      },
      { threshold: 0.55 }
    );

    slides.forEach((slide) => {
      const el = document.getElementById(slide.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [slides]);

  // Simulator Presets
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
    setSimResults(preset);
  };

  // Competitive Comparison Active Tab
  const [activeCompetitor, setActiveCompetitor] = useState('myKaarma');

  // Trigger PPT Download
  const handleDownloadPpt = () => {
    const link = document.createElement('a');
    link.href = '/QualityLens_Project_Overview.pptx';
    link.download = 'QualityLens_Project_Overview.pptx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.3 } });
  };

  return (
    <div className="presentation-screen">
      {/* 1. TOP PROGRESS BAR */}
      <div
        className="presentation-progress-bar"
        style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
      />

      {/* 2. DUAL-BRAND HEADER (Focus Engineering + QualityLens) */}
      <header className="presentation-header">
        <div className="header-left">
          {/* Focus Engineering Logo */}
          <div className="brand-logo-wrap" onClick={() => goToSlide(0)} title="Focus Engineering">
            <img src="/focus-engineering-logo.png" alt="Focus Engineering" className="focus-logo-img" />
          </div>

          <div className="partner-divider" />

          {/* QualityLens Logo */}
          <div className="brand-logo-wrap" onClick={() => goToSlide(0)} title="QualityLens">
            <img src="/qualitylens-logo.png" alt="QualityLens" className="ql-logo-img" />
          </div>

          <div className="partner-divider" />

          <div className="citnow-badge">
            <span className="citnow-dot"></span>
            <span>CitNOW Ecosystem Partner</span>
          </div>
        </div>

        {/* Center Current Slide Pill */}
        <div className="header-center">
          <div className="slide-counter-chip">
            <span className="slide-number">SLIDE {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
            <span className="slide-separator">•</span>
            <span className="slide-current-title">{slides[currentSlide].title}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="header-right">
          {/* Full View Toggle Button */}
          <button
            className={`btn-fullview-toggle ${isFullscreen ? 'active' : ''}`}
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Full View (Esc)' : 'Enter Full View Mode'}
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
            <span>{isFullscreen ? 'Exit Full View' : 'Full View'}</span>
          </button>

          {/* PPT Download Button */}
          <button className="btn-ppt-download" onClick={handleDownloadPpt} title="Download PowerPoint Presentation (.pptx)">
            <Download size={15} />
            <span>Download PPT</span>
            <span className="ppt-ext-badge">.pptx</span>
          </button>

          <button className="btn-demo-glow" onClick={() => setDemoModalOpen(true)}>
            <Sparkles size={14} /> Book Demo
          </button>

          <button className="btn-portal-pill" onClick={() => navigate('/login')}>
            <Lock size={13} /> Portal Login
          </button>
        </div>
      </header>

      {/* 3. MAIN SLIDES VIEWPORT */}
      <main className="slides-viewport" ref={viewportRef}>
        {/* ============================================================== */}
        {/* SLIDE 1: OBJECTIVES & PROBLEM SOLVED (Matches User Slide 1) */}
        {/* ============================================================== */}
        <section id="slide-1" className="keynote-slide slide-ppt-card">
          <div className="slide-content">
            {/* Slide Header with Dual Logos & Section Title */}
            <div className="ppt-slide-topbar">
              <div className="ppt-dual-logos">
                <img src="/focus-engineering-logo.png" alt="Focus Engineering" className="ppt-focus-logo" />
                <img src="/qualitylens-logo.png" alt="QualityLens" className="ppt-ql-logo" />
              </div>
              <h1 className="ppt-slide-title">Objectives &amp; Problem Solved</h1>
            </div>

            {/* Two Side-by-Side Cards (Exact Layout from PowerPoint) */}
            <div className="ppt-cards-grid">
              {/* Left Dark Navy Card: Objective */}
              <div className="ppt-card-navy">
                <div className="ppt-icon-circle-cyan">
                  <Target size={28} />
                </div>
                <div className="ppt-navy-label">OBJECTIVE</div>
                <h2 className="ppt-navy-main-text">
                  Make every dealer walk-around video a better sales tool by checking its quality automatically.
                </h2>
                <div className="ppt-navy-subtext">
                  Built by Focus Engineering directly on top of CitNOW workflows to guarantee 100% video inspection standards across dealership networks.
                </div>
              </div>

              {/* Right White Card: Problem Solved */}
              <div className="ppt-card-white">
                <div className="ppt-card-white-header">
                  <span className="ppt-cyan-tag">PROBLEM SOLVED</span>
                  <p className="ppt-problem-desc">
                    Dealer videos vary a lot: shaky, too bright, dull colours, hard to hear. Checking them by hand is slow and inconsistent.
                  </p>
                </div>

                <div className="ppt-feature-list">
                  <div className="ppt-feature-item">
                    <div className="ppt-feature-icon-box">
                      <Star size={18} fill="currentColor" />
                    </div>
                    <div>
                      <div className="ppt-feature-title">Instant score out of 10</div>
                      <div className="ppt-feature-desc">Every video gets a clear quality rating</div>
                    </div>
                  </div>

                  <div className="ppt-feature-item">
                    <div className="ppt-feature-icon-box">
                      <Wrench size={18} />
                    </div>
                    <div>
                      <div className="ppt-feature-title">Tells you what to fix</div>
                      <div className="ppt-feature-desc">Lighting, steadiness, colour or sound</div>
                    </div>
                  </div>

                  <div className="ppt-feature-item">
                    <div className="ppt-feature-icon-box">
                      <Layers size={18} />
                    </div>
                    <div>
                      <div className="ppt-feature-title">Checks hundreds at once</div>
                      <div className="ppt-feature-desc">No more video-by-video review</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Footer */}
            <div className="ppt-slide-footer">
              <span>QualityLens | Sales &amp; Marketing Overview</span>
              <span>1</span>
            </div>

            <div className="slide-next-prompt" onClick={goToNext}>
              <span>Next: How We Analyse Every Video</span>
              <ChevronDown size={16} className="bounce-arrow" />
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SLIDE 2: HOW WE ANALYSE EVERY VIDEO (Matches User Slide 2) */}
        {/* ============================================================== */}
        <section id="slide-2" className="keynote-slide slide-ppt-card">
          <div className="slide-content">
            <div className="ppt-slide-topbar">
              <div className="ppt-dual-logos">
                <img src="/focus-engineering-logo.png" alt="Focus Engineering" className="ppt-focus-logo" />
                <img src="/qualitylens-logo.png" alt="QualityLens" className="ppt-ql-logo" />
              </div>
              <h1 className="ppt-slide-title">How We Analyse Every Video</h1>
            </div>

            {/* Two Side-by-Side Cards */}
            <div className="ppt-cards-grid">
              {/* Left Dark Navy Card: 4 Steps */}
              <div className="ppt-card-navy">
                <div className="ppt-step-rows">
                  <div className="ppt-step-row">
                    <div className="ppt-step-num-icon">
                      <ExternalLink size={18} />
                    </div>
                    <div>
                      <div className="ppt-step-title">1. Paste the video page link</div>
                      <div className="ppt-step-sub">We pull dealer, vehicle and advisor details</div>
                    </div>
                  </div>

                  <div className="ppt-step-row">
                    <div className="ppt-step-num-icon">
                      <Eye size={18} />
                    </div>
                    <div>
                      <div className="ppt-step-title">2. Watch the picture</div>
                      <div className="ppt-step-sub">Scores sharpness, brightness, colour, steadiness</div>
                    </div>
                  </div>

                  <div className="ppt-step-row">
                    <div className="ppt-step-num-icon">
                      <Languages size={18} />
                    </div>
                    <div>
                      <div className="ppt-step-title">3. Listen to the sound</div>
                      <div className="ppt-step-sub">Rates audio as Clear, Moderate or Poor</div>
                    </div>
                  </div>

                  <div className="ppt-step-row">
                    <div className="ppt-step-num-icon">
                      <FileText size={18} />
                    </div>
                    <div>
                      <div className="ppt-step-title">4. Summarise what is said</div>
                      <div className="ppt-step-sub">Written transcript, short summary, translation</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right White Card: SAMPLE RESULT with Bar Chart */}
              <div className="ppt-card-white">
                <div className="ppt-sample-result-header">
                  <span className="ppt-cyan-tag">SAMPLE RESULT</span>
                  <div className="ppt-score-big-box">
                    <span className="ppt-score-num">3.3</span>
                    <span className="ppt-score-denom">/ 10</span>
                    <span className="ppt-score-poor-badge">Poor</span>
                  </div>
                </div>

                {/* Horizontal Progress Breakdown (from Screenshot) */}
                <div className="ppt-bars-chart">
                  <div className="ppt-bar-row">
                    <span className="ppt-bar-label">Sharpness</span>
                    <div className="ppt-bar-track">
                      <div className="ppt-bar-fill fill-amber" style={{ width: '43.9%' }}></div>
                    </div>
                    <span className="ppt-bar-val">43.9%</span>
                  </div>

                  <div className="ppt-bar-row">
                    <span className="ppt-bar-label">Brightness</span>
                    <div className="ppt-bar-track">
                      <div className="ppt-bar-fill fill-amber" style={{ width: '36.9%' }}></div>
                    </div>
                    <span className="ppt-bar-val">36.9%</span>
                  </div>

                  <div className="ppt-bar-row">
                    <span className="ppt-bar-label">Colour vibrancy</span>
                    <div className="ppt-bar-track">
                      <div className="ppt-bar-fill fill-red" style={{ width: '17.2%' }}></div>
                    </div>
                    <span className="ppt-bar-val">17.2%</span>
                  </div>

                  <div className="ppt-bar-row">
                    <span className="ppt-bar-label">Steadiness</span>
                    <div className="ppt-bar-track">
                      <div className="ppt-bar-fill fill-empty" style={{ width: '2%' }}></div>
                    </div>
                    <span className="ppt-bar-val text-red">0.0%</span>
                  </div>

                  <div className="ppt-bar-row">
                    <span className="ppt-bar-label">Cleanliness</span>
                    <div className="ppt-bar-track">
                      <div className="ppt-bar-fill fill-green" style={{ width: '77.8%' }}></div>
                    </div>
                    <span className="ppt-bar-val text-green">77.8%</span>
                  </div>
                </div>

                <div className="ppt-coach-note">
                  <strong>💡 AI Coaching Diagnosis:</strong> Severe camera shake detected via Optical Flow. Vehicle parts out of focus. Lighting below OEM threshold in wheel arch.
                </div>
              </div>
            </div>

            <div className="ppt-slide-footer">
              <span>QualityLens | Sales &amp; Marketing Overview</span>
              <span>2</span>
            </div>

            <div className="slide-next-prompt" onClick={goToNext}>
              <span>Next: Live Link &amp; Business Impact</span>
              <ChevronDown size={16} className="bounce-arrow" />
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SLIDE 3: LIVE LINK & BUSINESS IMPACT (Matches User Slide 3) */}
        {/* ============================================================== */}
        <section id="slide-3" className="keynote-slide slide-ppt-card">
          <div className="slide-content">
            <div className="ppt-slide-topbar">
              <div className="ppt-dual-logos">
                <img src="/focus-engineering-logo.png" alt="Focus Engineering" className="ppt-focus-logo" />
                <img src="/qualitylens-logo.png" alt="QualityLens" className="ppt-ql-logo" />
              </div>
              <h1 className="ppt-slide-title">Live Link &amp; Business Impact</h1>
            </div>

            {/* Two Side-by-Side Cards */}
            <div className="ppt-cards-grid">
              {/* Left White Card: Live Demo Link & Credentials */}
              <div className="ppt-card-white">
                <div className="ppt-icon-circle-cyan">
                  <Activity size={26} />
                </div>
                <div className="ppt-cyan-tag mt-2">LIVE DEMO LINK</div>
                <div className="ppt-live-url-display">qualitylens.focusengineeringapp.com</div>
                <p className="ppt-live-url-sub">Open it, paste a video link, see the score</p>

                <div className="ppt-demo-btn-row">
                  <button className="ppt-btn-open-demo" onClick={() => navigate('/login')}>
                    Open Live Demo <ArrowRight size={16} />
                  </button>
                </div>

                <div className="ppt-creds-box">
                  <div className="cred-col">
                    <span className="cred-role">Super Admin:</span>
                    <span className="cred-val">admin</span>
                    <span className="cred-pass">admin123</span>
                  </div>
                  <div className="cred-divider" />
                  <div className="cred-col">
                    <span className="cred-role">Dealer Admin:</span>
                    <span className="cred-val">bmw_admin</span>
                    <span className="cred-pass">bmw_secret</span>
                  </div>
                </div>
              </div>

              {/* Right Dark Navy Card: Why It Matters for Sales */}
              <div className="ppt-card-navy">
                <div className="ppt-navy-label cyan-text">WHY IT MATTERS FOR SALES</div>

                <div className="ppt-sales-list">
                  <div className="ppt-sales-item">
                    <div className="ppt-sales-icon-box">
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <div className="ppt-sales-title">Spot weak videos fast</div>
                      <div className="ppt-sales-desc">Fix them before customers see them</div>
                    </div>
                  </div>

                  <div className="ppt-sales-item">
                    <div className="ppt-sales-icon-box">
                      <Users size={18} />
                    </div>
                    <div>
                      <div className="ppt-sales-title">Coach dealers with facts</div>
                      <div className="ppt-sales-desc">Show exactly what to improve</div>
                    </div>
                  </div>

                  <div className="ppt-sales-item">
                    <div className="ppt-sales-icon-box">
                      <FileSpreadsheet size={18} />
                    </div>
                    <div>
                      <div className="ppt-sales-title">Scale with one Excel file</div>
                      <div className="ppt-sales-desc">Hundreds of links, runs in background</div>
                    </div>
                  </div>

                  <div className="ppt-sales-item">
                    <div className="ppt-sales-icon-box">
                      <Database size={18} />
                    </div>
                    <div>
                      <div className="ppt-sales-title">Every result saved</div>
                      <div className="ppt-sales-desc">Dealer, vehicle and advisor on record</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ppt-slide-footer">
              <span>QualityLens | Sales &amp; Marketing Overview</span>
              <span>3</span>
            </div>

            <div className="slide-next-prompt" onClick={goToNext}>
              <span>Next: Live Portal: Executive Dashboard &amp; Video Inspector</span>
              <ChevronDown size={16} className="bounce-arrow" />
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SLIDE 4: LIVE PORTAL — EXECUTIVE DASHBOARD & VIDEO INSPECTOR */}
        {/* ============================================================== */}
        <section id="slide-4" className="keynote-slide slide-ppt-card">
          <div className="slide-content">
            <div className="ppt-slide-topbar">
              <div className="ppt-dual-logos">
                <img src="/focus-engineering-logo.png" alt="Focus Engineering" className="ppt-focus-logo" />
                <img src="/qualitylens-logo.png" alt="QualityLens" className="ppt-ql-logo" />
              </div>
              <h1 className="ppt-slide-title">Live Portal: Executive Dashboard &amp; Video Inspector</h1>
            </div>

            {/* Portal Window Mockup */}
            <div className="portal-window-wrap">
              {/* Chrome Header */}
              <div className="portal-chrome-header">
                <div className="portal-chrome-left">
                  <div className="portal-dots">
                    <span className="portal-dot red" />
                    <span className="portal-dot yellow" />
                    <span className="portal-dot green" />
                  </div>
                  <div className="portal-breadcrumb">
                    <span>QualityLens AI Suite</span>
                    <span>/</span>
                    <span>Executive Analytics &amp; Inspection</span>
                    <span>/</span>
                    <strong>BMW Landmark Auto Chennai</strong>
                  </div>
                </div>
                <div className="portal-chrome-right">
                  <div className="portal-dealer-badge">
                    <Car size={13} /> CitNOW Video: CitNOW-94809 (BMW 320d)
                  </div>
                  <div className="portal-live-status-pill">
                    <span className="pulse-circle" /> 14,930 Audited • Real-Time AI
                  </div>
                </div>
              </div>

              {/* 2-Column Split: Left Executive Dashboard / Right Live Video Inspector */}
              <div className="portal-dash-split" style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', gridTemplateColumns: '1.05fr 1.15fr', gap: '1.25rem' }}>
                {/* Left Column: KPI Cockpit & Defect Analytics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                  {/* 4 Mini KPI Cards */}
                  <div className="portal-kpi-row" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                    <div className="portal-kpi-card" style={{ padding: '0.75rem 0.95rem' }}>
                      <span className="portal-kpi-label"><Gauge size={13} /> Fleet Quality Index</span>
                      <span className="portal-kpi-val text-blue" style={{ fontSize: '1.45rem' }}>8.4<small style={{ fontSize: '0.85rem', color: '#64748b' }}> / 10</small></span>
                      <span className="portal-kpi-sub green">↑ +14.2% MoM (Target: 8.0)</span>
                    </div>
                    <div className="portal-kpi-card" style={{ padding: '0.75rem 0.95rem' }}>
                      <span className="portal-kpi-label"><CheckCircle2 size={13} /> CitNOW Compliance</span>
                      <span className="portal-kpi-val text-green" style={{ fontSize: '1.45rem' }}>91.8%</span>
                      <span className="portal-kpi-sub green">13,705 videos pass OEM standard</span>
                    </div>
                    <div className="portal-kpi-card" style={{ padding: '0.75rem 0.95rem' }}>
                      <span className="portal-kpi-label"><AlertTriangle size={13} /> Re-Records Prevented</span>
                      <span className="portal-kpi-val text-red" style={{ fontSize: '1.45rem' }}>1,280</span>
                      <span className="portal-kpi-sub red">Intercepted before customer view</span>
                    </div>
                    <div className="portal-kpi-card" style={{ padding: '0.75rem 0.95rem' }}>
                      <span className="portal-kpi-label"><Users size={13} /> Advisor Resolution</span>
                      <span className="portal-kpi-val text-cyan" style={{ fontSize: '1.45rem' }}>96.4%</span>
                      <span className="portal-kpi-sub blue">Micro-coaching completed &lt;48h</span>
                    </div>
                  </div>

                  {/* 30-Day Video Quality Evolution SVG Chart */}
                  <div className="portal-chart-box" style={{ padding: '0.95rem 1.15rem' }}>
                    <div className="portal-box-header">
                      <span className="portal-box-title" style={{ fontSize: '0.82rem' }}>
                        <TrendingUp size={14} className="text-blue" /> 30-Day Quality Evolution Curve
                      </span>
                      <span className="ppt-cyan-tag" style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem' }}>LIVE FLEET</span>
                    </div>
                    <svg className="portal-chart-svg" viewBox="0 0 480 110" style={{ height: '110px' }}>
                      <defs>
                        <linearGradient id="chartGrad7" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <line x1="30" y1="20" x2="460" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="30" y1="55" x2="460" y2="55" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="30" y1="36" x2="460" y2="36" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3 3" />
                      <text x="360" y="32" fill="#10b981" fontSize="8.5" fontWeight="700">OEM Target (8.0)</text>
                      <polygon points="30,95 80,82 140,78 200,60 260,54 320,42 380,34 430,26 460,20 460,100 30,100" fill="url(#chartGrad7)" />
                      <polyline points="30,95 80,82 140,78 200,60 260,54 320,42 380,34 430,26 460,20" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="30" cy="95" r="3.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                      <circle cx="200" cy="60" r="3.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                      <circle cx="460" cy="20" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                      <text x="30" y="106" fill="#94a3b8" fontSize="8" fontWeight="600">Day 01 (6.1)</text>
                      <text x="200" y="106" fill="#94a3b8" fontSize="8" fontWeight="600">Day 15 (7.8)</text>
                      <text x="420" y="106" fill="#2563eb" fontSize="8" fontWeight="800">Today (8.4)</text>
                    </svg>
                  </div>

                  {/* Top Detected Flaws */}
                  <div className="portal-chart-box" style={{ padding: '0.85rem 1.15rem' }}>
                    <div className="portal-box-header" style={{ marginBottom: '0.35rem' }}>
                      <span className="portal-box-title" style={{ fontSize: '0.82rem' }}>
                        <Sliders size={14} className="text-cyan" /> Root-Cause Signal Flaws
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#64748b' }}>OCTOBER STATS</span>
                    </div>
                    <div className="defect-bars-list" style={{ gap: '0.5rem' }}>
                      <div className="defect-bar-item">
                        <div className="defect-bar-info" style={{ fontSize: '0.72rem' }}>
                          <span>📹 Camera Shake (Optical Flow &gt; 3.2px)</span>
                          <strong className="text-red">42% (538 videos)</strong>
                        </div>
                        <div className="defect-bar-track" style={{ height: '6px' }}>
                          <div className="defect-bar-fill fill-red" style={{ width: '42%' }} />
                        </div>
                      </div>
                      <div className="defect-bar-item">
                        <div className="defect-bar-info" style={{ fontSize: '0.72rem' }}>
                          <span>🎙️ Pneumatic Tool Noise (SNR &lt; 18 dB)</span>
                          <strong style={{ color: '#d97706' }}>28% (358 videos)</strong>
                        </div>
                        <div className="defect-bar-track" style={{ height: '6px' }}>
                          <div className="defect-bar-fill fill-amber" style={{ width: '28%' }} />
                        </div>
                      </div>
                      <div className="defect-bar-item">
                        <div className="defect-bar-info" style={{ fontSize: '0.72rem' }}>
                          <span>💡 Wheelarch Backlighting (Lum &lt; 85)</span>
                          <strong style={{ color: '#d97706' }}>18% (230 videos)</strong>
                        </div>
                        <div className="defect-bar-track" style={{ height: '6px' }}>
                          <div className="defect-bar-fill fill-amber" style={{ width: '18%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Video Inspector with Laser Scanner & Audio Spectrum */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {/* Player Container */}
                  <div className="portal-player-mockup">
                    <div className="player-screen-area" style={{ height: '200px' }}>
                      {/* Sweeping Laser Scan Line */}
                      <div className="laser-scan-beam" />
                      <div style={{ position: 'relative', width: '92%', height: '88%', background: '#131b2e', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Car size={70} color="#334155" style={{ opacity: 0.6 }} />
                        <div className="frame-defect-box" style={{ top: '22%', left: '15%' }}>
                          <AlertTriangle size={12} />
                          <span>FRAME 01:42 | Handheld Shake (3.4px)</span>
                        </div>
                        <div style={{ position: 'absolute', top: '8px', left: '10px', background: 'rgba(15, 23, 42, 0.85)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                          CITNOW 1080p60 STREAM • BAY 5
                        </div>
                      </div>
                    </div>

                    {/* Bottom Audio Spectrum Controls */}
                    <div className="player-controls-bottom" style={{ padding: '0.5rem 0.85rem' }}>
                      <div className="player-scrub-bar"><div className="player-scrub-fill" style={{ width: '52%' }} /></div>
                      <div className="player-toolbar">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Play size={13} color="#38bdf8" />
                          <span className="player-time-badge">01:42 / 03:15</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>ACOUSTIC DSP EQUALIZER:</span>
                          <div className="eq-spectrum-wrap">
                            <span className="eq-bar" />
                            <span className="eq-bar" />
                            <span className="eq-bar" />
                            <span className="eq-bar" />
                            <span className="eq-bar" />
                            <span className="eq-bar" />
                            <span className="eq-bar" />
                            <span className="eq-bar" />
                            <span className="eq-bar" />
                            <span className="eq-bar" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Diagnostic Scores & Multilingual Transcript */}
                  <div className="inspector-detail-card" style={{ padding: '0.95rem 1.15rem', gap: '0.65rem' }}>
                    <div className="inspector-score-header">
                      <div className="inspector-score-pill">
                        <span className="score-main" style={{ fontSize: '1.6rem' }}>3.3</span>
                        <span className="score-base">/ 10</span>
                        <span className="score-flag">Poor Quality Flag</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>AUDIT STATUS</span>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#dc2626' }}>RE-RECORD RECOMMENDED</div>
                      </div>
                    </div>

                    {/* Multilingual Card */}
                    <div className="transcript-card" style={{ padding: '0.55rem 0.75rem' }}>
                      <div className="transcript-header-row">
                        <span><Languages size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> OpenAI Whisper + Meta NLLB-200</span>
                        <span style={{ color: '#2563eb', fontWeight: 800 }}>Tamil → English</span>
                      </div>
                      <div className="orig-text" style={{ fontSize: '0.74rem' }}>"வணக்கம் சார், பிரேக் பேட் 3mm தான் இருக்கு, மாத்தணும்..."</div>
                      <div className="trans-english" style={{ fontSize: '0.76rem', padding: '0.3rem 0.5rem' }}>
                        <strong>AI English Translation:</strong> "Hello sir, your brake pad thickness is only 3mm remaining and requires immediate replacement."
                      </div>
                    </div>

                    <div className="ppt-coach-note" style={{ padding: '0.5rem 0.75rem', fontSize: '0.74rem' }}>
                      <strong>💡 AI Coaching:</strong> Hold camera steady with two hands for 3s on brake rotor. Pneumatic impact wrench in adjacent bay caused 14.2 dB SNR drop.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ppt-slide-footer">
              <span>QualityLens | Live Dealership Enterprise Portal Suite</span>
              <span>4</span>
            </div>

            <div className="slide-next-prompt" onClick={goToNext}>
              <span>Next: Live Portal: Batch Ingestion &amp; Coaching Leaderboard</span>
              <ChevronDown size={16} className="bounce-arrow" />
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SLIDE 5: LIVE PORTAL — BATCH INGESTION & COACHING LEADERBOARD */}
        {/* ============================================================== */}
        <section id="slide-5" className="keynote-slide slide-ppt-card">
          <div className="slide-content">
            <div className="ppt-slide-topbar">
              <div className="ppt-dual-logos">
                <img src="/focus-engineering-logo.png" alt="Focus Engineering" className="ppt-focus-logo" />
                <img src="/qualitylens-logo.png" alt="QualityLens" className="ppt-ql-logo" />
              </div>
              <h1 className="ppt-slide-title">Live Portal: Batch Ingestion &amp; Coaching Leaderboard</h1>
            </div>

            <div className="portal-window-wrap">
              <div className="portal-chrome-header">
                <div className="portal-chrome-left">
                  <div className="portal-dots">
                    <span className="portal-dot red" />
                    <span className="portal-dot yellow" />
                    <span className="portal-dot green" />
                  </div>
                  <div className="portal-breadcrumb">
                    <span>QualityLens Operations</span>
                    <span>/</span>
                    <span>Bulk Upload &amp; Technician Coaching</span>
                    <span>/</span>
                    <strong>Automated Dealership Quality Engine</strong>
                  </div>
                </div>
                <div className="portal-chrome-right">
                  <div className="portal-dealer-badge">
                    <Layers size={13} /> 8 Parallel Worker Threads
                  </div>
                  <div className="portal-live-status-pill">
                    <span className="pulse-circle" /> MongoDB Atlas Replicated
                  </div>
                </div>
              </div>

              {/* Body: Left Bulk Ingestion / Right Leaderboard */}
              <div className="portal-batch-grid">
                {/* Left: Bulk Excel Upload & Ingestion Engine */}
                <div className="batch-upload-box">
                  <div className="portal-box-header">
                    <span className="portal-box-title"><FileSpreadsheet size={16} className="text-blue" /> CitNOW Bulk Excel (.xlsx) Pipeline</span>
                    <span className="ppt-cyan-tag" style={{ fontSize: '0.68rem' }}>ZERO API RETRAINING</span>
                  </div>

                  <div className="dropzone-mockup">
                    <FileSpreadsheet size={32} color="#2563eb" />
                    <span className="dropzone-title">CitNOW_Batch_Export_October.xlsx</span>
                    <span className="dropzone-sub">450 CitNOW video URLs ingested across 6 Dealership Service Bays</span>
                  </div>

                  <div className="batch-queue-list">
                    <div className="batch-queue-item">
                      <div className="batch-file-info">
                        <CheckCircle size={15} color="#15803d" />
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>Batch_Morning_Run.xlsx</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>150 videos audited • Avg score: 8.6/10</div>
                        </div>
                      </div>
                      <span className="batch-status-chip done">100% AUDITED</span>
                    </div>

                    <div className="batch-queue-item">
                      <div className="batch-file-info">
                        <RefreshCw size={15} color="#2563eb" className="animate-spin" />
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>Batch_Afternoon_Run.xlsx</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>260 / 300 processed • 8 async threads</div>
                        </div>
                      </div>
                      <span className="batch-status-chip processing">PROCESSING 86%</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem' }}>
                    <button className="ppt-btn-open-demo" style={{ flex: 1, padding: '0.55rem', fontSize: '0.82rem', justifyContent: 'center' }}>
                      <Download size={14} /> Export OEM Compliance Report (.csv)
                    </button>
                  </div>
                </div>

                {/* Right: Dealership Technician Coaching Leaderboard */}
                <div className="leaderboard-box">
                  <div className="portal-box-header">
                    <span className="portal-box-title"><Award size={16} className="text-yellow-600" /> Workshop Technician Leaderboard</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>MONTH-TO-DATE</span>
                  </div>

                  <div className="leaderboard-list">
                    <div className="leader-item">
                      <div className="leader-rank-info">
                        <span className="rank-badge top-1">1</span>
                        <div>
                          <div className="leader-name">Rajesh K. <span className="ppt-cyan-tag" style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem' }}>TOP PERFORMER</span></div>
                          <div className="leader-bay">Bay 2 • 142 videos • 0 defects</div>
                        </div>
                      </div>
                      <span className="leader-score high">9.4 / 10</span>
                    </div>

                    <div className="leader-item">
                      <div className="leader-rank-info">
                        <span className="rank-badge top-2">2</span>
                        <div>
                          <div className="leader-name">David V.</div>
                          <div className="leader-bay">Bay 4 • 118 videos • 98% clarity</div>
                        </div>
                      </div>
                      <span className="leader-score high">9.1 / 10</span>
                    </div>

                    <div className="leader-item">
                      <div className="leader-rank-info">
                        <span className="rank-badge">3</span>
                        <div>
                          <div className="leader-name">Amit S.</div>
                          <div className="leader-bay">Bay 1 • 96 videos • Steady camera</div>
                        </div>
                      </div>
                      <span className="leader-score high">8.6 / 10</span>
                    </div>

                    <div className="leader-item" style={{ background: '#fff5f5', borderColor: '#fecaca' }}>
                      <div className="leader-rank-info">
                        <span className="rank-badge flagged">!</span>
                        <div>
                          <div className="leader-name" style={{ color: '#991b1b' }}>Suresh M.</div>
                          <div className="leader-bay" style={{ color: '#b91c1c' }}>Bay 5 • 82 videos • Camera shake flagged</div>
                        </div>
                      </div>
                      <span className="leader-score low">4.1 / 10</span>
                    </div>
                  </div>

                  {/* Automated WhatsApp Dispatch Card */}
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.76rem', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Smartphone size={20} color="#2563eb" style={{ flexShrink: 0 }} />
                    <div>
                      <strong>Automated Coaching Webhook:</strong> WhatsApp micro-lesson automatically dispatched to Suresh M. (Bay 5) with a 15-second video tip on 2-handed camera stability.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ppt-slide-footer">
              <span>QualityLens | Live Dealership Enterprise Portal Suite</span>
              <span>5</span>
            </div>

            <div className="slide-next-prompt" onClick={goToNext}>
              <span>Next: Competitive Advantage &amp; 6-Platform Benchmark</span>
              <ChevronDown size={16} className="bounce-arrow" />
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SLIDE 6: COMPETITIVE ADVANTAGE & 6-PLATFORM BENCHMARK */}
        {/* ============================================================== */}
        <section id="slide-6" className="keynote-slide slide-ppt-card">
          <div className="slide-content">
            <div className="ppt-slide-topbar">
              <div className="ppt-dual-logos">
                <img src="/focus-engineering-logo.png" alt="Focus Engineering" className="ppt-focus-logo" />
                <img src="/qualitylens-logo.png" alt="QualityLens" className="ppt-ql-logo" />
              </div>
              <h1 className="ppt-slide-title">Competitive Advantage &amp; 6-Platform Benchmark</h1>
            </div>

            {/* Competitor Switcher */}
            <div className="competitor-nav-tabs" style={{ marginBottom: '0.85rem' }}>
              <button
                className={`comp-tab-btn ${activeCompetitor === 'myKaarma' ? 'active' : ''}`}
                onClick={() => setActiveCompetitor('myKaarma')}
              >
                vs. myKaarma (Tech Video Grader)
              </button>
              <button
                className={`comp-tab-btn ${activeCompetitor === 'TwelveLabs' ? 'active' : ''}`}
                onClick={() => setActiveCompetitor('TwelveLabs')}
              >
                vs. TwelveLabs (Marengo / Pegasus)
              </button>
              <button
                className={`comp-tab-btn ${activeCompetitor === 'Kimoby' ? 'active' : ''}`}
                onClick={() => setActiveCompetitor('Kimoby')}
              >
                vs. Kimoby &amp; TruVideo
              </button>
            </div>

            {/* Active Competitor Analysis Card: Full View 2-Column Split Layout */}
            <div className="head-to-head-card" style={{ padding: '1.15rem 1.35rem', gap: '0.85rem' }}>
              {activeCompetitor === 'myKaarma' && (
                <>
                  <div className="h2h-header-banner" style={{ padding: '0.65rem 1rem' }}>
                    <div>
                      <span className="h2h-comp-badge">INCUMBENT LIMITATION</span>
                      <strong style={{ marginLeft: '0.65rem', color: '#0f172a', fontSize: '0.88rem' }}>myKaarma AI Tech Video Grader (ServiceCart™)</strong>
                    </div>
                    <span className="h2h-ql-badge">QUALITYLENS ADVANTAGE: 100% CITNOW NATIVE</span>
                  </div>

                  <div className="h2h-split-grid" style={{ gap: '1rem' }}>
                    <div className="h2h-competitor-col" style={{ padding: '0.95rem 1.15rem', gap: '0.65rem' }}>
                      <div className="h2h-col-title" style={{ fontSize: '0.92rem' }}>
                        <AlertTriangle size={16} /> myKaarma Architectural Bottlenecks
                      </div>
                      <div className="h2h-flaws-list" style={{ gap: '0.55rem' }}>
                        <div className="h2h-flaw-item" style={{ fontSize: '0.78rem' }}>
                          <span className="flaw-x-icon">✕</span>
                          <div><strong>Requires App Replacement:</strong> Dealerships must discard CitNOW and force technicians onto myKaarma mobile apps, violating OEM partner mandates.</div>
                        </div>
                        <div className="h2h-flaw-item" style={{ fontSize: '0.78rem' }}>
                          <span className="flaw-x-icon">✕</span>
                          <div><strong>Black-Box Pass/Fail:</strong> Only provides a coarse binary label. Does not measure physical 2D Laplacian focus or Optical Flow camera shake.</div>
                        </div>
                        <div className="h2h-flaw-item" style={{ fontSize: '0.78rem' }}>
                          <span className="flaw-x-icon">✕</span>
                          <div><strong>No Indian Language Support:</strong> Strictly English/Spanish; fails when Indian technicians speak Tamil, Telugu, Hindi, or Gujarati.</div>
                        </div>
                      </div>
                    </div>

                    <div className="h2h-qualitylens-col" style={{ padding: '0.95rem 1.15rem', gap: '0.65rem' }}>
                      <div className="h2h-ql-title" style={{ fontSize: '0.92rem' }}>
                        <Award size={16} /> Why QualityLens Dominates
                      </div>
                      <div className="h2h-points-grid" style={{ gap: '0.55rem' }}>
                        <div className="h2h-point" style={{ fontSize: '0.78rem' }}>
                          <span className="point-num">1</span>
                          <div><strong>Zero App Change (100% CitNOW Native):</strong> Automated AI QA layer directly on CitNOW URLs and bulk Excel exports with zero workflow disruption.</div>
                        </div>
                        <div className="h2h-point" style={{ fontSize: '0.78rem' }}>
                          <span className="point-num">2</span>
                          <div><strong>Deterministic Signal Physics:</strong> 2D Laplacian focus variance, Farnebäck Dense Optical Flow, 8×8 DCT, and Spectral SNR in dB for root-cause diagnosis.</div>
                        </div>
                        <div className="h2h-point" style={{ fontSize: '0.78rem' }}>
                          <span className="point-num">3</span>
                          <div><strong>14+ Indian Regional Dialects:</strong> Seamless zero-shot transcription and translation via OpenAI Whisper + Meta NLLB-200 into corporate English.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h2h-showdown-strip" style={{ padding: '0.65rem 0.95rem' }}>
                    <div className="showdown-spec-col">
                      <span className="spec-dim">CitNOW Compatibility</span>
                      <span className="spec-ql-val"><CheckCircle2 size={12} /> 100% Native (.xlsx)</span>
                      <span className="spec-comp-val">Requires App Swap</span>
                    </div>
                    <div className="showdown-spec-col">
                      <span className="spec-dim">Camera Shake Physics</span>
                      <span className="spec-ql-val"><CheckCircle2 size={12} /> Optical Flow Math</span>
                      <span className="spec-comp-val">None (Coarse Check)</span>
                    </div>
                    <div className="showdown-spec-col">
                      <span className="spec-dim">Indian Regional NLP</span>
                      <span className="spec-ql-val"><CheckCircle2 size={12} /> 14+ Dialects</span>
                      <span className="spec-comp-val">English / Spanish Only</span>
                    </div>
                    <div className="showdown-spec-col">
                      <span className="spec-dim">Dealership Setup Time</span>
                      <span className="spec-ql-val"><CheckCircle2 size={12} /> Instant (No Install)</span>
                      <span className="spec-comp-val">3–6 Months Retraining</span>
                    </div>
                  </div>
                </>
              )}

              {activeCompetitor === 'TwelveLabs' && (
                <>
                  <div className="h2h-header-banner" style={{ padding: '0.65rem 1rem' }}>
                    <div>
                      <span className="h2h-comp-badge">HORIZONTAL API</span>
                      <strong style={{ marginLeft: '0.65rem', color: '#0f172a', fontSize: '0.88rem' }}>TwelveLabs Marengo 3.5 &amp; Pegasus 1.6 Video Foundation Models</strong>
                    </div>
                    <span className="h2h-ql-badge">QUALITYLENS ADVANTAGE: TURNKEY AUTOMOTIVE SAAS</span>
                  </div>

                  <div className="h2h-split-grid" style={{ gap: '1rem' }}>
                    <div className="h2h-competitor-col" style={{ padding: '0.95rem 1.15rem', gap: '0.65rem' }}>
                      <div className="h2h-col-title" style={{ fontSize: '0.92rem' }}>
                        <AlertTriangle size={16} /> TwelveLabs Developer Infrastructure Limits
                      </div>
                      <div className="h2h-flaws-list" style={{ gap: '0.55rem' }}>
                        <div className="h2h-flaw-item" style={{ fontSize: '0.78rem' }}>
                          <span className="flaw-x-icon">✕</span>
                          <div><strong>Raw Developer API, No Product:</strong> No dealer dashboards, no CitNOW scraper, no VIN parser, and no technician coaching scorecards.</div>
                        </div>
                        <div className="h2h-flaw-item" style={{ fontSize: '0.78rem' }}>
                          <span className="flaw-x-icon">✕</span>
                          <div><strong>Vectors Cannot Measure Physics:</strong> 512d semantic vectors smooth over pixel blur, camera shake, and audio SNR.</div>
                        </div>
                        <div className="h2h-flaw-item" style={{ fontSize: '0.78rem' }}>
                          <span className="flaw-x-icon">✕</span>
                          <div><strong>Prohibitive Per-Minute API Costs:</strong> Indexing tens of thousands of 3-minute walkarounds incurs huge monthly recurring cloud fees.</div>
                        </div>
                      </div>
                    </div>

                    <div className="h2h-qualitylens-col" style={{ padding: '0.95rem 1.15rem', gap: '0.65rem' }}>
                      <div className="h2h-ql-title" style={{ fontSize: '0.92rem' }}>
                        <Award size={16} /> Why QualityLens Dominates
                      </div>
                      <div className="h2h-points-grid" style={{ gap: '0.55rem' }}>
                        <div className="h2h-point" style={{ fontSize: '0.78rem' }}>
                          <span className="point-num">1</span>
                          <div><strong>Turnkey Automotive Vertical SaaS:</strong> Ready on Day 1 for BMW, Audi, and Mercedes dealerships with pre-configured OEM standards.</div>
                        </div>
                        <div className="h2h-point" style={{ fontSize: '0.78rem' }}>
                          <span className="point-num">2</span>
                          <div><strong>Deterministic Physical Defect Isolation:</strong> Pinpoints exact millisecond of camera shake or loud workshop tool noise.</div>
                        </div>
                        <div className="h2h-point" style={{ fontSize: '0.78rem' }}>
                          <span className="point-num">3</span>
                          <div><strong>Sub-Second Local EC2 Compute:</strong> High-speed OpenCV and Librosa math computed locally without expensive vector token fees.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h2h-showdown-strip" style={{ padding: '0.65rem 0.95rem' }}>
                    <div className="showdown-spec-col">
                      <span className="spec-dim">Platform Category</span>
                      <span className="spec-ql-val"><CheckCircle2 size={12} /> Turnkey Dealership SaaS</span>
                      <span className="spec-comp-val">Raw Infrastructure API</span>
                    </div>
                    <div className="showdown-spec-col">
                      <span className="spec-dim">Blur &amp; Shake Math</span>
                      <span className="spec-ql-val"><CheckCircle2 size={12} /> Exact Signal Physics</span>
                      <span className="spec-comp-val">None (Semantic Vectors)</span>
                    </div>
                    <div className="showdown-spec-col">
                      <span className="spec-dim">CitNOW Link Scraper</span>
                      <span className="spec-ql-val"><CheckCircle2 size={12} /> Built-in Async Scraper</span>
                      <span className="spec-comp-val">Must Code from Scratch</span>
                    </div>
                    <div className="showdown-spec-col">
                      <span className="spec-dim">Operating Cost</span>
                      <span className="spec-ql-val"><CheckCircle2 size={12} /> Lightweight EC2 Compute</span>
                      <span className="spec-comp-val">High Per-Minute API Fee</span>
                    </div>
                  </div>
                </>
              )}

              {activeCompetitor === 'Kimoby' && (
                <>
                  <div className="h2h-header-banner" style={{ padding: '0.65rem 1rem' }}>
                    <div>
                      <span className="h2h-comp-badge">PROPRIETARY CAPTURE APP</span>
                      <strong style={{ marginLeft: '0.65rem', color: '#0f172a', fontSize: '0.88rem' }}>Kimoby &amp; TruVideo Dealership Video Systems</strong>
                    </div>
                    <span className="h2h-ql-badge">QUALITYLENS ADVANTAGE: 0 LOCK-IN + AUDIT PHILOSOPHY</span>
                  </div>

                  <div className="h2h-split-grid" style={{ gap: '1rem' }}>
                    <div className="h2h-competitor-col" style={{ padding: '0.95rem 1.15rem', gap: '0.65rem' }}>
                      <div className="h2h-col-title" style={{ fontSize: '0.92rem' }}>
                        <AlertTriangle size={16} /> Kimoby &amp; TruVideo Vendor Lock-In
                      </div>
                      <div className="h2h-flaws-list" style={{ gap: '0.55rem' }}>
                        <div className="h2h-flaw-item" style={{ fontSize: '0.78rem' }}>
                          <span className="flaw-x-icon">✕</span>
                          <div><strong>Aggressive Rip-and-Replace:</strong> Demands terminating existing CitNOW agreements and replacing dealership hardware with proprietary apps.</div>
                        </div>
                        <div className="h2h-flaw-item" style={{ fontSize: '0.78rem' }}>
                          <span className="flaw-x-icon">✕</span>
                          <div><strong>Masks Noise Instead of Auditing:</strong> TruVideo uses destructive generative noise gates that garble technician voices during impact tool firing.</div>
                        </div>
                        <div className="h2h-flaw-item" style={{ fontSize: '0.78rem' }}>
                          <span className="flaw-x-icon">✕</span>
                          <div><strong>Zero Indian Dialect Intelligence:</strong> Built for North American/European DMS without localized Indian dealership awareness.</div>
                        </div>
                      </div>
                    </div>

                    <div className="h2h-qualitylens-col" style={{ padding: '0.95rem 1.15rem', gap: '0.65rem' }}>
                      <div className="h2h-ql-title" style={{ fontSize: '0.92rem' }}>
                        <Award size={16} /> Why QualityLens Dominates
                      </div>
                      <div className="h2h-points-grid" style={{ gap: '0.55rem' }}>
                        <div className="h2h-point" style={{ fontSize: '0.78rem' }}>
                          <span className="point-num">1</span>
                          <div><strong>Zero Vendor Friction:</strong> Preserves existing CitNOW contracts, OEM accreditation, and technician habits completely intact.</div>
                        </div>
                        <div className="h2h-point" style={{ fontSize: '0.78rem' }}>
                          <span className="point-num">2</span>
                          <div><strong>Diagnostic Acoustic Auditing:</strong> Quantifies Harmonic-to-Noise Ratio (HNR) and RMS dBFS so managers coach proper microphone discipline.</div>
                        </div>
                        <div className="h2h-point" style={{ fontSize: '0.78rem' }}>
                          <span className="point-num">3</span>
                          <div><strong>Multi-Tenant Dual-Cluster MongoDB:</strong> Enterprise multi-brand portal with custom scoring thresholds configured for each dealership network.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h2h-showdown-strip" style={{ padding: '0.65rem 0.95rem' }}>
                    <div className="showdown-spec-col">
                      <span className="spec-dim">Vendor Lock-In</span>
                      <span className="spec-ql-val"><CheckCircle2 size={12} /> Zero (CitNOW Partner)</span>
                      <span className="spec-comp-val">Forced App Lock-in</span>
                    </div>
                    <div className="showdown-spec-col">
                      <span className="spec-dim">Audio Philosophy</span>
                      <span className="spec-ql-val"><CheckCircle2 size={12} /> Scientific Signal Audit</span>
                      <span className="spec-comp-val">Destructive Masking</span>
                    </div>
                    <div className="showdown-spec-col">
                      <span className="spec-dim">Automated Coaching</span>
                      <span className="spec-ql-val"><CheckCircle2 size={12} /> WhatsApp Micro-Lessons</span>
                      <span className="spec-comp-val">Generic DMS SMS</span>
                    </div>
                    <div className="showdown-spec-col">
                      <span className="spec-dim">Database Architecture</span>
                      <span className="spec-ql-val"><CheckCircle2 size={12} /> Dual-Cluster HA Atlas</span>
                      <span className="spec-comp-val">Single-Region Silos</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick 6-Platform Master Benchmark Matrix */}
            <div className="matrix-table-wrap" style={{ marginTop: '0.85rem' }}>
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Capability</th>
                    <th className="highlight-col">QualityLens (Focus Eng.)</th>
                    <th>myKaarma</th>
                    <th>TwelveLabs</th>
                    <th>Kimoby</th>
                    <th>TruVideo</th>
                    <th>CitNOW Workshop</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="dim-title">Platform Category</td>
                    <td className="highlight-cell">CitNOW AI QA Layer</td>
                    <td>Service Lane Suite</td>
                    <td>Raw Foundation API</td>
                    <td>DMS Messaging App</td>
                    <td>Video App + GenAI</td>
                    <td>OEM Video Capture</td>
                  </tr>
                  <tr>
                    <td className="dim-title">CitNOW Integration</td>
                    <td className="highlight-cell">Native (URLs &amp; Bulk .xlsx)</td>
                    <td>Requires App Swap</td>
                    <td>Must Code Custom</td>
                    <td>Requires Kimoby App</td>
                    <td>Requires TruVideo App</td>
                    <td>Native App Capture</td>
                  </tr>
                  <tr>
                    <td className="dim-title">Visual Signal Physics</td>
                    <td className="highlight-cell">Laplacian, Optical Flow, DCT</td>
                    <td>Part Framing Check</td>
                    <td>None (Semantic Vectors)</td>
                    <td>LLM Visual Check</td>
                    <td>Stream Checks</td>
                    <td>Manual Video Review</td>
                  </tr>
                  <tr>
                    <td className="dim-title">Indian Regional NLP</td>
                    <td className="highlight-cell">14+ Languages (Whisper + NLLB)</td>
                    <td>English / Spanish Only</td>
                    <td>Moderate (36 langs)</td>
                    <td>North America Only</td>
                    <td>Moderate (50+ langs)</td>
                    <td>None</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="ppt-slide-footer">
              <span>QualityLens | Strategic Advantage &amp; Competitive Intelligence Report v3.0</span>
              <span>6</span>
            </div>

            <div className="slide-next-prompt" onClick={goToNext}>
              <span>Next: AI Architecture, Formula &amp; Live Simulator</span>
              <ChevronDown size={16} className="bounce-arrow" />
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SLIDE 7: AI ARCHITECTURE, FORMULA & LIVE SIMULATOR */}
        {/* ============================================================== */}
        <section id="slide-7" className="keynote-slide slide-ppt-card">
          <div className="slide-content">
            <div className="ppt-slide-topbar">
              <div className="ppt-dual-logos">
                <img src="/focus-engineering-logo.png" alt="Focus Engineering" className="ppt-focus-logo" />
                <img src="/qualitylens-logo.png" alt="QualityLens" className="ppt-ql-logo" />
              </div>
              <h1 className="ppt-slide-title">AI Architecture, Formula &amp; Live Simulator</h1>
            </div>

            <div className="sim-roadmap-grid">
              {/* Left Column: Stack & Formulas */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="tech-stack-card" style={{ padding: '1.25rem 1.35rem' }}>
                  <h3 className="tech-card-title" style={{ fontSize: '1.05rem', marginBottom: '0.65rem' }}>Multi-Modal Processing Stack</h3>
                  <div className="stack-layer-item">
                    <div className="stack-layer-name">Ingestion &amp; API:</div>
                    <div className="stack-layer-detail">FastAPI, Uvicorn, Async CitNOW link scraper &amp; chunked MP4 download</div>
                  </div>
                  <div className="stack-layer-item">
                    <div className="stack-layer-name">Computer Vision (55%):</div>
                    <div className="stack-layer-detail">OpenCV 4.x, FFmpeg, NumPy (Sharpness 30%, Stability 30%, DCT 20%, Lighting 20%)</div>
                  </div>
                  <div className="stack-layer-item">
                    <div className="stack-layer-name">Acoustic DSP (45%):</div>
                    <div className="stack-layer-detail">Librosa, PyDub, SciPy (Speech Clarity 40%, Spectral SNR dB 35%, RMS Volume 25%)</div>
                  </div>
                  <div className="stack-layer-item">
                    <div className="stack-layer-name">Speech &amp; NLP Pipeline:</div>
                    <div className="stack-layer-detail">OpenAI Whisper ASR, Meta NLLB-200 (14+ languages), Facebook BART-large-CNN</div>
                  </div>
                </div>

                <div className="scoring-formula-card" style={{ padding: '1.15rem 1.35rem' }}>
                  <h3 className="tech-card-title" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Mathematical Scoring Formula (0.0 to 10.0)</h3>
                  <div className="formula-box" style={{ padding: '0.65rem 0.85rem', gap: '0.3rem' }}>
                    <div className="math-line" style={{ fontSize: '0.74rem' }}>
                      <strong>Video Quality</strong> = 0.30(Sharpness) + 0.30(Stability) + 0.20(Resolution) + 0.20(Lighting) - P_defects
                    </div>
                    <div className="math-line" style={{ fontSize: '0.74rem' }}>
                      <strong>Audio Quality</strong> = 0.40(Clarity) + 0.35(SNR_dB) + 0.25(RMS_Volume) - P_defects
                    </div>
                    <div className="math-line highlight" style={{ fontSize: '0.78rem' }}>
                      <strong>Overall Quality Score</strong> = 0.55 × VideoQuality + 0.45 × AudioQuality - P_critical
                    </div>
                  </div>

                  <div className="tier-pills-row" style={{ marginTop: '0.65rem' }}>
                    <div className="tier-badge-pill excellent" style={{ padding: '0.35rem 0.65rem' }}>
                      <span style={{ fontSize: '0.76rem' }}>⭐ Excellent (8.0–10.0)</span>
                    </div>
                    <div className="tier-badge-pill good" style={{ padding: '0.35rem 0.65rem' }}>
                      <span style={{ fontSize: '0.76rem' }}>✔ Good (6.0–7.9)</span>
                    </div>
                    <div className="tier-badge-pill fair" style={{ padding: '0.35rem 0.65rem' }}>
                      <span style={{ fontSize: '0.76rem' }}>⚠️ Fair (4.0–5.9)</span>
                    </div>
                    <div className="tier-badge-pill poor" style={{ padding: '0.35rem 0.65rem' }}>
                      <span style={{ fontSize: '0.76rem' }}>❌ Poor (&lt;4.0)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live AI Simulator & 2026 Roadmap */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="sim-live-box" style={{ padding: '1.25rem 1.35rem' }}>
                  <div className="sim-live-header" style={{ marginBottom: '0.85rem' }}>
                    <span className="ppt-cyan-tag">LIVE CITNOW AI TESTBENCH</span>
                    <div className="sim-presets-inline">
                      {samplePresets.map((p) => (
                        <button
                          key={p.id}
                          className={`preset-pill ${selectedPreset.id === p.id ? 'active' : ''}`}
                          onClick={() => handleSelectPreset(p)}
                        >
                          {p.label.split(' ')[1]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sim-live-body" style={{ gap: '0.75rem' }}>
                    <div className="sim-score-strip-clean">
                      <div className="clean-score-box">
                        <span className="cs-label">Overall Score</span>
                        <span className="cs-val text-green">{simResults.overallScore}</span>
                      </div>
                      <div className="clean-score-box">
                        <span className="cs-label">Video Visuals</span>
                        <span className="cs-val text-blue">{simResults.videoScore}</span>
                      </div>
                      <div className="clean-score-box">
                        <span className="cs-label">Audio Clarity</span>
                        <span className="cs-val text-cyan">{simResults.audioScore}</span>
                      </div>
                    </div>

                    <div className="sim-trans-box">
                      <div className="trans-header">
                        <Languages size={13} /> Zero-Shot Regional Translation: <strong>{simResults.lang}</strong>
                      </div>
                      <div className="trans-body">"{simResults.translation}"</div>
                    </div>

                    <button className="btn-sim-test-now" onClick={handleRunAnalysis} disabled={isAnalyzing}>
                      {isAnalyzing ? `Analyzing Frames (${simProgress}%)...` : '⚡ Re-Run QualityLens Engine'}
                    </button>
                  </div>
                </div>

                {/* 2026 Strategic Roadmap & CTAs */}
                <div className="roadmap-box" style={{ padding: '1.15rem 1.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h3 className="roadmap-title" style={{ margin: 0, fontSize: '0.98rem' }}>2026 Strategic Advantage Roadmap</h3>
                    <span className="ppt-cyan-tag" style={{ fontSize: '0.65rem' }}>BEATING GLOBAL RIVALS</span>
                  </div>

                  <div className="roadmap-items-list" style={{ gap: '0.55rem' }}>
                    <div className="roadmap-item" style={{ gap: '0.65rem' }}>
                      <div className="roadmap-badge" style={{ width: '20px', height: '20px', fontSize: '0.7rem' }}>1</div>
                      <div style={{ fontSize: '0.78rem' }}>
                        <strong>Visual-Verbal Alignment (Beating Kimoby):</strong> Cross-checks Whisper transcript with vision keyframes to verify camera points at spoken parts.
                      </div>
                    </div>
                    <div className="roadmap-item" style={{ gap: '0.65rem' }}>
                      <div className="roadmap-badge" style={{ width: '20px', height: '20px', fontSize: '0.7rem' }}>2</div>
                      <div style={{ fontSize: '0.78rem' }}>
                        <strong>Pre-Send Quality Webhook (Beating myKaarma):</strong> Dispatches instant WhatsApp alert if Score &lt; 4.0 for technician re-shoot before car leaves bay.
                      </div>
                    </div>
                  </div>

                  <div className="roadmap-cta-row" style={{ marginTop: '0.85rem' }}>
                    <button className="btn-launch-primary" onClick={() => navigate('/login')}>
                      Launch QualityLens Portal <ArrowRight size={14} />
                    </button>
                    <button className="btn-download-deck" onClick={handleDownloadPpt}>
                      <Download size={14} /> Download Full Deck (.pptx)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="ppt-slide-footer">
              <span>QualityLens | Strategic Advantage &amp; Competitive Intelligence Report v3.0</span>
              <span>7</span>
            </div>

            <div className="slide-back-prompt" onClick={() => goToSlide(0)}>
              <ChevronUp size={16} className="bounce-arrow-up" />
              <span>Back to Slide 1 (Objectives &amp; Problem Solved)</span>
            </div>
          </div>
        </section>
      </main>

      {/* 4. FLOATING PRESENTATION CONTROLLER DOCK (BOTTOM DOCK) */}
      <div className="presentation-dock">
        <button
          className="dock-nav-btn prev"
          onClick={goToPrev}
          disabled={currentSlide === 0}
          title="Previous Slide (Arrow Up / Left)"
        >
          <ChevronLeft size={18} /> Prev
        </button>

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
                Schedule a 15-minute live screen walkthrough with an automotive AI specialist. We will benchmark 10 of your actual CitNOW videos against OEM standards.
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
