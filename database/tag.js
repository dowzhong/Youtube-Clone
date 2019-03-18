module.exports = (sequelize, datatypes) => {
    return sequelize.define('tag', {
        tag: {
            type: datatypes.STRING
        }
    })
}