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

// Universal Layout component that wraps all screens
const UniversalLayout = ({ children, containerClass = "", contentClass = "" }) => {
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
              <Login />
            </UniversalLayout>
          }
        />

        <Route
          path="/signup"
          element={
            <UniversalLayout
              containerClass="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
              contentClass="w-full max-w-md sm:max-w-lg md:max-w-[70%]"
            >
              <SignUp />
            </UniversalLayout>
          }
        />

        {/* Main App Routes - Full layout with navigation */}
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
          path="/search"
          element={
            <UniversalLayout containerClass="min-h-screen py-8"
              contentClass="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SearchFlights />
            </UniversalLayout>
          }
        />

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
          path="/admin/aircrafts"
          element={
            <UniversalLayout containerClass="min-h-screen py-8"
              contentClass="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Aircrafts />
            </UniversalLayout>
          }
        />

        {/* Add more routes as needed with different dimensions */}
        {/* Example for a different screen size:
        <Route 
          path="/profile" 
          element={
            <UniversalLayout 
              containerClass="min-h-screen py-8"
              contentClass="max-w-2xl mx-auto px-4"
            >
              <Layout>
                <Profile />
              </Layout>
            </UniversalLayout>
          } 
        />
        */}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/search" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;