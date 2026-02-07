import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/loginpage';
import TripSelection from './components/TripSelection';
import FlightSelection from './components/FlightSelection';
import BookingPage from './components/BookingPage';
import PaymentPage from './components/PaymentPage';
import TravelPass from './components/TravelPass';
import BookingConfirmed from './components/BookingConfirmed';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/trip-selection" element={<TripSelection />} />
        <Route path="/flight-selection" element={<FlightSelection />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/travel-pass" element={<TravelPass />} />
        <Route path="/booking-confirmed" element={<BookingConfirmed />} />
      </Routes>
    </Router>
  );
}

export default App;
