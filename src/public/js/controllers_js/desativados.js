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

  $(".redirecionaTabela").on("click", function () {
    var id = $(this).data("id");
    $.post("/admin/procurar/criartabela", { id }, (response) => {
      if (response.success) window.location.href = "/admin/procurar";
    });
  });

  $(".ui.celled.table.desativados").DataTable({
    language: {
      search: '<div class="ui small input focus">',
      searchPlaceholder: "Search...",
    },
    searching: true,
    lengthChange: false,
    pageLength: 10,
  });

  $(".retirarDesativado").on("click", function () {
    var id = $(this).data("id");
    $.post("/admin/desativados/ativaraluno", { id }, (r) => {
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
    });
  });
});
