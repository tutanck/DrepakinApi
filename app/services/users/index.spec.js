const { Forbidden } = require('http-errors');
const { now } = require('../../utils/toolbox');
const { paginate } = require('../../utils/pagination');
const User = require('../../models/User');
const {
  list,
  details,
  detailsByGoogleId,
  updateWithGoogleUser,
  revokeAdminRights,
  grantAdminRights,
} = require('./index');
const {
  users,
  googleUser,
} = require('../../../__tests__/utils/users.test-utils');

jest.mock('../../utils/toolbox');
jest.mock('../../utils/pagination');
jest.mock('../../models/User');

describe('list', () => {
  const page = 2,
    perPage = 10,
    query = Promise.resolve(users),
    searchText = 'Joan',
    metas = {
      current_page: page,
      total_count: users.length,
      page_count: Math.ceil(users.length / perPage),
    };

  beforeEach(() => {
    User.find.mockResolvedValue(users);

    paginate.mockResolvedValue({ metas, query });
  });

  it(`
    should find all users;
    then paginate the results;
    `, async () => {
    // call
    const result = await list(page, perPage, searchText);

    // expectations
    expect(User.find).toHaveBeenCalledWith({ $text: { $search: searchText } });
    expect(paginate).toHaveBeenCalledWith(query, page, perPage);
    expect(result).toEqual({ ...metas, items: users });
  });
});

describe('details', () => {
  const user = users[0],
    userId = 'user-id';

  beforeEach(() => {
    User.findById.mockReturnValue({ orFail: async () => user });
  });

  it(`
    should find an user by its id;
    `, async () => {
    // call
    const result = await details(userId);

    // expectations
    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(result).toEqual(user);
  });
});

describe('detailsByGoogleId', () => {
  const user = users[0],
    googleId = 'google-id';

  beforeEach(() => {
    User.findOne.mockResolvedValue(user);
  });

  it(`
    should find an user by its googleId;
    `, async () => {
    // call
    const result = await detailsByGoogleId(googleId);

    // expectations
    expect(User.findOne).toHaveBeenCalledWith({ google_id: googleId });
    expect(result).toEqual(user);
  });
});

describe('updateWithGoogleUser', () => {
  it(`
    should update an user with the google user object;
    `, async () => {
    // call
    await updateWithGoogleUser(googleUser);

    // expectations
    expect(User.updateOne).toHaveBeenCalledWith(
      { google_id: googleUser.google_id },
      { ...googleUser, updated_at: now() },
      { upsert: true },
    );
  });
});

describe('grantAdminRights', () => {
  const user = users[0],
    googleId = 'google-id';

  beforeEach(() => {
    User.findOneAndUpdate.mockReturnValue({
      orFail: async () => ({ ...user, is_admin: true }),
    });
  });

  it(`
    should update an user with is_admin = true;
    `, async () => {
    // call
    const result = await grantAdminRights(googleId);

    // expectations
    expect(User.findOneAndUpdate).toHaveBeenCalledWith(
      { google_id: googleId },
      { is_admin: true },
      { new: true, runValidators: true },
    );
    expect(result).toEqual({ ...user, is_admin: true });
  });
});

describe('revokeAdminRights', () => {
  const user = users[1],
    googleId = 'google-id';

  beforeEach(() => {
    User.findOneAndUpdate.mockReturnValue({
      orFail: async () => ({ ...user, is_admin: false }),
    });
  });

  it(`
    should update an user with is_admin = false;
    `, async () => {
    const sufficientNbAdmins = 2;

    // pre
    User.countDocuments.mockResolvedValue(sufficientNbAdmins);

    // call
    const result = await revokeAdminRights(googleId);

    // expectations
    expect(User.countDocuments).toHaveBeenCalledWith({ is_admin: true });
    expect(User.findOneAndUpdate).toHaveBeenCalledWith(
      { google_id: googleId },
      { is_admin: false },
      { new: true, runValidators: true },
    );
    expect(result).toEqual({ ...user, is_admin: false });
  });

  it(`
    should throw an error when there is one remaininng admin;
    `, async () => {
    const insufficientNbAdmins = 1;

    // pre
    User.countDocuments.mockResolvedValue(insufficientNbAdmins);

    // call
    //const result = await revokeAdminRights(googleId);

    // expectations

    await expect(revokeAdminRights(googleId)).rejects.toThrowError(Forbidden);
    expect(User.countDocuments).toHaveBeenCalledWith({ is_admin: true });
    expect(User.findOneAndUpdate).not.toHaveBeenCalled();
  });
});
