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

  $(".ui.celled.table.moderadores").DataTable({
    language: {
      search: '<div class="ui small input focus">',
      searchPlaceholder: "Search...",
    },
    searching: true,
    lengthChange: false,
    pageLength: 9,
  });

  $(".ui.celled.table.usuarios").DataTable({
    language: {
      search: '<div class="ui small input focus">',
      searchPlaceholder: "Search...",
    },
    searching: true,
    lengthChange: false,
    pageLength: 9,
  });

  $(".addModerador").on("click", function () {
    var id = $(this).data("id");
    $.post("/sistema/moderadores/alterar", { id, tipo_acao: 1 }, (r) => {
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

  $(".removeModerador").on("click", function () {
    var id = $(this).data("id");
    $.post("/sistema/moderadores/alterar", { id, tipo_acao: 0 }, (r) => {
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
