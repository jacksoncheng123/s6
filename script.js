// Load schedule data from JSON file and display it in the table
let scheduleData = [];
let showPastSchedule = false;

// Fetch JSON data and initialize tables
fetch('schedule_data.json')
    .then(response => response.json())
    .then(data => {
        scheduleData = data;
        initializeFilters(scheduleData);
        displayFullSchedule(scheduleData);
        displayUpcomingSchedule(scheduleData);
    });

// Initialize dropdown filter options
function initializeFilters(data) {
    const subjectFilter = document.getElementById('subject-filter');
    const dateFilter = document.getElementById('date-filter');
    
    // Clear existing options
    subjectFilter.innerHTML = '<option value="">All Subjects</option>';
    dateFilter.innerHTML = '<option value="">All Dates</option>';

    // Populate unique subjects and dates for dropdowns
    const subjects = [...new Set(data.map(item => item.RemedialClass))];
    const dates = [...new Set(data.map(item => item.Date))].sort();

    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectFilter.appendChild(option);
    });

    dates.forEach(date => {
        const option = document.createElement('option');
        option.value = date;
        option.textContent = date;
        dateFilter.appendChild(option);
    });
}

// Display full schedule, showing only future events by default
function displayFullSchedule(data) {
    const tableBody = document.getElementById('schedule-table').querySelector('tbody');
    tableBody.innerHTML = '';
    const today = new Date().setHours(0, 0, 0, 0);

    data.forEach(item => {
        const itemDate = new Date(item.Date).setHours(0, 0, 0, 0);
        if (!showPastSchedule && itemDate < today) return;

        const row = `<tr>
            <td>${item.Date}</td>
            <td>${item.Cycle}</td>
            <td>${item.Day}</td>
            <td>${item.Weekday}</td>
            <td>${item.RemedialClass}</td>
            <td>${item.RemedialLocation}</td>
            <td>${item.Notes}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Display the next available schedule date only
function displayUpcomingSchedule(data) {
    const tableBody = document.getElementById('upcoming-table').querySelector('tbody');
    tableBody.innerHTML = '';
    const today = new Date();
    let nextAvailableDate = null;

    for (const item of data) {
        const itemDate = new Date(item.Date);
        if (itemDate > today) {
            nextAvailableDate = itemDate;
            break;
        }
    }

    const upcomingData = data.filter(item => new Date(item.Date).getTime() === nextAvailableDate?.getTime());
    
    upcomingData.forEach(item => {
        const row = `<tr>
            <td>${item.Date}</td>
            <td>${item.RemedialClass}</td>
            <td>${item.RemedialLocation}</td>
            <td>${item.Notes}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Filter schedule based on user input for full schedule only
function applyFilters() {
    const subjectFilter = document.getElementById('subject-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    
    const filteredData = scheduleData.filter(item => {
        const subjectMatch = subjectFilter ? item.RemedialClass === subjectFilter : true;
        const dateMatch = dateFilter ? item.Date === dateFilter : true;
        return subjectMatch && dateMatch;
    });
    
    displayFullSchedule(filteredData);
}

// Clear filters and reset to default future-only view in the full schedule
function clearFilters() {
    document.getElementById('subject-filter').value = '';
    document.getElementById('date-filter').value = '';
    showPastSchedule = false;
    displayFullSchedule(scheduleData);
}

// Toggle past schedule view for full schedule only
function togglePastSchedule() {
    showPastSchedule = !showPastSchedule;
    displayFullSchedule(scheduleData);
}
