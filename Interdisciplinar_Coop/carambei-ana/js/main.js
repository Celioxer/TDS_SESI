/* =========================================================================
   COOPERATIVISMO & SUSTENTABILIDADE — interações da interface
   ========================================================================= */
(function () {
  "use strict";

  /* --------------------------- Menu mobile ------------------------------ */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const aberto = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(aberto));
      toggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });

    // Fecha ao clicar em um link (mobile)
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* -------------------- Sombra do header ao rolar ----------------------- */
  const header = document.querySelector(".site-header");
  const toTop = document.querySelector(".to-top");

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (toTop) toTop.classList.toggle("show", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------- Marcar link ativo no menu --------------------- */
  const pagina = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach(function (link) {
    const href = link.getAttribute("href");
    if (href === pagina) link.classList.add("is-active");
  });

  /* ------------------- Revelar elementos ao rolar ----------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* -------------------------- Contadores -------------------------------- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const co = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const alvo = parseInt(el.dataset.count, 10) || 0;
          const sufixo = el.dataset.suffix || "";
          const duracao = 1400;
          const inicio = performance.now();

          function atualiza(agora) {
            const p = Math.min((agora - inicio) / duracao, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(alvo * eased).toLocaleString("pt-BR") + sufixo;
            if (p < 1) requestAnimationFrame(atualiza);
          }
          requestAnimationFrame(atualiza);
          co.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ----------------------------- FAQ ------------------------------------ */
  document.querySelectorAll(".faq__item").forEach(function (item) {
    const btn = item.querySelector(".faq__q");
    const resp = item.querySelector(".faq__a");
    if (!btn || !resp) return;

    btn.addEventListener("click", function () {
      const aberto = item.classList.contains("is-open");

      // fecha os demais
      item.parentElement.querySelectorAll(".faq__item.is-open").forEach(function (outro) {
        if (outro !== item) {
          outro.classList.remove("is-open");
          const r = outro.querySelector(".faq__a");
          if (r) r.style.maxHeight = null;
          const b = outro.querySelector(".faq__q");
          if (b) b.setAttribute("aria-expanded", "false");
        }
      });

      item.classList.toggle("is-open", !aberto);
      btn.setAttribute("aria-expanded", String(!aberto));
      resp.style.maxHeight = aberto ? null : resp.scrollHeight + "px";
    });
  });

  /* --------------------------- Formulário ------------------------------- */
  const form = document.querySelector("[data-contact-form]");
  if (form) {
    const sucesso = form.querySelector(".form-success");

    function mostraErro(campo, msg) {
      const wrap = campo.closest(".field");
      if (!wrap) return;
      wrap.classList.add("has-error");
      campo.classList.add("invalid");
      const erro = wrap.querySelector(".field__error");
      if (erro && msg) erro.textContent = msg;
    }
    function limpaErro(campo) {
      const wrap = campo.closest(".field");
      if (!wrap) return;
      wrap.classList.remove("has-error");
      campo.classList.remove("invalid");
    }

    form.querySelectorAll("input, textarea, select").forEach(function (campo) {
      campo.addEventListener("input", function () { limpaErro(campo); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let valido = true;

      const nome = form.querySelector("#nome");
      const email = form.querySelector("#email");
      const mensagem = form.querySelector("#mensagem");

      if (nome && nome.value.trim().length < 3) {
        mostraErro(nome, "Informe seu nome completo (mínimo 3 caracteres).");
        valido = false;
      }
      const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (email && !reEmail.test(email.value.trim())) {
        mostraErro(email, "Informe um e-mail válido.");
        valido = false;
      }
      if (mensagem && mensagem.value.trim().length < 10) {
        mostraErro(mensagem, "Escreva uma mensagem com pelo menos 10 caracteres.");
        valido = false;
      }

      if (!valido) {
        const primeiro = form.querySelector(".invalid");
        if (primeiro) primeiro.focus();
        return;
      }

      if (sucesso) {
        sucesso.classList.add("show");
        sucesso.textContent =
          "✅ Mensagem enviada com sucesso! Obrigado pelo contato, " +
          nome.value.trim().split(" ")[0] + ". Retornaremos em breve.";
        sucesso.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
    });
  }

  /* --------------------------- Ano no rodapé ---------------------------- */
  document.querySelectorAll("[data-ano]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
