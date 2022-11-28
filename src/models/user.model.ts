import { getModelForClass, prop } from "@typegoose/typegoose";
import { nanoid } from "nanoid";

export class User {
  // inside prop mongoose options
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: () => nanoid() })
  verificationCode: string;

  @prop()
  passwordResetCode: string;

  @prop({ default: false })
  verified: boolean;
}

const UserModel = getModelForClass(User);

export default UserModel;
