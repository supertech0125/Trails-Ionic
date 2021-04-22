export interface UserLogin {
  userName: string;
  password: string;
  timeZone: string;
  lastLocalTimeLoggedIn: string;
}

export interface UserAccount {
  id: string;
  username: string;
  timeZone: string;
  token: string;
  refreshToken: string;
}

export interface UserRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserProfile {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role?: string;
}

export interface RefreshToken {
  token?: string;
  refreshToken?: string;
  timeZone?: string;
  lastLocalTimeLoggedIn?: string;
}

export interface Image {
  base64: 'string';
  fileName: 'string';
}

export interface UserUpdate {
  firstName: 'string';
  lastName: 'string';
  imageInfo?: Image;
}
