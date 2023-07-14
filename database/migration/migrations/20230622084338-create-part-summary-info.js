'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Part_Summary_Infos', {
      Data_Date: {
        type: Sequelize.DATE
      },
      Country_Name: {
        type: Sequelize.STRING(100)
      },
      Country_Name_Abb: {
        type: Sequelize.STRING(3)
      },
      Car_Brand_Name: {
        type: Sequelize.STRING(50)
      },
      Car_Model_Name: {
        type: Sequelize.STRING(50)
      },
      Model_Code: {
        type: Sequelize.STRING(10)
      },
      Engine_Model: {
        type: Sequelize.STRING(10)
      },
      Vehicle_Type: {
        type: Sequelize.STRING(20)
      },
      Transmission_Code: {
        type: Sequelize.STRING(20)
      },
      Transmission_Type: {
        type: Sequelize.STRING(20)
      },
      Part_Group_Name: {
        type: Sequelize.STRING(50)
      },
      Part_Sub_Group_Name: {
        type: Sequelize.STRING(200)
      },
      Original_Part_Name: {
        type: Sequelize.STRING(500)
      },
      Start_of_Production: {
        type: Sequelize.STRING(10)
      },
      End_of_Production: {
        type: Sequelize.STRING(10)
      },
      AISIN_Premium_Code: {
        type: Sequelize.STRING(20)
      },
      AISIN_Sub_Premium_Code: {
        type: Sequelize.STRING(20)
      },
      Total: {
        type: Sequelize.INTEGER
      },
      Coverage: {
        type: Sequelize.INTEGER
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Part_Summary_Infos');
  }
};