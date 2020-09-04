require("dotenv").config();

module.exports = {
  service: process.env.NM_SERVICE,
  auth: {
    user: process.env.NM_USER,
    pass: process.env.NM_PASS,
  },
  logger: false,
  debug: false,
};
