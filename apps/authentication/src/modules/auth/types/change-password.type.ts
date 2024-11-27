export interface IChangePassword {
  authenticationId: string;
  oldPassword: string;
  newPassword: string;
  retypeNewPassword: string;
}
