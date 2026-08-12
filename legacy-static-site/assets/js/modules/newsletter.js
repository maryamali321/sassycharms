/**
 * Newsletter subscribe form handler.
 * Referenced via inline `onsubmit="subscribeNewsletter(event)"`.
 */
function subscribeNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  const btn = e.target.querySelector('button');
  btn.textContent = '✓ Subscribed!';
  btn.style.background = '#c9a86c';
  input.value = '';
  setTimeout(() => {
    btn.textContent = 'Subscribe';
    btn.style.background = '';
  }, 3000);
}
