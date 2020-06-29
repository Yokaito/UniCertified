$('.ui.large.form.recuperar')
  .form({
    inline : true,
    on     : 'blur',
    fields: {
      email: {
        identifier: 'recuperar_email',
        rules: [
            {
                type   : 'empty',
                prompt : 'Informe um email.'
            },
            {
                type: 'email',
                prompt: 'Informe um email valido.'          
            },
            {
                type: 'minLength[5]',
                prompt: 'O email deve conter no mínimo 5 caracteres.'
            },
            {
                type: 'maxLength[40]',
                prompt: 'O email deve conter no máximo 40 caracteres.'
            }
          ]
      }
    }
  })
;

$('.ui.large.form.recuperar').submit(function(event){
    event.preventDefault()
    let formRecuperar = $('.ui.large.form.recuperar')

    if(formRecuperar.form('is valid')){
        $.post('/registro/recuperar_senha/auth', 
            {
                email_usuario: $("input[name='recuperar_email']").val(),
                
            }, 
            (response) => {
                if(response.success){
                    swal({
                        closeOnEsc: false,
                        closeOnClickOutside: false,
                        title: response.success,
                        icon: "success",
                    }).then((value) => {
                        swal({
                            closeOnEsc: false,
                            closeOnClickOutside: false,
                            title: 'Código enviado',
                            text: 'Um email para alterar sua senha foi enviado',
                            icon: 'info'
                        }).then((value2) => { 
                           if(value2) 
                            window.location.replace(response.link);
                        })   

                    })
                }else{
                    swal({
                        closeOnEsc: false,
                        closeOnClickOutside: false,
                        title: response.error,
                        icon: 'error'
                    })
                }
            }
        )
    }
     
    
})