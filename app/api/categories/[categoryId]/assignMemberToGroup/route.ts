import { NextResponse } from 'next/server';
import Category from '@/models/category';
import MemberGroup from '@/models/memberGroup';
import connectDB from '@/config/database';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export const POST = withApiAuthRequired(async (req: Request) => {
  try {
    await connectDB();
    const categoryId = new URL(req.url).pathname.split('/')[2];
    const body = await req.json();
    const groupId = body?.groupId;

    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found', data: null }, { status: 200 });
    }

    const memberGroup = await MemberGroup.findById(groupId);
    if (!memberGroup) {
      return NextResponse.json({ success: false, message: 'MemberGroup not found', data: null }, { status: 200 });
    }

    if (!category.memberGroups.includes(groupId)) {
      category.memberGroups.push(groupId);
      memberGroup.categoryid = categoryId;

      await category.save();
      await memberGroup.save();
    }

    return NextResponse.json({ success: true, message: 'Member group assigned to category successfully', data: category }, { status: 200 });
  } catch (error) {
    console.error('Error assigning member group to category:', error);
    return NextResponse.json({ success: false, message: `Error assigning member group to category: ${error}`, data: null }, { status: 500 });
  }
});
