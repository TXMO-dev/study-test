import { NextResponse } from 'next/server';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import connectDB from '@/config/database';
import MemberGroup from '@/models/memberGroup';
import MemberProfile from '@/models/memberProfile';



export const GET = withApiAuthRequired(async (req) => {
  try {
    await connectDB();
    const groupId = new URL(req.url).pathname.split('/')[3];

    const memberGroup = await MemberGroup.findById(groupId)
      .populate('leader')
      .populate('members')
      .populate('categoryid');

    if (!memberGroup) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'Member group not found',
        data: null
      }), { status: 404 });
    }

    const members = await MemberProfile.find({ _id: { $in: memberGroup.members } });

    return new NextResponse(JSON.stringify({
      success: true,
      message: 'Member profiles fetched successfully',
      data: members
    }), { status: 200 });
  } catch (error) {
    console.error('Error fetching member profiles:', error);
    return new NextResponse(JSON.stringify({
      success: false,
      message: `Error fetching member profiles: ${error}`,
      data: null
    }), { status: 500 }); // Changed status to 500 to reflect server error
  }
});

