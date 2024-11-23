import "dotenv/config";
import express from "express";
import connectDB from "./config/database.js"; 
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoutes.js";
import PaymentRoute from "./routes/paymentRoutes.js"; 

const app = express();
connectDB();

// Middleware
app.use(express.json());

// Default route
app.get("/", (req, res) => {
    res.json({ message: "Hello!" });
});

// Routes
app.use(ProductRoute);
app.use(AuthRoute);
app.use(PaymentRoute); 

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


