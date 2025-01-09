"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Image from 'next/image';
import Milestones from '@/components/Milestones';
import TopDonors from '@/components/TopDonors';
import ChartOne from "@/components/Charts/ChartOne";
import Comments from '@/components/Comments';
import Donate from "@/components/Project/Donate";

const CharityDetails = () => {
  const { id } = useParams();
  const [charity, setCharity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conversionRate, setConversionRate] = useState(null);
  const [showUSD, setShowUSD] = useState(true);

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd');
        const data = await response.json();
        setConversionRate(data['matic-network'].usd);
      } catch (error) {
        console.error("Error fetching conversion rate:", error);
      }
    };

    const fetchCharityDetails = async () => {
      try {
        const response = await fetch(`/api/getProject?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project details');
        }
        const data = await response.json();
        data.project.imageUrl = 'imageUrl';
        setCharity(data.project);
      } catch (err) {
        console.error("Error fetching charity Details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversionRate();
    fetchCharityDetails();

    const interval = setInterval(fetchConversionRate, 60000);
    return () => clearInterval(interval);
  }, [id]);

  const convertMaticToUSD = (maticAmount) => {
    if (!conversionRate || !maticAmount) return 0;
    return (parseFloat(maticAmount) * conversionRate).toFixed(2);
  };

  const formatAmount = (maticAmount) => {
    if (showUSD) {
      return `$${convertMaticToUSD(maticAmount)} USD`;
    }
    return `${maticAmount} MATIC`;
  };

  const CurrencyToggle = () => (
    <button
      onClick={() => setShowUSD(!showUSD)}
      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-full text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <span className={`mr-2 ${showUSD ? 'text-gray-900' : 'text-gray-400'}`}>USD</span>
      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${showUSD ? 'bg-blue-600' : 'bg-gray-200'}`}>
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
            showUSD ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </div>
      <span className={`ml-2 ${!showUSD ? 'text-gray-900' : 'text-gray-400'}`}>MATIC</span>
    </button>
  );

  if (loading) {
    return (
      <DefaultLayout>
        <div className="container mx-auto py-8 px-4">
          <p>Loading...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="container mx-auto py-8 px-4">
          <p>Error: {error}</p>
        </div>
      </DefaultLayout>
    );
  }

  if (!charity) {
    return (
      <DefaultLayout>
        <div className="container mx-auto py-8 px-4">
          <p>Project not found.</p>
        </div>
      </DefaultLayout>
    );
  }
  
  return (
    <DefaultLayout>
      <div className="container mx-auto py-8 px-4 space-y-12">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-700">{charity.projectName}</h1>
          <div className="flex items-center space-x-4">
            <CurrencyToggle />
            <div className="flex items-center">
              <span className="mr-2">{"Aid Africa"}</span>
              <Image 
                src="/images/team-01.png"
                alt={charity.beneficiary} 
                width={40} 
                height={40} 
                className="rounded-full"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Image 
              src='/africa.jpg'
              alt={charity.projectName} 
              width={600} 
              height={400} 
              className="rounded-lg shadow-md"
            />
          </div>
          <div>
            <p className="text-gray-600 mb-4">{charity.description}</p>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-600 font-semibold">
                  {formatAmount(charity.raisedAmount)} raised
                </span>
                <span className="text-gray-500">
                  of {formatAmount(charity.goalAmount)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{width: `${(charity.raisedAmount / (charity.goalAmount)) * 100}%`}}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{charity.onChainData.totalDonors} donors</span>
                <span>{charity.daysLeft} days left</span>
              </div>
            </div>
            <section style={{ marginTop: '40px' }}>
              <Donate projectId={charity._id} />
            </section>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
          <div className="bg-white shadow-md rounded-lg px-10 lg:col-span-2 xl:col-span-2">
            <Milestones 
              milestones={charity.milestones} 
              currentAmount={charity.raisedAmount} // Keep original MATIC values
              projectId={id} 
              goalAmount={charity.goalAmount}  // Keep original MATIC values
              conversionRate={conversionRate}  // Add this
              showUSD={showUSD}  // Add this
            />
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <ChartOne />
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <TopDonors donors={charity.topDonors} />
          </div>
        </div>
        <Comments comments={charity.comments} />
      </div>
    </DefaultLayout>
  );
};

export default CharityDetails;