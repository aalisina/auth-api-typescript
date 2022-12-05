// All the funcionalities for Google Oauth, FB etc go here and not in the user controller
import { Request, Response } from "express";
import { CreateSessionInput } from "../schemas/auth.schema";
import { findUserByEmail } from "../services/user.service";

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) {
  const msg = "Invalid email or password.";
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    return res.send(msg);
  }
  if (!user.verified) {
    return res.send("Please verify your email");
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return res.send(msg);
  }

  // when password is valid

  // sign an access token
  // sign a refresh token
  // send the tokens
}
