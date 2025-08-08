import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Plane,
    Clock,
    Users,
    Wifi,
    UtensilsCrossed,
    Luggage,
    MapPin,
    Calendar,
    Star,
    ArrowRight,
    CheckCircle,
    XCircle,
    User,
    Phone,
    Mail,
    CreditCard,
    Shield,
    Award,
    Heart,
    ChevronDown
} from 'lucide-react';
import { url } from '../../../utils/url';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

// Add these CSS classes to your global styles or component styles
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap');
  
  .font-orbitron { font-family: 'Orbitron', monospace; }
  .font-inter { font-family: 'Inter', sans-serif; }
  
  .scroll-fade-in {
    opacity: 0;
    transform: translateY(50px);
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  .scroll-fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .scroll-slide-left {
    opacity: 0;
    transform: translateX(-50px);
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  .scroll-slide-left.visible {
    opacity: 1;
    transform: translateX(0);
  }
  
  .scroll-slide-right {
    opacity: 0;
    transform: translateX(50px);
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  .scroll-slide-right.visible {
    opacity: 1;
    transform: translateX(0);
  }
  
  .scroll-scale {
    opacity: 0;
    transform: scale(0.9);
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  .scroll-scale.visible {
    opacity: 1;
    transform: scale(1);
  }
  
  .gradient-bg {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(240, 248, 255, 0.9) 20%,
      rgba(219, 234, 254, 0.8) 40%,
      rgba(59, 130, 246, 0.6) 60%,
      rgba(30, 64, 175, 0.8) 80%,
      #000e30 100%
    );
  }
`;

const FlightDetails = () => {
    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [guestErrors, setGuestErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [activeSection, setActiveSection] = useState('overview');
    const observerRef = useRef();
    const [visibleElements, setVisibleElements] = useState(new Set());

    const { id } = useParams();

    const [formData, setFormData] = useState({
        title: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        travelDates: '',
        numberOfGuests: '',
        numberOfRooms: '',
        note: ''
    });

    const [guestForms, setGuestForms] = useState([]);
    const [showGuestForms, setShowGuestForms] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState(null);

    // Intersection Observer for scroll animations
    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleElements(prev => new Set(prev).add(entry.target.dataset.animate));
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        // Observe all animated elements
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach((el) => observerRef.current.observe(el));

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
            document.head.removeChild(styleSheet);
        };
    }, [flight]);

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const validateCNIC = (cnic) => {
        const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
        return cnicPattern.test(cnic);
    };

    const validatePhone = (phone) => {
        const phonePattern = /^3\d{9}$/; // Pakistani mobile format after +92
        return phonePattern.test(phone);
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    // Debounced function to show guest forms
    const debouncedShowGuestForms = useCallback((numberOfGuests) => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        const timer = setTimeout(() => {
            const guestCount = parseInt(numberOfGuests);
            if (guestCount > 0 && guestCount <= 30) {
                const newGuestForms = Array.from({ length: guestCount }, (_, index) => ({
                    id: index + 1,
                    firstName: '',
                    lastName: '',
                    cnic: '',
                    phone: ''
                }));
                setGuestForms(newGuestForms);
                setShowGuestForms(true);
            } else {
                setGuestForms([]);
                setShowGuestForms(false);
            }
        }, 500); // 500ms debounce delay

        setDebounceTimer(timer);
    }, [debounceTimer]);

    // Handle form input changes
    const handleFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }

        if (field === 'numberOfGuests') {
            debouncedShowGuestForms(value);
        }
    };

    // Handle guest form changes
    const handleGuestFormChange = (guestIndex, field, value) => {
        setGuestForms(prev =>
            prev.map((guest, index) =>
                index === guestIndex
                    ? { ...guest, [field]: value }
                    : guest
            )
        );

        // Clear guest error when user starts typing
        if (guestErrors[`${guestIndex}-${field}`]) {
            setGuestErrors(prev => ({
                ...prev,
                [`${guestIndex}-${field}`]: ''
            }));
        }
    };

    // Validate main form
    const validateMainForm = () => {
        const newErrors = {};

        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Invalid phone format (e.g., 3001234567)';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.travelDates) newErrors.travelDates = 'Travel date is required';

        // if (!formData.numberOfGuests || parseInt(formData.numberOfGuests) < 1) {
        //     newErrors.numberOfGuests = 'At least 1 guest is required';
        // } else

        if (parseInt(formData.numberOfGuests) > 30) {
            newErrors.numberOfGuests = 'Maximum 30 guests allowed';
        }
        // if (!formData.numberOfRooms || parseInt(formData.numberOfRooms) < 1) {
        //     newErrors.numberOfRooms = 'At least 1 room is required';
        // }

        return newErrors;
    };

    // Validate guest forms
    const validateGuestForms = () => {
        const newGuestErrors = {};

        guestForms.forEach((guest, index) => {
            if (!guest.firstName.trim()) {
                newGuestErrors[`${index}-firstName`] = 'First name is required';
            }
            if (!guest.lastName.trim()) {
                newGuestErrors[`${index}-lastName`] = 'Last name is required';
            }
            if (!guest.gender.trim()) {
                newGuestErrors[`${index}-gender`] = 'Gender is required';
            }
            if (!guest.cnic.trim()) {
                newGuestErrors[`${index}-cnic`] = 'CNIC is required';
            } else if (!validateCNIC(guest.cnic)) {
                newGuestErrors[`${index}-cnic`] = 'Invalid CNIC format (e.g., 42201-1102342-0)';
            }
            if (!guest.phone.trim()) {
                newGuestErrors[`${index}-phone`] = 'Phone number is required';
            } else if (!validatePhone(guest.phone)) {
                newGuestErrors[`${index}-phone`] = 'Invalid phone format (e.g., 3001234567)';
            }
        });

        return newGuestErrors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate forms
        const mainFormErrors = validateMainForm();
        const guestFormErrors = validateGuestForms();

        setErrors(mainFormErrors);
        setGuestErrors(guestFormErrors);

        if (Object.keys(mainFormErrors).length > 0) {
            toast.error('Please fix the errors in the main form');
            return;
        }

        if (Object.keys(guestFormErrors).length > 0) {
            toast.error('Please fix the errors in guest information');
            return;
        }

        setSubmitting(true);

        try {
            const bookingData = {
                title: formData.title,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                departureDate: formData.travelDates,
                numberOfGuests: parseInt(formData?.numberOfGuests || 0),
                numberOfRooms: parseInt(formData?.numberOfRooms || 1),
                note: formData.note || '',
                flightId: flight.id,
                travelPersons: guestForms.map(guest => ({
                    firstName: guest.firstName,
                    lastName: guest.lastName,
                    phoneNumber: guest.phone,
                    cnic: guest.cnic,
                    gender:guest.gender
                }))
            };

            const response = await fetch(`${url}/FlightBooking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });

            if (response.ok) {
                toast.success('Booking request submitted successfully!', 'success');
                // Reset form
                setFormData({
                    title: '',
                    firstName: '',
                    lastName: '',
                    phone: '',
                    email: '',
                    travelDates: '',
                    numberOfGuests: '',
                    numberOfRooms: '',
                    note: ''
                });
                setGuestForms([]);
                setShowGuestForms(false);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to submit booking request');
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
            console.error('Booking error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    // Extract flight ID from URL
    const getFlightIdFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const idFromParams = urlParams.get('id');

        if (idFromParams) return idFromParams;

        // Try to extract from path if it's in the format /flight/5
        const pathParts = window.location.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];

        if (lastPart && !isNaN(lastPart)) return lastPart;
        // Default fallback

        if (id) return id;

        return '5';
    };

    useEffect(() => {
        const fetchFlightDetails = async () => {
            try {
                setLoading(true);
                const flightId = getFlightIdFromUrl();

                // Using the production URL from your previous API
                const response = await fetch(`${url}/Flight/GetFlight/${flightId}/`);
                const result = await response.json();

                if (result.success && result.data) {
                    setFlight(result.data);
                } else {
                    setError('Flight not found');
                }
            } catch (err) {
                setError('Error fetching flight details');
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFlightDetails();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getDuration = (departure, arrival) => {
        const dep = new Date(departure);
        const arr = new Date(arrival);
        const diffMs = arr - dep;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${diffHours}h ${diffMins}m`;
    };

    const getBannerImage = (images) => {
        const bannerImg = images.find(img => img.isBannerImage);
        console.log("Banner Image: ", bannerImg)
        return bannerImg;
    };

    const getNonBannerImages = (images) => {
        return images.filter(img => !img.isBannerImage);
    };

    if (loading) {
        return (
            <div style={{ background: '#000e30' }} className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-amber-400 rounded-full border-t-transparent animate-spin"></div>
                        <Plane className="absolute inset-0 w-10 h-10 text-amber-400 m-auto animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-inter font-light text-white mb-3">Loading</h2>
                    <p className="text-gray-400 text-lg font-inter font-light">Preparing your luxury journey...</p>
                </div>
            </div>
        );
    }

    if (error || !flight) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#000e30' }}>
                <div className="text-center bg-white rounded-2xl shadow-2xl p-10 max-w-md border border-gray-200">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-orbitron font-light text-gray-900 mb-3">Flight Not Available</h2>
                    <p className="text-gray-600 font-inter">Please try again later</p>
                </div>
            </div>
        );
    }

    const bannerImage = getBannerImage(flight.images);
    const nonBannerImages = getNonBannerImages(flight.images);

    return (
        <div className="gradient-bg text-gray-900">
            {/* Hero Section */}
            <section className="relative h-screen overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-black/40"
                    style={{
                        backgroundImage: bannerImage ? `url('${bannerImage.imageUrl}')` : 'none',
                        backgroundSize: 'cover', // Ensures full coverage
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'fixed', // Optional: creates parallax effect
                        transform: `translateY(${scrollY * 0.5}px)`,
                        imageRendering: 'crisp-edges', // Prevents blurring
                        minHeight: '100%',
                        minWidth: '100%'
                    }}
                />
                <div className="absolute inset-0 " />
                <div className="relative h-full flex items-center justify-center text-center px-4">
                    <div
                        data-animate="hero"
                        className={`scroll-fade-in ${visibleElements.has('hero') ? 'visible' : ''}`}
                        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
                    >
                        <h1 className="text-6xl md:text-8xl font-orbitron font-thin mb-6 text-white">
                            {flight.fromLocation}
                            <span className="block text-amber-400 font-light">TO</span>
                            {flight.toLocation}
                        </h1>
                        <p className="text-xl md:text-2xl font-inter font-light text-gray-200 mb-8 max-w-2xl mx-auto">
                            Experience luxury aviation at its finest aboard the {flight.aircraftName}
                        </p>
                        {/* <div className="flex items-center justify-center space-x-8 text-lg font-inter">
                            <div className="flex items-center space-x-2">
                                <Clock className="w-5 h-5 text-amber-400" />
                                <span>{getDuration(flight.departureDatetime, flight.arrivalDatetime)}</span>
                            </div>
                            <div className="text-amber-400">|</div>
                            <div className="text-3xl font-light">${flight.seatPrice}</div>
                        </div> */}
                    </div>
                </div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <ChevronDown className="w-8 h-8 text-white/60" />
                </div>
            </section>

            {/* Flight Overview */}
            <section id="overview" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div
                        data-animate="overview-title"
                        className={`text-center mb-16 scroll-fade-in ${visibleElements.has('overview-title') ? 'visible' : ''}`}
                    >
                        <h2 className="text-4xl md:text-5xl font-orbitron font-thin mb-6">Flight Details</h2>
                        <div className="w-24 h-px bg-amber-400 mx-auto" />
                    </div>

                    {/* Flight Timeline */}
                    <div
                        data-animate="timeline"
                        className={`bg-white border border-gray-200 rounded-2xl p-8 mb-16 shadow-xl scroll-scale ${visibleElements.has('timeline') ? 'visible' : ''}`}
                    >
                        <div className="grid md:grid-cols-3 gap-8 items-center">
                            {/* Departure */}
                            <div
                                data-animate="departure"
                                className={`text-center scroll-slide-left ${visibleElements.has('departure') ? 'visible' : ''}`}
                            >
                                <div className="w-16 h-16 bg-amber-400/10 border border-amber-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-8 h-8 text-amber-400" />
                                </div>
                                <h3 className="text-2xl font-orbitron font-light mb-2 text-gray-900">{flight.fromLocation}</h3>
                                <p className="text-gray-600 mb-2 font-inter">{formatDate(flight.departureDatetime)}</p>
                                <p className="text-3xl font-inter font-light text-amber-600">{formatTime(flight.departureDatetime)}</p>
                                <p className="text-sm text-gray-500 mt-2 font-inter">Departure</p>
                            </div>

                            {/* Flight Path */}
                            <div className="flex items-center justify-center">
                                <div className="w-full max-w-md relative">
                                    <div className="w-full h-px bg-gray-300 relative">
                                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-400 rounded-full p-3">
                                            <Plane className="w-6 h-6 text-white transform rotate-90" />
                                        </div>
                                    </div>
                                    <div className="text-center mt-4">
                                        <span className="text-amber-600 font-inter font-light">
                                            {getDuration(flight.departureDatetime, flight.arrivalDatetime)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Arrival */}
                            <div
                                data-animate="arrival"
                                className={`text-center scroll-slide-right ${visibleElements.has('arrival') ? 'visible' : ''}`}
                            >
                                <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-orbitron font-light mb-2 text-gray-900">{flight.toLocation}</h3>
                                <p className="text-gray-600 mb-2 font-inter">{formatDate(flight.arrivalDatetime)}</p>
                                <p className="text-3xl font-inter font-light text-green-600">{formatTime(flight.arrivalDatetime)}</p>
                                <p className="text-sm text-gray-500 mt-2 font-inter">Arrival</p>
                            </div>
                        </div>
                    </div>

                    {/* Flight Stats */}
                    <div className="grid md:grid-cols-4 gap-6 mb-16">
                        {[
                            { icon: Users, label: 'Available Seats', value: flight.seatsAvailable, color: 'text-blue-600' },
                            { icon: Luggage, label: 'Luggage Limit', value: `${flight.maxLuggageWeight}kg`, color: 'text-purple-600' },
                            { icon: Star, label: 'Flight Type', value: flight.flightType === 0 ? 'Jet' : flight.flightType === 1 ? 'Plane' : 'Helicopter', color: 'text-amber-600' },
                            { icon: Shield, label: 'Premium Service', value: 'Included', color: 'text-green-600' }
                        ].map((stat, index) => (
                            <div
                                key={index}
                                data-animate={`stat-${index}`}
                                className={`text-center p-6 bg-white border border-gray-200 rounded-xl shadow-lg scroll-fade-in ${visibleElements.has(`stat-${index}`) ? 'visible' : ''}`}
                                style={{ transitionDelay: `${index * 0.1}s` }}
                            >
                                <stat.icon className={`w-8 h-8 mx-auto mb-4 ${stat.color}`} />
                                <p className="text-2xl font-inter font-light mb-2 text-gray-900">{stat.value}</p>
                                <p className="text-sm text-gray-600 font-inter">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Aircraft Section */}
            <section id="aircraft" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div
                        data-animate="aircraft-title"
                        className={`text-center mb-16 scroll-fade-in ${visibleElements.has('aircraft-title') ? 'visible' : ''}`}
                    >
                        <h2 className="text-4xl md:text-5xl font-orbitron font-thin mb-6">Your Aircraft</h2>
                        <div className="w-24 h-px bg-amber-400 mx-auto" />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                        <div
                            data-animate="aircraft-image"
                            className={`scroll-slide-left ${visibleElements.has('aircraft-image') ? 'visible' : ''}`}
                        >
                            <img
                                src={flight.aircraftImageUrl}
                                alt={flight.aircraftName}
                                className="w-full rounded-2xl shadow-2xl"
                            />
                        </div>
                        <div
                            data-animate="aircraft-info"
                            className={`scroll-slide-right ${visibleElements.has('aircraft-info') ? 'visible' : ''}`}
                        >
                            <h3 className="text-3xl font-orbitron font-light mb-6 text-gray-900">{flight.aircraftName}</h3>
                            <p className="text-xl text-gray-700 mb-8 leading-relaxed font-inter">
                                Step aboard this magnificent aircraft, engineered for ultimate comfort and performance.
                                Every detail has been meticulously crafted to provide an unparalleled flying experience.
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${flight.wifiAvailable ? 'bg-green-500' : 'bg-green-500'}`}>
                                        <Wifi className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-inter text-gray-800">High-Speed WiFi {flight.wifiAvailable ? 'Available' : 'Available'}</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${flight.mealIncluded ? 'bg-green-500' : 'bg-green-500'}`}>
                                        <UtensilsCrossed className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-inter text-gray-800">Gourmet Meals {flight.mealIncluded ? 'Included' : 'Available for Purchase'}</span>
                                </div>
                            </div>

                            <div className="flex space-x-6">
                                <div className="text-center">
                                    <Award className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600 font-inter">Premium Class</p>
                                </div>
                                <div className="text-center">
                                    <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600 font-inter">Luxury Service</p>
                                </div>
                                <div className="text-center">
                                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600 font-inter">Safety First</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            {nonBannerImages.length > 0 && (
                <section className="py-20 relative">
                    <div className="max-w-7xl mx-auto px-4">
                        <div
                            data-animate="gallery-title"
                            className={`text-center mb-16 scroll-fade-in ${visibleElements.has('gallery-title') ? 'visible' : ''}`}
                        >
                            <h2 className="text-4xl md:text-5xl font-orbitron font-thin mb-6">Gallery</h2>
                            <div className="w-24 h-px bg-amber-400 mx-auto" />
                        </div>

                        <div className="space-y-16">
                            {nonBannerImages.map((image, index) => (
                                <div
                                    key={image.imageId}
                                    data-animate={`gallery-${index}`}
                                    className={`text-center scroll-fade-in ${visibleElements.has(`gallery-${index}`) ? 'visible' : ''}`}
                                    style={{ transitionDelay: `${index * 0.2}s` }}
                                >
                                    <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-5xl mx-auto shadow-xl">
                                        <img
                                            src={image.imageUrl}
                                            alt={image.description}
                                            className="w-full rounded-xl mb-8 shadow-2xl"
                                        />
                                        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto font-inter">
                                            {image.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Booking Section */}
            <section id="booking" className="py-20 relative">
                <div className="max-w-4xl mx-auto px-4">
                    <div
                        data-animate="booking-title"
                        className={`text-center mb-16 scroll-fade-in ${visibleElements.has('booking-title') ? 'visible' : ''}`}
                    >
                        <h2 className="text-4xl md:text-5xl font-orbitron font-thin mb-6">Reserve Your Flight</h2>
                        <div className="w-24 h-px bg-amber-400 mx-auto mb-6" />
                        <p className="text-xl text-gray-700 font-inter">Experience luxury aviation with personalized service</p>
                    </div>

                    <div
                        data-animate="booking-form"
                        className={`bg-white border border-gray-200 rounded-2xl p-8 shadow-xl scroll-scale ${visibleElements.has('booking-form') ? 'visible' : ''}`}
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Personal Information */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3 font-inter">Title *</label>
                                    <select
                                        value={formData.title}
                                        onChange={(e) => handleFormChange('title', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-gray-900 font-inter ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                                        required
                                    >
                                        <option value="">Select Title</option>
                                        <option value="Mr">Mr</option>
                                        <option value="Mrs">Mrs</option>
                                        <option value="Miss">Miss</option>
                                        <option value="Dr">Dr</option>
                                        <option value="Prof">Prof</option>
                                    </select>
                                    {errors.title && <p className="mt-2 text-sm text-red-600 font-inter">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3 font-inter">First Name *</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => handleFormChange('firstName', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-gray-900 font-inter ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter first name"
                                        required
                                    />
                                    {errors.firstName && <p className="mt-2 text-sm text-red-600 font-inter">{errors.firstName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3 font-inter">Last Name *</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => handleFormChange('lastName', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-gray-900 font-inter ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter last name"
                                        required
                                    />
                                    {errors.lastName && <p className="mt-2 text-sm text-red-600 font-inter">{errors.lastName}</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3 font-inter">Phone Number *</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-4 py-3 bg-gray-200 border border-r-0 border-gray-300 text-gray-600 rounded-l-lg font-inter">
                                            +92
                                        </span>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleFormChange('phone', e.target.value)}
                                            className={`flex-1 px-4 py-3 bg-gray-50 border rounded-r-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-gray-900 font-inter ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Enter phone number"
                                            required
                                        />
                                    </div>
                                    {errors.phone && <p className="mt-2 text-sm text-red-600 font-inter">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3 font-inter">Email *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleFormChange('email', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-gray-900 font-inter ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter email address"
                                        required
                                    />
                                    {errors.email && <p className="mt-2 text-sm text-red-600 font-inter">{errors.email}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3 font-inter">Preferred Travel Date *</label>
                                <select
                                    value={formData.travelDates}
                                    onChange={(e) => handleFormChange('travelDates', e.target.value)}
                                    className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-gray-900 font-inter ${errors.travelDates ? 'border-red-500' : 'border-gray-300'}`}
                                    required
                                >
                                    <option value="">Select travel date</option>
                                    <option value={flight?.departureDatetime}>
                                        {flight && formatDate(flight.departureDatetime)} - {flight && formatTime(flight.departureDatetime)}
                                    </option>
                                </select>
                                {errors.travelDates && <p className="mt-2 text-sm text-red-600 font-inter">{errors.travelDates}</p>}
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3 font-inter">Number of Guests * (Max 30)</label>
                                    <input
                                        type="number"
                                        defaultValue={0}
                                        value={formData.numberOfGuests}
                                        onChange={(e) => handleFormChange('numberOfGuests', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-gray-900 font-inter ${errors.numberOfGuests ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter number of guests"
                                        required
                                    />
                                    {errors.numberOfGuests && <p className="mt-2 text-sm text-red-600 font-inter">{errors.numberOfGuests}</p>}
                                </div>

                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3 font-inter">Number of Rooms *</label>
                                    <select
                                        value={formData.numberOfRooms}
                                        onChange={(e) => handleFormChange('numberOfRooms', e.target.value)}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-gray-900 font-inter ${errors.numberOfRooms ? 'border-red-500' : 'border-gray-300'}`}
                                        required
                                    >
                                        <option value="">Select rooms</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                            <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                    {errors.numberOfRooms && <p className="mt-2 text-sm text-red-600 font-inter">{errors.numberOfRooms}</p>}
                                </div> */}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3 font-inter">Special Requests</label>
                                <textarea
                                    value={formData.note}
                                    onChange={(e) => handleFormChange('note', e.target.value)}
                                    rows="4"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-gray-900 font-inter"
                                    placeholder="Any special requests or dietary requirements..."
                                />
                            </div>

                            {/* Guest Information Forms */}
                            {showGuestForms && guestForms.length > 0 && (
                                <div className="border-t border-gray-300 pt-8">
                                    <h3 className="text-2xl font-orbitron font-light text-gray-900 mb-8 flex items-center">
                                        <Users className="w-6 h-6 mr-3 text-amber-600" />
                                        Travel Companions
                                    </h3>

                                    <div className="space-y-8">
                                        {guestForms.map((guest, index) => (
                                            <div
                                                key={guest.id}
                                                data-animate={`guest-${index}`}
                                                className={`bg-gray-50 border border-gray-200 rounded-xl p-6 scroll-fade-in ${visibleElements.has(`guest-${index}`) ? 'visible' : ''}`}
                                                style={{ transitionDelay: `${index * 0.1}s` }}
                                            >
                                                <h4 className="text-lg font-orbitron font-medium text-gray-900 mb-6 flex items-center">
                                                    <User className="w-5 h-5 mr-2 text-amber-600" />
                                                    Guest {guest.id}
                                                </h4>

                                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 mb-2 font-inter">First Name *</label>
                                                        <input
                                                            type="text"
                                                            value={guest.firstName}
                                                            onChange={(e) => handleGuestFormChange(index, 'firstName', e.target.value)}
                                                            className={`w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-gray-900 font-inter ${guestErrors[`${index}-firstName`] ? 'border-red-500' : 'border-gray-300'}`}
                                                            placeholder="Enter first name"
                                                            required
                                                        />
                                                        {guestErrors[`${index}-firstName`] && (
                                                            <p className="mt-1 text-sm text-red-600 font-inter">{guestErrors[`${index}-firstName`]}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 mb-2 font-inter">Last Name *</label>
                                                        <input
                                                            type="text"
                                                            value={guest.lastName}
                                                            onChange={(e) => handleGuestFormChange(index, 'lastName', e.target.value)}
                                                            className={`w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-gray-900 font-inter ${guestErrors[`${index}-lastName`] ? 'border-red-500' : 'border-gray-300'}`}
                                                            placeholder="Enter last name"
                                                            required
                                                        />
                                                        {guestErrors[`${index}-lastName`] && (
                                                            <p className="mt-1 text-sm text-red-600 font-inter">{guestErrors[`${index}-lastName`]}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 mb-2 font-inter">CNIC *</label>
                                                        <input
                                                            type="text"
                                                            value={guest.cnic}
                                                            onChange={(e) => handleGuestFormChange(index, 'cnic', e.target.value)}
                                                            className={`w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-gray-900 font-inter ${guestErrors[`${index}-cnic`] ? 'border-red-500' : 'border-gray-300'}`}
                                                            placeholder="42201-1102342-0"
                                                            pattern="[0-9]{5}-[0-9]{7}-[0-9]{1}"
                                                            title="Format: 12345-1234567-1"
                                                            required
                                                        />
                                                        {guestErrors[`${index}-cnic`] && (
                                                            <p className="mt-1 text-sm text-red-600 font-inter">{guestErrors[`${index}-cnic`]}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 mb-2 font-inter">Phone Number *</label>
                                                        <div className="flex">
                                                            <span className="inline-flex items-center px-3 py-2 bg-gray-200 border border-r-0 border-gray-300 text-gray-600 rounded-l-lg text-sm font-inter">
                                                                +92
                                                            </span>
                                                            <input
                                                                type="tel"
                                                                value={guest.phone}
                                                                onChange={(e) => handleGuestFormChange(index, 'phone', e.target.value)}
                                                                className={`flex-1 px-3 py-2 bg-white border rounded-r-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-gray-900 font-inter ${guestErrors[`${index}-phone`] ? 'border-red-500' : 'border-gray-300'}`}
                                                                placeholder="Enter phone number"
                                                                required
                                                            />
                                                        </div>
                                                        {guestErrors[`${index}-phone`] && (
                                                            <p className="mt-1 text-sm text-red-600 font-inter">{guestErrors[`${index}-phone`]}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600 mb-2 font-inter">Gender *</label>
                                                        <select
                                                            value={guest.gender}
                                                            onChange={(e) => handleGuestFormChange(index, 'gender', e.target.value)}
                                                            className={`w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-gray-900 font-inter ${guestErrors[`${index}-gender`] ? 'border-red-500' : 'border-gray-300'}`}
                                                            required
                                                        >
                                                            <option value="">Select Gender</option>
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                        </select>
                                                        {guestErrors[`${index}-gender`] && (
                                                            <p className="mt-1 text-sm text-red-600 font-inter">{guestErrors[`${index}-gender`]}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Terms and Submit */}
                            <div className="border-t border-gray-300 pt-8">
                                <div className="mb-8">
                                    <label className="flex items-start space-x-3">
                                        <input
                                            type="checkbox"
                                            required
                                            className="mt-1 w-4 h-4 text-amber-600 bg-white border-gray-400 rounded focus:ring-amber-400"
                                        />
                                        <span className="text-sm text-gray-700 font-inter">
                                            I agree to the{' '}
                                            <a href="#" className="text-amber-600 hover:text-amber-700 underline">Terms & Conditions</a>{' '}
                                            and{' '}
                                            <a href="#" className="text-amber-600 hover:text-amber-700 underline">Privacy Policy</a>
                                        </span>
                                    </label>
                                </div>

                                <div className="text-center">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className={`px-12 py-4 rounded-lg text-lg font-orbitron font-medium transition-all duration-300 transform hover:scale-105 ${submitting
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-amber-400 to-amber-600 text-white hover:from-amber-500 hover:to-amber-700 shadow-lg hover:shadow-amber-500/25'
                                            }`}
                                    >
                                        {submitting ? 'PROCESSING...' : 'RESERVE YOUR FLIGHT'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FlightDetails;