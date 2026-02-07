import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import LoginPage from './components/loginpage.jsx'
import TripSelection from './components/TripSelection.jsx'
import BookingPage from './components/BookingPage.jsx'
import PaymentPage from './components/PaymentPage.jsx'
import BookingConfirmed from './components/BookingConfirmed.jsx'
import TravelPass from './components/TravelPass.jsx'
import FlightSelection from './components/FlightSelection.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/trip-selection" element={<TripSelection />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/booking-confirmed" element={<BookingConfirmed />} />
        <Route path="/travel-pass" element={<TravelPass />} />
        <Route path="/flight-selection" element={<FlightSelection />} />
      </Routes>
    </Router>
  </StrictMode>,
)
