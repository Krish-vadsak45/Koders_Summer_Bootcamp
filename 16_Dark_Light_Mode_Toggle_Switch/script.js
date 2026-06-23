// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const statusText = document.getElementById('statusText');

// Check for saved theme preference or default to light
const currentTheme = localStorage.getItem('theme') || 'light';

// Apply the saved theme on page load
document.documentElement.setAttribute('data-theme', currentTheme);
themeToggle.checked = currentTheme === 'dark';
updateStatusText(currentTheme);

// Toggle theme function
function toggleTheme() {
    const newTheme = themeToggle.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateStatusText(newTheme);
    
    // Add a small animation feedback
    document.body.style.transform = 'scale(0.98)';
    setTimeout(() => {
        document.body.style.transform = 'scale(1)';
    }, 100);
}

// Update status text
function updateStatusText(theme) {
    statusText.textContent = `Current Mode: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`;
}

// Event listener for toggle
themeToggle.addEventListener('change', toggleTheme);

// Check for system preference on first visit
if (!localStorage.getItem('theme')) {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemPrefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
        localStorage.setItem('theme', 'dark');
        updateStatusText('dark');
    }
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeToggle.checked = e.matches;
        updateStatusText(newTheme);
    }
});

// Add keyboard accessibility (Space or Enter to toggle)
themeToggle.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        themeToggle.checked = !themeToggle.checked;
        toggleTheme();
    }
});

// Console message for developers
console.log('Dark/Light Mode Toggle initialized successfully!');
console.log('Current theme:', currentTheme);
