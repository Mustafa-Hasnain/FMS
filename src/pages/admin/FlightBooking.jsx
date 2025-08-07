import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Search, Eye, Calendar, MapPin, Users } from 'lucide-react';
import { url } from '../../utils/url';
import CustomButton from '../../components/custom/CustomButton';
import toast from 'react-hot-toast';
import AdminNavigation from '../../components/common/AdminNavigation';

const FlightBooking = () => {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/FlightBooking`);
            const result = await response.json();

            if (result.success) {
                setBookings(result.data || []);
            } else {
                toast.error(result.message || 'Failed to fetch flight bookings');
            }
        } catch (err) {
            console.error('Error fetching flight bookings:', err);
            toast.error('Error fetching flight bookings');
        } finally {
            setLoading(false);
        }
    };

    const getFlightTypeLabel = (flightType) => {
        const types = {
            0: 'Jet',
            1: 'Plane',
            2: 'Helicopter'
        };
        return types[flightType] || 'Jet';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return `$${price.toLocaleString()}`;
    };

    const handleViewDetails = (bookingId) => {
        console.log('View details for booking:', bookingId);
        navigate(`/admin/flights-bookings/${bookingId}`);
    };

    const filteredBookings = bookings.filter(booking =>
        booking.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone.includes(searchTerm) ||
        (booking.flight && (
            booking.flight.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.flight.toLocation.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    );

    return (
        <div className="bg-black/80 backdrop-blur-sm rounded-2xl min-h-screen text-white">
            {/* Header Navigation */}
            <AdminNavigation
                showBackButton={true}
                onBackClick={() => navigate('/admin/flight-booking')}
                userInfo={{
                    name: "Admin User",
                    email: "admin@jetrique.com",
                    avatar: null
                }}
            />

            {/* Main Content */}
            <div className="px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className='w-full'>
                            <h1 className="text-2xl font-semibold text-white mb-2">Flight Booking Requests</h1>
                            <p className="text-gray-400">Manage flight booking requests</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search bookings..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#CDFF00] focus:border-[#CDFF00]"
                            />
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CDFF00] mx-auto"></div>
                            <p className="mt-4 text-[#CDFF00]">Loading flight bookings...</p>
                        </div>
                    )}

                    {/* Booking Table */}
                    {!loading && filteredBookings.length > 0 && (
                        <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-700/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                <div className="flex items-center space-x-2">
                                                    <Users className="h-4 w-4" />
                                                    <span>Customer</span>
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>Flight Route</span>
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Departure</span>
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Guests & Rooms
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Price & Type
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {filteredBookings.map((booking) => (
                                            <tr key={booking.id} className="hover:bg-gray-700/30 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-white">
                                                            {booking.title} {booking.firstName} {booking.lastName}
                                                        </div>
                                                        <div className="text-sm text-gray-400">{booking.phone}</div>
                                                        {booking.travelPersons && booking.travelPersons.length > 0 && (
                                                            <div className="text-xs text-[#CDFF00]">
                                                                +{booking.travelPersons.length} travel companions
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {booking.flight ? (
                                                        <div>
                                                            <div className="text-sm text-white">
                                                                {booking.flight.fromLocation} → {booking.flight.toLocation}
                                                            </div>
                                                            <div className="text-sm text-gray-400">
                                                                Flight ID: {booking.flight.id}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">No flight data</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-white">
                                                        {booking.flight && booking.flight.departureDatetime ? 
                                                            formatDate(booking.flight.departureDatetime) : 
                                                            formatDate(booking.departureDate)
                                                        }
                                                    </div>
                                                    {booking.flight && booking.flight.arrivalDatetime && (
                                                        <div className="text-xs text-gray-400">
                                                            Arrives: {formatDate(booking.flight.arrivalDatetime)}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-white">
                                                        {booking.numberOfGuests} guest{booking.numberOfGuests !== 1 ? 's' : ''}
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        {booking.numberOfRooms} room{booking.numberOfRooms !== 1 ? 's' : ''}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        {booking.flight && booking.flight.seatPrice && (
                                                            <div className="text-sm font-medium text-[#CDFF00]">
                                                                {formatPrice(booking.flight.seatPrice)}
                                                            </div>
                                                        )}
                                                        {booking.flight && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                                                                {getFlightTypeLabel(booking.flight.flightType)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <CustomButton
                                                        className="!py-2 !px-4 text-sm w-fit"
                                                        text={
                                                            <div className="flex items-center space-x-2">
                                                                <Eye className="h-4 w-4" />
                                                                <span>Details</span>
                                                            </div>
                                                        }
                                                        onClick={() => handleViewDetails(booking.id)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* No Results */}
                    {!loading && filteredBookings.length === 0 && bookings.length > 0 && (
                        <div className="text-center py-12">
                            <Plane className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">No bookings found</h3>
                            <p className="text-gray-400">Try adjusting your search criteria</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && bookings.length === 0 && (
                        <div className="text-center py-12">
                            <Plane className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">No flight booking requests yet</h3>
                            <p className="text-gray-400">Flight booking requests will appear here once customers submit them</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FlightBooking;