import { Request, Response } from "express";
import { CreateUserInput } from "../schemas/user.schema";
import { createUser, deleteUserById } from "../services/user.service";
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
