const { Model, DataTypes } = require('sequelize')

class certified_generated extends Model {
    static init(connection){
        super.init({
            id_certified_generated: DataTypes.INTEGER,
            name_certified_generated: DataTypes.STRING,
        }, {
            sequelize: connection
        })
    }

    static associate(models){
        this.belongsTo(models.model_certified, { foreignKey: 'id_model_certified_foreign', as: 'certified generated has model'})
        this.belongsTo(models.type_certified, { foreignKey: 'id_type_certified_foreign', as: 'certified generated has type' })
    }
}

module.exports = certified_generated