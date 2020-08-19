const { Model, DataTypes } = require('sequelize')

class certified extends Model {
    static init(connection){
        super.init({
            name_certified: DataTypes.STRING,
            value_certified: DataTypes.INTEGER,
            picture_certified: DataTypes.STRING,
            comments_certified: DataTypes.STRING

        }, {
            sequelize: connection
        })
    }

    static associate(models){
        this.belongsTo(models.type_certified, { foreignKey: 'id_type_certified_foreign'})
        this.belongsTo(models.user, { foreignKey: 'id_user_foreign'})
        this.belongsTo(models.state, { foreignKey: 'id_state_foreign'})
    
    }
}

module.exports = certified