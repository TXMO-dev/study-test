import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  categoryName: {type: String, unique: true, required: true},
  memberGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MemberGroup' }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MemberProfile' }],
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'MemberProfile' }, // Assuming one leader per category
  description: {type: String, unique: true, required: true}
},{timestamps: true}); 

const CategoryModel = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export default CategoryModel;