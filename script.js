// 🌐 Mock Data
const mockData = {
  patients: [
    {
      name: "Ankit Das",
      age: 25,
      issue: "Cough & Fever",
      prescriptions: ["Amoxicillin", "Vitamin C"],
      history: ["12 Jan 2024 – Flu – Dr. Sharma"]
    },
    {
      name: "Sneha Roy",
      age: 31,
      issue: "Migraine",
      prescriptions: ["Ibuprofen", "Paracetamol"],
      history: ["28 Feb 2024 – Allergy – Dr. Roy"]
    }
  ],
  appointments: [
    { name: "Rohan Sarkar", time: "10:00 AM" },
    { name: "Priya Mehra", time: "11:30 AM" }
  ]
};

// 🧠 Accessibility
function increaseFontSize() {
  document.body.style.fontSize = 'larger';
}

function decreaseFontSize() {
  document.body.style.fontSize = 'smaller';
}

function toggleContrast() {
  document.body.classList.toggle('high-contrast');
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// 🔐 Login & Logout
function login() {
  const username = document.getElementById("username").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        // 🔄 Save role and username locally for later use
        localStorage.setItem("username", username);
        localStorage.setItem("role", data.role);

        // ✨ Redirect based on role
        if (data.role === "doctor") {
          window.location.href = "doctor-dashboard.html";
        } else if (data.role === "patient") {
          window.location.href = "patient-dashboard.html";
        }
      } else {
        alert(data.message || "Login failed.");
      }
    })
    .catch(err => {
      console.error("Login error:", err);
      alert("Unable to connect to server.");
    });
}


function logout() {
  window.location.href = "index.html";
}

// 📅 Load Dashboard Data
function loadAppointments() {
  const list = document.getElementById("appointment-list");
  if (!list) return;
  mockData.appointments.forEach(appt => {
    const li = document.createElement("li");
    li.innerHTML = `<i class="fas fa-user"></i> ${appt.name} – ${appt.time}`;
    list.appendChild(li);
  });
}

function loadPatients() {
  const list = document.getElementById("patient-list");
  if (!list) return;
  mockData.patients.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `<i class="fas fa-id-badge"></i> ${p.name} – ${p.age} Yrs – ${p.issue}`;
    list.appendChild(li);
  });
}

function loadPrescriptionsAndHistory() {
  const prescriptionList = document.getElementById("prescription-list");
  const historyList = document.getElementById("history-list");
  if (!prescriptionList || !historyList) return;

  const patient = mockData.patients[0]; // default for now

  patient.prescriptions.forEach(med => {
    const li = document.createElement("li");
    li.innerHTML = `<i class="fas fa-pills"></i> ${med}`;
    prescriptionList.appendChild(li);
  });

  patient.history.forEach(record => {
    const li = document.createElement("li");
    li.innerHTML = `<i class="fas fa-notes-medical"></i> ${record}`;
    historyList.appendChild(li);
  });
}

// 📝 Doctor Notes
function saveNote() {
  const note = document.getElementById("doctor-note").value.trim();
  const username = "Dr.Rohan";

  fetch("http://localhost:5000/save-note", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, note })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("note-status").textContent = data.message;
    });
}

function loadSavedNote() {
  const username = "Dr.Rohan";

  fetch(`http://localhost:5000/get-note/${username}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("doctor-note").value = data.note;
    });
}

function clearNote() {
  localStorage.removeItem("doctorNote");
  document.getElementById("doctor-note").value = "";
  document.getElementById("note-status").textContent = "Note cleared!";
}

// 🚀 On Page Load
window.onload = function () {
  loadAppointments();
  loadPatients();
  loadPrescriptionsAndHistory();
  loadSavedNote();
  loadPatientDashboard()
  loadDoctorPatients()
};
fetch("http://localhost:5000/patients")
function fetchPrescriptions(name) {
  fetch(`http://localhost:5000/prescriptions/${encodeURIComponent(name)}`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("prescription-list");
      list.innerHTML = ""; // Clear old data

      if (data.prescriptions) {
        data.prescriptions.forEach(med => {
          const li = document.createElement("li");
          li.innerHTML = `<i class="fas fa-pills"></i> ${med}`;
          list.appendChild(li);
        });
      } else {
        list.innerHTML = `<li><i class="fas fa-exclamation-circle"></i> No prescriptions found.</li>`;
      }
    });
}
function fetchHistory(name) {
  fetch(`http://localhost:5000/history/${encodeURIComponent(name)}`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("history-list");
      list.innerHTML = "";

      if (data.history) {
        data.history.forEach(record => {
          const li = document.createElement("li");
          li.innerHTML = `<i class="fas fa-notes-medical"></i> ${record}`;
          list.appendChild(li);
        });
      } else {
        list.innerHTML = `<li><i class="fas fa-exclamation-circle"></i> No history found.</li>`;
      }
    });
}
function loadPatientDashboard() {
  const name = localStorage.getItem("username");
  if (!name) return;

  fetch(`http://localhost:5000/patient/${encodeURIComponent(name)}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        console.error(data.error);
        return;
      }

      document.getElementById("welcome-name").textContent = name.charAt(0).toUpperCase() + name.slice(1);

      const prescriptionList = document.getElementById("prescription-list");
      const historyList = document.getElementById("history-list");

      prescriptionList.innerHTML = "";
      data.prescriptions.forEach(med => {
        const li = document.createElement("li");
        li.innerHTML = `<i class="fas fa-pills"></i> ${med}`;
        prescriptionList.appendChild(li);
      });

      historyList.innerHTML = "";
      data.history.forEach(rec => {
        const li = document.createElement("li");
        li.innerHTML = `<i class="fas fa-notes-medical"></i> ${rec}`;
        historyList.appendChild(li);
      });
    });
}
function loadDoctorPatients() {
  const doctorName = localStorage.getItem("username"); // e.g., "Dr.Rohan"
  if (!doctorName) return;

  fetch(`http://localhost:5000/doctor/${encodeURIComponent(doctorName)}`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("patient-list");
      list.innerHTML = "";

      if (Array.isArray(data)) {
        data.forEach(p => {
          const li = document.createElement("li");
          li.innerHTML = `<i class="fas fa-id-badge"></i> ${p.name} – ${p.age} Yrs – ${p.issue}`;
          list.appendChild(li);
        });
      } else {
        list.innerHTML = `<li><i class="fas fa-exclamation-circle"></i> ${data.error}</li>`;
      }
    });
}
