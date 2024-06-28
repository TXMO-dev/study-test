import mongoose from 'mongoose';

const MemberGroupSchema = new mongoose.Schema({
  groupName: { type: String, required: true, unique: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MemberProfile' }],  // Removed unique: true
  categoryid: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  leader: { type: mongoose.Types.ObjectId, ref: 'MemberProfile' },
}, { timestamps: true });

// Pre-save hook to remove duplicate members
MemberGroupSchema.pre('save', function(next) {
  this.members = this.members.filter((member, index, self) =>
    index === self.findIndex((m) => m.equals(member))
  );
  next();
});

const MemberGroup = mongoose.models.MemberGroup || mongoose.model('MemberGroup', MemberGroupSchema);
export default MemberGroup;  
