import 'dotenv/config';
import express from 'express';
import connectDB from './config/database.js'; 
import ProductRoute from './routes/ProductRoute.js';
import categoryRouter from './routes/Categories.js ';

import AuthRoute from './routes/AuthRoutes.js';

const app = express();
connectDB();
const apiRoute = "/api";

// Middleware
app.use(express.json());

// Default route
app.get('/', (req, res) => {
    res.json({ message: 'Hello!' }); // Corrected syntax for the JSON response
});
app.use(ProductRoute)
app.use(categoryRouter)


// Routes
app.use(`${apiRoute}/v1`, [ProductRoute, AuthRoute]);

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
