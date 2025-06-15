'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Note: This seeder uses placeholder UUIDs. You might need to generate them.
    await queryInterface.bulkInsert('Ootds', [
      {
        id: Sequelize.literal('UUID()'),
        namaOutfit: 'Casual Weekend Look',
        deskripsi: 'A comfortable and stylish outfit for a relaxing weekend.',
        imageId: 'sample-image-1.jpg', // Make sure this image exists in /uploads
        userId: 1, // Assumes a user with ID 1 exists
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: Sequelize.literal('UUID()'),
        namaOutfit: 'Business Casual Attire',
        deskripsi: 'A professional yet comfortable look for the modern workplace.',
        imageId: 'sample-image-2.jpg', // Make sure this image exists in /uploads
        userId: 1, // Assumes a user with ID 1 exists
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Ootds', null, {});
  }
};