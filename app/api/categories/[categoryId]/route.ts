import { NextResponse } from 'next/server';
import dbConnect from '@/config/database';
import Category from '@/models/category';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export const GET = withApiAuthRequired(async (req) => {
  await dbConnect();
  const categoryId = new URL(req.url).pathname.split('/')[2];

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found', data: null }, { status: 200 });
    }
    return NextResponse.json({ success: true, message: 'Category fetched successfully', data: category }, { status: 200 });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch category', data: null }, { status: 200 });
  }
});

export const PUT = withApiAuthRequired(async (req) => {
  await dbConnect();
  const categoryId = new URL(req.url).pathname.split('/')[2];
  const body = await req.json();

  try {
    const category = await Category.findByIdAndUpdate(categoryId, body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found', data: null }, { status: 200 });
    }
    return NextResponse.json({ success: true, message: 'Category updated successfully', data: category }, { status: 200 });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ success: false, message: 'Failed to update category', data: null }, { status: 200 });
  }
});

export const DELETE = withApiAuthRequired(async (req) => {  
  await dbConnect();
  const categoryId = new URL(req.url).pathname.split('/')[2];

  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return NextResponse.json({ success: false, message: 'Category not found', data: null }, { status: 200 });
    }
    return NextResponse.json({ success: true, message: 'Category deleted successfully', data: {} }, { status: 200 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete category', data: null }, { status: 200 });
  }
});
