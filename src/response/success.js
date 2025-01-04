class SuccessResponse {
  constructor(message, metadata, statusCode) {
    this.message = message;
    this.metadata = metadata;
    this.statusCode = statusCode;
  }

  send(res) {
    res.json({
      message: this.message,
      metadata: this.metadata,
      statusCode: this.statusCode,
    });
  }
}

class OKResponse extends SuccessResponse {
  constructor({ message = "OK", metadata = {}, statusCode = 200 }) {
    super(message, metadata, statusCode);
  }
}

class CreatedResponse extends SuccessResponse {
  constructor({ message = "Created!", metadata = {}, statusCode = 201 }) {
    super(message, metadata, statusCode);
  }
}

module.exports = { OKResponse, CreatedResponse };
