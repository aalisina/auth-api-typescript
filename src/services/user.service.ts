import UserModel, { User } from "../models/user.model";

export async function createUser(input: Partial<User>) {
  return UserModel.create(input);
}

export async function deleteUserById(userId: Partial<User>) {
  return UserModel.deleteOne({ _id: userId });
}

export async function findUserById(userId: string) {
  return UserModel.findById(userId);
}
