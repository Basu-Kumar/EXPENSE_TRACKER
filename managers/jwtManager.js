const jsonwebtoken = require("jsonwebtoken");
const jwtManager = (user) => {
  // we are creating jsonwebtoken separately so as to remove code redundancy(centralising jwt signing)
  const accesstoken = jsonwebtoken.sign(
    {
      _id: user._id,
      name: user.name, // the second parameter is secret key for verifying the user
    },
    process.env.jwt_salt
  );

  return accesstoken;
};

module.exports = jwtManager;
