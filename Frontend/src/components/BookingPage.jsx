import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingPage = () => {
    const navigate = useNavigate();

    // Mock booking data - in real app, this would come from route state or API
    const [bookingData] = useState({
        from: 'Delhi',
        to: 'Mumbai',
        fromCode: 'DEL',
        toCode: 'BOM',
        departureDate: 'Sunday, March 15, 2026',
        returnDate: 'Sunday, March 22, 2026',
        duration: '7 days',
        totalPrice: 3299,
    });

    const handleProceedToPayment = () => {
        navigate('/payment');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back to Results</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Flight Details</h1>

                {/* Flight Details Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
                    {/* Route Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">{bookingData.from}</h2>
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <h2 className="text-3xl font-bold text-gray-900">{bookingData.to}</h2>
                    </div>

                    {/* Airport Codes */}
                    <div className="flex items-center gap-2 text-blue-600 mb-8">
                        <span className="font-medium">{bookingData.fromCode}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        <span className="font-medium">{bookingData.toCode}</span>
                    </div>

                    {/* Trip Details Grid */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        {/* Departure */}
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-medium">Departure</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">{bookingData.departureDate}</p>
                        </div>

                        {/* Return */}
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-medium">Return</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">{bookingData.returnDate}</p>
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">Duration</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{bookingData.duration}</p>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-6"></div>

                    {/* Total Price */}
                    <div>
                        <p className="text-sm text-gray-500 mb-2">Total Price</p>
                        <p className="text-4xl font-bold text-blue-600">₹{bookingData.totalPrice.toLocaleString()}</p>
                    </div>
                </div>

                {/* About This Booking Card */}
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-6">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-3">About This Booking</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-sm text-gray-700">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Complete trip from {bookingData.from} to {bookingData.to}</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-700">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Round trip journey</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-700">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Total duration: {bookingData.duration}</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-700">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>All taxes and fees included in the price shown</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky bottom-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Price</p>
                            <p className="text-2xl font-bold text-gray-900">₹{bookingData.totalPrice.toLocaleString()}</p>
                        </div>
                        <button
                            onClick={handleProceedToPayment}
                            className="bg-blue-600 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BookingPage;
