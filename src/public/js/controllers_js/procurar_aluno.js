$(document).ready(function () {
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

  $(".ui.form.editarCertificadoForm").form({
    inline: true,
    on: "blur",
    fields: {
      valor: {
        identifier: "new_valor_certificado",
        rules: [
          {
            type: "empty",
            prompt: "Informe um valor",
          },
          {
            type: "integer[1..40]",
            prompt: "Informe um valor inteiro entre (0-40)",
          },
        ],
      },
      tipo_certificado: {
        identifier: "new_tipo_certificado",
        rules: [
          {
            type: "empty",
            prompt: "Escolha um tipo",
          },
        ],
      },
    },
  });

  $(".ui.form.alterarEstado").form({
    inline: true,
    on: "blur",
    fields: {
      nome: {
        identifier: "comentario",
        rules: [
          {
            type: "empty",
            prompt: "Informe um comentario",
          },
          {
            type: "maxLength[350]",
            prompt: "O nome deve conter no máximo 40 caracteres.",
          },
        ],
      },
    },
  });

  $(".ui.form.editarSemestreForm").form({
    inline: true,
    on: "blur",
    fields: {
      semestre: {
        identifier: "semestre_new",
        rules: [
          {
            type: "empty",
            prompt: "Informe um semestre",
          },
        ],
      },
    },
  });

  $(".ui.search").search({
    /* source : content, */
    minCharacters: 3,
    cache: true,
    apiSettings: {
      url: "/admin/procurar/alunos?q={query}",
    },
    fields: {
      results: "user",
      description: "email",
      title: "name",
    },
    onSelect: function (result, response) {
      $.post(
        "/admin/procurar/criartabela",
        { id: result.id },
        (postResponse) => {
          location.reload();
        }
      );
    },
  });

  $(".mostrarImagemCertificado").on("click", function () {
    var urlFoto = $(this).attr("data-foto");
    var tipoFoto = $(this).data("type");
    if (tipoFoto == "pdf") {
      $(".modificarPDF").attr("src", urlFoto);
      $(".ui.basic.modal.mostrarPDF").modal("show");
    } else {
      $(".modificarImagem").attr("src", urlFoto);
      $(".ui.basic.modal.mostrarImagem").modal("show");
    }
  });

  $("button.habilitarEdicao").on("click", function () {
    var id = $(this).data("id");
    var id_aluno = $(".header.dataid").data("id");
    $(".ui.mini.modal.habilitarEdicao")
      .modal({
        onDeny: function () {
          return true;
        },
        onApprove: function () {
          $.post(
            "/admin/procurar/habilitaredicao",
            { id, id_aluno },
            (response) => {
              if (response.success) {
                swal({
                  closeOnEsc: false,
                  closeOnClickOutside: false,
                  title: response.success,
                  icon: "success",
                }).then(() => {
                  $.post(
                    "/admin/procurar/criartabela",
                    { id: id_aluno },
                    (response) => {
                      location.reload();
                    }
                  );
                });
              } else {
                swal({
                  closeOnEsc: false,
                  closeOnClickOutside: false,
                  title: response.error,
                  icon: "error",
                });
              }
            }
          );
          return true;
        },
      })
      .modal("show");
  });

  $("button.reprovarC").on("click", function () {
    var id = $(this).data("id");
    var comentario = $('textarea[name="comentario"]');
    var id_aluno = $(".header.dataid").data("id");

    $(".ui.mini.modal.alterarEstado")
      .modal({
        onDeny: () => {
          comentario.val(" ");
          return true;
        },
        onApprove: () => {
          if ($(".ui.form.alterarEstado").form("is valid")) {
            $.post(
              "/admin/procurar/alterarestado",
              { id, comentario: comentario.val(), acao: 0, id_aluno },
              (r) => {
                if (r.success) {
                  swal({
                    closeOnEsc: false,
                    closeOnClickOutside: false,
                    title: r.success,
                    icon: "success",
                  }).then(() => {
                    $.post(
                      "/admin/procurar/criartabela",
                      { id: id_aluno },
                      (response) => {
                        location.reload();
                      }
                    );
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

          comentario.val(" ");
          return true;
        },
      })
      .modal("show");
  });

  $("button.aprovarC").on("click", function () {
    var id = $(this).data("id");
    var id_aluno = $(".header.dataid").data("id");

    $.post("/admin/procurar/alterarestado", { id, acao: 1, id_aluno }, (r) => {
      if (r.success) {
        swal({
          closeOnEsc: false,
          closeOnClickOutside: false,
          title: r.success,
          icon: "success",
        }).then(() => {
          $.post(
            "/admin/procurar/criartabela",
            { id: id_aluno },
            (response) => {
              location.reload();
            }
          );
        });
      } else {
        swal({
          closeOnEsc: false,
          closeOnClickOutside: false,
          title: response.error,
          icon: "error",
        });
      }
    });
  });

  $("button.alterarAluno").on("click", function () {
    var id = $(this).data("id");
    var id_aluno = $(".header.dataid").data("id");

    $(".ui.mini.modal.alterarAluno")
      .modal({
        onDeny: function () {
          $.post(
            "/admin/procurar/alteraraluno",
            { id, id_aluno, acao: 0 },
            (response) => {
              if (response.success) {
                swal({
                  closeOnEsc: false,
                  closeOnClickOutside: false,
                  title: response.success,
                  icon: "success",
                }).then(() => {
                  $.post(
                    "/admin/procurar/criartabela",
                    { id: $(".header.dataid").data("id") },
                    (response) => {
                      location.reload();
                    }
                  );
                });
              } else {
                swal({
                  closeOnEsc: false,
                  closeOnClickOutside: false,
                  title: response.error,
                  icon: "error",
                });
              }
            }
          );
          return true;
        },
        onApprove: function () {
          $.post(
            "/admin/procurar/alteraraluno",
            { id, id_aluno, acao: 1 },
            (response) => {
              if (response.success) {
                swal({
                  closeOnEsc: false,
                  closeOnClickOutside: false,
                  title: response.success,
                  icon: "success",
                }).then(() => {
                  $.post(
                    "/admin/procurar/criartabela",
                    { id: $(".header.dataid").data("id") },
                    (response) => {
                      location.reload();
                    }
                  );
                });
              } else {
                swal({
                  closeOnEsc: false,
                  closeOnClickOutside: false,
                  title: response.error,
                  icon: "error",
                });
              }
            }
          );
          return true;
        },
      })
      .modal("show");
  });

  $("button.habilitarEdicaoAluno").on("click", function () {
    var id = $(this).data("id");
    var id_aluno = $(".header.dataid").data("id");

    $(".ui.mini.modal.habilitarEdicaoAluno")
      .modal({
        onDeny: function () {
          return true;
        },
        onApprove: function () {
          $.post(
            "/admin/procurar/habilitaraluno",
            { id, id_aluno },
            (response) => {
              if (response.success) {
                swal({
                  closeOnEsc: false,
                  closeOnClickOutside: false,
                  title: response.success,
                  icon: "success",
                }).then(() => {
                  $.post(
                    "/admin/procurar/criartabela",
                    { id: id_aluno },
                    (response) => {
                      location.reload();
                    }
                  );
                });
              } else {
                swal({
                  closeOnEsc: false,
                  closeOnClickOutside: false,
                  title: response.error,
                  icon: "error",
                });
              }
            }
          );
          return true;
        },
      })
      .modal("show");
  });

  $(".editarCertificado").on("click", function () {
    var id = $(this).data("id");
    var trs = $(this).closest("tr");
    var tds = trs[0].cells;
    var formCertificado = $(".editarCertificadoForm");
    var id_aluno = $(".header.dataid").data("id");
    var inputValor = $('input[name="new_valor_certificado"]');
    var inputTipo = $('select[name="new_tipo_certificado"]');

    inputValor.val(tds[2].textContent);
    inputTipo.val(tds[3].dataset.type).change();

    $(".ui.modal.tiny.editar")
      .modal({
        closable: false,
        onDeny: () => {
          inputValor.val("");
          return true;
        },
        onApprove: () => {
          if (formCertificado.form("is valid")) {
            $.post(
              "/admin/procurar/editarcertificado",
              {
                id,
                valor: inputValor.val(),
                tipo: inputTipo.val(),
                id_aluno,
              },
              (r) => {
                if (r.success) {
                  inputValor.val(" ");
                  swal({
                    closeOnEsc: false,
                    closeOnClickOutside: false,
                    title: r.success,
                    icon: "success",
                  }).then(() => {
                    $.post(
                      "/admin/procurar/criartabela",
                      { id: id_aluno },
                      (response) => {
                        location.reload();
                      }
                    );
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
            return true;
          }
          return false;
        },
      })
      .modal("show");
  });

  $("button.editarSemestre").on("click", function () {
    var id = $(this).data("id");
    var formSemestre = $(".ui.form.editarSemestreForm");

    $(".ui.modal.tiny.editarSemestre")
      .modal({
        closable: false,
        onDeny: () => {
          return true;
        },
        onApprove: () => {
          if (formSemestre.form("is valid")) {
            $.post(
              "/admin/procurar/editarsemestre",
              { id, semestre: $('select[name="semestre_new"]').val() },
              (r) => {
                if (r.success) {
                  swal({
                    closeOnEsc: false,
                    closeOnClickOutside: false,
                    title: r.success,
                    icon: "success",
                  }).then(() => {
                    $.post(
                      "/admin/procurar/criartabela",
                      { id },
                      (response) => {
                        location.reload();
                      }
                    );
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

  $(".preAprovar").on("click", function () {
    var id = $(this).data("id");
    var aluno = $(".header.dataid").data("id");
    $.post("/admin/procurar/preaprovar", { id, aluno }, (r) => {
      if (r.success) {
        swal({
          closeOnEsc: false,
          closeOnClickOutside: false,
          title: r.success,
          icon: "success",
        }).then(() => {
          $.post("/admin/procurar/criartabela", { id: aluno }, (response) => {
            location.reload();
          });
        });
      } else {
        swal({
          closeOnEsc: false,
          closeOnClickOutside: false,
          title: r.error,
          icon: "error",
        });
      }
    });
  });
});
