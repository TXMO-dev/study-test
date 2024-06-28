import mongoose from "mongoose";
import { MemberProfileRequestBody } from "../../memberProfiles/types/MemberProfileRequestBody";
import { CategoryRequestBody } from "../../categories/types/CategoryRequestBody";

export interface IMemberGroup {
    success: boolean;
    message: string;
    data: {
      _id: mongoose.Types.ObjectId;
      groupName: string;
      members: MemberProfileRequestBody[];
      categoryid: CategoryRequestBody;
      leader: MemberProfileRequestBody;
      createdAt: Date;
      updatedAt: Date;
    };
  }  

export interface IMemberGroups {
    success: boolean;
    message: string;
    data: {
      _id: mongoose.Types.ObjectId;
      groupName: string;
      members: MemberProfileRequestBody[];
      categoryid: CategoryRequestBody;
      leader: MemberProfileRequestBody;
      createdAt: Date;
      updatedAt: Date;
    }[];
}  