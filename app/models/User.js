const { Schema, model } = require('mongoose');

const required = true;

const UserSchema = new Schema({
  google_id: { required, type: String },
  email: { required, type: String },
  name: { required, type: String },
  given_name: { required, type: String },
  family_name: { required, type: String },
  locale: { required, type: String },
  picture: { required, type: String },
  created_at: { required, type: Date },
  updated_at: { required, type: Date, default: Date.now },
  is_admin: { type: Boolean },
});

UserSchema.index({
  email: 'text',
  name: 'text',
});

module.exports = model('User', UserSchema, 'users');
