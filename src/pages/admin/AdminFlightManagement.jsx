import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plane, Save, ArrowLeft, Trash2 } from 'lucide-react';
import { url } from '../../utils/url';
import CustomButton from '../../components/custom/CustomButton';
import CustomInput from '../../components/custom/CustomInput';
import toast from 'react-hot-toast';
import AdminNavigation from '../../components/common/AdminNavigation';

const AdminFlightManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Form data state
  const [formData, setFormData] = useState({
    id: 0,
    aircraftId: '',
    fromLocation: '',
    toLocation: '',
    departureDatetime: '',
    arrivalDatetime: '',
    seatPrice: '',
    luggageLimitKg: '',
    seatsAvailable: '',
    createdByUserId: 1, // Default value, you might want to get this from auth context
    flightType: 1 // Default flight type
  });

  const [aircrafts, setAircrafts] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingFlight, setFetchingFlight] = useState(false);
  const [fetchingAircrafts, setFetchingAircrafts] = useState(false);

  // Fetch aircrafts on component mount
  useEffect(() => {
    fetchAircrafts();

    // If in edit mode, fetch flight data
    if (isEditMode) {
      fetchFlightData();
    }
  }, [id]);

  const fetchAircrafts = async () => {
    setFetchingAircrafts(true);
    try {
      const response = await fetch(`${url}/AirlineAircraft/GetAircrafts`);
      const result = await response.json();

      if (result.success) {
        setAircrafts(result.data || []);
      } else {
        toast.error(`${result.message || "Failed to fetch Aircrafts"}`);
      }
    } catch (err) {
      console.error('Error fetching aircrafts:', err);
      toast.error('Error fetching aircrafts')
    } finally {
      setFetchingAircrafts(false);
    }
  };

  // const fetchFlightData = async () => {
  //   setFetchingFlight(true);
  //   try {
  //     const response = await fetch(`${url}/Flight/GetFlight/${id}`);
  //     const result = await response.json();

  //     if (result.success) {
  //       const flight = result.data;
  //       setFormData({
  //         id: flight.id,
  //         aircraftId: flight.aircraftId,
  //         fromLocation: flight.fromLocation,
  //         toLocation: flight.toLocation,
  //         departureDatetime: flight.departureDatetime ? new Date(flight.departureDatetime).toISOString().slice(0, 16) : '',
  //         arrivalDatetime: flight.arrivalDatetime ? new Date(flight.arrivalDatetime).toISOString().slice(0, 16) : '',
  //         seatPrice: flight.seatPrice,
  //         luggageLimitKg: flight.luggageLimitKg,
  //         seatsAvailable: flight.seatsAvailable,
  //         createdByUserId: flight.createdByUserId,
  //         flightType: flight.flightType
  //       });
  //     } else {
  //       toast.error(result.message || 'Failed to fetch flight data', 'error')
  //     }
  //   } catch (err) {
  //     console.error('Error fetching flight:', err);
  //     toast.error('Error fetching flight data');
  //   } finally {
  //     setFetchingFlight(false);
  //   }
  // };

  const fetchFlightData = async () => {
    setFetchingFlight(true);
    try {
      const response = await fetch(`${url}/Flight/GetFlight/${id}`);
      const result = await response.json();
      if (result.success) {
        const flight = result.data;
        setFormData({
          id: flight.id,
          aircraftId: flight.aircraftId,
          fromLocation: flight.fromLocation,
          toLocation: flight.toLocation,
          departureDatetime: new Date(flight.departureDatetime).toISOString().slice(0, 16),
          arrivalDatetime: new Date(flight.arrivalDatetime).toISOString().slice(0, 16),
          seatPrice: flight.seatPrice,
          luggageLimitKg: flight.maxLuggageWeight,
          seatsAvailable: flight.seatsAvailable,
          createdByUserId: 1,
          flightType: flight.flightType
        });
        setImages(
          flight.images.map(img => ({
            file: null,
            preview: img.imageUrl,
            description: img.description,
            isBannerImage: img.isBannerImage,
            toDelete: false,
            imageId: img.imageId
          }))
        );
      } else toast.error(result.message || 'Failed to fetch flight');
    } catch {
      toast.error('Error fetching flight');
    } finally {
      setFetchingFlight(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (e, index) => {
    const updated = [...images];
    updated[index].file = e.target.files[0];
    updated[index].preview = URL.createObjectURL(e.target.files[0]);
    setImages(updated);
  };

  const addImageField = () => {
    setImages([...images, { file: null, preview: '', description: '', isBannerImage: false, toDelete: false }]);
  };

  // const removeImageField = (index) => {
  //   setImages(images.filter((_, i) => i !== index));
  // };

  const removeImageField = (imageId) => {
    setImages((prevImages) =>
      prevImages
        .map((img) => {
          if (img.imageId === imageId) {
            return { ...img, toDelete: true }; // Mark existing image for deletion
          }
          return img;
        })
    );
  };

  console.log("Images:", images);


  const handleImageChange = (index, field, value) => {
    const updated = [...images];
    updated[index][field] = value;
    if (field === 'isBannerImage') {
      updated.forEach((img, i) => {
        if (i !== index) img.isBannerImage = false;
      });
    }
    setImages(updated);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     // Prepare the request body
  //     const requestBody = {
  //       aircraftId: parseInt(formData.aircraftId),
  //       fromLocation: formData.fromLocation,
  //       toLocation: formData.toLocation,
  //       departureDatetime: new Date(formData.departureDatetime).toISOString(),
  //       arrivalDatetime: new Date(formData.arrivalDatetime).toISOString(),
  //       seatPrice: parseFloat(formData.seatPrice),
  //       luggageLimitKg: parseInt(formData.luggageLimitKg),
  //       seatsAvailable: parseInt(formData.seatsAvailable),
  //       createdByUserId: parseInt(formData.createdByUserId),
  //       flightType: parseInt(formData.flightType)
  //     };

  //     if(isEditMode){
  //       requestBody.id = parseInt(formData.id);
  //     }

  //     const response = await fetch(`${url}/Flight/upsert`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(requestBody)
  //     });

  //     const result = await response.json();

  //     if (result.success) {
  //       toast.success(response?.message || isEditMode ? 'Flight updated successfully!' : 'Flight created successfully!')

  //       // Optionally redirect after success
  //       setTimeout(() => {
  //         navigate('/admin/search'); // Adjust this route as needed
  //       }, 2000);
  //     } else {
  //       toast.error(result.message || 'Failed to save flight')
  //     }
  //   } catch (err) {
  //     console.error('Error saving flight:', err);
  //     toast.error('Error saving flight. Please try again')
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    if (isEditMode) form.append('Id', formData.id);
    form.append('AircraftId', formData.aircraftId);
    form.append('FromLocation', formData.fromLocation);
    form.append('ToLocation', formData.toLocation);
    form.append('DepartureDatetime', new Date(formData.departureDatetime).toISOString());
    form.append('ArrivalDatetime', new Date(formData.arrivalDatetime).toISOString());
    form.append('SeatPrice', formData.seatPrice);
    form.append('LuggageLimitKg', formData.luggageLimitKg);
    form.append('SeatsAvailable', formData.seatsAvailable);
    form.append('CreatedByUserId', formData.createdByUserId);
    form.append('FlightType', formData.flightType);

    images.forEach((img, i) => {
      if (img.file) form.append(`Images[${i}].ImageFile`, img.file);
      form.append(`Images[${i}].Description`, img.description);
      form.append(`Images[${i}].IsBannerImage`, img.isBannerImage);
      if(img.imageId) form.append(`Images[${i}].ImageId`, img.imageId);
      form.append(`Images[${i}].toDelete`, img.toDelete);
    });

    try {
      const response = await fetch(`${url}/Flight/upsert`, {
        method: 'POST',
        body: form
      });
      const result = await response.json();
      if (result.success) {
        toast.success(result.message || (isEditMode ? 'Flight updated' : 'Flight created'));
        setTimeout(() => navigate('/admin/search'), 1500);
      } else toast.error(result.message || 'Failed to save flight');
    } catch {
      toast.error('Error saving flight');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching flight data
  if (isEditMode && fetchingFlight) {
    return (
      <div className="min-h-screen bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#CDFF00] mx-auto"></div>
          <p className="mt-4 text-[#CDFF00] text-lg">Loading flight data...</p>
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
              {isEditMode ? 'Edit Flight' : 'Create New Flight'}
            </h1>
            <p className="text-gray-400">
              {isEditMode ? 'Update flight information' : 'Add a new flight to the system'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 border border-gray-800">

            {/* Aircraft Selection */}
            <div className="mb-6">
              <label className="block text-sm text-gray-300 mb-2 font-inter">Aircraft *</label>
              <select
                value={formData.aircraftId}
                onChange={(e) => handleInputChange('aircraftId', e.target.value)}
                className="w-full py-[14px] px-4 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-[#CDFF00] focus:border-[#CDFF00]"
                required
                disabled={fetchingAircrafts}
              >
                <option value="">
                  {fetchingAircrafts ? 'Loading aircrafts...' : 'Select an aircraft'}
                </option>
                {aircrafts.map(aircraft => (
                  <option key={aircraft.id} value={aircraft.id}>
                    {aircraft.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 1: From and To Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <CustomInput
                label="From Location"
                name="fromLocation"
                placeholder="e.g., KHI"
                value={formData.fromLocation}
                onChange={(e) => handleInputChange('fromLocation', e.target.value)}
                required
              />
              <CustomInput
                label="To Location"
                name="toLocation"
                placeholder="e.g., DXB"
                value={formData.toLocation}
                onChange={(e) => handleInputChange('toLocation', e.target.value)}
                required
              />
            </div>

            {/* Row 2: Departure and Arrival DateTime */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <CustomInput
                type="datetime-local"
                label="Departure DateTime"
                name="departureDatetime"
                value={formData.departureDatetime}
                onChange={(e) => handleInputChange('departureDatetime', e.target.value)}
                required
              />
              <CustomInput
                type="datetime-local"
                label="Arrival DateTime"
                name="arrivalDatetime"
                value={formData.arrivalDatetime}
                onChange={(e) => handleInputChange('arrivalDatetime', e.target.value)}
                required
              />
            </div>

            {/* Row 3: Seat Price and Luggage Limit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <CustomInput
                type="number"
                label="Seat Price (USD)"
                name="seatPrice"
                placeholder="0.01"
                min="0.01"
                step="0.01"
                value={formData.seatPrice}
                onChange={(e) => handleInputChange('seatPrice', e.target.value)}
                required
              />
              <CustomInput
                type="number"
                label="Luggage Limit (KG)"
                name="luggageLimitKg"
                placeholder="20"
                min="0"
                value={formData.luggageLimitKg}
                onChange={(e) => handleInputChange('luggageLimitKg', e.target.value)}
                required
              />
            </div>

            {/* Row 4: Seats Available */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <CustomInput
                type="number"
                label="Seats Available"
                name="seatsAvailable"
                placeholder="180"
                min="1"
                value={formData.seatsAvailable}
                onChange={(e) => handleInputChange('seatsAvailable', e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            {/* <div className="flex justify-end space-x-4">
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
                    <span>{isEditMode ? 'Update Flight' : 'Create Flight'}</span>
                  </div>
                }
                loading={loading}
                onClickText={
                  <div className="flex items-center space-x-2">
                    <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                  </div>
                }
                className="min-w-[140px]"
              />
            </div> */}

            {/* Image Upload Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Flight Images</h3>
              {images.map((img, index) => (
                !img?.toDelete && (
                  <div key={index} className="mb-4 p-4 border rounded-md bg-gray-800 relative">
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-500"
                      onClick={() => removeImageField(img?.imageId)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, index)}
                      className="mb-2 block w-full"
                    />
                    {img.preview && <img src={img.preview} alt="preview" className="h-32 object-cover rounded mb-2" />}
                    <textarea
                      className="w-full p-2 bg-gray-700 text-white rounded mb-2"
                      placeholder="Image description"
                      value={img.description}
                      onChange={(e) => handleImageChange(index, 'description', e.target.value)}
                    />
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={img.isBannerImage}
                        onChange={() => handleImageChange(index, 'isBannerImage', !img.isBannerImage)}
                      />
                      <span>Set as Banner Image</span>
                    </label>
                  </div>
                )
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="text-[#CDFF00] hover:underline"
              >
                + Add Another Image
              </button>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-600 text-gray-400 rounded-md hover:bg-gray-800"
              >
                Cancel
              </button>
              <CustomButton
                type="submit"
                text={<><Save className="h-4 w-4 mr-1" />{isEditMode ? 'Update Flight' : 'Create Flight'}</>}
                loading={loading}
                onClickText={<span>{isEditMode ? 'Updating...' : 'Creating...'}</span>}
                className="min-w-[140px]"
              />
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminFlightManagement;