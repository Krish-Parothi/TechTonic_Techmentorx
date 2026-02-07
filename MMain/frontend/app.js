import React, { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Stars, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

// ==========================================
// 1. THE 3D "OBSIDIAN JET" COMPONENT
// ==========================================

const ObsidianJet = (props) => {
  const group = useRef();
  
  // Material: Liquid Chrome Black
  const bodyMat = new THREE.MeshStandardMaterial({
    color: "#0a0a0a",
    roughness: 0.15,
    metalness: 0.9,
    envMapIntensity: 2
  });

  // Material: Cockpit Glass
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: "#111",
    roughness: 0,
    metalness: 0.1,
    transmission: 0.9,
    transparent: true,
    opacity: 0.5
  });

  // Material: Engine Glow
  const glowMat = new THREE.MeshBasicMaterial({ color: "#00f3ff" });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Physics-like floating
    group.current.rotation.z = Math.sin(t / 2) * 0.15; // Banking
    group.current.rotation.x = Math.sin(t / 1.5) * 0.05; // Pitch
    group.current.position.y = Math.sin(t) * 0.2; // Altitude
  });

  // Aerodynamic Wing Shape
  const wingShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(2.2, 1.8); // Tip Back
    shape.lineTo(2.2, 1.0); // Tip Front
    shape.lineTo(0, -1.5);  // Root
    return shape;
  }, []);

  return (
    <group ref={group} {...props}>
        {/* FUSELAGE */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={bodyMat}>
            <capsuleGeometry args={[0.6, 5.5, 4, 16]} />
        </mesh>

        {/* COCKPIT WINDOW */}
        <mesh position={[0, 0.45, 2.0]} rotation={[0.3, 0, 0]} material={glassMat}>
            <capsuleGeometry args={[0.35, 1.5, 4, 8]} />
        </mesh>

        {/* WINGS */}
        <group position={[0, -0.2, 0.5]}>
            <mesh rotation={[Math.PI / 2, 0, -0.15]} position={[0.5, 0, 0]} material={bodyMat}>
                <extrudeGeometry args={[wingShape, { depth: 0.15, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 }]} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0.15]} position={[-0.5, 0, 0]} scale={[-1, 1, 1]} material={bodyMat}>
                <extrudeGeometry args={[wingShape, { depth: 0.15, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 }]} />
            </mesh>
        </group>

        {/* REAR STABILIZERS (V-TAIL) */}
        <group position={[0, 0.5, -2.2]}>
             <mesh rotation={[Math.PI / 2, 0, -0.5]} position={[0.2, 0, 0]} scale={[0.6, 0.6, 0.6]} material={bodyMat}>
                 <extrudeGeometry args={[wingShape, { depth: 0.2, bevelEnabled: true }]} />
            </mesh>
             <mesh rotation={[Math.PI / 2, 0, 0.5]} position={[-0.2, 0, 0]} scale={[-0.6, 0.6, 0.6]} material={bodyMat}>
                 <extrudeGeometry args={[wingShape, { depth: 0.2, bevelEnabled: true }]} />
            </mesh>
        </group>

        {/* ENGINES */}
        <group position={[0, 0.3, -1.5]}>
            {[0.8, -0.8].map((x, i) => (
                <group key={i} position={[x, 0, 0]}>
                    <mesh rotation={[Math.PI/2, 0, 0]} material={bodyMat}>
                        <cylinderGeometry args={[0.25, 0.35, 1.5, 32]} />
                    </mesh>
                    {/* Afterburner */}
                    <mesh position={[0, 0, -0.76]} rotation={[Math.PI/2, 0, 0]} material={glowMat}>
                        <circleGeometry args={[0.22, 32]} />
                    </mesh>
                </group>
            ))}
        </group>
    </group>
  );
};

// ==========================================
// 2. THE 3D SCENE CONFIG
// ==========================================

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={20} color="#fff" />
      <pointLight position={[-10, -5, -5]} intensity={50} color="#00f3ff" />
      
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <ObsidianJet scale={0.8} rotation={[0, Math.PI, 0]} />
      </Float>

      <Sparkles count={150} scale={12} size={3} speed={0.4} opacity={0.4} color="#00f3ff" />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="city" />
    </>
  );
};

// ==========================================
// 3. UI COMPONENTS
// ==========================================

// 3D Tilt Wrapper for Cards
const TiltCard = ({ children, className }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 300, damping: 30 });
    const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            className={`perspective-1000 hover:z-50 transition-all duration-500 ${className}`}
        >
            <div className="preserve-3d h-full w-full">{children}</div>
        </motion.div>
    );
};

const FlightResult = ({ data }) => {
    return (
        <TiltCard className="relative w-full mb-6 cursor-pointer group">
            <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 p-8 flex flex-col justify-between group-hover:border-fly-blue/50 transition-colors duration-300">
                
                {/* Holographic Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <div className="flex justify-between items-start mb-6" style={{transform: "translateZ(30px)"}}>
                    <div>
                        <h3 className="font-display text-xl text-white tracking-widest">{data.airline}</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-tech bg-fly-blue text-black px-1 font-bold">SMART-ROUTE</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-fly-blue font-display font-bold text-3xl">₹{data.price.toLocaleString()}</div>
                    </div>
                </div>

                <div className="flex items-center gap-6 my-4" style={{transform: "translateZ(20px)"}}>
                    <div className="text-center">
                        <div className="text-4xl font-tech font-light text-white">{data.fromCode}</div>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center">
                        <div className="w-full h-px bg-white/20 relative group-hover:bg-fly-blue/50 transition-colors">
                            <div className="absolute top-1/2 left-0 w-1 h-1 bg-white -translate-y-1/2"></div>
                            <div className="absolute top-1/2 right-0 w-1 h-1 bg-fly-blue -translate-y-1/2"></div>
                            <i className="ph-fill ph-airplane absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50 rotate-90 text-xs"></i>
                        </div>
                        <div className="text-[10px] font-mono text-gray-500 mt-2">{data.duration}</div>
                    </div>

                    <div className="text-center">
                        <div className="text-4xl font-tech font-light text-white">{data.toCode}</div>
                    </div>
                </div>
            </div>
        </TiltCard>
    );
};

// ==========================================
// 4. MAIN APPLICATION
// ==========================================

const App = () => {
    const [from, setFrom] = useState("NAGPUR");
    const [to, setTo] = useState("MUMBAI");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.MapEngine.init("tactical-map");
    }, []);

    const handleSearch = () => {
        setLoading(true);
        setResults([]);
        
        // Mock API Latency
        setTimeout(() => {
            setResults([
                { airline: "FLYWISE PRIME", code: "FW-001", price: 8500, fromCode: "NAG", toCode: "BOM", duration: "0H 55M" },
                { airline: "INDIGO NEO", code: "6E-202", price: 4200, fromCode: "NAG", toCode: "BOM", duration: "1H 10M" },
                { airline: "STAR ALLIANCE", code: "AI-777", price: 6100, fromCode: "NAG", toCode: "BOM", duration: "1H 30M" },
            ]);
            setLoading(false);
            
            // Trigger Map Visualization
            // Nagpur to Mumbai Coords
            window.MapEngine.visualizeRoute([21.1458, 79.0882], [19.076, 72.8776]);
        }, 1500);
    };

    return (
        <div className="w-full h-full relative flex overflow-hidden bg-obsidian">
            
            {/* 3D BACKGROUND CANVAS */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
                    <Suspense fallback={null}>
                        <Scene />
                    </Suspense>
                    <OrbitControls 
                        enableZoom={false} 
                        enablePan={false} 
                        minPolarAngle={Math.PI / 2.2} 
                        maxPolarAngle={Math.PI / 1.8}
                        autoRotate 
                        autoRotateSpeed={0.8} 
                    />
                </Canvas>
            </div>

            {/* UI LAYER */}
            <div className="relative z-10 w-full h-full flex flex-col lg:flex-row pointer-events-none">
                
                {/* LEFT: INTERFACE */}
                <div className="w-full lg:w-[45%] h-full pointer-events-auto flex flex-col p-8 lg:p-16 bg-gradient-to-r from-obsidian via-obsidian/90 to-transparent">
                    
                    <header className="mb-12">
                        <div className="flex items-center gap-3 mb-2">
                            <i className="ph-fill ph-planet text-fly-blue text-xl animate-pulse"></i>
                            <span className="text-[10px] tracking-[0.3em] font-tech text-gray-400 uppercase">AI Neural Network</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-display text-white tracking-tighter leading-none">
                            FLY<span className="text-fly-blue">WISE</span>
                        </h1>
                        <p className="text-gray-500 font-tech mt-2 tracking-wide">NEXT-GEN FLIGHT INTELLIGENCE</p>
                    </header>

                    {/* Search Inputs */}
                    <div className="space-y-8 mb-8 max-w-md">
                        <div className="relative group">
                            <input 
                                type="text" 
                                value={from}
                                onChange={(e) => setFrom(e.target.value.toUpperCase())}
                                className="w-full bg-transparent border-b border-white/10 py-3 text-2xl font-tech text-white focus:outline-none focus:border-fly-blue transition-all"
                            />
                            <label className="absolute top-0 left-0 text-[10px] uppercase tracking-widest text-gray-500 -translate-y-5 group-focus-within:text-fly-blue transition-colors">Origin</label>
                        </div>

                        <div className="relative group">
                            <input 
                                type="text" 
                                value={to}
                                onChange={(e) => setTo(e.target.value.toUpperCase())}
                                className="w-full bg-transparent border-b border-white/10 py-3 text-2xl font-tech text-white focus:outline-none focus:border-fly-blue transition-all"
                            />
                            <label className="absolute top-0 left-0 text-[10px] uppercase tracking-widest text-gray-500 -translate-y-5 group-focus-within:text-fly-blue transition-colors">Destination</label>
                        </div>

                        <button 
                            onClick={handleSearch}
                            className="group relative w-full h-14 bg-white/5 border border-white/10 overflow-hidden hover:border-fly-blue/50 transition-colors"
                        >
                            <div className="absolute inset-0 bg-fly-blue translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                            <span className="relative z-10 flex items-center justify-center h-full text-sm font-display tracking-[0.2em] group-hover:text-black transition-colors">
                                {loading ? "CALCULATING TRAJECTORY..." : "INITIATE SEARCH"}
                            </span>
                        </button>
                    </div>

                    {/* Results Area */}
                    <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
                        <AnimatePresence>
                            {results.map((flight, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.15, type: "spring" }}
                                >
                                    <FlightResult data={flight} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* RIGHT: MAP VISUALIZATION */}
                <div className="hidden lg:block w-[55%] h-full relative pointer-events-auto">
                    {/* Floating Map Hud */}
                    <div className="absolute bottom-12 right-12 w-[400px] h-[300px] border border-white/10 bg-black/80 backdrop-blur-xl z-20 shadow-2xl overflow-hidden group">
                        
                        {/* HUD Corners */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-fly-blue"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-fly-blue"></div>
                        
                        {/* The Map */}
                        <div id="tactical-map" className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Scanning Line Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fly-blue/10 to-transparent h-4 w-full animate-scanline pointer-events-none"></div>
                        
                        <div className="absolute top-4 left-4 text-[10px] font-mono text-fly-blue tracking-widest bg-black/50 px-2 py-1">
                            LIVE SATELLITE LINK // ACTIVE
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
};

const LOCATION_COORDS = {
  Nagpur: [21.1458, 79.0882],
  Delhi: [28.7041, 77.1025],
  Mumbai: [19.076, 72.8776],
  Bangalore: [12.9716, 77.5946],
  Leh: [34.1526, 77.577],
  Kolkata: [22.5726, 88.3639],
  Hyderabad: [17.385, 78.4867],
  Chennai: [13.0827, 80.2707],
  Pune: [18.5204, 73.8567],
  Goa: [15.3417, 73.8244],
};

// ==================== HEADER COMPONENT ====================

function Header() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        ✈️ AIRPORT // LLM
      </motion.h1>
      <motion.p
        className="subtitle"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        AI-OPTIMIZED ROUTING SYSTEM
      </motion.p>
      <motion.div
        className="status-badge"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        🟢 SYSTEM NORMAL
      </motion.div>
    </motion.header>
  );
}

// ==================== AIRPORT INPUT COMPONENT ====================

function AirportInput({ label, value, onChange, placeholder, airportCode }) {
  return (
    <motion.div
      className="input-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <label className="input-label">{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          className="input-field"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          list="airport-list"
        />
        {airportCode && (
          <motion.div
            className="airport-code show"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {airportCode}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ==================== BOARDING PASS COMPONENT ====================

function BoardingPass({ route, from, to }) {
  const typeEmoji = {
    FLIGHT: "✈️",
    TRAIN: "🚂",
    MIXED: "🔀",
  }[route.type] || "📍";

  return (
    <motion.div
      className={`route-card ${route.featured ? "featured" : ""} ${
        route.visibility === "SECONDARY" ? "secondary" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      {/* Route Header */}
      <div className="route-header">
        <div>
          <div className="route-type">
            {typeEmoji}{" "}
            {route.type === "FLIGHT"
              ? `Direct Flight: ${from} → ${to}`
              : route.type === "TRAIN"
              ? `Direct Train: ${from} → ${to}`
              : `Multi-leg via ${route.hub}: ${from} → ${route.hub} → ${to}`}
          </div>
          {route.featured && (
            <span className="featured-badge">⭐ CHEAPEST</span>
          )}
        </div>
        <motion.div
          className="route-price"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          ₹{(route.total_price ?? route.price ?? 0).toLocaleString("en-IN")}
        </motion.div>
      </div>

      {/* Route Details */}
      <div className="route-details">
        {route.type === "FLIGHT" && (
          <div className="route-details-row">
            <div className="detail-item">
              <div className="detail-label">Duration</div>
              <div className="detail-value">
                {route.total_time.toFixed(1)} hours
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Stops</div>
              <div className="detail-value">Non-stop</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Source</div>
              <div className="detail-value">Live API</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Updated</div>
              <div className="detail-value">Just now</div>
            </div>
          </div>
        )}

        {route.type === "TRAIN" && (
          <div className="route-details-row">
            <div className="detail-item">
              <div className="detail-label">Duration</div>
              <div className="detail-value">
                {route.total_time.toFixed(1)} hours
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Class</div>
              <div className="detail-value">Sleeper/AC</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Source</div>
              <div className="detail-value">Live API</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Available</div>
              <div className="detail-value">Multiple times</div>
            </div>
          </div>
        )}

        {route.type === "MIXED" && (
          <>
            <div className="route-details-row">
              <div className="detail-item">
                <div className="detail-label">Route Type</div>
                <div className="detail-value">Optimized Connection</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Hub</div>
                <div className="detail-value">{route.hub}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Total Time</div>
                <div className="detail-value">
                  {route.total_time.toFixed(1)} hours
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Source</div>
                <div className="detail-value">Route Optimization</div>
              </div>
            </div>

            {route.explanation && (
              <motion.div
                className="explanation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                💡 {route.explanation}
              </motion.div>
            )}

            {route.legs && route.legs[0] && (
              <div className="leg-info">
                ✈️ <strong>Leg 1:</strong> {route.legs[0].from} →{" "}
                {route.legs[0].to} | ₹
                {(route.legs[0].price || 0).toLocaleString("en-IN")}
              </div>
            )}

            {route.legs && route.legs[1] && (
              <div className="leg-info">
                🚂 <strong>Leg 2:</strong> {route.legs[1].from} →{" "}
                {route.legs[1].to} | ₹
                {(route.legs[1].price || 0).toLocaleString("en-IN")}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

// ==================== ROUTES LIST COMPONENT ====================

function RoutesList({ routes, rejected, from, to, showAll, setShowAll }) {
  const visibleRoutes = showAll
    ? routes
    : routes.filter((r) => r.visibility !== "SECONDARY");
  const secondaryCount = routes.filter(
    (r) => r.visibility === "SECONDARY"
  ).length;

  return (
    <motion.div className="routes-list">
      <AnimatePresence>
        {visibleRoutes.map((route, idx) => (
          <BoardingPass
            key={idx}
            route={route}
            from={from}
            to={to}
          />
        ))}
      </AnimatePresence>

      {/* Show More / Hide Button */}
      {secondaryCount > 0 && (
        <motion.button
          className="show-more-btn"
          onClick={() => setShowAll(!showAll)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {showAll
            ? "Hide secondary routes"
            : `Show ${secondaryCount} more route(s)`}
        </motion.button>
      )}

      {/* Rejected Routes */}
      {rejected && rejected.length > 0 && (
        <motion.div
          className="rejected-routes-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h4>🚫 Evaluated but not recommended:</h4>
          <div className="rejected-routes-list">
            <AnimatePresence>
              {rejected.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="rejected-route-card"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="rejected-route-text">
                    <strong>{item.city}</strong>
                    <span className="rejection-reason">{item.reason}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ==================== MAP COMPONENT ====================

function MapComponent({ from, to, routes }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [22.9734, 78.6569],
        5
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    const fromCoords = LOCATION_COORDS[from] || [22.9734, 78.6569];
    const toCoords = LOCATION_COORDS[to] || [22.9734, 78.6569];

    // Add markers
    L.marker(fromCoords, {
      title: from,
      icon: L.icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
    })
      .addTo(map)
      .bindPopup(`📍 <strong>${from}</strong><br>Source`);

    L.marker(toCoords, {
      title: to,
      icon: L.icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
    })
      .addTo(map)
      .bindPopup(`📍 <strong>${to}</strong><br>Destination`);

    // Find cheapest route
    const cheapest = routes.reduce((min, route) => {
      const p = route.total_price ?? route.price ?? Number.MAX_SAFE_INTEGER;
      const mp = min.total_price ?? min.price ?? Number.MAX_SAFE_INTEGER;
      return p < mp ? route : min;
    });

    if (cheapest.type === "FLIGHT") {
      L.polyline([fromCoords, toCoords], {
        color: "#fdd835",
        weight: 4,
        opacity: 0.9,
      })
        .addTo(map)
        .bindPopup(
          `✈️ <strong>Flight</strong><br>₹${cheapest.price.toLocaleString(
            "en-IN"
          )}`
        );
    } else if (cheapest.type === "TRAIN") {
      L.polyline([fromCoords, toCoords], {
        color: "#2ecc71",
        weight: 4,
        opacity: 0.9,
        dashArray: "10, 5",
      })
        .addTo(map)
        .bindPopup(
          `🚂 <strong>Train</strong><br>₹${cheapest.price.toLocaleString(
            "en-IN"
          )}`
        );
    } else if (cheapest.type === "MIXED" && cheapest.hub) {
      const hubCoords = LOCATION_COORDS[cheapest.hub] || fromCoords;

      L.polyline([fromCoords, hubCoords], {
        color: "#e74c3c",
        weight: 3,
        opacity: 0.8,
      })
        .addTo(map)
        .bindPopup(`✈️ Flight to ${cheapest.hub}`);

      L.polyline([hubCoords, toCoords], {
        color: "#3498db",
        weight: 3,
        opacity: 0.8,
        dashArray: "5, 5",
      })
        .addTo(map)
        .bindPopup(`🚂 Train from ${cheapest.hub}`);

      L.circleMarker(hubCoords, {
        radius: 10,
        fillColor: "#f39c12",
        fillOpacity: 0.8,
        color: "#e67e22",
        weight: 2,
        title: cheapest.hub,
      })
        .addTo(map)
        .bindPopup(`🎯 <strong>Hub: ${cheapest.hub}</strong><br>💚 Cheapest Route`);
    }

    // Fit bounds
    const bounds = L.latLngBounds([fromCoords, toCoords]);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [from, to, routes]);

  return <div id="map-view" ref={mapRef} className="map-container" />;
}

// ==================== MAIN APP COMPONENT ====================

function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const handleFromChange = (e) => setFrom(e.target.value);
  const handleToChange = (e) => setTo(e.target.value);

  const handleSwap = () => {
    [setFrom, setTo] = [setTo, setFrom];
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const getAirportCode = (city) => {
    const info = CITY_DATABASE[city.toLowerCase().trim()];
    return info?.airport || "";
  };

  const handleSearch = async () => {
    if (!from.trim() || !to.trim()) {
      alert("Please enter both source and destination");
      return;
    }

    if (!CITY_DATABASE[from.toLowerCase().trim()]) {
      alert(`City not found: ${from}`);
      return;
    }

    if (!CITY_DATABASE[to.toLowerCase().trim()]) {
      alert(`City not found: ${to}`);
      return;
    }

    const startTime = Date.now();
    setLoading(true);
    setResults(null);
    setShowAll(false);

    try {
      await new Promise((res) => setTimeout(res, 500));

      const response = await fetch("http://localhost:5000/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const time = (Date.now() - startTime) / 1000;
      setElapsed(time.toFixed(1));
      setResults(data);
    } catch (error) {
      alert(`Error: ${error.message}. Ensure backend is running on port 5000.`);
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="container">
      <Header />

      {!results ? (
        <>
          {/* Search Section */}
          <motion.section className="search-section">
            <h2>Search Routes</h2>
            <div className="search-bar">
              <AirportInput
                label="From"
                value={from}
                onChange={handleFromChange}
                placeholder="Enter city..."
                airportCode={getAirportCode(from)}
              />

              <motion.button
                className="swap-btn"
                onClick={handleSwap}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                ⇄
              </motion.button>

              <AirportInput
                label="To"
                value={to}
                onChange={handleToChange}
                placeholder="Enter city..."
                airportCode={getAirportCode(to)}
              />

              <motion.button
                className="search-btn"
                onClick={handleSearch}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
              >
                {loading ? "SEARCHING..." : "SEARCH"}
              </motion.button>
            </div>

            {/* Loading State */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  className="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="spinner" />
                  <p>Finding optimal routes...</p>
                  <p className="latency">Connecting to AI routing engine</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* Empty Map */}
          {!loading && (
            <motion.section className="map-section">
              <h3>Route Map</h3>
              <div className="map-container" style={{ background: "#rgba(0,0,0,0.2)" }} />
            </motion.section>
          )}
        </>
      ) : (
        <>
          {/* Results Header */}
          <motion.section
            className="results-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="results-header">
              <div className="results-info">
                <div className="results-count">
                  <strong>
                    {from} ({getAirportCode(from)}) → {to} ({getAirportCode(to)})
                  </strong>{" "}
                  | {results.routes.length} routes found
                </div>
                <div className="cheapest-badge">
                  💚 Best Price: {results.cheapest.type} @ ₹
                  {results.cheapest.price.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            {/* Status Message */}
            <motion.div
              className="status-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                background: "rgba(0, 255, 150, 0.1)",
                border: "1px solid rgba(0, 255, 150, 0.2)",
                color: "rgba(0, 255, 150, 0.9)",
                padding: "15px 20px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              ✅ Prices updated just now ({new Date().toLocaleTimeString()}) -
              Fetched in {elapsed}s via Live Pricing APIs
            </motion.div>

            {/* Routes */}
            <RoutesList
              routes={results.routes}
              rejected={results.rejected_routes}
              from={from}
              to={to}
              showAll={showAll}
              setShowAll={setShowAll}
            />

            {/* Search Again Button */}
            <motion.button
              className="search-again-btn"
              onClick={() => setResults(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              style={{ width: "100%", marginTop: "20px" }}
            >
              Search Another Route
            </motion.button>
          </motion.section>

          {/* Map Section */}
          <motion.section
            className="map-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3>Route Map</h3>
            <MapComponent from={from} to={to} routes={results.routes} />
          </motion.section>
        </>
      )}

      {/* Footer */}
      <footer>
        <p>🌍 AI-Powered Multimodal Route Optimization</p>
        <p>© 2024 TechTonic - Route Analysis Powered by Google Generative AI</p>
      </footer>

      {/* Datalist for city autocomplete */}
      <datalist id="airport-list">
        {Object.entries(CITY_DATABASE).map(([key, city]) => (
          <option key={key} value={city.name} />
        ))}
      </datalist>
    </div>
  );
}

// ==================== RENDER APP ====================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
