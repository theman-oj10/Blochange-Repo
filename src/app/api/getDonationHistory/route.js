// /app/api/getDonationHistory/route.js

import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';
import { ethers } from 'ethers';
const contractABI = require('../../../../contracts/CharityPlatform.json').abi;
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ message: 'User address is required' }, { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db('charityDB');
    const projects = db.collection('projects');

    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const donationHistory = await contract.getUserDonationHistory(address);

    const donations = await Promise.all(
      donationHistory.map(async (donation) => {
        const project = await projects.findOne({ _id: parseInt(donation.projectId).toString() });
        console.log(project);
        if (project) {
          return {
            projectId: parseInt(donation.projectId).toString(),
            name: project.name,
            description: project.description,
            raisedAmount: ethers.formatEther(project.raisedAmount),
            goalAmount: ethers.formatEther(project.goalAmount),
            daysLeft: project.daysLeft,
            donorCount: project.donorCount,
            amountDonated: ethers.formatEther(donation.amountDonated)
          };
        }
        return null;
      })
    );

    return NextResponse.json({ donations: donations.filter(donation => donation !== null) }, { status: 200 });
  } catch (error) {
    console.error('Error fetching donation history:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
