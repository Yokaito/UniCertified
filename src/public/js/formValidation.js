$('.ui.large.form.register')
  .form({
    inline : true,
    on     : 'blur',
    fields: {
      nome: {
        identifier: 'cadastro_nome',
        rules: [
            {
                type   : 'empty',
                prompt : 'Informe um nome.'
            },
            {
                type: 'minLength[5]',
                prompt: 'O nome deve conter no mínimo 5 caracteres.'
            },
            {
                type: 'maxLength[40]',
                prompt: 'O nome deve conter no máximo 40 caracteres.'
            }
        ]
      },
      email: {
        identifier: 'cadastro_email',
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
                type: 'minLength[15]',
                prompt: 'O email deve conter no mínimo 8 caracteres.'
            },
            {
                type: 'maxLength[40]',
                prompt: 'O email deve conter no máximo 40 caracteres.'
            }
          ]
      },
      email_conf: {
          identifier: 'cadastro_conf_email',
          rules: [
            {
                type   : 'empty',
                prompt : 'Confirme o email.'
            },
            {
                type: 'match[cadastro_email]',
                prompt: 'O email deve ser o mesmo.'
            },
            {
                type: 'email',
                prompt: 'Informe um email.'          
            },
            {
                type: 'minLength[15]',
                prompt: 'O email deve conter no mínimo 8 caracteres.'
            },
            {
                type: 'maxLength[40]',
                prompt: 'O email deve conter no máximo 40 caracteres.'
            }
          ]
      },
      senha: {
          identifier: 'cadastro_senha',
          rules: [
            {
                type: 'empty',
                prompt: 'Informe uma senha.'
            },
            {
                type: 'minLength[5]',
                prompt: 'A senha deve conter no mínimo 5 caracteres.'
            },
            {
                type: 'maxLength[40]',
                prompt: 'A senha deve conter no máximo 40 caracteres.'
            }
          ]
      },
      senha_config: {
          identifier: 'cadastro_conf_senha',
          rules: [
            {
                type   : 'empty',
                prompt : 'Confirme a senha.'
            },
            {
                type: 'match[cadastro_senha]',
                prompt: 'A senha deve ser a mesma.'
            },
            {
                type: 'minLength[5]',
                prompt: 'A senha deve conter no mínimo 8 caracteres.'
            },
            {
                type: 'maxLength[40]',
                prompt: 'A senha deve conter no máximo 40 caracteres.'
            }
          ]
      }
    }
  })
;


$('.ui.large.form.register').submit(function(event){
    event.preventDefault()
    let formRegister = $('.ui.large.form.register')

    if ( formRegister.form('is valid') ) {
        $.post('/registro/registrar', 
            {
                nome_usuario: $("input[name='cadastro_nome']").val(),
                email_usuario: $("input[name='cadastro_email']").val(),
                email_conf_usuario: $("input[name='cadastro_conf_email']").val(),
                senha_usuario: $("input[name='cadastro_senha']").val(),
                senha_conf_usuario: $("input[name='cadastro_conf_senha']").val(),
            }, 
            (response) => {
                console.log(response)
            }
        )   
    }
})