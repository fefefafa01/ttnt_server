const { Client } = require('pg');
require ('dotenv').config()
//const logger = require('./loggers')

// const client = new Client({
//     user: "gmp",
//     host: "192.168.11.57",
//     database: "GMP",
//     password: "123456",
//     port: 5432
// })

const client = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT
})

module.exports = client;
