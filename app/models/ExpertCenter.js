const { Schema, model, Types } = require('mongoose');

const required = true;

const ExpertCenterSchema = new Schema(
  {
    country: { required, type: String, trim: true, uppercase: true },
    region: { required, type: String, trim: true, lowercase: true },
    city: { required, type: String, trim: true, lowercase: true },
    hospital: { required, type: String, trim: true },
    name: { required, type: String, trim: true },
    name_en: { required, type: String, trim: true },
    address: { required, type: String, trim: true },
    consultation_managers: { type: [String], default: [] },
    phones: { type: [String], default: [] },
    for_children: { type: Boolean },
    for_adults: { type: Boolean },
    genetic_advice: { type: Boolean },
    specialized_consultation: { type: Boolean },
    officially_designated_center: { type: Boolean },
    ern_member: { type: Boolean },
    website: { type: String, trim: true, lowercase: true },
    location: {
      type: { required, type: String, trim: true },
      coordinates: { required, type: [Number] },
    },
    meta: {
      place: {
        formattedAddress: { required, type: String, trim: true },
        latitude: { required, type: Number },
        longitude: { required, type: Number },
        extra: {
          googlePlaceId: { required, type: String, trim: true },
          confidence: { required, type: Number },
          types: { type: [String], default: [] },
        },
        streetNumber: { type: String, trim: true },
        streetName: { type: String, trim: true },
        city: { required, type: String, trim: true },
        country: { required, type: String, trim: true },
        countryCode: { required, type: String, trim: true },
        zipcode: { type: String, trim: true },
        provider: { required, type: String, trim: true },
      },
    },
    infos: {
      updated_at: { required, type: Date, default: Date.now },
      updated_by: { type: Types.ObjectId, ref: 'User' },
    },
  },
  {
    toJSON: { virtuals: true },
  },
);

ExpertCenterSchema.virtual('comments_count', {
  ref: 'ExpertCenter_Comment',
  localField: '_id',
  foreignField: 'center_id',
  count: true,
});

ExpertCenterSchema.virtual('rates_count', {
  ref: 'ExpertCenter_Rate',
  localField: '_id',
  foreignField: 'center_id',
  count: true,
});

module.exports = model('ExpertCenter', ExpertCenterSchema, 'expertcenters');
