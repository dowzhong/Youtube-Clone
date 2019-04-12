const uuid = require('uuid/v4')

module.exports = (sequelize, datatypes) => {
    return sequelize.define('video', {
        id: {
            type: datatypes.STRING,
            primaryKey: true,
            defaultValue: uuid()
        },
        title: {
            type: datatypes.STRING
        },
        description: {
            type: datatypes.STRING
        },
        videoPath: {
            type: datatypes.STRING
        }
    })
}