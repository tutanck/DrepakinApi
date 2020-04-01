const { Schema, model, Types } = require('mongoose');

const required = true;

const ExpertCenterRateSchema = new Schema(
  {
    user_id: { required, type: Types.ObjectId, ref: 'User' },
    center_id: { required, type: Types.ObjectId, ref: 'ExpertCenter' },
    value: { required, type: Number, min: 1, max: 5 },
    updated_at: { required, type: Date, default: Date.now },
    changes: [
      {
        value: { required, type: Number, min: 1, max: 5 },
        updated_at: { required, type: Date /* default: never set a default */ },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
  },
);

module.exports = model(
  'ExpertCenter_Rate',
  ExpertCenterRateSchema,
  'expertcenter_rates',
);
