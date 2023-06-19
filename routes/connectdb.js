const { Client } = require('pg');
//const logger = require('./loggers')

// const client = new Client({
//     user: "gmp",
//     host: "192.168.11.57",
//     database: "GMP",
//     password: "123456",
//     port: 5432
// })

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "123456",
    port: 5432
})

module.exports = client;
