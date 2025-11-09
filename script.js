// ------------------------------
// Configure this: paste your Apps Script Web App URL here
// Example: const SHEET_URL = "https://script.google.com/macros/s/AKfycbx.../exec";
const SHEET_URL = 'https://script.google.com/macros/s/AKfycby5O-DNnR8G5TLXswJLHXjGgCWA9AMWN9C_aRwULbGiy-2B6lclS34-_2-r_1dzVdy6/exec';// ------------------------------

const form = document.getElementById('regForm');
const statusEl = document.getElementById('status');
const submitBtn = document.getElementById('submitBtn');

async function sha256Hex(message) {
  // encode as UTF-8
  const msgUint8 = new TextEncoder().encode(message);
  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  // convert ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

function setStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.style.color = isError ? 'crimson' : 'green';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  setStatus('', false);

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    setStatus('Please provide both username and password.', true);
    return;
  }

  submitBtn.disabled = true;
  setStatus('Hashing password...', false);

  try {
    const hash = await sha256Hex(password);

    setStatus('Sending to Google Sheet...', false);

    const resp = await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, hash })
    });

    if (!resp.ok) {
      throw new Error(Server responded );
    }

    // optional: read response text from Apps Script
    const text = await resp.text();

    setStatus('Success â€” data sent to Google Sheet.', false);
    form.reset();
  } catch (err) {
    console.error(err);
    setStatus('Error sending data: ' + err.message, true);
  } finally {
    submitBtn.disabled = false;
  }
});

fetch(SHEET_URL, {
    method: 'POST',
    body: JSON.stringify(data)
})
.then(res => res.text())
.then(res => console.log("Response from server:", res))
.catch(err => console.error("Error:", err));