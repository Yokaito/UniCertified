import express from "express";
import User from "../models/user";
import { Op } from "sequelize";
import Certified from "../models/certified";
import TypeCertified from "../models/type_certified";
import hCertified from "../models/history_certified";
import hUser from "../models/history_user";
import Variables from "../models/variables";
import State from "../models/state";

require("dotenv").config();

const router = express.Router();

router.use((req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else if (req.session.user.tipo_usuario <= 2) {
    next();
  } else {
    res.redirect("/dashboard");
  }
});

router.get("/procurar", async (req, res) => {
  var aluno = null;
  var certificadoAluno = null;
  var total = 0;
  var total_parcial = 0;
  var TipoCertificado = null;
  var year = new Date()

  if (req.session.mostrarTabela) {
    await User.findByPk(req.session.mostrarTabela).then((response) => {
      if (response) {
        aluno = {
          id: response.getDataValue("id"),
          email: response.getDataValue("email_user"),
          nome: response.getDataValue("name_user"),
          curso: response.getDataValue("course_user"),
          semestre: response.getDataValue("half_user"),
          estado: response.getDataValue("id_state_foreign"),
          horas: response.getDataValue("total_hours_user"),
          flag: response.getDataValue("flag_user"),
        };
      }
    });

    var semestres = null;
    var selected = null;
    await Variables.findAll().then((r) => {
      semestres = r.map((e) => {
        if (aluno.semestre == e.id) selected = true;
        else selected = false;
        return Object.assign(
          {},
          {
            id: e.id,
            selected,
          }
        );
      });
    });

    await Certified.findAll({
      include: [
        {
          model: TypeCertified,
          required: true,
        },
      ],
      where: {
        id_user_foreign: aluno.id,
      },
    }).then((response) => {
      certificadoAluno = response.map((c) => {
        var fotoCertificado = c.picture_certified;
        var spliter = fotoCertificado.split(".");
        var mime = spliter[1];

        return Object.assign(
          {},
          {
            id: c.id,
            nome: c.name_certified,
            valor: c.value_certified,
            foto: process.env.URL_PICTURE + c.picture_certified,
            mimetype: mime,
            numero_tipo: c.id_type_certified_foreign,
            tipo: c.type_certified.get("name_type_certified"),
            estado: c.id_state_foreign,
            comentario: c.comments_certified,
          }
        );
      });
    });

    certificadoAluno.forEach((c) => {
      if (c.estado == 1) total += c.valor;
      if (c.estado == 1 || c.estado == 4) total_parcial += c.valor;
    });

    await TypeCertified.findAll().then((r) => {
      TipoCertificado = r.map((tc) => {
        return Object.assign(
          {},
          {
            id: tc.id,
            nome: tc.name_type_certified,
          }
        );
      });
    });
  }

  req.session.mostrarTabela = undefined;

  res.render("procurar_aluno", {
    js: "controllers_js/procurar_aluno.js",
    style: "controllers_css/dashboard.css",
    title: "UniCertified | Procurar Aluno",
    user: req.session.user,
    aluno: aluno,
    TipoCertificado,
    total: total,
    parcial: total_parcial,
    certificados: certificadoAluno,
    semestres,
    breadcrumb: `Procurar Aluno`,
    anoAtual: year.getFullYear()
  });
});

router.get("/procurar/alunos", async (req, res) => {
  /* var contador = 0
    var usuarios = [] */
  const { count, rows } = await User.findAndCountAll({
    where: {
      name_user: {
        [Op.like]: `${req.query["q"]}%`,
      },
      flag_user: {
        [Op.eq]: 0,
      },
      id_activation_state_foreign: 1
    },
  });

  var usuarios = {};
  var key = "user";
  usuarios[key] = [];

  rows.forEach((element) => {
    usuarios[key].push({
      id: element.getDataValue("id"),
      name: element.getDataValue("name_user"),
      email: element.getDataValue("email_user"),
    });
  });

  res.send(JSON.stringify(usuarios));
});

router.post("/procurar/criartabela", async (req, res) => {
  req.session.mostrarTabela = req.body.id;
  req.session.alunoTabela = req.body.id;
  res.send({ success: "Tabela sendo criada" });
});

/* Certificados */
router.post("/procurar/alterarestado", async (req, res) => {
  var { id, comentario, acao, id_aluno } = req.body;
  var count_error = 0;
  acao = acao != 1 ? 3 : 1;
  var historico_id = acao != 1 ? 9 : 8; /* 8 Aprovar , 9 Reprovar */
  comentario = comentario == undefined ? null : comentario;
  /* Se receber 1 Aprovar , se nao Reprovar */

  if (comentario != null) {
    if (!(comentario != " " && comentario.length <= 350)) count_error += 1;
  }
  if (!(id != " ")) count_error += 1;
  if (req.session.alunoTabela != id_aluno) count_error += 1;

  if (count_error != 0)
    res.status(200).json({ error: "Ocorreu um erro nos dados enviados" });
  else {
    await Certified.findOne({
      where: {
        id,
        id_user_foreign: id_aluno,
      },
    }).then((r) => {
      if (!r) res.status(200).json({ error: "Certificado não encontrado" });
      else {
        r.update({
          comments_certified: comentario,
          id_state_foreign: acao,
        }).then((ru) => {
          if (!ru)
            res
              .status(200)
              .json({ error: "Ocorreu um erro ao atualizar o certificado" });
          else {
            hCertified
              .create({
                action_date_certified: new Date(),
                id_certified_foreign: id,
                id_user_foreign: req.session.user.id,
                id_type_action_foreign: historico_id,
                type_user: req.session.user.tipo_usuario,
              })
              .then((hR) => {
                if (!hR)
                  res.send({ error: "Houve um erro ao criar o historico" });
                else
                  res.send({ success: "Certificado atualizado com sucesso" });
              });
          }
        });
      }
    });
  }
});

router.post("/procurar/habilitaredicao", async (req, res) => {
  const { id, id_aluno } = req.body;
  var count_error = 0;

  if (!(id != " ")) count_error += 1;
  if (!(id_aluno != " ")) count_error += 1;
  if (req.session.alunoTabela != id_aluno) count_error += 1;

  if (count_error != 0) res.send({ error: "Ocorreu um erro interno" });
  else {
    Certified.update(
      {
        id_state_foreign: 2,
        updated_at: new Date(),
      },
      {
        where: {
          id,
          id_user_foreign: id_aluno,
        },
      }
    ).then((response) => {
      if (response != 0) {
        hCertified.create({
          action_date_certified: new Date(),
          id_certified_foreign: id,
          id_user_foreign: req.session.user.id,
          type_user: req.session.user.tipo_usuario,
          id_type_action_foreign: 10 /* Habilitar Edição */,
        });
        res.send({ success: "Edição habilitada com sucesso" });
      } else res.send({ error: "Ocorreu um erro interno" });
    });
  }
});

router.post("/procurar/editarcertificado", async (req, res) => {
  const { id, valor, tipo, id_aluno } = req.body;
  var count_error = 0;
  var msg_envio = null;
  var name_tipo = null;

  if (valor == " " && tipo == " " && id == " " && !(valor > 0 && valor <= 70)) {
    count_error += 1;
    msg_envio = "Dados enviados invalidos";
  } else if (!(req.session.user.tipo_usuario <= 2)) {
    count_error += 1;
    msg_envio = "Sem permissão para realizar esta ação";
  }

  await TypeCertified.findByPk(tipo).then((r) => {
    if (r) name_tipo = r.getDataValue("name_type_certified");
  });

  if (name_tipo == null) {
    count_error += 1;
    msg_envio = "Tipo do certificado não encontrado";
  }

  if (count_error != 0) {
    res.send({ error: msg_envio });
  } else {
    await Certified.update(
      {
        value_certified: valor,
        id_type_certified_foreign: tipo,
        updated_at: new Date(),
      },
      {
        where: {
          id: id,
          id_user_foreign: id_aluno,
        },
      }
    ).then((r) => {
      if (r) {
        hCertified.create({
          action_date_certified: new Date(),
          id_certified_foreign: id,
          id_user_foreign: req.session.user.id,
          id_type_action_foreign: 13 /* Editou um Certificado */,
          type_user: req.session.user.tipo_usuario,
        });
        res.send({ success: "Certificado atualizado com sucesso" });
      } else res.send({ error: "Ocorreu um erro interno" });
    });
  }
});

router.post("/procurar/preaprovar", async (req, res) => {
  const { id, aluno } = req.body;
  var count_error = 0;

  if (!(id != " ") && !(aluno != " ")) count_error += 1;
  if (req.session.user.tipo_usuario == 3) count_error += 1;

  if (count_error != 0) req.send({ error: "Erro nos dados enviados" });
  else {
    await Certified.findOne({
      where: {
        id,
        id_user_foreign: aluno,
      },
    }).then((r) => {
      if (r) {
        r.update({
          id_state_foreign: 4,
        }).then((rc) => {
          if (rc) {
            hCertified.create({
              action_date_certified: new Date(),
              id_certified_foreign: id,
              id_user_foreign: aluno,
              id_type_action_foreign: 15 /* Pré-Aprovar Certificado */,
              type_user: req.session.user.tipo_usuario,
            });
            res.send({ success: "Certificao pré-aprovado com sucesso" });
          } else res.send({ error: "Ocorreu um erro interno " });
        });
      } else res.send({ error: "Certificado não encontrado" });
    });
  }
});

router.post("/procurar/setestadoaluno", async (req, res) => {
  var { id, action, aluno } = req.body;
  var count_error = 0;
  var msg_erro = null;
  var msg_succ =
    action == 1 ? "Aluno desativado com sucesso" : "Aluno ativado com sucesso";

  if (!(id != " ") && !(action != " ") && !(aluno != " ")) {
    count_error += 1;
    msg_erro = "Campos de envio estão vazios";
  } else if (id != aluno) {
    count_error += 1;
    msg_erro = "Dados do aluno incorretos";
  } else if (!(action >= 0 && action <= 1)) {
    count_error += 1;
    msg_erro = "Ação inexistente";
  }

  if (count_error != 0) {
    res.send({ error: msg_erro });
  } else {
    await User.findByPk(id).then((r) => {
      if (r) {
        r.update({
          flag_user: action,
        }).then((ru) => {
          if (ru) {
            res.send({ success: msg_succ });
          } else {
            res.send({ error: "Ocorreu um erro ao atualizar o aluno" });
          }
        });
      } else {
        res.send({ error: "Aluno não encontrado" });
      }
    });
  }
});
/* Certificados */

/* Aluno */
router.post("/procurar/alteraraluno", async (req, res) => {
  var { id, id_aluno, acao } = req.body;
  var count_error = 0;
  var acao = acao != 1 ? 3 : 1;

  if (!(id != " ")) count_error += 1;
  if (req.session.alunoTabela != id_aluno) count_error += 1;
  if (id != id_aluno) count_error += 1;

  if (count_error != 0)
    res.status(200).json({ error: "Ocorreu um erro nos dados enviados" });
  else {
    await User.update(
      {
        id_state_foreign: acao,
        updated_at: new Date(),
      },
      {
        where: {
          id,
        },
      }
    ).then((response) => {
      if (response) {
        if (acao == 1) {
          hUser.create({
            action_data_user: new Date(),
            id_type_action_foreign: 5 /* Aluno Aprovado com sucesso */,
            id_user_foreign: id_aluno,
          });
          res.send({ success: "Aluno aprovado com sucesso" });
        } else {
          hUser.create({
            action_data_user: new Date(),
            id_type_action_foreign: 6 /* Aluno Reprovado com sucesso */,
            id_user_foreign: id_aluno,
          });
          res.send({ success: "Aluno reprovado com sucesso" });
        }
      } else res.send({ error: "Ocorreu um erro interno" });
    });
  }
});

router.post("/procurar/habilitaraluno", async (req, res) => {
  const { id, id_aluno } = req.body;
  var count_error = 0;

  if (!(id != " ")) count_error += 1;
  if (!(id_aluno != " ")) count_error += 1;
  if (req.session.alunoTabela != id_aluno) count_error += 1;
  if (id != id_aluno) count_error += 1;

  if (count_error != 0) res.send({ error: "Ocorreu um erro interno" });
  else {
    User.update(
      {
        id_state_foreign: 2,
        updated_at: new Date(),
      },
      {
        where: {
          id,
        },
      }
    ).then((response) => {
      if (response != 0) {
        hUser.create({
          action_data_user: new Date(),
          id_type_action_foreign: 7 /* Habilitar edicao do aluno */,
          id_user_foreign: id_aluno,
        });
        res.send({ success: "Edição habilitada com sucesso" });
      } else res.send({ error: "Ocorreu um erro interno" });
    });
  }
});

router.post("/procurar/editarsemestre", async (req, res) => {
  var { id, semestre } = req.body;
  var count_error = 0;

  if (!(id != " ")) count_error += 1;

  var horas;
  await Variables.findByPk(semestre).then((r) => {
    if (r) {
      horas = r.value_variable;
    } else {
      count_error += 1;
    }
  });

  if (count_error != 0)
    res.send({ error: "Ocorreu um erro nos dados enviado" });
  else {
    await User.findOne({
      where: {
        id,
      },
    }).then((r) => {
      if (r) {
        r.update({
          half_user: semestre,
          total_hours_user: horas,
        }).then((ru) => {
          if (ru) {
            hUser.create({
              action_data_user: new Date(),
              id_type_action_foreign: 16 /* Horas necessarias alteradas */,
              id_user_foreign: id,
            });
            res.send({ success: "Semestre do aluno atualizado com sucesso" });
          } else
            res.send({
              error: "Ocorreu um erro ao atualizar o semestre do aluno",
            });
        });
      } else res.send({ error: "Aluno não encontrado" });
    });
  }
});
/* Aluno */

/* Listagem de Alunos */
router.get("/listagem", async (req, res) => {
  var cont = 1;
  var cont2 = 0;
  var cont3 = 0;
  var semestre = [];
  var user_semestre;
  var user_all;
  var listagem =
    req.session.mostrarListagemSemestre != undefined
      ? req.session.mostrarListagemSemestre
      : 1;
  while (cont <= 8) {
    semestre.push({
      value: cont,
    });
    cont++;
  }

  if (listagem) {
    await User.findAll({
      where: {
        half_user: listagem,
        flag_user: {
          [Op.eq]: 0,
        },
        id_activation_state_foreign: 1,
        id_type_user_foreign: 3
      },
    }).then((r) => {
      if (r) {
        user_semestre = r.map((u) => {
          cont2 += 1;
          return Object.assign(
            {},
            {
              id: cont2,
              id_aluno: u.id,
              nome: u.name_user,
              semestre: u.half_user,
              estado: u.id_state_foreign,
            }
          );
        });
      }
    });
  }

  await User.findAll({
    where: {
      flag_user: {
        [Op.eq]: 0,
      },
      id_activation_state_foreign: 1,
      id_type_user_foreign: 3
    },
  }).then((r) => {
    if (r) {
      user_all = r.map((u) => {
        cont3 += 1;
        return Object.assign(
          {},
          {
            id: cont3,
            id_aluno: u.id,
            nome: u.name_user,
            semestre: u.half_user,
            estado: u.id_state_foreign,
          }
        );
      });
    }
  });

  res.render("listagem", {
    js: "controllers_js/listagem.js",
    style: "controllers_css/dashboard.css",
    title: "UniCertified | Listagem",
    user: req.session.user,
    breadcrumb: `Listagem`,
    semestre,
    user_semestre,
    user_all,
  });
});

router.post("/listagem/semestre", async (req, res) => {
  var id = req.body.id;

  var count_error = 0;
  if (!(id >= 1 && id <= 8)) count_error += 1;

  if (count_error != 0) res.send({ error: "Semestre nao existente" });
  else {
    req.session.mostrarListagemSemestre = id;
    res.send({ success: "Tabela sendo criada" });
  }
});
/* Listagem de Alunos */

/* Listagem Desativados */

router.get("/desativados", async (req, res) => {
  var UserD;
  await User.findAll({
    where: {
      flag_user: 1,
      id_activation_state_foreign: 1
    },
    include: [
      {
        model: State,
        required: true,
      },
    ],
  }).then((r) => {
    UserD = r.map((e) => {
      return Object.assign(
        {},
        {
          id: e.id,
          nome: e.name_user,
          id_estado: e.state.id,
          estado: e.state.name_state,
        }
      );
    });
  });

  res.render("desativados", {
    js: "controllers_js/desativados.js",
    style: "controllers_css/dashboard.css",
    title: "UniCertified | Alunos Desativados",
    user: req.session.user,
    breadcrumb: `Desativados`,
    UserD,
  });
});

router.post("/desativados/ativaraluno", async (req, res) => {
  var { id } = req.body;
  var count_error = 0;

  if (!(id != " ")) count_error += 1;

  if (count_error != 0) {
    res.send({ error: "Ocorreu um erro nos dados enviado" });
  } else {
    await User.findByPk(id).then((r) => {
      if (r) {
        r.update({
          flag_user: 0,
        }).then((ru) => {
          if (ru) {
            res.send({ success: "Usuario ativado com sucesso" });
          } else {
            res.send({ error: "Ocorreu um erro ao ativar o aluno" });
          }
        });
      } else {
        res.send({ error: "Usuario nao encontrado" });
      }
    });
  }
});

module.exports = (app) => app.use("/admin", router);
