const { Model, DataTypes } = require('sequelize')

class history_certified extends Model {
    static init(connection){
        super.init({
            id_history_certified: DataTypes.INTEGER,
            action_date_certified: DataTypes.DATE,

        }, {
            sequelize: connection
        })
    }

    static associate(models){
        this.belongsTo(models.certified, { foreignKey: 'id_certified_foreign', as: 'history has ceritified'})
        this.belongsTo(models.user, { foreignKey: 'id_user_foreign', as: 'history has user'})
        this.belongsTo(models.state, { foreignKey: 'id_type_action_foreign', as: 'history has type action'})
    
    }
}

module.exports = history_certified