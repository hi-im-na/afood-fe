import { IDrawerContext, Props } from '@/utils/interfaces'
import { ReactNode, createContext, useContext, useState } from 'react'

// context

const drawerContextDefault: IDrawerContext = {
  isOpen: true,
}

const DrawerContext = createContext<IDrawerContext>(drawerContextDefault)

export const useDrawer = () => useContext(DrawerContext)

export const DrawerProvider = ({ children }: Props) => {
  const [open, setOpen] = useState<boolean>(drawerContextDefault.isOpen)

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const value: IDrawerContext = { isOpen: open, toggleDrawer }

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  )
}
