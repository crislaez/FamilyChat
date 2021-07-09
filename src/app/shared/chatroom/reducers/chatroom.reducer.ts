import { createReducer, on } from '@ngrx/store';
import { ChatroomActions } from '../actions';
import { Chatroom } from '../models';

interface Status {
  pending?: boolean;
  error?: string;
}

export interface State{
  chatrooms?: Chatroom[];
  chatroom?: Chatroom;
  pendingStatus?: Status;
  pending?: boolean;
}

const initialState: State = {
  chatrooms:[],
  chatroom:null,
  pendingStatus: {pending:false, error:''},
  pending: false,
}

const chatroomReducer = createReducer(
  initialState,
  on(ChatroomActions.loadChatrooms, (state) => ({...state, pending: true})),
  on(ChatroomActions.saveChatrooms, (state, { chatrooms }) => ({...state, chatrooms, pending: false })),

  on(ChatroomActions.loadChatroom, (state) => ({...state, pending: true})),
  on(ChatroomActions.saveChatroom, (state, { chatroom }) => ({...state, chatroom, pending: false })),

  on(ChatroomActions.saveMessage, (state) => ({...state, pending: true, pendingStatus:{ pending: true}})),
  on(ChatroomActions.saveMessageFailure, (state, { error }) => ({...state, pending: false, pendingStatus:{ pending: false, error} })),
  on(ChatroomActions.saveMessageSuccess, (state) => ({...state, pending: false, pendingStatus:{ pending: false} })),

  on(ChatroomActions.deleteMessage, (state) => ({...state, pending: true, pendingStatus:{ pending: true}})),
  on(ChatroomActions.deleteMessageFailure, (state, { error }) => ({...state, pending: false, pendingStatus:{ pending: false, error} })),
  on(ChatroomActions.deleteMessageSuccess, (state) => ({...state, pending: false, pendingStatus:{ pending: false} })),

);

export function reducer(state: State | undefined, action: ChatroomActions.ChatroomsActionsUnion){
  return chatroomReducer(state, action);
}

export const getChatrooms = (state: State) => state?.chatrooms;

export const getChatroom = (state: State) => state?.chatroom;

export const getPending = (state: State) => state?.pending;

export const getPendingStatus = (state: State) => state?.pendingStatus?.pending;


