/**
 * Navbar behaviour: scroll shadow + mobile menu toggle.
 * Shared across every page.
 */
(function () {
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  window.toggleMenu = function toggleMenu() {
    if (navLinks) navLinks.classList.toggle('open');
  };

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      if (navLinks) navLinks.classList.remove('open');
    });
  });
})();
