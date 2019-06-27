module.exports = (sequelize, datatypes) => {
    return sequelize.define('video', {
        id: {
            type: datatypes.STRING,
            primaryKey: true
        },
        title: {
            type: datatypes.STRING,
            allowNull: false
        },
        description: {
            type: datatypes.STRING,
            allowNull: false,
            defaultValue: ''
        }
    })
}