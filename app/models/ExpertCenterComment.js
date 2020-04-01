const { Schema, model, Types } = require('mongoose');

const required = true;

const ExpertCenterCommentSchema = new Schema(
  {
    center_id: { required, type: Types.ObjectId, ref: 'ExpertCenter' },
    author: { required, type: Types.ObjectId, ref: 'User' },
    updated_at: { required, type: Date, default: Date.now },
    text: { required, type: String, trim: true, minlength: 1 },
  },
  {
    toJSON: { virtuals: true },
  },
);

ExpertCenterCommentSchema.virtual('author_center_rate', {
  ref: 'ExpertCenter_Rate',
  localField: 'author',
  foreignField: 'user_id',
  justOne: true,
});

module.exports = model(
  'ExpertCenter_Comment',
  ExpertCenterCommentSchema,
  'expertcenter_comments',
);
