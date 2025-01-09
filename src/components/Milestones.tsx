import React, { useState } from 'react';

interface Milestone {
  id: number;
  amount: number;
  description: string;
}

interface MilestonesProps {
  milestones: Milestone[];
  currentAmount: number;
}

const Milestones: React.FC<MilestonesProps> = ({ milestones, currentAmount }) => {
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);

  const totalAmount = milestones[milestones.length - 1].amount;
  const progress = (currentAmount / totalAmount) * 100;

  return (
    <div className="mt-8 w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Milestones</h2>
      <div className="relative">
        <div className="absolute left-0 right-0 h-2 bg-gray-200 rounded-full">
          <div
            className="absolute left-0 h-2 bg-green-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="relative pt-6 flex justify-between">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="flex flex-col items-center">
              <button
                className="w-4 h-4 bg-white border-2 border-green-500 rounded-full mb-2"
                onClick={() => setExpandedMilestone(expandedMilestone === milestone.id ? null : milestone.id)}
              ></button>
              <span className="text-sm font-semibold">${milestone.amount}</span>
              <span className="text-xs text-gray-500">Milestone {index}</span>
              {expandedMilestone === milestone.id && (
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-48 bg-white p-2 rounded shadow-lg z-10 mt-2">
                  <p className="text-sm">{milestone.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Milestones;