import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button, Container, Typography, Box, Grid, Card, CardContent, Chip, LinearProgress, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TrendingUp, Shield, Zap, Code, Users, CheckCircle, AlertCircle, ArrowRight, ExternalLink, Mail, ChevronDown, Database, Lock, Globe, Sparkles } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Logo from './logo.png';
import * as THREE from 'three';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3C79FF' },
    secondary: { main: '#A033FF' },
    background: { default: '#0A092A', paper: '#1a1847' },
    text: { primary: '#FFFFFF', secondary: '#B8B5D1' }
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
  }
});

// Three.js Background Animation
const ThreeJSBackground = () => {
  const mountRef = useRef(null);
  
  useEffect(() => {
    if (!mountRef.current) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0A092A, 1);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: 0x3C79FF,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Create glowing spheres
    const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xA033FF,
      transparent: true,
      opacity: 0.3
    });
    
    const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere1.position.set(-15, 10, -20);
    scene.add(sphere1);
    
    const sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere2.position.set(15, -10, -20);
    scene.add(sphere2);
    
    // Add lights
    const light1 = new THREE.PointLight(0x3C79FF, 2, 100);
    light1.position.set(-15, 10, -10);
    scene.add(light1);
    
    const light2 = new THREE.PointLight(0xA033FF, 2, 100);
    light2.position.set(15, -10, -10);
    scene.add(light2);
    
    camera.position.z = 30;
    
    let mouseX = 0;
    let mouseY = 0;
    
    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    document.addEventListener('mousemove', onMouseMove);
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;
      
      sphere1.rotation.x += 0.01;
      sphere1.rotation.y += 0.01;
      sphere2.rotation.x -= 0.01;
      sphere2.rotation.y -= 0.01;
      
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onMouseMove);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  
  return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
};

// Animated Counter
const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime;
          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);
  
  return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

// Glowing Card with Hover Effect
const GlowCard = ({ children, className = '', glowColor = '#3C79FF' }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'transform 0.3s ease'
      }}
    >
      {isHovered && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            width: '300px',
            height: '300px',
            background: `radial-gradient(circle, ${glowColor}40 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
      {children}
    </div>
  );
};

// Market Growth Chart
const MarketGrowthChart = () => {
  const data = [
    { year: '2024', value: 20, projection: 20 },
    { year: '2025', value: 35, projection: 40 },
    { year: '2026', value: 50, projection: 80 },
    { year: '2027', value: 80, projection: 150 },
    { year: '2028', value: 120, projection: 250 },
    { year: '2029', value: 200, projection: 380 },
    { year: '2030', value: 320, projection: 500 }
  ];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3C79FF" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3C79FF" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorProjection" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#A033FF" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#A033FF" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#3C79FF20" />
        <XAxis dataKey="year" stroke="#FFFFFF60" />
        <YAxis stroke="#FFFFFF60" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1a1847', 
            border: '1px solid #3C79FF',
            borderRadius: '8px'
          }}
        />
        <Area type="monotone" dataKey="value" stroke="#3C79FF" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
        <Area type="monotone" dataKey="projection" stroke="#A033FF" fillOpacity={1} fill="url(#colorProjection)" strokeWidth={3} strokeDasharray="5 5" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Revenue Chart
const RevenueChart = () => {
  const data = [
    { year: 'Y1', revenue: 1.85, ebitda: -1.59 },
    { year: 'Y2', revenue: 7.5, ebitda: 0.2 },
    { year: 'Y3', revenue: 23.5, ebitda: 5.45 },
    { year: 'Y4', revenue: 38, ebitda: 12.5 },
    { year: 'Y5', revenue: 52.5, ebitda: 20.85 }
  ];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3C79FF20" />
        <XAxis dataKey="year" stroke="#FFFFFF60" />
        <YAxis stroke="#FFFFFF60" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1a1847', 
            border: '1px solid #3C79FF',
            borderRadius: '8px'
          }}
          formatter={(value) => `$${value}M`}
        />
        <Line type="monotone" dataKey="revenue" stroke="#3C79FF" strokeWidth={3} dot={{ fill: '#3C79FF', r: 6 }} />
        <Line type="monotone" dataKey="ebitda" stroke="#71F5FF" strokeWidth={3} dot={{ fill: '#71F5FF', r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Competitive Analysis Radar
const CompetitiveRadar = () => {
  const data = [
    { metric: 'Speed', us: 95, competitors: 40 },
    { metric: 'Accuracy', us: 98, competitors: 75 },
    { metric: 'Coverage', us: 90, competitors: 30 },
    { metric: 'Cost', us: 85, competitors: 45 },
    { metric: 'Compliance', us: 100, competitors: 60 }
  ];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="#3C79FF40" />
        <PolarAngleAxis dataKey="metric" stroke="#FFFFFF80" />
        <PolarRadiusAxis stroke="#FFFFFF40" />
        <Radar name="CreditLiquidity" dataKey="us" stroke="#3C79FF" fill="#3C79FF" fillOpacity={0.6} strokeWidth={2} />
        <Radar name="Competitors" dataKey="competitors" stroke="#FF4444" fill="#FF4444" fillOpacity={0.3} strokeWidth={2} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1a1847', 
            border: '1px solid #3C79FF',
            borderRadius: '8px'
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

// Floating Elements
const FloatingElement = ({ children, delay = 0, duration = 3 }) => {
  return (
    <div
      className="animate-float"
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  );
};

// Main Component
const App = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const openWhitepaper = () => {
    window.open('https://docs.google.com/document/d/1wbPb2OW_-BKtR0HtDCcnBP7JpfW2x4JVS5DdRd7RzWQ/edit?usp=sharing', '_blank');
  };

  const openPitchDeck = () => {
    window.open('https://drive.google.com/file/d/1Y8pJQnmpgv-aN3wD3LMzeazA55saxi0E/view?usp=sharing', '_blank');
  };

  

  return (
    <ThemeProvider theme={theme}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(60, 121, 255, 0.5); }
          50% { box-shadow: 0 0 40px rgba(60, 121, 255, 0.8); }
        }
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>
      
      <div className="relative min-h-screen bg-[#0A092A] text-white overflow-hidden">
        
        <ThreeJSBackground />

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">

          <Container maxWidth="lg" className="relative z-10">

            <div className="text-center space-y-1">
              
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
                <FloatingElement delay={0}>
                                    <img 
                    src={Logo} 
                    alt="CreditLiquidity Logo" 
                    className="mx-auto "
                    style={{height:"200px", width:"200px"}}
                  />
                  <div className="inline-block px-6 py-3 bg-gradient-to-r from-[#3C79FF]/20 to-[#A033FF]/20 border border-[#3C79FF]/50 rounded-full mb-6 pulse-glow">
                    <span className="text-[#71F5FF] text-sm font-semibold flex items-center gap-2">
                      <Sparkles size={16} />
                      Building the Future of Credit Infrastructure
                      <Sparkles size={16} />
                    </span>
                  </div>
                </FloatingElement>
              </div>
              
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
                <h1 className="text-6xl md:text-8xl font-bold leading-tight gradient-shift bg-gradient-to-r from-white via-[#71F5FF] via-[#3C79FF] to-[#A033FF] bg-clip-text text-transparent">
                  The Independent Valuation Layer for Tokenized Credit
                </h1>
              </div>
              
              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
                <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto font-light">
                  Real-time, audit-grade credit analysis that unlocks{' '}
                  <span className="text-[#3C79FF] font-bold">$500B</span> in institutional capital
                </p>
              </div>
              
              <div className="animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                  Protocols have yields. Institutions have capital. But auditors reject protocol-provided valuations. 
                  We're the <span className="text-[#A033FF] font-semibold">compliance infrastructure layer</span> that bridges the gap.
                </p>
              </div>
              
              <div className="animate-fade-in-up flex flex-col sm:flex-row gap-6 justify-center pt-8" style={{ animationDelay: '0.5s', opacity: 0 }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={openWhitepaper}
                  className="bg-gradient-to-r from-[#3C79FF] to-[#A033FF] hover:from-[#3C79FF]/90 hover:to-[#A033FF]/90 px-10 py-5 text-lg font-bold shadow-xl shadow-[#3C79FF]/50 transform transition-all hover:scale-105"
                  endIcon={<ExternalLink size={22} />}
                >
                  Read the Whitepaper
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  className="border-2 border-[#3C79FF] text-[#3C79FF] hover:bg-[#3C79FF]/20 px-10 py-5 text-lg font-bold transform transition-all hover:scale-105"
                  onClick={openPitchDeck}

                  endIcon={<ArrowRight size={22} />}
                >
                  Request Pitch Deck
                </Button>
              </div>
              
              <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[
                  { value: 120, suffix: '+', label: 'Institutional Interviews', color: '#3C79FF' },
                  { value: 73, suffix: '%', label: 'Cite Valuation as #1 Blocker', color: '#A033FF' },
                  { value: 52, suffix: '%', label: 'Willing to Pay $150K/Year', color: '#71F5FF' }
                ].map((stat, i) => (
                  <FloatingElement key={i} delay={i * 0.2} duration={3 + i}>
                    <GlowCard glowColor={stat.color}>
                      <div className="bg-gradient-to-br from-[#1a1847]/80 to-[#0A092A]/50 backdrop-blur-xl p-8 rounded-2xl border border-[#3C79FF]/30 hover:border-[#3C79FF] transition-all">
                        <div className="text-5xl font-bold mb-3" style={{ color: stat.color }}>
                          <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                        </div>
                        <div className="text-sm text-gray-300 font-medium">{stat.label}</div>
                      </div>
                    </GlowCard>
                  </FloatingElement>
                ))}
              </div>
              
              <div className="pt-12 animate-bounce">
                <IconButton className="text-[#3C79FF]">
                  <ChevronDown size={40} />
                </IconButton>
              </div>
            </div>
          </Container>
        </section>

        {/* Problem Section */}
        <section className="relative py-32 px-4 bg-gradient-to-b from-transparent via-[#1a1847]/20 to-transparent">
          <Container maxWidth="lg" className="relative z-10">
            <div className="text-center mb-20">
              <FloatingElement>
                <h2 className="text-6xl font-bold mb-6">
                  <span className="text-[#3C79FF]">$20B</span> Market.{' '}
                  <span className="gradient-shift bg-gradient-to-r from-[#FF4444] to-[#FFA033] bg-clip-text text-transparent">
                    One Critical Blocker.
                  </span>
                </h2>
              </FloatingElement>
              <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Tokenized credit hit $20B TVL, but institutional allocators can't deploy capital. 
                The problem isn't yields, regulation, or technology risk.{' '}
                <span className="text-[#A033FF] font-bold text-3xl">It's audit compliance.</span>
              </p>
            </div>
            
            <Grid container spacing={6}>
              {[
                {
                  icon: <AlertCircle size={48} />,
                  emoji: '❌',
                  title: 'Protocol-Provided NAVs',
                  problem: 'Auditors reject them',
                  detail: 'Conflict of interest: borrowers valuing their own collateral',
                  color: '#FF4444',
                  gradient: 'from-[#FF4444]/20 to-[#FF4444]/5'
                },
                {
                  icon: <TrendingUp size={48} />,
                  emoji: '❌',
                  title: 'Internal Models',
                  problem: 'Cost $200-400K annually',
                  detail: 'Still need external validation. Don\'t scale beyond 1,000 loans',
                  color: '#FFA033',
                  gradient: 'from-[#FFA033]/20 to-[#FFA033]/5'
                },
                {
                  icon: <Shield size={48} />,
                  emoji: '❌',
                  title: 'Traditional Bureaus',
                  problem: 'Zero tokenized coverage',
                  detail: '60-90 day lags. Built for quarterly reporting, not 24/7 markets',
                  color: '#FF33A0',
                  gradient: 'from-[#FF33A0]/20 to-[#FF33A0]/5'
                }
              ].map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <GlowCard glowColor={item.color}>
                    <div className={`bg-gradient-to-br ${item.gradient} backdrop-blur-xl p-10 rounded-2xl border-2 border-[#3C79FF]/20 hover:border-[#3C79FF] h-full transition-all duration-500`}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-5xl">{item.emoji}</div>
                        <div style={{ color: item.color }}>{item.icon}</div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                      <p className="text-xl font-bold mb-4" style={{ color: item.color }}>{item.problem}</p>
                      <p className="text-gray-300 leading-relaxed">{item.detail}</p>
                    </div>
                  </GlowCard>
                </Grid>
              ))}
            </Grid>
            
            <div className="mt-20">
              <GlowCard glowColor="#3C79FF">
                <div className="p-10 bg-gradient-to-r from-[#3C79FF]/20 via-[#A033FF]/20 to-[#3C79FF]/20 border-l-8 border-[#3C79FF] rounded-2xl backdrop-blur-xl">
                  <p className="text-3xl italic text-gray-100 font-light mb-6 leading-relaxed">
                    "CFOs aren't blocking capital because they don't trust crypto — they can't pass audit."
                  </p>
                  <p className="text-lg text-[#71F5FF] font-semibold">
                    — Institutional Allocator, $4.2B AUM
                  </p>
                </div>
              </GlowCard>
            </div>
          </Container>
        </section>

        {/* Solution Section */}
        <section className="relative py-32 px-4">
          <Container maxWidth="lg" className="relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-6xl font-bold mb-6">
                Decentralized Credit Oracle.{' '}
                <span className="gradient-shift bg-gradient-to-r from-[#3C79FF] via-[#71F5FF] to-[#A033FF] bg-clip-text text-transparent">
                  Institutional-Grade.
                </span>
              </h2>
              <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
                <span className="text-[#3C79FF] font-bold">AI</span> +{' '}
                <span className="text-[#A033FF] font-bold">Human Validators</span> +{' '}
                <span className="text-[#71F5FF] font-bold">Byzantine Consensus</span> ={' '}
                Real-time marks that pass Basel III/Solvency II audit
              </p>
            </div>
            
            <Grid container spacing={6}>
              {[
                {
                  icon: <Code size={40} />,
                  emoji: '🤖',
                  title: 'Specialized AI Agents',
                  metric: '91-93%',
                  description: 'accuracy per credit type (CRE, Invoice, Consumer). Fine-tuned on 3,000+ historical loans. Not generic models — credit-specialized.',
                  gradient: 'from-[#3C79FF] to-[#71F5FF]',
                  delay: 0
                },
                {
                  icon: <Users size={40} />,
                  emoji: '👥',
                  title: 'Professional Validators',
                  metric: '98%+',
                  description: 'Credit analysts (CFA, CPA, CRA credentials) review edge cases. Final accuracy: 98%+. Auditors trust human oversight.',
                  gradient: 'from-[#A033FF] to-[#FF33A0]',
                  delay: 0.2
                },
                {
                  icon: <Zap size={40} />,
                  emoji: '⚡',
                  title: 'Byzantine Consensus',
                  metric: '4-15 min',
                  description: '8 validators. 6 must agree. Slashing for bad actors. Result on-chain in 4-15 minutes.',
                  gradient: 'from-[#71F5FF] to-[#3C79FF]',
                  delay: 0.4
                },
                {
                  icon: <CheckCircle size={40} />,
                  emoji: '✅',
                  title: 'Basel III Compliant',
                  metric: '100%',
                  description: 'Daily fair value marks. External validation. Audit-ready documentation. Zero conflicts of interest.',
                  gradient: 'from-[#A033FF] to-[#3C79FF]',
                  delay: 0.6
                }
              ].map((item, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <FloatingElement delay={item.delay} duration={3.5}>
                    <GlowCard glowColor={item.gradient.split(' ')[0].replace('from-[', '').replace(']', '')}>
                      <div className={`bg-gradient-to-br from-[#1a1847]/90 to-[#0A092A]/70 backdrop-blur-2xl p-10 rounded-2xl border-2 border-[#3C79FF]/30 hover:border-[#3C79FF] h-full transition-all duration-500`}>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="text-6xl">{item.emoji}</div>
                          <div className={`text-transparent bg-gradient-to-r ${item.gradient} bg-clip-text`}>
                            {item.icon}
                          </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
                        <div className={`text-5xl font-bold mb-6 gradient-shift bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                          {item.metric}
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed">{item.description}</p>
                      </div>
                    </GlowCard>
                  </FloatingElement>
                </Grid>
              ))}
            </Grid>
            
            {/* <div className="mt-16 text-center">
              <Button 
                variant="contained"
                size="large"
                className="bg-gradient-to-r from-[#3C79FF] to-[#A033FF] px-12 py-4 text-xl font-bold shadow-2xl shadow-[#3C79FF]/60 transform transition-all hover:scale-110"
                endIcon={<ArrowRight size={24} />}
              >
                See How It Works
              </Button>
            </div> */}
          </Container>
        </section>

        {/* How It Works Section */}
        <section className="relative py-32 px-4 bg-gradient-to-b from-transparent via-[#1a1847]/30 to-transparent">
          <Container maxWidth="lg" className="relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-6xl font-bold mb-6">
                Query to Result in{' '}
                <span className="gradient-shift bg-gradient-to-r from-[#71F5FF] to-[#3C79FF] bg-clip-text text-transparent">
                  15 Minutes
                </span>
              </h2>
            </div>
            
            <div className="space-y-12">
              {[
                {
                  step: '1',
                  title: 'Submit Query',
                  icon: <Database size={48} />,
                  detail: 'Protocol pays $1.50 (stablecoin or $DATA with 20% discount). Loan details, collateral info, borrower data.',
                  color: '#3C79FF',
                  position: 'left'
                },
                {
                  step: '2',
                  title: 'Parallel Processing',
                  icon: <Zap size={48} />,
                  detail: '8 validators process simultaneously. AI analyzes → Human reviews edge cases. 85% auto-approved, 12% quick review, 3% deep analysis.',
                  color: '#71F5FF',
                  position: 'right'
                },
                {
                  step: '3',
                  title: 'Byzantine Consensus',
                  icon: <Lock size={48} />,
                  detail: '6 of 8 must agree (within 10% range). Outliers penalized. Fraud slashed. No single point of failure.',
                  color: '#A033FF',
                  position: 'left'
                },
                {
                  step: '4',
                  title: 'On-Chain Publication',
                  icon: <Globe size={48} />,
                  detail: 'Credit score + Fair value + Risk factors + Confidence interval. Immutable. Audit-ready.',
                  color: '#FF33A0',
                  position: 'right'
                }
              ].map((item, index) => (
                <FloatingElement key={index} delay={index * 0.3} duration={4}>
                  <div className={`flex items-center gap-8 ${item.position === 'right' ? 'flex-row-reverse' : ''}`}>
                    <GlowCard glowColor={item.color} className="flex-1">
                      <div className="bg-gradient-to-br from-[#1a1847]/90 to-[#0A092A]/70 backdrop-blur-2xl p-10 rounded-2xl border-2 border-[#3C79FF]/30 hover:border-[#3C79FF] transition-all duration-500">
                        <div className="flex items-center gap-6 mb-6">
                          <div 
                            className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl shadow-2xl"
                            style={{ 
                              background: `linear-gradient(135deg, ${item.color}, ${item.color}80)`,
                              boxShadow: `0 0 40px ${item.color}80`
                            }}
                          >
                            {item.step}
                          </div>
                          <div style={{ color: item.color }}>
                            {item.icon}
                          </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
                        <p className="text-gray-300 text-lg leading-relaxed">{item.detail}</p>
                      </div>
                    </GlowCard>
                  </div>
                </FloatingElement>
              ))}
            </div>
            
            <div className="mt-20 text-center">
              <GlowCard glowColor="#71F5FF">
                <div className="bg-gradient-to-r from-[#71F5FF]/20 to-[#3C79FF]/20 p-10 rounded-2xl border-2 border-[#71F5FF]/50">
                  <p className="text-3xl font-bold text-white mb-4">
                    Real-time marks vs{' '}
                    <span className="text-[#FF4444]">60-90 day</span> industry standard
                  </p>
                  <p className="text-xl text-gray-300">
                    Mission-critical infrastructure for institutional compliance
                  </p>
                </div>
              </GlowCard>
            </div>
          </Container>
        </section>

        {/* Market Section with Chart */}
        <section className="relative py-32 px-4">
          <Container maxWidth="lg" className="relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-6xl font-bold mb-6">
                <span className="text-[#3C79FF]">$137M</span> Infrastructure Opportunity
              </h2>
            </div>
            
            <Grid container spacing={8}>
              <Grid item xs={12} md={6}>
                <GlowCard glowColor="#3C79FF">
                  <div className="bg-gradient-to-br from-[#1a1847]/90 to-[#0A092A]/70 backdrop-blur-2xl p-10 rounded-2xl border-2 border-[#3C79FF]/30 h-full">
                    <h3 className="text-3xl font-bold mb-8">Market Sizing</h3>
                    
                    <div className="space-y-8">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-[#3C79FF]">Today</span>
                          <span className="text-4xl font-bold text-[#3C79FF]">$25.3M</span>
                        </div>
                        <ul className="space-y-2 text-gray-300">
                          <li>• 18 lending protocols &gt;$50M TVL</li>
                          <li>• 25 institutional allocators</li>
                          <li>• 15 infrastructure providers</li>
                        </ul>
                      </div>
                      
                      <div className="h-px bg-gradient-to-r from-transparent via-[#3C79FF] to-transparent" />
                      
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-[#A033FF]">2030</span>
                          <span className="text-4xl font-bold text-[#A033FF]">$137.8M</span>
                        </div>
                        <ul className="space-y-2 text-gray-300">
                          <li>• Tokenized credit → $500B (BCG)</li>
                          <li>• 3-4× customer growth</li>
                          <li>• 30-50% ACV increase</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <GlowCard glowColor="#A033FF">
                  <div className="bg-gradient-to-br from-[#1a1847]/90 to-[#0A092A]/70 backdrop-blur-2xl p-10 rounded-2xl border-2 border-[#A033FF]/30 h-full">
                    <h3 className="text-3xl font-bold mb-8">Growth Trajectory</h3>
                    <MarketGrowthChart />
                    <p className="text-gray-300 text-center mt-6 text-lg">
                      <span className="text-[#3C79FF] font-bold">Blue:</span> Current Market | 
                      <span className="text-[#A033FF] font-bold"> Purple:</span> Projected Growth
                    </p>
                  </div>
                </GlowCard>
              </Grid>
            </Grid>
            
            <div className="mt-16">
              <GlowCard glowColor="#71F5FF">
                <div className="bg-gradient-to-r from-[#3C79FF]/20 to-[#A033FF]/20 p-10 rounded-2xl border-2 border-[#71F5FF]/30">
                  <h3 className="text-3xl font-bold mb-6 text-[#71F5FF]">The Reality</h3>
                  <p className="text-2xl text-gray-200 leading-relaxed">
                    Every tokenized loan needs independent valuation. Auditors mandate external sources. 
                    CFOs can't deploy capital without us.
                  </p>
                  <p className="text-xl text-[#3C79FF] font-bold mt-6">
                    We're building that layer before Chainlink or Bloomberg prioritize it.
                  </p>
                </div>
              </GlowCard>
            </div>
          </Container>
        </section>

        {/* Traction Section */}
        <section className="relative py-32 px-4 bg-gradient-to-b from-transparent via-[#1a1847]/30 to-transparent">
          <Container maxWidth="lg" className="relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-6xl font-bold mb-6">
                Technical Feasibility:{' '}
                <span className="gradient-shift bg-gradient-to-r from-[#00FF00] to-[#71F5FF] bg-clip-text text-transparent">
                  Proven
                </span>
              </h2>
              <p className="text-2xl text-gray-300">
                Not Raising to Prove Feasibility — Raising to <span className="text-[#3C79FF] font-bold">Implement</span>
              </p>
            </div>
            
            <Grid container spacing={6}>
              {[
                {
                  icon: <CheckCircle size={48} />,
                  title: 'AI Validated',
                  metric: '92.4%',
                  detail: 'accuracy on 3,000+ historical loans. Cost: $0.08/query vs $35-50 human analyst.',
                  color: '#00FF00'
                },
                // {
                //   icon: <CheckCircle size={48} />,
                //   title: 'Consensus Proven',
                //   metric: '100%',
                //   detail: 'success rate across 10,000 testnet simulations. Byzantine fault tolerance operational.',
                //   color: '#3C79FF'
                // },
                {
                  icon: <CheckCircle size={48} />,
                  title: 'Customer Discovery',
                  metric: '120',
                  detail: 'structured interviews (10× typical pre-seed). 52% willing to pay $150K/year for non-existent product.',
                  color: '#A033FF'
                },
                {
                  icon: <CheckCircle size={48} />,
                  title: 'Cost Advantage',
                  metric: '60-75%',
                  detail: 'cheaper than comparable oracle infrastructure. $1.50/query at production scale.',
                  color: '#71F5FF'
                }
              ].map((item, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <FloatingElement delay={index * 0.2} duration={3.5}>
                    <GlowCard glowColor={item.color}>
                      <div className="bg-gradient-to-br from-[#1a1847]/90 to-[#0A092A]/70 backdrop-blur-2xl p-10 rounded-2xl border-2 border-[#3C79FF]/30 hover:border-[#3C79FF] h-full transition-all duration-500">
                        <div className="flex items-center gap-4 mb-6" style={{ color: item.color }}>
                          {item.icon}
                        </div>
                        <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
                        <div className="text-6xl font-bold mb-6" style={{ color: item.color }}>
                          {item.metric}
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed">{item.detail}</p>
                      </div>
                    </GlowCard>
                  </FloatingElement>
                </Grid>
              ))}
            </Grid>
            
            <div className="mt-16">
              <GlowCard glowColor="#3C79FF">
                <div className="bg-gradient-to-r from-[#3C79FF]/20 to-[#A033FF]/20 p-10 rounded-2xl border-2 border-[#3C79FF]/50">
                  <p className="text-2xl font-bold text-white mb-4">
                    Pipeline: <span className="text-[#71F5FF]">7 active discussions</span> with protocols + institutions
                  </p>
                  <p className="text-xl text-gray-300">
                    Planning assumes <span className="text-[#FF4444] font-bold">zero convert</span> (conservative base case)
                  </p>
                </div>
              </GlowCard>
            </div>
          </Container>
        </section>

        {/* Competitive Advantage */}
     <section className="relative py-32 px-4">
        <Container maxWidth="lg" className="relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-bold mb-6">
              <span className="text-[#3C79FF]">18-24 Month</span> First-Mover Window
            </h2>
          </div>
          
          {/* CHANGE HERE: Added justifyContent="center" to center the grid items */}
          <Grid container spacing={3} justifyContent="center">
            {/* CHANGE HERE: Changed md={6} to md={5} to make the column narrower */}
            <Grid item xs={12} md={3}>
              <GlowCard glowColor="#A033FF">
                <div className="bg-gradient-to-br from-[#1a1847]/90 to-[#0A092A]/70 backdrop-blur-2xl p-10 rounded-2xl border-2 border-[#A033FF]/30 h-full">
                  <h3 className="text-3xl font-bold mb-8">Competitive Analysis</h3>
                  <CompetitiveRadar />
                </div>
              </GlowCard>
            </Grid>
            
            {/* CHANGE HERE: Changed md={6} to md={5} to match the other column */}
            <Grid item xs={12} md={3}>
              <div className="space-y-6">
                {[
                  { name: 'Spectral Finance', status: '$6.75M raised, no customers', advantage: 'Credit-specialized, 18mo head start', color: '#3C79FF' },
                  { name: 'Chainrisk', status: 'Compound-only', advantage: 'Protocol-agnostic, multi-credit', color: '#A033FF' },
                  { name: 'Traditional Bureaus', status: 'Zero tokenized coverage', advantage: 'Built for 24/7 crypto', color: '#71F5FF' }
                ].map((competitor, index) => (
                  <FloatingElement key={index} delay={index * 0.3} duration={3.5}>
                    <GlowCard glowColor={competitor.color}>
                      <div className="bg-gradient-to-br from-[#1a1847]/90 to-[#0A092A]/70 backdrop-blur-2xl p-8 rounded-2xl border-2 border-[#3C79FF]/30 hover:border-[#3C79FF] transition-all duration-500">
                        <h4 className="text-2xl font-bold mb-3" style={{ color: competitor.color }}>
                          {competitor.name}
                        </h4>
                        <p className="text-gray-400 mb-3">
                          <span className="font-semibold">Status:</span> {competitor.status}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-semibold text-[#71F5FF]">Our Advantage:</span> {competitor.advantage}
                        </p>
                      </div>
                    </GlowCard>
                  </FloatingElement>
                ))}
              </div>
            </Grid>
          </Grid>
      </Container>
    </section>

        {/* Financials Section */}
        <section className="relative py-32 px-4 bg-gradient-to-b from-transparent via-[#1a1847]/30 to-transparent">
          <Container maxWidth="lg" className="relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-6xl font-bold mb-6">
                Path to{' '}
                <span className="gradient-shift bg-gradient-to-r from-[#3C79FF] to-[#00FF00] bg-clip-text text-transparent">
                  $52.5M ARR
                </span>{' '}
                by Year 5
              </h2>
            </div>
            
            <GlowCard glowColor="#3C79FF">
              <div className="bg-gradient-to-br from-[#1a1847]/90 to-[#0A092A]/70 backdrop-blur-2xl p-10 rounded-2xl border-2 border-[#3C79FF]/30 mb-12">
                <RevenueChart />
                <p className="text-gray-300 text-center mt-6 text-lg">
                  <span className="text-[#3C79FF] font-bold">Blue:</span> Revenue | 
                  <span className="text-[#71F5FF] font-bold"> Cyan:</span> EBITDA
                </p>
              </div>
            </GlowCard>
            
            <Grid container spacing={6}>
              {[
                { label: 'CAC', value: '$18K', sublabel: 'Year 5', color: '#3C79FF' },
                { label: 'LTV', value: '$3.67M', sublabel: 'Lifetime Value', color: '#A033FF' },
                { label: 'LTV/CAC', value: '204×', sublabel: 'Return Ratio', color: '#71F5FF' },
                { label: 'Churn', value: '<5%', sublabel: 'Annual', color: '#00FF00' },
                { label: 'Payback', value: '5mo', sublabel: 'Period', color: '#FF33A0' },
                // { label: 'Margin', value: '40%', sublabel: 'Year 5 EBITDA', color: '#FFA033' }
              ].map((metric, index) => (
                <Grid item xs={6} md={4} key={index}>
                  <FloatingElement delay={index * 0.1} duration={3}>
                    <GlowCard glowColor={metric.color}>
                      <div className="bg-gradient-to-br from-[#1a1847]/80 to-[#0A092A]/50 backdrop-blur-xl p-8 rounded-2xl border border-[#3C79FF]/30 hover:border-[#3C79FF] transition-all text-center">
                        <div className="text-sm text-gray-400 mb-2">{metric.label}</div>
                        <div className="text-5xl font-bold mb-2" style={{ color: metric.color }}>
                          {metric.value}
                        </div>
                        <div className="text-sm text-gray-400">{metric.sublabel}</div>
                      </div>
                    </GlowCard>
                  </FloatingElement>
                </Grid>
              ))}
            </Grid>
          </Container>
        </section>

        {/* Investment Section */}
        <section className="relative py-32 px-4">
          <Container maxWidth="lg" className="relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-6xl font-bold mb-6">
                Pre-Seed SAFT:{' '}
                <span className="gradient-shift bg-gradient-to-r from-[#3C79FF] to-[#A033FF] bg-clip-text text-transparent">
                  $160-195K
                </span>
              </h2>
            </div>
            
            <Grid container spacing={8}>
              <Grid item xs={12} md={6}>
                <GlowCard glowColor="#3C79FF">
                  <div className="bg-gradient-to-br from-[#1a1847]/90 to-[#0A092A]/70 backdrop-blur-2xl p-10 rounded-2xl border-2 border-[#3C79FF]/30 h-full">
                    <h3 className="text-3xl font-bold mb-8">Investment Terms</h3>
                    <div className="space-y-6">
                      {[
                        { label: 'Structure', value: 'Simple Agreement for Future Tokens' },
                        { label: 'Amount', value: '$160-195K stablecoin' },
                        { label: 'Token Price', value: '$0.050 per $DATA' },
                        { label: 'Allocation', value: '3.2-3.9M tokens (0.32-0.39%)' },
                        { label: 'Vesting', value: '12-month linear, 6-month cliff' },
                        { label: 'Next Round', value: 'Seed minimum $0.075 (50% markup)' }
                      ].map((term, index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-[#0A092A]/50 rounded-lg">
                          <span className="text-gray-400 font-semibold">{term.label}</span>
                          <span className="text-white font-bold text-right">{term.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlowCard>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <GlowCard glowColor="#A033FF">
                  <div className="bg-gradient-to-br from-[#1a1847]/90 to-[#0A092A]/70 backdrop-blur-2xl p-10 rounded-2xl border-2 border-[#A033FF]/30 h-full">
                    <h3 className="text-3xl font-bold mb-8">Return Scenarios <span className="text-xl text-gray-400">(3-year hold)</span></h3>
                    <div className="space-y-6">
                      {[
                        { scenario: 'Bear', probability: '25%', price: '$0.065', return: '$26K (1.3×)', color: '#FF4444' },
                        { scenario: 'Base', probability: '55%', price: '$0.180', return: '$72K (3.6×)', color: '#3C79FF' },
                        { scenario: 'Bull', probability: '20%', price: '$0.350', return: '$140K (7.0×)', color: '#00FF00' },
                        { scenario: 'Acquisition', probability: '—', price: '$940M val', return: '$300-460K (15-23×)', color: '#A033FF' }
                      ].map((scenario, index) => (
                        <div key={index} className="p-6 bg-[#0A092A]/50 rounded-lg border" style={{ borderColor: `${scenario.color}40` }}>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xl font-bold" style={{ color: scenario.color }}>{scenario.scenario}</span>
                            <span className="text-sm text-gray-400">{scenario.probability}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-gray-400">Token Price</span>
                            <span className="text-white font-semibold">{scenario.price}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Return</span>
                            <span className="text-white font-bold text-lg">{scenario.return}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 p-6 bg-gradient-to-r from-[#3C79FF]/20 to-[#A033FF]/20 rounded-lg border-2 border-[#3C79FF]/50">
                      <p className="text-2xl font-bold text-center">
                        Expected: <span className="text-[#00FF00]">3.7× (57% IRR)</span>
                      </p>
                    </div>
                  </div>
                </GlowCard>
              </Grid>
            </Grid>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="relative py-32 px-4 bg-gradient-to-b from-transparent via-[#1a1847]/40 to-[#0A092A]">
          <Container maxWidth="lg" className="relative z-10">
            <FloatingElement duration={4}>
              <GlowCard glowColor="#3C79FF">
                <div className="bg-gradient-to-br from-[#1a1847]/95 to-[#0A092A]/80 backdrop-blur-3xl p-16 rounded-3xl border-4 border-[#3C79FF]/50">
                  <div className="text-center mb-12">
                    <h2 className="text-6xl font-bold mb-6">
                      This Is{' '}
                      <span className="gradient-shift bg-gradient-to-r from-[#3C79FF] via-[#71F5FF] to-[#A033FF] bg-clip-text text-transparent">
                        Infrastructure
                      </span>
                      , Not Speculation
                    </h2>
                    <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                      If tokenized credit scales to <span className="text-[#3C79FF] font-bold">$500B by 2030</span>, 
                      every loan needs independent valuation. Auditors mandate external sources. 
                      <span className="text-[#A033FF] font-bold"> CFOs can't deploy capital without us.</span>
                    </p>
                    <p className="text-3xl font-bold text-white mt-8">
                      We're building that layer.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                    <div className="text-center space-y-4">
                      <div className="text-6xl mb-4">📄</div>
                      <h3 className="text-2xl font-bold">Read the Whitepaper</h3>
                      <p className="text-gray-400">Comprehensive technical architecture, market analysis, financial model</p>
                      <Button 
                        variant="contained"
                        size="large"
                        onClick={openWhitepaper}
                        className="bg-gradient-to-r from-[#3C79FF] to-[#A033FF] px-8 py-3 font-bold shadow-xl shadow-[#3C79FF]/50 transform transition-all hover:scale-110"
                        endIcon={<ExternalLink size={20} />}
                      >
                        Download Whitepaper
                      </Button>
                    </div>
                    
                    {/* <div className="text-center space-y-4">
                      <div className="text-6xl mb-4">🚀</div>
                      <h3 className="text-2xl font-bold">Request Early Access</h3>
                      <p className="text-gray-400">Get on the waitlist for production launch (Q3 2025)</p>
                      <Button 
                        variant="outlined"
                        size="large"
                        className="border-2 border-[#3C79FF] text-[#3C79FF] hover:bg-[#3C79FF]/20 px-8 py-3 font-bold transform transition-all hover:scale-110"
                        endIcon={<ArrowRight size={20} />}
                      >
                        Request Access
                      </Button>
                    </div> */}
                    
                    <div className="text-center space-y-4">
                      <div className="text-6xl mb-4">💼</div>
                      <h3 className="text-2xl font-bold">Participate in Pre-Seed</h3>
                      <p className="text-gray-400">$160-195K raise closing mid-February 2025</p>
                      <Button 
                        variant="contained"
                        size="large"
                        href="mailto:amin29199@gmail.com"
                        className="bg-gradient-to-r from-[#A033FF] to-[#FF33A0] px-8 py-3 font-bold shadow-xl shadow-[#A033FF]/50 transform transition-all hover:scale-110"
                        endIcon={<Mail size={20} />}
                      >
                        Contact Us
                      </Button>
                    </div>
                  </div>
                </div>
              </GlowCard>
            </FloatingElement>
          </Container>
        </section>

        {/* Footer */}
        <footer className="relative py-16 px-4 border-t border-[#3C79FF]/20">
          <Container maxWidth="lg" className="relative z-10">
            <Grid container spacing={6}>
              <Grid item xs={12} md={4}>
                <h3 className="text-2xl font-bold mb-4 gradient-shift bg-gradient-to-r from-[#3C79FF] to-[#A033FF] bg-clip-text text-transparent">
                  CreditLiquidity Protocol
                </h3>
                <p className="text-gray-400 mb-4">
                  The Independent Valuation Layer for Tokenized Credit
                </p>
                <div className="flex gap-4">
                  <a href="mailto:amin29199@gmail.com" className="text-[#3C79FF] hover:text-[#71F5FF] transition-colors">
                    <Mail size={24} />
                  </a>
                  <a href="#" className="text-[#3C79FF] hover:text-[#71F5FF] transition-colors">
                    <ExternalLink size={24} />
                  </a>
                </div>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <h4 className="text-lg font-bold mb-4 text-[#71F5FF]">Timeline</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>• Pre-seed closes: Mid-February 2025</li>
                  <li>• MVP Launch: Month 8</li>
                  <li>• Seed Raise: Month 9</li>
                  <li>• Production Launch: Q3 2025</li>
                </ul>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <h4 className="text-lg font-bold mb-4 text-[#71F5FF]">Legal</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Dubai VARA entity (formation in progress)
                </p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Disclaimer: $DATA is a utility token, not a security. High risk of total loss. 
                  Past performance does not guarantee future results. This is not investment advice.
                </p>
              </Grid>
            </Grid>
            
            <div className="mt-12 pt-8 border-t border-[#3C79FF]/20 text-center">
              <p className="text-gray-500 text-sm">
                © 2025 CreditLiquidity Protocol. All rights reserved.
              </p>
            </div>
          </Container>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default App;