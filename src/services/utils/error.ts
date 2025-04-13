import { NextResponse } from 'next/server';

class AppError extends Error {
  status: number;
  errorCode: string;
  cause?: unknown;

  constructor(
    message: string,
    status: number,
    errorCode: string,
    cause?: unknown
  ) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400, 'BAD_REQUEST');
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden: You do not have permission') {
    super(message, 403, 'FORBIDDEN');
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict detected') {
    super(message, 409, 'CONFLICT');
  }
}

class UnprocessableEntityError extends AppError {
  constructor(message = 'Unprocessable entity') {
    super(message, 422, 'UNPROCESSABLE_ENTITY');
  }
}

class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
  }
}

export {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  InternalServerError
};

export const errorHandler = (error: any) => {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.errorCode },
      { status: error.status }
    );
  }

  console.error('Unhandled Error:', error);

  return NextResponse.json(
    {
      error: 'Internal Server Error',
      details: error?.message || 'Unknown error occurred'
    },
    { status: 500 }
  );
};
