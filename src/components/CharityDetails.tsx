"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Image from 'next/image';
import TableOne from "@/components/Tables/TableOne";
import { UserCircle } from 'lucide-react';
import Link from 'next/link';
import profilePic from '../../public/images/team/team-01.png';
import Milestones from '@/components/Milestones';

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
  // This is mock data. Replace with actual API call in a real application.
  return {
    id,
    name: "Support Children & Youths",
    description: "Help disadvantaged children and youth achieve their potential through education and mentorship programs.",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    raisedAmount: 450,
    goalAmount: 9988,
    daysLeft: 2,
    donorCount: 8,
    category: "Education",
    beneficiary: {
      name: "John Smith",
      profilePic: profilePic,
      profileLink: "/beneficiary/john-smith"
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">{charity.name}</h1>
          <Link href={charity.beneficiary.profileLink} className="flex items-center">
            <span>{charity.beneficiary.name}</span>
            <Image 
              src={charity.beneficiary.profilePic} 
              alt={charity.beneficiary.name} 
              width={50} 
              height={50} 
              className="rounded-full ml-4"
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
              <progress value={charity.raisedAmount} max={charity.goalAmount} className="w-full mb-2"></progress>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{charity.donorCount} donors</span>
                <span>{charity.daysLeft} days left</span>
              </div>
            </div>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors">
              Donate Now
            </button>
          </div>
        </div>
        <Milestones milestones={charity.milestones} currentAmount={charity.raisedAmount} />

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Top Donors</h2>
          <TableOne />
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <UserCircle className="mr-2" />
                  <span className="font-semibold">{comment.user}</span>
                  <span className="text-gray-500 text-sm ml-2">{comment.date}</span>
                </div>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <textarea 
              className="w-full p-2 border rounded-lg" 
              rows={3} 
              placeholder="Leave a comment..."
            ></textarea>
            <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Post Comment
            </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CharityDetails;