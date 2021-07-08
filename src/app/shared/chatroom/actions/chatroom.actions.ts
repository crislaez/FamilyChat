import { createAction, props, union} from '@ngrx/store';
import { Chatroom } from '../models';

export const loadChatrooms = createAction('[Chatroom] Load Chatrooms');
export const saveChatrooms = createAction('[Chatroom] Save Chatrooms', props<{chatrooms: Chatroom[]}>());

export const loadChatroom = createAction('[Chatroom] Load Chatroom', props<{key: string}>());
export const saveChatroom = createAction('[Chatroom] Save Chatroom', props<{chatroom: Chatroom}>());


const all = union({
  loadChatrooms,
  saveChatrooms,
  loadChatroom,
  saveChatroom
})

export type ChatroomsActionsUnion = typeof all;


