import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import { User } from '../models';

interface Status {
  pending?: boolean;
  error?: string;
}

export interface State {
  loginStatus?: Status;
  pending? :boolean,
  user?: User;
}

const initialState: State = {
  loginStatus: {
    pending: false,
    error:''
  },
  user: null
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.login, AuthActions.autologin,  state => ({ ...state, loginStatus:{pending: true}  })),
  on(AuthActions.loginSuccess, AuthActions.autologinSuccess, (state, { user }) => ({ ...state, loginStatus:{pending: false} , user })),
  on(AuthActions.loginFailure, AuthActions.autologinFailure, (state, { error }) => ({ ...state, loginStatus:{pending: false, error} })),

  on(AuthActions.register,  state => ({ ...state, loginStatus:{pending: true} })),
  on(AuthActions.registerSuccess, (state) => ({ ...state, loginStatus:{pending: false} })),
  on(AuthActions.registerFailure, (state, { error }) => ({ ...state, pending: false, loginStatus:{pending: false, error} })),

  on(AuthActions.logout, AuthActions.forceLogout,  state => ({ ...state, user: null })),

);

export function reducer(state: State | undefined, action: AuthActions.AuthActionsUnion) {
  return authReducer(state, action);
}

// export const isLoginPending = (state: State) => !!state?.loginStatus?.pending;
export const isLoginPending = (state: State) => state?.loginStatus?.pending;

export const getUser = (state: State) => state?.user;

export const getUserId = (state: State) => state?.user?.$key;

export const getLoginStatusPending = (state: State) => state?.loginStatus?.pending;


