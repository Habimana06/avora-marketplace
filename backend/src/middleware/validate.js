export function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      return res.status(400).json({
        error: 'Validation failed',
        details: err.errors?.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }
  };
}

export function validateQuery(schema) {
  return (req, res, next) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (err) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        details: err.errors?.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }
  };
}
