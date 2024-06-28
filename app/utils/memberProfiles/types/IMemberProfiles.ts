import { Types } from 'mongoose';


export interface IProfileInput {
  label: string;
  value: string;
}
// Type for MemberProfile
export interface IMemberProfile {
  success: boolean;
  message: string;
  data: {
    _id: Types.ObjectId | string;
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
    groupid?: Types.ObjectId[];
    categoryid?: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
  };
}

export interface IMemberProfiles {
  success: boolean;
  message: string;
  data: {
    _id: Types.ObjectId;
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
    groupid?: Types.ObjectId[];
    categoryid?: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
  }[];
}
