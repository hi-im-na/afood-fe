'use client'
import { IFood } from '@/models/models'
import capitalizeFirstLetter from '@/utils/capitalizeFirstLetter'
import { Box, Card, CardContent, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface FoodInMenuProps {
  foodInMenu: IFood
}

export default function FoodInMenu({ foodInMenu }: FoodInMenuProps) {
  const { data: session } = useSession()

  const theme = useTheme()

  return (
    <>
      <Box>
        <Card
          sx={{
            m: '1em',
            width: session ? '19em' : '20em',
            height: '38em',
            bgcolor: theme.palette.background.paper,
            position: 'relative',
          }}
        >
          <CardContent>
            <Typography
              variant="overline"
              sx={{ lineHeight: '1em', textAlign: 'center' }}
            >
              <h2>{capitalizeFirstLetter(foodInMenu.name)}</h2>
            </Typography>
            <Box>
              <Image
                src={'/images/' + foodInMenu.name + '.webp'}
                height={350}
                width={350}
                style={{
                  width: '100%',
                  maxHeight: '23em',
                  objectFit: 'cover',
                }}
                alt={foodInMenu.name}
                loading="lazy"
              />
            </Box>
            <Box
              sx={{
                height: '10em',
              }}
            >
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
              <Typography
                variant="h5"
                sx={{
                  position: 'absolute',
                  bottom: '1em',
                  right: '1em',
                }}
              >
                {foodInMenu.cost + ' $'}
                <br />
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}
