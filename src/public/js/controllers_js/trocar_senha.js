$(".ui.large.form.trocar").form({
  inline: true,
  on: "blur",
  fields: {
    email: {
      identifier: "email",
      rules: [
        {
          type: "empty",
          prompt: "Informe um email.",
        },
        {
          type: "email",
          prompt: "Informe um email valido.",
        },
        {
          type: "minLength[5]",
          prompt: "O email deve conter no mínimo 5 caracteres.",
        },
        {
          type: "maxLength[40]",
          prompt: "O email deve conter no máximo 40 caracteres.",
        },
      ],
    },
    senha: {
      identifier: "trocar_senha",
      rules: [
        {
          type: "empty",
          prompt: "Informe uma senha.",
        },
        {
          type: "minLength[5]",
          prompt: "A senha deve conter no mínimo 5 caracteres.",
        },
        {
          type: "maxLength[40]",
          prompt: "A senha deve conter no máximo 40 caracteres.",
        },
      ],
    },
    senha_conf: {
      identifier: "trocar_senha_conf",
      rules: [
        {
          type: "empty",
          prompt: "Confirme a senha.",
        },
        {
          type: "match[trocar_senha]",
          prompt: "A senha deve ser a mesma.",
        },
        {
          type: "minLength[5]",
          prompt: "A senha deve conter no mínimo 5 caracteres.",
        },
        {
          type: "maxLength[40]",
          prompt: "A senha deve conter no máximo 40 caracteres.",
        },
      ],
    },
  },
});

$(".ui.large.form.trocar").submit(function (event) {
  event.preventDefault();
  let formTrocar = $(".ui.large.form.trocar");

  if (formTrocar.form("is valid")) {
    $.post(
      "/registro/recuperar_senha/trocar",
      {
        email_usuario: $("input[name='email']").val(),
        senha_usuario: $("input[name='trocar_senha']").val(),
        senha_conf_usuario: $("input[name='trocar_senha_conf']").val(),
      },
      (response) => {
        console.log(response);
        if (response.success) {
          swal({
            closeOnEsc: false,
            closeOnClickOutside: false,
            title: response.success,
            icon: "success",
          }).then((result) => {
            if (result) window.location.replace(response.link);
          });
        } else {
          swal({
            closeOnEsc: false,
            closeOnClickOutside: false,
            title: response.error,
            text: response.text,
            icon: "error",
          }).then((result) => {
            window.location.replace(response.link);
          });
        }
      }
    );
  }
});
