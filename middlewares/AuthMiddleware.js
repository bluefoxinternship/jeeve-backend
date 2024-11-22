const jwt = require("jsonwebtoken");
require("dotenv").config();

function getToken(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}

const user = (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(403).json({
      message: "Unauthorized Access! Please Login to continue",
      success: false,
    });
  }

  jwt.verify(token, process.env.SECRET_KEY ?? '', async function (err, decoded) {
    if (err) {
      console.log(err)
      return res.status(403).json({
        message: "Invalid Token",
        success: false,
      });
    } else {
      req.user_id = decoded.id;
      // req.email = decoded.email
      // req.name = decoded.name
      next();
    }
  });
};

module.exports = { user }