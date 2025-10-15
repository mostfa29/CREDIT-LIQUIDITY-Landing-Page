import React, { useState, useEffect, useRef } from 'react';
import { Button, Container, Typography, Box, Grid, Card, CardContent, Chip, IconButton } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TrendingUp, Shield, Zap, Code, Users, CheckCircle, AlertCircle, ArrowRight, ExternalLink, Mail, ChevronDown, Database, Lock, Globe, Sparkles, Activity, Target } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);
  
  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
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

// Glowing Card
const GlowCard = ({ children, glowColor = '#3C79FF' }) => {
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
      style={{
        position: 'relative',
        overflow: 'hidden',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'transform 0.3s ease'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            left: mousePosition.x,
            top: mousePosition.y,
            width: '300px',
            height: '300px',
            background: `radial-gradient(circle, ${glowColor}40 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none'
          }}
        />
      )}
      {children}
    </div>
  );
};

// Floating Element
const FloatingElement = ({ children, delay = 0 }) => {
  return (
    <div
      style={{
        animation: `float 3s ease-in-out infinite`,
        animationDelay: `${delay}s`
      }}
    >
      {children}
    </div>
  );
};

// Main Component
const App = () => {
  const openWhitepaper = () => {
    window.open('https://docs.google.com/document/d/1uEg_QXsAXNQYN9Mwq-FStjlH-q0BBHYq1TcTFBZWvKk/edit?usp=sharing', '_blank');
  };

  return (
    <ThemeProvider theme={theme}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
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
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-text {
          background: linear-gradient(90deg, #3C79FF, #71F5FF, #A033FF, #3C79FF);
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      
      <div style={{ position: 'relative', minHeight: '100vh', background: '#0A092A', color: 'white', overflow: 'hidden' }}>
        <ThreeJSBackground />

        {/* Hero Section */}
        <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
          <Container maxWidth="lg" style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
                <FloatingElement>
                  <div style={{ 
                    display: 'inline-block', 
                    padding: '12px 24px', 
                    background: 'linear-gradient(90deg, rgba(60, 121, 255, 0.2), rgba(160, 51, 255, 0.2))', 
                    border: '1px solid rgba(60, 121, 255, 0.5)', 
                    borderRadius: '50px',
                    animation: 'pulse-glow 2s ease-in-out infinite'
                  }}>
                    <span style={{ color: '#71F5FF', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={16} />
                      Transparent Credit Intelligence for On-Chain Finance
                      <Sparkles size={16} />
                    </span>
                  </div>
                </FloatingElement>
              </div>
              
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
                <h1 className="gradient-text" style={{ fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 'bold', lineHeight: 1.1, margin: 0 }}>
                  DataLiquidity Network
                </h1>
              </div>
              
              <div className="animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
                <p style={{ fontSize: 'clamp(20px, 3vw, 32px)', color: '#B8B5D1', maxWidth: '900px', margin: '0 auto', fontWeight: 300 }}>
                  Bringing institutional-grade credit assessments to decentralized lending
                </p>
              </div>
              
              <div className="animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
                <p style={{ fontSize: '18px', color: '#8B89A0', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
                  Verifiable credit ratings delivered in under 60 seconds. Using decentralized validators and cryptographic proofs to deliver transparent credit intelligence that institutions trust and auditors accept.
                </p>
              </div>
              
              <div className="animate-fade-in-up" style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', animationDelay: '0.5s', opacity: 0, marginTop: '16px' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={openWhitepaper}
                  style={{ 
                    background: 'linear-gradient(90deg, #3C79FF, #A033FF)', 
                    padding: '16px 40px', 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    boxShadow: '0 8px 32px rgba(60, 121, 255, 0.5)',
                    transition: 'transform 0.3s ease',
                    textTransform: 'none'
                  }}
                  endIcon={<ExternalLink size={22} />}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Read Whitepaper
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  href="mailto:amin29199@gmail.com"
                  style={{ 
                    border: '2px solid #3C79FF', 
                    color: '#3C79FF', 
                    padding: '16px 40px', 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    textTransform: 'none'
                  }}
                  endIcon={<Mail size={22} />}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(60, 121, 255, 0.2)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Get in Touch
                </Button>
              </div>
              
              <div style={{ marginTop: '64px' }}>
                <Grid container spacing={4}>
                  {[
                    { value: '2.95', suffix: 'T', label: 'Target Volume (Year 5)', color: '#3C79FF' },
                    { value: '60', suffix: 's', label: 'Assessment Finality', color: '#71F5FF' },
                    { value: '89.3', suffix: '%', label: 'Model Accuracy', color: '#A033FF' }
                  ].map((stat, i) => (
                    <Grid item xs={12} md={4} key={i}>
                      <FloatingElement delay={i * 0.2}>
                        <GlowCard glowColor={stat.color}>
                          <div style={{ 
                            background: 'linear-gradient(135deg, rgba(26, 24, 71, 0.8), rgba(10, 9, 42, 0.5))', 
                            backdropFilter: 'blur(20px)', 
                            padding: '32px', 
                            borderRadius: '16px', 
                            border: '1px solid rgba(60, 121, 255, 0.3)',
                            transition: 'border-color 0.3s ease'
                          }}>
                            <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px', color: stat.color }}>
                              <AnimatedCounter end={parseFloat(stat.value)} suffix={stat.suffix} />
                            </div>
                            <div style={{ fontSize: '14px', color: '#B8B5D1', fontWeight: 500 }}>{stat.label}</div>
                          </div>
                        </GlowCard>
                      </FloatingElement>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </div>
          </Container>
        </section>

        {/* Problem Section */}
        <section style={{ position: 'relative', padding: '128px 20px', background: 'linear-gradient(180deg, transparent, rgba(26, 24, 71, 0.2), transparent)' }}>
          <Container maxWidth="lg" style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <h2 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 'bold', marginBottom: '24px' }}>
                The Credit Market <span style={{ color: '#FF4444' }}>Problem</span>
              </h2>
              <p style={{ fontSize: '24px', color: '#B8B5D1', maxWidth: '900px', margin: '0 auto', lineHeight: 1.6 }}>
                Traditional credit rating agencies operate as black boxes. As trillions in credit moves on-chain, the old system won't work. <span style={{ color: '#3C79FF', fontWeight: 'bold' }}>We're building that infrastructure.</span>
              </p>
            </div>
            
            <Grid container spacing={4}>
              {[
                {
                  title: 'Secret Methodology',
                  description: 'Traditional agencies keep their methods hidden. No transparency, no accountability.',
                  icon: <Lock size={40} />
                },
                {
                  title: 'Conflicts of Interest',
                  description: 'Paid by the entities they rate. Remember 2008? The track record speaks for itself.',
                  icon: <AlertCircle size={40} />
                },
                {
                  title: 'Institutional Barriers',
                  description: 'DeFi protocols need transparent assessments. Institutions need verifiable data. Regulators need accountability.',
                  icon: <Shield size={40} />
                }
              ].map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <GlowCard glowColor="#3C79FF">
                    <div style={{ 
                      background: 'linear-gradient(135deg, rgba(26, 24, 71, 0.9), rgba(10, 9, 42, 0.7))', 
                      backdropFilter: 'blur(20px)', 
                      padding: '40px', 
                      borderRadius: '16px', 
                      border: '2px solid rgba(60, 121, 255, 0.2)',
                      height: '100%',
                      transition: 'border-color 0.5s ease'
                    }}>
                      <div style={{ color: '#3C79FF', marginBottom: '24px' }}>
                        {item.icon}
                      </div>
                      <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>{item.title}</h3>
                      <p style={{ color: '#B8B5D1', lineHeight: 1.6 }}>{item.description}</p>
                    </div>
                  </GlowCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </section>

        {/* How It Works */}
        <section style={{ position: 'relative', padding: '128px 20px' }}>
          <Container maxWidth="lg" style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <h2 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 'bold', marginBottom: '24px' }}>
                How It <span className="gradient-text">Works</span>
              </h2>
              <p style={{ fontSize: '24px', color: '#B8B5D1', maxWidth: '900px', margin: '0 auto' }}>
                Decentralized Validation + Cryptographic Proof
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
              {[
                {
                  step: '1',
                  title: 'Data Collection',
                  description: 'Credit data pulled from established sources (CoreLogic, Dun & Bradstreet, public records) with cryptographic authentication.',
                  icon: <Database size={48} />,
                  color: '#3C79FF'
                },
                {
                  step: '2',
                  title: 'Validator Network',
                  description: 'Independent validators analyze data using our AI model. Each validator stakes significant capital—they lose money if wrong.',
                  icon: <Users size={48} />,
                  color: '#71F5FF'
                },
                {
                  step: '3',
                  title: 'Consensus',
                  description: 'Multiple validators must agree. Outliers are penalized. No single validator controls the outcome.',
                  icon: <Activity size={48} />,
                  color: '#A033FF'
                },
                {
                  step: '4',
                  title: 'Proof Generation',
                  description: 'Cryptographic proof created showing correct assessment—without revealing proprietary model details.',
                  icon: <Lock size={48} />,
                  color: '#FF33A0'
                },
                {
                  step: '5',
                  title: 'Cross-Chain Publication',
                  description: 'Assessment published across Ethereum, Base, Polygon, Arbitrum for universal access.',
                  icon: <Globe size={48} />,
                  color: '#71F5FF'
                }
              ].map((item, index) => (
                <FloatingElement key={index} delay={index * 0.2}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px', flexDirection: index % 2 === 0 ? 'row' : 'row-reverse' }}>
                    <div style={{ 
                      minWidth: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${item.color}, ${item.color}80)`,
                      fontSize: '32px',
                      fontWeight: 'bold',
                      boxShadow: `0 0 40px ${item.color}80`
                    }}>
                      {item.step}
                    </div>
                    <GlowCard glowColor={item.color}>
                      <div style={{ 
                        flex: 1,
                        background: 'linear-gradient(135deg, rgba(26, 24, 71, 0.9), rgba(10, 9, 42, 0.7))', 
                        backdropFilter: 'blur(20px)', 
                        padding: '32px', 
                        borderRadius: '16px', 
                        border: '2px solid rgba(60, 121, 255, 0.3)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                          <div style={{ color: item.color }}>
                            {item.icon}
                          </div>
                          <h3 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{item.title}</h3>
                        </div>
                        <p style={{ color: '#B8B5D1', fontSize: '18px', lineHeight: 1.6, margin: 0 }}>{item.description}</p>
                      </div>
                    </GlowCard>
                  </div>
                </FloatingElement>
              ))}
            </div>
            
            <div style={{ marginTop: '64px', textAlign: 'center' }}>
              <GlowCard glowColor="#3C79FF">
                <div style={{ 
                  background: 'linear-gradient(90deg, rgba(60, 121, 255, 0.2), rgba(160, 51, 255, 0.2))', 
                  padding: '40px', 
                  borderRadius: '16px', 
                  border: '2px solid rgba(60, 121, 255, 0.5)'
                }}>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
                    <span className="gradient-text">Result:</span> Credit scores you can verify, delivered in under 60 seconds
                  </p>
                </div>
              </GlowCard>
            </div>
          </Container>
        </section>

        {/* For Protocols/Validators/Institutions */}
        <section style={{ position: 'relative', padding: '128px 20px', background: 'linear-gradient(180deg, transparent, rgba(26, 24, 71, 0.3), transparent)' }}>
          <Container maxWidth="lg" style={{ position: 'relative', zIndex: 10 }}>
            <Grid container spacing={6}>
              <Grid item xs={12} md={4}>
                <GlowCard glowColor="#3C79FF">
                  <div style={{ 
                    background: 'linear-gradient(135deg, rgba(26, 24, 71, 0.9), rgba(10, 9, 42, 0.7))', 
                    backdropFilter: 'blur(20px)', 
                    padding: '40px', 
                    borderRadius: '16px', 
                    border: '2px solid rgba(113, 245, 255, 0.3)',
                    height: '100%'
                  }}>
                    <Shield size={48} style={{ color: '#71F5FF', marginBottom: '24px' }} />
                    <h3 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>For Institutions</h3>
                    <p style={{ color: '#B8B5D1', fontSize: '16px', marginBottom: '24px' }}>Basel III-Compliant Infrastructure</p>
                    <ul style={{ color: '#8B89A0', fontSize: '15px', lineHeight: 2, listStyle: 'none', padding: 0 }}>
                      <li>✓ Portfolio risk assessment</li>
                      <li>✓ Regulatory compliance ready</li>
                      <li>✓ Cryptographic audit trails</li>
                      <li>✓ White-label options</li>
                      <li>✓ SLA guarantees available</li>
                    </ul>
                  </div>
                </GlowCard>
              </Grid>
            </Grid>
          </Container>
        </section>

        {/* Technology Section */}
        <section style={{ position: 'relative', padding: '128px 20px' }}>
          <Container maxWidth="lg" style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <h2 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 'bold', marginBottom: '24px' }}>
                Built for <span className="gradient-text">Institutional Standards</span>
              </h2>
            </div>
            
            <Grid container spacing={4}>
              {[
                {
                  title: 'AI Models',
                  description: 'Trained on 284K+ historical credit transactions',
                  icon: <Zap size={40} />,
                  color: '#3C79FF'
                },
                {
                  title: 'Zero-Knowledge Proofs',
                  description: 'Verify assessments without exposing model IP',
                  icon: <Lock size={40} />,
                  color: '#A033FF'
                },
                {
                  title: 'Byzantine Consensus',
                  description: 'No single validator can manipulate scores',
                  icon: <CheckCircle size={40} />,
                  color: '#71F5FF'
                },
                {
                  title: 'Cross-Chain Oracle',
                  description: 'Assessments usable across major blockchains',
                  icon: <Globe size={40} />,
                  color: '#FF33A0'
                }
              ].map((item, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <FloatingElement delay={index * 0.15}>
                    <GlowCard glowColor={item.color}>
                      <div style={{ 
                        background: 'linear-gradient(135deg, rgba(26, 24, 71, 0.9), rgba(10, 9, 42, 0.7))', 
                        backdropFilter: 'blur(20px)', 
                        padding: '40px', 
                        borderRadius: '16px', 
                        border: '2px solid rgba(60, 121, 255, 0.3)',
                        height: '100%'
                      }}>
                        <div style={{ color: item.color, marginBottom: '20px' }}>
                          {item.icon}
                        </div>
                        <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>{item.title}</h3>
                        <p style={{ color: '#B8B5D1', fontSize: '16px', lineHeight: 1.6 }}>{item.description}</p>
                      </div>
                    </GlowCard>
                  </FloatingElement>
                </Grid>
              ))}
            </Grid>
            
            <div style={{ marginTop: '64px', textAlign: 'center' }}>
              <GlowCard glowColor="#3C79FF">
                <div style={{ 
                  background: 'linear-gradient(90deg, rgba(60, 121, 255, 0.2), rgba(160, 51, 255, 0.2))', 
                  padding: '40px', 
                  borderRadius: '16px', 
                  border: '2px solid rgba(60, 121, 255, 0.5)'
                }}>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                    Credit intelligence that's transparent, verifiable, and compliant
                  </p>
                </div>
              </GlowCard>
            </div>
          </Container>
        </section>

        {/* Network Stats */}
        <section style={{ position: 'relative', padding: '128px 20px', background: 'linear-gradient(180deg, transparent, rgba(26, 24, 71, 0.3), transparent)' }}>
          <Container maxWidth="lg" style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 'bold', marginBottom: '24px' }}>
                Network <span className="gradient-text">Stats</span>
              </h2>
            </div>
            
            <Grid container spacing={4}>
              {[
                { value: '2.95', unit: 'T', label: 'Target assessed volume by Year 5', color: '#3C79FF' },
                { value: '50', unit: '-200', label: 'Validator network size', color: '#A033FF' },
                { value: '60', unit: 's', label: 'Average assessment finality', color: '#71F5FF' },
                { value: '89.3', unit: '%', label: 'Model accuracy rate', color: '#00FF00' },
                { value: '4', unit: '', label: 'Chains supported', color: '#FF33A0' }
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <FloatingElement delay={index * 0.1}>
                    <GlowCard glowColor={stat.color}>
                      <div style={{ 
                        background: 'linear-gradient(135deg, rgba(26, 24, 71, 0.8), rgba(10, 9, 42, 0.5))', 
                        backdropFilter: 'blur(20px)', 
                        padding: '32px', 
                        borderRadius: '16px', 
                        border: '1px solid rgba(60, 121, 255, 0.3)',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px', color: stat.color }}>
                          {stat.value}{stat.unit}
                        </div>
                        <div style={{ fontSize: '14px', color: '#B8B5D1' }}>{stat.label}</div>
                      </div>
                    </GlowCard>
                  </FloatingElement>
                </Grid>
              ))}
            </Grid>
          </Container>
        </section>

        {/* Roadmap */}
        <section style={{ position: 'relative', padding: '128px 20px' }}>
          <Container maxWidth="lg" style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <h2 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 'bold', marginBottom: '24px' }}>
                <span className="gradient-text">Roadmap</span>
              </h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>
              {[
                { period: '2025 Q2', milestone: 'Testnet launch with pilot protocols' },
                { period: '2025 Q4', milestone: 'Mainnet launch, validator onboarding' },
                { period: '2026 Q2', milestone: 'Institutional compliance certifications' },
                { period: '2026 Q4', milestone: 'Multi-asset class expansion' },
                { period: '2027+', milestone: 'Global institutional adoption' }
              ].map((item, index) => (
                <FloatingElement key={index} delay={index * 0.1}>
                  <GlowCard glowColor="#3C79FF">
                    <div style={{ 
                      background: 'linear-gradient(135deg, rgba(26, 24, 71, 0.9), rgba(10, 9, 42, 0.7))', 
                      backdropFilter: 'blur(20px)', 
                      padding: '24px 32px', 
                      borderRadius: '12px', 
                      border: '2px solid rgba(60, 121, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px'
                    }}>
                      <div style={{ 
                        minWidth: '120px',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#3C79FF'
                      }}>
                        {item.period}
                      </div>
                      <div style={{ fontSize: '18px', color: '#B8B5D1' }}>
                        {item.milestone}
                      </div>
                    </div>
                  </GlowCard>
                </FloatingElement>
              ))}
            </div>
          </Container>
        </section>

        {/* DLQ Token */}
        <section style={{ position: 'relative', padding: '128px 20px', background: 'linear-gradient(180deg, transparent, rgba(26, 24, 71, 0.3), transparent)' }}>
          <Container maxWidth="lg" style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 'bold', marginBottom: '24px' }}>
                DLQ <span className="gradient-text">Token</span>
              </h2>
              <p style={{ fontSize: '20px', color: '#B8B5D1', maxWidth: '700px', margin: '0 auto' }}>
                The DataLiquidity token powers the network
              </p>
            </div>
            
            <Grid container spacing={4}>
              {[
                { title: 'Validator Staking', description: 'Validators must stake DLQ to participate', icon: <Lock size={32} /> },
                { title: 'Governance', description: 'Token holders vote on protocol parameters', icon: <Users size={32} /> },
                { title: 'Network Fees', description: 'Discounted assessment fees when paying with DLQ', icon: <TrendingUp size={32} /> },
                { title: 'Yield Distribution', description: '20% of protocol revenue distributed to stakers', icon: <Target size={32} /> }
              ].map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <FloatingElement delay={index * 0.15}>
                    <GlowCard glowColor="#A033FF">
                      <div style={{ 
                        background: 'linear-gradient(135deg, rgba(26, 24, 71, 0.9), rgba(10, 9, 42, 0.7))', 
                        backdropFilter: 'blur(20px)', 
                        padding: '32px', 
                        borderRadius: '16px', 
                        border: '2px solid rgba(160, 51, 255, 0.3)',
                        height: '100%'
                      }}>
                        <div style={{ color: '#A033FF', marginBottom: '16px' }}>
                          {item.icon}
                        </div>
                        <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '12px' }}>{item.title}</h3>
                        <p style={{ color: '#B8B5D1', fontSize: '15px', lineHeight: 1.6 }}>{item.description}</p>
                      </div>
                    </GlowCard>
                  </FloatingElement>
                </Grid>
              ))}
            </Grid>
            
            <div style={{ marginTop: '48px', textAlign: 'center' }}>
              <p style={{ fontSize: '16px', color: '#8B89A0', fontStyle: 'italic' }}>
                DLQ is a utility token designed for network operation and governance
              </p>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section style={{ position: 'relative', padding: '128px 20px' }}>
          <Container maxWidth="lg" style={{ position: 'relative', zIndex: 10 }}>
            <FloatingElement>
              <GlowCard glowColor="#3C79FF">
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(26, 24, 71, 0.95), rgba(10, 9, 42, 0.8))', 
                  backdropFilter: 'blur(30px)', 
                  padding: '64px', 
                  borderRadius: '24px', 
                  border: '4px solid rgba(60, 121, 255, 0.5)',
                  textAlign: 'center'
                }}>
                  <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 'bold', marginBottom: '24px' }}>
                    Replace Black-Box Models with{' '}
                    <span className="gradient-text">Verifiable Assessments</span>
                  </h2>
                  <p style={{ fontSize: '20px', color: '#B8B5D1', maxWidth: '800px', margin: '0 auto 48px', lineHeight: 1.6 }}>
                    Building transparent credit infrastructure for institutional capital. 
                    Addressing the opacity crisis with decentralized validation, AI, and cryptographic proofs.
                  </p>
                  
                  <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button 
                      variant="contained"
                      size="large"
                      onClick={openWhitepaper}
                      style={{ 
                        background: 'linear-gradient(90deg, #3C79FF, #A033FF)', 
                        padding: '16px 40px', 
                        fontSize: '18px', 
                        fontWeight: 'bold',
                        boxShadow: '0 8px 32px rgba(60, 121, 255, 0.5)',
                        transition: 'transform 0.3s ease',
                        textTransform: 'none'
                      }}
                      endIcon={<ExternalLink size={22} />}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      Read Whitepaper
                    </Button>
                    <Button 
                      variant="outlined"
                      size="large"
                      href="mailto:amin29199@gmail.com"
                      style={{ 
                        border: '2px solid #3C79FF', 
                        color: '#3C79FF', 
                        padding: '16px 40px', 
                        fontSize: '18px', 
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        textTransform: 'none'
                      }}
                      endIcon={<Mail size={22} />}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(60, 121, 255, 0.2)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      Contact Us
                    </Button>
                  </div>
                </div>
              </GlowCard>
            </FloatingElement>
          </Container>
        </section>

        {/* Footer */}
        <footer style={{ position: 'relative', padding: '64px 20px', borderTop: '1px solid rgba(60, 121, 255, 0.2)' }}>
          <Container maxWidth="lg" style={{ position: 'relative', zIndex: 10 }}>
            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <h3 className="gradient-text" style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>
                  DataLiquidity Network
                </h3>
                <p style={{ color: '#8B89A0', marginBottom: '24px', lineHeight: 1.6 }}>
                  Transparent credit intelligence for on-chain finance. 
                  Building the infrastructure that lending protocols and institutions will run on.
                </p>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <Mail size={20} style={{ color: '#3C79FF' }} />
                  <a href="mailto:amin29199@gmail.com" style={{ color: '#3C79FF', textDecoration: 'none', transition: 'color 0.3s' }}>
                    amin29199@gmail.com
                  </a>
                </div>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#8B89A0', marginBottom: '16px' }}>
                    <strong style={{ color: '#B8B5D1' }}>Founded:</strong> 2025
                  </p>
                  <p style={{ color: '#8B89A0', marginBottom: '16px' }}>
                    <strong style={{ color: '#B8B5D1' }}>Location:</strong> Dubai DIFC
                  </p>
                  <p style={{ color: '#8B89A0', fontSize: '14px', marginTop: '32px' }}>
                    Mission: Replace black-box credit models with verifiable, transparent assessments
                  </p>
                </div>
              </Grid>
            </Grid>
            
            <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(60, 121, 255, 0.2)', textAlign: 'center' }}>
              <p style={{ color: '#6B6980', fontSize: '14px' }}>
                © 2025 DataLiquidity Network. All rights reserved.
              </p>
            </div>
          </Container>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default App;