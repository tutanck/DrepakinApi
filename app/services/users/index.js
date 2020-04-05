const { Forbidden } = require('http-errors');
const User = require('../../models/User');
const { now } = require('../../utils/toolbox');
const { paginate } = require('../../utils/pagination');

const list = async (page = 1, perPage = 5, search) => {
  const baseQuery = User.find(
    search ? { $text: { $search: search } } : undefined,
  );

  const { metas, query } = await paginate(baseQuery, page, perPage, {
    updated_at: -1,
  });

  const users = await query;

  return {
    ...metas,
    items: users,
  };
};

const details = async id => {
  const user = User.findById(id).orFail();
  return user;
};

const detailsByGoogleId = async googleId => {
  const user = User.findOne({ google_id: googleId });
  return user;
};

const updateWithGoogleUser = async googleUser => {
  const updateStatus = User.updateOne(
    { google_id: googleUser.google_id },
    { ...googleUser, updated_at: now() },
    { upsert: true },
  );
  return updateStatus;
};

const grantAdminRights = async googleId => {
  const updatedUser = User.findOneAndUpdate(
    { google_id: googleId },
    { is_admin: true },
    { new: true, runValidators: true },
  ).orFail();
  return updatedUser;
};

const revokeAdminRights = async googleId => {
  const nbAdmins = await User.countDocuments({ is_admin: true });

  if (nbAdmins === 1) {
    throw new Forbidden('Last admin deletion forbiden');
  }

  const updatedUser = User.findOneAndUpdate(
    { google_id: googleId },
    { is_admin: false },
    { new: true, runValidators: true },
  ).orFail();
  return updatedUser;
};

module.exports = {
  list,
  details,
  detailsByGoogleId,
  updateWithGoogleUser,
  revokeAdminRights,
  grantAdminRights,
};
