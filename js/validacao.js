/* Regras do formulário de contato: funções puras, usadas no navegador e nos testes (node --test). */

(function (global) {
  'use strict';

  function somenteDigitos(texto) {
    return String(texto || '').replace(/\D/g, '');
  }

  // Máscara de telefone: (11) 9876-5432 para fixo (10 dígitos) e (11) 98765-4321 para celular (11 dígitos)
  function mascararTelefone(texto) {
    var d = somenteDigitos(texto).slice(0, 11);
    if (d.length === 0) return '';
    if (d.length <= 2) return '(' + d;
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  // Cada função devolve a mensagem de erro, ou '' quando o valor é válido
  function validarNome(nome) {
    var limpo = String(nome || '').trim();
    if (!limpo) return 'Informe seu nome.';
    if (limpo.length < 3) return 'O nome precisa ter pelo menos 3 letras.';
    if (/\d/.test(limpo)) return 'O nome não pode ter números.';
    return '';
  }

  function validarTelefone(telefone) {
    var d = somenteDigitos(telefone);
    if (!d) return 'Informe seu telefone.';
    if (d.length < 10) return 'Telefone incompleto. Use DDD + número.';
    if (d.charAt(0) === '0') return 'DDD inválido. Digite sem o zero inicial.';
    if (d.length === 11 && d.charAt(2) !== '9') return 'Celular com 11 dígitos deve começar com 9 após o DDD.';
    return '';
  }

  function validarEmail(email) {
    var limpo = String(email || '').trim();
    if (!limpo) return 'Informe seu e-mail.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(limpo)) return 'E-mail inválido. Exemplo: nome@email.com';
    return '';
  }

  function validarInteresse(interesse) {
    if (interesse !== '2 dormitórios' && interesse !== '3 dormitórios') return 'Escolha uma das plantas.';
    return '';
  }

  // Valida tudo de uma vez: devolve { campo: mensagem } só com os campos que têm erro
  function validarContato(dados) {
    var erros = {};
    var regras = {
      nome: validarNome,
      telefone: validarTelefone,
      email: validarEmail,
      interesse: validarInteresse
    };
    Object.keys(regras).forEach(function (campo) {
      var msg = regras[campo](dados[campo]);
      if (msg) erros[campo] = msg;
    });
    return erros;
  }

  var api = {
    somenteDigitos: somenteDigitos,
    mascararTelefone: mascararTelefone,
    validarNome: validarNome,
    validarTelefone: validarTelefone,
    validarEmail: validarEmail,
    validarInteresse: validarInteresse,
    validarContato: validarContato
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;          // Node (testes)
  } else {
    global.Validacao = api;        // Navegador
  }
})(this);
