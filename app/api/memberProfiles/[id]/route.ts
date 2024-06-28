import { NextResponse } from 'next/server';
import MemberProfile from '@/models/memberProfile';
import connectDB from '@/config/database';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import MemberGroup from '@/models/memberGroup';

export const GET = withApiAuthRequired(async (req: Request) => {
  try {
    await connectDB();
    const id = new URL(req.url).pathname.split('/')[3]; 
    const memberProfile = await MemberProfile.findById(id);
    if (!memberProfile) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'Member profile not found',
        data: null
      }), { status: 200 });
    }
    return new NextResponse(JSON.stringify({
      success: true,
      message: 'Member profile fetched successfully',
      data: memberProfile
    }), { status: 200 });
  } catch (error) {
    console.error('Error fetching member profile:', error);
    return new NextResponse(JSON.stringify({
      success: false,
      message: `Error fetching member profile: ${error}`,
      data: null
    }), { status: 500 });
  }
});   

export const PUT = withApiAuthRequired(async (req: Request) => {
  try {
    await connectDB();
    const id = new URL(req.url).pathname.split('/')[3]; // Extract ID from URL

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


export const DELETE = withApiAuthRequired(async (req: Request) => {
  try {
    await connectDB();
    const id = new URL(req.url).pathname.split('/')[3];

    // Find and delete the member profile
    const deletedMemberProfile = await MemberProfile.findByIdAndDelete(id);
    if (!deletedMemberProfile) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'Member profile not found',
        data: null
      }), { status: 404 });
    }

    // Remove the deleted profile from all member groups
    const memberGroups = await MemberGroup.find({ members: id });
    for (const group of memberGroups) {
      group.members = group.members.filter((member: any) => member.toString() !== id);
      await group.save();
    }

    return new NextResponse(JSON.stringify({
      success: true,
      message: 'Member profile deleted successfully',
      data: deletedMemberProfile
    }), { status: 200 });
  } catch (error) {
    console.error('Error deleting member profile:', error);
    return new NextResponse(JSON.stringify({
      success: false,
      message: `Error deleting member profile: ${error}`,
      data: null
    }), { status: 500 });
  }
});

