import Menus from '@/components/menus/Menus'
import { IMenu } from '@/models/IMenu'
import { fetchMenus } from '@/services/publicApi'
import { Box } from '@mui/material'
import { GetServerSideProps } from 'next'
import useSWR from 'swr'

interface MenuProps {
  menus: IMenu[]
}

export const getServerSideProps: GetServerSideProps = async () => {
  const menus = await fetchMenus()

  return { props: { menus } }
}

const Menu = ({ menus }: MenuProps) => {
  // const Menu = () => {
  // const { data: menus, error } = useSWR('/api/menus', fetchMenus)
  // if (error) return <div>failed to load</div>
  // if (!menus) return <div>loading...</div>
  // return <div>hello {menus}!</div>
  // console.log(menus)
  return (
    <Box>
      <Menus menus={menus}></Menus>
    </Box>
  )
}

export default Menu
