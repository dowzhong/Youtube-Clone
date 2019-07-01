module.exports = (sequelize, datatypes) => {
    return sequelize.define('user', {
        id: {
            type: datatypes.STRING,
            primaryKey: true
        },
        username: {
            type: datatypes.STRING,
            unique: true,
            allowNull: false
        },
        passwordHash: {
            type: datatypes.STRING,
            allowNull: false
        }
    })
}