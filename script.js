// 🔐 LOGIN CHECK (protect dashboard)
if(localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "login.html";
}

// 📊 DATA (default)
let data = { water: 10, air: 8, forest: 6 };

// Load saved data
if(localStorage.getItem("envData")){
  data = JSON.parse(localStorage.getItem("envData"));
}

let barChart, pieChart;

// LOAD DATA FROM BACKEND
function loadData() {
  fetch("http://localhost:5000/getIssues")
    .then(res => res.json())
    .then(data => {
      let counts = {
        water: 0,
        air: 0,
        forest: 0
      };

      data.forEach(issue => {
        if (issue.type === "water") counts.water++;
        if (issue.type === "air") counts.air++;
        if (issue.type === "forest") counts.forest++;
      });

      updateCharts(counts);
    });
}

// UPDATE CHARTS
function updateCharts(counts) {

  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  // BAR CHART
  const barCtx = document.getElementById("lineChart");
  if (barCtx) {
    barChart = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: ["Water", "Air", "Forest"],
        datasets: [{
          label: "Issues",
          data: [counts.water, counts.air, counts.forest],
          backgroundColor: ["#00cec9", "#ff7675", "#fdcb6e"]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: "white" }
          }
        },
        scales: {
          x: { ticks: { color: "white" } },
          y: { ticks: { color: "white" } }
        }
      }
    });
  }

  // PIE CHART
  const pieCtx = document.getElementById("pieChart");
  if (pieCtx) {
    pieChart = new Chart(pieCtx, {
      type: "doughnut",
      data: {
        labels: ["Water", "Air", "Forest"],
        datasets: [{
          data: [counts.water, counts.air, counts.forest],
          backgroundColor: ["#00cec9", "#ff7675", "#fdcb6e"]
        }]
      }
    });
  }
}

// SUBMIT ISSUE
function submitIssue() {
  const type = document.getElementById("issueType").value;
  const description = document.getElementById("issueDesc").value;

  fetch("http://localhost:5000/addIssue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ type, description })
  })
  .then(res => res.json())
  .then(() => {
    alert("Issue Submitted ✅");
    loadData(); // refresh charts
  });
}

// LOAD WHEN PAGE OPENS
window.onload = function () {
  loadData();
};