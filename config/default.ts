export default {
  port: 3000,
  dbUri: "mongodb://localhost:27017/auth-api",
  logLevel: "info",
  accessTokenPrivateKey: "",
  refreshTokenPrivateKey: "",

  smtp: {
    user: "a5svnklpvm25d34x@ethereal.email",
    pass: "bPy2rasppnKK6Sux1N",
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // set to true when deploy
  },
};
