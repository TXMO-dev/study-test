import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import MemberGroup from '@/models/memberGroup';  

export const GET = withApiAuthRequired(async () => {
  try {
    await connectDB();
    const memberGroups = await MemberGroup.find({}).populate('leader').populate('members').populate('categoryid');
    return new NextResponse(JSON.stringify({
      success: true,
      message: 'Member groups fetched successfully',
      data: memberGroups
    }), { status: 200 });
  } catch (error) {
    console.error('Error fetching member groups:', error);
    return new NextResponse(JSON.stringify({
      success: false,
      message: `Error fetching member groups: ${error}`,
      data: null
    }), { status: 500 }); // Change status to 500 to reflect server error
  }
});

export const POST = withApiAuthRequired(async (req) => {
  try {
    await connectDB();
    const body = await req.json();

    // Check if the group name already exists
    const existingGroup = await MemberGroup.findOne({ groupName: body.groupName });
    if (existingGroup) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'Error creating member group: Group name already exists',
        data: null
      }), { status: 400 });
    }

    // Validate the members field
    if (!Array.isArray(body.members)) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'Error creating member group: Members field must be an array',
        data: null
      }), { status: 400 });
    }

    // Create the member group
    const memberGroup = await MemberGroup.create(body);
    return new NextResponse(JSON.stringify({
      success: true,
      message: 'Member group created successfully',
      data: memberGroup
    }), { status: 201 });
  } catch (error) {
    console.error('Error creating member group:', error);
    return new NextResponse(JSON.stringify({
      success: false,
      message: `Error creating member group: ${error}`,
      data: null
    }), { status: 500 });
  }
});
