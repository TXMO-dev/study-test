import { NextResponse } from 'next/server';
import dbConnect from '@/config/database';
import MemberGroup from '@/models/memberGroup';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import MemberProfile from '@/models/memberProfile';

export const GET = withApiAuthRequired(async (req) => {
  const  groupId  = new URL(req.url).pathname.split('/')[3];
  console.log('this is the group id: ', groupId);
  await dbConnect();
  try {
    const memberGroup = await MemberGroup
                                .findById(groupId)
                                .populate('leader')
                                .populate('members');     
    if (!memberGroup) {
      return NextResponse.json({success: false, message: 'Member group not found', data: memberGroup}, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'The Member Group was created successfully.', data: memberGroup }, { status: 200 });
  } catch (error) {
    console.error('Error fetching member group:', error);
    return NextResponse.json('Failed to fetch member group', { status: 400 });
  }
});

export const PUT = withApiAuthRequired(async (req: Request) => {
  const groupId = new URL(req.url).pathname.split('/')[3];
  console.log('this is the groupId for PUT:', groupId);
  const body = await req.json();

  await dbConnect();
  try {
    const memberGroup = await MemberGroup.findByIdAndUpdate(groupId, body, {
      new: true,
      runValidators: true,
    }).populate('leader').populate('members');  
    if (!memberGroup) {
      return NextResponse.json({ success: false, message: 'Member group not found', data: null }, { status: 404 });
    }

    const updatedMemberGroup = await memberGroup.save(); // Save the updated document
    console.log('Member group updated:', updatedMemberGroup);

    return NextResponse.json({ success: true, message: 'The updated member group was updated successfully.', data: updatedMemberGroup }, { status: 200 });
  } catch (error) {
    console.error('Error updating member group:', error);
    return NextResponse.json({ success: false, message: `Failed to update member group: ${error}`, data: null }, { status: 400 });
  }
});

export const DELETE = withApiAuthRequired(async (req: Request) => {
  const groupId = new URL(req.url).pathname.split('/')[3];

  await dbConnect();
  try {
    const memberGroup = await MemberGroup.findById(groupId);
    if (!memberGroup) {
      return NextResponse.json({ success: false, message: 'Member group not found' }, { status: 404 });
    }

    // Check if members array is empty
    if (memberGroup.members.length !== 0) {
      if (memberGroup.members.length === 1) {
        // If there's only one member, update their status
        const memberProfile = await MemberProfile.findById(memberGroup.members[0]);
        if (memberProfile && memberProfile.memberGroupStatus) {
          memberProfile.memberGroupStatus = false;
          await memberProfile.save();
        }
      } else {
        return NextResponse.json({ success: false, message: 'Cannot delete member group with members' }, { status: 400 });
      }
    }

    // Delete the member group if members array is empty or contains only the leader
    const deletedMemberGroup = await MemberGroup.deleteOne({ _id: groupId });
    if (!deletedMemberGroup.deletedCount) {
      return NextResponse.json({ success: false, message: 'Member group not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `The group ${memberGroup?.groupName} has been deleted`, data: {} }, { status: 200 });
  } catch (error) {
    console.error('Error deleting member group:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete member group' }, { status: 400 });
  }
});

