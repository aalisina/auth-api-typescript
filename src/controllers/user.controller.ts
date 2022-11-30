import { Request, Response } from "express";
import { CreateUserInput, VerifyUserInput } from "../schemas/user.schema";
import {
  createUser,
  deleteUserById,
  findUserById,
} from "../services/user.service";
import log from "../utils/logger";
import sendEmail from "../utils/mailer";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);

    try {
      await sendEmail({
        from: "test@test.com",
        to: user.email,
        subject: "Please verify your account",
        text: `Verification code: ${user.verificationCode} Id: ${user._id}`,
      });
      return res.send("User successfully created"); // status will default to 200
    } catch (err) {
      // await delete user, otherwise user will be in the database that didn't get an email
      await deleteUserById(user._id);
      log.error(err);
      return res.status(400).send("User could not be created. Email not sent.");
    }
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).send("Account already exists.");
    }
    return res.status(500).send(err);
  }
}
export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  const { id, verificationCode } = req.params;

  // find the user by id
  const msg = "Could not verify user.";
  const user = await findUserById(id);
  if (!user) {
    return res.send(msg);
  }
  // check to see if they are already verified
  if (user.verified) {
    return res.send("User is already verified. ");
  }
  // check whether verification code is correct
  if (user.verificationCode === verificationCode) {
    user.verified = true;
    await user.save();
    res.send("User successfully verified.");
  }
  // Verification code incorrect
  return res.send(msg);
}
