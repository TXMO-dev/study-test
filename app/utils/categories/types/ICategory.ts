import { Types } from 'mongoose';

// Type for Category
export interface ICategories {
  success: boolean;
  message: string;
  data: {
    _id: string; // Assuming it's a string representation of ObjectId
    categoryName: string;
    memberGroups: string[]; // Assuming it's a string representation of ObjectId array
    members: string[]; // Assuming it's a string representation of ObjectId array
    leader?: {
      _id: string; // Assuming it's a string representation of ObjectId
      name: string;
      dateOfBirth: string;
      imageurl: String;
      gender: 'Male' | 'Female';
      maritalStatus: 'Single' | 'Married';
      occupation: string;
      createdAt: string; // Assuming it's a string representation of Date
      updatedAt: string; // Assuming it's a string representation of Date
    };
    createdAt?: string; // Assuming it's a string representation of Date
    updatedAt?: string; // Assuming it's a string representation of Date
  }[];
}
