// CharityStats.tsx
import React from 'react';
import { Users, Clock, Star, Calendar, MapPin, Heart } from 'lucide-react';

interface CharityStatsProps {
  totalDonors: number;
  daysLeft: number;
  rating: number;
  launchDate: string;
  location: string;
  impactCount: number;
}

const CharityStats: React.FC<CharityStatsProps> = ({
  totalDonors,
  daysLeft,
  rating,
  launchDate,
  location,
  impactCount
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {/* Impact */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-pink-50 rounded-lg">
            <Heart className="h-4 w-4 text-pink-500" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <p className="text-lg font-bold text-gray-900">{impactCount}</p>
              <p className="text-xs text-gray-500">people</p>
            </div>
            <p className="text-xs text-gray-500">Lives Impacted</p>
          </div>
        </div>
      </div>

      {/* Donors */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 rounded-lg">
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{totalDonors}</p>
            <p className="text-xs text-gray-500">Total Donors</p>
          </div>
        </div>
      </div>

      {/* Days Left */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-green-50 rounded-lg">
            <Clock className="h-4 w-4 text-green-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{daysLeft}</p>
            <p className="text-xs text-gray-500">Days Left</p>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-yellow-50 rounded-lg">
            <Star className="h-4 w-4 text-yellow-500" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-lg font-bold text-gray-900">{rating}</p>
              <span className="text-xs text-gray-500">/5</span>
            </div>
            <p className="text-xs text-gray-500">Project Rating</p>
          </div>
        </div>
      </div>

      {/* Launch Date */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-50 rounded-lg">
            <Calendar className="h-4 w-4 text-purple-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{launchDate}</p>
            <p className="text-xs text-gray-500">Launch Date</p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-50 rounded-lg">
            <MapPin className="h-4 w-4 text-red-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">Lagos</p>
            <p className="text-xs text-gray-500">Location</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharityStats;