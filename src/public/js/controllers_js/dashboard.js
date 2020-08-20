function clicks(){
    $('.deletarCertificado').on('click', function(){
        var id = $(this).data("id")
        $('.ui.mini.modal.delete')
            .modal({
                closable  : false,
                onDeny    : function(){
                    return true;
                },
                onApprove : function() {
                    $.post('/dashboard/certificado/deletacertificado', {id}, 
                        (response) => {
                            if(response.success){
                                swal({
                                    closeOnEsc: false,
                                    closeOnClickOutside: false,
                                    title: response.success,
                                    icon: "success",
                                }).then((value) =>{
                                    location.reload()
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
                }
            })
            .modal('show')
        ;
    })

    $('.editarCertificado').on('click', function(){
        var id = $(this).data('id')
        var trs = $(this).closest('tr')
        var tds = trs[0].cells
        console.log(id);
        console.log(tds[1].textContent);
        console.log(tds[2].textContent);
        console.log(tds[3].textContent);
    })
}    

$(document).ready(function(){
    clicks()
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
    
    $('.ui.form.cadastrarCertificado')
        .form({
            inline: true,
            on: 'blur',
            fields: {
                nome: {
                    identifier: 'nome_certificado',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Informe um nome'
                        },
                        {
                            type: 'minLength[5]',
                            prompt: 'O nome deve conter no mínimo 5 caracteres.'
                        },
                        {
                            type: 'maxLength[45]',
                            prompt: 'O nome deve conter no máximo 40 caracteres.'
                        }
                    ]
                },
                valor: {
                    identifier: 'valor_certificado',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Informe um valor'
                        },
                        {
                            type   : 'integer[1..40]',
                            prompt : 'Informe um valor inteiro entre (0-40)'
                        }
                    ]
                },
                file: {
                    identifier: 'file',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Envie uma foto do certificado.'
                        }
                    ]
                },
                tipo_certificado: {
                    identifier: 'tipo_certificado',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Escolha um tipo'
                        }
                    ]
                }
            }
        })    

    $('.novoCertificado').on('click', function(){
        var formCertificado = $('.cadastrarCertificado')       
        $('.ui.modal.tiny.criar')
            .modal({
                closable  : false,
                onDeny    : function(){
                    $("input[name='nome_certificado']").val('')
                    $("input[name='valor_certificado']").val('')
                    return true;
                },
                onApprove : function() {                    
                    if(formCertificado.form('is valid')){
                        var data = new FormData($('.cadastrarCertificado')[0])
                        data.set('nome_certificado', $('input[name="nome_certificado"]').val())
                        data.set('valor_certificado', $("input[name='valor_certificado']").val())
                        data.set('tipo_certificado', $('select[name=tipo_certificado]').val())
                        $.ajax({
                            type: 'POST',
                            url: "/dashboard/certificado/newcertificado",  
                            data: data,  
                            processData: false, 
                            contentType: false, 
                            success: function (response){
                                if(response.success){
                                    swal({
                                        closeOnEsc: false,
                                        closeOnClickOutside: false,
                                        title: response.success,
                                        icon: "success",
                                    }).then((value) =>{
                                        location.reload()
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
                        })
                        $("input[name='nome_certificado']").val('')
                        $("input[name='valor_certificado']").val('')
                        return true
                    }
                    return false                    
                }
            })
            .modal('show')
        ;
    });    
    
    $('.mostrarImagemCertificado').on('click', function(){
        var urlFoto = $(this).attr('data-foto')
        $('.modificarImagem').attr('src', urlFoto)
        $('.ui.basic.modal.mostrarImagem').modal('show')
    })    
})