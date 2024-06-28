import { NextResponse } from 'next/server';
import dbConnect from '@/config/database';
import Category from '@/models/category';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export const GET = withApiAuthRequired(async () => {
  await dbConnect();
  try {
    const categories = await Category.find({}).populate('leader');
    // Replace leader ObjectId with actual MemberProfile object
    
    return NextResponse.json(
      { success: true, message: 'Categories fetched successfully', data: categories }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories', data: null }, 
      { status: 200 }
    );
  }
});

export const POST = withApiAuthRequired(async (req: Request) => {
  await dbConnect();
  try {
    const body = await req.json();
    const category = await Category.create(body);
    return NextResponse.json(
      { success: true, message: 'Category created successfully', data: category }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create category', data: null }, 
      { status: 200 }
    );
  }
});
