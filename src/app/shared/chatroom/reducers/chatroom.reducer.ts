import { createReducer, on } from '@ngrx/store';
import { ChatroomActions } from '../actions';
import { Chatroom } from '../models';

// interface Status {
//   pending?: boolean;
//   error?: string;
// }

export interface State{
  chatrooms?: Chatroom[];
  chatroom?: Chatroom;
  pending?: boolean;
}

const initialState: State = {
  chatrooms:[],
  chatroom:null,
  pending: false,
}

const chatroomReducer = createReducer(
  initialState,
  on(ChatroomActions.loadChatrooms, (state) => ({...state, pending: true})),
  on(ChatroomActions.saveChatrooms, (state, { chatrooms }) => ({...state, chatrooms, pending: false })),

  on(ChatroomActions.loadChatroom, (state) => ({...state, pending: true})),
  on(ChatroomActions.saveChatroom, (state, { chatroom }) => ({...state, chatroom, pending: false })),

);

export function reducer(state: State | undefined, action: ChatroomActions.ChatroomsActionsUnion){
  return chatroomReducer(state, action);
}

export const getChatrooms = (state: State) => state?.chatrooms;

export const getChatroom = (state: State) => state?.chatroom;

export const getPending = (state: State) => state?.pending;


