const app = require('../../../app');
const request = require('supertest');

const {
  connect,
  disconnect,
  clearCollections,
} = require('../../helpers/mongoose');

const { getGoogleUser } = require('../../../app/middlewares/auth-utils');

// Mock Data
const userData = require('../../seeds/user');
const user2Data = require('../../seeds/user2');
const user3Data = require('../../seeds/user3');

// Helpers
const createUser = require('../../factories/user');

jest.mock('../../../app/middlewares/auth-utils');

beforeAll(async () => {
  await connect();

  getGoogleUser.mockResolvedValue({ ...userData, sub: userData.google_id });
});

beforeEach(async () => {
  await clearCollections();
});

describe('Users API', () => {
  test('/users/login', async () => {
    // Setup
    const savedUser = await createUser(userData);

    // Endpoint call
    const res = await request(app).post(`/users/login`);

    const result = res.body;

    // Expectations
    expect(res.statusCode).toEqual(200);
    expect(result._id).toStrictEqual('' + savedUser._id); // @see https://github.com/facebook/jest/issues/8475 : '' + force serialization by coercion
    expect(result).toMatchObject(userData);
  });

  test('/users/:id/is_admin --post', async () => {
    // Setup
    await createUser(userData);
    const savedUser2 = await createUser(user2Data);

    // Endpoint call
    const res = await request(app).post(
      `/users/${savedUser2.google_id}/is_admin`,
    );

    const result = res.body;

    // Expectations
    expect(res.statusCode).toEqual(200);
    expect(result._id).toStrictEqual('' + savedUser2._id); // @see https://github.com/facebook/jest/issues/8475 : '' + force serialization by coercion
    expect(result).toMatchObject({ ...user2Data, is_admin: true });
  });

  test('/users/:id/is_admin --delete', async () => {
    // Setup
    await createUser(userData);
    await createUser(user2Data);
    const savedUser3 = await createUser(user3Data);

    // Endpoint call
    const res = await request(app).delete(
      `/users/${savedUser3.google_id}/is_admin`,
    );

    const result = res.body;

    // Expectations
    expect(res.statusCode).toEqual(200);
    expect(result._id).toStrictEqual('' + savedUser3._id); // @see https://github.com/facebook/jest/issues/8475 : '' + force serialization by coercion
    expect(result).toMatchObject({ ...user3Data, is_admin: false });
  });

  test('/users/:id/is_admin --delete-last-admin', async () => {
    // Setup
    const savedUser = await createUser(userData);

    // Endpoint call
    const res = await request(app).delete(
      `/users/${savedUser.google_id}/is_admin`,
    );

    const result = res.body;

    // Expectations
    expect(res.statusCode).toEqual(403);
    expect(result).toMatchObject({
      error: {
        message: 'Last admin deletion forbiden',
      },
    });
  });
});

afterAll(async () => {
  await disconnect();
});
