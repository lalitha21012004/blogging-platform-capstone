// Change this to your deployed Render URL later!
const API_URL = "https://blogging-platform-capstone.onrender.com/api";

// --- 1. UTILITY FUNCTIONS ---

// Get the token from localStorage
const getToken = () => localStorage.getItem('token');

// Logout function
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = './index.html';
};

// Update Navbar based on Login Status
const updateNavbar = () => {
    const authLinks = document.getElementById('auth-links');
    const navLinks = document.getElementById('nav-links'); // For index.html nav
    const token = getToken();

    const target = authLinks || navLinks;
    if (!target) return;

    if (token) {
        target.innerHTML = `
            <a href="index.html">Home</a>
            <a href="create.html">Write Post</a>
            <button onclick="logout()" class="logout-btn">Logout</button>
        `;
    } else {
        target.innerHTML = `
            <a href="index.html">Home</a>
            <a href="login.html">Login</a>
            <a href="register.html" class="btn">Register</a>
        `;
    }
};

// --- 2. AUTHENTICATION LOGIC ---

// Registration
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-user').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-pass').value;

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await res.json();
            if (res.ok) {
                alert("Registration successful! Please login.");
                window.location.href = 'login.html';
            } else {
                alert(data);
            }
        } catch (err) {
            console.error("Register Error:", err);
        }
    });
}

// Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-pass').value;

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                window.location.href = 'index.html';
            } else {
                alert(data);
            }
        } catch (err) {
            console.error("Login Error:", err);
        }
    });
}

// --- 3. BLOG POST LOGIC ---

// Fetch All Posts (For index.html)
const fetchPosts = async () => {
    const container = document.getElementById('posts-container');
    if (!container) return;

    try {
        const res = await fetch(`${API_URL}/posts`);
        const posts = await res.json();

        if (posts.length === 0) {
            container.innerHTML = "<p>No posts found. Be the first to write one!</p>";
            return;
        }

        container.innerHTML = posts.map(post => `
            <div class="card">
                <h2>${post.title}</h2>
                <p>${post.content.substring(0, 150)}...</p>
                <div class="card-footer">
                    <span>By: <strong>${post.author ? post.author.username : 'Anonymous'}</strong></span>
                </div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = "<p>Error loading posts. Make sure the backend is running!</p>";
    }
};

// Create a New Post (For create.html)
const postForm = document.getElementById('post-form');
if (postForm) {
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        const token = getToken();

        if (!token) {
            alert("You must be logged in to post!");
            window.location.href = 'login.html';
            return;
        }

        try {
            const res = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': token 
                },
                body: JSON.stringify({ title, content })
            });

            if (res.ok) {
                alert("Post Published!");
                window.location.href = 'index.html';
            } else {
                const errData = await res.json();
                alert("Error: " + errData);
            }
        } catch (err) {
            console.error("Post Error:", err);
        }
    });
}

// --- 4. INITIALIZE PAGE ---
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    fetchPosts();
});