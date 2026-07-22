const leaderboardEl = document.getElementById("leaderboard");
const leaderboardErrorEl = document.getElementById("leaderboard-error");

const verifyPanelEl = document.getElementById("verify-panel");
const verifyNameEl = document.getElementById("verify-name");
const verifyErrorEl = document.getElementById("verify-error");
const phoneFormEl = document.getElementById("phone-form");
const phoneInputEl = document.getElementById("phone-input");
const codeFormEl = document.getElementById("code-form");
const codeInputEl = document.getElementById("code-input");
const verifyCancelEl = document.getElementById("verify-cancel");

let pendingVoteId = null;

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function showError(el, message) {
  el.textContent = message;
  el.hidden = !message;
}

function renderLeaderboard(names) {
  leaderboardEl.innerHTML = "";

  if (names.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No names yet — be the first to suggest one!";
    leaderboardEl.appendChild(li);
    return;
  }

  names.forEach((entry, index) => {
    const li = document.createElement("li");
    li.className = "leaderboard-item";
    li.innerHTML = `
      <span class="rank">#${index + 1}</span>
      <span class="name-info">
        <span class="name">${escapeHtml(entry.name)}</span>
      </span>
      <span class="votes">${entry.votes} 🐾</span>
      <button class="vote-btn" data-id="${entry.id}" data-name="${escapeHtml(entry.name)}">Vote</button>
    `;
    leaderboardEl.appendChild(li);
  });
}

async function loadNames() {
  try {
    const res = await fetch("/api/names");
    if (!res.ok) throw new Error("Failed to load leaderboard.");
    const names = await res.json();
    showError(leaderboardErrorEl, "");
    renderLeaderboard(names);
  } catch (err) {
    showError(leaderboardErrorEl, "Couldn't load the leaderboard. Try refreshing.");
  }
}

function openVerifyPanel(id, name) {
  pendingVoteId = id;
  verifyNameEl.textContent = name;
  showError(verifyErrorEl, "");
  phoneFormEl.reset();
  codeFormEl.reset();
  phoneFormEl.hidden = false;
  codeFormEl.hidden = true;
  verifyPanelEl.hidden = false;
  verifyPanelEl.scrollIntoView({ behavior: "smooth", block: "center" });
}

function closeVerifyPanel() {
  pendingVoteId = null;
  verifyPanelEl.hidden = true;
}

leaderboardEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".vote-btn");
  if (!btn) return;
  openVerifyPanel(btn.dataset.id, btn.dataset.name);
});

verifyCancelEl.addEventListener("click", closeVerifyPanel);

phoneFormEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  showError(verifyErrorEl, "");

  const phoneNumber = phoneInputEl.value.trim();
  if (!phoneNumber) {
    showError(verifyErrorEl, "Please enter a phone number.");
    return;
  }

  try {
    const res = await fetch("/api/verify/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber }),
    });
    const data = await res.json();

    if (!res.ok) {
      showError(verifyErrorEl, data.error || "Something went wrong.");
      return;
    }

    phoneFormEl.hidden = true;
    codeFormEl.hidden = false;
  } catch (err) {
    showError(verifyErrorEl, "Couldn't send a verification code. Try again.");
  }
});

codeFormEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  showError(verifyErrorEl, "");

  const phoneNumber = phoneInputEl.value.trim();
  const code = codeInputEl.value.trim();

  if (!code) {
    showError(verifyErrorEl, "Please enter the verification code.");
    return;
  }

  try {
    const res = await fetch(`/api/names/${pendingVoteId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, code }),
    });
    const data = await res.json();

    if (!res.ok) {
      showError(verifyErrorEl, data.error || "Something went wrong.");
      return;
    }

    closeVerifyPanel();
    await loadNames();
  } catch (err) {
    showError(verifyErrorEl, "Couldn't confirm that vote. Try again.");
  }
});

loadNames();
