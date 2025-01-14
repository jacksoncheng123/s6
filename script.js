// Initialize schedule data with trip details
let scheduleData = [
    // Sample data populated dynamically from Excel file
];

let showPastSchedule = false;

const remarks = {
    1: "Remember to check-in 2 hours before departure.",
    2: "Ensure travel insurance is in place.",
    3: "Currency exchange available at the hotel.",
    4: "Early checkout for the next day’s trip.",
    5: "Luggage storage available at Shin-Osaka Station.",
};

// Load trip data (to be replaced with a dynamic source like API or JSON fetch)
function loadTripDetails() {
    scheduleData = [
        {
            date: "2025-04-30",
            activity: "HKG Departure MM68",
            accommodation: "APA Hotel & Resort Osaka Umeda Eki Tower",
        },
        {
            date: "2025-05-01",
            activity: "Explore Osaka",
            accommodation: "Shin Osaka Washington Hotel Plaza",
        },
        {
            date: "2025-05-02",
            activity: "Travel to Tokyo",
            accommodation: "Tokyo Keihan Hotel Yotsuya",
        },
        // Additional data...
    ];
    renderSchedule();
}

// Render schedule dynamically
function renderSchedule() {
    const scheduleSection = document.getElementById('schedule-section');
    scheduleSection.innerHTML = '';

    scheduleData.forEach((entry) => {
        const scheduleItem = document.createElement('div');
        scheduleItem.classList.add('schedule-item');

        scheduleItem.innerHTML = `
            <div class="schedule-date">${entry.date}</div>
            <div class="schedule-activity">${entry.activity}</div>
            <div class="schedule-accommodation">${entry.accommodation}</div>
        `;

        scheduleSection.appendChild(scheduleItem);
    });
}

// Initialize filters and load data on page load
window.onload = () => {
    loadTripDetails();
    initializeFilters();
};

function initializeFilters() {
    // Example filter logic (to be expanded as needed)
    const filterInput = document.getElementById('filter-date');
    filterInput.addEventListener('input', (event) => {
        const filterValue = event.target.value;
        const filteredData = scheduleData.filter(entry => entry.date.includes(filterValue));

        const scheduleSection = document.getElementById('schedule-section');
        scheduleSection.innerHTML = '';

        filteredData.forEach((entry) => {
            const scheduleItem = document.createElement('div');
            scheduleItem.classList.add('schedule-item');

            scheduleItem.innerHTML = `
                <div class="schedule-date">${entry.date}</div>
                <div class="schedule-activity">${entry.activity}</div>
                <div class="schedule-accommodation">${entry.accommodation}</div>
            `;

            scheduleSection.appendChild(scheduleItem);
        });
    });
}
