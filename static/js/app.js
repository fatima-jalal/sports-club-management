// This script reads the mock data (from mock-data.js) and builds the
// visible page content. Nothing here talks to the real Flask server yet —
// that connection happens in a later phase.

// ---------- STUDENT PORTAL ----------

function renderClubCards() {
  const grid = document.getElementById("club-grid");
  if (!grid) return; // not on this page

  grid.innerHTML = "";

  mockClubs.forEach(club => {
    const percentFull = Math.round((club.currentMembers / club.maxCapacity) * 100);
    const isFull = club.currentMembers >= club.maxCapacity;

    const card = document.createElement("div");
    card.className = "club-card";
    card.innerHTML = `
      <h3>${club.name}</h3>
      <p class="coach">Coach: ${club.coach}</p>
      <p class="timing">${club.timing}</p>
      <p class="description">${club.description}</p>
      <div class="capacity-bar-track">
        <div class="capacity-bar-fill ${isFull ? 'full' : ''}" style="width: ${percentFull}%;"></div>
      </div>
      <p class="capacity-label">${club.currentMembers} / ${club.maxCapacity} members enrolled</p>
      <button class="btn ${isFull ? 'disabled' : ''}" ${isFull ? 'disabled' : ''}>
        ${isFull ? 'Club Full' : 'Select Club'}
      </button>
    `;
    grid.appendChild(card);
  });
}

function populateClubDropdown() {
  const select = document.getElementById("club-select");
  if (!select) return;

  mockClubs.forEach(club => {
    const option = document.createElement("option");
    option.value = club.clubId;
    option.textContent = club.name;
    select.appendChild(option);
  });
}

function handleRegistrationForm() {
  const form = document.getElementById("registration-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("student-name").value;
    const club = document.getElementById("club-select").value;
    alert(`Registration received for ${name}. This is a mock submission — no data is saved yet.`);
    form.reset();
  });
}

// ---------- ADMIN WORKSPACE ----------

function renderMembershipRequests() {
  const list = document.getElementById("request-list");
  if (!list) return;

  list.innerHTML = "";

  mockMembershipRequests.forEach(req => {
    const card = document.createElement("div");
    card.className = "request-card";
    card.id = `request-${req.requestId}`;
    card.innerHTML = `
      <div class="info">
        <strong>${req.studentName}</strong>
        <span>Requested: ${req.club} on ${req.requestedOn}</span>
      </div>
      <div class="request-actions">
        <button class="approve-btn" onclick="handleRequestAction(${req.requestId}, 'Approved')">Approve</button>
        <button class="deny-btn" onclick="handleRequestAction(${req.requestId}, 'Denied')">Deny</button>
      </div>
    `;
    list.appendChild(card);
  });
}

function handleRequestAction(requestId, action) {
  const card = document.getElementById(`request-${requestId}`);
  if (card) {
    card.innerHTML = `<div class="info"><strong>Request #${requestId} marked as ${action}</strong><span>This is a mock action — no real data changed.</span></div>`;
  }
}

function renderRosterTable() {
  const tableBody = document.getElementById("roster-table-body");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  mockRoster.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.rosterId}</td>
      <td>${entry.studentName}</td>
      <td>${entry.club}</td>
      <td>${entry.joinDate}</td>
    `;
    tableBody.appendChild(row);
  });
}

// ---------- Run everything once the page loads ----------
document.addEventListener("DOMContentLoaded", function () {
  renderClubCards();
  populateClubDropdown();
  handleRegistrationForm();
  renderMembershipRequests();
  renderRosterTable();
});