const Rate = require('../../app/models/ExpertCenterRate');

module.exports = async props => {
  const validModel = new Rate(props);
  const savedModel = await validModel.save();

  return savedModel;
};
