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
  create_at?: string
  avatar?: string;
  chats?:any;
  type?:any
}
