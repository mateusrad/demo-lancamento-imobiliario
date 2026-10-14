# Residencial Vila Aurora (demonstração)

Landing page de **demonstração** para lançamento imobiliário, feita para portfólio.
**O empreendimento, a construtora e o endereço são fictícios.**

🔗 **Ver no ar:** https://mateusrad.github.io/demo-lancamento-imobiliario/

## O que tem na página
- Hero com foto em tela cheia e selo "Lançamento"
- Diferenciais com ícones SVG
- Galeria com lightbox próprio (setas, teclado, swipe no celular, Esc para fechar)
- Plantas de 2 e 3 dormitórios desenhadas em SVG, com abas e zoom
- Localização com pontos próximos e mapa do OpenStreetMap
- Formulário com máscara de telefone e validação (modo demo: nada é enviado)
- Botão fixo de WhatsApp (modo demo: mostra um aviso)

Feita com HTML, CSS e JavaScript puros: sem framework, sem build e sem dependências.
Pensada primeiro para o celular, com foco em acessibilidade e desempenho.

## Como rodar no computador
Precisa só do Python (ou de qualquer servidor de arquivos estáticos). Na pasta do projeto:

```bash
python -m http.server 8080
```

Depois, abra http://localhost:8080 no navegador.

## Testes
As regras do formulário têm testes com o test runner que já vem no Node (versão 18 ou mais nova):

```bash
node --test "tests/*.test.js"
```

## Como publicar (GitHub Pages)
1. Envie o projeto para um repositório no GitHub.
2. No repositório, vá em **Settings → Pages**.
3. Em **Source**, escolha **Deploy from a branch**, a branch `main` e a pasta `/ (root)`.
4. Em alguns minutos o site fica disponível em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

Se publicar com outro endereço, atualize as URLs do Open Graph (`og:url` e `og:image`) no `index.html`.

## Para usar com um cliente real
- **Formulário:** o comentário acima do `<form>` no `index.html` explica como ligar ao FormSubmit ou ao Firebase.
- **WhatsApp:** o comentário acima do botão mostra o formato do link real (`https://wa.me/55NUMERO?text=...`).
- Troque textos, fotos e plantas, e remova os avisos de demonstração.

## Créditos
Fotos do [Unsplash](https://unsplash.com), sob a Licença Unsplash. Lista completa em [CREDITOS.md](CREDITOS.md).
Plantas e ícones desenhados para este projeto.

Desenvolvido por [Mateus Simões](https://mateusrad.github.io/portfolio/).
