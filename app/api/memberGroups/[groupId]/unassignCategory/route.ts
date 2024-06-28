import { NextResponse } from 'next/server';
import MemberGroup from '@/models/memberGroup';
import Category from '@/models/category';
import MemberProfile from '@/models/memberProfile';
import connectDB from '@/config/database';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export const POST = withApiAuthRequired(async (req: Request) => {
  try {
    await connectDB();
    const groupId = new URL(req.url).pathname.split('/')[3];
    const body = await req.json();
    const categoryId = body?.categoryId;

    const memberGroup = await MemberGroup.findById(groupId);
    if (!memberGroup) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'MemberGroup not found',
        data: null
      }), { status: 404 });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'Category not found',
        data: null
      }), { status: 404 });
    }

    memberGroup.categoryid = null;
    category.memberGroups = category.memberGroups.filter((id: string) => id.toString() !== groupId);

    await memberGroup.save();
    await category.save();

    // Unassign categoryId from each member in the group
    for (let memberId of memberGroup.members) {
      const member = await MemberProfile.findById(memberId);
      if (member) {
        member.categoryid = member.categoryid.filter((id: string) => id.toString() !== categoryId);
        await member.save();
      }
    }

    return new NextResponse(JSON.stringify({
      success: true,
      message: 'Category unassigned from member group successfully',
      data: memberGroup
    }), { status: 200 });
  } catch (error) {
    console.error('Error unassigning category from member group:', error);
    return new NextResponse(JSON.stringify({
      success: false,
      message: `Error unassigning category from member group: ${error}`,
      data: null
    }), { status: 500 });
  }
});
