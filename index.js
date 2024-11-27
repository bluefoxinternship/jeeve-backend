import "dotenv/config";
import express from "express";
import connectDB from "./config/database.js";
import ProductRoute from "./routes/ProductRoute.js";
import categoryRouter from "./routes/Categories.js";
import PaymentRoute from "./routes/PaymentRoutes.js";
import cors from "cors";
import AuthRoute from "./routes/AuthRoutes.js";
import Cartroute from "./routes/CartRoute.js";
import searchRoutes from "./routes/SearchRoutes.js";
import UserRoute from "./routes/UserRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import brandRoute from "./routes/BrandRoutes.js";
//importing for bestseller---
import bestSellingRoutes from "./routes/bestSellingRoutes.js"

const app = express();
connectDB();
const apiRoute = "/api";

// Middleware
app.use(express.json());

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Hello!" });
});

// Routes
app.use(`${apiRoute}/v1`, [
  ProductRoute,
  AuthRoute,
  categoryRouter,
  Cartroute,
  PaymentRoute,
  searchRoutes,
  orderRoutes,
  brandRoute,
  bestSellingRoutes,
]);
app.use(`${apiRoute}/v1/user`, UserRoute);
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
