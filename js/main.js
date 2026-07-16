// ===================================================================
// Aspen IT Solutions — main.js
// ===================================================================

document.addEventListener('DOMContentLoaded', function () {

  // ---- Footer year ----
  document.querySelectorAll('.current-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // ---- Mobile nav toggle ----
  var navToggleBtn = document.getElementById('navToggleBtn');
  var navLinks = document.getElementById('navLinks');
  if (navToggleBtn && navLinks) {
    navToggleBtn.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { navLinks.classList.remove('open'); });
    });
  }

  // ---- Active nav link on scroll ----
  var sections = document.querySelectorAll('section[id], header[id]');
  var navAnchors = document.querySelectorAll('.nav-link');
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navAnchors.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(function (s) { sectionObserver.observe(s); });

  // ---- Reveal-on-scroll animation ----
  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  // ---- Contact form: validation + FormSubmit AJAX ----
  var form = document.getElementById('contactForm');
  var statusBox = document.getElementById('formStatus');
  var submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var requiredFields = form.querySelectorAll('[required]');
      var isValid = true;
      var firstInvalid = null;

      requiredFields.forEach(function (field) {
        if (!field.value || !field.value.trim()) {
          isValid = false;
          field.classList.add('is-invalid');
          if (!firstInvalid) firstInvalid = field;
        } else {
          field.classList.remove('is-invalid');
        }
      });

      var emailField = document.getElementById('email');
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailField.value && !emailPattern.test(emailField.value.trim())) {
        isValid = false;
        emailField.classList.add('is-invalid');
        if (!firstInvalid) firstInvalid = emailField;
      }

      if (!isValid) {
        statusBox.className = 'status-error';
        statusBox.textContent = 'Please fill in all required fields with valid information before submitting.';
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      statusBox.className = '';
      statusBox.style.display = 'none';

      var formData = new FormData(form);

      fetch(form.getAttribute('data-endpoint'), {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      })
      .then(function (response) {
        if (response.ok) {
          statusBox.className = 'status-success';
          statusBox.textContent = "Thanks — your message is on its way. We'll be in touch within one business day.";
          form.reset();
        } else {
          throw new Error('Submission failed');
        }
      })
      .catch(function () {
        statusBox.className = 'status-error';
        statusBox.textContent = "Something went wrong sending your message. Please email us directly at sanjid.canada@gmail.com.";
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      });
    });

    form.querySelectorAll('[required]').forEach(function (field) {
      field.addEventListener('input', function () { field.classList.remove('is-invalid'); });
    });
  }

});
