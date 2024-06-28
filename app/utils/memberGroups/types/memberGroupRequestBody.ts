import mongoose, { ObjectId } from 'mongoose';

export interface MemberGroupRequestBody {
  groupName: string;
  members?: mongoose.Types.ObjectId[] | string[] ;
  categoryid?: ObjectId;
  leader?: mongoose.Types.ObjectId;
}
