export const ResponseHandler = (message = null, content = null) => {
  return {
    message,
    content,
  };
};

export const ErrorValidationHandler = (infos) => {
  const errors = infos.error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
  return {
    status: 400,
    errors,
  };
};
