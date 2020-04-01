const ExpertCenter = require('../../models/ExpertCenter');
const { enrichEc, enrichEcList } = require('./enrich');
const { averageByCenter, uniqueByCenter_User } = require('../ec_rates');
const { centers } = require('../../../__tests__/utils/centers.test-utils');

jest.mock('../ec_rates');
jest.mock('../../models/ExpertCenter');

const userId = 'user-id',
  userRate = 4,
  averageRate = 3.4,
  ratesCount = 332,
  commentsCount = 159,
  center = centers[0];

beforeEach(() => {
  averageByCenter.mockResolvedValue(averageRate);

  uniqueByCenter_User.mockResolvedValue({ value: userRate });

  const ecWithCommentsCount = { ...center, comments_count: commentsCount };

  ExpertCenter.populate.mockResolvedValueOnce(ecWithCommentsCount);

  const ecWithRatesCount = { ...ecWithCommentsCount, rate_count: ratesCount };

  ExpertCenter.populate.mockResolvedValueOnce(ecWithRatesCount);
});

describe('enrichEc', () => {
  it(`
    should enrich a center with its : 
      - average rate,
      - connected user's rate, 
      - comments count 
      - rates count
    ;
    `, async () => {
    // call
    const result = await enrichEc(userId)(center, false);

    // expectations
    expect(averageByCenter).toHaveBeenCalledWith(center._id);
    expect(uniqueByCenter_User).toHaveBeenCalledWith(center._id, userId, true);
    expect(ExpertCenter.populate.mock.calls.length).toBe(2);
    expect(ExpertCenter.populate).toHaveBeenCalledWith(
      center,
      'comments_count',
    );
    expect(ExpertCenter.populate).toHaveBeenCalledWith(
      { ...center, comments_count: commentsCount },
      'rates_count',
    );
    expect(result).toEqual({
      ...center,
      user_rate: userRate,
      rate_count: ratesCount,
      comments_count: commentsCount,
      average_rate: averageRate,
    });
  });
});

describe('enrichEcList', () => {
  it(`
    should enrich all centers with their respective : 
      - average rate,
      - connected user's rate, 
      - comments count 
      - rates count
    ;
    `, async () => {
    // call
    const result = await enrichEcList(userId)(centers, false);

    // expectations
    expect(result).toEqual(
      centers.map(center => ({
        ...center,
        user_rate: userRate,
        rate_count: ratesCount,
        comments_count: commentsCount,
        average_rate: averageRate,
      })),
    );
  });
});
