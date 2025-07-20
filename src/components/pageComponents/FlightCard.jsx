import React from 'react';
import { Plane, Wifi, Utensils, Tv, Edit, Trash2 } from 'lucide-react';

const FlightCard = ({ flight, onBookFlight, isAdmin = false, onEditFlight, onDeleteFlight }) => {
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDuration = (departure, arrival) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diffMs = arr - dep;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHrs}h ${diffMins}m`;
  };

  const getAircraftTypeText = (type) => {
    switch (type) {
      case 0: return 'Charter Plane';
      case 1: return 'Jet';
      case 2: return 'Helicopter';
      default: return 'Commercial';
    }
  };

  // Check if arrival date is valid (not default date)
  const isValidArrival = flight.arrivalDatetime !== "0001-01-01T00:00:00";
  const duration = isValidArrival ? calculateDuration(flight.departureDatetime, flight.arrivalDatetime) : "N/A";

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:border-[#CDFF00] transition-all">
      <div className="flex items-center justify-between mb-4">
        {/* Left side - Flight time and route */}
        <div className="flex items-center space-x-8">
          {/* Departure */}
          <div className="text-left">
            <div className="text-2xl font-bold text-white">{formatTime(flight.departureDatetime)}</div>
            <div className="text-sm text-gray-400">{flight.fromLocation}</div>
            <div className="text-xs text-gray-500">{formatDate(flight.departureDatetime)}</div>
          </div>

          {/* Flight path */}
          <div className="flex flex-col items-center">
            <div className="text-xs text-gray-400 mb-1">{duration}</div>
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-16 h-px bg-gray-400"></div>
              <Plane className="h-4 w-4 transform rotate-90" />
              <div className="w-16 h-px bg-gray-400"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
            <div className="text-xs text-gray-400 mt-1">Non-stop</div>
          </div>

          {/* Arrival */}
          <div className="text-left">
            {isValidArrival ? (
              <>
                <div className="text-2xl font-bold text-white">{formatTime(flight.arrivalDatetime)}</div>
                <div className="text-sm text-gray-400">{flight.toLocation}</div>
                <div className="text-xs text-gray-500">{formatDate(flight.arrivalDatetime)}</div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-white">--:--</div>
                <div className="text-sm text-gray-400">{flight.toLocation}</div>
                <div className="text-xs text-gray-500">TBA</div>
              </>
            )}
          </div>
        </div>

        {/* Right side - Price and booking */}
        <div className="text-right">
          <div className="text-2xl font-bold text-white mb-1">
            PKR {flight.seatPrice.toLocaleString()}
          </div>
          {isAdmin ? (
            /* Admin buttons - Edit and Delete */
            <div className="flex space-x-2">
              <button
                onClick={() => onEditFlight && onEditFlight(flight.id)}
                className="flex items-center space-x-2 border-[1px] border-solid border-[#CDFF00] text-white px-4 py-2 rounded-md hover:bg-[#CDFF00] hover:text-black transition-all font-medium"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDeleteFlight && onDeleteFlight(flight.id)}
                className="flex items-center space-x-2 border-[1px] border-solid border-red-500 text-red-400 px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition-all font-medium"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          ) : (
            /* Regular user button - Book now */
            <button
              onClick={() => onBookFlight && onBookFlight(flight.id)}
              className="border-[1px] border-solid border-[#CDFF00] text-white px-6 py-2 rounded-md hover:bg-[#CDFF00] hover:text-black transition-all font-medium"
            >
              Book now
            </button>
          )}
        </div>
      </div>

      {/* Bottom section - Airline and amenities */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-4">
          {/* Airline info */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Plane className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">{flight.aircraftName}</div>
              <div className="text-xs text-gray-400">{getAircraftTypeText(flight.aircraftType)} • GE50</div>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex items-center space-x-3 text-[#CDFF00]">
            <Wifi className="h-4 w-4" />
            <Utensils className="h-4 w-4" />
            <Tv className="h-4 w-4" />
          </div>
        </div>

        {/* Flight status */}
        <div className="flex items-center space-x-4 text-sm">

          <span className="text-gray-400">{flight.seatsAvailable} seats available</span>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;