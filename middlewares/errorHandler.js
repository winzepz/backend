module.exports = (err, req, res, next) => {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((error) => ({
        field: error.path,
        message: error.message,
      }));
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }
  
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message || err,
    });
  };
  