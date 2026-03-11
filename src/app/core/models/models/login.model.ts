export interface Login {
    userNameOrEmail: string;
    password: string
}

export interface LoggedInUserData {
  userId: number;
  fullName: string;
  userName: string;
  email: string;
  role: string;
  token: string;
  expiresAt: string;
}

export interface SuccessfulLogin {
  status: boolean;
  message: string;
  data: LoggedInUserData;
}