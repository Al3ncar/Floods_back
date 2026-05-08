const authorizeHelper = (req, res, next) => {
  if (!req.user.can_help) {
    return res.status(403).json({
      message: "Você não pode se candidatar",
    });
  }

  next();
};

export default authorizeHelper;