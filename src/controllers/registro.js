import express from 'express'
import User from '../models/user'
import bcrypt from 'bcryptjs'
import hash from '../functions/hash'

const router = express.Router()

/* Linkar a pagina de Login com a pagina de Registro Feito */

router.get('/', (req, res) => {      
    res.render('register', {
        style: 'login.css',
        js: 'formValidation.js',
        title: 'UniCertified | Cadastro'
    })
});

router.get('/ativar', async (req, res) => {
    if(!req.query.token)
        res.send({ error: 'Token expirado.'})
    else{
        await User.findOne({
            where: {
                activation_key_user: req.query.token
            }
        }).then((find_response) => { 
            if(find_response){
                if(find_response.get('id_activation_state_foreign') != 1){
                    if(req.cookies['token'] == req.query.token){
                        User.update(
                            { id_activation_state_foreign: 1 },
                            { where: { activation_key_user: req.query.token} }
                        ).then((update_response) => {
                            if(update_response){                            
                                res.clearCookie('token').send({ success: 'Conta ativada com sucesso.'})
                            }else
                                res.send({ erro: 'Ocorreu um erro ao ativar sua conta.'})                           
                        })
                    }else{
                        res.send({ error: 'Token incorreto.'})
                    } 
                }else
                    res.send({ erro: 'Conta ja ativada.'});
            }else
                res.send({ erro: 'Token nao Encontrado'})
                
        })
    }
    

})


/* Criar o metodo de registro com email ⚠️ */

router.post('/registrar', async (req, res) => {
   
    let data = req.body
    let count_errors = 0  
    let token = hash()   

    if(!(data.nome_usuario != ' ' && (data.nome_usuario.length >= 5 && data.nome_usuario.length <= 40)))
        count_errors += 1
    else if(!(data.email_usuario != ' ' && (data.email_usuario.length >= 5 && data.email_usuario.length <= 40) && data.email_usuario.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,6}/g)))
        count_errors += 1
    else if(!(data.email_conf_usuario != ' ' && (data.email_conf_usuario.length >= 5 && data.email_conf_usuario.length <= 40) && data.email_conf_usuario.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,6}/g) && data.email_conf_usuario == data.email_usuario))
        count_errors += 1
    else if(!(data.senha_usuario != ' ' && (data.senha_usuario.length >= 5 && data.senha_usuario.length <= 40)))
        count_errors += 1
    else if (!(data.senha_conf_usuario != ' ' && (data.senha_conf_usuario.length >= 5 && data.senha_conf_usuario.length <= 40) && data.senha_conf_usuario == data.senha_usuario))
        count_errors += 1   

    if(count_errors == 0){
        // 📍 Encontra o email
        await User.findOne({
            where: {
                email_user: data.email_usuario
            }
        }).then((response) => { 
            if(!response){ /* 📍 Se encontrar é negado e realiza a criacao  */
                User.create({
                    email_user: data.email_usuario,
                    name_user: data.nome_usuario,
                    password_user: data.senha_usuario,
                    id_type_user_foreign: 3,
                    id_state_foreign: 2,
                    last_access_date_user: new Date(),
                    activation_key_user: token,
                    id_activation_state_foreign: 2
                }).then((response2) => { 
                    if(response2){ /* 📍 Se foi criado send um status  */                                        
                        res.cookie('token', token, { maxAge: 600000}).send({ success: 'Criado com sucesso.'});
                        /* Aqui e onde vai ser enviado o email para ativação por email
                            http://localhost:3000/registro/ativar?token=%242a%2405%24bR8O3tmjIpxM3ev16QceCuWso.Gx8WIlqHX9AKcsPmDadkfVuVyra
                            sendo enviado desse jeito
                        */
                    }else /* 📍 Caso de algum erro enviar um status */
                        res.send({ erro: 'Ocorreu um erro interno.'});
                })
            }else{ /* 📍 Caso ja exista o email envia o status */
                res.send({ erro: 'Email ja existente.'})
            }        
        })
    }else{
        res.send({ erro: 'Ocorreu algum erro nos dados de enviados.'})
    }      
});


module.exports = app => app.use('/registro', router)

