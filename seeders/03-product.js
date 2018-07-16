const db = require('./../models');

const { Op } = db.Sequelize;

module.exports = {
  up: async () => {
    const product1 = await db.product.bulkCreate([{
      name: 'Lightweight Taekwondo Uniform',
      price: 17.95,
      description: 'Our lightest taekwondo uniform, the lightweight taekwondo uniform is the standard uniform required for most classes.',
      image: 'https://www.karatemart.com/images/products/large/lightweight-taekwondo-uniform-8453700.jpg',
      category_id: '97f62094-cead-4017-ad8f-6195fca231af',
    },{
      name: 'Aluminum Dragon Fan',
      price: 39.95,
      description: 'Fighting fans are a very popular weapon due to their beauty and ability to surprise an opponent with their unsuspected look. They also make an excellent choice in tournament weapons demos due to their ability to adapt to any kata. This beautifully designed dragon fan is made from Aluminum with nylon taffeta cloth. It is 13" long when folded and weighs approximately 1 pound.',
      image: 'https://www.karatemart.com/images/products/large/aluminum-dragon-fan-8721059.jpg',
      category_id: '31f48685-665b-44bc-92ab-0cfe1a2f1788',
    },{
      name: 'Ninja Face Mask',
      price: 3.95,
      description: 'What\'s a ninja without a Ninja Face Mask? Exposed! Don\'t let your years of dedication to the craft of ninjutsu go to waste by forgetting to cover your face and revealing your identity.',
      image: 'https://www.karatemart.com/images/products/large/ninja-face-mask-5417600.jpg',
      category_id: '16986708-b0ff-48b0-a109-3327d3f41e4d',
    }]);

    return true;
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('credits');
  },
};