$(document).ready(function () {
  $(".ui.dropdown").dropdown();
  $(".comentario").popup({ inline: true });
  $(".sidebar-menu-toggler").on("click", function () {
    var target = $(this).data("target");
    $(target)
      .sidebar({
        dimPage: true,
        transition: "overlay",
        mobileTransition: "overlay",
      })
      .sidebar("toggle");
  });

  $("#tabela_historico").DataTable({
    searching: false,
    lengthChange: false,
    pageLength: 5,
  });

  $("#tabela_historico2").DataTable({
    searching: false,
    lengthChange: false,
    pageLength: 5,
  });

  $(".ui.form.atualizarAlunoF").form({
    inline: true,
    on: "blur",
    fields: {
      nome: {
        identifier: "name_user",
        rules: [
          {
            type: "empty",
            prompt: "Informe um nome",
          },
          {
            type: "minLength[5]",
            prompt: "O nome deve conter no mínimo 5 caracteres.",
          },
          {
            type: "maxLength[40]",
            prompt: "O nome deve conter no máximo 40 caracteres.",
          },
        ],
      },
      semestre: {
        identifier: "semestre",
        rules: [
          {
            type: "empty",
            prompt: "Escolha um tipo",
          },
        ],
      },
    },
  });

  $(".atualizarAluno").on("click", function () {
    var nome = $('input[name="name_user"]').val();
    var semestre = $('select[name="semestre"]').val();
    var id = $(this).data("id");
    var formAtualizar = $(".ui.form.atualizarAlunoF");
    if (formAtualizar.form("is valid")) {
      $.post("/dashboard/perfil/atualizar", { id, nome, semestre }, (r) => {
        if (r.success) {
          swal({
            closeOnEsc: false,
            closeOnClickOutside: false,
            title: r.success,
            icon: `success`,
          }).then(() => {
            location.reload();
          });
        } else {
          swal({
            closeOnEsc: false,
            closeOnClickOutside: false,
            title: r.error,
            icon: `error`,
          });
        }
      });
    }
  });
});
