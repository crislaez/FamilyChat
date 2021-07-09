import { createAction, props, union} from '@ngrx/store';
import { Chatroom } from '../models';

export const loadChatrooms = createAction('[Chatroom] Load Chatrooms');
export const saveChatrooms = createAction('[Chatroom] Save Chatrooms', props<{chatrooms: Chatroom[]}>());

export const loadChatroom = createAction('[Chatroom] Load Chatroom', props<{key: string}>());
export const saveChatroom = createAction('[Chatroom] Save Chatroom', props<{chatroom: Chatroom}>());

export const saveMessage = createAction('[Chatroom] Save Message', props<{message: any, key: string}>());
export const saveMessageFailure = createAction('[Chatroom] Save Message Failure', props<{error: string }>());
export const saveMessageSuccess = createAction('[Chatroom] Save Message Success', props<{key: string}>());

export const deleteMessage = createAction('[Chatroom] Delete Message', props<{messageKey: string, key: string}>());
export const deleteMessageFailure = createAction('[Chatroom] Delete Message Failure', props<{error: string }>());
export const deleteMessageSuccess = createAction('[Chatroom] Delete Message Success', props<{key: string}>());


const all = union({
  loadChatrooms,
  saveChatrooms,
  loadChatroom,
  saveChatroom,
  saveMessage,
  saveMessageFailure,
  saveMessageSuccess,
  deleteMessage,
  deleteMessageFailure,
  deleteMessageSuccess
})

export type ChatroomsActionsUnion = typeof all;


