// Testes das regras do formulário. Rodar com: node --test "tests/*.test.js"
// Usa o test runner que já vem no Node (node:test), sem instalar nada.
const test = require('node:test');
const assert = require('node:assert/strict');
const V = require('../js/validacao.js');

const valido = {
  nome: 'Maria Souza',
  telefone: '(11) 98765-4321',
  email: 'maria@email.com',
  interesse: '2 dormitórios'
};

test('sucesso: dados completos e corretos não geram erro', () => {
  assert.deepEqual(V.validarContato(valido), {});
  assert.deepEqual(V.validarContato({ ...valido, telefone: '1132345678', interesse: '3 dormitórios' }), {});
});

test('dado inválido: formulário vazio gera erro em todos os campos', () => {
  const erros = V.validarContato({ nome: '', telefone: '', email: '', interesse: '' });
  assert.deepEqual(Object.keys(erros).sort(), ['email', 'interesse', 'nome', 'telefone']);
});

test('nome: rejeita vazio, curto demais e com números', () => {
  assert.equal(V.validarNome('   '), 'Informe seu nome.');
  assert.match(V.validarNome('Jo'), /pelo menos 3/);
  assert.match(V.validarNome('Maria 2'), /números/);
  assert.equal(V.validarNome('  Ana  '), '');
});

test('telefone: rejeita incompleto, DDD com zero e celular sem 9', () => {
  assert.match(V.validarTelefone('(11) 9876'), /incompleto/);
  assert.match(V.validarTelefone('01198765432'), /DDD/);
  assert.match(V.validarTelefone('11887654321'), /começar com 9/);
  assert.equal(V.validarTelefone('(11) 3234-5678'), '');
});

test('e-mail: rejeita formatos inválidos', () => {
  for (const email of ['maria', 'maria@', 'maria@email', 'maria @email.com', 'maria@email.c']) {
    assert.notEqual(V.validarEmail(email), '', email);
  }
  assert.equal(V.validarEmail(' maria@email.com.br '), '');
});

test('interesse: só aceita as duas plantas existentes', () => {
  assert.notEqual(V.validarInteresse('4 dormitórios'), '');
  assert.notEqual(V.validarInteresse(undefined), '');
  assert.equal(V.validarInteresse('3 dormitórios'), '');
});

test('máscara de telefone: formata fixo, celular e corta excesso', () => {
  assert.equal(V.mascararTelefone(''), '');
  assert.equal(V.mascararTelefone('1'), '(1');
  assert.equal(V.mascararTelefone('1198'), '(11) 98');
  assert.equal(V.mascararTelefone('1132345678'), '(11) 3234-5678');
  assert.equal(V.mascararTelefone('11987654321'), '(11) 98765-4321');
  assert.equal(V.mascararTelefone('11987654321999'), '(11) 98765-4321');
  assert.equal(V.mascararTelefone('abc(11)9-8765.4321'), '(11) 98765-4321');
});
