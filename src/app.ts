require("dotenv").config();
import express from "express";
import config from "config";

const app = express();

const port = config.get("port");

app.listen(() => {
  console.log(`App started at http://localhost:${port}`);
});
