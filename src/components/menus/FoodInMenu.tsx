'use client'
import { IFood } from '@/models/models'
import capitalizeFirstLetter from '@/utils/capitalizeFirstLetter'
import {
  Box,
  Card,
  CardContent,
  Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Image from 'mui-image'

interface FoodInMenuProps {
  foodInMenu: IFood
}

export default function FoodInMenu({ foodInMenu }: FoodInMenuProps) {
  const theme = useTheme()
  return (
    <>
      <Box>
        <Card
          sx={{
            m: '1em',
            width: '25em',
            height: '42em',
            bgcolor: theme.palette.background.paper,
            // maxHeight: "45em",
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div" sx={{ lineHeight: 1 }}>
              <h2>{capitalizeFirstLetter(foodInMenu.name)}</h2>
            </Typography>
            <Box>
              <Image
                src={'/images/' + foodInMenu.name + '.webp'}
                showLoading
                height={350}
                width="100%"
              />
            </Box>
            <Typography
              sx={{ my: 1.5 }}
              color="text.secondary"
              fontWeight="bold"
            >
              Description
            </Typography>
            <Typography variant="body2">
              {foodInMenu.description}
              <br />
            </Typography>
            <Typography variant="h5" align="right">
              {foodInMenu.cost + ' $'}
              <br />
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}
