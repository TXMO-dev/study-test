import connectDB from "@/config/database";
import MemberProfile from "@/models/memberProfile";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const PUT = withApiAuthRequired(async (req: Request) => {
  try {
    await connectDB();

    // Extract ID from request URL
    const id = new URL(req.url).pathname.split('/')[4];
    console.log('this is the update profile id: ', id);
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new NextResponse(JSON.stringify({    
        success: false,
        message: 'Invalid profile ID',
        data: null
      }), { status: 400 });
    }

    const body = await req.json();

    // Ensure profileInputs is an array and filter out invalid inputs
    body.profileInputs = Array.isArray(body.profileInputs)
      ? body.profileInputs
          .map((input: { label: string; value: string; }) => ({
            label: input.label ? input.label.trim() : null,
            value: input.value ? input.value.trim() : null
          }))
          .filter((input: { label: string; value: string; }) => input.label && input.value)
      : [];

    // Validate unique labels in profileInputs
    const labels = body.profileInputs.map((input: { label: any; }) => input.label);
    if (labels.length !== new Set(labels).size) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'Each label in profileInputs must be unique',
        data: null
      }), { status: 400 });
    }

    // Find the member profile by ID and update it
    const updatedMemberProfile = await MemberProfile.findByIdAndUpdate(id, body, { new: true });

    if (!updatedMemberProfile) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'Member profile not found',
        data: null
      }), { status: 404 });
    }

    return new NextResponse(JSON.stringify({
      success: true,
      message: 'Member profile updated successfully',
      data: updatedMemberProfile
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
