import { useNavigate } from 'react-router-dom';

const BookingConfirmed = () => {
    const navigate = useNavigate();

    const bookingId = 'BP-I770458257184-2LF49GBZR';

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                {/* Success Message */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Booking Confirmed!</h1>
                    <p className="text-gray-600 mb-2">Your flight has been successfully booked.</p>
                    <p className="text-sm text-gray-500">Booking ID: <span className="font-mono font-medium">{bookingId}</span></p>
                </div>

                {/* Info Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold text-blue-700">Digital Travel Pass</span> generated!
                        Access your pass to view journey details, visit <span className="font-semibold">Airport Mode</span>,
                        and book additional services.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/travel-pass')}
                        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                    >
                        View Travel Pass
                    </button>

                    <button
                        onClick={() => navigate('/trip-selection')}
                        className="w-full bg-white text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-gray-300"
                    >
                        Book Another Flight
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmed;
