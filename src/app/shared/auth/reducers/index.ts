import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './auth.reducer';

export const authKey = 'auth';

export interface State {
  [authKey]: fromAuth.State
};


export const reducer = fromAuth.reducer;

export const getAuthState = createFeatureSelector<State, fromAuth.State>(authKey);


export const isLoginPending = createSelector(
  getAuthState,
  fromAuth.isLoginPending
);

export const getLoginStatusPending = createSelector(
  getAuthState,
  fromAuth.getLoginStatusPending
);

export const getUser = createSelector(
  getAuthState,
  fromAuth.getUser
);

export const getUserId = createSelector(
  getAuthState,
  fromAuth.getUserId
);


export const isLoggedIn = createSelector(
  getUser,
  (user) => !!user
  // || Object.keys(user || {})?.length > 0
);


