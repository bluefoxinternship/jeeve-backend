import jwt from "jsonwebtoken"
import 'dotenv/config';

function getToken(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}

export const user = (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access! Please login to continue.",
    });
  }

  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    console.error("JWT Secret Key is not defined in the environment variables.");
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error("JWT Error:", err.message);
      const message =
        err.name === "TokenExpiredError"
          ? "Session expired. Please login again."
          : "Invalid token. Please login again.";

      return res.status(403).json({
        success: false,
        message,
      });
    }

    // Attach user information to the request
    req.user = {
      id: decoded.id,
      // email: decoded.email, // Add these if they exist in your token payload
      // name: decoded.name,
    };

    next();
  });
};