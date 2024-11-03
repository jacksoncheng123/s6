// Initialize dropdown filter options
function initializeFilters(data) {
    const subjectFilter = document.getElementById('subject-filter');
    
    // Clear existing options
    subjectFilter.innerHTML = '';

    // Add "All" option
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
}

// Filter schedule based on user input for full schedule only
function applyFilters() {
    const subjectFilter = document.getElementById('subject-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    
    const filteredData = scheduleData.filter(item => {
        const subjectMatch = subjectFilter ? item.RemedialClass === subjectFilter : true;
        const dateMatch = dateFilter ? parseDate(item.Date).toISOString().slice(0, 10) === new Date(dateFilter).toISOString().slice(0, 10) : true;
        return subjectMatch && dateMatch;
    });
    
    displayFullSchedule(filteredData);
}
