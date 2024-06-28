import { NextResponse } from 'next/server';
import MemberProfile from '@/models/memberProfile';
import MemberGroup from '@/models/memberGroup';
import Category from '@/models/category';
import connectDB from '@/config/database';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export const GET = withApiAuthRequired(async () => {
  try {
    await connectDB(); // Ensure the database connection is established

    const numberOfLeaders = await MemberProfile.find({ $or: [{ memberGroupStatus: true }, { categoryStatus: true }] }).countDocuments();
    const numberOfCategories = await Category.countDocuments();
    const numberOfMemberProfiles = await MemberProfile.countDocuments();
    const numberOfMemberGroups = await MemberGroup.countDocuments();

    const responsePayload = {
      numberOfLeaders,
      numberOfCategories,
      numberOfMemberProfiles,
      numberOfMemberGroups,
    };

    return NextResponse.json({ success: true, message: 'Statistics fetched successfully', data: responsePayload }, { status: 200 });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({ success: false, message: `Error fetching statistics: ${error}`, data: null }, { status: 500 });
  }
});
