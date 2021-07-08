export interface Chatroom {
  $key?: string;
  value?:{
    image: string;
    messages?: string;
    name?: string;
  }
}
