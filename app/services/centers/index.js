const { enrichEc, enrichEcList } = require('./enrich');
const { paginate } = require('../../utils/pagination');
const ExpertCenter = require('../../models/ExpertCenter');
const { now } = require('../../utils/toolbox');

const list = async (page = 1, perPage = 5, userId) => {
  const baseQuery = ExpertCenter.find();

  const { metas, query } = await paginate(baseQuery, page, perPage);

  const ecList = await query;
  const enrichedEcList = await enrichEcList(userId)(ecList);

  return {
    ...metas,
    items: enrichedEcList,
  };
};

const details = async (id, userId) => {
  const ec = await ExpertCenter.findById(id).orFail();

  const richEc = enrichEc(userId)(ec);
  return richEc;
};

const adminDetails = async id => {
  const ec = await ExpertCenter.findById(id)
    .orFail()
    .lean();

  delete ec._id;
  delete ec.__v;

  return ec;
};

const near = async (lng, lat, pageParam = 1, perPageParam = 5, userId) => {
  const page = Number(pageParam);
  const perPage = Number(perPageParam);

  const geoNearStage = {
    $geoNear: {
      key: 'location',
      spherical: true,
      distanceMultiplier: 0.001, // from meter to kilometer
      distanceField: 'dist.calculated',
      near: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
    },
  };

  const countResults = await ExpertCenter.aggregate([
    geoNearStage,
    { $count: 'documentsCount' },
  ]);

  const { documentsCount } = countResults[0];

  const ecList = await ExpertCenter.aggregate([
    geoNearStage,
    { $skip: page > 0 ? (page - 1) * perPage : 0 },
    { $limit: perPage },
    { $addFields: { id: '$_id' } },
  ]);

  const enrichedEcList = await enrichEcList(userId)(ecList, false);

  return {
    total_count: documentsCount,
    current_page: documentsCount > 0 ? page : 1,
    page_count: documentsCount > 0 ? Math.ceil(documentsCount / perPage) : 1,
    items: enrichedEcList,
  };
};

const create = async (userId, center) => {
  return ExpertCenter.create({
    ...center,
    infos: { updated_at: now(), updated_by: userId },
  });
};

const update = async (centerId, userId, center) => {
  const toFind = { _id: centerId };

  const toStore = {
    ...center,
    infos: { updated_at: now(), updated_by: userId },
  };

  return ExpertCenter.findOneAndUpdate(toFind, toStore, {
    new: true,
    runValidators: true,
  }).orFail();
};

module.exports = { list, details, adminDetails, near, create, update };
