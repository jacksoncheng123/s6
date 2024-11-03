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
    subjectFilter.innerHTML = '';

    // Add an option for "All Subjects" or "No Filter"
    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All Subjects';
    subjectFilter.appendChild(allOption);

    // Populate unique subjects for dropdown
    const subjects = [...new Set(data.map(item => item.RemedialClass))];

    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectFilter.appendChild(option);
    });

    // Add event listeners to auto-apply filter on selection change
    subjectFilter.addEventListener('change', applyFilters);
    dateFilter.addEventListener('input', applyFilters);
}

// Convert date from "2024年9月10日" to "YYYY-MM-DD"
function parseDate(dateString) {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(5, dateString.indexOf('月')) - 1;
    const day = dateString.slice(dateString.indexOf('月') + 1, dateString.indexOf('日'));
    return new Date(Date.UTC(year, month, day));
}

// Display full schedule, showing only future events by default
function displayFullSchedule(data) {
    const tableBody = document.getElementById('schedule-table').querySelector('tbody');
    tableBody.innerHTML = '';
    const today = new Date().setHours(0, 0, 0, 0);
    const currentYear = new Date().getFullYear();

    data.forEach(item => {
        const itemDate = parseDate(item.Date).setHours(0, 0, 0, 0);
        if (!showPastSchedule && itemDate < today) return;

        const date = parseDate(item.Date);
        const displayDate = date.getFullYear() === currentYear ? `${date.getMonth() + 1}月${date.getDate()}日` : item.Date;

        const row = `<tr>
            <td>${displayDate}</td>
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

    // Find the next available date
    for (const item of data) {
        const itemDate = parseDate(item.Date);
        if (itemDate > today) {
            nextAvailableDate = itemDate;
            break;
        }
    }

    // Filter data for the next available date and display it
    const upcomingData = data.filter(item => parseDate(item.Date).getTime() === nextAvailableDate?.getTime());
    
    if (upcomingData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4">No upcoming schedule available.</td></tr>`;
    } else {
        const currentYear = new Date().getFullYear();
        upcomingData.forEach(item => {
            const date = parseDate(item.Date);
            const displayDate = date.getFullYear() === currentYear ? `${date.getMonth() + 1}月${date.getDate()}日` : item.Date;

            const row = `<tr>
                <td>${displayDate}</td>
                <td>${item.RemedialClass}</td>
                <td>${item.RemedialLocation}</td>
                <td>${item.Notes}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    }
}

// Filter schedule based on user input for full schedule only
function applyFilters() {
    const subjectFilter = document.getElementById('subject-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    
    const filteredData = scheduleData.filter(item => {
        const subjectMatch = subjectFilter ? item.RemedialClass === subjectFilter : true;
        const dateMatch = dateFilter ? parseDate(item.Date).toISOString().slice(0, 10) === dateFilter : true;
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
