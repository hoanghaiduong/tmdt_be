import { HttpStatus } from "@nestjs/common";
import { IError } from "../interface";



type ErrorFactory = (status: HttpStatus, message?: string) => IError;

const errorFactory: ErrorFactory = (status: HttpStatus, message?: string) => ({
  code: message?.toUpperCase().replace(/ /g, "_"),
  message,
  status
});
export const ErrorMessages = {
  REFRESH_TOKEN_INVALID: errorFactory(HttpStatus.UNAUTHORIZED, "Refresh token invalid"),
  REFRESH_TOKEN_EXPIRED: errorFactory(HttpStatus.UNAUTHORIZED, "Refresh token expired"),
  INVALID_TOKEN: errorFactory(HttpStatus.UNAUTHORIZED, "Invalid token"),
  TOKEN_EXPIRED: errorFactory(HttpStatus.UNAUTHORIZED, "Token expired"),
  USER_ALREADY_EXIST: errorFactory(HttpStatus.BAD_REQUEST, "User already exist"),
  USER_NOT_FOUND: errorFactory(HttpStatus.BAD_REQUEST, "User not found"),
  USER_LOCKED: errorFactory(HttpStatus.BAD_REQUEST, "User IS LOCKED"),
  EMAIL_ALREADY_EXIST: errorFactory(HttpStatus.CONFLICT, "Email already exist"),
  PHONE_NUMBER_ALREADY_EXIST: errorFactory(HttpStatus.CONFLICT, "Phone number already exist"),
  INVALID_UUID: errorFactory(HttpStatus.BAD_REQUEST, "Invalid UUID"),
  CANNOT_DELETE_ADMIN: errorFactory(HttpStatus.BAD_REQUEST, "Cannot delete admin"),
  CANNOT_UPDATE_ADMIN: errorFactory(HttpStatus.BAD_REQUEST, "Cannot update admin"),
};
