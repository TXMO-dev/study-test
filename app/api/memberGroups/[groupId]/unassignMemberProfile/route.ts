import connectDB from "@/config/database";
import MemberGroup from "@/models/memberGroup";
import MemberProfile from "@/models/memberProfile";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const POST = withApiAuthRequired(async (req: Request) => {
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

    // Remove memberId from the members array if it exists
    memberGroup.members = memberGroup.members.filter((id: mongoose.Types.ObjectId) => !id.equals(memberId));

    // Remove groupId from the groupid array if it exists
    memberProfile.groupid = memberProfile.groupid.filter((id: mongoose.Types.ObjectId) => !id.equals(groupId));

    // Check if the member being removed is the leader
    if (memberGroup.leader?.equals(memberId)) {
      memberGroup.leader = null; // Remove the leader
      memberProfile.memberGroupStatus = false; // Update memberGroupStatus
    }

    await Promise.all([memberGroup.save(), memberProfile.save()]);

    // Populate the leader and members fields
    const populatedMemberGroup = await MemberGroup.findById(groupId)
      .populate('leader')
      .populate('members');

    return new NextResponse(JSON.stringify({
      success: true,
      message: 'Member profile unassigned from member group successfully',
      data: populatedMemberGroup
    }), { status: 200 });
  } catch (error) {
    console.error('Error unassigning member profile from member group:', error);
    return new NextResponse(JSON.stringify({
      success: false,
      message: `Error unassigning member profile from member group: ${error}`,
      data: null
    }), { status: 500 });
  }
});
