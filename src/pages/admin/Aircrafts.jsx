import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Plus, AlertCircle, CheckCircle, Search } from 'lucide-react';
import { url } from '../../utils/url';
import CustomButton from '../../components/custom/CustomButton';
import AircraftCard from '../../components/pageComponents/AircraftCard';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import toast from 'react-hot-toast';
import AdminNavigation from '../../components/common/AdminNavigation';

const Aircrafts = () => {
    const navigate = useNavigate();

    const [aircrafts, setAircrafts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setIsDeleting] = useState(false);


    useEffect(() => {
        fetchAircrafts();
    }, []);

    const fetchAircrafts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/AirlineAircraft/GetAircrafts`);
            const result = await response.json();

            if (result.success) {
                setAircrafts(result.data || []);
            } else {
                toast.error(result.message || 'Failed to fetch aircrafts');
            }
        } catch (err) {
            console.error('Error fetching aircrafts:', err);
            toast.error('Error fetching aircrafts');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (aircraftId) => {
        navigate(`/admin/aircraft-management/${aircraftId}`);
    };

    const handleDelete = (aircraftId) => {
        setDeleteId(aircraftId);
        setShowConfirmModal(true);
    };

    const confirmDelete = async (id) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`${url}/AirlineAircraft/delete-aircraft/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Aircraft deleted successfully!');
                fetchAircrafts(); // Refresh the list
            } else {
                toast.error(result.message || 'Failed to delete aircraft');
            }
        } catch (err) {
            console.error('Error deleting aircraft:', err);
            toast.error('Error deleting aircraft');
        }
        finally {
            setIsDeleting(false);
            setShowConfirmModal(false);


        }
    };

    const filteredAircrafts = aircrafts.filter(aircraft =>
        aircraft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aircraft.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aircraft.specifications.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-black/80 backdrop-blur-sm rounded-2xl min-h-screen text-white">

            {/* Header Navigation */}
            <AdminNavigation
                showBackButton={false}
                onBackClick={() => navigate('/admin/aircrafts')}
                userInfo={{
                    name: "Admin User",
                    email: "admin@jetrique.com",
                    avatar: null // You can pass a URL here if available
                }}
            />

            {/* Main Content */}
            <div className="px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8 ">
                        <div className='w-full'>
                            <h1 className="text-2xl font-semibold text-white mb-2">Aircraft Management</h1>
                            <p className="text-gray-400">Manage your fleet of aircrafts</p>
                        </div>
                        <CustomButton
                            className='min-w-fit max-w-[17%]'
                            text={
                                <div className="flex items-center space-x-2">
                                    <Plus className="h-4 w-4" />
                                    <span>Add Aircraft</span>
                                </div>
                            }
                            onClick={() => navigate('/admin/aircraft-management')}
                        />
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search aircrafts..."
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
                            <p className="mt-4 text-[#CDFF00]">Loading aircrafts...</p>
                        </div>
                    )}

                    {/* Aircraft Grid */}
                    {!loading && filteredAircrafts.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredAircrafts.map(aircraft => (
                                <AircraftCard
                                    key={aircraft.id}
                                    aircraft={aircraft}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {!loading && filteredAircrafts.length === 0 && aircrafts.length > 0 && (
                        <div className="text-center py-12">
                            <Plane className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">No aircrafts found</h3>
                            <p className="text-gray-400">Try adjusting your search criteria</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && aircrafts.length === 0 && (
                        <div className="text-center py-12">
                            <Plane className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">No aircrafts yet</h3>
                            <p className="text-gray-400 mb-6">Add your first aircraft to get started</p>
                            <CustomButton
                                text={
                                    <div className="flex items-center space-x-2">
                                        <Plus className="h-4 w-4" />
                                        <span>Add First Aircraft</span>
                                    </div>
                                }
                                onClick={() => navigate('/admin/aircraft-management')}
                            />
                        </div>
                    )}
                </div>
            </div>
            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={() => confirmDelete(deleteId)}
                title={"Delete Aircraft"}
                message={`Are you sure you want to delete the aircraft`
                }
                confirmText={"Confirm"}
                cancelText="Cancel"
                type="info"
                loading={deleting}
            />
        </div>
    );
};

export default Aircrafts;