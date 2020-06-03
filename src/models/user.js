const { Model, DataTypes } = require('sequelize')

class user extends Model {
    static init(connection){
        super.init({
            id_user: DataTypes.INTEGER,
            email_user: DataTypes.STRING,
            name_user: DataTypes.STRING,
            password_user: DataTypes.STRING,
            last_access_date_user: DataTypes.DATE,
            activation_key_user: DataTypes.INTEGER
        }, {
            sequelize: connection
        })
    }

    static associate(models){
        this.belongsTo(models.state, { foreignKey: 'id_state_foreign', as: 'user has state'})
        this.belongsTo(models.type_user, { foreignKey: 'id_type_user_foreign', as: 'user has type'})
        this.belongsTo(models.activation_state, { foreignKey: 'id_activation_state_foreign', as: 'user has activation state'})
    }
}

module.exports = user