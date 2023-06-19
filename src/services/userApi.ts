import { IStaff } from '@/models/models'
import api, { apiFormData } from './api'
import { ILoginJWTResponse } from '@/models/responses'

export const postLogin = async (
  username: string,
  password: string
): Promise<ILoginJWTResponse> => {
  const res = await apiFormData
    .post<ILoginJWTResponse>(
      '/api/auth/login',
      new URLSearchParams({
        username,
        password,
      })
    )
    .catch((err) => {
      console.log(err)
      return err
    })
  return res.data
}

export const fetchSelf = async (token: string): Promise<IStaff> => {
  const res = await api
    .get<IStaff>('/api/account/whoiam', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .catch((err) => {
      console.log(err)
      return err
    })
  return res.data
}
