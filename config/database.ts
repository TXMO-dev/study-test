import mongoose from "mongoose";

const connectDB = async () => {
    if (mongoose.connections[0].readyState === 1) {
        console.log('Already connected.');
        return true;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI!, {
            dbName: 'app-profile',
            bufferCommands: false
        });
        console.log('Mongodb connected!');
        return true;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; // Ensure errors are propagated
    }
};

export default connectDB;
