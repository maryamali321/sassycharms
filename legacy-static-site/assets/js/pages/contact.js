/**
 * Contact page message form submit handler.
 */
function sendMessage(e) {
  e.preventDefault();
  e.target.reset();
  const msg = document.getElementById('successMsg');
  msg.classList.add('show');
  setTimeout(() => msg.classList.remove('show'), 5000);
}
