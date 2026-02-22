/**
 * main.js  Application entry point
 * All dependencies (locales, shader, i18n) are already loaded via <script> tags.
 */
document.addEventListener('DOMContentLoaded', function () {

  /*  WebGL Shader  */
  var canvas = document.getElementById('shaderCanvas');
  if (canvas && typeof window.initShader === 'function') {
    window.initShader(canvas);
  }

  /*  i18n  */
  if (typeof window.initI18n === 'function') {
    window.initI18n();
  }

  /*  Language switcher buttons  */
  document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (typeof window.setLang === 'function') {
        window.setLang(btn.dataset.langBtn);
      }
    });
  });

  /*  Smooth-scroll nav links (offset for sticky header)  */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var headerOffset = 112;
      var top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /*  Contact Modal  */
  var modal     = document.getElementById('contact-modal');
  var modalCard = modal ? modal.querySelector('div') : null;

  function openModal() {
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (form) form.reset();
    hideFeedback();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  /* Open triggers */
  document.querySelectorAll('[data-modal-open]').forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });

  /* Close button */
  var closeBtn = document.getElementById('modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  /* Click outside card to close */
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }

  /* ESC key to close */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* Form submit — validation + feedback */
  var form     = document.getElementById('contact-form');
  var feedback = document.getElementById('form-feedback');

  function getCurrentLocale() {
    var locales = window.MAI_LOCALES || {};
    try {
      var saved = localStorage.getItem('mai-lang');
      if (saved && locales[saved]) return locales[saved];
    } catch (e) {}
    return locales['es'] || {};
  }

  function showFeedback(type, text) {
    if (!feedback) return;
    feedback.textContent = text;
    feedback.className = 'text-xs text-center font-light rounded-xl px-4 py-3 mt-1 ';
    if (type === 'error') {
      feedback.className += 'text-red-400 bg-red-500/10 border border-red-500/20';
    } else {
      feedback.className += 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/20';
    }
  }

  function hideFeedback() {
    if (!feedback) return;
    feedback.className = 'hidden text-xs text-center font-light rounded-xl px-4 py-3 mt-1';
    feedback.textContent = '';
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var locale = getCurrentLocale();
      var modalLocale = (locale && locale.modal) ? locale.modal : {};

      /* Check all required fields */
      var fields   = form.querySelectorAll('[required]');
      var allValid = true;
      fields.forEach(function (f) {
        if (!f.value.trim()) allValid = false;
      });

      if (!allValid) {
        showFeedback('error', modalLocale.errorMsg || 'Please fill in all required fields.');
        return;
      }

      showFeedback('success', modalLocale.successMsg || 'Thank you! We will be in touch shortly.');
      form.reset();
    });

    /* Hide feedback whenever user starts editing a field again */
    form.addEventListener('input', function () {
      hideFeedback();
    });
  }

});
