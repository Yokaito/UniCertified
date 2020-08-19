import express from 'express'
import User from '../models/user'
import Certified from '../models/certified'
import TypeCertified from '../models/type_certified'
import Certificado from '../models/certified'
import StatusCertified from '../models/state'
import formatarData from '../functions/formatDate'
import multer from 'multer'
import multerConfig from '../config/multer'

const router = express.Router()

router.use((req, res, next) => {
    if(!req.session.user){
        res.redirect('/login')
    }else{
        next()
    }
    
})

router.get('/', async (req, res) => {
    let total_alunos = null
    let total_alunos_aprovados = null
    let total_alunos_reprovados = null
    let total_certificados = null
    var CertificadoObj = null
    var tipo_mostrar = null

    await User.count({
        where: {
            id_type_user_foreign: 3
        },
    }).then(response => {
        total_alunos = response
    })   
    
    await User.count({
        where: {
            id_state_foreign: 1
        }
    }).then(response => {
        total_alunos_aprovados = response
    })

    await User.count({
        where: {
            id_state_foreign: 3
        }
    }).then(response => {
        total_alunos_reprovados = response
    })

    await Certificado.count().then(response => {
        total_certificados = response
    })

    if(req.session.user.tipo_usuario <= 2){
        tipo_mostrar = true
        await Certificado.findAll({
            include: [
                {
                    model: TypeCertified,
                    required: true,
                },
                {
                    model: User,
                    required: true
                },
            ],
            limit: 10,
            order: [
                ['updated_at', 'DESC'],
            ]
        }).then(response => {
            CertificadoObj = response.map(certificado => {
                return Object.assign(
                    {},
                    {
                        id: certificado.id,
                        status: certificado.id_state_foreign,
                        nome_certificado: certificado.name_certified,
                        valor_certificado: certificado.value_certified,
                        tipo_certificado: certificado.type_certified.get('name_type_certified'),
                        nome_usuario: certificado.user.get('name_user'),                  
                        criado_em: formatarData(certificado.createdAt),                        
                    }
                )
            })
        })
    }else{
        tipo_mostrar = false
        await Certificado.findAll({
            include: [
                {
                    model: TypeCertified,
                    required: true,
                },
            ],
            where: {
                id_user_foreign: req.session.user.id
            },
            order: [
                ['updated_at', 'DESC'],
            ]
        }).then(response => {
            CertificadoObj = response.map(certificado => {
                return Object.assign(
                    {},
                    {
                        id: certificado.id,
                        status: certificado.id_state_foreign,
                        nome_certificado: certificado.name_certified,
                        valor_certificado: certificado.value_certified,
                        tipo_certificado: certificado.type_certified.get('name_type_certified'),
                        nome_usuario: req.session.user.nome,
                        criado_em: formatarData(certificado.createdAt)
                    }
                )
            })
        })
    }

    res.render('dashboard', {
        js: 'controllers_js/dashboard.js',
        style: 'controllers_css/dashboard.css',
        title: 'UniCertified | Dashboard',
        user: req.session.user,
        breadcrumb: `Dashboard`,
        total_alunos: total_alunos,
        alunos_aprovados: total_alunos_aprovados,
        alunos_reprovados: total_alunos_reprovados,
        total_certificados: total_certificados,
        certificados: CertificadoObj,
        usuario_mostra: tipo_mostrar
    })   
})

router.get('/certificado', async (req, res) => {
    var CertificadoUser = null
    var TipoCertificado = null
    await Certificado.findAll({
        include: [
            {
                model: TypeCertified,
                required: true,
            },
        ],
        where: {
            id_user_foreign: req.session.user.id
        }
    }).then(response => {
        CertificadoUser = response.map(certificado => {
            return Object.assign(
                {},
                {
                    id: certificado.id,
                    status: certificado.id_state_foreign,
                    nome_certificado: certificado.name_certified,
                    valor_certificado: certificado.value_certified,
                    picture_certificado: certificado.picture_certified,
                    comments_ceritifcado: certificado.comments_certified,
                    tipo_certificado: certificado.type_certified.get('name_type_certified'),
                    nome_usuario: req.session.user.nome,
                    criado_em: formatarData(certificado.createdAt)
                }
            )
        })
    })

    await TypeCertified.findAll().then(response => {
        TipoCertificado = response.map(tipo_certificado => {
            return Object.assign(
                {},
                {
                    id: tipo_certificado.id,
                    nome_tipo_certificado: tipo_certificado.name_type_certified
                }
            )
        })
    })
    
    res.render('certificados', {
        js: 'controllers_js/dashboard.js',
        style: 'controllers_css/dashboard.css',
        title: 'UniCertified | Certificados',
        user: req.session.user,
        breadcrumb: 'Certificado',
        certificados: CertificadoUser,
        tipos_certificados: TipoCertificado
    })
})

router.post('/certificado/newcertificado', multer(multerConfig).single('file') ,async (req, res) => {
    let certificado = req.body /* vem o nome,valor e tipo */
    let file = req.file
    var estado = null
    var data_tooltip = null
    var icon = null
    var estado_certificado = null
    /* Criar as validações dos campos de entrada e retornar os erros devidos */
    TypeCertified.findByPk(certificado.tipo_certificado).then(responseFindByPK => { 
        estado_certificado = responseFindByPK.getDataValue('name_type_certified')               
    })

    await Certificado.create({
        name_certified: certificado.nome_certificado,
        value_certified: certificado.valor_certificado,
        picture_certified: file.filename,
        id_type_certified_foreign: certificado.tipo_certificado,
        id_user_foreign: req.session.user.id,
        id_state_foreign: 2
    }).then(response => {
        if(!response)
            res.send({ error: 'Houve um erro interno ao registrar'})
        else{
            
            switch(response.getDataValue('id_state_foreign')){
                case 1:
                    estado = 'positive'
                    data_tooltip = 'Aprovado'
                    icon = 'icon checkmark'
                    break
                case 2:
                    estado = 'warning' 
                    data_tooltip = 'Em Analise'
                    icon = 'orange icon spinner'
                    break
                case 3:
                    estado = 'error'
                    data_tooltip = 'Reprovado'
                    icon = 'icon attention'
                    break
            
            }            
            var html = `<tr data-id="${response.getDataValue('id')}" class="${estado}">
                <td width="3%" class="center aligned" data-tooltip="${data_tooltip}" data-position="top center" data-variation="mini"><i class="${icon}"></i></td>
                <td>${response.getDataValue('name_certified')}</td>
                <td>${response.getDataValue('value_certified')}</td>
                <td>${estado_certificado}</td>
                <td width="5%" class="center aligned">
                    <a href="#">
                        <i class="large file image icon"></i>
                    </a>
                </td>
                <td width="8%" class="center aligned">
                    <div class="ui tiny icon buttons">
                        <button data-id="${response.getDataValue('id')}" class="ui button blue editarCertificado">
                            <i class="edit icon"></i>
                        </button>
                        <button data-id="${response.getDataValue('id')}" class="ui button red deletarCertificado">
                            <i class="trash icon"></i>
                        </button>
                    </div>
                </td>
            </tr>`         
            res.send({ 
                success: 'Cadastrado com sucesso',
                html: html
            })
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login')
})

module.exports = app => app.use('/dashboard', router)