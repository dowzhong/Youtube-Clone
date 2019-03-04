const Sequelize = require('sequelize')

const sequelize = new Sequelize('database', process.env.DBUSER, process.env.DBPASS, {
    host: 'localhost',
    dialec: 'sqlite',
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

Tag.belongsTo(Video)
Video.hasMany(Tag)


sequelize.sync({ force: process.argv.includes('-f')})
    .then(() => {
        console.log('Database synced and wiped.')
        sequelize.close()
    })