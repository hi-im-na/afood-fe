import Menus from '@/components/menus/Menus'
import { IMenu } from '@/models/models'
import { fetchMenus } from '@/services/publicApi'
import { Box, Typography } from '@mui/material'
import { GetServerSideProps } from 'next'

interface MenuProps {
  menus: IMenu[]
}

export const getServerSideProps: GetServerSideProps = async () => {
  const menus = await fetchMenus()

  return { props: { menus } }
}

const MenuPage = ({ menus }: MenuProps) => {
  // const Menu = () => {
  // const { data: menus, error } = useSWR('/api/menus', fetchMenus)
  // if (error) return <div>failed to load</div>
  // if (!menus) return <div>loading...</div>
  // return <div>hello {menus}!</div>
  // console.log(menus)
  return (
    <Box>
      <Typography
        variant="h2"
        textAlign="center"
        sx={{
          my: 2,
        }}
      >
        Menus
      </Typography>
      <Menus menus={menus}></Menus>
    </Box>
  )
}

export default MenuPage
