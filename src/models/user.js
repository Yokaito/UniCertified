const { Model, DataTypes } = require('sequelize')
import bcrypt from 'bcryptjs'


class user extends Model {
    static init(connection){
        super.init({
            email_user: DataTypes.STRING,
            name_user: DataTypes.STRING,
            course_user: DataTypes.STRING,
            half_user: DataTypes.INTEGER,
            password_user: DataTypes.STRING,
            last_access_date_user: DataTypes.DATE,
            activation_key_user: DataTypes.INTEGER
        }, {
            hooks: {
                beforeSave: (user, options) =>{
                    var salt =  bcrypt.genSaltSync(10)
                    user.password_user = bcrypt.hashSync(user.password_user, salt)    
                }
            },
            sequelize: connection
        })
    }   

    static associate(models){
        this.belongsTo(models.state, { foreignKey: 'id_state_foreign'})
        this.belongsTo(models.type_user, { foreignKey: 'id_type_user_foreign'})
        this.belongsTo(models.activation_state, { foreignKey: 'id_activation_state_foreign'})
    }
}

module.exports = user