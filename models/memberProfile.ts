import mongoose, { Document, Schema } from 'mongoose';

// Define the ProfileInput schema type
interface ProfileInput {
  label: string;
  value: string;
}

// Define the MemberProfile schema type
interface MemberProfileModel extends Document {
  labelvalue: string;
  inputvalue: string;
  imageurl: string;
  memberGroupStatus: boolean;
  categoryStatus: boolean;
  isFounder: boolean;
  isLeadPastor: boolean;
  name: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  maritalStatus: 'Single' | 'Married' | 'Widowed' | 'Divorced';
  occupation: string;
  profileInputs: ProfileInput[];
  groupid: mongoose.Schema.Types.ObjectId[];
  categoryid: mongoose.Schema.Types.ObjectId[];
}

// Define the ProfileInput schema
const ProfileInputSchema = new Schema<ProfileInput>({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  }
}, { _id: false });

// Define the MemberProfile schema
const MemberProfileSchema = new Schema<MemberProfileModel>({
  labelvalue: String,
  inputvalue: String,
  imageurl: String,
  memberGroupStatus: { type: Boolean, default: false },
  categoryStatus: { type: Boolean, default: false },
  isFounder: { type: Boolean, default: false },
  isLeadPastor: { type: Boolean, default: false },
  name: { type: String, required: true },
  dateOfBirth: {
    type: String,   
    required: true,
    validate: {
      validator: function (v: string) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: (props: { value: any; }) => `${props.value} is not a valid date format! Use YYYY-MM-DD.`
    }
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  maritalStatus: {
    type: String,
    required: true,
    enum: ['Single', 'Married', 'Widowed', 'Divorced']
  },
  occupation: { type: String },
  profileInputs: {
    type: [ProfileInputSchema],
    default: [],
    validate: {
      validator: function (v: { label: any; }[]) {
        // Check for duplicate labels
        const labels = v.map((input: { label: any; }) => input.label);
        return labels.length === new Set(labels).size;
      },
      message: 'Profile inputs must have unique labels.'
    }
  },
  groupid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MemberGroup' }],
  categoryid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
}, { timestamps: true });

const MemberProfile = mongoose.models.MemberProfile || mongoose.model<MemberProfileModel>('MemberProfile', MemberProfileSchema);

export default MemberProfile;    
