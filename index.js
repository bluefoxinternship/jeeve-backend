import 'dotenv/config';
import express from 'express';
import connectDB from './config/database.js'; 
import ProductRoute from './routes/ProductRoute.js';
import categoryRouter from './routes/Categories.js ';

const app = express();



connectDB();

// Middleware
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello!');
});
app.use(ProductRoute)
app.use(categoryRouter)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
