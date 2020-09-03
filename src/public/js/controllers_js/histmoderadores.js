$(() => {
    $('.ui.dropdown').dropdown()
    $('.comentario').popup({inline: true });
    $('.sidebar-menu-toggler').on('click', function(){
        var target = $(this).data('target')
        $(target).sidebar({
            dimPage: true,
            transition: 'overlay',
            mobileTransition: 'overlay'
        }).sidebar('toggle')
    })

    $('#tabela_hist_cert').DataTable({
        language: {search: '<div class="ui small input focus">', searchPlaceholder: "Search...",},
        searching: true,
        "lengthChange": false,
        "pageLength": 8
    })
})