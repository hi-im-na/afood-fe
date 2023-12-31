import { ReactNode } from 'react'

export type Props = {
  children: ReactNode
}

export interface IDrawerContext {
  isOpen: boolean
  toggleDrawer?: () => void
}

export type AuthContextType = {
  user: boolean
  login?: () => void
  logout?: () => void
}

export type IColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'warning'
  | 'info'
  | 'success'
  | ''
