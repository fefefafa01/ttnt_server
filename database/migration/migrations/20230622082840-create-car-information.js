'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Car_Informations', {
      Car_Info_Id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      AISIN_Vehicle_Code: {
        type: Sequelize.STRING(50)
      },
      Car_Model_Id: {
        type: Sequelize.INTEGER
      },
      Displacement_Id: {
        type: Sequelize.INTEGER
      },
      Power_Type_Id: {
        type: Sequelize.INTEGER
      },
      Fuel_Type_Id: {
        type: Sequelize.INTEGER
      },
      Transmission_Type_Id: {
        type: Sequelize.INTEGER
      },
      Drivetrain_Id: {
        type: Sequelize.INTEGER
      },
      Model_Code_Id: {
        type: Sequelize.INTEGER
      },
      Argos_Vehicle_Code: {
        type: Sequelize.STRING(50)
      },
      Chassis_Code: {
        type: Sequelize.STRING(50)
      },
      Engine_Model: {
        type: Sequelize.STRING(10)
      },
      Vehicle_Type: {
        type: Sequelize.STRING(20)
      },
      Drivers_Position: {
        type: Sequelize.STRING(10)
      },
      Start_of_Production: {
        type: Sequelize.STRING(10)
      },
      End_of_Production: {
        type: Sequelize.STRING(10)
      },
      Sales_Country: {
        type: Sequelize.STRING(100)
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Car_Informations');
  }
};