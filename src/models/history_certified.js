const { Model, DataTypes } = require('sequelize')

class history_certified extends Model {
    static init(connection){
        super.init({
            action_date_certified: DataTypes.DATE,

        }, {
            sequelize: connection
        })
    }

    static associate(models){
        this.belongsTo(models.certified, { foreignKey: 'id_certified_foreign'})
        this.belongsTo(models.user, { foreignKey: 'id_user_foreign'})
        this.belongsTo(models.type_action, { foreignKey: 'id_type_action_foreign'})
    
    }
}

module.exports = history_certified