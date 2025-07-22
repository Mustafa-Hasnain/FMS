import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plane, Save, ArrowLeft, Upload, X } from 'lucide-react';
import { url } from '../../utils/url';
import CustomInput from '../../components/custom/CustomInput';
import CustomButton from '../../components/custom/CustomButton';
import toast from 'react-hot-toast';
import AdminNavigation from '../../components/common/AdminNavigation';

const AircraftManagement = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    // Form data state
    const [formData, setFormData] = useState({
        id: 0,
        name: '',
        type: '',
        specifications: '',
        capacity: '',
        isActive: true,
        imageFile: null,
        currentImageUrl: ''
    });

    const [loading, setLoading] = useState(false);
    const [fetchingAircraft, setFetchingAircraft] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    // Fetch aircraft data if in edit mode
    useEffect(() => {
        if (isEditMode) {
            fetchAircraftData();
        }
    }, [id]);

    const fetchAircraftData = async () => {
        setFetchingAircraft(true);
        try {
            const response = await fetch(`${url}/AirlineAircraft/GetAircraft/${id}`);
            const result = await response.json();

            if (result.success) {
                const aircraft = result.data;
                setFormData({
                    id: aircraft.id,
                    name: aircraft.name,
                    type: aircraft.type,
                    specifications: aircraft.specifications,
                    capacity: aircraft.capacity,
                    isActive: aircraft.isActive,
                    imageFile: null,
                    currentImageUrl: aircraft.imageUrl
                });
                setImagePreview(aircraft.imageUrl);
            } else {
                toast.error(result.message || 'Failed to fetch aircraft data')
            }
        } catch (err) {
            console.error('Error fetching aircraft:', err);
            toast.error('Error fetching aircraft data')
        } finally {
            setFetchingAircraft(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please select a valid image file")
                return;
            }

            // Validate file size (e.g., 5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB")
                return;
            }

            setFormData(prev => ({
                ...prev,
                imageFile: file
            }));

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            imageFile: null
        }));
        setImagePreview(isEditMode ? formData.currentImageUrl : '');

        // Clear file input
        const fileInput = document.getElementById('imageFile');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create FormData for multipart request
            const formDataToSend = new FormData();

            if (isEditMode) {
                formDataToSend.append('Id', formData.id);
            }
            formDataToSend.append('Name', formData.name);
            formDataToSend.append('Type', formData.type);
            formDataToSend.append('Specifications', formData.specifications);
            formDataToSend.append('Capacity', formData.capacity);
            formDataToSend.append('IsActive', formData.isActive);

            if (formData.imageFile) {
                formDataToSend.append('ImageFile', formData.imageFile);
            }

            const response = await fetch(`${url}/AirlineAircraft/upsert-aircraft`, {
                method: 'POST',
                body: formDataToSend
            });

            const result = await response.json();

            if (result.success) {
                toast.success(isEditMode ? 'Aircraft updated successfully!' : 'Aircraft created successfully!')

                // Redirect after success
                setTimeout(() => {
                    navigate('/admin/aircrafts'); // Adjust route as needed
                }, 2000);
            } else {
                toast.error(result.message || 'Failed to save aircraft')
            }
        } catch (err) {
            console.error('Error saving aircraft:', err);
            toast.error('Error saving aircraft. Please try again.')
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while fetching aircraft data
    if (isEditMode && fetchingAircraft) {
        return (
            <div className="min-h-screen bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#CDFF00] mx-auto"></div>
                    <p className="mt-4 text-[#CDFF00] text-lg">Loading aircraft data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black/80 backdrop-blur-sm rounded-2xl min-h-screen text-white">

            {/* Header Navigation */}
            {/* <div className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Plane className="h-6 w-6 text-[#CDFF00]" />
              <span className="text-xl font-medium font-orbitron text-[#CDFF00]">Jetrique Admin</span>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-400 hover:text-[#CDFF00] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
        </div>
      </div> */}

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
                <div className="max-w-4xl mx-auto">
                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-white mb-2">
                            {isEditMode ? 'Edit Aircraft' : 'Add New Aircraft'}
                        </h1>
                        <p className="text-gray-400">
                            {isEditMode ? 'Update aircraft information' : 'Add a new aircraft to your fleet'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 border border-gray-800">

                        {/* Row 1: Name and Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <CustomInput
                                label="Aircraft Name"
                                name="name"
                                placeholder="e.g., Boeing 737"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                required
                            />
                            <div>
                                <label className="block text-sm text-gray-300 mb-2 font-inter">
                                    Aircraft Type *
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={(e) => handleInputChange('type', e.target.value)}
                                    className="w-full py-[14px] px-4 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-[#CDFF00] focus:border-[#CDFF00]"
                                    required
                                >
                                    <option value="">Select the Aircraft type</option>
                                    <option value="plane">Charter    Plane</option>
                                    <option value="jet">Jet</option>
                                    <option value="helicopter">Helicopter</option>
                                </select>
                            </div>
                        </div>

                        {/* Row 2: Capacity and Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <CustomInput
                                type="number"
                                label="Capacity"
                                name="capacity"
                                placeholder="180"
                                min="1"
                                value={formData.capacity}
                                onChange={(e) => handleInputChange('capacity', e.target.value)}
                                required
                            />

                            {/* Status Toggle */}
                            {/* <div>
                                <label className="block text-sm text-gray-300 mb-2 font-inter">Status</label>
                                <div className="flex items-center space-x-4 py-[14px]">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="isActive"
                                            checked={formData.isActive === true}
                                            onChange={() => handleInputChange('isActive', true)}
                                            className="text-[#CDFF00] focus:ring-[#CDFF00]"
                                        />
                                        <span className="text-green-400">Active</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="isActive"
                                            checked={formData.isActive === false}
                                            onChange={() => handleInputChange('isActive', false)}
                                            className="text-red-400 focus:ring-red-400"
                                        />
                                        <span className="text-red-400">Inactive</span>
                                    </label>
                                </div>
                            </div> */}
                        </div>

                        {/* Row 3: Specifications */}
                        <div className="mb-6">
                            <label className="block text-sm text-gray-300 mb-2 font-inter">Specifications</label>
                            <textarea
                                value={formData.specifications}
                                onChange={(e) => handleInputChange('specifications', e.target.value)}
                                placeholder="e.g., Max speed: 900km/h, Range: 5000km, Entertainment system, Wi-Fi"
                                rows={3}
                                className="w-full py-3 px-4 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-[#CDFF00] focus:border-[#CDFF00] resize-vertical"
                                required
                            />
                        </div>

                        {/* Row 4: Image Upload */}
                        <div className="mb-8">
                            <label className="block text-sm text-gray-300 mb-2 font-inter">Aircraft Image</label>

                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mb-4 relative inline-block">
                                    <img
                                        src={imagePreview}
                                        alt="Aircraft preview"
                                        className="w-48 h-32 object-cover rounded-lg border border-gray-700"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            {/* File Input */}
                            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-[#CDFF00] transition-colors">
                                <input
                                    type="file"
                                    id="imageFile"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="imageFile"
                                    className="cursor-pointer flex flex-col items-center space-y-2"
                                >
                                    <Upload className="h-8 w-8 text-gray-400" />
                                    <span className="text-gray-400">
                                        {formData.imageFile ? formData.imageFile.name : 'Click to upload aircraft image'}
                                    </span>
                                    <span className="text-sm text-gray-500">PNG, JPG up to 5MB</span>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 border border-gray-600 text-gray-400 rounded-md hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <CustomButton
                                type="submit"
                                text={
                                    <div className="flex items-center space-x-2">
                                        <Save className="h-4 w-4" />
                                        <span>{isEditMode ? 'Update Aircraft' : 'Create Aircraft'}</span>
                                    </div>
                                }
                                loading={loading}
                                onClickText="Saving..."
                                className="bg-[#CDFF00] text-black hover:bg-[#B8E600] disabled:bg-gray-600 disabled:text-gray-400"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AircraftManagement;