const { Model, DataTypes } = require('sequelize')

class type_action extends Model {
    static init(connection){
        super.init({
            id_type_action: DataTypes.INTEGER,
            name_type_action: DataTypes.STRING
        }, {
            sequelize: connection
        })
    }
}

module.exports = type_action