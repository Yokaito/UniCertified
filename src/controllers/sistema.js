import express from 'express'
import variables, { count } from '../models/variables'
import formatarData from '../functions/formatDate'
import User from '../models/user'
import TypeUser from '../models/type_user'
import hUser from '../models/history_user'
import send_email from '../functions/email'

require('dotenv').config()

const router = express.Router()


router.use((req, res, next) => {
    if(!req.session.user){
        res.redirect('/login')
    }else if(req.session.user.tipo_usuario <= 1){
        next()
    }else{
        res.redirect('/dashboard')
    }    
})

router.get('/variaveis', async (req, res) => {
    var variaveisAll
    var status = []
    await variables.findAll().then(r => {
        if(r){
            variaveisAll = r.map(v => {
                return Object.assign({},{
                    id: v.id,
                    nome: v.name_variable,
                    valor: v.value_variable,
                    criada: formatarData(v.updatedAt),
                    atualizada: formatarData(v.updatedAt)                  
                })
            })
        }else{
            status.push({ msg: 'Nenhuma variavel encontrada' })
        }
    })

    res.render('variaveis', {
        js: 'controllers_js/variaveis.js',
        style: 'controllers_css/dashboard.css',
        title: 'UniCertified | Variaveis',
        user: req.session.user,
        breadcrumb: 'Variaveis',
        variaveis: variaveisAll,
        status
    })
})

router.post('/variaveis/editarvariavel', async (req, res) => {
    var {id, nome, valor} = req.body
    var count_error = 0

    if(!(id != ' '))
        count_error += 1
    if(!(nome != ' ') && !(nome.length >= 5 && nome.length <= 50))
        count_error += 1
    if(!(valor != ' ') && !(valor >= 1 && valor <= 1000))
        count_error += 1

    if(count_error != 0)
        res.send({ error : 'Ocorreu um erro com os dados enviados'})
    else{
        await variables.findOne({
            where: {
                id: id
            }
        }).then(r => {
            if(r){
                r.update({
                    name_variable: nome,
                    value_variable: valor
                }).then(ru => {
                    if(ru)
                        res.send({ success: 'Variavel atualizada com sucesso' })
                    else
                        res.send({ error: 'Ocorreu um erro ao atualizar a variavel'})
                })
            }else{
                res.send({ error: 'Variavel não encontrada'})
            }
        })
    }
})

router.get('/moderadores', async (req, res) => {
    var moderadores = []
    var usuarios = []

    await User.findAll({
        include: [{
            model: TypeUser,
            required: true
        }],
        order: [
            ['name_user', 'ASC']
        ]
    }).then(r => {
        r.forEach(e => {
            if(e.id_type_user_foreign == 2){
                moderadores.push({
                    id: e.id,
                    nome: e.name_user,
                    tipo_id: e.id_type_user_foreign,
                    tipo: e.type_user.get('name_type_user')
                })
            }else if(e.id_type_user_foreign == 3){
                usuarios.push({
                    id: e.id,
                    nome: e.name_user,
                    tipo_id: e.id_type_user_foreign,
                    tipo: e.type_user.get('name_type_user')
                })
            }
        });
    })

    res.render('moderadores', {
        js: 'controllers_js/moderadores.js',
        style: 'controllers_css/moderadores.css',
        title: 'UniCertified | Gerir Moderadores',
        user: req.session.user,
        breadcrumb: 'Moderadores',
        moderadores,
        usuarios
    })
})

router.post('/moderadores/alterar', async (req, res) => {
    var { id, tipo_acao } = req.body
    /* tipo_acao: false remove mod, true adiciona mod */
    var count_error = 0
    if(!(tipo_acao >= 0 && tipo_acao <= 1))
        count_error += 1

    if(count_error != 0)
        res.send({ error: 'Houve um erro nos dados enviados'})
    else{
        await User.findOne({
            where: {
                id
            }
        }).then(r => {
            if(r){
                if(tipo_acao == 1){
                    r.update({
                        id_type_user_foreign: 2
                    }).then(ru => {
                        if(ru){
                            hUser.create({
                                action_data_user: new Date(),
                                id_type_action_foreign: 17, /* Adicionado como moderador */
                                id_user_foreign: id
                            })
                            res.send({ success: 'Usuario foi adicionado como moderador'})
                        }else
                            res.send({ error: 'Ocorreu um erro interno'})
                    })
                }else{
                    r.update({
                        id_type_user_foreign: 3
                    }).then(ru => {
                        if(ru){
                            hUser.create({
                                action_data_user: new Date(),
                                id_type_action_foreign: 18, /* Removido como moderador */
                                id_user_foreign: id
                            })
                            res.send({ success: 'O moderador foi adicionado como usuario'})
                        }else
                            res.send({ success: 'Ocorreu um erro interno'})
                    })
                }
            }else
                res.send({ error: 'Usuario não encontrado'})
        })
    }
})

module.exports = app => app.use('/sistema', router)