// /app/api/saveProject/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';

export async function POST(request) {
  try {
    const { projectId, beneficiary, projectName, description, goalAmount } = await request.json();

    if (!projectId || !beneficiary || !projectName || !description || !goalAmount) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const client = await connectToDatabase();
    let milestones = [1,2,3];
    console.log("Client: ", client)
    const db = client.db('charityDB');
    const projects = db.collection('projects');

    const newProject = {
      _id: projectId,
      beneficiary,
      projectName,
      description,
      goalAmount,
      milestones,
      raisedAmount: '0',
      createdAt: new Date(),
    };

    await projects.insertOne(newProject);

    return NextResponse.json({ message: 'Project saved successfully', project: newProject }, { status: 201 });
  } catch (error) {
    console.error('Error saving project:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
