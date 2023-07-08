import { Box, Typography } from '@mui/material'

export default function Custom404() {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h1" color={"red"}>403 - Forbidden</Typography>
        <Typography variant="h4">
          You don&#39;t have permission to access this page.
        </Typography>
      </Box>
    </>
  )
}
