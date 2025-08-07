import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Search, Eye, Calendar, MapPin, Users } from 'lucide-react';
import { url } from '../../utils/url';
import CustomButton from '../../components/custom/CustomButton';
import toast from 'react-hot-toast';
import AdminNavigation from '../../components/common/AdminNavigation';

const PrivateCharter = () => {
    const navigate = useNavigate();

    const [charters, setCharters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCharters();
    }, []);

    const fetchCharters = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/PrivateCharter/GetAllRequests`);
            const result = await response.json();

            if (result.success) {
                setCharters(result.data || []);
            } else {
                toast.error(result.message || 'Failed to fetch private charters');
            }
        } catch (err) {
            console.error('Error fetching private charters:', err);
            toast.error('Error fetching private charters');
        } finally {
            setLoading(false);
        }
    };

    const getTripTypeLabel = (tripType) => {
        const types = {
            0: 'One Way',
            1: 'Round Trip',
            2: 'Multi Leg',
            3: 'Multi Leg'
        };
        return types[tripType] || 'Unknown';
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

    const getRouteDisplay = (segments) => {
        if (segments.length === 0) return 'No route';
        if (segments.length === 1) {
            return `${segments[0].fromLocation} → ${segments[0].toLocation}`;
        }
        // For multiple segments, show first and last locations
        const firstSegment = segments[0];
        const lastSegment = segments[segments.length - 1];
        return `${firstSegment.fromLocation} → ${lastSegment.toLocation} (+${segments.length - 1} stops)`;
    };

    const getEarliestDepartDate = (segments) => {
        if (segments.length === 0) return null;
        return segments.reduce((earliest, segment) => {
            const segmentDate = new Date(segment.departDate);
            return segmentDate < new Date(earliest) ? segment.departDate : earliest;
        }, segments[0].departDate);
    };

    const handleViewDetails = (charterId) => {
        console.log('View details for charter:', charterId);
        navigate(`/admin/private-charter/${charterId}`);
    };

    const filteredCharters = charters.filter(charter =>
        charter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        charter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        charter.phone.includes(searchTerm) ||
        charter.segments.some(segment => 
            segment.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            segment.toLocation.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

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
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className='w-full'>
                            <h1 className="text-2xl font-semibold text-white mb-2">Private Charter Requests</h1>
                            <p className="text-gray-400">Manage private charter booking requests</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search charters..."
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
                            <p className="mt-4 text-[#CDFF00]">Loading private charters...</p>
                        </div>
                    )}

                    {/* Charter Table */}
                    {!loading && filteredCharters.length > 0 && (
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
                                                    <span>Route</span>
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Departure</span>
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Trip Type
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {filteredCharters.map((charter) => (
                                            <tr key={charter.id} className="hover:bg-gray-700/30 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-white">{charter.name}</div>
                                                        <div className="text-sm text-gray-400">{charter.email}</div>
                                                        <div className="text-sm text-gray-400">{charter.phone}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-white">
                                                        {getRouteDisplay(charter.segments)}
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        {charter.segments.length} segment{charter.segments.length !== 1 ? 's' : ''}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-white">
                                                        {getEarliestDepartDate(charter.segments) ? 
                                                            formatDate(getEarliestDepartDate(charter.segments)) : 
                                                            'No date'
                                                        }
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#CDFF00]/20 text-[#CDFF00]">
                                                        {getTripTypeLabel(charter.trip)}
                                                    </span>
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
                                                        onClick={() => handleViewDetails(charter.id)}
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
                    {!loading && filteredCharters.length === 0 && charters.length > 0 && (
                        <div className="text-center py-12">
                            <Plane className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">No charters found</h3>
                            <p className="text-gray-400">Try adjusting your search criteria</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && charters.length === 0 && (
                        <div className="text-center py-12">
                            <Plane className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">No private charter requests yet</h3>
                            <p className="text-gray-400">Private charter requests will appear here once customers submit them</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrivateCharter;