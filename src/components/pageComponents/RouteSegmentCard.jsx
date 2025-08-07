import { 
    Calendar, 
    MapPin, 
    Users, 
    Package, 
    Heart,
    Plane,

 } 
 from 'lucide-react';
import React from 'react';
import { formatDate, formatTime } from '../../utils/dateUtils';

const RouteSegment = ({ segment, isLast, segmentNumber }) => (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
                Segment {segmentNumber}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(segment.departDate)}</span>
            </div>
        </div>

        {/* Departure Time */}
        <div className="text-center mb-6">
            <div className="text-2xl font-bold text-[#CDFF00] mb-1">
                {formatTime(segment.departDate)}
            </div>
            <div className="text-sm text-gray-400">Departure Time</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* From Location */}
            <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-[#CDFF00] mb-2">
                    <MapPin className="h-5 w-5" />
                    <span className="font-medium text-lg">{segment.fromLocation}</span>
                </div>
                <div className="text-sm text-gray-400">Departure</div>
            </div>

            {/* Route Visual */}
            <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 text-gray-400">
                    <div className="w-2 h-2 bg-[#CDFF00] rounded-full"></div>
                    <div className="w-16 h-px bg-gray-400"></div>
                    <Plane className="h-4 w-4 transform rotate-90 text-[#CDFF00]" />
                    <div className="w-16 h-px bg-gray-400"></div>
                    <div className="w-2 h-2 bg-[#CDFF00] rounded-full"></div>
                </div>
                <div className="text-xs text-gray-400 mt-1">Direct Flight</div>
            </div>

            {/* To Location */}
            <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-[#CDFF00] mb-2">
                    <MapPin className="h-5 w-5" />
                    <span className="font-medium text-lg">{segment.toLocation}</span>
                </div>
                <div className="text-sm text-gray-400">Destination</div>
            </div>
        </div>

        {/* Segment Details */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-700">
            <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-gray-400 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Passengers</span>
                </div>
                <div className="text-lg font-semibold text-white">{segment.seats}</div>
            </div>
            <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-gray-400 mb-1">
                    <Package className="h-4 w-4" />
                    <span className="text-sm">Luggage</span>
                </div>
                <div className="text-lg font-semibold text-white">{segment.luggage} kg</div>
            </div>
            <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-gray-400 mb-1">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">Pets</span>
                </div>
                <div className="text-lg font-semibold text-white">{segment.pets}</div>
            </div>
        </div>
    </div>
);

export default RouteSegment