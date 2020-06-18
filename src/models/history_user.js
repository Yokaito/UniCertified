const { Model, DataTypes } = require('sequelize')

class history_user extends Model {
    static init(connection){
        super.init({
            action_data_user: DataTypes.DATE,
        }, {
            sequelize: connection
        })
    }

    static associate(models){
        this.belongsTo(models.type_action, { foreignKey: 'id_type_action_foreign'})
        this.belongsTo(models.user, { foreignKey: 'id_user_foreign'})
    }
}

module.exports = history_user