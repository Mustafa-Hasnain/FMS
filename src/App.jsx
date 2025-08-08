import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import SearchFlights from './pages/user/SearchFlights';
import backgroundImage from './assets/images/background-image.png';
import "./style/app.css"
import AdminFlightManagement from './pages/admin/AdminFlightManagement';
import AircraftManagement from './pages/admin/AircraftManagement';
import Aircrafts from './pages/admin/Aircrafts';
import useAuthRedirect from './hooks/useAuthRedirect';
import PrivateCharter from './pages/admin/PrivateCharter';
import PrivateCharterDetails from './pages/admin/PrivateCharterDetails';
import PrivateCharterForm from './pages/user/PrivateCharterForm';
import ServicesPage from './pages/user/Services/ServicesPage';
import FlightProducts from './pages/user/Iframes/FlightProducts';
import FlightDetails from './pages/user/Iframes/FlightDetails';
import FlightBooking from './pages/admin/FlightBooking';
import FlightBookingDetails from './pages/admin/FlightBookingDetails';

// Universal Layout component that wraps all screens
const UniversalLayout = ({ children, containerClass = "", contentClass = "" }) => {
  useAuthRedirect();
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative"
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content Container */}
      <div className={`relative z-10 ${containerClass}`}>
        <div className={contentClass}>
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Auth Routes - Centered layout */}
        <Route
          path="/login"
          element={
            <UniversalLayout
              containerClass="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
              contentClass="w-full max-w-md sm:max-w-lg md:max-w-[70%]"
            >
              <Login isAdmin={true} />
            </UniversalLayout>
          }
        />

        {/* <Route
          path="/"
          element={
            <UniversalLayout containerClass="min-h-screen py-8"
              contentClass="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <PrivateCharterForm />
            </UniversalLayout>
          }
        /> */}

        {/* <Route
          path="/signup"
          element={
            <UniversalLayout
              containerClass="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
              contentClass="w-full max-w-md sm:max-w-lg md:max-w-[70%]"
            >
              <SignUp />
            </UniversalLayout>
          }
        /> */}


        {/* User Routes */}
        <Route
          path="/services"
          element={
            <Layout>
              <ServicesPage />
            </Layout>
          }
        />

        <Route
          path="/flights-products"
          element={
            <FlightProducts />
          }
        />

        <Route
          path="/flights-details"
          element={
            <FlightDetails />
          }
        />

        <Route
          path="/private-charter-form"
          element={
              <PrivateCharterForm />
          }
        />


        {/* <Route
          path="/private-charter-form"
          element={
            <UniversalLayout containerClass="min-h-screen py-8"
              contentClass="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <PrivateCharterForm />
            </UniversalLayout>
          }
        />

        <Route
          path="/"
          element={
            <UniversalLayout containerClass="min-h-screen py-8"
              contentClass="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SearchFlights />
            </UniversalLayout>
          }
        />

        <Route
          path="/aircrafts"
          element={
            <UniversalLayout containerClass="min-h-screen py-8"
              contentClass="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Aircrafts />
            </UniversalLayout>
          }
        /> */}

        {/* Admin Routes */}
        <Route
          path="/admin/search"
          element={
            <UniversalLayout containerClass="min-h-screen py-8"
              contentClass="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SearchFlights />
            </UniversalLayout>
          }
        />

        <Route
          path="/admin/flight-management/:id?"
          element={
            <UniversalLayout containerClass="min-h-screen py-8"
              contentClass="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AdminFlightManagement />
            </UniversalLayout>
          }
        />

        <Route
          path="/admin/aircraft-management/:id?"
          element={
            <UniversalLayout containerClass="min-h-screen py-8"
              contentClass="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AircraftManagement />
            </UniversalLayout>
          }
        />

        <Route
          path="/aircraft-management/:id?"
          element={
            <UniversalLayout containerClass="min-h-screen py-8"
              contentClass="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AircraftManagement />
            </UniversalLayout>
          }
        />

        <Route
          path="/admin/aircrafts"
          element={
            <UniversalLayout containerClass="min-h-screen py-8"
              contentClass="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Aircrafts />
            </UniversalLayout>
          }
        />

        <Route
          path="/admin/private-charter"
          element={
            <UniversalLayout containerClass="min-h-screen py-8"
              contentClass="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <PrivateCharter />
            </UniversalLayout>
          }
        />

        <Route
          path="/admin/private-charter/:id"
          element={
            <UniversalLayout containerClass="min-h-screen py-8"
              contentClass="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <PrivateCharterDetails />
            </UniversalLayout>
          }
        />

        <Route
          path="/admin/flights-bookings"
          element={
            <UniversalLayout containerClass="min-h-screen py-8"
              contentClass="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FlightBooking />
            </UniversalLayout>
          }
        />

        <Route
          path="/admin/flights-bookings/:id"
          element={
            <UniversalLayout containerClass="min-h-screen py-8"
              contentClass="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FlightBookingDetails />
            </UniversalLayout>
          }
        />


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/private-charter-form" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;