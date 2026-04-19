const ctx = document.getElementById('chart');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Water', 'Air', 'Forest'],
    datasets: [{
      label: 'Environmental Data',
      data: [65, 59, 80]
    }]
  }
});