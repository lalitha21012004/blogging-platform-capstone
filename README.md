# Project Overview
The Blogging Platform is a dynamic web application designed to provide a seamless writing and reading experience. It features a dual-access system where the general public can browse and read published articles, while registered authors have access to a private dashboard to write, edit, and delete their own content.

This project implements the MERN stack (MongoDB, Express, React/JS, Node.js) to handle real-time data processing and persistent storage.

Key Features
User Authentication: Secure signup and login functionality using JWT (JSON Web Tokens) and password hashing (Bcrypt) to protect user data.

Full CRUD Functionality: Authors can Create, Read, Update, and Delete blog posts through an intuitive editor.

Dynamic Content Feed: A public-facing homepage that fetches and displays the latest blog posts from all users in an organized card layout.

Authorization Controls: Robust backend logic ensuring that only the original author of a post has the permission to modify or remove it.

Responsive Design: A mobile-first UI that ensures the reading experience is optimized for desktops, tablets, and smartphones.

Technical Stack
Frontend: HTML5, CSS3 (Flexbox/Grid), and JavaScript (ES6+).

Backend: Node.js and Express.js for RESTful API development.

Database: MongoDB Atlas for cloud-based NoSQL data storage.

Security: JWT for session management and Bcrypt for sensitive data encryption.

Deployment: Frontend hosted on Netlify and Backend hosted on Render.

Why This Project?
This project was built to master the complexities of state management, asynchronous API calls, and relational data mapping (linking posts to specific users). It reflects a real-world production environment where security and data integrity are top priorities.
