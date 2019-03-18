const Sequelize = require('sequelize')

const sequelize = new Sequelize('database', process.env.DBUSER, process.env.DBPASS, {
    host: 'localhost',
    dialect: 'sqlite',
    operatorsAliases: false,
    storage: './database.sqlite',
    logging: false
})

const Video = sequelize.define('video', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    }
})

const Tag = sequelize.define('tag', {
    tag: {
        type: Sequelize.STRING
    }
})

sequelize.sync({ force: process.argv.includes('-f')})
    .then(() => {
        console.log('Database synced and wiped.')
        sequelize.close()
    })