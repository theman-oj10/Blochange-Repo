// /app/api/getProject/route.js

import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';
import { ethers } from 'ethers';
const contractABI = require('../../../../contracts/CharityPlatform.json').abi;
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db('charityDB');
    const projects = db.collection('projects');

    const project = await projects.findOne({ _id: id });
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    let projectId = parseInt(id);
    const milestones = [];
    const projectOnChain = await contract.getProject(projectId);

    const [projectI, beneficiary, totalDonations, totalDonors, currentMilestone, completed] = projectOnChain;

    const currentMilestoneId = projectOnChain.currentMilestone;

    for (let i = 1; i <= 1; i++) {
      const milestoneData = await contract.getMilestone(projectI, i);

      milestones.push({
        id: Number(milestoneData.id) + 1,
        description: milestoneData.description,
        amount: ethers.formatEther(milestoneData.amount),
        fundsRaised: ethers.formatEther(projectOnChain.totalDonations),
        achieved: milestoneData.achieved,
        votingOpen: milestoneData.votingOpen,
        totalVotes: milestoneData.totalVotes.toString(),
      });
    }

    const responseData = {
      ...project,
      raisedAmount: ethers.formatEther(projectOnChain.totalDonations),
      onChainData: {
        totalDonations: ethers.formatEther(projectOnChain.totalDonations),
        totalDonors: Number(projectOnChain.totalDonors),
        currentMilestone: Number(projectOnChain.currentMilestone),
        completed: projectOnChain.completed,
      },
      milestones,
    };

    return NextResponse.json({ project: responseData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
