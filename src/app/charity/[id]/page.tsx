"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Heart, Users, Calendar, Star, MapPin, Share2, Twitter, Facebook, Linkedin, Instagram, Link } from 'lucide-react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Milestones from '@/components/Milestones';
import TopDonors from '@/components/TopDonors';
import ChartOne from "@/components/Charts/ChartOne";
import Comments from '@/components/Comments';
import Donate from "@/components/Project/Donate";
import CharityStats from '@/components/CharityStats';
import SocialShare from '@/components/SocialShare';

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
    if (!maticAmount) return showUSD ? '$0.00 USD' : '0.00 MATIC';
    
    if (showUSD) {
      const usdAmount = convertMaticToUSD(maticAmount);
      return `$${parseFloat(usdAmount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })} USD`;
    }
    
    return `${parseFloat(maticAmount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} MATIC`;
  };

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative mb-12">
        <div className="relative h-96 w-full rounded-2xl overflow-hidden">
          <Image 
            src="/africa.jpg"
            alt="Children in classroom"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold mb-4">{charity.projectName}</h1>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-4 py-2 rounded-full bg-orange-500/20 backdrop-blur-sm text-white border border-orange-300/30">
                  Humanitarian Assistance
                </span>
                <span className="px-4 py-2 rounded-full bg-green-500/20 backdrop-blur-sm text-white border border-green-300/30">
                  Hunger Relief
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors">
                <Share2 className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-2 bg-white/10 p-2 rounded-full backdrop-blur-sm">
                <div className="relative w-8 h-8">
                  <Image 
                    src="/images/team-01.png"
                    alt="Aid Africa"
                    fill
                    className="rounded-full border-2 border-white object-cover"
                  />
                </div>
                <span className="px-2">Aid Africa</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stats Cards and Social Share */}
<div className="space-y-6">
  {/* Stats Component */}
  <CharityStats
    totalDonors={charity.onChainData.totalDonors}
    daysLeft={100}
    rating={4.5}
    totalRatings={127}
    city="Lagos"
    country="Nigeria"
    impactCount={charity.onChainData.totalDonors}
    launchDate="Jan 2024"
  />

  {/* Social Share Component */}
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <SocialShare 
      projectName={charity.projectName}
      projectDescription="Help fund education for underprivileged kids in Lagos, Nigeria"
    />
  </div>
</div>
        

        {/* Center Column - Main Content */}
<div className="lg:col-span-2 space-y-8">
  {/* Progress Section */}
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900">{formatAmount(charity.raisedAmount)}</h3>
        <p className="text-sm text-gray-500">raised of {formatAmount(charity.goalAmount)} goal</p>
      </div>
      <button
        onClick={() => setShowUSD(!showUSD)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <span className={showUSD ? 'text-blue-600 font-medium' : 'text-gray-500'}>USD</span>
        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${showUSD ? 'bg-blue-600' : 'bg-gray-200'}`}>
          <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ${showUSD ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
        <span className={!showUSD ? 'text-blue-600 font-medium' : 'text-gray-500'}>MATIC</span>
      </button>
    </div>

    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-8">
      <div 
        className="h-full bg-blue-600 transition-all duration-500"
        style={{
          width: `${Math.min((charity.raisedAmount / charity.goalAmount) * 100, 100)}%`
        }}
      />
    </div>

    <div className="mb-8 space-y-6">
      <p className="text-gray-700 text-lg leading-relaxed">
        In Lagos, Nigeria, thousands of children lack access to quality education due to financial barriers and limited resources. Many families struggle to afford basic educational supplies, and local schools often operate without adequate teaching materials or qualified instructors, leaving bright young minds without the opportunity to reach their full potential.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        Our initiative provides comprehensive educational support by funding school supplies, learning materials, and qualified teachers for underprivileged children. By equipping these students with the tools they need and creating an engaging learning environment, we're working to break the cycle of poverty through education and empower the next generation of leaders in Lagos.
      </p>
    </div>

    <div className="mt-8">
      <Donate projectId={charity._id} />
    </div>
  </div>
</div>
      </div>

      {/* Milestones and Other Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white shadow-md rounded-xl p-10 lg:col-span-2">
          <Milestones 
            milestones={charity.milestones} 
            currentAmount={charity.raisedAmount}
            projectId={id} 
            goalAmount={charity.goalAmount}
            conversionRate={conversionRate}
            showUSD={showUSD}
          />
        </div>
        <div className="bg-white shadow-md rounded-xl p-4">
          <ChartOne />
        </div>
        <div className="bg-white shadow-md rounded-xl p-4">
          <TopDonors donors={charity.topDonors} />
        </div>
      </div>
      
      <div className="mt-8">
        <Comments comments={charity.comments} />
      </div>
    </div>
  </DefaultLayout>
);
};

export default CharityDetails;