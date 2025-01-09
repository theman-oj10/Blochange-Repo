import React from 'react';
import Image from 'next/image';

const TopDonors: React.FC = () => {
  const donorData = [
    { source: 'Google', visitors: '3.5K', revenues: '$5,768', sales: 590, conversion: '4.8%', logo: '/api/placeholder/30/30' },
    { source: 'X.com', visitors: '2.2K', revenues: '$4,635', sales: 467, conversion: '4.3%', logo: '/api/placeholder/30/30' },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Top Donors</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Visitors</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Revenues</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donorData.map((donor, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Image src={donor.logo} alt={donor.source} width={30} height={30} className="mr-2" />
                    <div className="text-sm font-medium text-gray-900">{donor.source}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donor.visitors}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500 font-semibold">{donor.revenues}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donor.sales}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donor.conversion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopDonors;