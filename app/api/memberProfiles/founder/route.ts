import { NextResponse } from 'next/server';
import MemberProfile from '@/models/memberProfile';
import connectDB from '@/config/database';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export const PUT = withApiAuthRequired(async (req: Request) => { 
  try {
    await connectDB();
    const id = new URL(req.url).pathname.split('/')[2]; // Extract ID from URL

    const existingFounder = await MemberProfile.findOne({ isFounder: true });
    if (existingFounder) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'Founder already exists',
        data: null
      }), { status: 200 });
    }

    const memberProfile = await MemberProfile.findByIdAndUpdate(
      id,
      { isFounder: true },
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

// Endpoint to get the founder
export const GET = withApiAuthRequired(async () => {
  try {
    await connectDB();

    const founder = await MemberProfile.findOne({ isFounder: true });

    if (!founder) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'Founder not found',
        data: null
      }), { status: 200 });
    }

    return new NextResponse(JSON.stringify({
      success: true,
      message: 'Founder fetched successfully',
      data: founder
    }), { status: 200 });
  } catch (error) {
    console.error('Error fetching founder:', error);
    return new NextResponse(JSON.stringify({
      success: false,
      message: `Error fetching founder: ${error}`,
      data: null
    }), { status: 500 });
  }
});



