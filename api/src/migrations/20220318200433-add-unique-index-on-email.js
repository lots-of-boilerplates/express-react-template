'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addIndex('Users', ["email"], { unique: true });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('Users', ["email"]);
  }
};
