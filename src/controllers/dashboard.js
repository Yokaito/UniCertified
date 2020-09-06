import express from "express";
import User from "../models/user";
import Certified from "../models/certified";
import TypeCertified from "../models/type_certified";
import Certificado from "../models/certified";
import formatarData from "../functions/formatDate";
import multer from "multer";
import multerConfig from "../config/multer";
import fsCertificado from "../functions/fs_certificado";
import hCertified from "../models/history_certified";
import hUser from "../models/history_user";
import type_action from "../models/type_action";
import Variables from "../models/variables";
import { Op } from "sequelize";

require("dotenv").config();

const router = express.Router();
const upload = multer(multerConfig).single("file");

router.use((req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
});

router.get("/", async (req, res) => {
  let total_alunos = null;
  let total_alunos_aprovados = null;
  let total_alunos_reprovados = null;
  let total_certificados = null;
  var CertificadoObj = null;
  var tipo_mostrar = null;

  await User.count({
    where: {
      id_type_user_foreign: 3,
    },
  }).then((response) => {
    total_alunos = response;
  });

  await User.count({
    where: {
      id_state_foreign: 1,
    },
  }).then((response) => {
    total_alunos_aprovados = response;
  });

  await User.count({
    where: {
      id_state_foreign: 3,
    },
  }).then((response) => {
    total_alunos_reprovados = response;
  });

  await Certificado.count().then((response) => {
    total_certificados = response;
  });

  if (req.session.user.tipo_usuario <= 2) {
    tipo_mostrar = true;
    await Certificado.findAll({
      include: [
        {
          model: TypeCertified,
          required: true,
        },
        {
          model: User,
          required: true,
          where: {
            flag_user: {
              [Op.eq]: 0,
            },
          },
        },
      ],
      limit: 10,
      order: [["updated_at", "DESC"]],
    }).then((response) => {
      CertificadoObj = response.map((certificado) => {
        return Object.assign(
          {},
          {
            id: certificado.id,
            status: certificado.id_state_foreign,
            nome_certificado: certificado.name_certified,
            valor_certificado: certificado.value_certified,
            tipo_certificado: certificado.type_certified.get(
              "name_type_certified"
            ),
            id_aluno: certificado.id_user_foreign,
            nome_usuario: certificado.user.get("name_user"),
            criado_em: formatarData(certificado.createdAt),
          }
        );
      });
    });
  } else {
    tipo_mostrar = false;
    await Certificado.findAll({
      include: [
        {
          model: TypeCertified,
          required: true,
        },
      ],
      where: {
        id_user_foreign: req.session.user.id,
      },
      order: [["updated_at", "DESC"]],
    }).then((response) => {
      CertificadoObj = response.map((certificado) => {
        return Object.assign(
          {},
          {
            id: certificado.id,
            status: certificado.id_state_foreign,
            nome_certificado: certificado.name_certified,
            valor_certificado: certificado.value_certified,
            comentario_certificado: certificado.comments_certified,
            tipo_certificado: certificado.type_certified.get(
              "name_type_certified"
            ),
            nome_usuario: req.session.user.nome,
            criado_em: formatarData(certificado.createdAt),
          }
        );
      });
    });
  }

  res.render("dashboard", {
    js: "controllers_js/dashboard.js",
    style: "controllers_css/dashboard.css",
    title: "UniCertified | Dashboard",
    user: req.session.user,
    breadcrumb: `Dashboard`,
    total_alunos: total_alunos,
    alunos_aprovados: total_alunos_aprovados,
    alunos_reprovados: total_alunos_reprovados,
    total_certificados: total_certificados,
    certificados: CertificadoObj,
    usuario_mostra: tipo_mostrar,
  });
});

router.get("/certificado", async (req, res) => {
  var UserB = [];
  var CertificadoUser = null;
  var TipoCertificado = null;
  var valor_total = 0;
  var valor_parcial = 0;
  await User.findByPk(req.session.user.id).then((r) => {
    UserB = {
      id: r.id,
      nome: r.name_user,
      email: r.email_user,
      curso: r.course_user,
      semestre: r.half_user,
      estado: r.id_state_foreign,
      horas: r.total_hours_user,
      flag: r.flag_user,
    };
  });

  await Certificado.findAll({
    include: [
      {
        model: TypeCertified,
        required: true,
      },
    ],
    where: {
      id_user_foreign: req.session.user.id,
    },
  }).then((response) => {
    CertificadoUser = response.map((certificado) => {
      var fotoCertificado = certificado.picture_certified;
      var spliter = fotoCertificado.split(".");
      var mime = spliter[1];
      return Object.assign(
        {},
        {
          id: certificado.id,
          status: certificado.id_state_foreign,
          nome_certificado: certificado.name_certified,
          valor_certificado: certificado.value_certified,
          picture_certificado:
            process.env.URL_PICTURE + certificado.picture_certified,
          mimetype: mime,
          comments_certificado: certificado.comments_certified,
          numero_tipo_certificado: certificado.id_type_certified_foreign,
          tipo_certificado: certificado.type_certified.get(
            "name_type_certified"
          ),
          nome_usuario: req.session.user.nome,
          criado_em: formatarData(certificado.createdAt),
          flag_user: UserB.flag,
        }
      );
    });

    CertificadoUser.forEach((c) => {
      if (c.status == 1) valor_total += c.valor_certificado;

      if (c.status == 1 || c.status == 4) valor_parcial += c.valor_certificado;
    });
  });

  await TypeCertified.findAll().then((response) => {
    TipoCertificado = response.map((tipo_certificado) => {
      return Object.assign(
        {},
        {
          id: tipo_certificado.id,
          nome_tipo_certificado: tipo_certificado.name_type_certified,
        }
      );
    });
  });

  res.render("certificados", {
    js: "controllers_js/dashboard.js",
    style: "controllers_css/dashboard.css",
    title: "UniCertified | Certificados",
    user: req.session.user,
    UserB,
    breadcrumb: "Certificado",
    total_pontos: valor_total,
    total_parcial: valor_parcial,
    certificados: CertificadoUser,
    tipos_certificados: TipoCertificado,
  });
});

router.post("/certificado/newcertificado", async (req, res) => {
  if (req.session.user.flag != 1) {
    upload(req, res, async (err) => {
      if (err) res.send({ error: "Arquivo Invalido" });
      else {
        let certificado = req.body; /* vem o nome,valor e tipo */
        let file = req.file;
        var estado = null;
        var data_tooltip = null;
        var icon = null;
        var estado_certificado = null;
        var count_error = 0;

        if (
          !(
            certificado.nome_certificado != " " &&
            certificado.nome_certificado.length >= 5 &&
            certificado.nome_certificado.length <= 45
          )
        )
          count_error += 1;
        if (
          !(
            certificado.valor_certificado != " " &&
            certificado.valor_certificado > 0 &&
            certificado.valor_certificado <= 40
          )
        )
          count_error += 1;
        /* Criar as validações dos campos de entrada e retornar os erros devidos */
        TypeCertified.findByPk(certificado.tipo_certificado).then(
          (responseFindByPK) => {
            estado_certificado = responseFindByPK.getDataValue(
              "name_type_certified"
            );
          }
        );
        if (!(estado_certificado != " ")) count_error += 1;

        if (count_error != 0)
          res.send({ error: "Houve um erro na criação do certificado" });
        else {
          await Certificado.create({
            name_certified: certificado.nome_certificado,
            value_certified: certificado.valor_certificado,
            picture_certified: file.filename,
            id_type_certified_foreign: certificado.tipo_certificado,
            id_user_foreign: req.session.user.id,
            id_state_foreign: 2,
          }).then((response) => {
            if (!response)
              res.send({ error: "Houve um erro interno ao registrar" });
            else {
              hCertified.create({
                action_date_certified: new Date(),
                id_certified_foreign: response.getDataValue("id"),
                id_user_foreign: req.session.user.id,
                id_type_action_foreign: 11 /* Criar Certificado */,
                type_user: req.session.user.tipo_usuario,
              });
              switch (response.getDataValue("id_state_foreign")) {
                case 1:
                  estado = "positive";
                  data_tooltip = "Aprovado";
                  icon = "icon checkmark";
                  break;
                case 2:
                  estado = "warning";
                  data_tooltip = "Em Analise";
                  icon = "orange icon spinner";
                  break;
                case 3:
                  estado = "error";
                  data_tooltip = "Reprovado";
                  icon = "icon attention";
                  break;
              }
              var html = `<tr data-id="${response.getDataValue(
                "id"
              )}" class="${estado}">
                              <td width="3%" class="center aligned" data-tooltip="${data_tooltip}" data-position="top center" data-variation="mini"><i class="${icon}"></i></td>
                              <td>${response.getDataValue(
                                "name_certified"
                              )}</td>
                              <td>${response.getDataValue(
                                "value_certified"
                              )}</td>
                              <td>${estado_certificado}</td>
                              <td width="5%" class="center aligned">
                                  <a>
                                      <i class="large file image icon mostrarImagemCertificado" data-foto="http://localhost:3000/tmp/uploads/${response.getDataValue(
                                        "picture_certified"
                                      )}"></i>
                                  </a>
                              </td>
                              <td width="8%" class="center aligned">
                                  <div class="ui tiny icon buttons">
                                      <button data-id="${response.getDataValue(
                                        "id"
                                      )}" class="ui button blue editarCertificado">
                                          <i class="edit icon"></i>
                                      </button>
                                      <button data-id="${response.getDataValue(
                                        "id"
                                      )}" class="ui button red deletarCertificado">
                                          <i class="trash icon"></i>
                                      </button>
                                  </div>
                              </td>
                          </tr>`;
              res.send({
                success: "Cadastrado com sucesso",
                html: html,
              });
            }
          });
        }
      }
    });
  } else {
    res.send({ error: "Usuario Desativado" });
  }
});

router.post("/certificado/editcertificado", async (req, res) => {
  if (req.session.user.flag != 1) {
    upload(req, res, async (err) => {
      if (err) res.send({ error: "Arquivo Invalido" });
      else {
        var certificado = req.body;
        var file = typeof req.file == "undefined" ? null : req.file;
        var count_error = 0;
        var estado_certificado;

        if (
          !(
            certificado.new_nome_certificado != " " &&
            certificado.new_nome_certificado.length >= 5 &&
            certificado.new_nome_certificado.length <= 45
          )
        )
          count_error += 1;
        if (
          !(
            certificado.new_valor_certificado != " " &&
            certificado.new_valor_certificado > 0 &&
            certificado.new_valor_certificado <= 40
          )
        )
          count_error += 1;

        TypeCertified.findByPk(certificado.new_tipo_certificado).then(
          (responseFindByPK) => {
            estado_certificado = responseFindByPK.getDataValue(
              "name_type_certified"
            );
          }
        );

        if (!(estado_certificado != " ")) count_error += 1;

        if (count_error != 0) {
          if (file != null) fsCertificado.deletarCertificado(file.filename);

          res.send({ error: "Um erro ocorreu" });
        } else {
          var oldNameCertificado = null;
          var newNameCertificado = null;

          await Certified.findByPk(certificado.id).then((response) => {
            oldNameCertificado = response.getDataValue("picture_certified");
          });

          if (file == null) {
            newNameCertificado = oldNameCertificado;
          } else {
            newNameCertificado = file.filename;
            fsCertificado.deletarCertificado(oldNameCertificado);
          }

          await Certified.update(
            {
              name_certified: certificado.new_nome_certificado,
              value_certified: certificado.new_valor_certificado,
              id_type_certified_foreign: certificado.new_tipo_certificado,
              picture_certified: newNameCertificado,
              updated_at: new Date(),
            },
            {
              where: {
                id: certificado.id,
              },
            }
          ).then((response) => {
            if (response) {
              hCertified.create({
                action_date_certified: new Date(),
                id_certified_foreign: certificado.id,
                id_user_foreign: req.session.user.id,
                id_type_action_foreign: 13 /* Editou um certificado */,
                type_user: req.session.user.tipo_usuario,
              });
              res.send({ success: "Certificado atualizado com sucesso" });
            } else
              res.send({ error: "Ocorreu um erro interno, tente novamente" });
          });
        }
      }
    });
  } else res.send({ error: "Usuario Desativado" });
});

router.post("/certificado/deletacertificado", async (req, res) => {
  if (req.session.user.flag != 1) {
    var certificado = null;
    var count_error = 0;

    await Certified.findByPk(req.body.id).then((response) => {
      if (response) {
        certificado = {
          id: response.getDataValue("id"),
          ownerId: response.getDataValue("id_user_foreign"),
          picture: response.getDataValue("picture_certified"),
          state: response.getDataValue("id_state_foreign"),
        };
      } else {
        count_error += 1;
      }
    });
    if (!(certificado != null && req.session.user.id == certificado.ownerId))
      count_error += 1;
    if (certificado.state != 2) count_error += 1;

    if (count_error != 0)
      res.send({ error: "Ocorreu um erro ao tentar excluir o certificado" });
    else {
      hCertified.destroy({
        where: {
          id_certified_foreign: certificado.id,
        },
      });
      await Certified.destroy({
        where: {
          id: certificado.id,
          id_user_foreign: certificado.ownerId,
        },
      }).then((response) => {
        if (response) {
          fsCertificado.deletarCertificado(certificado.picture);
        }
      });

      res.send({ success: "Certificado excluido com sucesso" });
    }
  } else {
    res.send({ error: "Usuario Desativado" });
  }
});

router.get("/perfil", async (req, res) => {
  var historico_usr = null;
  var historico_cert_usr = null;
  var usuario = null;
  var contador = 0;
  var contador2 = 0;
  await hCertified
    .findAll({
      include: [
        {
          model: type_action,
          required: true,
          attributes: ["name_type_action"],
        },
        {
          model: User,
          required: true,
          attributes: ["name_user"],
        },
        {
          model: Certified,
          required: true,
          attributes: ["id", "name_certified"],
          include: [
            {
              model: User,
              required: true,
              attributes: ["name_user"],
              where: {
                id: req.session.user.id,
              },
            },
          ],
        },
      ],
      order: [["action_date_certified", "DESC"]],
    })
    .then((r) => {
      if (r) {
        historico_cert_usr = r.map((h) => {
          contador2 += 1;
          return Object.assign(
            {},
            {
              id: contador2,
              nome_acao: h.type_action.getDataValue("name_type_action"),
              dono_certificado: h.certified.user.getDataValue("name_user"),
              nome_certificado: h.certified.getDataValue("name_certified"),
              nome_usuario_acao: h.user.getDataValue("name_user"),
              data: formatarData(h.action_date_certified),
            }
          );
        });
      }
    });

  await hUser
    .findAll({
      where: {
        id_user_foreign: req.session.user.id,
      },
      include: [
        {
          model: type_action,
          required: true,
        },
        {
          model: User,
          required: true,
        },
      ],
      order: [["action_data_user", "DESC"]],
    })
    .then((r) => {
      if (r) {
        historico_usr = r.map((h) => {
          contador += 1;
          return Object.assign(
            {},
            {
              id: contador,
              data: formatarData(h.action_data_user),
              acao: h.type_action.getDataValue("name_type_action"),
            }
          );
        });
      }
    });

  await User.findByPk(req.session.user.id).then((r) => {
    usuario = {
      id: r.id,
      email: r.email_user,
      nome: r.name_user,
      semestre: r.half_user,
      horas: r.total_hours_user,
      flag: r.flag_user,
    };
  });

  var semestres = null;
  var selected = false;

  await Variables.findAll().then((r) => {
    semestres = r.map((e) => {
      if (usuario.semestre == e.id) {
        selected = true;
      } else {
        selected = false;
      }
      return Object.assign(
        {},
        {
          id: e.id,
          valor: e.value_variable,
          selected,
        }
      );
    });
  });

  res.render("perfil", {
    js: "controllers_js/perfil.js",
    style: "controllers_css/dashboard.css",
    title: "UniCertified | Perfil",
    user: req.session.user,
    breadcrumb: "Perfil",
    historico: historico_usr,
    historico_c: historico_cert_usr,
    usuario,
    semestres,
  });
});

router.post("/perfil/atualizar", async (req, res) => {
  if (req.session.user.flag != 1) {
    var { id, nome, semestre } = req.body;
    var count_error = 0;

    if (nome == " " && !(nome.length >= 5 && nome.length <= 40))
      count_error += 1;
    if (!(semestre >= 1 && semestre <= 8)) count_error += 1;
    if (id != req.session.user.id) count_error += 1;

    var horas_atualizadas;
    await Variables.findByPk(semestre).then((r) => {
      horas_atualizadas = r.value_variable;
    });

    if (count_error != 0)
      res.send({ error: "Houve um erro com os dados enviados" });
    else {
      await User.update(
        {
          name_user: nome,
          half_user: semestre,
          total_hours_user: horas_atualizadas,
          updated_at: new Date(),
        },
        {
          where: {
            id,
          },
        }
      ).then((r) => {
        if (r) {
          hUser.create({
            action_data_user: new Date(),
            id_type_action_foreign: 14 /* Inserção */,
            id_user_foreign: id,
          });
          res.send({ success: "Atualizado com sucesso" });
        } else res.send({ success: "Ocorreu um erro interno" });
      });
    }
  } else {
    res.send({ error: "Usuario Desativado" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = (app) => app.use("/dashboard", router);
