import { NextResponse } from "next/server";
import { withApiAuthRequired } from '@auth0/nextjs-auth0'

export const GET = withApiAuthRequired(async () => {
    try {
        // await connectDB(); // Ensure the database connection is established
        const inputEntries = {};
        return NextResponse.json({ success: true, message: 'Input entries fetched successfully', data: inputEntries }, { status: 200 });
    } catch (error) {
        console.error('Error in fetching input entries:', error);
        return NextResponse.json({ success: false, message: `Error in fetching input entries: ${error}`, data: null }, { status: 500 });
    }
});  

export const POST = async (request: Request) => {
    try {
        const data = await request.json();
        return NextResponse.json({ success: true, message: 'Data received successfully', data }, { status: 200 });
    } catch (error) {
        console.error('Error processing POST request:', error);
        return NextResponse.json({ success: false, message: `Error processing POST request: ${error}`, data: null }, { status: 500 });
    }
}
