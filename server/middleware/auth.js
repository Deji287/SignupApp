import jwt from "jsonwebtoken";
import ENV from "../config.js";
export default async function (req, res, next) {
  try {
    //access authentication header to validate request
    const token = req.headers.authorization.split(" ")[1];

    //retrieve the user detail for the logged in user
    const decodeToken = await jwt.verify(token, ENV.JWT_SECRET);

    req.user = decodeToken;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication Failed" });
  }
}

export function localVariables(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}
