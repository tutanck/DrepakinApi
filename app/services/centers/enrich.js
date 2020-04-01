const ExpertCenter = require('../../models/ExpertCenter');
const { averageByCenter, uniqueByCenter_User } = require('../ec_rates');

const enrichEc = userId => async (ec, toJSON = true) => {
  const averageRate = await averageByCenter(ec.id);

  const userRate = await uniqueByCenter_User(ec.id, userId, true);

  const ecWithCommentsCount = await ExpertCenter.populate(ec, 'comments_count');
  const ecWithRatesCount = await ExpertCenter.populate(
    ecWithCommentsCount,
    'rates_count',
  );

  const center = toJSON === true ? ecWithRatesCount.toJSON() : ecWithRatesCount; // TODO better ? (where and when to use toJSON the best way ?)

  const richEc = {
    ...center,
    average_rate: averageRate,
    user_rate: userRate && userRate.value,
  };

  return richEc;
};

const enrichEcList = userId => async (ecList, toJSON = true) => {
  return Promise.all(ecList.map(ec => enrichEc(userId)(ec, toJSON)));
};

module.exports = { enrichEc, enrichEcList };
