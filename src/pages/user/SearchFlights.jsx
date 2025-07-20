import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Plane, X } from 'lucide-react';
import { url } from '../../utils/url';
import FlightCard from '../../components/pageComponents/FlightCard';
import CustomButton from '../../components/custom/CustomButton';
import CustomInput from '../../components/custom/CustomInput';
import { isAdminRoute } from '../../utils/routeUtil';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import toast from 'react-hot-toast';
import AdminNavigation from '../../components/common/AdminNavigation';

const SearchFlights = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const location = useLocation();
  const isAdmin = isAdminRoute(location.pathname);

  // Initialize form data from URL parameters
  const [formData, setFormData] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    departure: searchParams.get('departure') || '',
    return: searchParams.get('return') || '',
    passengers: parseInt(searchParams.get('passengers')),
  });

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load flights on component mount if query parameters exist
  useEffect(() => {

    fetchFlights();

  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    setError('');

    try {
      // Build query parameters from current form data
      const params = new URLSearchParams();

      if (formData.from) params.append('FromLocation', formData.from);
      if (formData.to) params.append('ToLocation', formData.to);
      if (formData.departure) params.append('DepartureDate', formData.departure);
      if (formData.return) params.append('ToDate', formData.return);
      if (formData.passengers) params.append('passengers', formData.passengers.toString());
      if (formData.class) params.append('class', formData.class);

      // Update URL with current search parameters
      setSearchParams(params);

      const response = await fetch(`${url}/Flight/search?${params.toString()}`);
      const result = await response.json();
      console.log("Flights: ", result);

      if (result.success) {
        setFlights(result.data);
      } else {
        setError(result.message || 'Failed to fetch flights');
        setFlights([]);
      }
    } catch (err) {
      setError('Error fetching flights. Please try again.');
      setFlights([]);
      console.error('Error fetching flights:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFlights();
  };

  const handleBookFlight = (flightId) => {
    // navigate(`/booking/${flightId}`, {
    //   state: { passengers: formData.passengers }
    // });
  };

  const handleEditFlight = (flightId) => {
    navigate(`/admin/flight-management/${flightId}`);
  };

  const handleDeleteFlight = (flightId) => {
    setDeleteId(flightId);
    setShowConfirmModal(true);
  };

  const confirmDelete = async (flightId) => {
    setDeleteLoading(true);

    try {
      const response = await fetch(`${url}/Flight/${flightId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Remove flight from local state
        setFlights(prev => prev.filter(flight => flight.id !== flightId));
        toast.success('Flight deleted successfully');
        setShowConfirmModal(false);
        setDeleteId(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete flight');
      }
    } catch (err) {
      toast.error('Error deleting flight. Please try again.');
      console.error('Error deleting flight:', err);
    } finally {
      setDeleteLoading(false);
    }
  };


  // Show initial loading if we have params and are loading
  if (loading && Array.from(searchParams.keys()).length > 0 && flights.length === 0) {
    return (
      <div className="min-h-screen bg-black items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mx-auto"></div>
          <p className="mt-4 text-[#CDFF00] text-lg">Searching for flights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/80 backdrop-blur-sm rounded-2xl min-h-screen text-white items-center justify-center">
      {/* Header Navigation */}
      {
        isAdmin ? (
          <AdminNavigation
            showBackButton={false}
            onBackClick={() => navigate('/admin/aircrafts')}
            userInfo={{
              name: "Admin User",
              email: "admin@jetrique.com",
              avatar: null // You can pass a URL here if available
            }}
          />
        )
          :
          <div className="border-b border-gray-800 px-6 py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <Plane className="h-6 w-6 text-[#CDFF00]" />
                  <span className="text-xl font-medium font-orbitron text-[#CDFF00]">Jetrique</span>
                </div>
              </div>
            </div>
          </div>}

      {/* Search Form */}
      <div className="px-6 py-8 text-white">
        <div className="max-w-7xl mx-auto">
          {/* Tab navigation */}
          <div className="flex border border-[#CDFF00] rounded-md overflow-hidden mb-6">
            <div className="flex-1 px-4 py-3 bg-black border-r border-[#CDFF00] flex items-center space-x-2 text-[#CDFF00]">
              <Search className="h-4 w-4" />
              <span className="text-sm font-semibold">Search flights</span>
            </div>
            <div className="flex-1 px-4 py-3 hover:bg-gray-800 cursor-pointer flex items-center space-x-2 text-gray-400">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Manage Booking/Check in</span>
            </div>
            <div className="flex-1 px-4 py-3 hover:bg-gray-800 cursor-pointer flex items-center space-x-2 text-gray-400">
              <Plane className="h-4 w-4" />
              <span className="text-sm">What's on your flight</span>
            </div>
            <div className="flex-1 px-4 py-3 hover:bg-gray-800 cursor-pointer flex items-center space-x-2 text-gray-400">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Flight status</span>
            </div>
          </div>

          <form onSubmit={handleSearch} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            {/* Row 1: Departure & Arrival */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <CustomInput
                label="Departure airport"
                name="from"
                placeholder="Karachi (KHI)"
                value={formData.from}
                onChange={(e) => handleInputChange('from', e.target.value)}
                required
              />
              <CustomInput
                label="Arrival airport"
                name="to"
                placeholder="Dubai (DXB)"
                value={formData.to}
                onChange={(e) => handleInputChange('to', e.target.value)}
                required
              />
            </div>

            {/* Row 2: Passengers, Class, Dates, Search */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Passengers */}
              <div>
                <label className="block text-sm text-gray-300 mb-1 font-inter">Passengers</label>
                <select
                  value={formData.passengers}
                  onChange={(e) => handleInputChange('passengers', parseInt(e.target.value))}
                  className="w-full py-[14px] px-4 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-[#CDFF00]"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>
                      {num} passenger{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>


              {/* Departing */}
              <CustomInput
                type="date"
                name="departure"
                label="Departing"
                value={formData.departure}
                onChange={(e) => handleInputChange('departure', e.target.value)}
              />

              {/* Returning */}
              <CustomInput
                type="date"
                name="return"
                label="Arrival"
                value={formData.return}
                onChange={(e) => handleInputChange('return', e.target.value)}
              />

              {/* Search Button */}
              <CustomButton
                type="submit"
                text="Search flights"
                loading={loading}
                onClickText="Searching..."
              />
            </div>
          </form>
        </div>
      </div>


      {/* Results Section */}
      <div className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CDFF00] mx-auto"></div>
              <p className="mt-4 text-[#CDFF00]">Searching for flights...</p>
            </div>
          )}

          {/* Flight Results */}
          {!loading && flights.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4">
                Found {flights.length} flight{flights.length > 1 ? 's' : ''}
              </h2>
              {flights.map(flight => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  passengers={formData.passengers}
                  onBookFlight={handleBookFlight}
                  isAdmin={isAdmin}
                  onEditFlight={handleEditFlight}
                  onDeleteFlight={handleDeleteFlight}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && flights.length === 0 && !error && Array.from(searchParams.keys()).length > 0 && (
            <div className="text-center py-12">
              <Plane className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No flights found</h3>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </div>
          )}

          {/* Initial State */}
          {!loading && flights.length === 0 && !error && Array.from(searchParams.keys()).length === 0 && (
            <div className="text-center py-12">
              <Plane className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Search for flights</h3>
              <p className="text-gray-400">Enter your travel details above to find available flights</p>
            </div>
          )}

        </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => confirmDelete(deleteId)}
        title={"Delete Flight"}
        message={`Are you sure you want to delete this flight? This action cannot be undone.`}
        confirmText={"Delete"}
        cancelText="Cancel"
        type="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default SearchFlights;