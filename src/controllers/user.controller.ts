import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from "../schemas/user.schema";
import {
  createUser,
  deleteUserById,
  findUserByEmail,
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

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) {
  const msg =
    "If a user with this email is registered, you will receive a password reset email";
  const { email } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    log.debug(`User with email ${email} does not exist`);
    return res.send(msg);
  }
  if (!user.verified) {
    return res.send("User is not verified.");
  }

  const passwordResetCode = uuidv4();

  user.passwordResetCode = passwordResetCode;
  await user.save();

  await sendEmail({
    from: "test@test.com",
    to: user.email,
    subject: "Password reset code",
    text: `Password reset code: ${passwordResetCode} Id: ${user._id}`,
  });
  log.debug("Password reset email sent to user.");
  return res.send(msg);
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
  res: Response
) {
  const { id, passwordResetCode } = req.params;

  const { password } = req.body;

  const user = await findUserById(id);

  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    res.status(400).send("Could not reset user password.");
  }

  user.passwordResetCode = null;
  user.password = password;
  await user.save();

  return res.send("Updated password.");
}
