// CharityStats.tsx
import React from 'react';
import { Users, Clock, Star, Calendar, MapPin, Heart, Target, Shield } from 'lucide-react';

interface CharityStatsProps {
  totalDonors: number;
  daysLeft: number;
  rating: number;
  totalRatings: number;
  city: string;
  country: string;
  impactCount: number;
  launchDate: string;
  milestoneCount?: number;
  credibilityScore?: number;
}

const CharityStats: React.FC<CharityStatsProps> = ({
  totalDonors,
  daysLeft,
  rating,
  totalRatings,
  city,
  country,
  impactCount,
  launchDate,
  milestoneCount = 5,
  credibilityScore = 95
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Rating Card */}
      <div className="bg-yellow-50/50 p-4 rounded-xl">
        <div className="flex gap-2 items-start">
          <Star className="w-5 h-5 text-yellow-600 mt-1" />
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{rating}</div>
            <div className="text-sm text-gray-600">Project Rating</div>
            <div className="flex mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Location Card */}
      <div className="bg-emerald-50/50 p-4 rounded-xl">
        <div className="flex gap-2 items-start">
          <MapPin className="w-5 h-5 text-emerald-600 mt-1" />
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{city}</div>
            <div className="text-sm text-gray-600">{country}</div>
          </div>
        </div>
      </div>

      {/* Lives Impacted Card */}
      <div className="bg-rose-50/50 p-4 rounded-xl">
        <div className="flex gap-2 items-start">
          <Heart className="w-5 h-5 text-rose-600 mt-1" />
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">200</div>
            <div className="text-sm text-gray-600">Lives Impacted</div>
          </div>
        </div>
      </div>

      {/* Total Donors Card */}
      <div className="bg-blue-50/50 p-4 rounded-xl">
        <div className="flex gap-2 items-start">
          <Users className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">82</div>
            <div className="text-sm text-gray-600">Total Donors</div>
          </div>
        </div>
      </div>

      {/* Launch Date Card */}
      <div className="bg-indigo-50/50 p-4 rounded-xl">
        <div className="flex gap-2 items-start">
          <Calendar className="w-5 h-5 text-indigo-600 mt-1" />
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">October 2024</div>
            <div className="text-sm text-gray-600">Launch Date</div>
          </div>
        </div>
      </div>

      {/* Days Left Card */}
      <div className="bg-purple-50/50 p-4 rounded-xl">
        <div className="flex gap-2 items-start">
          <Clock className="w-5 h-5 text-purple-600 mt-1" />
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{daysLeft}</div>
            <div className="text-sm text-gray-600">Days Left</div>
          </div>
        </div>
      </div>

      {/* Credibility Score Card */}
      <div className="bg-cyan-50/50 p-4 rounded-xl">
        <div className="flex gap-2 items-start">
          <Shield className="w-5 h-5 text-cyan-600 mt-1" />
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{credibilityScore}</div>
            <div className="text-sm text-gray-600">Credibility Score</div>
          </div>
        </div>
      </div>

      {/* Milestones Card */}
      <div className="bg-teal-50/50 p-4 rounded-xl">
        <div className="flex gap-2 items-start">
          <Target className="w-5 h-5 text-teal-600 mt-1" />
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
            <div className="text-sm text-gray-600">Milestones</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharityStats;