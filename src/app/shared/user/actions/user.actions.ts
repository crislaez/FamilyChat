import { createAction, props, union} from '@ngrx/store';
import { User } from '../models';

export const loadUsers = createAction('[User] Load Users');
export const saveUsers = createAction('[JUserob] Save Users', props<{users: User[], status?: string}>());


const all = union({
  loadUsers,
  saveUsers
})

export type UsersActionsUnion = typeof all;


