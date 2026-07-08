# Dark/Light Mode Toggle Switch

## Screenshots

![Light Desktop](assets/screenshots/01-light-desktop.png)
![Dark Desktop](assets/screenshots/02-dark-desktop.png)
![Light Mobile](assets/screenshots/03-light-mobile.png)
![Dark Mobile](assets/screenshots/04-dark-mobile.png)

A beautiful and functional dark/light mode toggle switch built with pure HTML, CSS, and JavaScript. This project demonstrates how to implement theme switching with smooth transitions, localStorage persistence, and system preference detection.


### Desktop View
- Light mode with clean, modern design
- Dark mode with high contrast and eye-friendly colors
- Toggle switch with sun/moon icons
- Demo content showcasing theme changes

### Mobile View
- Responsive design that adapts to all screen sizes
- Touch-friendly toggle switch
- Optimized layout for smaller screens

## Features

- **Smooth Theme Transitions**: Elegant animations when switching between dark and light modes
- **LocalStorage Persistence**: User's theme preference is saved and persists across page reloads
- **System Preference Detection**: Automatically detects user's system theme preference on first visit
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Keyboard Accessibility**: Toggle switch can be activated using Space or Enter keys
- **Visual Feedback**: Subtle animations and hover effects for better user experience
- **Demo Content**: Sample UI elements to demonstrate theme switching effects

## Tech Stack

- **HTML5**: Semantic markup and structure
- **CSS3**: Custom properties (CSS variables) for theming, flexbox for layout, transitions for animations
- **JavaScript (Vanilla)**: DOM manipulation, localStorage API, event listeners, system preference detection

## Project Structure

```
16_Dark_Light_Mode_Toggle_Switch/
├── index.html          # Main HTML structure
├── style.css           # CSS with theme variables and responsive design
├── script.js           # JavaScript for toggle functionality
├── artifacts/          # Screenshots folder
└── PROJECT_README.md   # Project documentation
```

## How It Works

### Theme Switching
The toggle switch uses a checkbox input that, when checked, applies the dark theme by setting a `data-theme` attribute on the HTML document. CSS custom properties (variables) are used to define colors for both themes, making the switch seamless.

### LocalStorage Persistence
The user's theme preference is saved to localStorage using the key `'theme'`. On page load, the script checks for this saved preference and applies it automatically.

### System Preference Detection
On the first visit (when no saved preference exists), the script checks the user's system preference using `window.matchMedia('(prefers-color-scheme: dark)')` and applies the appropriate theme.

### CSS Variables
The project uses CSS custom properties to define theme-specific colors:
- `--bg-color`: Background color
- `--card-bg`: Card background color
- `--text-primary`: Primary text color
- `--text-secondary`: Secondary text color
- `--accent`: Accent color for interactive elements
- `--border`: Border color
- `--shadow`: Shadow color

## Local Setup

1. Navigate to the project directory:
   ```bash
   cd 16_Dark_Light_Mode_Toggle_Switch
   ```

2. Open `index.html` in your web browser, or

3. Start a local server (optional):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server -p 8000
   ```

4. Open your browser and visit `http://localhost:8000`

## Usage

1. Click the toggle switch to switch between dark and light modes
2. Observe how the entire UI transitions smoothly between themes
3. Refresh the page to see your preference persist
4. Try resizing the browser to test responsive behavior

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Key Implementation Details

### CSS Variables for Theming
```css
:root {
    --bg-color: #f8fafc;
    --text-primary: #1e293b;
    /* ... more variables */
}

[data-theme="dark"] {
    --bg-color: #0f172a;
    --text-primary: #f1f5f9;
    /* ... more variables */
}
```

### JavaScript Theme Toggle
```javascript
function toggleTheme() {
    const newTheme = themeToggle.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateStatusText(newTheme);
}
```

### System Preference Detection
```javascript
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

## Future Enhancements

- Add more theme options (e.g., high contrast, sepia)
- Implement theme transition duration customization
- Add theme scheduling (auto-switch based on time of day)
- Create a theme preview modal
- Add more demo components to showcase theme effects

## Learning Outcomes

This project demonstrates:
- CSS custom properties for dynamic theming
- localStorage for client-side data persistence
- System preference detection with matchMedia
- Smooth CSS transitions and animations
- Responsive web design principles
- Accessibility considerations (keyboard navigation)
- Clean, modular JavaScript code organization

## Author

Built as part of the Summer Bootcamp daily project series.

## License

This project is open source and available for educational purposes.
