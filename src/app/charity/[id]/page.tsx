// src/app/charity/[id]/page.tsx

"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Use useParams for App Router
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Image from 'next/image';
import Milestones from '@/components/Milestones';
import TopDonors from '@/components/TopDonors';
import ChartOne from "@/components/Charts/ChartOne";
import Comments from '@/components/Comments';
import Donate from "@/components/Project/Donate";
import { getRandomImage } from '@/app/unsplashApi';
import MilestoneBox from '@/components/MilestoneBox'

const charityCategories = [
  "All",
  "Animals",
  "Arts",
  "Community",
  "Education",
  "Environment",
  "Healthcare",
  "Overseas",
  "Social",
  "Sports",
];

const CharityDetails = () => {
  const { id } = useParams(); // Get the dynamic ID from the URL in App Router
  const [charity, setCharity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; // Wait until the ID is available

    const fetchCharityDetails = async () => {
      try {
        const response = await fetch(`/api/getProject?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project details');
        }
        const data = await response.json();
        data.project.imageUrl = 'imageUrl';
        setCharity(data.project);
        console.log(data.project)

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }

    };

    fetchCharityDetails();
  }, []); // need to fix this

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
          <div className="flex items-center">
            {/* <span className="mr-2">{charity.beneficiaryName}</span> */}
            <span className="mr-2">{"John Smith"}</span>
            <Image 
              // src={charity.beneficiaryProfilePic} 
              src='/team-01.png'
              alt={charity.beneficiary} 
              width={40} 
              height={40} 
              className="rounded-full"
            />
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
                <span className="text-green-600 font-semibold">{charity.raisedAmount} MATIC raised</span>
                <span className="text-gray-500">of {charity.goalAmount} MATIC</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-green-600 h-2.5 rounded-full" style={{width: `${(charity.raisedAmount / (charity.goalAmount)) * 100}%`}}></div>
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
            <Milestones milestones={charity.milestones} currentAmount={charity.raisedAmount} projectId={id} goalAmount={(charity.goalAmount)} />
          </div>
          {charity.milestones.map((milestone) => (
            <div key={milestone.id} className="bg-white shadow-md rounded-lg p-6 lg:col-span-2 xl:col-span-2">
              <MilestoneBox
                id={milestone.id}
                amount={milestone.amount}
                description={milestone.description}
                workDone={milestone.workDone}
                proofImages={milestone.proofImages}
                votesFor={milestone.votesFor}
                votesAgainst={milestone.votesAgainst}
                posts={milestone.posts}
              />
            </div>
          ))}
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
