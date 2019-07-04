/**
 * This file handles setting up the database. I've chosen to use Sequelize ORM to make SQL queries neater
 * in code, and this file basically prepares the sqlite database for sequelize.
 */

const database = require('./database.js');

database.sequelize.sync({ force: process.argv.includes('-f')})
    .then(() => {
        console.log('Database synced and wiped.');
        database.sequelize.close();
    });