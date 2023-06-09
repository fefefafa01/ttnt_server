const { Client } = require('pg');
const logger = require('./loggers')

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "147596382",
    port: 5432
})

client.connect();

const query = "SELECT * FROM users";

client.query(query, (err, res) => {
    if (err) {
        console.error(err);
        logger.dbLogger.log('error',query)
        return;
    }
    if (!err){
        for (let row of res.rows)  {
        console.log(row);
        }
        logger.dbLogger.log('info',query)
    }
    client.end();
});
