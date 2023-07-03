"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Part_Sub_Groups", {
            part_sub_group_id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            part_group_id: {
                type: Sequelize.INTEGER,
            },
            part_sub_group_name: {
                type: Sequelize.STRING(200),
            },
            part_sub_group_code: {
                type: Sequelize.STRING(500),
            },
            part_sub_group_image: {
                type: Sequelize.STRING(200),
            },
            part_sub_group_remark: {
                type: Sequelize.STRING(200),
            },
            is_active: {
                type: Sequelize.BOOLEAN,
            },
            created_date: {
                type: Sequelize.DATE,
            },
            created_by: {
                type: Sequelize.INTEGER,
            },
            updated_date: {
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Part_Sub_Groups");
    },
};
