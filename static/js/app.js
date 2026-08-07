// This script connects the Student Portal and Admin Workspace pages to the
// real Flask backend, using fetch() to load and send live data.

// ---------- STUDENT PORTAL ----------

// Load the list of clubs from the real database and build the cards
function loadClubCards() {
  const grid = document.getElementById("club-grid");
  if (!grid) return; // not on this page

  fetch("/api/clubs/listings")
    .then(response => response.json())
    .then(clubs => {
      grid.innerHTML = "";

      clubs.forEach(club => {
        const percentFull = Math.round((club.current_members / club.max_capacity) * 100);
        const isFull = club.current_members >= club.max_capacity;

        const card = document.createElement("div");
        card.className = "club-card";
        card.innerHTML = `
          <h3>${club.club_name}</h3>
          <p class="coach">Coach: ${club.coach_name}</p>
          <div class="capacity-bar-track">
            <div class="capacity-bar-fill ${isFull ? 'full' : ''}" style="width: ${percentFull}%;"></div>
          </div>
          <p class="capacity-label">${club.current_members} / ${club.max_capacity} members enrolled</p>
        `;
        grid.appendChild(card);
      });

      populateClubDropdown(clubs);
    })
    .catch(error => {
      grid.innerHTML = "<p>Could not load clubs. Make sure the Flask server is running.</p>";
      console.error("Error loading clubs:", error);
    });
}

// Fill the dropdown in the registration form using real club data
function populateClubDropdown(clubs) {
  const select = document.getElementById("club-select");
  if (!select) return;

  select.innerHTML = '<option value="" disabled selected>Choose a club</option>';

  clubs.forEach(club => {
    const option = document.createElement("option");
    option.value = club.club_id;
    option.textContent = club.club_name;
    select.appendChild(option);
  });
}

// Handle the registration form submission by calling the real enroll API
function handleRegistrationForm() {
  const form = document.getElementById("registration-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const memberId = document.getElementById("member-id").value;
    const clubId = document.getElementById("club-select").value;
    const joinDate = document.getElementById("join-date").value;

    fetch("/api/clubs/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        member_id: parseInt(memberId),
        club_id: parseInt(clubId),
        join_date: joinDate
      })
    })
      .then(response => response.json().then(data => ({ status: response.status, body: data })))
      .then(result => {
        if (result.status === 201) {
          alert("Enrolled successfully!");
          form.reset();
          loadClubCards(); // refresh the capacity bars
        } else {
          alert("Error: " + result.body.error);
        }
      })
      .catch(error => {
        alert("Something went wrong. Make sure the Flask server is running.");
        console.error("Error enrolling:", error);
      });
  });
}

// ---------- ADMIN WORKSPACE ----------

// Load the real roster table from the database
function loadRosterTable() {
  const tableBody = document.getElementById("roster-table-body");
  if (!tableBody) return; // not on this page

  fetch("/api/admin/roster")
    .then(response => response.json())
    .then(roster => {
      tableBody.innerHTML = "";

      roster.forEach(entry => {
        const row = document.createElement("tr");
        row.id = `roster-row-${entry.roster_id}`;
        row.innerHTML = `
          <td>${entry.roster_id}</td>
          <td>${entry.student_name}</td>
          <td>${entry.club_name}</td>
          <td>${entry.join_date}</td>
          <td><button class="deny-btn" onclick="removeFromRoster(${entry.roster_id})">Remove</button></td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      tableBody.innerHTML = "<tr><td colspan='5'>Could not load roster. Make sure the Flask server is running.</td></tr>";
      console.error("Error loading roster:", error);
    });
}

// Remove a member from a club using the real leave API
function removeFromRoster(rosterId) {
  fetch(`/api/clubs/leave/${rosterId}`, { method: "DELETE" })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(result => {
      if (result.status === 200) {
        const row = document.getElementById(`roster-row-${rosterId}`);
        if (row) row.remove();
      } else {
        alert("Error: " + result.body.error);
      }
    })
    .catch(error => {
      alert("Something went wrong. Make sure the Flask server is running.");
      console.error("Error removing member:", error);
    });
}

// ---------- Run everything once the page loads ----------
document.addEventListener("DOMContentLoaded", function () {
  loadClubCards();
  handleRegistrationForm();
  loadRosterTable();
});