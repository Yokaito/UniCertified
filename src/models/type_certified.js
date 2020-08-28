const { Model, DataTypes } = require('sequelize')

class type_certified extends Model {
    static init(connection){
        super.init({
            name_type_certified: DataTypes.STRING,
            first_hour: DataTypes.INTEGER,
            second_hour: DataTypes.INTEGER,
            third_hour: DataTypes.INTEGER,

        }, {
            sequelize: connection
        })
    }
}

module.exports = type_certified