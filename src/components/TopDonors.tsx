import React from 'react';
import Image from 'next/image';

const userImages = [
  '/images/user/user-01.png',
  '/images/user/user-02.png',
  '/images/user/user-03.png',
  '/images/user/user-04.png',
  '/images/user/user-05.png',
  '/images/user/user-06.png',
  '/images/user/user-07.png',
  '/images/user/user-08.png',
  '/images/user/user-09.png',
  '/images/user/user-10.png',
];

const getRandomImage = () => {
  return userImages[Math.floor(Math.random() * userImages.length)];
};

const TopDonors: React.FC = () => {
  const donorData = [
    { name: 'Michael Jordan', amount: '$5,768', logo: getRandomImage() },
    { name: 'Emma Thompson', amount: '$4,635', logo: getRandomImage() },
    { name: 'John Doe', amount: '$3,921', logo: getRandomImage() },
    { name: 'Sarah Williams', amount: '$3,500', logo: getRandomImage() },
    { name: 'Robert Smith', amount: '$3,245', logo: getRandomImage() },
    { name: 'Lisa Chen', amount: '$2,980', logo: getRandomImage() },
    { name: 'David Brown', amount: '$2,750', logo: getRandomImage() },
    { name: 'Amanda Garcia', amount: '$2,500', logo: getRandomImage() },
    { name: 'James Wilson', amount: '$2,300', logo: getRandomImage() },
    { name: 'Emily Taylor', amount: '$2,100', logo: getRandomImage() },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Top Donors</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donorData.map((donor, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Image src={donor.logo} alt={donor.name} width={30} height={30} className="mr-2 rounded-full" />
                    <div className="text-sm font-medium text-gray-900">{donor.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500 font-semibold">{donor.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopDonors;