require('dotenv').config()

const Sequelize = require('sequelize')
const sequelize = new Sequelize('database', process.env.DBUSER, process.env.DBPASS, {
    host: 'localhost',
    dialect: 'sqlite',
    operatorsAliases: false,
    storage: './database.sqlite',
    logging: false
})

const Video = sequelize.import('./database/video.js')
const Tag = sequelize.import('./database/tag.js')

Video.hasMany(Tag)

Tag.hasOne(Video)

module.exports = { Video, Tag, sequelize }