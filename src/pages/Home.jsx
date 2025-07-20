import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, Users, Plane, Star, Shield, Clock } from 'lucide-react';

const Home = () => {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departure: '',
    return: '',
    passengers: 1,
    tripType: 'oneway'
  });
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Create query parameters
    const params = new URLSearchParams();
    if (searchData.from) params.append('FromLocation', searchData.from);
    if (searchData.to) params.append('ToLocation', searchData.to);
    if (searchData.departure) params.append('FromDate', searchData.departure);
    if (searchData.return && searchData.tripType === 'roundtrip') {
      params.append('ToDate', searchData.return);
    }
    if (searchData.passengers) params.append('passengers', searchData.passengers);
    if (searchData.tripType) params.append('tripType', searchData.tripType);

    navigate(`/search?${params.toString()}`);
  };

  const popularDestinations = [
    { city: 'Dubai', country: 'UAE', price: 'From PKR 45,000', image: 'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg' },
    { city: 'Istanbul', country: 'Turkey', price: 'From PKR 55,000', image: 'https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg' },
    { city: 'London', country: 'UK', price: 'From PKR 85,000', image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg' },
    { city: 'Bangkok', country: 'Thailand', price: 'From PKR 65,000', image: 'https://images.pexels.com/photos/2506946/pexels-photo-2506946.jpeg' }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Booking',
      description: 'Your personal and payment information is always protected with our advanced security measures.'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Our customer support team is available round the clock to assist you with any queries.'
    },
    {
      icon: Star,
      title: 'Best Prices',
      description: 'Compare prices from multiple airlines and get the best deals for your travel destinations.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your Journey Begins with
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                FlightBook
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Discover amazing destinations, compare prices, and book your perfect flight with confidence
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Trip Type */}
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tripType"
                      value="oneway"
                      checked={searchData.tripType === 'oneway'}
                      onChange={(e) => setSearchData({ ...searchData, tripType: e.target.value })}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-gray-700">One Way</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tripType"
                      value="roundtrip"
                      checked={searchData.tripType === 'roundtrip'}
                      onChange={(e) => setSearchData({ ...searchData, tripType: e.target.value })}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-gray-700">Round Trip</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* From */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Departure city"
                        value={searchData.from}
                        onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* To */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Destination city"
                        value={searchData.to}
                        onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Departure Date */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        value={searchData.departure}
                        onChange={(e) => setSearchData({ ...searchData, departure: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Return Date */}
                  {searchData.tripType === 'roundtrip' && (
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Return</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="date"
                          value={searchData.return}
                          onChange={(e) => setSearchData({ ...searchData, return: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {/* Passengers */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <select
                        value={searchData.passengers}
                        onChange={(e) => setSearchData({ ...searchData, passengers: parseInt(e.target.value) })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Search className="h-5 w-5" />
                  <span>Search Flights</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our most sought-after destinations with unbeatable prices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularDestinations.map((destination, index) => (
              <div
                key={index}
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={destination.image}
                    alt={destination.city}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{destination.city}</h3>
                    <p className="text-sm opacity-90">{destination.country}</p>
                    <p className="text-sm font-semibold mt-1">{destination.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FlightBook?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make your travel experience seamless and memorable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;