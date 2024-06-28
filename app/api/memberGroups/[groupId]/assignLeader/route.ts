import { NextResponse } from 'next/server';
import MemberGroup from '@/models/memberGroup';
import MemberProfile from '@/models/memberProfile';
import connectDB from '@/config/database';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export const POST = withApiAuthRequired(async (req) => {
  try {
    await connectDB(); 
    const groupId = new URL(req.url).pathname.split('/')[3];
    const body = await req.json();
    const memberId = body?.memberId;

    const memberGroup = await MemberGroup.findById(groupId);
    if (!memberGroup) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'MemberGroup not found', 
        data: null
      }), { status: 404 });
    }

    const memberProfile = await MemberProfile.findById(memberId);
    if (!memberProfile) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'MemberProfile not found',
        data: null
      }), { status: 404 });
    }

    if (memberGroup.leader) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'MemberGroup already has a leader',
        data: null
      }), { status: 400 });
    }

    memberGroup.leader = memberId;
    memberProfile.memberGroupStatus = true;

    await memberGroup.save();
    await memberProfile.save();

    return new NextResponse(JSON.stringify({
      success: true,
      message: 'Leader assigned to member group successfully',
      data: memberGroup
    }), { status: 200 });
  } catch (error) {
    console.error('Error assigning leader to member group:', error);
    return new NextResponse(JSON.stringify({
      success: false,
      message: `Error assigning leader to member group: ${error}`,
      data: null
    }), { status: 500 });
  }
});
