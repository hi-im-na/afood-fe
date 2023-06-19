import { IFood, IOrder, IOrderFood } from '@/models/models'
import axios from 'axios'
import { API_URL_MANAGER } from './api'

// export const postLogin = async (
//   username: string,
//   password: string
// ): Promise<ILoginJWTResponse> => {
//   const res = await apiFormData
//     .post<ILoginJWTResponse>(
//       '/api/auth/login',
//       new URLSearchParams({
//         username,
//         password,
//       })
//     )
//     .catch((err) => {
//       console.log(err)
//       return err
//     })
//   return res.data
// }

export const fetchOrders = async (token: string) => {
  const res = await axios
    .get<IOrder[]>(`${API_URL_MANAGER}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .catch((err) => {
      console.log(err)
      return err
    })
  return res.data
}

export const putOrderStatus = async (
  orderId: string,
  status: string,
  token: string
) => {
  const res = await axios
    .put<IOrder>(
      `${API_URL_MANAGER}/orders/updatestatus`,
      new URLSearchParams({ orderId, status }),
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .catch((err) => {
      console.log(err)
      return err
    })
  return res.data
}

export const addFoodToOrder = async (
  orderId: string,
  foodId: string,
  quantity: string,
  token: string
) => {
  const res = await axios
    .post<IOrderFood>(
      `${API_URL_MANAGER}/orders/addfoodtoorder`,
      new URLSearchParams({ orderId, foodId, quantity }),
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .catch((err) => {
      console.log(err)
      return err
    })
  return res.data as IOrderFood
}

export const addOrder = async (
  staffId: string,
  tableSittingId: string,
  token: string
) => {
  const res = await axios
    .post<IOrder>(
      `${API_URL_MANAGER}/orders/addorder`,
      new URLSearchParams({ tableSittingId, staffId }),
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .catch((err) => {
      console.log(err)
      return err
    })
  return res.data as IOrder
}

export const fetchFoodsByOrderId = async (orderId: string, token: string) => {
  const res = await axios
    .get<IOrderFood[]>(
      `${API_URL_MANAGER}/foods/findfoodsbyorderid?orderId=${orderId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .catch((err) => {
      console.log(err)
      return err
    })
  return res.data as IFood[]
}

export const fetchOrderFoodByOrderId = async (orderId: string, token: string) => {
  const res = await axios
    .get<IOrderFood[]>(
      `${API_URL_MANAGER}/orderfood/findbyorderid?orderId=${orderId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .catch((err) => {
      console.log(err)
      return err
    })
  return res.data as IOrderFood[]
}
