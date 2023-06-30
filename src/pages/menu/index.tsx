import { IFood, IMenu } from '@/models/models'
import {
  fetchFoods,
  fetchFoodsByMenuId,
  fetchMenus,
} from '@/services/publicApi'
import FoodInMenu from '@/components/menus/FoodInMenu'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import { tabsClasses } from '@mui/material/Tabs'
import { GetServerSideProps } from 'next'
import { Fragment, useState } from 'react'
import {
  BrunchDining,
  Icecream,
  KebabDining,
  LocalBar,
  LocalDining,
  LocalPizza,
} from '@mui/icons-material'
import PageTitle from '@/components/PageTitle/PageTitle'

interface MenuProps {
  menus: IMenu[]
  foods: IFood[]
  foodsInMenus: IFood[][]
}

export const getServerSideProps: GetServerSideProps = async () => {
  const menus: IMenu[] = await fetchMenus()
  const foods: IFood[] = await fetchFoods()

  const foodsInMenus: IFood[][] = await Promise.all(
    menus.map(async (menu) => {
      const foodsInMenu = await fetchFoodsByMenuId(menu.id)
      return foodsInMenu
    })
  )

  return { props: { menus, foods, foodsInMenus } }
}

const MenuPage = ({ menus, foods, foodsInMenus }: MenuProps) => {
  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const iconList = [
    <KebabDining />,
    <BrunchDining />,
    <Icecream />,
    <LocalBar />,
    <LocalPizza />,
  ]

  return (
    <Box>
      <PageTitle title="Menu" />
      <Box
        sx={{
          flexGrow: 1,
          maxWidth: { xs: 320, sm: 480 },
          bgcolor: 'background.paper',
          margin: 'auto',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          aria-label="visible arrows tabs example"
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              '&.Mui-disabled': { opacity: 0.3 },
            },
          }}
          indicatorColor="secondary"
        >
          <Tab label="All food" icon={<LocalDining />} />
          {menus.map((menu) => (
            <Tab label={menu.name} key={menu.id} icon={iconList[menu.id - 1]} />
          ))}
        </Tabs>
      </Box>
      <Box
        sx={{
          display: value === 0 ? 'flex' : 'none',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'stretch',
          gridAutoRows: '1fr',
        }}
      >
        {foods.map((food) => (
          <FoodInMenu foodInMenu={food} key={food.id} />
        ))}
      </Box>
      {menus.map((menu, index) => (
        <Box
          key={menu.id}
          sx={{
            display: value === index + 1 ? 'flex' : 'none',
            flexWrap: 'wrap',
            alignItems: 'stretch',
            // gridAutoRows: '1fr',
          }}
        >
          {foodsInMenus[index].map((food) => {
            return <FoodInMenu foodInMenu={food} key={food.id} />
          })}
        </Box>
      ))}
    </Box>
  )
}

export default MenuPage
