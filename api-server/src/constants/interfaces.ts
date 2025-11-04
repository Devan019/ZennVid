export interface IUser {
  email: string,
  password: string,
  provider: string,
  username: string,
}

export interface ISendResponse {
  status: number,
  message: string,
  success: boolean,
  data: any
}
