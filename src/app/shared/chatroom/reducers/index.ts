import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromChatroom from './chatroom.reducer';

export const chatroomKey = 'chatroom';

export interface State {
  [chatroomKey]: fromChatroom.State
}

export const reducer = fromChatroom.reducer;

export const getChatroomState = createFeatureSelector<State, fromChatroom.State>(chatroomKey);


export const getChatrooms = createSelector(
  getChatroomState,
  fromChatroom.getChatrooms
);

export const getChatroom = createSelector(
  getChatroomState,
  fromChatroom.getChatroom
);

export const getPending = createSelector(
  getChatroomState,
  fromChatroom.getPending
);

export const getPendingStatus = createSelector(
  getChatroomState,
  fromChatroom.getPendingStatus
);

export const getStatusChatrooms = createSelector(
  getChatroomState,
  fromChatroom.getStatusChatrooms
);

export const getStatusChatroom = createSelector(
  getChatroomState,
  fromChatroom.getStatusChatroom
);

