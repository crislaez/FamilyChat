export interface Credentials {
  email?: string;
  password?: string;
  image?: string
}

export interface User {
  $key?: string;
  name?: string
  email?: string;
  ui?: string;
  // password?: string;
}

// export interface LoginApiResponse {
//   refresh_token?: string;
//   access_token?: string;
// }
