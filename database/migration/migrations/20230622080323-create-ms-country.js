'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MS_Countries', {
      Country_Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Country_Name: {
        type: Sequelize.STRING(100)
      },
      Country_Name_Abb: {
        type: Sequelize.STRING(3)
      },
      Is_Active: {
        type: Sequelize.BOOLEAN
      },
      Created_Date: {
        type: Sequelize.DATE
      },
      Created_By: {
        type: Sequelize.INTEGER
      },
      Updated_Date: {
        type: Sequelize.DATE
      },
      Updated_By: {
        type: Sequelize.INTEGER
      },

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MS_Countries');
  }
};