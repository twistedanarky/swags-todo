# Setting up Shared Gist for Swag's Todo List

To set up a shared gist that everyone can use, you need to create it once and then update the code with the gist ID.

## Step 1: Create a GitHub Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Todo App Shared Gist"
4. Select the **"gist"** scope
5. Click "Generate token"
6. Copy the token

## Step 2: Create the Shared Gist

Run this in your browser console or use a tool like Postman:

```javascript
// Replace YOUR_TOKEN_HERE with your actual GitHub token
const token = 'YOUR_TOKEN_HERE';

const gistData = {
    description: "Swag's Shared Todo List - Public todo list for web app",
    public: true, // Make it public so anyone can read it
    files: {
        'swags-todo-list.json': {
            content: JSON.stringify({
                todos: [
                    {
                        id: Date.now(),
                        text: "Welcome to the shared todo list! 🎉",
                        completed: false,
                        createdAt: new Date().toISOString()
                    }
                ],
                lastUpdated: new Date().toISOString()
            }, null, 2)
        }
    }
};

fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(gistData)
})
.then(response => response.json())
.then(result => {
    console.log('Gist created!');
    console.log('Gist ID:', result.id);
    console.log('URL:', result.html_url);
    console.log('Now update the SHARED_GIST_ID in script.js with:', result.id);
})
.catch(error => console.error('Error:', error));
```

## Step 3: Update the Code

1. Copy the gist ID from step 2
2. Open `script.js`
3. Replace `YOUR_SHARED_GIST_ID_HERE` with the actual gist ID
4. Save and commit the changes

## Alternative: I can create it for you

If you provide me with a GitHub token (just for this setup), I can create the shared gist for you and update the code automatically.
