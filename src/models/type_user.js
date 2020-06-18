const { Model, DataTypes } = require('sequelize')

class type_user extends Model {
    static init(connection){
        super.init({
            name_type_user: DataTypes.STRING
        }, {
            sequelize: connection
        })
    }
}

module.exports = type_user