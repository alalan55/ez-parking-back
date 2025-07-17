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

export const ConvertMinutesToHoursFormated = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}minutos`;
};

export const ConvertMinutesToHours = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return { hours, mins };
};

export class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
