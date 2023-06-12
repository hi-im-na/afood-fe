import { IMenu } from '@/models/IMenu'
import api from './api'
import useSWR from 'swr'
import { IFood } from '@/models/IFood'

export const fetchMenus = async (): Promise<IMenu[]> => {
  const response = await api.get<IMenu[]>('/api/public/menus')
  return response.data
}

export const fetchFoodsByMenuId = async (menuId: number): Promise<IFood[]> => {
  const response = await api.get<IFood[]>(
    `/api/public/foods/findfoodsbymenuid?menuId=${menuId}`,
  )
  return response.data
}
