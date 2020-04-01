const { Types } = require('mongoose');
const { now } = require('../../utils/toolbox');
const ExpertCenter = require('../../models/ExpertCenter');
const ExpertCenterRate = require('../../models/ExpertCenterRate');

const uniqueByCenter_User = async (centerId, userId, softReturn = false) => {
  const ec = await ExpertCenter.findById(centerId).orFail();

  const rate = ExpertCenterRate.findOne({
    center_id: ec.id,
    user_id: userId,
  });

  return softReturn ? rate : rate.orFail();
};

const updateRate = async (centerId, userId, rate) => {
  const oldRate = await uniqueByCenter_User(centerId, userId, true);

  const newRate = {
    value: rate,
    user_id: userId,
    center_id: centerId,
    updated_at: now(),
  };

  const toFind = { center_id: centerId, user_id: userId };

  const toStore = oldRate
    ? {
        ...newRate,
        $push: {
          changes: { value: oldRate.value, updated_at: oldRate.updated_at },
        },
      }
    : newRate;

  return ExpertCenterRate.findOneAndUpdate(toFind, toStore, {
    new: true,
    upsert: true,
    runValidators: true,
  });
};

const averageByCenter = async centerId => {
  const ec = await ExpertCenter.findById(centerId).orFail();

  const agg = await ExpertCenterRate.aggregate([
    { $match: { center_id: new Types.ObjectId(ec.id) } },
    {
      $group: {
        _id: '$center_id',
        rate: { $avg: '$value' },
      },
    },
  ]);

  const average = agg[0] ? agg[0].rate : null;

  return average;
};

module.exports = { uniqueByCenter_User, updateRate, averageByCenter };
