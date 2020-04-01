const ExpertCenter = require('../../app/models/ExpertCenter');

module.exports = async props => {
  const validModel = new ExpertCenter(props);
  const savedModel = await validModel.save();

  return savedModel;
};
