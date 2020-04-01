const Comment = require('../../app/models/ExpertCenterComment');

module.exports = async props => {
  const validModel = new Comment(props);
  const savedModel = await validModel.save();

  return savedModel;
};
