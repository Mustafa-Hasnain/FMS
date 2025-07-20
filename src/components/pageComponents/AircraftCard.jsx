import React from 'react';
import { Edit, Trash2, Plane, Users, Calendar } from 'lucide-react';

const AircraftCard = ({ aircraft, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-[#CDFF00] transition-all duration-300">
      {/* Aircraft Image */}
      <div className="mb-4">
        <img
          src={aircraft.imageUrl}
          alt={aircraft.name}
          className="w-full h-48 object-cover rounded-lg bg-gray-800"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xMDAgNDBMMTIwIDUwTDEwMCA2MEw4MCA1MEwxMDAgNDBaIiBmaWxsPSIjNkI3Mjg5Ii8+CjxwYXRoIGQ9Ik04MCA1MEwxMjAgNTBMMTMwIDYwTDEyMCA3MEw4MCA3MEw3MCA2MEw4MCA1MFoiIGZpbGw9IiM2Qjc0ODkiLz4KPHN2Zz4K';
          }}
        />
      </div>

      {/* Aircraft Details */}
      <div className="space-y-3">
        {/* Name and Type */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{aircraft.name}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            aircraft.isActive 
              ? 'bg-green-900/50 text-green-400 border border-green-800' 
              : 'bg-red-900/50 text-red-400 border border-red-800'
          }`}>
            {aircraft.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Type and Capacity */}
        <div className="flex items-center space-x-4 text-gray-400 text-sm">
          <div className="flex items-center space-x-1">
            <Plane className="h-4 w-4" />
            <span className="capitalize">{aircraft.type}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{aircraft.capacity} seats</span>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-gray-800 rounded-md p-3">
          <p className="text-sm text-gray-300">{aircraft.specifications}</p>
        </div>

        {/* Created Date */}
        <div className="flex items-center space-x-1 text-gray-400 text-xs">
          <Calendar className="h-3 w-3" />
          <span>Created: {formatDate(aircraft.createdAt)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={() => onEdit(aircraft.id)}
            className="border-[1px] border-solid border-blue-500 text-blue-400 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-all font-medium flex-1 flex items-center justify-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(aircraft.id, aircraft.name)}
            className="border-[1px] border-solid border-red-500 text-red-400 px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition-all font-medium flex-1 flex items-center justify-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AircraftCard;