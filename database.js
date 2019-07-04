require('dotenv').config();

//require and authenticate sequelize ORM
const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', process.env.DBUSER, process.env.DBPASS, {
    host: 'localhost',
    dialect: 'sqlite',
    operatorsAliases: false,
    storage: './database.sqlite',
    logging: false
});

const Video = sequelize.import('./database/video.js');
const Tag = sequelize.import('./database/tag.js');
const User = sequelize.import('./database/user.js');

//create joins and associations between database models.
Video.belongsTo(User);
User.hasMany(Video);
Video.hasMany(Tag);
Tag.belongsTo(Video);

module.exports = { Video, Tag, User, sequelize }