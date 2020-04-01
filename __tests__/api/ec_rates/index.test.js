const app = require('../../../app');
const request = require('supertest');

const {
  connect,
  disconnect,
  clearCollections,
} = require('../../helpers/mongoose');
const { updateRate } = require('../../../app/services/ec_rates');

const { getGoogleUser } = require('../../../app/middlewares/auth-utils');

// Mock Data
const userData = require('../../seeds/user');
const centerData = require('../../seeds/center');

// Helpers
const createCenter = require('../../factories/center');
const createUser = require('../../factories/user');

jest.mock('../../../app/middlewares/auth-utils');

beforeAll(async () => {
  await connect();

  getGoogleUser.mockResolvedValue({ ...userData, sub: userData.google_id });
});

beforeEach(async () => {
  await clearCollections();
});

describe('Rates API', () => {
  test('/rates/unique/by/center/:centerId/by/user/:userId', async () => {
    // Setup
    const rateValue = 2;
    const user = await createUser(userData);
    const savedCenter = await createCenter(centerData);
    const savedRate = await updateRate(savedCenter._id, user._id, rateValue);

    // Endpoint call
    const res = await request(app).get(
      `/rates/unique/by/center/${savedCenter._id}/by/user/${user._id}`,
    );

    const result = res.body;

    // Expectations
    expect(res.statusCode).toEqual(200);
    expect(result.value).toStrictEqual(savedRate.value);
    expect(result.user_id).toStrictEqual('' + user._id); // @see https://github.com/facebook/jest/issues/8475 : '' + force serialization by coercion
    expect(result.center_id).toStrictEqual('' + savedCenter._id); // @see https://github.com/facebook/jest/issues/8475 : '' + force serialization by coercion
  });

  test('/rates/update/by/center/:centerId', async () => {
    // Setup
    const initialRateValue = 3;
    const rateUpdateValue = 5;
    const user = await createUser(userData);
    const savedCenter = await createCenter(centerData);

    // Endpoint call 1
    const res = await request(app)
      .post(`/rates/update/by/center/${savedCenter._id}`)
      .send({ rate: initialRateValue });

    const result1 = res.body;

    // Expectations 1
    expect(res.statusCode).toEqual(200);
    expect(result1.value).toStrictEqual(initialRateValue);
    expect(result1.user_id).toStrictEqual('' + user._id); // @see https://github.com/facebook/jest/issues/8475 : '' + force serialization by coercion
    expect(result1.center_id).toStrictEqual('' + savedCenter._id); // @see https://github.com/facebook/jest/issues/8475 : '' + force serialization by coercion
    expect(result1.updated_at).toBeDefined();

    // Endpoint call 2
    const res2 = await request(app)
      .post(`/rates/update/by/center/${savedCenter._id}`)
      .send({ rate: rateUpdateValue });

    const result2 = res2.body;

    // Expectations 2
    expect(res.statusCode).toEqual(200);
    expect(result2.value).toStrictEqual(rateUpdateValue);
    expect(result2.user_id).toStrictEqual('' + user._id);
    expect(result2.center_id).toStrictEqual('' + savedCenter._id);
    expect(result2.updated_at).toBeDefined();
  });

  test('/rates/average/by/center/:centerId', async () => {
    // Setup
    const user1 = await createUser(userData);
    const user2 = await createUser(userData);
    const savedCenter = await createCenter(centerData);
    const rateValue1 = 3,
      rateValue2 = 4,
      expectedRateAverage = 3.5;
    await updateRate(savedCenter._id, user1._id, rateValue1);
    await updateRate(savedCenter._id, user2._id, rateValue2);

    // Endpoint call
    const res = await request(app).get(
      `/rates/average/by/center/${savedCenter._id}`,
    );

    const result = res.body;

    // Expectations
    expect(res.statusCode).toEqual(200);
    expect(result).toStrictEqual(expectedRateAverage);
  });

  test('/rates/centers/near/:lng/:lat when there is no rate', async () => {
    // Setup
    const savedCenter = await createCenter(centerData);

    // Endpoint call
    const res = await request(app).get(
      `/rates/average/by/center/${savedCenter._id}`,
    );

    const result = res.body;

    // Expectations
    expect(result).toBeNull();
  });
});

afterAll(async () => {
  await disconnect();
});
