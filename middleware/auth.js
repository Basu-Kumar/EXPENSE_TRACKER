const jsonwebtoken = require("jsonwebtoken");

const auth = (req, res, next) => {
  //   console.log(req.headers);

  try {
    // accessing the token part only from headers(removing the appended bearer type)
    const accesstoken = req.headers.authorization.replace("Bearer ", "");
    // console.log(accessToken);

    const JWT_payload = jsonwebtoken.verify(accesstoken, process.env.jwt_salt); // verifies the access token

    req.user = JWT_payload; // passed to below functions , user is an object
  } catch (e) {
    res.status(401).json({
      status: "failed",
      message: "unauthorised",
    });
    return;
  }

  //   console.log(JWT_payload);

  // if we dont want it to call further simply throw an error
  /* again this is not working
  throw "can't do this now"; */
  //return res.status(400).json("can't do this now");

  next();
};

module.exports = auth;
