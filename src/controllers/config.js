import express from "express";
import type_user from "../models/type_user";
import activation_state from "../models/activation_state";
import state from "../models/state";
import type_action from "../models/type_action";

const router = express.Router();

router.get("/", async (req, res) => {
  res.render("config", {
    title: "UniCertified | Config",
    style: "login.css",
  });
});

router.post("/type_user", async (req, res) => {
  const data = req.body;

  await type_user
    .create({
      name_type_user: data.cadastro_type_user,
    })
    .then((data) => {
      if (data) {
        res.redirect("/config");
      } else console.log(`Status: 400 - Erro ao inserir`);
    });
});

router.post("/activation_state", async (req, res) => {
  const data = req.body;

  await activation_state
    .create({
      name_activation_state: data.cadastro_activation_state,
    })
    .then((data) => {
      if (data) res.redirect("/config");
      else console.log("Status: 400 - Erro ao inserir");
    });
});

router.post("/state", async (req, res) => {
  const data = req.body;

  await state
    .create({
      name_state: data.cadastro_state,
    })
    .then((data) => {
      if (data) res.redirect("/config");
      else res.redirect(400, "/config");
    });
});

router.post("/type_action", async (req, res) => {
  const data = req.body;

  await type_action
    .create({
      name_type_action: data.cadastro_type_action,
    })
    .then((data) => {
      if (data) {
        res.redirect("/config");
      } else res.redirect(400, "/config");
    });
});

module.exports = (app) => app.use("/config", router);
