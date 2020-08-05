import express from 'express'
import User from '../models/user'
import HUser from '../models/history_user'
import type_user from '../models/type_user'
import bcrypt from 'bcryptjs'
import hash from '../functions/hash'
import send_email from '../functions/email'

const router = express.Router()

router.use((req, res, next) => {
    if(req.session.user){
        res.redirect('/dashboard')
    }else{
        next()
    }    
})

router.get('/', (req, res) => {
    /* ✅ Criar a parte de cadastro e verificacao de ativacao de conta para quando o usuario tentar logar e a conta nao estiver ativa ele reenviar o email com um novo token para realizar a ativacao da conta */    
    res.render('login', {
        js: 'controllers_js/login.js',
        style: 'controllers_css/login.css',
        title: 'UniCertified | Login'      
    })   
});

router.get('/lista', async (req, res) => { 
    let user = ''
    
    await User.findAll({ 
        include: [{ 
            model: type_user,
            attributes: ['name_type_user']
        }]
    }).then((response_findAll) => { 
        response_findAll.forEach(element => {
                        
        });
    })    
    
});

router.post('/auth', async (req, res) => {
    let user = req.body

    let count_errors = 0

    if(!(user.email_usuario != ' ' && (user.email_usuario.length >= 5 && user.email_usuario.length <= 40) && user.email_usuario.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,6}/g)))
        count_errors += 1
    if(!(user.senha_usuario != ' ' && (user.senha_usuario.length >= 5 && user.senha_usuario.length <= 40)))
        count_errors += 1
        
    if(count_errors == 0){
        User.findOne({
            where: {
                email_user: user.email_usuario
            }
        }).then((response_findOne) => {
            if(response_findOne){
                if(response_findOne.get('id_activation_state_foreign') == 1){
                    if(bcrypt.compareSync(user.senha_usuario,response_findOne.get('password_user'))){
                        User.update(
                            { last_access_date_user: new Date() },
                            { where: { id: response_findOne.get('id') }}
                        )

                        req.session.user = {
                            session_hash: hash(),
                            id: response_findOne.get('id'),
                            nome: response_findOne.get('name_user'),
                            email: response_findOne.get('email_user'),
                            tipo_usuario: response_findOne.get('id_type_user_foreign'),
                            estado_usuario: response_findOne.get('id_state_foreign'),
                            ativacao: response_findOne.get('id_activation_state_foreign')
                        }

                        res.send({link: process.env.URL_REDIRECT_DASHBOARD});
                    }else{
                        res.send({ error: 'Senha incorreta'})
                    }    
                }else{
                    let token = hash()
                    User.update(
                        { activation_key_user: token },
                        { where: { id: response_findOne.get('id') }}
                    ).then((update_response) => {
                        if(update_response){
                            let mailOptions = {
                                from: `UniCertified <${process.env.NM_EMAIL_FROM}>`, // sender address
                                to: response_findOne.get('email_user'), // list of receivers
                                subject: `UniCertified | Ative Sua Conta ${response_findOne.get('name_user')}`, // Subject line
                                template: 'ativacao', // qual template sera utilizado para a ativacao da conta
                                context: {
                                    link: `${process.env.NM_CONTEXT_LINK_ATIVAR}token=${token}`
                                }    
                            }
                            send_email(mailOptions)
        
                            res.cookie('token', token, { maxAge: 600000 }).send({ error: 'Esta conta não esta ativa, foi enviado um email para realizar a ativação'})
                        }else{
                            res.send({ error: 'Ocorreu um erro interno'})
                        }
                    })
                    
                }
                
            }else{
                res.send({ error: 'Email não encontrado'})
            }            
        })
        
    }else{
        res.send({ error: 'Ocorreu um erro nos dados enviados'})
    }   
    
})

module.exports = app => app.use('/login', router)