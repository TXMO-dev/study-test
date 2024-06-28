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
    const isLeader = new URL(req.url)?.searchParams?.get('isLeader') === 'true'; // Parse string value to boolean
    console.log('IsLeader value:', isLeader);

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

    // Check if memberId already exists in the members array
    if (!memberGroup.members.includes(memberId)) {
      memberGroup.members.push(memberId);
    }

    // Check if groupId already exists in the groupid array
    if (!memberProfile.groupid.includes(groupId)) {
      memberProfile.groupid.push(groupId);
    }

    if (isLeader) {
      // Set memberGroupStatus to false for any existing memberGroupStatus true
      await MemberProfile.updateMany({ groupid: groupId, memberGroupStatus: true }, { memberGroupStatus: false });
    
      // Update leader in the member group
      memberGroup.leader = new mongoose.Types.ObjectId(memberId); // Convert memberId to ObjectId
      console.log('this is the current memberGroup.leader:', memberGroup.leader);
    
      // Set memberGroupStatus to true for the current memberProfile
      memberProfile.memberGroupStatus = true;
      // Save both changes
      await Promise.all([memberGroup.save(), memberProfile.save()]);
    } else {
      memberProfile.memberGroupStatus = false;
      memberGroup.leader = new mongoose.Types.ObjectId(); 
      await Promise.all([memberGroup.save(), memberProfile.save()]);
    }

    // Populate the leader and members fields
    const populatedMemberGroup = await MemberGroup.findById(groupId)
      .populate('leader')
      .populate('members');

    return new NextResponse(JSON.stringify({
      success: true,
      message: 'Member profile assigned to member group successfully',
      data: populatedMemberGroup
    }), { status: 200 });
  } catch (error) {
    console.error('Error assigning member profile to member group:', error);
    return new NextResponse(JSON.stringify({
      success: false,
      message: `Error assigning member profile to member group: ${error}`,
      data: null
    }), { status: 500 });
  }
});
