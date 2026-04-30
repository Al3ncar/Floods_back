const validUserAndRequest = (req, res, next, schema) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      erro: error.details.map((e) => e.message),
    });
  }

  next();
};

export { validUserAndRequest };
