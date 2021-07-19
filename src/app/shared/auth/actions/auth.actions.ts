import { createAction, props, union } from '@ngrx/store';
import { User } from '../models';

/* Login */
export const login = createAction('[Auth] Login', props<{ email: string, password: string }>());
export const loginSuccess = createAction('[Auth] Login success', props<{ user: User }>());
export const loginFailure = createAction('[Auth] Login failure', props<{ error: string }>());

/* Auto Login */
export const autologin = createAction('[Auth] Autologin');
export const autologinSuccess = createAction('[Auth] Autologin success', props<{ user: User }>());
export const autologinFailure = createAction('[Auth] Autologin failure', props<{ error: string }>());

/* AuRegister */
export const register = createAction('[Auth] Register', props<{ email: string, password: string, name: string }>());
export const registerSuccess = createAction('[Auth] Register success');
export const registerFailure = createAction('[Auth] Register failure', props<{ error: string }>());

/* Unsubscribe */
export const unsubscribe = createAction('[Auth] Unsubscribe', props<{ user: User }>());
export const unsubscribeSuccess = createAction('[Auth] Unsubscribe success');
export const unsubscribeFailure = createAction('[Auth] Unsubscribe failure', props<{ error: string }>());

/* LogOut */
export const logout = createAction('[Auth] Logout');
export const forceLogout = createAction('[Auth] Force logout');

/* AuRegister */
export const update = createAction('[Auth] Upadte', props<{ name: string, avatar: any }>());
export const updateSuccess = createAction('[Auth] Upadte success', props<{ message: string }>());
export const updateFailure = createAction('[Auth] Upadte failure', props<{ error: string }>());

/* Update Loger User */
export const updateUser = createAction('[Auth] Update user', props<{ user: User }>());

const all = union({
  login,
  loginFailure,
  loginSuccess,
  autologin,
  autologinSuccess,
  autologinFailure,
  register,
  registerSuccess,
  registerFailure,
  unsubscribe,
  unsubscribeSuccess,
  unsubscribeFailure,
  logout,
  forceLogout,
  update,
  updateSuccess,
  updateFailure,
  updateUser
});

export type AuthActionsUnion = typeof all;
