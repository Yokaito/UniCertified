import express from 'express'
import User from '../models/user'
import HUser from '../models/history_user'
import hash from '../functions/hash'
import variables from '../models/variables'
import send_email from '../functions/email'
import bcrypt from 'bcryptjs'

const router = express.Router()

router.use((req, res ,next) => { /* Middlawares que verifica se a sessao esta ativa */
    if(!req.session.user)
        next()
    else
        res.redirect('/dashboard')

})


router.get('/', (req, res) => { 
    res.render('register', {
        style: 'controllers_css/registro.css',
        js: 'controllers_js/registro.js',
        title: 'UniCertified | Cadastro'
    })    
});

router.get('/ativar', async (req, res) => {
    if(!req.query.token && !req.cookies['token'])
        res.render('ativacao', {
            error: 'Token Expirado ou inexistente. Realize o Login novamente para reenviar um token para o seu email.',
            style: 'controllers_css/registro.css'
        })
    else{
        if(req.cookies['token'] == req.query.token){
            await User.findOne({
                where: {
                    activation_key_user: req.query.token
                }
            }).then((find_response) => { 
                if(find_response){
                    if(find_response.get('id_activation_state_foreign') != 1){
                        User.update(
                            { id_activation_state_foreign: 1 },
                            { where: { activation_key_user: req.query.token} }
                        ).then((update_response) => {
                            if(update_response){     
                                // o find_response retorna o individuo do banco de dados podendo usar o metodo GET para obter informacoes do usuario que foi encontrado apenas informando o nome da coluna
                                /* 🟡 Aqui e o envio da confirmação de email falta o template*/
                                let mailOptions = {
                                    from: `UniCertified <${process.env.NM_EMAIL_FROM}>`, // sender address
                                    to: find_response.get('email_user'), // list of receivers
                                    subject: `UniCertified | ${find_response.get('name_user')} Sua conta foi ativada com sucesso.`, // Subject line
                                    template: 'ativado',
                                    context: {
                                        username: find_response.get('name_user')
                                    }                                    
                                }                    
                                send_email(mailOptions)    
                                res.clearCookie('token').render('ativacao', {
                                    success: 'Conta ativada com sucesso. Volta para a pagina de ',
                                    style: 'controllers_css/registro.css'
                                })                     
                            }else{
                                res.render('ativacao', {
                                    error: 'Ocorreu um erro ao ativar sua conta.',
                                    style: 'controllers_css/registro.css'
                                })
                            }
                        
                        })
                    }else{
                        res.render('ativacao', {
                            error: 'Conta ja ativa.',
                            style: 'controllers_css/registro.css'
                        })
                    }
                }else{
                    res.render('ativacao', {
                        error: 'Token não encontrado.',
                        style: 'controllers_css/registro.css'
                    })
                }                
            })         
        }else{
            res.render('ativacao', {
                error: 'Token incorreto.',
                style: 'controllers_css/registro.css'
            })
        }         
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


    var horas_totais    
    await variables.findOne({
        where: {
            id: 1
        }
    }).then(r => {
        if(r)
            horas_totais = r.value_variable
        else
            count_errors += 1
    })
    
    if(count_errors == 0){
        // 📍 Encontra o email
        await User.findOne({
            where: {
                email_user: data.email_usuario
            }
        }).then((response_findOne) => { 
            if(!response_findOne){ /* 📍 Se encontrar é negado e realiza a criacao  */
                User.create({
                    email_user: data.email_usuario,
                    name_user: data.nome_usuario,
                    password_user: data.senha_usuario,
                    half_user: 1,
                    course_user: 'Engenharia de Software',
                    total_hours_user: horas_totais,
                    id_type_user_foreign: 3,
                    id_state_foreign: 2,
                    last_access_date_user: new Date(),
                    activation_key_user: token,
                    id_activation_state_foreign: 2
                }).then((response_create) => { 
                    if(response_create){ /* 📍 Se foi criado send um status  */ 
                        /* 🟡 Aqui vai ser enviado o email com o link de ativação, ainda falta criar o template  */
                        let mailOptions = {
                            from: `UniCertified <${process.env.NM_EMAIL_FROM}>`, // sender address
                            to: response_create.get('email_user'), // list of receivers
                            subject: `UniCertified | Ative Sua Conta ${data.nome_usuario}`, // Subject line
                            template: 'ativacao', // qual template sera utilizado para a ativacao da conta
                            context: {
                                link: `${process.env.NM_CONTEXT_LINK_ATIVAR}token=${token}`
                            }
                            
                        }                    
                        send_email(mailOptions)                                    
                        res.cookie('token', token, { maxAge: 600000}).send({ success: 'Conta criada com sucesso.', link: process.env.URL_FRONT_LOGIN});

                    }else /* 📍 Caso de algum erro enviar um status */
                        res.send({ error: 'Ocorreu um erro interno'});
                })
            }else{ /* 📍 Caso ja exista o email envia o status */
                res.send({ error: 'Email já está em uso'})
            }        
        })
    }else{
        res.send({ error: 'Ocorreu um erro nos dados enviados'})
    }       
});


router.get('/recuperar_senha', (req, res) => {
    if(req.query.tokenr && req.query.email){
        if(req.query.tokenr == req.cookies['tokenr'] && req.session.tokenr == req.query.tokenr && req.session.tokenr == req.cookies['tokenr']){
            let count_errors = 0
            if(!(req.query.email == req.session.email && req.query.email != ' ' && (req.query.email.length >= 5 && req.query.email.length <= 40) && req.query.email.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,6}/g)))
                count_errors += 1                
            
            if(count_errors == 0){
                User.findOne({
                    where: {
                        email_user: req.query.email
                    }
                }).then((response_findOne) => {
                    if(response_findOne){
                        res.render('trocar_senha', {
                            style: 'controllers_css/recuperar_senha.css',
                            js: 'controllers_js/trocar_senha.js',
                            title: 'UniCertified | Trocar Senha',
                            email: response_findOne.get('email_user')
                        })
                    }else{
                        res.clearCookie('tokenr').send({ error: 'Email nao encontrado'})                        
                    }
                })
            }else{
                res.clearCookie('tokenr').send({ error: 'Email em formato incorreto'})
            }           
        }else{
            res.clearCookie('tokenr').send({ error: 'Token Incorreto'})
            
        }        
    }else{
        res.clearCookie('tokenr').render('recuperar_senha', {
            style: 'controllers_css/recuperar_senha.css',
            js: 'controllers_js/recuperar_senha.js',
            title: 'UniCertified | Recuperar Senha'
        })
    }
        
})

router.post('/recuperar_senha/trocar', (req,res) => {
    
    let data = req.body
    let count_errors = 0
    if(!(data.email_usuario != ' ' && (data.email_usuario.length >= 5 && data.email_usuario.length <= 40) && data.email_usuario.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,6}/g)))
        count_errors += 1
    else if(!(data.senha_usuario != ' ' && (data.senha_usuario.length >= 5 && data.senha_usuario.length <= 40)))
        count_errors += 1
    else if (!(data.senha_conf_usuario != ' ' && (data.senha_conf_usuario.length >= 5 && data.senha_conf_usuario.length <= 40) && data.senha_conf_usuario == data.senha_usuario))
        count_errors += 1   
    
    if(req.session.tokenr == req.cookies['tokenr'] && data.email_usuario == req.session.email){
        if(count_errors == 0)
            User.findOne({
                where: {
                    email_user: data.email_usuario
                }
            }).then((response_findOne) => {
                if(response_findOne){
                    let salt =  bcrypt.genSaltSync(10) 
                    User.update(
                        { password_user : bcrypt.hashSync(data.senha_usuario, salt)},
                        { where: { id: response_findOne.get('id') }}
                    ).then((response_update) => {
                        if(response_update){
                            /* ✅ FEITO Envia o Email da troca de senha e marca no historico do usuario*/
                            let mailOptions = {
                                from: `UniCertified <${process.env.NM_EMAIL_FROM}>`, // sender address
                                to: response_findOne.get('email_user'), // list of receivers
                                subject: `UniCertified | Sua senha foi alterado com sucesso`, // Subject line
                                template: 'troca_senha_conf', // qual template sera utilizado para a ativacao da conta
                                context: {
                                    username: response_findOne.get('name_user')
                                }
                                
                            }   
                            send_email(mailOptions)
                            HUser.create({
                                action_data_user: new Date(),
                                id_type_action_foreign: 1,
                                id_user_foreign: response_findOne.get('id')
                            })                            

                            res.session = null
                            res.clearCookie('tokenr').send({ success: 'Senha Alterada com sucesso', link: process.env.URL_FRONT_LOGIN})
                        }else
                            res.send({ error: 'Ocorreu um erro interno'})
                    })
                }else{
                    res.session = null
                    res.clearCookie('tokenr').send({ error: 'Email não encontrado', text: 'Recomeçe o processo', link: process.env.URL_FRONT_RECUPERAR_SENHA})
                }               
            })
        else{
            res.session = null
            res.send({ error: 'Ocorreu um erro nos dados enviados', text: 'Recomeçe o processo', link: process.env.URL_FRONT_RECUPERAR_SENHA})
        }
    }else{
            res.session = null
            res.send({ error: 'Token ou email alterado do original', text: 'Recomeçe o processo', link: process.env.URL_FRONT_RECUPERAR_SENHA})       
    }    
})

router.post('/recuperar_senha/auth', (req, res) => {
    let data = req.body
    let count_errors = 0
    let tokenr = hash()

    if(!(data.email_usuario != ' ' && (data.email_usuario.length >= 5 && data.email_usuario.length <= 40) && data.email_usuario.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,6}/g)))
        count_errors += 1

    if(count_errors == 0){
        User.findOne({
            where: {
                email_user: data.email_usuario
            }
        }).then((response_findOne) => {
            if(response_findOne){
                let mailOptions = {
                    from: `UniCertified <${process.env.NM_EMAIL_FROM}>`, // sender address
                    to: response_findOne.get('email_user'), // list of receivers
                    subject: `UniCertified | Recuperação da Senha`, // Subject line
                    template: 'recuperar_senha', // qual template sera utilizado para a ativacao da conta
                    context: {
                        link: `${process.env.NM_CONTEXT_LINK_RECUPERAR}tokenr=${tokenr}&email=${response_findOne.get('email_user')}`
                    }
                }
                send_email(mailOptions)
                req.session.tokenr = tokenr
                req.session.email = response_findOne.get('email_user')
                res.cookie('tokenr', tokenr, { maxAge: 600000}).send({ success: 'Email enviado com sucesso', link: process.env.URL_FRONT_LOGIN})
            }else{
                res.send({ error: 'Email não encontrado'})
            }        
        })
    }else{
        res.send({ error: 'Ocorreu um erro nos dados enviados'})
    }
})


module.exports = app => app.use('/registro', router)

