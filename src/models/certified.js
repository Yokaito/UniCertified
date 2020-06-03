const { Model, DataTypes } = require('sequelize')

class certified extends Model {
    static init(connection){
        super.init({
            id_certified: DataTypes.INTEGER,
            name_certified: DataTypes.STRING,
            value_certified: DataTypes.INTEGER,
            picture_certified: DataTypes.BLOB

        }, {
            sequelize: connection
        })
    }

    static associate(models){
        this.belongsTo(models.type_certified, { foreignKey: 'id_type_certified_foreign', as: 'certified has type'})
        this.belongsTo(models.user, { foreignKey: 'id_user_foreign', as: 'certified has user' })
        this.belongsTo(models.state, { foreignKey: 'id_state_foreign', as: 'certified has state'})
    
    }
}

module.exports = certified