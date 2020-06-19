import express from 'express'
import User from '../models/user'

const router = express.Router()

/* Linkar a pagina de Login com a pagina de Registro ⚠️ */

router.get('/', (req, res) => {     
    
    res.render('register', {
        style: 'login.css',
        js: 'formValidation.js',
        title: 'UniCertified | Cadastro'
    })
    
});


/* Criar o metodo de registro com email ⚠️ */

router.post('/registrar', async (req, res) => {
    let data = req.body
    if(data.nome_usuario != ' ' && (data.nome_usuario.length >= 5 && data.nome_usuario.length <= 40)){

        await User.create({
            email_user: data.email_usuario,
            name_user: data.nome_usuario,
            password_user: data.senha_usuario,
            id_type_user_foreign: 3,
            id_state_foreign: 2,
            last_access_date_user: new Date()
        }).then((data) => {
            if(data)
                res.redirect('/registro')
            else
                res.redirect(400, '/registro')
        })
        
    }
        
});


module.exports = app => app.use('/registro', router)

