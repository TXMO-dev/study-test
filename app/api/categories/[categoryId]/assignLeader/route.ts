import { NextResponse } from 'next/server';
import Category from '@/models/category';
import MemberProfile from '@/models/memberProfile';
import connectDB from '@/config/database';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export const POST = withApiAuthRequired(async (req: Request) => {
  try {
    await connectDB();
    const categoryId = new URL(req.url).pathname.split('/')[2];
    const body = await req.json();
    const memberId = body?.memberId;

    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found', data: null }, { status: 200 });
    }

    const memberProfile = await MemberProfile.findById(memberId);
    if (!memberProfile) {
      return NextResponse.json({ success: false, message: 'MemberProfile not found', data: null }, { status: 200 });
    }

    if (category.leader) {
      return NextResponse.json({ success: false, message: 'Category already has a leader', data: null }, { status: 200 });
    }

    category.leader = memberId;
    memberProfile.categoryStatus = true;

    await category.save();
    await memberProfile.save();

    return NextResponse.json({ success: true, message: 'Leader assigned to category successfully', data: category }, { status: 200 });
  } catch (error) {
    console.error('Error assigning leader to category:', error);
    return NextResponse.json({ success: false, message: `Error assigning leader to category: ${error}`, data: null }, { status: 500 });
  }
});
