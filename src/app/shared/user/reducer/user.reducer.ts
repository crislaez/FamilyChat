import { createReducer, on } from '@ngrx/store';
import { UserActions } from '../actions';
import { User } from '../models';


export interface State{
  users?: User[];
  pending?: boolean;
  status?: string;
}

const initialState: State = {
  users:[],
  pending: false,
  status: 'success'
}

const jobReducer = createReducer(
  initialState,
  on(UserActions.loadUsers, (state) => ({...state, pending: true})),
  on(UserActions.saveUsers, (state, { users, status }) => ({...state, users, pending: false, status })),
);

export function reducer(state: State | undefined, action: UserActions.UsersActionsUnion){
  return jobReducer(state, action);
}

export const getUsers = (state: State) => state?.users;
export const getPending = (state: State) => state?.pending;
export const getStatus = (state: State) => state?.status;

