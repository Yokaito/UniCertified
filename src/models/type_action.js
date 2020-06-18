const { Model, DataTypes } = require('sequelize')

class type_action extends Model {
    static init(connection){
        super.init({
            name_type_action: DataTypes.STRING
        }, {
            sequelize: connection
        })
    }
}

module.exports = type_action