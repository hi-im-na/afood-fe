import { IStaffCreate } from './../models/models'
import { IStaff } from '@/models/models'
import axios from 'axios'
import { API_URL_ADMIN } from './api'
import convertFieldsToString from '@/utils/convertFieldsToString'

export const getAllStaffs = async (token: string) => {
  const res = await axios
    .get<IStaff[]>(`${API_URL_ADMIN}/staffs`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .catch((err) => {
      console.log(err)
      throw err
    })
  return res.data
}

export const createStaff = async (token: string, staff: IStaffCreate) => {
  const res = await axios
    .post<IStaff>(
      `${API_URL_ADMIN}/staffs/create`,
      new URLSearchParams({ ...staff }),
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .catch((err) => {
      console.log(err)
      throw err
    })
  return res.data
}

export const deleteStaffById = async (token: string, staffId: number) => {
  const res = await axios
    .delete<IStaff>(`${API_URL_ADMIN}/staffs/deleteById/${staffId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .catch((err) => {
      console.log(err)
      throw err
    })
  return res.data
}

export const deleteStaffByUsername = async (
  token: string,
  username: string
) => {
  const res = await axios
    .delete<IStaff>(`${API_URL_ADMIN}/staffs/deleteByUsername/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .catch((err) => {
      console.log(err)
      throw err
    })
  return res.data
}

export const updateStaff = async (token: string, staff: IStaff) => {
  const res = await axios
    .put<IStaff>(
      `${API_URL_ADMIN}/staffs/update`,
      new URLSearchParams(convertFieldsToString({ ...staff })),
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .catch((err) => {
      console.log(err)
      throw err
    })
  return res.data
}

export const updateStaffRoleByUsername = async (
  token: string,
  username: string,
  role: string
) => {
  const res = await axios
    .put<IStaff>(
      `${API_URL_ADMIN}/staffs/${username}/roleByUsername`,
      new URLSearchParams(role),
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .catch((err) => {
      console.log(err)
      throw err
    })
  return res.data
}

export const updateStaffRoleById = async (
  token: string,
  staffId: number,
  role: string
) => {
  const res = await axios
    .put<IStaff>(
      `${API_URL_ADMIN}/staffs/${staffId}/roleById`,
      new URLSearchParams(role),
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .catch((err) => {
      console.log(err)
      throw err
    })
  return res.data
}

export const updateStaffSalaryById = async (
  token: string,
  staffId: number,
  salary: number
) => {
  const res = await axios
    .put<IStaff>(
      `${API_URL_ADMIN}/staffs/${staffId}/salary`,
      new URLSearchParams({ salary: salary.toString() }),
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .catch((err) => {
      console.log(err)
      throw err
    })
  return res.data
}

export const getAllNgayCong = async (token: string) => {
  const res = await axios
    .get(`${API_URL_ADMIN}/ngaycong`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .catch((err) => {
      throw err
    })
  return res.data
}

export const getNgayCongByStaffId = async (token: string, staffId: string) => {
  const res = await axios
    .get(`${API_URL_ADMIN}/ngaycong/${staffId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .catch((err) => {
      throw err
    })
  return res.data
}

export const createNgayCong = async (
  token: string,
  staffId: string,
  workedDate: Date,
  timeWorked: number
) => {
  const res = await axios
    .post(
      `${API_URL_ADMIN}/ngaycong/create`,
      new URLSearchParams({
        staffId,
        workedDate: workedDate.toJSON(),
        timeWorked: timeWorked.toString(),
      }),
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .catch((err) => {
      console.log(workedDate)
      throw err
    })
  return res.data
}

export const deleteNgayCong = async (token: string, id: number) => {
  const res = await axios
    .delete(`${API_URL_ADMIN}/ngaycong/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .catch((err) => {
      throw err
    })
  return res.data
}

export const getTotalHoursWorkedAllTime = async (
  token: string,
  staffId: string
) => {
  const res = await axios
    .get(`${API_URL_ADMIN}/ngaycong/totalHoursWorkedAllTime/${staffId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .catch((err) => {
      throw err
    })
  return res.data
}

export const getTotalHoursWorkedAllTimeOfAllStaff = async (token: string) => {
  const res = await axios
    .get(`${API_URL_ADMIN}/ngaycong/totalHoursWorkedAllTimeOfAllStaff`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .catch((err) => {
      throw err
    })
  console.log(res.data)
  return res.data
}
