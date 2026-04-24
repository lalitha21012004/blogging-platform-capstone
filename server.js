const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config(); 

// Middleware
app.use(cors());
app.use(express.json());        

//Database connection
mongoose.connect(process.env.MONGODB_URI)
.then(()=> console.log("MongoDB Connected Successfully.."))
.catch((err)=>console.log("MongoDB not Connected", err));


// 3. Import Routes (You will create these files next)
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

// 4. Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// 5. Basic Health Check Route
app.get('/', (req, res) => {
  res.send("Blogging Platform API is running...");
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});