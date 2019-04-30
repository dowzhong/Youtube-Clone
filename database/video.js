const uuid = require('uuid/v4')

module.exports = (sequelize, datatypes) => {
    return sequelize.define('video', {
        id: {
            type: datatypes.STRING,
            primaryKey: true,
            defaultValue: uuid()
        },
        title: {
            type: datatypes.STRING,
            allowNull: false
        },
        description: {
            type: datatypes.STRING,
            allowNull: false,
            defaultValue: ''
        },
        videoPath: {
            type: datatypes.STRING,
            allowNull: false
        }
    })
}