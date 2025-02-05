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
    const comments = db.collection('comments');

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

    let i = 1;
    do {
      let milestoneData;
      try {
        milestoneData = await contract.getMilestone(projectI, i);
      } catch (error) {
        console.error(`Error fetching milestone ${i}:`, error);
        break; // no more milestones after this, break;
      }

      const milestonePosts = await comments.find({ milestoneId: i }).toArray(); 

      milestones.push({
        id: Number(milestoneData.id),
        description: milestoneData.description,
        amount: ethers.formatEther(milestoneData.amount),
        fundsRaised: ethers.formatEther(projectOnChain.totalDonations),
        achieved: milestoneData.achieved,
        workDone: "Work done",
        votesFor: milestoneData.totalVotes.toString(),
        votesAgainst: Number(projectOnChain.totalDonors - milestoneData.totalVotes),
        votingOpen: milestoneData.votingOpen,
        totalVotes: milestoneData.totalVotes.toString(),
        posts: milestonePosts.map((post) => ({
          id: post._id,
          content: post.content,
          attachments: post.attachments,
          createdAt: post.createdAt,
          author: post.userId,
        })),
      });
      
      i += 1;
    } while (true)

    const responseData = {
      ...project,
      goalAmount: ethers.formatEther(project.goalAmount),
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
