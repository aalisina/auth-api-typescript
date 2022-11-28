import { prop } from "@typegoose/typegoose";

export class User {
  // inside prop mongoose options
  @prop({ lowercase: true, required: true, unique: true })
  email: string;
}
