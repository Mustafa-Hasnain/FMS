import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Save,
    Plus,
    Trash2,
    User,
    Mail,
    Phone,
    CreditCard,
    MapPin,
    Calendar,
    Users,
    Package,
    Heart,
    Plane,
    Briefcase
} from 'lucide-react';
import CustomButton from '../../components/custom/CustomButton';
import toast from 'react-hot-toast';
import AdminNavigation from '../../components/common/AdminNavigation';
import CustomInput from '../../components/custom/CustomInput';
import { url } from '../../utils/url';
import SuccessModal from '../../components/Modals/SuccessModal';

const PrivateCharterForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState({
        trip: 0,
        name: '',
        email: '',
        phone: '',
        cnic: '',
        segments: [
            {
                fromLocation: '',
                toLocation: '',
                departDate: '',
                seats: '',
                pets: '',
                luggage: ''
            }
        ]
    });

    const [errors, setErrors] = useState({});

    const tripTypes = [
        { value: 0, label: 'One Way' },
        { value: 1, label: 'Round Trip' },
        { value: 2, label: 'Multi Leg' }
        // { value: 3, label: 'Multi Stop' }
    ];

    // Effect to populate segments from query parameters
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const segments = [];
        let segmentIndex = 0;

        // Keep looking for segments until we don't find one
        while (true) {
            const fromLocation = searchParams.get(`segment${segmentIndex}_fromLocation`) || searchParams.get(`fromLocation${segmentIndex}`);
            const toLocation = searchParams.get(`segment${segmentIndex}_toLocation`) || searchParams.get(`toLocation${segmentIndex}`);
            const departDate = searchParams.get(`segment${segmentIndex}_departDate`) || searchParams.get(`departDate${segmentIndex}`);
            const seats = searchParams.get(`segment${segmentIndex}_seats`) || searchParams.get(`seats${segmentIndex}`);
            const pets = searchParams.get(`segment${segmentIndex}_pets`) || searchParams.get(`pets${segmentIndex}`);
            const luggage = searchParams.get(`segment${segmentIndex}_luggage`) || searchParams.get(`luggage${segmentIndex}`);

            // If we found at least fromLocation or toLocation, create a segment
            if (fromLocation || toLocation || departDate || seats || pets || luggage) {
                segments.push({
                    fromLocation: fromLocation || '',
                    toLocation: toLocation || '',
                    departDate: departDate || '',
                    seats: seats || '',
                    pets: pets || '',
                    luggage: luggage || ''
                });
                segmentIndex++;
            } else {
                break;
            }
        }

        // If no indexed segments found, try to get first segment without index
        if (segments.length === 0) {
            const fromLocation = searchParams.get('from');
            const toLocation = searchParams.get('to');
            const date = searchParams.get('date');
            const time = searchParams.get('time');

            // Combine date and time into datetime-local format
            let departDate = '';
            if (date && time) {
                const decodedTime = decodeURIComponent(time); // Decode URL-encoded time (09%3A20 -> 09:20)
                departDate = `${date}T${decodedTime}`;
            } else if (date) {
                departDate = `${date}T00:00`;
            }

            // Calculate total seats (adults + children + infants)
            const adults = parseInt(searchParams.get('adults')) || 0;
            const children = parseInt(searchParams.get('children')) || 0;
            const infants = parseInt(searchParams.get('infants')) || 0;
            const totalSeats = adults + children + infants;

            // Calculate total luggage (carryon + hold + skis + golf + others)
            const carryon = parseInt(searchParams.get('carryon')) || 0;
            const hold = parseInt(searchParams.get('hold')) || 0;
            const skis = parseInt(searchParams.get('skis')) || 0;
            const golf = parseInt(searchParams.get('golf')) || 0;
            const others = parseInt(searchParams.get('others')) || 0;
            const totalLuggage = carryon + hold + skis + golf + others;

            // Calculate total pets (dogs + cats + otherpets)
            const dogs = parseInt(searchParams.get('dogs')) || 0;
            const cats = parseInt(searchParams.get('cats')) || 0;
            const otherpets = parseInt(searchParams.get('otherpets')) || 0;
            const totalPets = dogs + cats + otherpets;

            if (fromLocation || toLocation || departDate || totalSeats || totalPets || totalLuggage) {
                segments.push({
                    fromLocation: fromLocation || '',
                    toLocation: toLocation || '',
                    departDate: departDate || '',
                    seats: totalSeats > 0 ? totalSeats.toString() : '',
                    pets: totalPets.toString(),
                    luggage: totalLuggage > 0 ? totalLuggage.toString() : ''
                });
            }
        }

        // Update form data if we found segments or other data
        if (segments.length > 0) {
            const tripType = searchParams.get('type');
            let tripValue = '';
            if (tripType === 'oneway') tripValue = '0';
            else if (tripType === 'roundtrip') tripValue = '1';
            else if (tripType === 'multileg') tripValue = '2';

            setFormData(prev => ({
                ...prev,
                trip: tripValue || searchParams.get('trip') || prev.trip,
                name: searchParams.get('name') || prev.name,
                email: searchParams.get('email') || prev.email,
                phone: searchParams.get('phone') || prev.phone,
                cnic: searchParams.get('cnic') || prev.cnic,
                segments: segments
            }));
        } else {
            // Just update other fields if no segments found
            const tripType = searchParams.get('type');
            let tripValue = '';
            if (tripType === 'oneway') tripValue = '0';
            else if (tripType === 'roundtrip') tripValue = '1';
            else if (tripType === 'multileg') tripValue = '2';

            const trip = tripValue || searchParams.get('trip');
            const name = searchParams.get('name');
            const email = searchParams.get('email');
            const phone = searchParams.get('phone');
            const cnic = searchParams.get('cnic');

            if (trip || name || email || phone || cnic) {
                setFormData(prev => ({
                    ...prev,
                    trip: trip || prev.trip,
                    name: name || prev.name,
                    email: email || prev.email,
                    phone: phone || prev.phone,
                    cnic: cnic || prev.cnic
                }));
            }
        }
    }, [location.search]);

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^03\d{9}$/;
        return phoneRegex.test(phone);
    };

    const validateCNIC = (cnic) => {
        const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
        return cnicRegex.test(cnic);
    };

    const validateSegments = () => {
        const tripType = parseInt(formData.trip);
        const segmentCount = formData.segments.length;

        if (tripType === 0 && segmentCount !== 1) {
            return 'One Way trip must have exactly 1 segment';
        }
        if (tripType === 1 && segmentCount !== 2) {
            return 'Round Trip must have exactly 2 segments';
        }
        if ((tripType === 2 || tripType === 3) && segmentCount < 2) {
            return 'Multi City/Multi Stop trips must have at least 2 segments';
        }
        return null;
    };

    const validateForm = () => {
        const newErrors = {};

        // Basic info validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Phone must be in format: 03xxxxxxxxx';
        }

        if (!formData.cnic.trim()) {
            newErrors.cnic = 'CNIC is required';
        } else if (!validateCNIC(formData.cnic)) {
            newErrors.cnic = 'CNIC must be in format: xxxxx-xxxxxxx-x';
        }

        if (!formData.trip && formData.trip !== 0) {
            newErrors.trip = 'Trip type is required';
        }

        // Segments validation
        const segmentError = validateSegments();
        if (segmentError) {
            newErrors.segments = segmentError;
        }

        formData.segments.forEach((segment, index) => {
            if (!segment.fromLocation.trim()) {
                newErrors[`segment_${index}_fromLocation`] = 'From location is required';
            }
            if (!segment.toLocation.trim()) {
                newErrors[`segment_${index}_toLocation`] = 'To location is required';
            }
            if (!segment.departDate) {
                newErrors[`segment_${index}_departDate`] = 'Departure date is required';
            }
            if (!segment.seats || segment.seats < 1) {
                newErrors[`segment_${index}_seats`] = 'At least 1 seat is required';
            }
            if (segment.pets < 0) {
                newErrors[`segment_${index}_pets`] = 'Pets cannot be negative';
            }
            if (!segment.luggage || segment.luggage < 0) {
                newErrors[`segment_${index}_luggage`] = 'Luggage weight must be 0 or positive';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleSegmentChange = (index, field, value) => {
        const newSegments = [...formData.segments];
        newSegments[index] = {
            ...newSegments[index],
            [field]: value
        };

        setFormData(prev => ({
            ...prev,
            segments: newSegments
        }));

        // Clear segment-specific errors
        const errorKey = `segment_${index}_${field}`;
        if (errors[errorKey]) {
            setErrors(prev => ({
                ...prev,
                [errorKey]: undefined
            }));
        }
    };

    const addSegment = () => {
        const tripType = parseInt(formData.trip);
        const currentCount = formData.segments.length;

        // Check limits based on trip type
        if (tripType === 0 && currentCount >= 1) {
            toast.error('One Way trip can only have 1 segment');
            return;
        }
        if (tripType === 1 && currentCount >= 2) {
            toast.error('Round Trip can only have 2 segments');
            return;
        }

        setFormData(prev => ({
            ...prev,
            segments: [
                ...prev.segments,
                {
                    fromLocation: '',
                    toLocation: '',
                    departDate: '',
                    seats: '',
                    pets: '',
                    luggage: ''
                }
            ]
        }));
    };

    const removeSegment = (index) => {
        if (formData.segments.length <= 1) {
            toast.error('At least one segment is required');
            return;
        }

        setFormData(prev => ({
            ...prev,
            segments: prev.segments.filter((_, i) => i !== index)
        }));
    };

    const handleTripTypeChange = (value) => {
        const tripType = parseInt(value);
        let newSegments = [...formData.segments];

        // Adjust segments based on trip type
        if (tripType === 0) { // One Way
            newSegments = newSegments.slice(0, 1);
        } else if (tripType === 1) { // Round Trip
            if (newSegments.length > 2) {
                newSegments = newSegments.slice(0, 2);
            } else if (newSegments.length < 2) {
                newSegments.push({
                    fromLocation: '',
                    toLocation: '',
                    departDate: '',
                    seats: '',
                    pets: '',
                    luggage: ''
                });
            }
        }

        setFormData(prev => ({
            ...prev,
            trip: value,
            segments: newSegments
        }));

        // Clear trip-related errors
        if (errors.trip || errors.segments) {
            setErrors(prev => ({
                ...prev,
                trip: undefined,
                segments: undefined
            }));
        }
    };

    const ResetForm = () => {
        setFormData({
            trip: 0,
            name: '',
            email: '',
            phone: '',
            cnic: '',
            segments: [
                {
                    fromLocation: '',
                    toLocation: '',
                    departDate: '',
                    seats: '',
                    pets: '',
                    luggage: ''
                }
            ]
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the validation errors');
            return;
        }

        setLoading(true);

        try {
            const submitData = {
                ...formData,
                trip: parseInt(formData.trip),
                segments: formData.segments.map(segment => ({
                    ...segment,
                    seats: parseInt(segment.seats),
                    pets: parseInt(segment.pets) || 0,
                    luggage: parseInt(segment.luggage),
                    departDate: new Date(segment.departDate).toISOString()
                }))
            };

            const response = await fetch(`${url}/PrivateCharter/Create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData)
            });

            const result = await response.json();

            if (result.success) {
                setShowSuccessModal(true);
                ResetForm();

            } else {
                toast.error(result.message || 'Failed to create charter request');
            }
        } catch (error) {
            console.error('Error creating charter:', error);
            toast.error('Error creating charter request');
        } finally {
            setLoading(false);
        }
    };

    // return (
    //     <div className="bg-black/80 backdrop-blur-sm rounded-2xl min-h-screen text-white">
    //         {/* Header Navigation */}
    //         {/* <AdminNavigation
    //             showBackButton={true}
    //             onBackClick={() => navigate('/admin/private-charter')}
    //             userInfo={{
    //                 name: "Admin User",
    //                 email: "admin@jetrique.com",
    //                 avatar: null
    //             }}
    //         /> */}

    //         {/* Main Content */}
    //         <div className="px-6 py-8">
    //             <div className="max-w-4xl mx-auto">
    //                 {/* Page Header */}
    //                 <div className="mb-8">
    //                     <h1 className="text-2xl font-semibold text-white mb-2">Create Private Charter Request</h1>
    //                     <p className="text-gray-400">Fill in the details for a new private charter booking</p>
    //                 </div>

    //                 <form onSubmit={handleSubmit} className="space-y-8">
    //                     {/* Customer Information Section */}
    //                     <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
    //                         <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
    //                             <User className="h-5 w-5 text-[#CDFF00]" />
    //                             <span>Customer Information</span>
    //                         </h2>

    //                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //                             <CustomInput
    //                                 label="Full Name"
    //                                 name="name"
    //                                 placeholder="Enter customer name"
    //                                 value={formData.name}
    //                                 onChange={(e) => handleInputChange('name', e.target.value)}
    //                                 icon={User}
    //                                 required
    //                                 error={errors.name}
    //                             />

    //                             <CustomInput
    //                                 label="Email Address"
    //                                 name="email"
    //                                 type="email"
    //                                 placeholder="customer@example.com"
    //                                 value={formData.email}
    //                                 onChange={(e) => handleInputChange('email', e.target.value)}
    //                                 icon={Mail}
    //                                 required
    //                                 error={errors.email}
    //                             />

    //                             <CustomInput
    //                                 label="Phone Number"
    //                                 name="phone"
    //                                 placeholder="03xxxxxxxxx"
    //                                 value={formData.phone}
    //                                 onChange={(e) => handleInputChange('phone', e.target.value)}
    //                                 icon={Phone}
    //                                 required
    //                                 error={errors.phone}
    //                             />

    //                             <CustomInput
    //                                 label="CNIC"
    //                                 name="cnic"
    //                                 placeholder="xxxxx-xxxxxxx-x"
    //                                 value={formData.cnic}
    //                                 onChange={(e) => handleInputChange('cnic', e.target.value)}
    //                                 icon={CreditCard}
    //                                 required
    //                                 error={errors.cnic}
    //                             />
    //                         </div>

    //                         {/* Trip Type */}
    //                         <div className="mt-6">
    //                             <label className="block text-sm text-gray-300 mb-2 font-inter">
    //                                 Trip Type *
    //                             </label>
    //                             <select
    //                                 name="trip"
    //                                 value={formData.trip}
    //                                 onChange={(e) => handleTripTypeChange(e.target.value)}
    //                                 className={`w-full py-[14px] px-4 bg-gray-800 border ${errors.trip ? 'border-red-500' : 'border-gray-700'} rounded-md text-white focus:ring-2 focus:ring-[#CDFF00] focus:border-[#CDFF00]`}
    //                                 required
    //                             >
    //                                 <option value="">Select trip type</option>
    //                                 {tripTypes.map(type => (
    //                                     <option key={type.value} value={type.value}>
    //                                         {type.label}
    //                                     </option>
    //                                 ))}
    //                             </select>
    //                             {errors.trip && (
    //                                 <p className="mt-2 text-sm text-red-400 font-inter">{errors.trip}</p>
    //                             )}
    //                         </div>
    //                     </div>

    //                     {/* Flight Segments Section */}
    //                     <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
    //                         <div className="flex items-center justify-between mb-6">
    //                             <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
    //                                 <Plane className="h-5 w-5 text-[#CDFF00]" />
    //                                 <span>Flight Segments</span>
    //                             </h2>
    //                         </div>

    //                         {errors.segments && (
    //                             <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
    //                                 <p className="text-red-400 text-sm">{errors.segments}</p>
    //                             </div>
    //                         )}

    //                         <div className="space-y-6">
    //                             {formData.segments.map((segment, index) => (
    //                                 <div key={index} className="bg-gray-700/30 rounded-lg p-6 border border-gray-600">
    //                                     <div className="flex items-center justify-between mb-4">
    //                                         <h3 className="text-lg font-medium text-white">
    //                                             Segment {index + 1}
    //                                         </h3>
    //                                         {formData.segments.length > 1 && (
    //                                             <button
    //                                                 type="button"
    //                                                 onClick={() => removeSegment(index)}
    //                                                 className="text-red-400 hover:text-red-300 transition-colors"
    //                                             >
    //                                                 <Trash2 className="h-4 w-4" />
    //                                             </button>
    //                                         )}
    //                                     </div>

    //                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    //                                         <CustomInput
    //                                             label="From Location"
    //                                             name={`fromLocation_${index}`}
    //                                             placeholder="e.g., Karachi"
    //                                             value={segment.fromLocation}
    //                                             onChange={(e) => handleSegmentChange(index, 'fromLocation', e.target.value)}
    //                                             icon={MapPin}
    //                                             required
    //                                             error={errors[`segment_${index}_fromLocation`]}
    //                                         />

    //                                         <CustomInput
    //                                             label="To Location"
    //                                             name={`toLocation_${index}`}
    //                                             placeholder="e.g., Dubai"
    //                                             value={segment.toLocation}
    //                                             onChange={(e) => handleSegmentChange(index, 'toLocation', e.target.value)}
    //                                             icon={MapPin}
    //                                             required
    //                                             error={errors[`segment_${index}_toLocation`]}
    //                                         />

    //                                         <CustomInput
    //                                             label="Departure Date & Time"
    //                                             name={`departDate_${index}`}
    //                                             type="datetime-local"
    //                                             value={segment.departDate}
    //                                             onChange={(e) => handleSegmentChange(index, 'departDate', e.target.value)}
    //                                             icon={Calendar}
    //                                             required
    //                                             error={errors[`segment_${index}_departDate`]}
    //                                         />

    //                                         <CustomInput
    //                                             label="Number of Seats"
    //                                             name={`seats_${index}`}
    //                                             type="number"
    //                                             min="1"
    //                                             placeholder="4"
    //                                             value={segment.seats}
    //                                             onChange={(e) => handleSegmentChange(index, 'seats', e.target.value)}
    //                                             icon={Users}
    //                                             required
    //                                             error={errors[`segment_${index}_seats`]}
    //                                         />

    //                                         <CustomInput
    //                                             label="Number of Pets"
    //                                             name={`pets_${index}`}
    //                                             type="number"
    //                                             min="0"
    //                                             placeholder="0"
    //                                             value={segment.pets}
    //                                             onChange={(e) => handleSegmentChange(index, 'pets', e.target.value)}
    //                                             icon={Heart}
    //                                             error={errors[`segment_${index}_pets`]}
    //                                         />

    //                                         <CustomInput
    //                                             label="Luggage Weight (kg)"
    //                                             name={`luggage_${index}`}
    //                                             type="number"
    //                                             min="0"
    //                                             placeholder="20"
    //                                             value={segment.luggage}
    //                                             onChange={(e) => handleSegmentChange(index, 'luggage', e.target.value)}
    //                                             icon={Package}
    //                                             required
    //                                             error={errors[`segment_${index}_luggage`]}
    //                                         />
    //                                     </div>
    //                                 </div>
    //                             ))}
    //                         </div>
    //                         <div className='mt-5'>
    //                             {(formData.trip === '' || parseInt(formData.trip) > 1 || (parseInt(formData.trip) === 1 && formData.segments.length < 2)) && (
    //                                 <CustomButton
    //                                     type="button"
    //                                     text={
    //                                         <div className="flex items-center space-x-2 mt">
    //                                             <Plus className="h-4 w-4" />
    //                                             <span>Add Segment</span>
    //                                         </div>
    //                                     }
    //                                     onClick={addSegment}
    //                                     className="!py-2 !px-4 text-sm"
    //                                 />
    //                             )}
    //                         </div>
    //                     </div>

    //                     {/* Form Actions */}
    //                     <div className="flex justify-end space-x-4">
    //                         <button
    //                             type="button"
    //                             onClick={() =>window.history.back()}
    //                             className="px-6 py-3 border border-gray-600 text-gray-400 rounded-md hover:bg-gray-800 transition-colors"
    //                         >
    //                             Cancel
    //                         </button>
    //                         <CustomButton
    //                             type="submit"
    //                             text={
    //                                 <div className="flex items-center space-x-2">
    //                                     <Save className="h-4 w-4" />
    //                                     <span>Create Charter Request</span>
    //                                 </div>
    //                             }
    //                             loading={loading}
    //                             onClickText="Creating..."
    //                             className="bg-[#CDFF00] text-black hover:bg-[#B8E600] disabled:bg-gray-600 disabled:text-gray-400"
    //                         />
    //                     </div>
    //                 </form>

    //                 <SuccessModal
    //                     isOpen={showSuccessModal}
    //                     onClose={() => setShowSuccessModal(false)}
    //                     title="Request Submitted!"
    //                     message="Your private charter request has been submitted successfully. Our team will contact you shortly."
    //                     // redirectMessage="Redirecting to charter list"
    //                     redirectSeconds={4}
    //                     onRedirect={() => window.history.back()}
    //                 />
    //             </div>
    //         </div>
    //     </div>
    // );

    return (
        <div className="bg-transparent min-h-screen p-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
                {/* Header with Trip Type Buttons */}
                <div className="bg-gray-100 p-4 rounded-t-lg border-b">
                    <div className="flex space-x-2 mb-4">
                        <button
                            type="button"
                            onClick={() => handleTripTypeChange('0')}
                            className={`px-4 py-2 text-sm font-medium rounded ${formData.trip === '0' || formData.trip === 0
                                ? 'bg-green-700 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            ONE-WAY
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTripTypeChange('1')}
                            className={`px-4 py-2 text-sm font-medium rounded ${formData.trip === '1' || formData.trip === 1
                                ? 'bg-green-700 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            ROUND-TRIP
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTripTypeChange('2')}
                            className={`px-4 py-2 text-sm font-medium rounded ${formData.trip === '2' || formData.trip === 2
                                ? 'bg-green-700 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            MULTI-LEG
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Flight Segments */}
                    <div className="space-y-4 mb-6">
                        {formData.segments.map((segment, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-sm font-medium text-gray-700">
                                        Flight {index + 1}
                                    </h3>
                                    {formData.segments.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeSegment(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                {/* First row: From, To, Date, Time */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                                    {/* From */}
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="From"
                                            value={segment.fromLocation}
                                            onChange={(e) => handleSegmentChange(index, 'fromLocation', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md text-sm ${errors[`segment_${index}_fromLocation`]
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                                } focus:ring-1 focus:ring-green-500 focus:border-green-500`}
                                        />
                                        {errors[`segment_${index}_fromLocation`] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[`segment_${index}_fromLocation`]}</p>
                                        )}
                                    </div>

                                    {/* To */}
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="To"
                                            value={segment.toLocation}
                                            onChange={(e) => handleSegmentChange(index, 'toLocation', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md text-sm ${errors[`segment_${index}_toLocation`]
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                                } focus:ring-1 focus:ring-green-500 focus:border-green-500`}
                                        />
                                        {errors[`segment_${index}_toLocation`] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[`segment_${index}_toLocation`]}</p>
                                        )}
                                    </div>

                                    {/* Date */}
                                    <div>
                                        <input
                                            type="date"
                                            value={segment.departDate.split('T')[0]}
                                            onChange={(e) => handleSegmentChange(index, 'departDate', e.target.value + 'T00:00')}
                                            className={`w-full px-3 py-2 border rounded-md text-sm ${errors[`segment_${index}_departDate`]
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                                } focus:ring-1 focus:ring-green-500 focus:border-green-500`}
                                        />
                                        {errors[`segment_${index}_departDate`] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[`segment_${index}_departDate`]}</p>
                                        )}
                                    </div>

                                    {/* Time */}
                                    <div>
                                        <input
                                            type="time"
                                            onChange={(e) => {
                                                const date = segment.departDate.split('T')[0] || new Date().toISOString().split('T')[0];
                                                handleSegmentChange(index, 'departDate', `${date}T${e.target.value}`);
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>
                                </div>

                                {/* Second row: Passengers, Luggage, Pets */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm text-gray-600">Passengers:</span>
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="1"
                                            value={segment.seats}
                                            onChange={(e) => handleSegmentChange(index, 'seats', e.target.value)}
                                            className={`w-20 px-3 py-2 border rounded-md text-sm ${errors[`segment_${index}_seats`]
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                                } focus:ring-1 focus:ring-green-500 focus:border-green-500`}
                                        />
                                        {errors[`segment_${index}_seats`] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[`segment_${index}_seats`]}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Briefcase className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm text-gray-600">Luggage:</span>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={segment.luggage}
                                            onChange={(e) => handleSegmentChange(index, 'luggage', e.target.value)}
                                            className={`w-20 px-3 py-2 border rounded-md text-sm ${errors[`segment_${index}_luggage`]
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                                } focus:ring-1 focus:ring-green-500 focus:border-green-500`}
                                        />
                                        {errors[`segment_${index}_luggage`] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[`segment_${index}_luggage`]}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Heart className="h-4 w-4 text-red-500" />
                                        <span className="text-sm text-gray-600">Pets:</span>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={segment.pets}
                                            onChange={(e) => handleSegmentChange(index, 'pets', e.target.value)}
                                            className={`w-20 px-3 py-2 border rounded-md text-sm ${errors[`segment_${index}_pets`]
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                                } focus:ring-1 focus:ring-green-500 focus:border-green-500`}
                                        />
                                        {errors[`segment_${index}_pets`] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[`segment_${index}_pets`]}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add Segment Button */}
                        {(formData.trip === '' || parseInt(formData.trip) > 1 || (parseInt(formData.trip) === 1 && formData.segments.length < 2)) && (
                            <button
                                type="button"
                                onClick={addSegment}
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-green-600 border border-green-600 rounded-md hover:bg-green-50"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add Flight</span>
                            </button>
                        )}
                    </div>

                    {/* Customer Information */}
                    <div className="bg-gray-50 p-4 rounded-lg border mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Customer Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-1 focus:ring-green-500 focus:border-green-500`}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-1 focus:ring-green-500 focus:border-green-500`}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder="Phone Number (03xxxxxxxxx)"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md text-sm ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-1 focus:ring-green-500 focus:border-green-500`}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder="CNIC (xxxxx-xxxxxxx-x)"
                                    value={formData.cnic}
                                    onChange={(e) => handleInputChange('cnic', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md text-sm ${errors.cnic ? 'border-red-500' : 'border-gray-300'
                                        } focus:ring-1 focus:ring-green-500 focus:border-green-500`}
                                />
                                {errors.cnic && (
                                    <p className="text-red-500 text-xs mt-1">{errors.cnic}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-green-600 text-white px-8 py-3 rounded-md font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[200px]"
                        >
                            {loading ? 'SUBMITTING...' : 'SUBMIT'}
                        </button>
                    </div>
                </div>

                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Submitted!</h3>
                            <p className="text-gray-600 mb-4">
                                Your private charter request has been submitted successfully. Our team will contact you shortly.
                            </p>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowSuccessModal(false)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* <SuccessModal
                        isOpen={showSuccessModal}
                        onClose={() => setShowSuccessModal(false)}
                        title="Request Submitted!"
                        message="Your private charter request has been submitted successfully. Our team will contact you shortly."
                        // redirectMessage="Redirecting to charter list"
                        redirectSeconds={4}
                        onRedirect={() => window.history.back()}
                    /> */}
            </div>
        </div>
    );
};

export default PrivateCharterForm;