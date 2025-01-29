document.addEventListener('DOMContentLoaded', function() {
    displayCalendar();
    document.getElementById('delete-mode').addEventListener('click', toggleDeleteMode);
    document.getElementById('export-csv').addEventListener('click', exportToCSV);
});

function displayCalendar() {
    const calendar = document.getElementById('calendar');
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendar.innerHTML = '';

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        calendar.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day');
        dayCell.textContent = day;
        dayCell.addEventListener('click', () => showDailyReportForm(day));
        calendar.appendChild(dayCell);

        if (localStorage.getItem(`${year}-${month + 1}-${day}`)) {
            dayCell.classList.add('pen-mark');
        }
    }
}

function showDailyReportForm(day) {
    const form = document.getElementById('daily-report-form');
    form.style.display = 'block';
    form.onsubmit = function(event) {
        event.preventDefault();
        saveDailyReport(day);
    };
}

function saveDailyReport(day) {
    const workHours = document.getElementById('work-hours').value;
    const workContent = document.getElementById('work-content').value;
    const nextTasks = document.getElementById('next-tasks').value;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const report = {
        workHours,
        workContent,
        nextTasks
    };

    localStorage.setItem(`${year}-${month}-${day}`, JSON.stringify(report));
    document.getElementById('daily-report-form').style.display = 'none';
    displayCalendar();
}

function toggleDeleteMode() {
    const calendar = document.getElementById('calendar');
    calendar.classList.toggle('delete-mode');
    if (calendar.classList.contains('delete-mode')) {
        calendar.querySelectorAll('.day.pen-mark').forEach(dayCell => {
            dayCell.addEventListener('click', deleteDailyReport);
        });
    } else {
        calendar.querySelectorAll('.day.pen-mark').forEach(dayCell => {
            dayCell.removeEventListener('click', deleteDailyReport);
        });
    }
}

function deleteDailyReport(event) {
    const dayCell = event.currentTarget;
    const day = dayCell.textContent;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    localStorage.removeItem(`${year}-${month}-${day}`);
    displayCalendar();
}

function exportToCSV() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();
    let csvContent = 'Date,Work Hours,Work Content,Next Day Tasks\n';

    for (let day = 1; day <= daysInMonth; day++) {
        const report = localStorage.getItem(`${year}-${month}-${day}`);
        if (report) {
            const { workHours, workContent, nextTasks } = JSON.parse(report);
            csvContent += `${year}-${month}-${day},${workHours},${workContent},${nextTasks}\n`;
        }
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daily_reports.csv';
    a.click();
    URL.revokeObjectURL(url);
}
