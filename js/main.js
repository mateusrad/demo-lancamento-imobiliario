/* Residencial Vila Aurora (demonstração): scripts da página, sem bibliotecas. */

(function () {
  'use strict';

  /* Animação discreta ao rolar ------------------------------------------- */
  // O CSS só esconde os elementos .reveal quando o usuário não pediu "menos movimento".
  var reveals = document.querySelectorAll('.reveal');
  var reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduzMovimento && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Lightbox (galeria e plantas) ----------------------------------------- */
  // Cada item é uma foto { src, alt, caption } ou um desenho { node, caption } (as plantas em SVG).
  var lightbox = document.getElementById('lightbox');
  var lbMedia = lightbox.querySelector('.lightbox__media');
  var lbText = lightbox.querySelector('.lightbox__text');
  var lbCounter = lightbox.querySelector('.lightbox__counter');
  var lbPrev = lightbox.querySelector('.lightbox__prev');
  var lbNext = lightbox.querySelector('.lightbox__next');
  var lbItems = [];
  var lbIndex = 0;
  var lbOpener = null;

  function renderLightbox() {
    var item = lbItems[lbIndex];
    lbMedia.innerHTML = '';
    lbMedia.classList.toggle('lightbox__media--plan', !item.src);

    if (item.src) {
      var img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt;
      lbMedia.appendChild(img);
    } else {
      // Copia o SVG da página; tira os ids para não duplicar e usa aria-label no lugar do <title>
      var clone = item.node.cloneNode(true);
      clone.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
      clone.removeAttribute('aria-labelledby');
      clone.setAttribute('aria-label', item.caption);
      lbMedia.appendChild(clone);
    }

    var varias = lbItems.length > 1;
    var dicaArrastar = !item.src && window.innerWidth < 800 ? ' Arraste para os lados para ver a planta inteira.' : '';
    lbText.textContent = item.caption + (dicaArrastar ? '.' + dicaArrastar : '');
    lbCounter.textContent = varias ? '(' + (lbIndex + 1) + ' de ' + lbItems.length + ')' : '';
    lbPrev.hidden = !varias;
    lbNext.hidden = !varias;

    // Pré-carrega a próxima foto para a navegação ficar instantânea
    var proxima = lbItems[(lbIndex + 1) % lbItems.length];
    if (varias && proxima.src) new Image().src = proxima.src;
  }

  function abrirLightbox(items, index, opener) {
    lbItems = items;
    lbIndex = index;
    lbOpener = opener;
    renderLightbox();
    lightbox.showModal();
  }

  function navegar(passo) {
    if (lbItems.length < 2) return;
    lbIndex = (lbIndex + passo + lbItems.length) % lbItems.length;
    renderLightbox();
  }

  lbPrev.addEventListener('click', function () { navegar(-1); });
  lbNext.addEventListener('click', function () { navegar(1); });
  lightbox.querySelector('.lightbox__close').addEventListener('click', function () { lightbox.close(); });

  // Clique no fundo escuro (fora da imagem e dos botões) fecha
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox__figure') ||
        e.target === lbMedia) {
      lightbox.close();
    }
  });

  // Setas do teclado navegam; o Esc o próprio <dialog> já trata
  lightbox.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') navegar(-1);
    if (e.key === 'ArrowRight') navegar(1);
  });

  // Swipe no celular: arrastar mais de 50 px para o lado troca a foto
  var toqueX = null;
  lbMedia.addEventListener('touchstart', function (e) {
    toqueX = e.touches.length === 1 ? e.touches[0].clientX : null;
  }, { passive: true });
  lbMedia.addEventListener('touchend', function (e) {
    if (toqueX === null) return;
    var dx = e.changedTouches[0].clientX - toqueX;
    if (Math.abs(dx) > 50) navegar(dx < 0 ? 1 : -1);
    toqueX = null;
  });

  // Ao fechar, devolve o foco para o elemento que abriu o lightbox
  lightbox.addEventListener('close', function () {
    lbMedia.innerHTML = '';
    lbMedia.classList.toggle('lightbox__media--plan', !item.src);
    if (lbOpener) lbOpener.focus();
  });

  // Galeria
  var galeria = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));
  var fotos = galeria.map(function (link) {
    return {
      src: link.getAttribute('href'),
      alt: link.querySelector('img').alt,
      caption: link.dataset.caption
    };
  });
  galeria.forEach(function (link, i) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      abrirLightbox(fotos, i, link);
    });
  });

  // Plantas: cada uma abre sozinha, sem setas
  document.querySelectorAll('.plan__zoom').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var svg = btn.querySelector('.plan__svg');
      abrirLightbox([{ node: svg, caption: svg.querySelector('title').textContent }], 0, btn);
    });
  });

  /* Abas das plantas ----------------------------------------------------- */
  // Padrão de abas acessível: setas esquerda/direita trocam de aba, só a aba ativa entra no Tab.
  var abas = Array.prototype.slice.call(document.querySelectorAll('.tabs__tab'));

  function ativarAba(aba, focar) {
    abas.forEach(function (outra) {
      var ativa = outra === aba;
      outra.setAttribute('aria-selected', ativa ? 'true' : 'false');
      outra.tabIndex = ativa ? 0 : -1;
      document.getElementById(outra.getAttribute('aria-controls')).hidden = !ativa;
    });
    if (focar) aba.focus();
  }

  abas.forEach(function (aba, i) {
    aba.addEventListener('click', function () { ativarAba(aba, false); });
    aba.addEventListener('keydown', function (e) {
      var alvo = null;
      if (e.key === 'ArrowRight') alvo = abas[(i + 1) % abas.length];
      if (e.key === 'ArrowLeft') alvo = abas[(i - 1 + abas.length) % abas.length];
      if (e.key === 'Home') alvo = abas[0];
      if (e.key === 'End') alvo = abas[abas.length - 1];
      if (alvo) {
        e.preventDefault();
        ativarAba(alvo, true);
      }
    });
  });

  /* Formulário de contato (modo demonstração) ---------------------------- */
  // As regras ficam em js/validacao.js (testadas em tests/validacao.test.js).
  var form = document.getElementById('form-contato');
  var sucesso = document.getElementById('form-sucesso');
  var V = window.Validacao;

  if (form && V) {
    var telefone = form.elements.telefone;
    var camposTocados = {};

    // Máscara enquanto digita
    telefone.addEventListener('input', function () {
      telefone.value = V.mascararTelefone(telefone.value);
    });

    function lerDados() {
      return {
        nome: form.elements.nome.value,
        telefone: telefone.value,
        email: form.elements.email.value,
        interesse: form.elements.interesse.value
      };
    }

    function mostrarErro(campo, mensagem) {
      var erro = document.getElementById(campo + '-erro');
      var alvos = campo === 'interesse' ? form.querySelectorAll('input[name="interesse"]') : [form.elements[campo]];
      erro.textContent = mensagem;
      Array.prototype.forEach.call(alvos, function (el) {
        el.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
      });
    }

    // Revalida um campo ao sair dele, mas só depois que a pessoa já interagiu (sem bronca antes da hora)
    ['nome', 'telefone', 'email'].forEach(function (campo) {
      form.elements[campo].addEventListener('blur', function () {
        if (!form.elements[campo].value && !camposTocados[campo]) return;
        camposTocados[campo] = true;
        mostrarErro(campo, V.validarContato(lerDados())[campo] || '');
      });
    });
    form.querySelectorAll('input[name="interesse"]').forEach(function (radio) {
      radio.addEventListener('change', function () { mostrarErro('interesse', ''); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var dados = lerDados();
      var erros = V.validarContato(dados);
      var campos = ['nome', 'telefone', 'email', 'interesse'];

      campos.forEach(function (campo) { mostrarErro(campo, erros[campo] || ''); });

      var primeiroErro = campos.filter(function (c) { return erros[c]; })[0];
      if (primeiroErro) {
        var foco = primeiroErro === 'interesse' ? form.querySelector('input[name="interesse"]') : form.elements[primeiroErro];
        foco.focus();
        return;
      }

      // DEMO: nada é enviado. Na versão real, troque este trecho pelo envio (ver comentário no index.html).
      document.getElementById('sucesso-nome').textContent = dados.nome.trim().split(/\s+/)[0];
      form.hidden = true;
      sucesso.hidden = false;
      sucesso.focus();
    });

    document.getElementById('form-novo').addEventListener('click', function () {
      form.reset();
      camposTocados = {};
      ['nome', 'telefone', 'email', 'interesse'].forEach(function (c) { mostrarErro(c, ''); });
      sucesso.hidden = true;
      form.hidden = false;
      form.elements.nome.focus();
    });
  }

  /* Botão de WhatsApp (modo demonstração) -------------------------------- */
  // Na versão real o botão vira um link https://wa.me/55NUMERO?text=... (ver comentário no index.html)
  // e este bloco pode ser apagado.
  var whatsappBtn = document.getElementById('whatsapp-btn');
  var toast = document.getElementById('toast');
  var toastTimer;

  function fecharToast() {
    toast.hidden = true;
    clearTimeout(toastTimer);
  }

  if (whatsappBtn && toast) {
    whatsappBtn.addEventListener('click', function () {
      toast.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(fecharToast, 7000);
    });

    toast.querySelector('.toast__close').addEventListener('click', function () {
      fecharToast();
      whatsappBtn.focus();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !toast.hidden) fecharToast();
    });
  }
})();
