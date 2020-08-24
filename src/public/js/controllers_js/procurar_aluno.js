$( document ).ready(function() {
    $('.ui.dropdown').dropdown()
    $('.sidebar-menu-toggler').on('click', function(){
        var target = $(this).data('target')
        $(target).sidebar({
            dimPage: true,
            transition: 'overlay',
            mobileTransition: 'overlay'
        }).sidebar('toggle')
    })   

    $('.comentario')
        .popup({
            inline: true
        })
    ;

    $('.ui.form.alterarEstado')
        .form({
            inline: true,
            on: 'blur',
            fields: {
                nome: {
                    identifier: 'comentario',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Informe um nome'
                        },
                        {
                            type: 'maxLength[350]',
                            prompt: 'O nome deve conter no máximo 40 caracteres.'
                        }
                    ]
                },
            }
        })

    $('.ui.search').search({
            /* source : content, */
            minCharacters: 3,
            cache: true,
            apiSettings: {
                url: '/admin/procurar/alunos?q={query}',                       
            },
            fields: {
                results : 'user',
                description: 'email',
                title: 'name',                
            },
            onSelect: function(result, response){
                $.post('/admin/procurar/criartabela', {id: result.id}, (postResponse) => {
                    location.reload()
                })
            }
        },
    )
    ;

    $('.mostrarImagemCertificado').on('click', function(){
        var urlFoto = $(this).attr('data-foto')
        if(urlFoto == 'http://localhost:3000/tmp/uploads/'){
            swal({
                closeOnEsc: false,
                closeOnClickOutside: false,
                title: 'Ocorreu algum erro ao tentar exibir a imagem',
                icon: "error",
            })
        }else{
            $('.modificarImagem').attr('src', urlFoto)
            $('.ui.basic.modal.mostrarImagem').modal('show')
        }    
    })

    $('button.habilitarEdicao').on('click', function(){
        var id = $(this).data('id')
        var id_aluno = $('.header.dataid').data('id')
        $('.ui.mini.modal.habilitarEdicao')
            .modal({
                onDeny:function(){
                    return true
                },
                onApprove:function(){
                    $.post('/admin/procurar/habilitaredicao',
                    {id, id_aluno},
                    response => {
                        if(response.success){
                            swal({
                                closeOnEsc: false,
                                closeOnClickOutside: false,
                                title: response.success,
                                icon: "success",
                            }).then(() => {
                                $.post('/admin/procurar/criartabela', 
                                    {id: id_aluno},
                                    (response) => {
                                        location.reload()
                                    })
                            })
                        }else{
                            swal({
                                closeOnEsc: false,
                                closeOnClickOutside: false,
                                title: response.error,
                                icon: "error",
                            })
                        }
                    }    
                    )
                    return true
                }
            }).modal('show')
    })

    $('button.alterarEstado').on('click', function(){
        var id = $(this).data("id")
        var comentario = $('textarea[name="comentario"]')
        var id_aluno = $('.header.dataid').data('id')
        $('.ui.mini.modal.alterarEstado')
            .modal({
                onDeny    : function(){
                    if($('.ui.form.alterarEstado').form('is valid')){
                        $.post('/admin/procurar/alterarestado',{id,comentario: comentario.val(), acao: 0, id_aluno}, (response) => {
                            if(response.success){
                                swal({
                                    closeOnEsc: false,
                                    closeOnClickOutside: false,
                                    title: response.success,
                                    icon: "success",
                                }).then(() =>{
                                    $.post('/admin/procurar/criartabela', 
                                    {id: id_aluno},
                                    (response) => {
                                        location.reload()
                                    })
                                })
                            }else{
                                swal({
                                    closeOnEsc: false,
                                    closeOnClickOutside: false,
                                    title: response.error,
                                    icon: "error",
                                })
                            }
                        })
                    }else
                        return false

                    comentario.val(' ')
                    return true
                },
                onApprove : function() {
                    if($('.ui.form.alterarEstado').form('is valid')){
                        $.post('/admin/procurar/alterarestado',{id,comentario: comentario.val(), acao: 1, id_aluno}, (response) => {
                            if(response.success){
                                swal({
                                    closeOnEsc: false,
                                    closeOnClickOutside: false,
                                    title: response.success,
                                    icon: "success",
                                }).then(() =>{
                                    $.post('/admin/procurar/criartabela', 
                                    {id: id_aluno},
                                    (response) => {
                                        location.reload()
                                    })
                                })
                            }else{
                                swal({
                                    closeOnEsc: false,
                                    closeOnClickOutside: false,
                                    title: response.error,
                                    icon: "error",
                                })
                            }
                        })
                    }else  
                        return false
                    comentario.val(' ')
                }
            }
            ).modal('show');
    })

    $('button.alterarAluno').on('click', function(){
        var id = $(this).data('id')
        var id_aluno = $('.header.dataid').data('id')

        $('.ui.mini.modal.alterarAluno').modal({
            onDeny: function(){
                $.post('/admin/procurar/alteraraluno', {id, id_aluno, acao: 0}, response => {
                    if(response.success){
                        swal({
                            closeOnEsc: false,
                            closeOnClickOutside: false,
                            title: response.success,
                            icon: "success",
                        }).then(() =>{
                            $.post('/admin/procurar/criartabela', 
                            {id: $('.header.dataid').data('id')},
                            (response) => {
                                location.reload()
                            })
                        })
                    }else{
                        swal({
                            closeOnEsc: false,
                            closeOnClickOutside: false,
                            title: response.error,
                            icon: "error",
                        })
                    }
                })
                return true
            },
            onApprove: function(){
                $.post('/admin/procurar/alteraraluno', {id, id_aluno, acao: 1}, response => {
                    if(response.success){
                        swal({
                            closeOnEsc: false,
                            closeOnClickOutside: false,
                            title: response.success,
                            icon: "success",
                        }).then(() =>{
                            $.post('/admin/procurar/criartabela', 
                            {id: $('.header.dataid').data('id')},
                            (response) => {
                                location.reload()
                            })
                        })
                    }else{
                        swal({
                            closeOnEsc: false,
                            closeOnClickOutside: false,
                            title: response.error,
                            icon: "error",
                        })
                    }
                })
                return true
            }
        }).modal('show')

    })

    $('button.habilitarEdicaoAluno').on('click', function(){
        var id = $(this).data('id')
        var id_aluno = $('.header.dataid').data('id')
        
        $('.ui.mini.modal.habilitarEdicaoAluno')
            .modal({
                onDeny:function(){
                    return true
                },
                onApprove:function(){
                    $.post('/admin/procurar/habilitaraluno',
                    {id, id_aluno},
                    response => {
                        if(response.success){
                            swal({
                                closeOnEsc: false,
                                closeOnClickOutside: false,
                                title: response.success,
                                icon: "success",
                            }).then(() => {
                                $.post('/admin/procurar/criartabela', 
                                    {id: id_aluno},
                                    (response) => {
                                        location.reload()
                                    })
                            })
                        }else{
                            swal({
                                closeOnEsc: false,
                                closeOnClickOutside: false,
                                title: response.error,
                                icon: "error",
                            })
                        }
                    }    
                    )
                    return true
                }
            }).modal('show')
    })
});