import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUser from './user.reducer';

export const userKey = 'user';

export interface State {
  [userKey]: fromUser.State
}

export const reducer = fromUser.reducer;

export const getUserState = createFeatureSelector<State, fromUser.State>(userKey);


export const getUsers = createSelector(
  getUserState,
  fromUser.getUsers
);

export const getPending = createSelector(
  getUserState,
  fromUser.getPending
);

export const getStatus = createSelector(
  getUserState,
  fromUser.getStatus
);

export const getJob = (ui:string) => createSelector(
  getUsers,
  (user) => {
    return (user || [])?.find((data) => data?.ui === ui) || {}
  }
);

