import loginController from './controllers/login';
import signupController from './controllers/signup';
import confirmEmailController from './controllers/confirmEmail';
import resendConfirmTokenController from './controllers/resendConfirmToken';

import forgotPasswordController from './controllers/forgotPassword';
import resetPasswordController from './controllers/resetPassword';
import updatePasswordController from './controllers/updatePassword';

import logoutController from './controllers/logout';

export const login = loginController;
export const signup = signupController;
export const confirmEmail = confirmEmailController;
export const resendConfirmToken = resendConfirmTokenController;
export const forgotPassword = forgotPasswordController;
export const resetPassword = resetPasswordController;
export const updatePassword = updatePasswordController;
export const logout = logoutController;
