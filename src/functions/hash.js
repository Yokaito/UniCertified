import bcrypt from "bcryptjs";

module.exports = () => {
  let date = new Date();
  let token = toString(
    Math.random() * (100000 - 1 + 1) + date.getMilliseconds()
  );
  var salt = bcrypt.genSaltSync(5);
  token = bcrypt.hashSync(token, salt);
  return token;
};
