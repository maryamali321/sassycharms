/**
 * Track Order page lookup form submit handler.
 */
function trackOrder(e) {
  e.preventDefault();
  const result = document.getElementById('trackResult');
  result.classList.add('show');
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
