import { NextResponse } from 'next/server';
import MemberProfile from '@/models/memberProfile';
import connectDB from '@/config/database';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

// GET: Fetch all member profiles
export const GET = withApiAuthRequired(async () => {
  try {
    await connectDB();
    const memberProfiles = await MemberProfile.find({});
    return new NextResponse(JSON.stringify({
      success: true,
      message: 'Member profiles fetched successfully',
      data: memberProfiles
    }), { status: 200 });
  } catch (error) {
    console.error('Error fetching member profiles:', error);
    return new NextResponse(JSON.stringify({
      success: false,
      message: `Error fetching member profiles: ${error}`,
      data: null
    }), { status: 500 });
  }
});


// POST: Create a new member profile
export const POST = withApiAuthRequired(async (req: Request) => {
  try {
    await connectDB();
    const body = await req.json();

    // Ensure profileInputs is an array and filter out invalid inputs
    body.profileInputs = Array.isArray(body.profileInputs)
      ? body.profileInputs
          .map((input: { label: string; value: string; }) => ({
            label: input.label ? input.label.trim() : null,
            value: input.value ? input.value.trim() : null
          }))
          .filter((input: { label: string; value: string; }) => input.label && input.value)
      : [];

    // Validate unique labels in profileInputs
    const labels = body.profileInputs.map((input: { label: any; }) => input.label);
    if (labels.length !== new Set(labels).size) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'Each label in profileInputs must be unique',
        data: null
      }), { status: 400 });
    }

    const newMemberProfile = new MemberProfile(body);
    const savedMemberProfile = await newMemberProfile.save();
    return new NextResponse(JSON.stringify({
      success: true,
      message: 'Member profile created successfully',
      data: savedMemberProfile
    }), { status: 201 });
  } catch (error) {
    console.error('Error creating member profile:', error);
    return new NextResponse(JSON.stringify({
      success: false,
      message: `Error creating member profile: ${error}`,
      data: null
    }), { status: 500 });
  }
});



