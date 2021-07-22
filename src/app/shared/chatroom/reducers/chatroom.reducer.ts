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
  statusChatrooms?: string;
  statusChatroom?: string;
}

const initialState: State = {
  chatrooms:[],
  chatroom:null,
  pendingStatus: {pending:false, error:''},
  pending: false,
  statusChatrooms: 'success',
  statusChatroom: 'success'
}

const chatroomReducer = createReducer(
  initialState,
  on(ChatroomActions.loadChatrooms, (state) => ({...state, pending: true})),
  on(ChatroomActions.saveChatrooms, (state, { chatrooms, statusChatrooms }) => ({...state, chatrooms, pending: false, statusChatrooms })),

  on(ChatroomActions.loadChatroom, (state) => ({...state, pending: true})),
  on(ChatroomActions.saveChatroom, (state, { chatroom, statusChatroom }) => ({...state, chatroom, pending: false, statusChatroom })),

  on(ChatroomActions.saveMessage, ChatroomActions.saveAudioMessageFailure, ChatroomActions.savePhotoMessage, (state) => ({...state, pendingStatus:{ pending: true}})),
  on(ChatroomActions.saveMessageFailure, ChatroomActions.saveAudioMessageFailure, ChatroomActions.savePhotoMessageFailure, (state, { error }) => ({...state,  pendingStatus:{ pending: false, error} })),
  on(ChatroomActions.saveMessageSuccess, ChatroomActions.saveAudioMessageSuccess, ChatroomActions.savePhotoMessageSuccess, (state) => ({...state, pendingStatus:{ pending: false} })),

  on(ChatroomActions.deleteMessage, (state) => ({...state, pendingStatus:{ pending: true}})),
  on(ChatroomActions.deleteMessageFailure, (state, { error }) => ({...state, pendingStatus:{ pending: false, error} })),
  on(ChatroomActions.deleteMessageSuccess, (state) => ({...state, pendingStatus:{ pending: false} })),

);

export function reducer(state: State | undefined, action: ChatroomActions.ChatroomsActionsUnion){
  return chatroomReducer(state, action);
}

export const getChatrooms = (state: State) => state?.chatrooms;
export const getChatroom = (state: State) => state?.chatroom;
export const getPending = (state: State) => state?.pending;
export const getPendingStatus = (state: State) => state?.pendingStatus?.pending;
export const getStatusChatrooms = (state: State) => state?.statusChatrooms;
export const getStatusChatroom = (state: State) => state?.statusChatroom;
