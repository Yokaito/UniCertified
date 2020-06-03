const { Model, DataTypes } = require('sequelize')

class model_certified extends Model {
    static init(connection){
        super.init({
            id_model_certified: DataTypes.INTEGER,
            name_model_certified: DataTypes.STRING,
            file_model_certified: DataTypes.BLOB

        }, {
            sequelize: connection
        })
    }

    static associate(models){
        this.belongsTo(models.user, { foreignKey: 'id_user_foreign', as: 'model has user'})
    
    }
}

module.exports = model_certified