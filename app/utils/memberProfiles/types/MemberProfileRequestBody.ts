import mongoose from "mongoose";
import { IProfileInput } from "./IMemberProfiles";

export interface MemberProfileRequestBody {
    _id?: mongoose.Types.ObjectId;
    labelvalue?: string;
    inputvalue?: string;
    imageurl?: string;
    memberGroupStatus?: boolean;
    categoryStatus?: boolean;
    isFounder?: boolean;
    isLeadPastor?: boolean;
    name: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female';
    maritalStatus: 'Single' | 'Married' | 'Widowed' | 'Divorced';
    occupation: string;
    profileInputs: IProfileInput[];
    groupid?: mongoose.Types.ObjectId[];
    categoryid?: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}