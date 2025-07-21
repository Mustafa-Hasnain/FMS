import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plane, ArrowLeft, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminNavigation = ({
  showBackButton = false,
  backButtonText = "Back",
  onBackClick = null,
  isAdmin = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const { logout, user, loading } = useAuth();

  // Navigation links
  const navLinks = useMemo(() => [
    { path: '/admin/search', label: 'Flights', isActive: location.pathname.includes('/admin/search') },
    { path: '/admin/aircrafts', label: 'Aircraft', isActive: location.pathname.includes('/admin/aircrafts') },
  ], [location.pathname]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Add your logout logic here
    logout();
    // Redirect to login page
    navigate('/login');
    setIsProfileMenuOpen(false);
  };

  const handleProfileClick = () => {
    // Navigate to profile page or handle profile click
    navigate('/admin/profile');
    setIsProfileMenuOpen(false);
  };

  const getInitials = (name) => {
    if (name) {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }

  };

  return (
    <div className="border-b border-gray-800 px-6 py-4 bg-black/80 backdrop-blur-sm rounded-2xl">
      <div className="flex items-center justify-between max-w-7xl mx-auto">

        {/* Left Section - Logo and Back Button */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Plane className="h-6 w-6 text-[#CDFF00]" />
            <span className="text-xl font-medium font-orbitron text-[#CDFF00]">Jetrique {isAdmin && "Admin"}</span>
          </div>

          {showBackButton && (
            <button
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-gray-400 hover:text-[#CDFF00] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>{backButtonText}</span>
            </button>
          )}
        </div>

        {/* Middle Section - Navigation Links */}
        {isAdmin && <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavigation(link.path)}
              className={`text-sm font-medium transition-colors hover:text-[#CDFF00] ${link.isActive
                ? 'text-[#CDFF00] border-b-2 border-[#CDFF00] pb-1'
                : 'text-gray-300'
                }`}
            >
              {link.label}
            </button>
          ))}
        </div>}

        {/* Right Section - Profile Menu */}
        {loading ? (
          <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse" />
        ) :
          user && (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-3 text-gray-300 hover:text-[#CDFF00] transition-colors group"
              >
                {/* Profile Image or Avatar */}
                <div className="relative">
                  {user?.avatar ? (
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover border border-gray-600 group-hover:border-[#CDFF00] transition-colors"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 border border-gray-600 group-hover:border-[#CDFF00] transition-colors flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-300 group-hover:text-[#CDFF00]">
                        {user?.Name && getInitials(user?.Name)}
                      </span>
                    </div>
                  )}
                </div>

                {/* User Name and Dropdown Arrow */}
                <div className="hidden sm:flex items-center space-x-1">
                  <span className="text-sm font-medium">{user?.Name}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''
                    }`} />
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="!z-50 absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl animate-in fade-in-0 slide-in-from-top-2 duration-200">
                  {/* User Info Header */}
                  {/* <div className="px-4 py-3 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                      {user?.avatar ? (
                        <img
                          src={user?.avatar}
                          alt={user?.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-300">
                            {user?.Name && getInitials(user?.Name)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white">{user?.Name}</p>
                        <p className="text-xs text-gray-400">{user?.sub}</p>
                      </div>
                    </div>
                  </div> */}

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#CDFF00] transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </button>

                    <div className="border-t border-gray-700 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        {!loading && !user &&
          <button
            onClick={() => navigate("/login")}
            className="flex items-center space-x-2 border-[1px] border-solid border-[#CDFF00] text-white px-4 py-2 rounded-md hover:bg-[#CDFF00] hover:text-black transition-all font-medium"
          >
            <span>Login</span>
          </button>
        }
      </div>

      {/* Mobile Navigation Links */}
      <div className="md:hidden mt-4 flex items-center space-x-6 overflow-x-auto">
        {navLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => handleNavigation(link.path)}
            className={`text-sm font-medium transition-colors hover:text-[#CDFF00] whitespace-nowrap ${link.isActive
              ? 'text-[#CDFF00] border-b-2 border-[#CDFF00] pb-1'
              : 'text-gray-300'
              }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminNavigation;