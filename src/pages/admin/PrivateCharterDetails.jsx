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
    CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminNavigation from '../../components/common/AdminNavigation';
import { formatDateTime } from '../../utils/dateUtils';
import RouteSegment from '../../components/pageComponents/RouteSegmentCard';
import { url } from '../../utils/url';

const PrivateCharterDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    
    const [charter, setCharter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchCharterDetails();
        }
    }, [id]);

    const fetchCharterDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${url}/PrivateCharter/GetRequestById/${id}`);
            const result = await response.json();

            if (result.success) {
                setCharter(result.data);
            } else {
                setError(result.message || 'Charter not found');
                toast.error(result.message || 'Failed to fetch charter details');
            }
        } catch (err) {
            console.error('Error fetching charter details:', err);
            setError('Error fetching charter details');
            toast.error('Error fetching charter details');
        } finally {
            setLoading(false);
        }
    };

    const getTripTypeLabel = (tripType) => {
        const types = {
            0: 'One Way',
            1: 'Round Trip',
            2: 'Multi City',
            3: 'Multi Stop'
        };
        return types[tripType] || 'Unknown';
    };

    if (loading) {
        return (
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl min-h-screen text-white">
                <AdminNavigation
                    showBackButton={true}
                    onBackClick={() => navigate('/admin/private-charter')}
                    userInfo={{
                        name: "Admin User",
                        email: "admin@jetrique.com",
                        avatar: null
                    }}
                />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CDFF00] mx-auto"></div>
                        <p className="mt-4 text-[#CDFF00]">Loading charter details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !charter) {
        return (
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl min-h-screen text-white">
                <AdminNavigation
                    showBackButton={true}
                    onBackClick={() => navigate('/admin/private-charter')}
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
                            <h3 className="text-lg font-medium text-white mb-2">Charter Not Found</h3>
                            <p className="text-gray-400 mb-4">
                                {error || 'The requested charter details could not be found.'}
                            </p>
                            <button
                                onClick={() => navigate('/admin/private-charter')}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-[#CDFF00] text-black rounded-md hover:bg-[#CDFF00]/90 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Back to Charters</span>
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
                onBackClick={() => navigate('/admin/private-charter')}
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
                                    Charter Request #{charter.id}
                                </h1>
                                <div className="flex items-center space-x-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#CDFF00]/20 text-[#CDFF00]">
                                        {getTripTypeLabel(charter.trip)}
                                    </span>
                                    <div className="flex items-center space-x-2 text-gray-400">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-sm">
                                            Submitted on {formatDateTime(charter.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Customer Information */}
                        <div className="xl:col-span-1">
                            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 h-fit">
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                                    <User className="h-5 w-5 text-[#CDFF00]" />
                                    <span>Customer Information</span>
                                </h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-400">Full Name</label>
                                        <div className="flex items-center space-x-3 mt-1">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <span className="text-white font-medium">{charter.name}</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm text-gray-400">Email Address</label>
                                        <div className="flex items-center space-x-3 mt-1">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <span className="text-white">{charter.email}</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm text-gray-400">Phone Number</label>
                                        <div className="flex items-center space-x-3 mt-1">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <span className="text-white">{charter.phone}</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm text-gray-400">CNIC</label>
                                        <div className="flex items-center space-x-3 mt-1">
                                            <CreditCard className="h-4 w-4 text-gray-400" />
                                            <span className="text-white font-mono">{charter.cnic}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Request Summary */}
                                <div className="mt-6 pt-6 border-t border-gray-700">
                                    <h3 className="text-lg font-medium text-white mb-4">Request Summary</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">Total Segments</span>
                                            <div className="text-white font-medium">{charter.segments.length}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Trip Type</span>
                                            <div className="text-white font-medium">{getTripTypeLabel(charter.trip)}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Total Passengers</span>
                                            <div className="text-white font-medium">
                                                {Math.max(...charter.segments.map(s => s.seats))}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Status</span>
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle className="h-4 w-4 text-green-400" />
                                                <span className="text-green-400 font-medium">Submitted</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Flight Segments */}
                        <div className="xl:col-span-2">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                                    <Plane className="h-5 w-5 text-[#CDFF00]" />
                                    <span>Flight Itinerary</span>
                                </h2>
                                <p className="text-gray-400 mt-1">Detailed flight segments for this charter request</p>
                            </div>

                            <div className="space-y-6">
                                {charter.segments.map((segment, index) => (
                                    <RouteSegment
                                        key={segment.id}
                                        segment={segment}
                                        isLast={index === charter.segments.length - 1}
                                        segmentNumber={index + 1}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivateCharterDetails;