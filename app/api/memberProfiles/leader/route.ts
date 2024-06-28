import { NextResponse } from 'next/server';
import MemberProfile from '@/models/memberProfile';
import connectDB from '@/config/database';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export const PUT = withApiAuthRequired(async (req: Request) => {
  try {
    await connectDB();
    const id = new URL(req.url).pathname.split('/')[2]; // Extract ID from URL

    const existingLeadPastor = await MemberProfile.findOne({ isLeadPastor: true });
    if (existingLeadPastor) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'Lead Pastor already exists',
        data: null
      }), { status: 200 });
    }

    const memberProfile = await MemberProfile.findByIdAndUpdate(
      id,
      { isLeadPastor: true },
      { new: true }
    );

    if (!memberProfile) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'MemberProfile not found',
        data: null
      }), { status: 200 });
    }

    return new NextResponse(JSON.stringify({
      success: true,
      message: 'MemberProfile updated successfully',
      data: memberProfile
    }), { status: 200 });
  } catch (error) {
    console.error('Error updating member profile:', error);
    return new NextResponse(JSON.stringify({
      success: false,
      message: `Error updating member profile: ${error}`,
      data: null
    }), { status: 500 });
  }
});

// Endpoint to get the leader
export const GET = withApiAuthRequired(async () => {
  try {
    await connectDB();

    const leader = await MemberProfile.findOne({ isLeadPastor: true });

    if (!leader) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'Leader not found',
        data: null
      }), { status: 200 });
    }

    return new NextResponse(JSON.stringify({
      success: true,
      message: 'Leader fetched successfully',
      data: leader
    }), { status: 200 });
  } catch (error) {
    console.error('Error fetching leader:', error);
    return new NextResponse(JSON.stringify({
      success: false,
      message: `Error fetching leader: ${error}`,
      data: null
    }), { status: 500 });
  }
});









