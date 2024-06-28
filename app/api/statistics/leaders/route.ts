import { NextResponse } from 'next/server';
import MemberProfile from '@/models/memberProfile';
import connectDB from '@/config/database';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export const GET = withApiAuthRequired(async () => {
  try {
    await connectDB(); // Ensure the database connection is established

    const categoryLeadersCount = await MemberProfile.find({ categoryStatus: true }).countDocuments();
    const memberGroupLeadersCount = await MemberProfile.find({ memberGroupStatus: true }).countDocuments();

    const responsePayload = {
      categoryLeadersCount,
      memberGroupLeadersCount,
    };

    return NextResponse.json({ success: true, message: 'Leaders statistics fetched successfully', data: responsePayload }, { status: 200 });
  } catch (error) {
    console.error('Error fetching leaders statistics:', error);
    return NextResponse.json({ success: false, message: `Error fetching leaders statistics: ${error}`, data: null }, { status: 500 });
  }
});
