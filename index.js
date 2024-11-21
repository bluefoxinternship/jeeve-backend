require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const app = express();


connectDB();

// Middleware
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
