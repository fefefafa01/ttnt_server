'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Part_Competiter_Infos', {
      Part_Id: {
        type: Sequelize.INTEGER
      },
      Manufacturer_Id: {
        type: Sequelize.INTEGER
      },
      Competiter_Part_Code: {
        type: Sequelize.STRING(20)
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
    await queryInterface.dropTable('Part_Competiter_Infos');
  }
};