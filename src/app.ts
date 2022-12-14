require("dotenv").config();
import express from "express";
import config from "config";
import connectToDB from "./utils/connectToDb";
import log from "./utils/logger";
import router from "./routes";
import deserializeUser from "./middlewares/deserializeUser";

const app = express();

app.use(express.json());
app.use(deserializeUser); // must be above the router
app.use(router);
const port = config.get("port");

app.listen(port, () => {
  log.info(`App started at http://localhost:${port}`);
  connectToDB();
});
