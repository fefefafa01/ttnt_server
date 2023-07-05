const Chance = require("chance");
const chanceObj = new Chance();
("use strict");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const users = await queryInterface.sequelize.query(
            "SELECT user_id FROM ms_user"
        );
        const userIds = users[0].map((user) => user.user_id);

        const parts = await queryInterface.sequelize.query(
            "SELECT part_id FROM part"
        );
        const partIds = parts[0].map((part) => part.part_id);

        const carInformation = await queryInterface.sequelize.query(
            "SELECT car_info_id FROM car_information"
        );
        const carInfoIds = carInformation[0].map(
            (carInfor) => carInfor.car_info_id
        );

        const data = [];
        const numPart = 50;
        const uniquePartId = chanceObj.unique(
            chanceObj.pickone,
            numPart,
            partIds
        );
        const uniqueCarInfoId = chanceObj.unique(
            chanceObj.pickone,
            numPart,
            carInfoIds
        );
        for (let i = 0; i < numPart; i++) {
            data.push({
                part_id: uniquePartId[i],
                car_info_id: uniqueCarInfoId[i],
                is_active: chanceObj.bool(),
                created_date: new Date(),
                created_by: chanceObj.pickone(userIds),
                updated_date: new Date(),
                updated_by: chanceObj.pickone(userIds),
            });
        }

        await queryInterface.bulkInsert("part_car_info", data, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("part_car_info", {});
    },
};
