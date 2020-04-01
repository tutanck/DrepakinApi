const app = require('../../../app');
const request = require('supertest');

const {
  connect,
  disconnect,
  clearCollections,
} = require('../../helpers/mongoose');

const { addByCenter } = require('../../../app/services/ec_comments');

const { getGoogleUser } = require('../../../app/middlewares/auth-utils');

// Mock Data
const userData = require('../../seeds/user');
const centerData = require('../../seeds/center');

// Helpers
const createUser = require('../../factories/user');
const createCenter = require('../../factories/center');

jest.mock('../../../app/middlewares/auth-utils');

beforeAll(async () => {
  await connect();

  getGoogleUser.mockResolvedValue({ ...userData, sub: userData.google_id });
});

beforeEach(async () => {
  await clearCollections();
});

describe('Comments API', () => {
  test('/comments/list/by/center/:centerId', async () => {
    // Setup
    const user = await createUser(userData);
    const savedCenter = await createCenter(centerData);
    const commentText = 'Hello';
    await addByCenter(savedCenter._id, user._id, commentText);

    // Endpoint call
    const res = await request(app).get(
      `/comments/list/by/center/${savedCenter._id}`,
    );

    const result = res.body;

    // Expectations
    expect(result.current_page).toEqual(1);
    expect(result.total_count).toEqual(1);
    expect(result.page_count).toEqual(1);
    expect(result.items.length).toEqual(1);
    expect(result.items[0].text).toBe(commentText);
    expect(result.items[0].author._id).toStrictEqual('' + user._id); // @see https://github.com/facebook/jest/issues/8475 : '' + force serialization by coercion
  });

  test('/comments/add/by/:centerId', async () => {
    // Setup
    const user = await createUser(userData);
    const savedCenter = await createCenter(centerData);
    const commentText = 'Hello';

    // Endpoint call
    const res = await request(app)
      .post(`/comments/add/by/${savedCenter._id}`)
      .send({ text: commentText });

    const result = res.body;

    // Expectations
    expect(result.center_id).toEqual('' + savedCenter._id); // @see https://github.com/facebook/jest/issues/8475 : '' + force serialization by coercion
    expect(result.author).toEqual('' + user._id); // @see https://github.com/facebook/jest/issues/8475 : '' + force serialization by coercion
    expect(result.text).toEqual(commentText);
    expect(result.updated_at).toBeDefined();
  });
});

afterAll(async () => {
  await disconnect();
});
