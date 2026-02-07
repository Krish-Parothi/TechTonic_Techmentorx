import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TravelPass = () => {
    const navigate = useNavigate();
    const [selectedTrip, setSelectedTrip] = useState('delhi-mumbai');

    const trips = [
        {
            id: 'delhi-mumbai',
            from: 'Delhi',
            to: 'Mumbai',
            date: 'Mar 15',
            status: 'Upcoming',
        },
    ];

    const travelPassData = {
        bookingId: 'BP-I770458257184-2LF49GBZR',
        from: 'Delhi',
        to: 'Mumbai',
        fromCode: 'DEL',
        toCode: 'BOM',
        departureDate: 'Sun, Mar 15, 2026',
        returnDate: 'Sun, Mar 22, 2026',
        totalPaid: 3299,
        status: 'Upcoming',
        departureIn: '36 days',
        airportArrival: '2 hours before departure',
        originAirport: 'Delhi (DEL)',
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <h1 className="text-xl font-bold text-gray-900">Digital Travel Pass</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Trip Selector */}
                <div className="mb-6">
                    <h2 className="text-sm font-medium text-gray-700 mb-3">Your Travel Passes</h2>
                    <div className="flex gap-3">
                        {trips.map((trip) => (
                            <button
                                key={trip.id}
                                onClick={() => setSelectedTrip(trip.id)}
                                className={`px-6 py-4 rounded-lg border-2 transition-all ${selectedTrip === trip.id
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                            >
                                <div className="text-left">
                                    <p className="font-semibold text-gray-900">{trip.from} — {trip.to}</p>
                                    <p className="text-sm text-gray-500">{trip.date}</p>
                                    <span className="inline-block mt-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                        {trip.status}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Travel Pass Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white mb-6">
                    {/* Booking ID & Status */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-xs opacity-80 mb-1">Booking ID</p>
                            <p className="font-mono font-semibold text-sm">{travelPassData.bookingId}</p>
                        </div>
                        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                            {travelPassData.status}
                        </span>
                    </div>

                    {/* Route */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-bold">{travelPassData.from}</h2>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <h2 className="text-3xl font-bold">{travelPassData.to}</h2>
                        </div>
                        <p className="text-sm opacity-90">{travelPassData.fromCode} — {travelPassData.toCode}</p>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <p className="text-xs opacity-80 mb-1">Departure</p>
                            <p className="font-semibold">{travelPassData.departureDate}</p>
                        </div>
                        <div>
                            <p className="text-xs opacity-80 mb-1">Return</p>
                            <p className="font-semibold">{travelPassData.returnDate}</p>
                        </div>
                    </div>

                    {/* Total Paid */}
                    <div className="border-t border-white/20 pt-4">
                        <p className="text-xs opacity-80 mb-1">Total Paid</p>
                        <p className="text-2xl font-bold">₹{travelPassData.totalPaid.toLocaleString()}</p>
                    </div>
                </div>

                {/* Journey Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Journey Information</h3>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Departure in</p>
                                <p className="text-sm text-gray-600">{travelPassData.departureIn}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Recommended airport arrival</p>
                                <p className="text-sm text-gray-600">{travelPassData.airportArrival}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Origin Airport</p>
                                <p className="text-sm text-gray-600">{travelPassData.originAirport}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About FlyWise LLM */}
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">About FlyWise LLM Orchestration</h3>
                    <p className="text-sm text-gray-700">
                        FlyWise LLM does not replace airline or airport systems. It acts as an intelligent orchestration layer that connects
                        booking, airport experience, and ecosystem services.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default TravelPass;
