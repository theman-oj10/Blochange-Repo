// /app/api/getProjects/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'All';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const client = await connectToDatabase();
    const db = client.db('charityDB');
    const projects = db.collection('projects');

    // Build the query based on the category
    const query = category === 'All' ? {} : { category };

    // Fetch the total count for pagination
    const total = await projects.countDocuments(query);

    // Fetch the projects with pagination
    const projectCursor = projects.find(query).skip(skip).limit(limit);
    const projectArray = await projectCursor.toArray();

    // Transform the data as needed
    const projectsData = projectArray.map(project => ({
      id: project._id.toString(),
      name: project.projectName,
      description: project.description,
      raisedAmount: project.raisedAmount,
      goalAmount: project.goalAmount,
      beneficiaryName: project.beneficiaryName || 'John Smith'
      benefiaryPorfilePic: 'team-01.png'
      daysLeft: project.daysLeft,
      donorCount: project.donorCount,
      category: project.category,
      milestones: project.milestones || [1,2,3],
      imageUrl: project.imageUrl || '/images/default-charity-image.jpg', // Ensure imageUrl exists
    }));

    return NextResponse.json({
      projects: projectsData,
      total,
      page,
      pages: Math.ceil(total / limit),
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
