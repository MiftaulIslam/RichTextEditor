// httpStatus.ts

// Success Codes
export const OK = 200;
export const CREATED = 201;
export const ACCEPTED = 202;
export const NO_CONTENT = 204;

// Redirection Codes
export const MOVED_PERMANENTLY = 301;
export const FOUND = 302;
export const NOT_MODIFIED = 304;

// Client Error Codes
export const BAD_REQUEST = 400;
export const UNAUTHORIZED = 401;
export const FORBIDDEN = 403;
export const NOT_FOUND = 404;
export const METHOD_NOT_ALLOWED = 405;
export const CONFLICT = 409;
export const GONE = 410;
export const UNSUPPORTED_MEDIA_TYPE = 415;
export const UNPROCESSABLE_ENTITY = 422;
export const TOO_MANY_REQUESTS = 429;

// Server Error Codes
export const INTERNAL_SERVER_ERROR = 500;
export const NOT_IMPLEMENTED = 501;
export const BAD_GATEWAY = 502;
export const SERVICE_UNAVAILABLE = 503;
export const GATEWAY_TIMEOUT = 504;
