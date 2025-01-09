"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Image from 'next/image';
import Link from 'next/link';
import profilePic from '../../public/images/team-01.png';
import Milestones from '@/components/Milestones';
import TopDonors from '@/components/TopDonors';
import ChartOne from "@/components/Charts/ChartOne";
import Comments from '@/components/Comments';
import Donate from "@/components/Project/Donate"

// Mock data for top donors
const topDonors = [
  { id: 1, name: 'John Doe', date: '2023-09-15', amount: 500 },
  { id: 2, name: 'Jane Smith', date: '2023-09-14', amount: 350 },
  { id: 3, name: 'Bob Johnson', date: '2023-09-13', amount: 250 },
];

// Mock data for comments
const comments = [
  { id: 1, user: 'Alice', text: 'Great cause!', date: '2023-09-15' },
  { id: 2, user: 'Charlie', text: 'Happy to support this initiative.', date: '2023-09-14' },
];

// In a real application, you'd fetch this data from an API
const getCharityDetails = (id: string) => {
  return {
    id,
    name: "Support Children & Youths",
    description: "Help disadvantaged children and youth achieve their potential through education and mentorship programs.",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    raisedAmount: 450,
    goalAmount: 9988,
    daysLeft: 2,
    donorCount: 8,
    beneficiary: {
      name: "John Smith",
      profilePic: profilePic
    },
    milestones: [
      { id: 1, amount: 2000, description: "Initial funding for program setup" },
      { id: 2, amount: 5000, description: "Expand to 5 more schools" },
      { id: 3, amount: 7500, description: "Launch online learning platform" },
      { id: 4, amount: 9988, description: "Provide scholarships for 20 students" }
    ]
  };
};

const CharityDetails: React.FC = () => {
  const params = useParams();
  const id = params.id as string;
  const charity = getCharityDetails(id);
  return (
    <DefaultLayout>
      <div className="container mx-auto py-8 px-4 space-y-12">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-700">{charity.name}</h1>
          <Link href={`/beneficiary/${charity.beneficiary.name}`} className="flex items-center hover:underline">
            <span className="mr-2">{charity.beneficiary.name} </span>
            <Image 
              src={charity.beneficiary.profilePic} 
              alt={charity.beneficiary.name} 
              width={40} 
              height={40} 
              className="rounded-full"
            />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Image 
              src={charity.imageUrl} 
              alt={charity.name} 
              width={600} 
              height={400} 
              className="rounded-lg shadow-md"
            />
          </div>
          <div>
            <p className="text-gray-600 mb-4">{charity.description}</p>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-600 font-semibold">${charity.raisedAmount} raised</span>
                <span className="text-gray-500">of ${charity.goalAmount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div className="bg-green-600 h-2.5 rounded-full" style={{width: `${(charity.raisedAmount / charity.goalAmount) * 100}%`}}></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{charity.donorCount} donors</span>
                <span>{charity.daysLeft} days left</span>
              </div>
            </div>
            <section style={{ marginTop: '40px' }}>
              <Donate />
            </section>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
          <div className="shadow-md rounded-lg p-6 lg:col-span-2 xl:col-span-2">
            <Milestones milestones={charity.milestones} currentAmount={charity.raisedAmount} />
          </div>
          <div className="shadow-md rounded-lg p-2">
            <ChartOne />
          </div>
          <div className="shadow-md rounded-lg py-6 px-8">
            <TopDonors />
          </div>
        </div>

        <Comments />
      </div>
    </DefaultLayout>
  );
};

export default CharityDetails;