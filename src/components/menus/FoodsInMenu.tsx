import { IFood } from '@/models/IFood'
import FoodInMenu from './FoodInMenu'
import { Box, Paper } from '@mui/material'

interface FoodsInMenuProps {
  foodsInMenu: IFood[]
}

export default function FoodsInMenu({ foodsInMenu }: FoodsInMenuProps) {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {foodsInMenu.map((food) => (
          <Paper key={food.id}>
            <FoodInMenu foodInMenu={food} />
          </Paper>
        ))}
      </Box>
    </>
  )
}
