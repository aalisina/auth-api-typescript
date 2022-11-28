export default {
  port: 3000,
  dbUri: "mongodb://localhost:27017/auth-api",
  logLevel: "info",
  smtp: {
    user: "icqskc5mxzf3bwct@ethereal.email",
    pass: "mVSU79SbF3WmvGqy4V",
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // set to true when deploy
  },
};
