export const REMEMBER_ME: string = "rememberMe";

export const ACCESS_TOKEN: string = "accessToken";

export const REFRESH_TOKEN: string = "refreshToken";

export const HEADER_TOKEN: string = "Authorization";

export const server: string =
  process.env.NODE_ENV === "production"
    ? "http://192.168.1.8:8080"
    : // : 'http://34.92.177.122:8080';
      "http://localhost:8080";
