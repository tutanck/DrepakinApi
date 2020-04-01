const app = require('../../../app');
const request = require('supertest');

const {
  connect,
  disconnect,
  clearCollections,
} = require('../../helpers/mongoose');

const { getGoogleUser } = require('../../../app/middlewares/auth-utils');
const ExpertCenter = require('../../../app/models/ExpertCenter');

// Mock Data
const userData = require('../../seeds/user');
const centerData = require('../../seeds/center');

// Helpers
const createUser = require('../../factories/user');
const createRate = require('../../factories/rate');
const createComment = require('../../factories/comment');
const createCenter = require('../../factories/center');

jest.mock('../../../app/middlewares/auth-utils');

// Connect to database
beforeAll(async () => {
  await connect();

  getGoogleUser.mockResolvedValue({ ...userData, sub: userData.google_id });
});

// Empty collections
beforeEach(async () => {
  await clearCollections();
});

describe('Centers API', () => {
  test('/centers/list', async () => {
    // Setup
    const nbCenters = 12,
      page = 1,
      perPage = 5;

    for (let i = 0; i < nbCenters; i++) {
      await createCenter(centerData);
    }

    // Endpoint call
    const res = await request(app).get(
      `/centers/list?page=${page}&perPage=${perPage}`,
    );

    const result = res.body;

    // Expectations
    expect(res.statusCode).toEqual(200);

    const center1 = result.items[0];
    const center2 = result.items[1];

    expect(center1).toMatchObject(centerData);
    expect(center2).toMatchObject(centerData);

    // Pagination
    expect(result.current_page).toEqual(1);
    expect(result.total_count).toEqual(nbCenters);
    expect(result.page_count).toEqual(3);

    // Centers properties
    expect(center1.comments_count).toEqual(0);
    expect(center1.rates_count).toEqual(0);

    expect(center1).toHaveProperty('_id');
    expect(center1).toHaveProperty('user_rate');
    expect(center1).toHaveProperty('average_rate');

    expect(center1.infos.updated_at).toBeDefined();
    expect(center1._id).not.toEqual(center2._id);
  });

  test('/centers/details/by/:id', async () => {
    // Setup
    const user = await createUser(userData);

    const savedCenter = await createCenter(centerData);

    const userRate = await createRate({
      user_id: user._id,
      center_id: savedCenter._id,
      value: 2,
    });

    await createComment({
      author: user._id,
      center_id: savedCenter._id,
      text: 'New Comment',
    });

    // Endpoint call
    const res = await request(app).get(
      `/centers/details/by/${savedCenter._id}`,
    );

    const result = res.body;

    // Expectations
    expect(res.statusCode).toEqual(200);

    expect(result._id).toStrictEqual('' + savedCenter._id); // @see https://github.com/facebook/jest/issues/8475 : '' + force serialization by coercion
    expect(result).toMatchObject(centerData);

    // Check enrich properties
    expect(result.comments_count).toEqual(1);
    expect(result.rates_count).toEqual(1);
    expect(result.user_rate).toEqual(userRate.value);
    expect(result.average_rate).toEqual(userRate.value);
  });

  test('/centers/admin/details/by/:id', async () => {
    // Setup
    const savedCenter = await createCenter(centerData);
    await createUser(userData); // Otherwise current user would be unauthorised

    // Endpoint call
    const res = await request(app).get(
      `/centers/admin/details/by/${savedCenter._id}`,
    );

    const result = res.body;

    // Expectations
    expect(res.statusCode).toEqual(200);
    expect(result).toMatchObject(centerData);
    expect(result).not.toHaveProperty('_id');
    expect(result).not.toHaveProperty('__v');
    expect(result).not.toHaveProperty('comments_count');
    expect(result).not.toHaveProperty('rates_count');
    expect(result).not.toHaveProperty('user_rate');
    expect(result).not.toHaveProperty('average_rate');
  });

  test('/centers/admin/new', async () => {
    // Setup
    const user = await createUser(userData);

    // Endpoint call
    const res = await request(app)
      .post('/centers/admin/new')
      .send({ ...centerData });

    const result = res.body;

    // Expectations
    expect(res.statusCode).toEqual(201);

    expect(result).toMatchObject(centerData);

    // Check enrich properties
    expect(result.infos.updated_at).toBeDefined();
    expect(result.infos.updated_by).toBe('' + user._id); // @see https://github.com/facebook/jest/issues/8475 : '' + force serialization by coercion
  });

  test('/centers/admin/update/:id', async () => {
    // Setup
    const user = await createUser(userData);
    const savedCenter = await createCenter(centerData);
    const newCountry = 'Bénin';
    const newCenter = { ...centerData, country: newCountry };

    // Endpoint call
    const res = await request(app)
      .put(`/centers/admin/update/${savedCenter.id}`)
      .send({ ...newCenter });

    const result = res.body;

    // Expectations
    expect(res.statusCode).toEqual(201);

    expect(result).toMatchObject({
      ...centerData,
      country: newCountry.toUpperCase(),
    });

    // Check enrich properties
    expect(result.infos.updated_at).toBeDefined();
    expect(result.infos.updated_by).toStrictEqual('' + user._id); // @see https://github.com/facebook/jest/issues/8475 : '' + force serialization by coercion
    expect(result.country).toBe(newCountry.toUpperCase());
  });

  test('/centers/near/:lng/:lat', async () => {
    // Setup
    const nbCenters = 12,
      longitude = 28.939803,
      latitude = 41.003979;

    await ExpertCenter.collection.createIndex({ location: '2dsphere' });

    for (let i = 0; i < nbCenters; i++) {
      await createCenter(centerData);
    }

    // Endpoint call
    const res = await request(app).get(
      `/centers/near/${longitude}/${latitude}`,
    );

    const result = res.body;

    // Expectations
    expect(res.statusCode).toEqual(200);

    const center1 = result.items[0];
    const center2 = result.items[1];

    expect(center1).toMatchObject(centerData);
    expect(center2).toMatchObject(centerData);

    // Pagination
    expect(result.current_page).toEqual(1);
    expect(result.total_count).toEqual(nbCenters);
    expect(result.page_count).toEqual(3);

    // Centers properties
    expect(center1.comments_count).toEqual(0);
    expect(center1.rates_count).toEqual(0);

    expect(center1).toHaveProperty('_id');
    expect(center1).toHaveProperty('user_rate');
    expect(center1).toHaveProperty('average_rate');

    expect(center1.infos.updated_at).toBeDefined();
    expect(center1._id).not.toEqual(center2._id);
  });
});

afterAll(async () => {
  await disconnect();
});
