import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CITIES } from '../data/cities';

const TripSelection = () => {
    const navigate = useNavigate();
    const [searchMode, setSearchMode] = useState('destination');
    const [tripType, setTripType] = useState('round');
    const [fromCity, setFromCity] = useState('Delhi (DEL)');
    const [toCity, setToCity] = useState('Mumbai (BOM)');
    const [departureDate, setDepartureDate] = useState('2026-03-15');
    const [returnDate, setReturnDate] = useState('2026-03-22');

    // Budget search state
    const [maxBudget, setMaxBudget] = useState(5000);
    const [sortBy, setSortBy] = useState('price'); // 'price' or 'distance'
    const [filteredDestinations, setFilteredDestinations] = useState([]);

    // Travellers state
    const [showTravellersDropdown, setShowTravellersDropdown] = useState(false);
    const [travellersCount, setTravellersCount] = useState(1);
    const [selectedClass, setSelectedClass] = useState('Economy');

    // City search state
    const [fromSearch, setFromSearch] = useState('');
    const [toSearch, setToSearch] = useState('');
    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);
    const [filteredFromCities, setFilteredFromCities] = useState([]);
    const [filteredToCities, setFilteredToCities] = useState([]);

    const travellersRef = useRef(null);
    const fromRef = useRef(null);
    const toRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (travellersRef.current && !travellersRef.current.contains(event.target)) {
                setShowTravellersDropdown(false);
            }
            if (fromRef.current && !fromRef.current.contains(event.target)) {
                setShowFromDropdown(false);
            }
            if (toRef.current && !toRef.current.contains(event.target)) {
                setShowToDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter cities based on search
    useEffect(() => {
        if (fromSearch) {
            const filtered = CITIES.filter(city =>
                city.name.toLowerCase().includes(fromSearch.toLowerCase()) ||
                city.code.toLowerCase().includes(fromSearch.toLowerCase()) ||
                city.country.toLowerCase().includes(fromSearch.toLowerCase())
            );
            setFilteredFromCities(filtered);
        } else {
            setFilteredFromCities([]);
        }
    }, [fromSearch]);

    useEffect(() => {
        if (toSearch) {
            const filtered = CITIES.filter(city =>
                city.name.toLowerCase().includes(toSearch.toLowerCase()) ||
                city.code.toLowerCase().includes(toSearch.toLowerCase()) ||
                city.country.toLowerCase().includes(toSearch.toLowerCase())
            );
            setFilteredToCities(filtered);
        } else {
            setFilteredToCities([]);
        }
    }, [toSearch]);

    // Filter destinations by budget
    useEffect(() => {
        let filtered = CITIES.filter(city =>
            city.costFromDelhi > 0 && city.costFromDelhi <= maxBudget
        );

        // Sort destinations
        if (sortBy === 'price') {
            filtered.sort((a, b) => a.costFromDelhi - b.costFromDelhi);
        }

        setFilteredDestinations(filtered);
    }, [maxBudget, sortBy]);

    const swapCities = () => {
        const temp = fromCity;
        setFromCity(toCity);
        setToCity(temp);
    };

    const handleSearch = () => {
        console.log('Searching flights...', { fromCity, toCity, departureDate, returnDate, travellersCount, selectedClass });
    };

    const selectFromCity = (city) => {
        setFromCity(`${city.name} (${city.code})`);
        setFromSearch('');
        setShowFromDropdown(false);
    };

    const selectToCity = (city) => {
        setToCity(`${city.name} (${city.code})`);
        setToSearch('');
        setShowToDropdown(false);
    };

    const getTravellersDisplay = () => {
        return `${travellersCount} Traveller${travellersCount > 1 ? 's' : ''}, ${selectedClass}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900">FlyWise LLM</h1>
                            <p className="text-xs text-blue-600">Intelligent Flight Booking</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/travel-pass')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            Travel Pass
                        </button>
                        <button className="text-sm text-gray-600 hover:text-gray-900">My Trips</button>
                        <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Search Mode Tabs */}
                <div className="flex justify-center gap-3 mb-8">
                    <button
                        onClick={() => setSearchMode('destination')}
                        className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${searchMode === 'destination'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        Search by Destination
                    </button>
                    <button
                        onClick={() => setSearchMode('budget')}
                        className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${searchMode === 'budget'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        Travel by Budget
                    </button>
                </div>

                {/* Search Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    {/* Trip Type Selection */}
                    <div className="flex gap-8 mb-8 border-b border-gray-200 pb-6">
                        <button
                            onClick={() => setTripType('oneway')}
                            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${tripType === 'oneway'
                                ? 'text-blue-600 border-blue-600'
                                : 'text-gray-500 border-transparent hover:text-gray-700'
                                }`}
                        >
                            One Way
                        </button>
                        <button
                            onClick={() => setTripType('round')}
                            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${tripType === 'round'
                                ? 'text-blue-600 border-blue-600'
                                : 'text-gray-500 border-transparent hover:text-gray-700'
                                }`}
                        >
                            Round Trip
                        </button>
                        <button
                            onClick={() => setTripType('multi')}
                            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${tripType === 'multi'
                                ? 'text-blue-600 border-blue-600'
                                : 'text-gray-500 border-transparent hover:text-gray-700'
                                }`}
                        >
                            Multi City
                        </button>
                    </div>

                    {/* From/To Section */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* From City */}
                        <div ref={fromRef} className="relative">
                            <label className="block text-xs font-medium text-gray-600 mb-2">From</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={showFromDropdown ? fromSearch : fromCity}
                                    onChange={(e) => setFromSearch(e.target.value)}
                                    onFocus={() => {
                                        setShowFromDropdown(true);
                                        setFromSearch('');
                                    }}
                                    placeholder="Search city or airport"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* From City Dropdown */}
                            {showFromDropdown && filteredFromCities.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-20">
                                    {filteredFromCities.map((city) => (
                                        <button
                                            key={city.code}
                                            onClick={() => selectFromCity(city)}
                                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-600 font-semibold text-sm">
                                                    {city.code}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">{city.name}, {city.country}</div>
                                                    <div className="text-xs text-gray-500">{city.airport}</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* To City */}
                        <div ref={toRef} className="relative">
                            <label className="block text-xs font-medium text-gray-600 mb-2">To</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={showToDropdown ? toSearch : toCity}
                                    onChange={(e) => setToSearch(e.target.value)}
                                    onFocus={() => {
                                        setShowToDropdown(true);
                                        setToSearch('');
                                    }}
                                    placeholder="Search city or airport"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* To City Dropdown */}
                            {showToDropdown && filteredToCities.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-20">
                                    {filteredToCities.map((city) => (
                                        <button
                                            key={city.code}
                                            onClick={() => selectToCity(city)}
                                            className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-600 font-semibold text-sm">
                                                    {city.code}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">{city.name}, {city.country}</div>
                                                    <div className="text-xs text-gray-500">{city.airport}</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Swap Button */}
                            <button
                                onClick={swapCities}
                                className="absolute -left-6 top-1/2 translate-y-1/4 w-10 h-10 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors z-10"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Dates and Travellers Section */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">Departure</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="date"
                                    value={departureDate}
                                    onChange={(e) => setDepartureDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {tripType !== 'oneway' && (
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">
                                    <span className="text-blue-600">Return</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="date"
                                        value={returnDate}
                                        onChange={(e) => setReturnDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Travellers & Class */}
                        <div ref={travellersRef} className="relative">
                            <label className="block text-xs font-medium text-gray-600 mb-2">Travellers & Class</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <button
                                    onClick={() => setShowTravellersDropdown(!showTravellersDropdown)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left bg-white"
                                >
                                    {getTravellersDisplay()}
                                </button>
                            </div>

                            {/* Travellers Dropdown */}
                            {showTravellersDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-20">
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-gray-700">Travellers</span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setTravellersCount(Math.max(1, travellersCount - 1))}
                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-medium text-blue-600">{travellersCount}</span>
                                                <button
                                                    onClick={() => setTravellersCount(Math.min(9, travellersCount + 1))}
                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                                        <div className="flex flex-col gap-2">
                                            {['Economy', 'Premium Economy', 'Business', 'First Class'].map((classType) => (
                                                <button
                                                    key={classType}
                                                    onClick={() => setSelectedClass(classType)}
                                                    className={`w-full px-4 py-2 rounded-lg text-left text-sm transition-colors ${selectedClass === classType
                                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {classType}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                    >
                        Search Flights
                    </button>
                </div>

                {/* Budget Search Section */}
                {searchMode === 'budget' && (
                    <>
                        {/* Budget Controls */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-6">
                            <div className="grid grid-cols-2 gap-8">
                                {/* Budget Slider */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        Maximum budget per person
                                    </label>
                                    <div className="mb-4">
                                        <input
                                            type="range"
                                            min="1000"
                                            max="50000"
                                            step="500"
                                            value={maxBudget}
                                            onChange={(e) => setMaxBudget(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <span className="text-3xl font-bold text-blue-600">₹{maxBudget.toLocaleString()}</span>
                                        <p className="text-xs text-gray-500 mt-1">Flight cost only</p>
                                    </div>
                                </div>

                                {/* Sort Options */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        Sort results by
                                    </label>
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setSortBy('price')}
                                            className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${sortBy === 'price'
                                                ? 'bg-blue-50 text-blue-600 border-2 border-blue-600'
                                                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="font-medium">Lowest Price First</div>
                                            <div className="text-xs text-gray-500">Find the cheapest destinations</div>
                                        </button>
                                        <button
                                            onClick={() => setSortBy('distance')}
                                            className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${sortBy === 'distance'
                                                ? 'bg-blue-50 text-blue-600 border-2 border-blue-600'
                                                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="font-medium">Larger Trips First</div>
                                            <div className="text-xs text-gray-500">Sort by distance from Delhi</div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Budget Insights */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Budget Insights</h4>
                                        <p className="text-sm text-gray-600">
                                            Found <span className="font-semibold text-blue-600">{filteredDestinations.length} destinations</span> within your ₹{maxBudget.toLocaleString()} budget. Best value starts at ₹{filteredDestinations[0]?.costFromDelhi.toLocaleString() || '0'}.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Destination Cards Grid */}
                        <div className="mt-6">
                            <div className="grid grid-cols-3 gap-6">
                                {filteredDestinations.slice(0, 9).map((destination) => (
                                    <div key={destination.code} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                                        {/* Card Header */}
                                        <div className="bg-blue-600 p-6 text-white">
                                            <div className="flex items-center gap-2 mb-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-sm opacity-90">From Delhi</span>
                                            </div>
                                            <h3 className="text-2xl font-bold">{destination.name}</h3>
                                            <p className="text-sm opacity-90">{destination.code}</p>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-6">
                                            <div className="mb-4">
                                                <p className="text-xs text-gray-500 mb-1">Total flight cost</p>
                                                <p className="text-3xl font-bold text-blue-600">₹{destination.costFromDelhi.toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">Per person (round trip)</p>
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>Best travel dates</span>
                                                </div>
                                                <p className="text-sm text-gray-700 ml-6">Mar 15 - Mar 19</p>

                                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>7 days trip</span>
                                                </div>
                                            </div>

                                            <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-xs text-green-700 font-medium">Why this destination?</span>
                                                </div>
                                                <p className="text-xs text-green-600 mt-1">
                                                    You can budget for a 7-days trip with good value
                                                </p>
                                            </div>

                                            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                                View Details
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredDestinations.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No destinations found</h3>
                                    <p className="text-gray-600">Try increasing your budget to see more options</p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Feature Cards */}
                <div className="grid grid-cols-3 gap-6 mt-8">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Best Time to Book</h3>
                        <p className="text-sm text-gray-600">Book 2-3 weeks ahead for student savings</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Price Guarantee</h3>
                        <p className="text-sm text-gray-600">We'll refund the difference if prices drop</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Flexible Dates</h3>
                        <p className="text-sm text-gray-600">Save up to 15% by adjusting travel dates</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TripSelection;
