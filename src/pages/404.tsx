import { Box, Typography } from '@mui/material'

export default function Custom404() {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h1" color={'red'}>
          404 - Page Not Found
        </Typography>
      </Box>
    </>
  )
}
