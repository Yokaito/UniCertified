$(document).ready(function () {
  $(".ui.dropdown").dropdown({
    action: (text, id) => {
      $.post("/admin/listagem/semestre", { id }, (r) => {
        if (r.success) {
          location.reload();
        }
      });
    },
  });
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

  $(".redirecionaTabela").on("click", function () {
    var id = $(this).data("id");
    $.post("/admin/procurar/criartabela", { id }, (response) => {
      if (response.success) window.location.href = "/admin/procurar";
    });
  });

  $("#tabela_semestre").DataTable({
    searching: false,
    lengthChange: false,
    pageLength: 8,
  });
  $("#tabela_all").DataTable({
    language: {
      search: '<div class="ui small input focus">',
      searchPlaceholder: "Search...",
    },
    searching: true,
    lengthChange: false,
    pageLength: 8,
  });
});
