export interface UserDg {
  id?: number;
  username: string;
  name: string;
  surname: string;
  email: string;
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  password?: string;
}
