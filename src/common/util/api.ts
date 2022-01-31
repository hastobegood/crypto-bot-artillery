import { ValidationError } from 'joi';

interface ApiResponse {
  statusCode: number;
  body: string;
}

export const buildApiResponseFromValidationError = (validationError: ValidationError): ApiResponse => {
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: 'Bad request',
      details: validationError.details.map((detail) => ({
        message: detail.message,
      })),
    }),
  };
};

export const buildApiResponseFromData = (status: number, data: any): ApiResponse => {
  return {
    statusCode: status,
    body: JSON.stringify({
      data: data,
    }),
  };
};
