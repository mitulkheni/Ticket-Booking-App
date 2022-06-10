const isAdmin = async (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    return res.status(403).send("Only admins authorized");
  }
};

module.exports = isAdmin;