$(() => {
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

    $('.ui.form.editarTiposForm')
        .form({
            inline: true,
            on: 'blur',
            fields: {
                nome: {
                    identifier: 'nome',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Informe um nome'
                        },
                        {
                            type: 'minLength[2]',
                            prompt: 'O nome deve conter no minimo 2 caracteres.'
                        },
                        {
                            type: 'maxLength[45]',
                            prompt: 'O nome deve conter no máximo 45 caracteres.'
                        }
                    ]
                },
                valor1: {
                    identifier: 'valor1',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Informe um valor'
                        },
                        {
                            type: 'integer[1..40]',
                            prompt: 'Informe um valor inteiro entre (1-40)'
                        },
                    ]
                },
                valor2: {
                    identifier: 'valor2',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Informe um valor'
                        },
                        {
                            type: 'integer[1..40]',
                            prompt: 'Informe um valor inteiro entre (1-40)'
                        },
                    ]
                },
                valor3: {
                    identifier: 'valor3',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Informe um valor'
                        },
                        {
                            type: 'integer[1..40]',
                            prompt: 'Informe um valor inteiro entre (1-40)'
                        },
                    ]
                },
            }
        })
    
    $('.ui.form.criarTiposForm')
        .form({
            inline: true,
            on: 'blur',
            fields: {
                nome: {
                    identifier: 'nome_c',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Informe um nome'
                        },
                        {
                            type: 'minLength[2]',
                            prompt: 'O nome deve conter no minimo 2 caracteres.'
                        },
                        {
                            type: 'maxLength[45]',
                            prompt: 'O nome deve conter no máximo 45 caracteres.'
                        }
                    ]
                },
                valor1: {
                    identifier: 'valor1_c',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Informe um valor'
                        },
                        {
                            type: 'integer[1..40]',
                            prompt: 'Informe um valor inteiro entre (1-40)'
                        },
                    ]
                },
                valor2: {
                    identifier: 'valor2_c',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Informe um valor'
                        },
                        {
                            type: 'integer[1..40]',
                            prompt: 'Informe um valor inteiro entre (1-40)'
                        },
                    ]
                },
                valor3: {
                    identifier: 'valor3_c',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Informe um valor'
                        },
                        {
                            type: 'integer[1..40]',
                            prompt: 'Informe um valor inteiro entre (1-40)'
                        },
                    ]
                },
            }
        })
        

    $('.button.criarTipo').on('click', function(){
        var nome = $('input[name="nome_c"]')
        var valor1 = $('input[name="valor1_c"]')
        var valor2 = $('input[name="valor2_c"]')
        var valor3 = $('input[name="valor3_c"]')
        var formCriar = $('.ui.form.criarTiposForm')

        $('.ui.modal.tiny.criarTipo').modal({
            closable: false,
            onDeny:()=>{
                return true
            },
            onApprove:()=>{
                if(formCriar.form('is valid')){
                    $.post('/sistema/tipos/criar', {
                        nome: nome.val(),
                        valor1: valor1.val(),
                        valor2: valor2.val(),
                        valor3: valor3.val()
                    }, r => {
                        if(r.success){
                            swal({
                                closeOnEsc: false,
                                closeOnClickOutside: false,
                                title: r.success,
                                icon: "success",
                            }).then(() =>{
                                location.reload()
                            })
                        }else{
                            swal({
                                closeOnEsc: false,
                                closeOnClickOutside: false,
                                title: r.error,
                                icon: "error",
                            })
                        }
                    })
                }else
                    return false
                
                return true
            }
        }).modal('show')    
    })

    $('.button.editarTipo').on('click', function(){
        var id = $(this).data('id')
        var trs = $(this).closest('tr')
        var tds = trs[0].cells
        var formTipo = $('.ui.form.editarTiposForm')
        var inputNome =  $('input[name="nome"]')
        var inputValor1 =  $('input[name="valor1"]')
        var inputValor2 =  $('input[name="valor2"]')
        var inputValor3 =  $('input[name="valor3"]')

        inputNome.val(tds[0].textContent)
        inputValor1.val(tds[1].textContent)
        inputValor2.val(tds[2].textContent)
        inputValor3.val(tds[3].textContent)

        $('.ui.modal.tiny.editarTipo').modal({
            closable: false,
            onDeny:()=>{
                return true
            },
            onApprove:()=>{
                if(formTipo.form('is valid')){
                    $.post('/sistema/tipos/alterar', {
                        id, 
                        nome: inputNome.val(),
                        valor1: inputValor1.val(),
                        valor2: inputValor2.val(),
                        valor3: inputValor3.val()
                    }, r => {
                        if(r.success){
                            swal({
                                closeOnEsc: false,
                                closeOnClickOutside: false,
                                title: r.success,
                                icon: "success",
                            }).then(() =>{
                                location.reload()
                            })
                        }else{
                            swal({
                                closeOnEsc: false,
                                closeOnClickOutside: false,
                                title: r.error,
                                icon: "error",
                            })
                        }
                    })
                }else
                    return false
                
                return true
            }
        }).modal('show')

    })
})