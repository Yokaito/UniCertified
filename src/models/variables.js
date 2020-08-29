const { Model, DataTypes } = require('sequelize')

class variables extends Model {
    static init(connection){
        super.init({
            name_variable: DataTypes.STRING,
            value_variable: DataTypes.INTEGER
        }, {
            sequelize: connection
        })
    }
}

module.exports = variables