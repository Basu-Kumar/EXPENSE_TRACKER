const errorhandler = (error, req, res, next) => {
  if (error) {
    if (error.message) {
      res.status(400).json({
        status: "failed",
        message: error.message,
      });
    } else {
      if (error.message) {
        res.status(400).json({
          status: "failed",
          message: error,
        });
      }
    }
  } else {
    next();
  }
};

module.exports = errorhandler;
