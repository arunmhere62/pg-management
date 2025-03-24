import { NextResponse } from 'next/server';
class AppError extends Error {
  status: number;
  errorCode: string;

  constructor(message: string, status: number, errorCode: string) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict detected') {
    super(message, 409, 'CONFLICT_ERROR');
  }
}
class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400, 'BAD_REQUEST');
  }
}
class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

class ForbiddenError extends AppError {
  constructor(
    message = 'Forbidden: You do not have permission to perform this action'
  ) {
    super(message, 403, 'FORBIDDEN_ERROR');
  }
}

export {
  AppError,
  BadRequestError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  ForbiddenError
};

export const errorHandler = (error: any) => {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.errorCode },
      { status: error.status }
    );
  }
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
};
