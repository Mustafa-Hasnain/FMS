import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    Plane, 
    ArrowLeft, 
    User, 
    Mail, 
    Phone, 
    CreditCard, 
    Clock,
    AlertCircle,
    CheckCircle,
    MapPin,
    Users,
    Calendar,
    DollarSign,
    Luggage,
    Utensils,
    RockingChair,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminNavigation from '../../components/common/AdminNavigation';
import { formatDateTime } from '../../utils/dateUtils';
import { url } from '../../utils/url';

const FlightBookingDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchBookingDetails();
        }
    }, [id]);

    const fetchBookingDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${url}/FlightBooking/${id}`);
            const result = await response.json();

            if (result.success) {
                setBooking(result.data);
            } else {
                setError(result.message || 'Booking not found');
                toast.error(result.message || 'Failed to fetch booking details');
            }
        } catch (err) {
            console.error('Error fetching booking details:', err);
            setError('Error fetching booking details');
            toast.error('Error fetching booking details');
        } finally {
            setLoading(false);
        }
    };

    const getFlightTypeLabel = (flightType) => {
        const types = {
            0: 'Domestic',
            1: 'International'
        };
        return types[flightType] || 'Unknown';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return `$${price.toLocaleString()}`;
    };

    const calculateTotalPrice = () => {
        if (!booking || !booking.flight) return 0;
        const totalPassengers = 1 + (booking.travelPersons?.length || 0);
        return booking.flight.seatPrice * totalPassengers;
    };

    if (loading) {
        return (
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl min-h-screen text-white">
                <AdminNavigation
                    showBackButton={true}
                    onBackClick={() => navigate('/admin/flight-booking')}
                    userInfo={{
                        name: "Admin User",
                        email: "admin@jetrique.com",
                        avatar: null
                    }}
                />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CDFF00] mx-auto"></div>
                        <p className="mt-4 text-[#CDFF00]">Loading booking details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl min-h-screen text-white">
                <AdminNavigation
                    showBackButton={true}
                    onBackClick={() => navigate('/admin/flight-booking')}
                    userInfo={{
                        name: "Admin User",
                        email: "admin@jetrique.com",
                        avatar: null
                    }}
                />
                <div className="px-6 py-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
                            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">Booking Not Found</h3>
                            <p className="text-gray-400 mb-4">
                                {error || 'The requested booking details could not be found.'}
                            </p>
                            <button
                                onClick={() => navigate('/admin/flight-booking')}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-[#CDFF00] text-black rounded-md hover:bg-[#CDFF00]/90 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Back to Bookings</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                <div className="max-w-6xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    Flight Booking #{booking.id}
                                </h1>
                                <div className="flex items-center space-x-4">
                                    {booking.flight && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400">
                                            {getFlightTypeLabel(booking.flight.flightType)}
                                        </span>
                                    )}
                                    <div className="flex items-center space-x-2 text-gray-400">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-sm">
                                            Booked on {booking.departureDate && formatDate(booking.departureDate)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Customer Information */}
                        <div className="xl:col-span-1">
                            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 h-fit mb-6">
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                                    <User className="h-5 w-5 text-[#CDFF00]" />
                                    <span>Primary Passenger</span>
                                </h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-400">Full Name</label>
                                        <div className="flex items-center space-x-3 mt-1">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <span className="text-white font-medium">
                                                {booking.title} {booking.firstName} {booking.lastName}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm text-gray-400">Phone Number</label>
                                        <div className="flex items-center space-x-3 mt-1">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <span className="text-white">{booking.phone}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Summary */}
                                <div className="mt-6 pt-6 border-t border-gray-700">
                                    <h3 className="text-lg font-medium text-white mb-4">Booking Summary</h3>
                                    <div className="grid grid-cols-1 gap-4 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Total Guests</span>
                                            <div className="text-white font-medium">{booking.numberOfGuests}</div>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Rooms</span>
                                            <div className="text-white font-medium">{booking.numberOfRooms}</div>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Status</span>
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle className="h-4 w-4 text-green-400" />
                                                <span className="text-green-400 font-medium">Confirmed</span>
                                            </div>
                                        </div>
                                        {booking.flight && (
                                            <div className="flex justify-between pt-2 border-t border-gray-700">
                                                <span className="text-gray-400">Total Price</span>
                                                <div className="text-[#CDFF00] font-bold text-lg">
                                                    {formatPrice(calculateTotalPrice())}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Travel Companions */}
                            {booking.travelPersons && booking.travelPersons.length > 0 && (
                                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                        <Users className="h-5 w-5 text-[#CDFF00]" />
                                        <span>Travel Companions ({booking.travelPersons.length})</span>
                                    </h3>
                                    <div className="space-y-4">
                                        {booking.travelPersons.map((person, index) => (
                                            <div key={person.id} className="bg-gray-700/30 rounded-md p-4">
                                                <div className="font-medium text-white mb-2">
                                                    {person.firstName} {person.lastName}
                                                </div>
                                                <div className="space-y-1 text-sm">
                                                    <div className="flex items-center space-x-2 text-gray-400">
                                                        <Phone className="h-3 w-3" />
                                                        <span>{person.phoneNumber}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-gray-400">
                                                        <CreditCard className="h-3 w-3" />
                                                        <span className="font-mono">{person.cnic}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Flight Information */}
                        <div className="xl:col-span-2">
                            {booking.flight ? (
                                <div className="space-y-6">
                                    {/* Flight Details */}
                                    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                                            <Plane className="h-5 w-5 text-[#CDFF00]" />
                                            <span>Flight Information</span>
                                        </h2>

                                        {/* Route */}
                                        <div className="bg-gray-700/30 rounded-lg p-6 mb-6">
                                            <div className="flex items-center justify-between">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-white">{booking.flight.fromLocation}</div>
                                                    <div className="text-sm text-gray-400">Departure</div>
                                                    <div className="text-lg text-[#CDFF00] font-medium mt-2">
                                                        {formatDate(booking.flight.departureDatetime)}
                                                    </div>
                                                </div>
                                                <div className="flex-1 flex items-center justify-center">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="h-0.5 w-12 bg-gray-600"></div>
                                                        <Plane className="h-5 w-5 text-[#CDFF00] transform rotate-90" />
                                                        <div className="h-0.5 w-12 bg-gray-600"></div>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-white">{booking.flight.toLocation}</div>
                                                    <div className="text-sm text-gray-400">Arrival</div>
                                                    <div className="text-lg text-[#CDFF00] font-medium mt-2">
                                                        {formatDate(booking.flight.arrivalDatetime)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Flight Details Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            <div className="text-center">
                                                <DollarSign className="h-8 w-8 text-[#CDFF00] mx-auto mb-2" />
                                                <div className="text-sm text-gray-400">Seat Price</div>
                                                <div className="text-lg font-semibold text-white">
                                                    {formatPrice(booking.flight.seatPrice)}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <Users className="h-8 w-8 text-[#CDFF00] mx-auto mb-2" />
                                                <div className="text-sm text-gray-400">Available Seats</div>
                                                <div className="text-lg font-semibold text-white">
                                                    {booking.flight.seatsAvailable}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <Luggage className="h-8 w-8 text-[#CDFF00] mx-auto mb-2" />
                                                <div className="text-sm text-gray-400">Luggage Limit</div>
                                                <div className="text-lg font-semibold text-white">
                                                    {booking.flight.luggageLimitKg} kg
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <Plane className="h-8 w-8 text-[#CDFF00] mx-auto mb-2" />
                                                <div className="text-sm text-gray-400">Flight ID</div>
                                                <div className="text-lg font-semibold text-white">
                                                    #{booking.flight.id}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Services */}
                                        <div className="mt-6 pt-6 border-t border-gray-700">
                                            <h4 className="text-lg font-medium text-white mb-4">Included Services</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center space-x-3">
                                                    <Utensils className={`h-5 w-5 ${booking.flight.mealIncluded ? 'text-green-400' : 'text-gray-500'}`} />
                                                    <span className={`${booking.flight.mealIncluded ? 'text-white' : 'text-gray-500'}`}>
                                                        Meal {booking.flight.mealIncluded ? 'Included' : 'Not Included'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <RockingChair className={`h-5 w-5 ${booking.flight.seatSelectionIncluded ? 'text-green-400' : 'text-gray-500'}`} />
                                                    <span className={`${booking.flight.seatSelectionIncluded ? 'text-white' : 'text-gray-500'}`}>
                                                        Seat Selection {booking.flight.seatSelectionIncluded ? 'Included' : 'Not Included'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Notes */}
                                    {booking.note && (
                                        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                                            <h3 className="text-lg font-semibold text-white mb-4">Additional Notes</h3>
                                            <div className="bg-gray-700/30 rounded-md p-4">
                                                <p className="text-gray-300">{booking.note}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 text-center">
                                    <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-white mb-2">No Flight Information</h3>
                                    <p className="text-gray-400">Flight details are not available for this booking.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightBookingDetails;