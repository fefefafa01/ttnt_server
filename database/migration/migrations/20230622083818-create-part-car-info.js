'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Part_Car_Infos', {
      Part_Id: {
        type: Sequelize.INTEGER
      },
      Car_Info_Id: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Part_Car_Infos');
  }
};