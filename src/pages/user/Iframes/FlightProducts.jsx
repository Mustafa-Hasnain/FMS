import React, { useState, useEffect } from 'react';
import { Plane, Clock, Users, Wifi, UtensilsCrossed, Luggage } from 'lucide-react';
import { url } from '../../../utils/url';
import { formatDate, formatTime } from '../../../utils/dateUtils';

const FlightProducts = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${url}/Flight/search`);
        const result = await response.json();
        
        if (result.success) {
          // Filter flights that have images
          const flightsWithImages = result.data.filter(flight => flight.images && flight.images.length > 0);
          setFlights(flightsWithImages);
        } else {
          setError('Failed to fetch flights');
        }
      } catch (err) {
        setError('Error fetching flight data');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const getDuration = (departure, arrival) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diffMs = arr - dep;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      const days = Math.floor(diffHours / 24);
      const hours = diffHours % 24;
      return `${days}d ${hours}h`;
    }
    return `${diffHours}h ${diffMins}m`;
  };

  const getDisplayImage = (images) => {
    // First try to find non-banner image, otherwise use any available image
    const nonBannerImage = images.find(img => !img.isBannerImage);
    return nonBannerImage || images[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Flights</h2>
          <p className="text-gray-500">Searching for the best deals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Flights Available</h2>
          <p className="text-gray-600">No flights with images found at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Premium Flight Collection</h1>
          <p className="text-lg text-gray-600">Discover luxury travel experiences</p>
        </div> */}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {flights.map((flight) => {
            const displayImage = getDisplayImage(flight.images);
            return (
              <div key={flight.id} onClick={() => window.open(`https://jetrique.com/lets-go-booking/?id=${flight.id}`, '_blank')} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={displayImage.imageUrl}
                    alt={`Flight from ${flight.fromLocation} to ${flight.toLocation}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {flight.fromLocation} → {flight.toLocation}
                    </h3>
                    <p className="text-blue-200 text-sm font-medium">
                      {flight.aircraftName}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-sm font-bold text-gray-800">${flight.seatPrice}</span>
                  </div>
                </div>
                
                {/* <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatDate(flight.departureDatetime)} • {formatTime(flight.departureDatetime)}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-blue-600">
                      {getDuration(flight.departureDatetime, flight.arrivalDatetime)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{flight.seatsAvailable} seats</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Luggage className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{flight.maxLuggageWeight}kg</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {flight.mealIncluded && (
                        <div className="flex items-center space-x-1">
                          <UtensilsCrossed className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-green-600 font-medium">Meal</span>
                        </div>
                      )}
                      {flight.wifiAvailable && (
                        <div className="flex items-center space-x-1">
                          <Wifi className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-blue-600 font-medium">WiFi</span>
                        </div>
                      )}
                    </div>
                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg">
                      Book Now
                    </button>
                  </div>
                </div> */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FlightProducts;