class ErrorRepsonse extends Error {
  constructor(message, errors, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

class BadRequest extends ErrorRepsonse {
  constructor(message = "Bad Request", errors = [], statusCode = 400) {
    super(message, errors, statusCode);
  }
}

class NotFound extends ErrorRepsonse {
  constructor(message = "NotFound", errors = [], statusCode = 404) {
    super(message, errors, statusCode);
  }
}

class UnAuthorized extends ErrorRepsonse {
  constructor(message = "UnAuthorized", errors = [], statusCode = 401) {
    super(message, errors, statusCode);
  }
}

class Forbidden extends ErrorRepsonse {
  constructor(message = "Forbidden", errors = [], statusCode = 403) {
    super(message, errors, statusCode);
  }
}

module.exports = {
  BadRequest,
  NotFound,
  UnAuthorized,
  Forbidden,
};
