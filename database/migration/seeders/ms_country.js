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
        const countryData = [
            { country: "United States", abbreviation: "US" },
            { country: "Germany", abbreviation: "DE" },
            { country: "Australia", abbreviation: "AU" },
            { country: "United Kingdom", abbreviation: "GB" },
            { country: "France", abbreviation: "FR" },
            { country: "Japan", abbreviation: "JP" },
        ];
        const data = [];
        const numPart = 50;
        for (let i = 0; i < numPart; i++) {
            const randomCountryData = chanceObj.pickone(countryData);
            const randomCountry = randomCountryData.country;
            const randomAbbreviation = randomCountryData.abbreviation;
            data.push({
                country_name: randomCountry,
                country_name_abb: randomAbbreviation,
                is_active: chanceObj.bool(),
                created_date: new Date(),
                created_by: chanceObj.pickone(userIds),
                updated_date: new Date(),
                updated_by: chanceObj.pickone(userIds),
            });
        }

        await queryInterface.bulkInsert("ms_country", data, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("ms_country", {});
    },
};
