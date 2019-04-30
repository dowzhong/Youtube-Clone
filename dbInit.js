const database = require('./database.js')

database.sequelize.sync({ force: process.argv.includes('-f')})
    .then(() => {
        console.log('Database synced and wiped.')
        sequelize.close()
    })