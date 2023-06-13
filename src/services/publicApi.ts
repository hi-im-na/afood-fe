import { IFood, IMenu, ITableArea, ITableRestaurant } from '@/models/models'
import api from './api'

export const fetchMenus = async (): Promise<IMenu[]> => {
  const response = await api.get<IMenu[]>('/api/public/menus')
  return response.data
}

export const fetchFoods = async (): Promise<IFood[]> => {
  const response = await api.get<IFood[]>('/api/public/foods')
  return response.data
}

export const fetchFoodsByMenuId = async (menuId: number): Promise<IFood[]> => {
  const response = await api.get<IFood[]>(
    `/api/public/foods/findfoodsbymenuid?menuId=${menuId}`
  )
  return response.data
}

export const fetchTableAreas = async (): Promise<ITableArea[]> => {
  const response = await api.get<ITableArea[]>('/api/public/tableareas')
  return response.data
}

export const fetchTables = async (): Promise<ITableRestaurant[]> => {
  const response = await api.get<ITableRestaurant[]>('/api/public/tables')
  return response.data
}
