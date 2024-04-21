export interface UserDto {
  uuid: string;
  name: string;
  email: string;
  password: string;
  jti?: string;
  lastLogin?: string;
}

export interface LoginData {
  jti?: string;
  lastLogin?: string;
}
