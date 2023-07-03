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

        const manufacturers = await queryInterface.sequelize.query(
            "SELECT manufacturer_id, manufacturer_name FROM manufacturer",
            { type: Sequelize.QueryTypes.SELECT }
        );
        const manufacturerIds = manufacturers.map(
            (manufacturer) => manufacturer.manufacturer_id
        );

        const partSubGroups = await queryInterface.sequelize.query(
            "SELECT part_sub_group_id FROM part_sub_group"
        );
        const partSubGroupIds = partSubGroups[0].map(
            (partSubGroup) => partSubGroup.part_sub_group_id
        );
        const pncs = await queryInterface.sequelize.query(
            "SELECT pnc FROM pnc"
        );
        const PNCS = pncs[0].map((PNC) => PNC.pnc);

        const data = [];
        const numPart = 50;
        for (let i = 0; i < numPart; i++) {
            const randomManufacturerId = chanceObj.pickone(manufacturerIds);
            const randomManufacturer = manufacturers.find(
                (manufacturer) =>
                    manufacturer.manufacturer_id === randomManufacturerId
            );
            const randomManufacturerName = randomManufacturer.manufacturer_name;
            data.push({
                manufacturer_id: randomManufacturerId,
                part_sub_group_id: chanceObj.pickone(partSubGroupIds),
                pnc: chanceObj.pickone(PNCS),
                part_code: `${chanceObj.string({
                    length: 5,
                    pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                })}-${chanceObj.string({
                    length: 5,
                    pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                })}`,
                manufacturer_name: randomManufacturerName,
                argos_part_name: chanceObj.pickone([
                    "CLUTCH, ASSY",
                    "PUMP ASSY",
                    "Clutch Disc",
                    "Clutch Cover",
                    "Clutch Master Cylinder",
                    "Cutch Realease Cylinder",
                    "Oil Pump",
                    "Water Pump",
                    "Fan Clutch",
                    "Fan Blade",
                    "Oil Filter",
                    "Air Filter",
                    "Fuel Filter",
                    "Cabin Air Filter",
                    "Water Pump (Inverter)",
                ]),
                aisin_group_name: chanceObj.pickone([
                    "Powertrain/Chassis",
                    "Engine/Fuel",
                    "Electrical",
                    "Engine/Exhaust",
                ]),
                aisin_sub_group_name: chanceObj.pickone([
                    "STANDARD TOOL",
                    "CLUTCH",
                    "HYDRAULICS",
                    "TRANSMISSION",
                ]),
                aisin_part_name: chanceObj.pickone([
                    "CLUTCH, ASSY",
                    "PUMP ASSY",
                    "Clutch Disc",
                    "Clutch Cover",
                    "Clutch Master Cylinder",
                    "Cutch Realease Cylinder",
                    "Oil Pump",
                    "Water Pump",
                    "Fan Clutch",
                    "Fan Blade",
                    "Oil Filter",
                    "Air Filter",
                    "Fuel Filter",
                    "Cabin Air Filter",
                    "Water Pump (Inverter)",
                ]),
                is_active: chanceObj.bool(),
                created_date: new Date(),
                created_by: chanceObj.pickone(userIds),
                updated_date: new Date(),
                updated_by: chanceObj.pickone(userIds),
            });
        }

        await queryInterface.bulkInsert("part_name_mapping", data, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("part_name_mapping", {});
    },
};
