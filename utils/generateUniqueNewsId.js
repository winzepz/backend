const path = require('path');
const News = require(path.resolve(__dirname, '../models/News'));


const generateUniqueNewsId = async () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 8;

  let newsId;
  let isUnique = false;

  while (!isUnique) {
    newsId = '';
    for (let i = 0; i < length; i++) {
      newsId += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const existingNews = await News.findOne({ newsId });
    if (!existingNews) {
      isUnique = true;
    }
  }

  return newsId;
};

module.exports = generateUniqueNewsId;
