import React, { useState, useRef, useEffect, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Stars, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

// 3D JET COMPONENT
const ObsidianJet = (props) => {
  const group = useRef();
  const bodyMat = new THREE.MeshStandardMaterial({ color: "#0a0a0a", roughness: 0.15, metalness: 0.9 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: "#111", roughness: 0.1, metalness: 0.2, transmission: 0.8 });
  const glowMat = new THREE.MeshBasicMaterial({ color: "#00f3ff", emissive: "#00f3ff", emissiveIntensity: 1 });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.z = Math.sin(t / 2) * 0.15;
      group.current.rotation.x = Math.sin(t / 1.5) * 0.05;
      group.current.position.y = Math.sin(t) * 0.2;
    }
  });

  return (
    <group ref={group} {...props}>
      <mesh rotation={[Math.PI / 2, 0, 0]} material={bodyMat}><capsuleGeometry args={[0.6, 5.5, 4, 16]} /></mesh>
      <mesh position={[0, 0.45, 2.0]} rotation={[0.3, 0, 0]} material={glassMat}><capsuleGeometry args={[0.35, 1.5, 4, 8]} /></mesh>
      <group position={[0, -0.2, 0.5]}>
        <mesh rotation={[Math.PI / 2, 0, -0.15]} position={[0.8, 0, 0]} material={bodyMat}><boxGeometry args={[2.0, 0.1, 0.3]} /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0.15]} position={[-0.8, 0, 0]} material={bodyMat}><boxGeometry args={[2.0, 0.1, 0.3]} /></mesh>
      </group>
      <group position={[0, 0.3, -1.5]}>
        {[0.8, -0.8].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            <mesh rotation={[Math.PI/2, 0, 0]} material={bodyMat}><cylinderGeometry args={[0.25, 0.35, 1.5, 32]} /></mesh>
            <mesh position={[0, 0, -0.76]} rotation={[Math.PI/2, 0, 0]} material={glowMat}><circleGeometry args={[0.22, 32]} /></mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

const Scene = () => (<><ambientLight intensity={0.5} /><pointLight position={[10, 10, 10]} intensity={20} color="#fff" /><pointLight position={[-10, -5, -5]} intensity={50} color="#00f3ff" /><Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}><ObsidianJet scale={0.8} rotation={[0, Math.PI, 0]} /></Float><Sparkles count={150} scale={12} size={3} speed={0.4} opacity={0.4} color="#00f3ff" /><Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} /><Environment preset="city" /></>);

const TiltCard = ({ children, className = "" }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const handleMouseMove = (e) => { const rect = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - rect.left) / rect.width - 0.5); y.set((e.clientY - rect.top) / rect.height - 0.5); };
  return (<motion.div style={{ rotateX, rotateY, perspective: 1000 }} onMouseMove={handleMouseMove} onMouseLeave={() => { x.set(0); y.set(0); }} className={preserve-3d transition-all }>{children}</motion.div>);
};

const FlightResult = ({ flight }) => (<TiltCard className="p-4"><div className="bg-gradient-to-br from-fly-blue/20 to-fly-purple/20 border border-fly-blue/50 rounded-lg p-4 backdrop-blur-sm hover:border-fly-blue transition-all"><div className="font-display text-lg font-bold text-fly-blue mb-1">{flight.airline}</div><div className="text-tech text-sm text-gray-400 mb-2">{flight.fromCode} →  {flight.toCode}</div><div className="flex justify-between items-center"><span className="text-tech text-white font-bold">\</span><span className="text-tech text-xs text-fly-blue">{flight.duration}</span></div></div></TiltCard>);

const App = () => {
  const [from, setFrom] = useState("NAGPUR");
  const [to, setTo] = useState("MUMBAI");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => { if (window.MapEngine) window.MapEngine.init("tactical-map"); }, []);
  const handleSearch = () => {
    if (!from || !to) return;
    setLoading(true);
    setResults([]);
    setTimeout(() => {
      setResults([
        { id: 1, airline: "FLYWISE PRIME", fromCode: "NAG", toCode: "MUM", price: 8500, duration: "0H 55M" },
        { id: 2, airline: "INDIGO NEO", fromCode: "NAG", toCode: "MUM", price: 4200, duration: "1H 10M" },
        { id: 3, airline: "STAR ALLIANCE", fromCode: "NAG", toCode: "MUM", price: 6100, duration: "1H 30M" },
      ]);
      setLoading(false);
      if (window.MapEngine) window.MapEngine.visualizeRoute([21.1458, 79.0882], [19.076, 72.8776]);
    }, 1500);
  };
  return (<div className="w-full h-full relative flex overflow-hidden bg-obsidian text-white"><div className="absolute inset-0 z-0 w-full h-full"><Canvas camera={{ position: [0, 0, 6], fov: 40 }}><Suspense fallback={null}><Scene /></Suspense><OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} /></Canvas></div><div className="absolute inset-0 z-10 pointer-events-none"><div className="flex h-full w-full"><div className="w-full lg:w-1/2 p-8 pointer-events-auto"><motion.h1 className="font-display text-4xl font-bold text-fly-blue mb-2" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>FLYWISE</motion.h1><motion.p className="font-tech text-sm text-gray-400 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>AI-Powered Route Intelligence</motion.p><motion.div className="space-y-4 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}><input type="text" placeholder="From City" value={from} onChange={(e) => setFrom(e.target.value.toUpperCase())} className="w-full bg-glass border border-fly-blue/50 rounded-lg px-4 py-2 text-white font-tech text-sm focus:outline-none focus:border-fly-blue transition-all" /><input type="text" placeholder="To City" value={to} onChange={(e) => setTo(e.target.value.toUpperCase())} className="w-full bg-glass border border-fly-blue/50 rounded-lg px-4 py-2 text-white font-tech text-sm focus:outline-none focus:border-fly-blue transition-all" /><motion.button onClick={handleSearch} disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-fly-blue/20 border border-fly-blue px-6 py-2 rounded-lg text-fly-blue font-tech font-bold hover:bg-fly-blue/30 disabled:opacity-50 transition-all">{loading ? "SEARCHING..." : "SEARCH ROUTES"}</motion.button></motion.div><AnimatePresence>{results.length > 0 && (<motion.div className="space-y-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>{results.map((result) => (<motion.div key={result.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}><FlightResult flight={result} /></motion.div>))}</motion.div>)}</AnimatePresence></div><div className="hidden lg:flex w-1/2 p-8 pointer-events-auto justify-end"><motion.div className="w-80 h-80 bg-glass border-2 border-fly-blue/40 rounded-2xl relative overflow-hidden" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}><div id="tactical-map" className="w-full h-full"></div><div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-fly-blue"></div><div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-fly-blue"></div><div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-fly-blue"></div><div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-fly-blue"></div><div className="absolute inset-0 pointer-events-none scanline-overlay opacity-10"></div><div className="absolute bottom-3 left-3 font-tech text-xs text-fly-blue">SATELLITE LINK</div></motion.div></div></div></div>);
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
