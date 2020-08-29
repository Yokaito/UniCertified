$(document).ready(function(){
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

    $('.ui.form.editarVariavelForm')
        .form({
            inline: true,
            on: 'blur',
            fields: {
                nome: {
                    identifier: 'new_nome_variable',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Informe um nome'
                        },
                        {
                            type: 'minLength[5]',
                            prompt: 'O nome deve conter no minimo 5 caracteres.'
                        },
                        {
                            type: 'maxLength[50]',
                            prompt: 'O nome deve conter no máximo 50 caracteres.'
                        }
                    ]
                },
                valor: {
                    identifier: 'new_value_variable',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Informe um valor'
                        },
                        {
                            type   : 'integer[1..1000]',
                            prompt : 'Informe um valor inteiro entre (0-1000)'
                        }
                    ]
                }                
            }
    })  

    $('.editarVariavel').on('click', function(){
        var id = $(this).data('id')
        var trs = $(this).closest('tr')
        var tds = trs[0].cells
        var inputNome =  $('input[name="new_nome_variable"]')
        var inputValor = $('input[name="new_value_variable"]')

        inputNome.val(tds[1].textContent)
        inputValor.val(tds[2].textContent) 

        $('.ui.modal.tiny.editar').modal({
            closable : false,
            onDeny:function(){  
                inputNome.val('')           
                inputValor.val('')        
                return true
            },
            onApprove:function(){
                if($('.ui.form.editarVariavelForm').form('is valid')){
                    $.post('/sistema/variaveis/editarvariavel', {id,nome: inputNome.val(), valor: inputValor.val()}, r => {
                        if(r.success){
                            swal({
                                closeOnEsc: false,
                                closeOnClickOutside: false,
                                title: r.success,
                                icon: "success",
                            }).then(() => {
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

                inputNome.val('')           
                inputValor.val('') 
                return true
            }
        }).modal('show')
    })
})