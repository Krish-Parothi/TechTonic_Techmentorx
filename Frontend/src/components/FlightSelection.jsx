import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { CITIES } from '../data/cities';

// Fix Leaflet icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Helper to get city data
const getCityInfo = (name) => {
    if (!name) return null;
    return CITIES.find(c => c.name.toLowerCase() === name.toLowerCase().trim());
};

const getLocationCoords = (name) => {
    const city = getCityInfo(name);
    return city ? [city.lat, city.lon] : null;
};

// Component to handle map view updates
function MapUpdater({ from, to, routes }) {
    const map = useMap();

    useEffect(() => {
        const fromCoords = getLocationCoords(from);
        const toCoords = getLocationCoords(to);

        if (fromCoords && toCoords) {
            const bounds = L.latLngBounds([fromCoords, toCoords]);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [from, to, routes, map]);

    return null;
}

const FlightSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [fromCity, setFromCity] = useState('');
    const [toCity, setToCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const [searchStatus, setSearchStatus] = useState('');

    useEffect(() => {
        // Priority 1: Navigation State
        if (location.state?.from && location.state?.to) {
            setFromCity(location.state.from);
            setToCity(location.state.to);
            handleSearch(location.state.from, location.state.to);
            sessionStorage.setItem('lastSearch', JSON.stringify({ from: location.state.from, to: location.state.to }));
        }
        // Priority 2: Session Storage (Back button/Refresh fallback)
        else {
            const savedWithDate = sessionStorage.getItem('lastSearch');
            if (savedWithDate) {
                const parsed = JSON.parse(savedWithDate);
                setFromCity(parsed.from);
                setToCity(parsed.to);
                handleSearch(parsed.from, parsed.to);
            }
        }
    }, [location.state]);

    const handleSwap = () => {
        setFromCity(toCity);
        setToCity(fromCity);
    };

    const handleSearch = async (overrideFrom, overrideTo) => {
        const searchFrom = overrideFrom || fromCity;
        const searchTo = overrideTo || toCity;

        if (!searchFrom || !searchTo) {
            setError("Please enter both source and destination from the list.");
            return;
        }

        const fromInfo = getCityInfo(searchFrom);
        const toInfo = getCityInfo(searchTo);

        if (!fromInfo) {
            setError(`City not found: ${searchFrom}`);
            return;
        }
        if (!toInfo) {
            setError(`City not found: ${searchTo}`);
            return;
        }

        setLoading(true);
        setResults(null);
        setError(null);
        setSearchStatus('');
        const startTime = Date.now();

        try {
            // Small artificial delay for UX
            await new Promise((res) => setTimeout(res, 500));

            // MOCK DATA FOR NAGPUR -> DELHI (User Request)
            const isNagpur = searchFrom.toLowerCase().includes('nagpur') || searchFrom.toLowerCase().includes('nag');
            const isDelhi = searchTo.toLowerCase().includes('delhi') || searchTo.toLowerCase().includes('del');

            if (isNagpur && isDelhi) {
                const mockRoutes = [
                    {
                        type: 'FLIGHT',
                        airline: 'Air India',
                        flightNumber: 'AI 469',
                        price: 6535,
                        departureTime: '8:40 PM',
                        total_time: 1.75,
                        featured: true,
                        visibility: 'PRIMARY'
                    },
                    {
                        type: 'FLIGHT',
                        airline: 'IndiGo',
                        flightNumber: '6E 636',
                        price: 7114,
                        departureTime: '7:00 PM',
                        total_time: 1.5,
                        visibility: 'PRIMARY'
                    },
                    {
                        type: 'TRAIN',
                        airline: 'Indian Railways',
                        flightNumber: '12723 (Telangana Express)',
                        price: 845,
                        departureTime: '3:20 PM',
                        total_time: 14.5,
                        visibility: 'PRIMARY',
                        explanation: 'Direct train available'
                    }
                ];

                setSearchStatus(`Analysis: Air India (₹6,535) @ 8:40 PM and IndiGo (₹7,114) @ 7:00 PM are top picks. Train options fetched.`);
                setResults({
                    routes: mockRoutes,
                    cheapest: mockRoutes[0]
                });
                setShowAll(false);
                setLoading(false);
                return;
            }

            const response = await fetch("http://localhost:5000/api/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ from: searchFrom, to: searchTo }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            const elapsed = Math.round((Date.now() - startTime) / 100) / 10;

            setSearchStatus(`Prices updated just now (${new Date().toLocaleTimeString()}) - Fetched in ${elapsed}s via Live Pricing APIs`);
            setResults(data);
            setShowAll(false);

        } catch (err) {
            console.error("Search error:", err);
            setError(`Error: ${err.message}. Ensure backend is running successfully.`);
        } finally {
            setLoading(false);
        }
    };

    const fromAirport = getCityInfo(fromCity)?.code;
    const toAirport = getCityInfo(toCity)?.code;

    // Filter routes
    const getVisibleRoutes = () => {
        if (!results?.routes) return [];
        return showAll
            ? results.routes
            : results.routes.filter(r => r.visibility !== "SECONDARY");
    };

    const visibleRoutes = getVisibleRoutes();
    const secondaryCount = results?.routes?.filter(r => r.visibility === "SECONDARY").length || 0;

    // Map drawing logic helpers
    const getRouteColor = (type) => {
        switch (type) {
            case 'FLIGHT': return '#fdd835';
            case 'TRAIN': return '#2ecc71';
            case 'MIXED': return '#e74c3c'; // For leg 1, leg 2 is usually blue
            default: return '#3388ff';
        }
    };

    const getAirlineDisplay = (route) => {
        // Direct property check
        if (route.airline) return route.airline;
        if (route.carrier) return route.carrier;
        if (route.operator) return route.operator;

        // Infer from code
        const code = route.flightNumber || route.flight_code || route.sc_code;
        if (code) {
            // Handle "6E 123" or "AI-456" or just "6E"
            const prefix = code.split(/[\s-]/)[0].toUpperCase();
            const map = {
                'AI': 'Air India',
                '6E': 'IndiGo',
                'SG': 'SpiceJet',
                'UK': 'Vistara',
                'G8': 'Go First',
                'QP': 'Akasa Air',
                'IX': 'Air India Express',
                'I5': 'AIX Connect',
                'S5': 'Star Air',
                '2T': 'TruJet',
                '9I': 'Alliance Air'
            };
            return map[prefix] || null;
        }
        return null;
    };

    // Function to render map polylines
    const renderMapRoutes = () => {
        if (!results?.cheapest) return null;

        const cheapest = results.routes.reduce((min, route) => {
            const p = route.total_price ?? route.price ?? Number.MAX_SAFE_INTEGER;
            const mp = min.total_price ?? min.price ?? Number.MAX_SAFE_INTEGER;
            return p < mp ? route : min;
        }, results.routes[0]);

        const fromCoords = getLocationCoords(fromCity);
        const toCoords = getLocationCoords(toCity);

        if (!fromCoords || !toCoords) return null;

        if (cheapest.type === "FLIGHT") {
            return (
                <Polyline
                    positions={[fromCoords, toCoords]}
                    pathOptions={{ color: "#3b82f6", weight: 4, opacity: 0.8 }}
                >
                    <Popup>✈️ <strong>Flight</strong><br />₹{cheapest.price.toLocaleString("en-IN")}</Popup>
                </Polyline>
            );
        } else if (cheapest.type === "TRAIN") {
            return (
                <Polyline
                    positions={[fromCoords, toCoords]}
                    pathOptions={{ color: "#22c55e", weight: 4, opacity: 0.8, dashArray: "10, 5" }}
                >
                    <Popup>🚂 <strong>Train</strong><br />₹{cheapest.price.toLocaleString("en-IN")}</Popup>
                </Polyline>
            );
        } else if (cheapest.type === "MIXED" && cheapest.hub) {
            const hubCoords = getLocationCoords(cheapest.hub) || fromCoords;
            return (
                <>
                    <Polyline
                        positions={[fromCoords, hubCoords]}
                        pathOptions={{ color: "#ef4444", weight: 3, opacity: 0.8 }}
                    >
                        <Popup>✈️ Flight to {cheapest.hub}</Popup>
                    </Polyline>
                    <Polyline
                        positions={[hubCoords, toCoords]}
                        pathOptions={{ color: "#3b82f6", weight: 3, opacity: 0.8, dashArray: "5, 5" }}
                    >
                        <Popup>🚂 Train from {cheapest.hub}</Popup>
                    </Polyline>
                    <CircleMarker
                        center={hubCoords}
                        pathOptions={{ fillColor: "#f97316", fillOpacity: 0.8, color: "#ea580c", weight: 2 }}
                        radius={8}
                    >
                        <Popup>🎯 <strong>Hub: {cheapest.hub}</strong><br />Optimized Route</Popup>
                    </CircleMarker>
                </>
            );
        }
        return null;
    };

    return (
        <div className="font-sans min-h-screen bg-gray-50 text-gray-900 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="w-full max-w-full mx-auto h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <div>
                            <div className="font-semibold text-lg flex items-center gap-2">
                                {fromCity || "Select Origin"}
                                <span className="text-gray-400">→</span>
                                {toCity || "Select Destination"}
                            </div>
                            <div className="text-xs text-gray-500">
                                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • 1 Traveler
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-blue-600 font-bold text-sm hidden md:block">FlyWise LLM</span>
                        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="4" y1="21" y2="14" /><line x1="4" x2="4" y1="10" y2="3" /><line x1="12" x2="12" y1="21" y2="12" /><line x1="12" x2="12" y1="8" y2="3" /><line x1="20" x2="20" y1="21" y2="16" /><line x1="20" x2="20" y1="12" y2="3" /><line x1="1" x2="7" y1="14" y2="14" /><line x1="9" x2="15" y1="8" y2="8" /><line x1="17" x2="23" y1="16" y2="16" /></svg>
                            Filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-full mx-auto px-4 py-6 space-y-6">

                {/* Search Bar (Retained Functionality) */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-3 items-center">
                        <div className="flex-1 w-full relative group">
                            <label className="text-xs font-semibold text-gray-500 uppercase ml-1 mb-1 block">From</label>
                            <input
                                type="text"
                                value={fromCity}
                                onChange={(e) => setFromCity(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Origin City"
                                list="cities-list"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                            {fromAirport && fromCity && (
                                <span className="absolute right-3 bottom-3 text-xs font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{fromAirport}</span>
                            )}
                        </div>

                        <button
                            onClick={handleSwap}
                            className="mt-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.2 15.2 5.6 5.6L18.4 15.2" /><path d="M12.8 20.8V3.2" /></svg>
                        </button>

                        <div className="flex-1 w-full relative">
                            <label className="text-xs font-semibold text-gray-500 uppercase ml-1 mb-1 block">To</label>
                            <input
                                type="text"
                                value={toCity}
                                onChange={(e) => setToCity(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Destination City"
                                list="cities-list"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                            {toAirport && toCity && (
                                <span className="absolute right-3 bottom-3 text-xs font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{toAirport}</span>
                            )}
                        </div>

                        <button
                            onClick={handleSearch}
                            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm active:transform active:scale-95"
                        >
                            Search
                        </button>
                    </div>
                </div>

                <datalist id="cities-list">
                    {CITIES.map(city => (
                        <option key={city.code} value={city.name} />
                    ))}
                </datalist>

                {/* Loading State */}
                {loading && (
                    <div className="py-12 text-center">
                        <div className="inline-block w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium animate-pulse">Analyzing best routes via AI...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                        {error}
                    </div>
                )}

                {/* Results Section */}
                {results && !loading && (
                    <div className="space-y-6 animate-fade-in">
                        {/* FlyWise Insight Banner */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-4 shadow-sm">
                            <div className="p-2 bg-blue-100 rounded-full text-blue-600 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" /><path d="M8.5 8.5v.01" /><path d="M16 12l-2-2" /><path d="M12 16l-2-2" /></svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm mb-1">FlyWise Insight</h3>
                                <p className="text-gray-600 text-sm">
                                    Found {results.routes.length} options for your trip. Best value starts at <span className="font-bold text-gray-900 font-mono">₹{results.cheapest?.price?.toLocaleString("en-IN")}</span>.
                                    {searchStatus && <span className="block mt-1 text-xs text-green-600 opacity-80">{searchStatus}</span>}
                                </p>
                            </div>
                        </div>

                        {/* Route Cards */}
                        <div className="space-y-4">
                            {visibleRoutes.map((route, index) => {
                                const typeIcon = { FLIGHT: "✈️", TRAIN: "🚂", MIXED: "🔀" }[route.type];
                                const displayPrice = route.total_price ?? route.price ?? 0;
                                const isCheapest = route.featured;

                                // Determine tag properties based on route type/features
                                let tagLabel = "Good Option";
                                let tagColor = "bg-gray-100 text-gray-600";

                                if (route.featured) {
                                    tagLabel = "Best Budget Pick";
                                    tagColor = "bg-green-100 text-green-700";
                                } else if (route.type === "FLIGHT" && displayPrice > 6000) {
                                    tagLabel = "Premium Range";
                                    tagColor = "bg-purple-100 text-purple-700";
                                } else if (route.type === "MIXED") {
                                    tagLabel = "Smart Combo";
                                    tagColor = "bg-orange-100 text-orange-700";
                                }

                                return (
                                    <div
                                        key={index}
                                        className={`bg-white border rounded-xl p-5 hover:shadow-md transition-all duration-200 group relative overflow-hidden ${route.visibility === 'SECONDARY' ? 'border-gray-200 opacity-90' : 'border-gray-200'}`}
                                    >
                                        {/* Row Layout */}
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                                            {/* Left: Metadata */}
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">{typeIcon}</span>
                                                    <div>
                                                        <div>
                                                            {(() => {
                                                                let name = getAirlineDisplay(route);
                                                                const code = route.flightNumber || route.flight_code || route.sc_code;
                                                                const type = (route.type || '').toUpperCase();

                                                                // Forced fallback if no name detected
                                                                if (!name) {
                                                                    if (type === 'TRAIN') name = 'Train';
                                                                    else if (type === 'FLIGHT') name = 'Airline';
                                                                    else if (type === 'BUS') name = 'Bus';
                                                                    else if (type === 'MIXED') name = 'Smart Combo';
                                                                }

                                                                if (name || code) {
                                                                    const isTrain = type === 'TRAIN';
                                                                    return (
                                                                        <div className={`text-sm font-bold ${isTrain ? 'text-green-600' : 'text-blue-600'} mb-0.5 flex items-center gap-1`}>
                                                                            {name}
                                                                            {code && <span className="text-gray-400 font-normal text-xs">({code})</span>}
                                                                        </div>
                                                                    );
                                                                }
                                                                return null;
                                                            })()}
                                                            <h4 className="font-semibold text-lg text-gray-900">
                                                                {route.type === "MIXED" ? `${fromCity} → ${route.hub} → ${toCity}` : `${fromCity} → ${toCity}`}
                                                            </h4>
                                                        </div>
                                                        <div className="text-xs text-gray-500 font-mono font-medium mt-0.5">
                                                            {fromAirport} <span className="text-gray-300 mx-1">→</span> {route.type === "MIXED" ? getCityInfo(route.hub)?.code || "HUB" : ""} <span className="text-gray-300 mx-1">→</span> {toAirport}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6 text-sm text-gray-600">
                                                    <div>
                                                        <span className="block text-xs text-gray-400 font-medium uppercase">Departure</span>
                                                        <span className="font-medium text-gray-900">{route.departureTime || 'Today'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs text-gray-400 font-medium uppercase">Duration</span>
                                                        <span className="font-medium text-gray-900">{route.total_time?.toFixed(1)}h</span>
                                                    </div>
                                                    {route.legs && (
                                                        <div className="hidden md:block">
                                                            <span className="block text-xs text-gray-400 font-medium uppercase">Connection</span>
                                                            <span className="font-medium text-gray-900">{route.hub}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right: Price & Action */}
                                            <div className="flex flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto justify-between md:justify-end">
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-gray-900">₹{displayPrice.toLocaleString("en-IN")}</div>
                                                    <div className="text-xs text-gray-400">total price</div>
                                                </div>

                                                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${tagColor}`}>
                                                    {tagLabel}
                                                </div>

                                                <button
                                                    onClick={() => navigate('/booking', { state: { flight: route, from: fromCity, to: toCity } })}
                                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm text-sm"
                                                >
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>

                                        {/* Explanation for Mixed Routes */}
                                        {route.explanation && (
                                            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 border-l-4 border-orange-400">
                                                <span className="font-bold text-gray-800 mr-2">Why this route?</span> {route.explanation}
                                            </div>
                                        )}
                                    </div>

                                );
                            })}
                        </div>

                        {/* Show More Button */}
                        {secondaryCount > 0 && (
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="w-full py-3 text-sm font-semibold text-blue-600 bg-white border border-blue-100 rounded-xl hover:bg-blue-50 transition-colors"
                            >
                                {showAll ? "Hide extra options" : `Show ${secondaryCount} more options`}
                            </button>
                        )}
                    </div>
                )}

                {/* Map Section (Collapsible or Bottom) */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mt-8">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-semibold text-gray-700">Route Map Visualization</h3>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">Live Tracking</span>
                    </div>
                    <div className="h-[350px] w-full z-0 relative">
                        <MapContainer
                            center={[22.9734, 78.6569]}
                            zoom={5}
                            style={{ height: "100%", width: "100%" }}
                            zoomControl={false}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            />

                            {fromCity && getLocationCoords(fromCity) && (
                                <Marker position={getLocationCoords(fromCity)} icon={greenIcon}>
                                    <Popup><strong>{fromCity}</strong><br />Origin</Popup>
                                </Marker>
                            )}
                            {toCity && getLocationCoords(toCity) && (
                                <Marker position={getLocationCoords(toCity)} icon={redIcon}>
                                    <Popup><strong>{toCity}</strong><br />Destination</Popup>
                                </Marker>
                            )}
                            {renderMapRoutes()}
                            <MapUpdater from={fromCity} to={toCity} routes={results} />
                        </MapContainer>
                    </div>
                </div>

                {/* How it works (Minimal) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 opacity-60">
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-gray-100 rounded text-gray-600">✈️</span>
                        <span className="text-xs text-gray-500">Live Airline Pricing</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-gray-100 rounded text-gray-600">🚂</span>
                        <span className="text-xs text-gray-500">Indian Rail API</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-gray-100 rounded text-gray-600">🔀</span>
                        <span className="text-xs text-gray-500">AI Routing Engine</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-gray-100 rounded text-gray-600">🛡️</span>
                        <span className="text-xs text-gray-500">Verified Seats</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FlightSelection;
