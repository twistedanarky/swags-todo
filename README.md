# Swag's ToDo List

A simple, elegant todo list web application with authentication for checking off items.

## Features

- **Add Items**: Anyone can add new items to the todo list
- **Check Off Items**: Only authenticated users can mark items as completed
- **Shared GitHub Gist**: Everyone uses the same shared todo list stored in GitHub
- **Real-time Sync**: Changes sync automatically across all users
- **Responsive Design**: Works great on desktop and mobile devices
- **Clean UI**: Modern, gradient design with smooth animations
- **Real-time Timers**: Shows elapsed time since each item was created

## How to Use

### For Everyone
- Click the **"Add New Item"** button to add a new todo item
- View all items in the list

### For Authenticated Users
- Click the **"Login"** button and enter the password: `admin123`
- Once logged in, you can check off items by clicking the checkboxes
- Click **"Logout"** to log out

### GitHub Shared List (Optional)
1. Click the **"⚙️"** settings button 
2. Get a GitHub Personal Access Token:
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name and select the **"gist"** scope
   - Copy the generated token
3. Paste the token in the configuration modal
4. Click "Save Token"
5. Your todos will now sync automatically with everyone else using the app!

**Note**: This is a **shared** todo list - everyone who configures their GitHub token will see and can modify the same list.

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

## Authentication & Sync

### Authentication
The application uses a simple password-based authentication system:
- **Default Password**: `admin123`
- **Note**: This is for demonstration purposes only. In a production environment, you would implement proper server-side authentication.

### GitHub Gist Integration
- **Shared List**: Everyone uses the same GitHub Gist for the todo list
- **Token Storage**: Your GitHub token is stored locally in your browser
- **Public Gist**: The shared gist is public (readable by anyone)
- **Auto-sync**: Automatically syncs when you add or complete items
- **Collaborative**: All users share the same todo list
- **Backup**: Todos are safely backed up in GitHub

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
