// Load the JSON data and initialize the table
fetch('schedule_data.json')
  .then(response => response.json())
  .then(data => {
    window.scheduleData = data;
    displayTable(data);
    displayUpcoming(data);
  })
  .catch(error => console.error("Error loading schedule data:", error));

// Display table function
function displayTable(data) {
  const tableBody = document.getElementById('scheduleTable');
  tableBody.innerHTML = ''; // Clear existing table data

  data.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.Date}</td>
      <td>${item.Cycle}</td>
      <td>${item.Day}</td>
      <td>${item.Weekday}</td>
      <td>${item.RemedialClass}</td>
      <td>${item.OddEven}</td>
      <td>${item.RemedialLocation}</td>
      <td>${item.TestSelection}</td>
      <td>${item.Notes || ''}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Display upcoming schedule (next 5 entries)
function displayUpcoming(data) {
  const upcomingList = document.getElementById('upcomingList');
  upcomingList.innerHTML = '';

  // Filter upcoming dates
  const today = new Date();
  const upcoming = data.filter(item => new Date(item.Date) >= today).slice(0, 5);

  upcoming.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.Date}: ${item.TestSelection || 'No test scheduled'}`;
    upcomingList.appendChild(listItem);
  });
}

// Apply filters function
function applyFilters() {
  const dateFilter = document.getElementById('dateFilter').value;
  const subjectFilter = document.getElementById('subjectFilter').value.toLowerCase();

  const filteredData = window.scheduleData.filter(item => {
    const matchesDate = !dateFilter || item.Date.startsWith(dateFilter);
    const matchesSubject = !subjectFilter || (item.RemedialClass && item.RemedialClass.toLowerCase().includes(subjectFilter));
    return matchesDate && matchesSubject;
  });

  displayTable(filteredData);
}
