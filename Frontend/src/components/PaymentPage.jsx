import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
    const navigate = useNavigate();
    const [selectedMethod, setSelectedMethod] = useState('upi');
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [cardName, setCardName] = useState('');

    // Mock booking data
    const bookingData = {
        from: 'Delhi',
        to: 'Mumbai',
        fromCode: 'DEL',
        toCode: 'BOM',
        departureDate: 'Mar 15, 2026',
        returnDate: 'Mar 22, 2026',
        duration: '7 days trip',
        totalPrice: 3299,
    };

    const handlePayment = () => {
        console.log('Processing payment...', { selectedMethod });
        // Navigate to confirmation page
        navigate('/booking-confirmed');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back to Details</span>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-3 gap-6">
                    {/* Left Column - Payment Form */}
                    <div className="col-span-2">
                        {/* Security Banner */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p className="text-sm text-gray-700">
                                Your payment is <span className="font-semibold text-green-700">100% secure</span> and encrypted
                            </p>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h2>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <button
                                    onClick={() => setSelectedMethod('upi')}
                                    className={`p-4 rounded-lg border-2 transition-all ${selectedMethod === 'upi'
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm font-medium text-gray-900">UPI</p>
                                </button>

                                <button
                                    onClick={() => setSelectedMethod('card')}
                                    className={`p-4 rounded-lg border-2 transition-all ${selectedMethod === 'card'
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    <p className="text-sm font-medium text-gray-900">Card</p>
                                </button>

                                <button
                                    onClick={() => setSelectedMethod('netbanking')}
                                    className={`p-4 rounded-lg border-2 transition-all ${selectedMethod === 'netbanking'
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <p className="text-sm font-medium text-gray-900">Net Banking</p>
                                </button>
                            </div>

                            {/* UPI Form */}
                            {selectedMethod === 'upi' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                                    <input
                                        type="text"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        placeholder="yourname@upi"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">Supports Google Pay, PhonePe, Paytm, and other UPI apps</p>
                                </div>
                            )}

                            {/* Card Form */}
                            {selectedMethod === 'card' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength="19"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                                        <input
                                            type="text"
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                            placeholder="Name on card"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                                            <input
                                                type="text"
                                                value={cardExpiry}
                                                onChange={(e) => setCardExpiry(e.target.value)}
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                                            <input
                                                type="text"
                                                value={cardCvv}
                                                onChange={(e) => setCardCvv(e.target.value)}
                                                placeholder="123"
                                                maxLength="3"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Net Banking Form */}
                            {selectedMethod === 'netbanking' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Bank</label>
                                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">Choose your bank</option>
                                        <option value="sbi">State Bank of India</option>
                                        <option value="hdfc">HDFC Bank</option>
                                        <option value="icici">ICICI Bank</option>
                                        <option value="axis">Axis Bank</option>
                                        <option value="kotak">Kotak Mahindra Bank</option>
                                    </select>
                                </div>
                            )}

                            {/* Pay Button */}
                            <button
                                onClick={handlePayment}
                                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg mt-6"
                            >
                                Pay ₹{bookingData.totalPrice.toLocaleString()}
                            </button>

                            <p className="text-xs text-center text-gray-500 mt-4">
                                By proceeding, you agree to FlyWise's <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Booking Summary */}
                    <div className="col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>

                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg font-semibold text-gray-900">{bookingData.from}</span>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    <span className="text-lg font-semibold text-gray-900">{bookingData.to}</span>
                                </div>
                                <p className="text-sm text-gray-500">{bookingData.fromCode} → {bookingData.toCode}</p>
                            </div>

                            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p className="text-xs text-gray-500">Departure</p>
                                        <p className="text-sm font-medium text-gray-900">{bookingData.departureDate}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p className="text-xs text-gray-500">Return</p>
                                        <p className="text-sm font-medium text-gray-900">{bookingData.returnDate}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 ml-7">{bookingData.duration}</p>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600">Total Amount</span>
                                    <span className="text-2xl font-bold text-gray-900">₹{bookingData.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-2 bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Instant confirmation</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>24/7 customer support</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Secure payment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaymentPage;
