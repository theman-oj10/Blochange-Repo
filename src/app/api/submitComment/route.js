import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';
import { v2 as cloudinary } from 'cloudinary';
import { ethers } from 'ethers';

const contractABI = require('../../../../contracts/CharityPlatform.json').abi;
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, milestoneId, content, attachments } = body;

    if (!userId || !milestoneId || !content) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    // const isVoter = await contract.isVoter(userId, milestoneId);
    const isVoter = true;  // Mocked for now

    if (!isVoter) {
      return NextResponse.json({ message: 'User is not a voter, cannot comment' }, { status: 403 });
    }

    const uploadedAttachments = [];
    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        const uploadResponse = await cloudinary.uploader.upload(attachment, {
          folder: 'milestone_comments',
        });
        uploadedAttachments.push(uploadResponse.secure_url);
      }
    }

    const client = await connectToDatabase();
    const db = client.db('charityDB');
    const comments = db.collection('comments');

    const comment = {
      userId,
      milestoneId,
      content,
      attachments: uploadedAttachments,
      createdAt: new Date(),
    };

    await comments.insertOne(comment);

    return NextResponse.json({ message: 'Comment submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error submitting comment:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
