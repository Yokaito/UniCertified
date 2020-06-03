const { Model, DataTypes } = require('sequelize')

class activation_state extends Model {
    static init(connection){
        super.init({
            id_activation_state: DataTypes.INTEGER,
            name_activation_state: DataTypes.STRING
        }, {
            sequelize: connection
        })
    }
}

module.exports = activation_state