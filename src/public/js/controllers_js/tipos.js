$(() => {
  $(".ui.dropdown").dropdown();
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
  $(".comentario").popup({
    inline: true,
  });

  $(".ui.form.editarTiposForm").form({
    inline: true,
    on: "blur",
    fields: {
      nome: {
        identifier: "nome",
        rules: [
          {
            type: "empty",
            prompt: "Informe um nome",
          },
          {
            type: "minLength[2]",
            prompt: "O nome deve conter no minimo 2 caracteres.",
          },
          {
            type: "maxLength[45]",
            prompt: "O nome deve conter no máximo 45 caracteres.",
          },
        ],
      },
    },
  });

  $(".ui.form.criarTiposForm").form({
    inline: true,
    on: "blur",
    fields: {
      nome: {
        identifier: "nome_c",
        rules: [
          {
            type: "empty",
            prompt: "Informe um nome",
          },
          {
            type: "minLength[2]",
            prompt: "O nome deve conter no minimo 2 caracteres.",
          },
          {
            type: "maxLength[45]",
            prompt: "O nome deve conter no máximo 45 caracteres.",
          },
        ],
      },
    },
  });

  $(".button.criarTipo").on("click", function () {
    var nome = $('input[name="nome_c"]');
    var formCriar = $(".ui.form.criarTiposForm");

    $(".ui.modal.tiny.criarTipo")
      .modal({
        closable: false,
        onDeny: () => {
          return true;
        },
        onApprove: () => {
          if (formCriar.form("is valid")) {
            $.post(
              "/sistema/tipos/criar",
              {
                nome: nome.val(),
              },
              (r) => {
                if (r.success) {
                  swal({
                    closeOnEsc: false,
                    closeOnClickOutside: false,
                    title: r.success,
                    icon: "success",
                  }).then(() => {
                    location.reload();
                  });
                } else {
                  swal({
                    closeOnEsc: false,
                    closeOnClickOutside: false,
                    title: r.error,
                    icon: "error",
                  });
                }
              }
            );
          } else return false;

          return true;
        },
      })
      .modal("show");
  });

  $(".button.editarTipo").on("click", function () {
    var id = $(this).data("id");
    var trs = $(this).closest("tr");
    var tds = trs[0].cells;
    var formTipo = $(".ui.form.editarTiposForm");
    var inputNome = $('input[name="nome"]');

    inputNome.val(tds[0].textContent);

    $(".ui.modal.tiny.editarTipo")
      .modal({
        closable: false,
        onDeny: () => {
          return true;
        },
        onApprove: () => {
          if (formTipo.form("is valid")) {
            $.post(
              "/sistema/tipos/alterar",
              {
                id,
                nome: inputNome.val(),
              },
              (r) => {
                if (r.success) {
                  swal({
                    closeOnEsc: false,
                    closeOnClickOutside: false,
                    title: r.success,
                    icon: "success",
                  }).then(() => {
                    location.reload();
                  });
                } else {
                  swal({
                    closeOnEsc: false,
                    closeOnClickOutside: false,
                    title: r.error,
                    icon: "error",
                  });
                }
              }
            );
          } else return false;

          return true;
        },
      })
      .modal("show");
  });
});
