const User = require('../../app/models/User');

module.exports = async props => {
  const validModel = new User(props);
  const savedModel = await validModel.save();

  return savedModel;
};
