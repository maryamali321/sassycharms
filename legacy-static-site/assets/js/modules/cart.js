/**
 * "Add to Bag" button behaviour + cart badge counter.
 * Used on pages that render product cards (home, shop).
 */
(function () {
  let cartCount = 0;
  const cartCountEl = document.querySelector('.cart-count');

  document.querySelectorAll('.btn-add-cart').forEach((btn) => {
    btn.addEventListener('click', () => {
      cartCount++;
      if (cartCountEl) cartCountEl.textContent = cartCount;
      btn.textContent = '✓ Added!';
      btn.style.background = '#c9a86c';
      setTimeout(() => {
        btn.textContent = 'Add to Bag';
        btn.style.background = '';
      }, 1500);
    });
  });
})();
