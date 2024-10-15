$(document).ready(function () {

    'use strict';

    var erroNomeUsuario = true,
        erroEmail       = true,
        erroSenha       = true,
        erroConfirmaSenha = true,
        erroCPF         = true,
        erroTelefone    = true,
        erroLoginEmail  = true,
        erroLoginCPF    = true,
        erroLoginSenha  = true;
 
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        $('.formulario form label').addClass('trocaFonte');
    }

 
    $('input').focus(function () {
        $(this).siblings('label').addClass('ativo');
    });


    $('input').blur(function () {
        
        if ($(this).hasClass('nome')) {
            const regexNome = /^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)+$/;
            if (!regexNome.test($(this).val().trim())) {
                $(this).siblings('span.erro').text('Por favor, digite seu nome completo').fadeIn().parent('.grupo-formulario').addClass('temErro');
                erroNomeUsuario = true;
            } else {
                $(this).siblings('.erro').text('').fadeOut().parent('.grupo-formulario').removeClass('temErro');
                erroNomeUsuario = false;
            }
        }
  
        if ($(this).hasClass('email')) {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test($(this).val().trim())) {
                $(this).siblings('span.erro').text('Por favor, digite um e-mail válido').fadeIn().parent('.grupo-formulario').addClass('temErro');
                erroEmail = true;
            } else {
                $(this).siblings('.erro').text('').fadeOut().parent('.grupo-formulario').removeClass('temErro');
                erroEmail = false;
            }
        }
   
        if ($(this).hasClass('senha')) {
            const regexSenha = /^(?=.*\d).{8,}$/;
            if (!regexSenha.test($(this).val())) {
                $(this).siblings('span.erro').text('A senha deve ter pelo menos 8 caracteres e incluir pelo menos um número').fadeIn().parent('.grupo-formulario').addClass('temErro');
                erroSenha = true;
            } else {
                $(this).siblings('.erro').text('').fadeOut().parent('.grupo-formulario').removeClass('temErro');
                erroSenha = false;
            }
        }
      
        if ($(this).hasClass('confirmaSenha')) {
            if ($(this).val() !== $('.senha').val()) {
                $(this).siblings('span.erro').text('As senhas não coincidem').fadeIn().parent('.grupo-formulario').addClass('temErro');
                erroConfirmaSenha = true;
            } else {
                $(this).siblings('.erro').text('').fadeOut().parent('.grupo-formulario').removeClass('temErro');
                erroConfirmaSenha = false;
            }
        }
   
        if ($(this).hasClass('cpf')) {
            const regexCPF = /^\d{11}$/;
            if (!regexCPF.test($(this).val())) {
                $(this).siblings('span.erro').text('Por favor, digite um CPF válido (11 dígitos)').fadeIn().parent('.grupo-formulario').addClass('temErro');
                erroCPF = true;
            } else {
                $(this).siblings('.erro').text('').fadeOut().parent('.grupo-formulario').removeClass('temErro');
                erroCPF = false;
            }
        }
      
        if ($(this).hasClass('telefone')) {
            const regexTelefone = /^\(\d{2}\) \d{5}-\d{4}$/;
            if (!regexTelefone.test($(this).val())) {
                $(this).siblings('span.erro').text('Por favor, digite um telefone válido').fadeIn().parent('.grupo-formulario').addClass('temErro');
                erroTelefone = true;
            } else {
                $(this).siblings('.erro').text('').fadeOut().parent('.grupo-formulario').removeClass('temErro');
                erroTelefone = false;
            }
        }


        if ($(this).val().length > 0) {
            $(this).siblings('label').addClass('ativo');
        } else {
            $(this).siblings('label').removeClass('ativo');
        }
    });


    $('a.trocar').click(function (e) {
        e.preventDefault();
        $('.peca-formulario').toggleClass('trocado');
    });

    $('.formulario-login input').blur(function () {
        if ($(this).hasClass('login-email')) {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test($(this).val().trim())) {
                $(this).siblings('span.erro').text('Por favor, digite um e-mail válido').fadeIn().parent('.grupo-formulario').addClass('temErro');
                erroLoginEmail = true;
            } else {
                $(this).siblings('.erro').text('').fadeOut().parent('.grupo-formulario').removeClass('temErro');
                erroLoginEmail = false;
            }
        }
        if ($(this).hasClass('login-cpf')) {
            const regexCPF = /^\d{11}$/;
            if (!regexCPF.test($(this).val().replace(/\D/g, ''))) {
                $(this).siblings('span.erro').text('Por favor, digite um CPF válido (11 dígitos)').fadeIn().parent('.grupo-formulario').addClass('temErro');
                erroLoginCPF = true;
            } else {
                $(this).siblings('.erro').text('').fadeOut().parent('.grupo-formulario').removeClass('temErro');
                erroLoginCPF = false;
            }
        }
        if ($(this).hasClass('login-senha')) {
            const regexSenha = /^(?=.*\d).{8,}$/;
            if (!regexSenha.test($(this).val())) {
                $(this).siblings('span.erro').text('A senha deve ter pelo menos 8 caracteres e incluir pelo menos um número').fadeIn().parent('.grupo-formulario').addClass('temErro');
                erroLoginSenha = true;
            } else {
                $(this).siblings('.erro').text('').fadeOut().parent('.grupo-formulario').removeClass('temErro');
                erroLoginSenha = false;
            }
        }
    });

    $('form.formulario-cadastro').submit(function (evento) {
        evento.preventDefault();

        if (erroNomeUsuario || erroEmail || erroSenha || erroConfirmaSenha || erroCPF || erroTelefone) {
            $('.nome, .email, .senha, .confirmaSenha, .cpf, .telefone').blur();
        } else {
            console.log('Cadastro bem-sucedido');
            alert('Cadastro realizado com sucesso!');
            // Redirecionar para perfil.html após o cadastro
            window.location.href = 'perfil.html';
        }
    });


    $('form.formulario-login').submit(function (evento) {
        evento.preventDefault();

    
        $('.login-email, .login-cpf, .login-senha').blur();

        if (erroLoginEmail || erroLoginCPF || erroLoginSenha) {
            console.log('Corrija os erros antes de enviar o formulário');
        } else {
            console.log('Login bem-sucedido');
            alert('Login realizado com sucesso!');
            // Redirecionar para perfil.html após o login
            window.location.href = 'perfil.html';
        }
    });

    $('.telefone').on('input', function() {
        let valor = $(this).val().replace(/\D/g, '');
        let valorFormatado = '';
        
        if (valor.length > 0) {
            valorFormatado = '(' + valor.substring(0, 2) + ') ';
            if (valor.length > 2) {
                valorFormatado += valor.substring(2, 7);
                if (valor.length > 7) {
                    valorFormatado += '-' + valor.substring(7, 11);
                }
            }
        }
        
        $(this).val(valorFormatado);
    });


    $('.cpf, .login-cpf').on('input', function() {
        $(this).val($(this).val().replace(/\D/g, ''));
    });
});
