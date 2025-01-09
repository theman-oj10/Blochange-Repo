import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CharityCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  raisedAmount: number;
  goalAmount: number;
  daysLeft: number;
  donorCount: number;
}

const CharityCard: React.FC<CharityCardProps> = ({
  id,
  name,
  description,
  imageUrl,
  raisedAmount,
  goalAmount,
  daysLeft,
  donorCount
}) => {
  goalAmount = goalAmount / 1000000000000000; // FIX!
  return (
    <Link href={`/charity/${id}`} className="block h-full">
      <div className="rounded-lg shadow-md overflow-hidden transition-transform h-full flex flex-col">
        <Image src={imageUrl} alt={name} width={400} height={200} className="w-full h-48 object-cover" />
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold mb-2">{name}</h3>
          <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{description}</p>
          <div className="mt-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-green-600 font-semibold">${raisedAmount} raised</span>
              <span className="text-gray-500">of ${goalAmount}</span>
            </div>
            <progress value={raisedAmount} max={goalAmount} className="w-full mb-2"></progress>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{donorCount} 25 donors</span>
              <span>{daysLeft} 12 days left</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CharityCard;