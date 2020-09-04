$(".ui.large.form.login").form({
  inline: true,
  on: "blur",
  fields: {
    email: {
      identifier: "login_email",
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
      identifier: "login_senha",
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
  },
});

$(".ui.large.form.login").submit(function (event) {
  event.preventDefault();
  let formLogin = $(".ui.large.form.login");

  if (formLogin.form("is valid")) {
    $.post(
      "/login/auth",
      {
        email_usuario: $("input[name='login_email']").val(),
        senha_usuario: $("input[name='login_senha']").val(),
      },
      (response_login) => {
        if (response_login.error) {
          swal({
            title: response_login.error,
            icon: "error",
          });
        } else window.location.replace(response_login.link);
      }
    );
  }
});
