import { ObjectSchema, ValidationResult } from 'joi';

export const validate = async <T>(validator: ObjectSchema<T>, object: any): Promise<ValidationResult<T>> => {
  return validator.validate(object, { abortEarly: false });
};
