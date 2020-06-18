const { Model, DataTypes } = require('sequelize')

class state extends Model {
    static init(connection){
        super.init({
            name_state: DataTypes.STRING
        }, {
            sequelize: connection
        })
    }
}

module.exports = state