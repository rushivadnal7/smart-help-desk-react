import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import {
  Users,
  Bot,
  Shield,
  Zap,
  MessageSquare,
  BarChart3,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Target
} from 'lucide-react';
import Hero from '@/components/sections/home/Hero';
import Dashboard from '@/components/sections/home/Dashboard';
import ShootingStars from '@/components/ui/ShootingStars';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const containerRef = useRef(null);
  const threeRef = useRef(null);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Three.js Scene Setup
  useEffect(() => {
    if (!threeRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    threeRef.current.appendChild(renderer.domElement);

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x6b7280,
      transparent: true,
      opacity: 0.8
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create geometric shapes

    const torusGeometry = new THREE.IcosahedronGeometry;
    const torusMaterial = new THREE.MeshBasicMaterial({
      color: 0x4b5563,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(-5, 0, -5);
    scene.add(torus);

    camera.position.z = 10;

    // inside your useEffect after creating particlesMesh...

    // Array to hold multiple icosahedrons
    const icosahedrons: THREE.Mesh<THREE.IcosahedronGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>[] = [];
    const icosahedronCount = 4; // increase or decrease as you want

    for (let i = 0; i < icosahedronCount; i++) {
      const icoGeometry = new THREE.IcosahedronGeometry(0.5, 0); // radius 0.5
      const icoMaterial = new THREE.MeshBasicMaterial({
        color: 0x4b5563,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      const ico = new THREE.Mesh(icoGeometry, icoMaterial);

      // Random positions across the screen
      ico.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );

      scene.add(ico);
      icosahedrons.push(ico);
    }

    // Animate all of them
    const animate = () => {
      requestAnimationFrame(animate);

      particlesMesh.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.002;

      icosahedrons.forEach((ico) => {
        ico.rotation.x += 0.01;
        ico.rotation.y += 0.01;
      });

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
      threeRef.current?.removeChild(renderer.domElement);
    };
  }, []);



  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.fromTo(heroRef.current,
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' }
      );

      // Stats animation
      gsap.fromTo('.stat-item',
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
          }
        }
      );

      // Feature cards animation
      gsap.fromTo('.feature-card',
        { opacity: 0, y: 80, rotationY: 15 },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 70%',
          }
        }
      );

      // Floating animation for hero elements
      gsap.to('.float', {
        y: -20,
        duration: 2,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI-Powered Resolution",
      description: "Advanced AI algorithms automatically resolve common queries and route complex issues to human agents."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-Role Management",
      description: "Seamless coordination between users, agents, and admins with role-based access control."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enhanced Security",
      description: "Enterprise-grade security ensures your data and communications remain protected at all times."
    }
  ];

  const stats = [
    { number: "99.9%", label: "Uptime Guarantee", icon: <Clock className="w-6 h-6" /> },
    { number: "< 2min", label: "Avg Response Time", icon: <Zap className="w-6 h-6" /> },
    { number: "85%", label: "Auto-Resolution Rate", icon: <Bot className="w-6 h-6" /> },
    { number: "10k+", label: "Tickets Resolved", icon: <CheckCircle className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "IT Director",
      company: "TechCorp",
      rating: 5,
      feedback: "The AI resolution capability has reduced our support workload by 70%. Incredible efficiency."
    },
    {
      name: "Sarah Chen",
      role: "Operations Manager",
      company: "StartupXYZ",
      rating: 5,
      feedback: "Best help desk solution we've implemented. The admin article system is a game-changer."
    },
    {
      name: "Mike Rodriguez",
      role: "Support Lead",
      company: "Enterprise Inc",
      rating: 5,
      feedback: "Seamless integration and intuitive interface. Our team adopted it within days."
    }
  ];

  return (
    <div ref={containerRef} className="relative   w-full min-h-screen bg-black text-white overflow-hidden">
      {/* Three.js Background */}
      <div ref={threeRef} className="fixed inset-0 z-0 pointer-events-none" />
      {/* <ShootingStars/> */}
      <Hero />
      <Dashboard />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center py-32 px-4">
        <div ref={heroRef} className="text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-b from-white via-zinc-300 to-zinc-600 bg-clip-text text-transparent">
              Your Gateway to the
              <br />
              <span className="float">Future of Support</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto"
          >
            Experience the next generation of AI-powered help desk solutions with intelligent ticket resolution and seamless human-AI collaboration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="relative max-w-4xl mx-auto mb-16"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`
            }}
          >
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-zinc-800 rounded-lg p-6 border border-zinc-700"
                >
                  <MessageSquare className="w-8 h-8 mb-4 text-zinc-400" />
                  <h3 className="text-lg font-semibold mb-2">Smart Tickets</h3>
                  <p className="text-zinc-400 text-sm">AI-categorized and prioritized support requests</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-zinc-800 rounded-lg p-6 border border-zinc-700"
                >
                  <BarChart3 className="w-8 h-8 mb-4 text-zinc-400" />
                  <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                  <p className="text-zinc-400 text-sm">Real-time insights and performance metrics</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-zinc-800 rounded-lg p-6 border border-zinc-700"
                >
                  <Users className="w-8 h-8 mb-4 text-zinc-400" />
                  <h3 className="text-lg font-semibold mb-2">Team Hub</h3>
                  <p className="text-zinc-400 text-sm">Collaborative workspace for agents and admins</p>
                </motion.div>
              </div>
            </div>

            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-zinc-800 rounded-full border border-zinc-600 flex items-center justify-center"
            >
              <Bot className="w-8 h-8 text-zinc-400" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-zinc-200 transition-all duration-300"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-center mb-4"
          >
            Premier Choice for
            <br />
            Your Support Needs
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-zinc-400 text-center mb-16 max-w-3xl mx-auto"
          >
            Trusted by thousands of organizations worldwide for delivering exceptional support experiences
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-item text-center p-6 bg-zinc-900 rounded-xl border border-zinc-800"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  borderColor: "#4b5563"
                }}
              >
                <div className="flex justify-center mb-4 text-zinc-400">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-zinc-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Discover the Powerful Features
              <br />
              of Smart HelpDesk
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Engineered for efficiency, built for scale, designed for the future of customer support
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card group"
                whileHover={{ y: -10 }}
              >
                <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 h-full hover:border-zinc-600 transition-all duration-300 hover:bg-zinc-800">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6 text-zinc-400 group-hover:text-white group-hover:bg-zinc-700"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Process Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-16"
          >
            How It Works
          </motion.h2>

          <div className="relative">
            {/* Animated connection lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
              <motion.path
                d="M 200,200 Q 400,100 600,200"
                stroke="url(#gradient)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6b7280" />
                  <stop offset="100%" stopColor="#374151" />
                </linearGradient>
              </defs>
            </svg>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { step: "01", title: "Submit Ticket", desc: "User creates support request" },
                { step: "02", title: "AI Analysis", desc: "Smart categorization and routing" },
                { step: "03", title: "Resolution", desc: "AI or human agent resolves issue" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-700"
                  >
                    <span className="text-2xl font-bold">{item.step}</span>
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-zinc-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join the Smart HelpDesk Community
            </h2>
            <p className="text-xl text-zinc-400">
              See what our satisfied customers have to say
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:border-zinc-600 transition-all duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-zinc-300 mb-6 italic">"{testimonial.feedback}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-zinc-400" />
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-zinc-400 text-sm">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-3xl p-12 border border-zinc-700"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Support?
            </h2>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Join thousands of companies already using Smart HelpDesk to deliver exceptional customer experiences.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-zinc-200 transition-all duration-300"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-zinc-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Documentation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-zinc-400">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-zinc-400">
                <li>Help Center</li>
                <li>Contact</li>
                <li>Status</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-zinc-400">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Security</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-800">
            <div className="text-zinc-400 mb-4 md:mb-0">
              © 2025 Smart HelpDesk. All rights reserved.
            </div>
            <div className="flex space-x-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 cursor-pointer"
                >
                  <div className="w-4 h-4 bg-zinc-600 rounded-full" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;