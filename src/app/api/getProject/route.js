// /app/api/getProject/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../utils/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    console.log(id, searchParams)

    if (!id) {
      return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db('charityDB');
    const projects = db.collection('projects');

    const project = await projects.findOne({ _id: id });
    
    console.log(project, client, db, projects)

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
