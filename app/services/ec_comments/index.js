const ExpertCenter = require('../../models/ExpertCenter');
const ExpertCenterComment = require('../../models/ExpertCenterComment');
const { paginate } = require('../../utils/pagination');
const { now } = require('../../utils/toolbox');

const listByCenter = async (centerId, page = 1, perPage = 5) => {
  const ec = await ExpertCenter.findById(centerId).orFail();

  const baseQuery = ExpertCenterComment.find({
    center_id: ec.id,
  });

  const { metas, query } = await paginate(baseQuery, page, perPage, {
    updated_at: -1,
  });

  const comments = await query
    .populate({ path: 'author', select: 'name picture' })
    .populate({
      path: 'author_center_rate',
      match: { center_id: ec.id },
      select: 'value -_id',
    });

  return {
    ...metas,
    items: comments,
  };
};

const addByCenter = async (centerId, userId, text) => {
  const ec = await ExpertCenter.findById(centerId).orFail();

  return ExpertCenterComment.create({
    center_id: ec.id,
    author: userId,
    updated_at: now(),
    text: text,
  });
};

module.exports = { listByCenter, addByCenter };
