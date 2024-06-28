import mongoose from "mongoose";

export interface CategoryRequestBody {
    categoryName: string;
    memberGroups: mongoose.Types.ObjectId[]; 
    members: mongoose.Types.ObjectId[];
    leader: mongoose.Types.ObjectId; 
    description: String;
}  