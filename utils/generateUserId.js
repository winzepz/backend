const User = require('../models/User');

const generateUniqueUserId = async () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 8;

  let userId;
  let isUnique = false;

  while (!isUnique) {
    userId = '';
    for (let i = 0; i < length; i++) {
      userId += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const existingUser = await User.findOne({ userId });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return userId;
};

module.exports = generateUniqueUserId;
