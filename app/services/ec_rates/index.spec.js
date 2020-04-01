const { Types } = require('mongoose');
const { now } = require('../../utils/toolbox');
const ExpertCenter = require('../../models/ExpertCenter');
const ExpertCenterRate = require('../../models/ExpertCenterRate');
const { uniqueByCenter_User, updateRate, averageByCenter } = require('./index');
const { rates } = require('../../../__tests__/utils/rates.test-utils');
const { centers } = require('../../../__tests__/utils/centers.test-utils');

jest.mock('../../utils/toolbox');
jest.mock('../../utils/pagination');
jest.mock('../../models/ExpertCenter');
jest.mock('../../models/ExpertCenterRate');

const center = centers[0],
  centerId = 'center-id',
  userId = 'user-id',
  rate = rates[0];

beforeEach(() => {
  ExpertCenter.findById.mockReturnValue({ orFail: async () => center });

  const updatedAt = '2020-03-24T02:27:23.787Z';
  now.mockReturnValue(updatedAt);
});

describe('uniqueByCenter_User', () => {
  beforeEach(() => {
    ExpertCenterRate.findOne.mockResolvedValue(rate);
  });

  it(`
    should find a rate for a center and an user; 
    `, async () => {
    // call
    const result = await uniqueByCenter_User(centerId, userId, true);

    // expectations
    expect(ExpertCenter.findById).toHaveBeenCalledWith(centerId);
    expect(ExpertCenterRate.findOne).toHaveBeenCalledWith({
      center_id: center._id,
      user_id: userId,
    });
    expect(result).toEqual(rate);
  });
});

describe('updateRate', () => {
  const newRateValue = 3,
    oldRateObject = rate,
    changes = {
      changes: {
        value: oldRateObject.value,
        updated_at: oldRateObject.updated_at,
      },
    };

  beforeEach(() => {
    ExpertCenterRate.findOneAndUpdate.mockResolvedValue({
      value: newRateValue,
      user_id: userId,
      center_id: centerId,
      updated_at: now(),
      ...changes,
    });
  });

  it(`
    should update the rate for a center and an user with information like 
    'changes' that includes the 'new value of the rate' and the 'update date';
    `, async () => {
    const newRateObject = {
      value: newRateValue,
      user_id: userId,
      center_id: centerId,
      updated_at: now(),
    };

    // call
    const result = await updateRate(centerId, userId, newRateValue);

    // expectations
    expect(ExpertCenterRate.findOneAndUpdate).toHaveBeenCalledWith(
      { center_id: centerId, user_id: userId },
      { ...newRateObject, $push: { ...changes } },
      { new: true, upsert: true, runValidators: true },
    );
    expect(result).toEqual({ ...newRateObject, ...changes });
  });
});

describe('averageByCenter', () => {
  const averageRate = 2.6,
    aggregationResult = [{ rate: averageRate }];

  beforeEach(() => {
    ExpertCenterRate.aggregate.mockResolvedValue(aggregationResult);
  });

  it(`
    should calculate the average rate for a center;
    `, async () => {
    // call
    const result = await averageByCenter(centerId);

    // expectations
    expect(ExpertCenter.findById).toHaveBeenCalledWith(centerId);
    expect(ExpertCenterRate.aggregate).toHaveBeenCalledWith([
      { $match: { center_id: new Types.ObjectId(center._id) } },
      {
        $group: {
          _id: '$center_id',
          rate: { $avg: '$value' },
        },
      },
    ]);
    expect(result).toEqual(averageRate);
  });
});
