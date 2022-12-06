import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = (req.headers.authorization || "").replace(
    /^Bearer\s/,
    ""
  );

  if (!accessToken) {
    return next();
  }
  const decoded = verifyJwt(accessToken, "accessTokenPublicKey");

  if (decoded) {
    // means we have a user object
    res.locals.user = decoded;
    // return next(); // this next can be omitted
  }
  return next();
};

export default deserializeUser;
