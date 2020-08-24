import express from 'express'
import User from '../models/user' 
import { Op } from 'sequelize'
import Certified from '../models/certified'
import TypeCertified from '../models/type_certified'
import hCertified from '../models/history_certified'

const router = express.Router()


router.use((req, res, next) => {
    if(!req.session.user){
        res.redirect('/login')
    }else if(req.session.user.tipo_usuario <= 2){
        next()
    }else{
        res.redirect('/dashboard')
    }    
})

router.get('/procurar', async (req, res) => { 
    var aluno = null
    var certificadoAluno = null
    var total = 0;
    var TipoCertificado = null
    if(req.session.mostrarTabela){
        await User.findByPk(req.session.mostrarTabela).then((response) => {
            if(response){
                aluno = {
                    id: response.getDataValue('id'),
                    email: response.getDataValue('email_user'),
                    nome: response.getDataValue('name_user'),
                    curso: response.getDataValue('course_user'),
                    semestre: response.getDataValue('half_user'),
                    estado: response.getDataValue('id_state_foreign')
                } 
            }            
        })

        await Certified.findAll({
            include: [
                {
                    model: TypeCertified,
                    required: true,
                },
            ],
            where: {
                id_user_foreign: aluno.id
            }
        }).then(response => {
            certificadoAluno = response.map(c => {
                return Object.assign({},{
                    id: c.id,
                    nome: c.name_certified,
                    valor: c.value_certified,
                    foto: c.picture_certified,
                    numero_tipo: c.id_type_certified_foreign,
                    tipo: c.type_certified.get('name_type_certified'),
                    estado: c.id_state_foreign
                })
            })
        })

        certificadoAluno.forEach(c => {
            if(c.estado == 1)
                total += c.valor 
        })

        await TypeCertified.findAll().then(r => {
            TipoCertificado = r.map(tc => {
                return Object.assign(
                    {},
                    {
                        id: tc.id,
                        nome: tc.name_type_certified
                    }
                )
            })
        })

    }

    req.session.mostrarTabela = undefined

    res.render('procurar_aluno', {
        js: 'controllers_js/procurar_aluno.js',
        style: 'controllers_css/dashboard.css',
        title: 'UniCertified | Procurar Aluno',
        user: req.session.user,
        aluno: aluno,
        TipoCertificado,
        total: total,
        certificados: certificadoAluno,
        breadcrumb: `Procurar Aluno`,
    }) 
    
})

router.get('/procurar/alunos', async (req, res) => {
    /* var contador = 0
    var usuarios = [] */
    const { count ,rows } =  await User.findAndCountAll({
        where: {
            name_user: {
                [Op.like]: `${req.query['q']}%`
            }
        }
    })

    var usuarios =  {}
    var key = 'user'
    usuarios[key] = []

    rows.forEach(element => {
        usuarios[key].push({
            id: element.getDataValue('id'),
            name: element.getDataValue('name_user'),
            email: element.getDataValue('email_user')
        })
    });

    res.send(JSON.stringify(usuarios))
    
})

router.post('/procurar/criartabela', async (req, res) => {
    req.session.mostrarTabela = req.body.id
    req.session.alunoTabela = req.body.id
    res.send({ success: 'Tabela sendo criada'})
})

router.post('/procurar/alterarestado', async (req, res) => {
    var { id , comentario, acao, id_aluno } = req.body
    var count_error = 0
    var acao = acao != 1 ? 3:1

    if(!(comentario != ' ' && comentario.length <= 350))
        count_error += 1        
    if(!(id != ' '))
        count_error += 1    
    if(req.session.alunoTabela != id_aluno)
        count_error += 1 

    if(count_error != 0)
        res.status(200).json({ error: 'Ocorreu um erro nos dados enviados'})
    else{
        await Certified.update(
            {
                comments_certified: comentario,
                id_state_foreign: acao,
                updated_at: new Date()
            },
            {
                where: {
                    id
                }
            }
        ).then(response => {
            if(response){
                if(acao == 1){
                    hCertified.create({
                        action_date_certified: new Date(),
                        id_certified_foreign: id,
                        id_user_foreign: req.session.user.id,
                        id_type_action_foreign: 8 /* Aprovar certificado */
                    })
                    res.send({ success: 'Certificado aprovado com sucesso'})                    
                }else{
                    hCertified.create({
                        action_date_certified: new Date(),
                        id_certified_foreign: id,
                        id_user_foreign: req.session.user.id,
                        id_type_action_foreign: 9 /* Reprovar Certificado */
                    })
                    res.send({ success: 'Certificado reprovado com sucesso'})  
                }
                                  
            }else
                res.send({ error: 'Ocorreu um erro interno'})
                
        })
    }
    

})

router.post('/procurar/habilitaredicao', async (req,res) => {
    const { id, id_aluno } = req.body
    var count_error = 0

    if(!(id != ' '))
        count_error += 1
    if(!(id_aluno != ' '))
        count_error += 1
    if(req.session.alunoTabela != id_aluno)
        count_error += 1
    
    if(count_error != 0)
        res.send({ error: 'Ocorreu um erro interno'})
    else{
        Certified.update(
            {
                id_state_foreign: 2,
                updated_at: new Date()
            },
            {
                where: {
                    id,
                    id_user_foreign: id_aluno
                }
            }
        ).then(response => {
            if(response != 0){
                hCertified.create({
                    action_date_certified: new Date(),
                    id_certified_foreign: id,
                    id_user_foreign: req.session.user.id,
                    id_type_action_foreign: 10 /* Habilitar Edição */
                })
                res.send({ success: 'Edição habilitada com sucesso'})
            }
                
            else
                res.send({ error: 'Ocorreu um erro interno'})
        })
    }
    

})

router.post('/procurar/alteraraluno', async (req, res ) => {
    var { id , id_aluno, acao } = req.body
    var count_error = 0
    var acao = acao != 1 ? 3:1
     
    if(!(id != ' '))
        count_error += 1    
    if(req.session.alunoTabela != id_aluno)
        count_error += 1 
    if(id != id_aluno)
        count_error += 1

    if(count_error != 0)
        res.status(200).json({ error: 'Ocorreu um erro nos dados enviados'})
    else{
        await User.update(
            {
                id_state_foreign: acao,
                updated_at: new Date()
            },
            {
                where: {
                    id
                }
            }
        ).then(response => {
            if(response){
                if(acao == 1)
                    res.send({ success: 'Aluno aprovado com sucesso'})
                else
                    res.send({ success: 'Aluno reprovado com sucesso'})
            }else
                res.send({ error: 'Ocorreu um erro interno'})
                
        })
    }

})

router.post('/procurar/habilitaraluno', async (req, res) => {
    const { id, id_aluno } = req.body
    var count_error = 0

    if(!(id != ' '))
        count_error += 1
    if(!(id_aluno != ' '))
        count_error += 1
    if(req.session.alunoTabela != id_aluno)
        count_error += 1
    if(id != id_aluno)
        count_error += 1
    
    if(count_error != 0)
        res.send({ error: 'Ocorreu um erro interno'})
    else{
        User.update(
            {
                id_state_foreign: 2,
                updated_at: new Date()
            },
            {
                where: {
                    id
                }
            }
        ).then(response => {
            if(response != 0)
                res.send({ success: 'Edição habilitada com sucesso'})
            else
                res.send({ error: 'Ocorreu um erro interno'})
        })
    }
})

router.post('/procurar/editarcertificado', async (req , res) => {
    const { id, valor, tipo, id_aluno } = req.body
    var count_error = 0
    var msg_envio = null
    var name_tipo = null

    if(valor == ' ' && tipo == ' ' && id == ' ' && !(valor > 0 && valor <= 40)){
        count_error += 1
        msg_envio = 'Dados enviados invalidos'
    }else if(!(req.session.user.tipo_usuario <= 2)){
        count_error += 1
        msg_envio = 'Sem permissão para realizar esta ação'
    }

    await TypeCertified.findByPk(tipo).then(r => {
        if(r)
            name_tipo = r.getDataValue('name_type_certified')    
    })

    if(name_tipo == null){
        count_error += 1
        msg_envio = 'Tipo do certificado não encontrado'
    }
        
    if(count_error != 0){
        res.send({ error: msg_envio})
    }else{
        await Certified.update(
            {
                value_certified: valor,
                id_type_certified_foreign: tipo,
                updated_at: new Date()
            },
            {
                where: {
                    id: id,
                    id_user_foreign: id_aluno
                }
            }
        ).then(r => {
            if(r){
                hCertified.create({
                    action_date_certified: new Date(),
                    id_certified_foreign: id,
                    id_user_foreign: req.session.user.id,
                    id_type_action_foreign: 13 /* Editou um Certificado */
                })
                res.send({ success: 'Certificado atualizado com sucesso'})
                
            }else
                res.send({ error: 'Ocorreu um erro interno'})
        })
    }
})

module.exports = app => app.use('/admin', router)