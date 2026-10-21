// Loaded in <head> so the saved theme applies before the page paints.
(function () {
  try {
    if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();

function toggleDarkMode() {
  var isDark = document.documentElement.classList.toggle('dark');
  try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
}

function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('hidden');
}

function copyText(text, message) {
  function done() { alert(message); }
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done, function () { window.prompt('Copy this:', text); });
  } else {
    window.prompt('Copy this:', text);
  }
}

// Sends a form submission to the foundation's inbox via FormSubmit.
function sendToInbox(data) {
  return fetch('https://formsubmit.co/ajax/TheRihlaFoundation@gmail.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  }).then(function (res) {
    if (!res.ok) throw new Error('Request failed: ' + res.status);
    return res.json();
  });
}
