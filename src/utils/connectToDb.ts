import mongoose from "mongoose";
import config from "config";

async function connectToDB() {
  const dbUri = config.get<string>("dbUri");

  try {
    await mongoose.connect(dbUri);
    console.log("Connected to DB");
  } catch (e) {
    process.exit(1);
  }
}

export default connectToDB;
