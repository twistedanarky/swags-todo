# Swag's ToDo List

A simple, elegant todo list web application with authentication for checking off items.

## Features

- **Add Items**: Anyone can add new items to the todo list
- **Check Off Items**: Only authenticated users can mark items as completed
- **Persistent Storage**: Items are saved in browser's localStorage
- **Responsive Design**: Works great on desktop and mobile devices
- **Clean UI**: Modern, gradient design with smooth animations

## How to Use

### For Everyone
- Click the **"Add New Item"** button to add a new todo item
- View all items in the list

### For Authenticated Users
- Click the **"Login"** button and enter the password: `admin123`
- Once logged in, you can check off items by clicking the checkboxes
- Click **"Logout"** to log out

## Running the Project

### Method 1: Using Python's Built-in Server
1. Open a terminal in the project directory
2. Run: `python -m http.server 8000`
3. Open your browser and go to `http://localhost:8000`

### Method 2: Using VS Code Live Server Extension
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html` and select "Open with Live Server"

### Method 3: Direct File Opening
Simply open `index.html` in your web browser by double-clicking it.

## Project Structure

```
swags-todo/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── README.md           # This file
└── .github/
    └── copilot-instructions.md
```

## Technologies Used

- **HTML5**: Structure and content
- **CSS3**: Styling with modern features like gradients and transitions
- **JavaScript (ES6+)**: Interactive functionality and state management
- **localStorage**: Client-side data persistence

## Authentication

The application uses a simple password-based authentication system:
- **Default Password**: `admin123`
- **Note**: This is for demonstration purposes only. In a production environment, you would implement proper server-side authentication.

## Browser Compatibility

This application works in all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Development

To modify the application:

1. **Styling**: Edit `styles.css` to change the appearance
2. **Functionality**: Edit `script.js` to add new features
3. **Structure**: Edit `index.html` to modify the layout
4. **Password**: Change the `ADMIN_PASSWORD` constant in `script.js`

## License

This project is open source and available under the MIT License.
